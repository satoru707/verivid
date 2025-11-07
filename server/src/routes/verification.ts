import Express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAuth, type AuthRequest } from '../middleware/auth.js';
import { BlockchainService } from '../services/blockchain.service.js';
import { IPFSService } from '../services/ipfs.service.js';

const router: Express.Router = Router();
const prisma = new PrismaClient();
const blockchainService = new BlockchainService();
const ipfsService = new IPFSService();

router.post('/prepare-tx', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const { videoId } = req.body;

    if (!videoId) {
      return res.status(400).json({ error: 'videoId required', data: null });
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found', data: null });
    }

    if (video.verified) {
      return res
        .status(409)
        .json({ error: 'Video already verified', data: null });
    }

    const isRegistered = await blockchainService.isProofRegistered(
      video.sha256
    );
    if (isRegistered) {
      return res.status(409).json({
        error: 'Proof already registered on-chain',
        data: null,
      });
    }

    const metadata = {
      videoId: video.id,
      title: video.originalName,
      sha256: video.sha256,
      uploader: video.uploaderId,
      timestamp: video.createdAt.toISOString(),
      ipfsUri: video.ipfsCid ? `ipfs://${video.ipfsCid}` : undefined,
    };

    return res.json({
      error: null,
      data: {
        videoId: video.id,
        proofHash: `0x${video.sha256}`,
        metadata,
        contractAddress: process.env.CONTRACT_ADDRESS,
        chainId: process.env.CONTRACT_CHAIN_ID || '1',
      },
    });
  } catch (error) {
    console.error('Prepare tx error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to prepare transaction', data: null });
  }
});

router.post('/confirm-tx', async (req, res) => {
  try {
    const { videoId, txHash, signer, proofHash } = req.body;

    if (!videoId || !txHash || !signer) {
      return res.status(400).json({
        error: 'videoId, txHash, and signer required',
        data: null,
      });
    }

    const txSuccess = await blockchainService.verifyTransaction(txHash);
    if (!txSuccess) {
      return res.status(400).json({
        error: 'Transaction failed or not confirmed',
        data: null,
      });
    }

    const proofDetails = await blockchainService.getProofDetails(proofHash);
    if (!proofDetails) {
      return res.status(400).json({
        error: 'Proof not found on-chain',
        data: null,
      });
    }

    const verification = await prisma.verification.create({
      data: {
        videoId,
        txHash,
        proofHash,
        signer,
        chain: 'ethereum:1',
        metadataUri: proofDetails.metadataUri,
      },
    });

    const video = await prisma.video.update({
      where: { id: videoId },
      data: {
        verified: true,
        verifiedAt: new Date(),
        verifiedBy: signer,
      },
    });

    return res.json({
      error: null,
      data: {
        verification,
        video,
      },
    });
  } catch (error) {
    console.error('Confirm tx error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to confirm transaction', data: null });
  }
});

router.get('/:proofHash', async (req, res) => {
  try {
    const { proofHash } = req.params;

    const onChainProof = await blockchainService.getProofDetails(proofHash);
    if (!onChainProof) {
      return res.status(404).json({ error: 'Proof not found', data: null });
    }

    const verification = await prisma.verification.findFirst({
      where: { proofHash },
      include: { video: true },
    });

    return res.json({
      error: null,
      data: {
        onChain: onChainProof,
        dbRecord: verification,
      },
    });
  } catch (error) {
    console.error('Get verification error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch verification', data: null });
  }
});

router.get('/video/:videoId', async (req, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.videoId },
      include: { verifications: true },
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found', data: null });
    }

    return res.json({
      error: null,
      data: {
        videoId: video.id,
        verified: video.verified,
        verifiedAt: video.verifiedAt,
        verifications: video.verifications,
      },
    });
  } catch (error) {
    console.error('Get video verification error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch verification', data: null });
  }
});

export { router as verificationRoutes };
