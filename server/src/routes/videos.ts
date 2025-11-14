import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAuth, AuthRequest } from '../middleware/auth.js';
import { UploadService } from '../services/upload.service.js';
import { VerificationService } from '../services/verification.service.js';
import { uploadInitSchema, sha256Schema } from '../utils/validation.js';
import { sha256Hash } from '../utils/crypto.js';
import { folder } from '../workers/video-processing.worker.js';

const router = express.Router();
const prisma = new PrismaClient();
const uploadService = new UploadService(prisma);
const verificationService = new VerificationService();

router.get('/', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const videos = await prisma.video.findMany({
      where: { uploaderId: req.user?.userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ error: null, data: videos });
  } catch (error) {
    console.error('List videos error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch videos', data: null });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
      include: { verifications: true },
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found', data: null });
    }

    return res.json({ error: null, data: video });
  } catch (error) {
    console.error('Get video error:', error);
    return res.status(500).json({ error: 'Failed to fetch video', data: null });
  }
});

router.post('/upload-init', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const validation = uploadInitSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', data: null });
    }

    const { filename, size, sha256 } = validation.data;

    const duplicate = await verificationService.checkDuplicate(sha256);
    if (duplicate.exists) {
      return res.json({
        error: null,
        data: { isDuplicate: true, existingVideoId: duplicate.videoId },
      });
    }

    const video = await prisma.video.create({
      data: {
        uploaderId: req.user?.userId!,
        originalName: filename,
        storageUrl: '',
        sha256,
      },
    });

    const uploadUrl = await uploadService.generatePresignedUrl(
      video.id,
      filename
    );

    return res.json({
      error: null,
      data: {
        videoId: video.id,
        uploadUrl,
      },
    });
  } catch (error) {
    console.error('Upload init error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to initialize upload', data: null });
  }
});

router.post(
  '/:id/upload-complete',
  verifyAuth,
  async (req: AuthRequest, res) => {
    try {
      const { expectedSha256 } = req.body;

      const sha256Validation = sha256Schema.safeParse(expectedSha256);
      if (!sha256Validation.success) {
        return res.status(400).json({ error: 'Invalid sha256', data: null });
      }

      const video = await prisma.video.findUnique({
        where: { id: req.params.id },
      });

      if (!video || video.uploaderId !== req.user?.userId) {
        return res.status(403).json({ error: 'Unauthorized', data: null });
      }

      const isValid = await uploadService.verifyFileHash(
        req.params.id,
        expectedSha256
      );
      if (!isValid) {
        return res.status(400).json({ error: 'Hash mismatch', data: null });
      }

      const dbxPath = `${folder}/videos/${req.params.id}/${video.originalName}`;
      const storageUrl = await uploadService.getSharedLink(dbxPath);

      const updatedVideo = await prisma.video.update({
        where: { id: req.params.id },
        data: { storageUrl },
      });

      await uploadService.processVideo(req.params.id);

      return res.json({ error: null, data: updatedVideo });
    } catch (error) {
      console.error('Upload complete error:', error);
      return res
        .status(500)
        .json({ error: 'Failed to complete upload', data: null });
    }
  }
);

router.post(
  '/:id/upload',
  verifyAuth,
  async (req: AuthRequest & { files?: any }, res) => {
    try {
      const file = req.files?.file;
      if (!file) {
        return res.status(400).json({ error: 'File required', data: null });
      }

      const video = await prisma.video.findUnique({
        where: { id: req.params.id },
      });
      if (!video || video.uploaderId !== req.user?.userId) {
        return res.status(403).json({ error: 'Unauthorized', data: null });
      }

      const fileBuffer = file.data;
      const sha256 = sha256Hash(fileBuffer);

      const storageUrl = await uploadService.uploadToDropbox(
        req.params.id,
        fileBuffer,
        file.name
      );

      const updated = await prisma.video.update({
        where: { id: req.params.id },
        data: { storageUrl, sha256 },
      });

      await uploadService.processVideo(req.params.id);

      return res.json({ error: null, data: updated });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Upload failed', data: null });
    }
  }
);

router.post('/verify-hash', async (req, res) => {
  try {
    const { sha256 } = req.body;

    const validation = sha256Schema.safeParse(sha256);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: 'Valid SHA256 hash required', data: null });
    }

    const video = await prisma.video.findUnique({
      where: { sha256 },
      include: {
        verifications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!video) {
      return res.json({
        error: null,
        data: {
          verified: false,
          video: null,
          verifications: [],
        },
      });
    }

    const verified = await verificationService.verifyVideoAuthenticity(
      video.id
    );

    return res.json({
      error: null,
      data: {
        verified,
        video: {
          id: video.id,
          originalName: video.originalName,
          storageUrl: video.storageUrl,
          sha256: video.sha256,
          verified: video.verified,
          verifiedAt: video.verifiedAt,
          verifiedBy: video.verifiedBy,
          uploaderId: video.uploaderId,
          createdAt: video.createdAt,
        },
        verifications: video.verifications,
      },
    });
  } catch (error) {
    console.error('Verify hash error:', error);
    return res.status(500).json({ error: 'Failed to verify hash', data: null });
  }
});

router.post('/check-duplicate', async (req, res) => {
  try {
    const { sha256 } = req.body;

    const validation = sha256Schema.safeParse(sha256);
    if (!validation.success) {
      return res.status(400).json({ error: 'SHA256 required', data: null });
    }

    const duplicate = await verificationService.checkDuplicate(sha256);

    return res.json({
      error: null,
      data: {
        isDuplicate: duplicate.exists,
        existingVideoId: duplicate.videoId,
      },
    });
  } catch (error) {
    console.error('Check duplicate error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to check duplicate', data: null });
  }
});

router.delete('/:id', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found', data: null });
    }

    if (video.uploaderId !== req.user?.userId) {
      return res.status(403).json({ error: 'Unauthorized', data: null });
    }

    await prisma.video.delete({
      where: { id: req.params.id },
    });

    return res.json({ error: null, data: { message: 'Video deleted' } });
  } catch (error) {
    console.error('Delete video error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to delete video', data: null });
  }
});

export { router as videoRoutes };
