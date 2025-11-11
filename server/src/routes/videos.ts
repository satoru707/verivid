import Express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAuth, type AuthRequest } from '../middleware/auth.js';
import { UploadService } from '../services/upload.service.js';
import { IPFSService } from '../services/ipfs.service.js';
import * as crypto from 'crypto';
import { fi } from 'zod/locales';

const router: Express.Router = Router();
const prisma = new PrismaClient();
const uploadService = new UploadService(prisma);
const ipfsService = new IPFSService();

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
    const { filename, mimeType, size } = req.body;

    if (!filename || !size) {
      return res
        .status(400)
        .json({ error: 'Filename and size required', data: null });
    }

    const existing = await prisma.video.findFirst({
      where: {
        originalName: filename,
        uploaderId: req.user?.userId,
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    const video = await prisma.video.create({
      data: {
        uploaderId: req.user?.userId!,
        originalName: filename,
        storageUrl: '',
        sha256: '',
      },
    });

    const uploadUrl = `${process.env.S3_BUCKET_URL || 'http://localhost:3001'}/api/videos/${video.id}/upload`;

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
      const { storageUrl, durationSec, width, height, ipfsCid } = req.body;

      const video = await prisma.video.update({
        where: { id: req.params.id },
        data: {
          storageUrl,
          ...(durationSec && { durationSec }),
          ...(width && { width }),
          ...(height && { height }),
          ...(ipfsCid && { ipfsCid }),
        },
      });

      await uploadService.processVideo(video.id);

      return res.json({ error: null, data: video });
    } catch (error) {
      console.error('Upload complete error:', error);
      return res
        .status(500)
        .json({ error: 'Failed to complete upload', data: null });
    }
  }
);

router.post('/:id/prepare-proof', async (req, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found', data: null });
    }

    const metadata = {
      title: video.originalName,
      sha256: video.sha256,
      ipfsUri: video.ipfsCid ? `ipfs://${video.ipfsCid}` : null,
      timestamp: video.createdAt.toISOString(),
    };

    return res.json({
      error: null,
      data: {
        videoId: video.id,
        proofHash: video.sha256,
        metadataUri: `ipfs://metadata-${video.id}`,
        metadata,
      },
    });
  } catch (error) {
    console.error('Prepare proof error:', error);
    return res.status(500).json({
      error: 'Failed to prepare proof',
      data: null,
    });
  }
});

router.post('/:id/confirm-proof', async (req, res) => {
  try {
    const { txHash, proofHash, metadataUri, signer } = req.body;

    if (!txHash || !proofHash || !signer) {
      return res.status(400).json({
        error: 'Missing verification data',
        data: null,
      });
    }

    const verification = await prisma.verification.create({
      data: {
        videoId: req.params.id,
        txHash,
        proofHash,
        metadataUri,
        signer,
        chain: 'ethereum:1',
      },
    });

    await prisma.video.update({
      where: { id: req.params.id },
      data: {
        verified: true,
        verifiedAt: new Date(),
        verifiedBy: signer,
      },
    });

    return res.json({
      error: null,
      data: verification,
    });
  } catch (error) {
    console.error('Confirm proof error:', error);
    return res.status(500).json({
      error: 'Failed to confirm proof',
      data: null,
    });
  }
});

router.get('/:id/verifications', async (req, res) => {
  try {
    const verifications = await prisma.verification.findMany({
      where: { videoId: req.params.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ error: null, data: verifications });
  } catch (error) {
    console.error('Get verifications error:', error);
    return res.status(500).json({
      error: 'Failed to fetch verifications',
      data: null,
    });
  }
});

router.post('/verify-hash', async (req, res) => {
  try {
    const { sha256 } = req.body;

    if (!sha256 || typeof sha256 !== 'string') {
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

    return res.json({
      error: null,
      data: {
        verified: video.verified,
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

    if (!sha256) {
      return res.status(400).json({ error: 'SHA256 required', data: null });
    }

    const existing = await prisma.video.findUnique({
      where: { sha256 },
    });

    return res.json({
      error: null,
      data: { isDuplicate: !!existing, existingVideoId: existing?.id },
    });
  } catch (error) {
    console.error('Check duplicate error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to check duplicate', data: null });
  }
});

router.post('/:id/upload', verifyAuth, async (req: AuthRequest | any, res) => {
  try {
    const file = req.files?.file as any;
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
    const sha256Hash = crypto
      .createHash('sha256')
      .update(fileBuffer)
      .digest('hex');

    const storageUrl = `s3://bucket/${video.id}/${file.name}`;

    const updated = await prisma.video.update({
      where: { id: video.id },
      data: {
        storageUrl,
        sha256: sha256Hash,
      },
    });

    return res.json({ error: null, data: updated });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed', data: null });
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
