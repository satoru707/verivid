import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAuth, AuthRequest } from '../middleware/auth.js';
import { userUpdateSchema } from '../utils/validation.js';
import { walletSchema } from '../utils/validation.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/me', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      include: {
        videos: {
          select: { id: true, verified: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found', data: null });
    }

    return res.json({ error: null, data: user });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Failed to fetch user', data: null });
  }
});

router.post('/', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const validation = userUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', data: null });
    }

    const { username, email, bio, avatarUrl } = validation.data;

    const user = await prisma.user.update({
      where: { id: req.user?.userId },
      data: {
        username,
        email,
        bio,
        avatarUrl,
      },
    });

    return res.json({ error: null, data: user });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ error: 'Failed to update user', data: null });
  }
});

router.get('/:wallet', async (req, res) => {
  try {
    const validation = walletSchema.safeParse(req.params.wallet);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: 'Invalid wallet address', data: null });
    }

    const user = await prisma.user.findUnique({
      where: { wallet: req.params.wallet.toLowerCase() },
      include: {
        videos: {
          where: { verified: true },
          select: {
            id: true,
            originalName: true,
            storageUrl: true,
            verified: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found', data: null });
    }

    return res.json({
      error: null,
      data: {
        wallet: user.wallet,
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        videos: user.videos,
      },
    });
  } catch (error) {
    console.error('Get public user error:', error);
    return res.status(500).json({ error: 'Failed to fetch user', data: null });
  }
});

export { router as userRoutes };
