import express, { Router } from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const router: express.Router = Router();
const prisma = new PrismaClient();

const rateLimiter = new RateLimiterMemory({
  points: 3,
  duration: 60,
});

const rateLimitMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    await rateLimiter.consume(req.ip as string);
    next();
  } catch {
    res.status(429).json({
      error: 'Too many requests. Try again later.',
      data: null,
    });
  }
};

router.post('/recover/request', rateLimitMiddleware, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required', data: null });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.json({
        error: null,
        data: { message: 'If email exists, recovery link sent' },
      });
    }

    const recoveryToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        recoveryToken,
        recoveryTokenExpiry: expiresAt,
      },
    });

    const recoveryLink = `${process.env.FRONTEND_URL}/recover?token=${recoveryToken}`;
    console.log(`Recovery email would send to ${email}: ${recoveryLink}`);

    return res.json({
      error: null,
      data: { message: 'Recovery email sent' },
    });
  } catch (error) {
    console.error('Recovery request error:', error);
    return res
      .status(500)
      .json({ error: 'Recovery request failed', data: null });
  }
});

router.post('/recover/verify', async (req, res) => {
  try {
    const { token, newWallet } = req.body;

    if (!token || !newWallet) {
      return res
        .status(400)
        .json({ error: 'Token and new wallet required', data: null });
    }

    const user = await prisma.user.findFirst({
      where: {
        recoveryToken: token,
        recoveryTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: 'Invalid or expired recovery token', data: null });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        wallet: newWallet.toLowerCase(),
        recoveryToken: null,
        recoveryTokenExpiry: null,
      },
    });

    return res.json({
      error: null,
      data: { user: updated },
    });
  } catch (error) {
    console.error('Recovery verify error:', error);
    return res
      .status(500)
      .json({ error: 'Recovery verification failed', data: null });
  }
});

export { router as authRoutes };
