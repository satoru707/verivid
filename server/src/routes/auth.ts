import express, { Router } from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { createToken } from '../utils/jwt.js';
import { generateRandomNonce } from '../utils/crypto.js';
import { ethers } from 'ethers';

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

router.post('/nonce', async (req, res) => {
  const { wallet } = req.body;
  if (!wallet || typeof wallet !== 'string') {
    return res.status(400).json({ error: 'wallet is required', data: null });
  }

  const lower = wallet.toLowerCase();

  try {
    let user = await prisma.user.findUnique({ where: { wallet: lower } });
    if (!user) {
      user = await prisma.user.create({ data: { wallet: lower } });
    }

    const nonce = generateRandomNonce(16);

    await prisma.user.update({
      where: { id: user.id },
      data: { nonce },
    });

    return res.json({ error: null, data: { nonce } });
  } catch (err) {
    console.error('[Auth] nonce error:', err);
    return res.status(500).json({ error: 'Server error', data: null });
  }
});

router.post('/login', async (req, res) => {
  const { wallet: payload } = req.body;
  if (!payload || typeof payload !== 'string') {
    return res
      .status(400)
      .json({ error: 'wallet payload required', data: null });
  }

  const [address, signature] = payload.split(':');
  if (!address || !signature) {
    return res
      .status(400)
      .json({ error: 'Invalid payload format', data: null });
  }

  const lower = address.toLowerCase();

  try {
    const user = await prisma.user.findUnique({ where: { wallet: lower } });
    if (!user?.nonce) {
      return res
        .status(401)
        .json({ error: 'No nonce for this address', data: null });
    }

    const domain = { name: 'VeriVid', version: '1' };
    const types = {
      Authentication: [
        { name: 'message', type: 'string' },
        { name: 'nonce', type: 'string' },
      ],
    };
    const value = {
      message: 'VeriVid Authentication',
      nonce: user.nonce,
    };

    const recovered = ethers.verifyTypedData(domain, types, value, signature);

    if (recovered.toLowerCase() !== lower) {
      return res.status(401).json({ error: 'Invalid signature', data: null });
    }

    const newNonce = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.user.update({
      where: { id: user.id },
      data: { nonce: newNonce },
    });

    const token = createToken({ userId: user.id, wallet: user.wallet });

    res.cookie('verivid_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    return res.json({ error: null, data: { token } });
  } catch (err) {
    console.error('[Auth] login error:', err);
    return res.status(500).json({ error: 'Server error', data: null });
  }
});

router.post('/verify', async (req, res) => {
  const { wallet, signature } = req.body;
  if (!wallet || !signature) {
    return res
      .status(400)
      .json({ error: 'wallet and signature required', data: null });
  }

  const lower = wallet.toLowerCase();

  try {
    let user = await prisma.user.findUnique({ where: { wallet: lower } });
    if (!user) {
      console.log('[Auth] Creating new user:', lower);
      user = await prisma.user.create({
        data: {
          wallet: lower,
          nonce: generateRandomNonce(16),
        },
      });
    }

    const domain = { name: 'VeriVid', version: '1' };
    const types = {
      Authentication: [
        { name: 'message', type: 'string' },
        { name: 'nonce', type: 'string' },
      ],
    };
    const value = { message: 'VeriVid Authentication', nonce: user.nonce };

    const recovered = ethers.verifyTypedData(domain, types, value, signature);
    if (recovered.toLowerCase() !== lower) {
      return res.status(401).json({ error: 'Invalid signature', data: null });
    }

    const newNonce = generateRandomNonce(16);
    await prisma.user.update({
      where: { id: user.id },
      data: { nonce: newNonce },
    });

    const token = createToken({ userId: user.id, wallet: user.wallet });

    res.cookie('verivid_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      error: null,
      data: {
        user: {
          id: user.id,
          wallet: user.wallet,
          username: user.username,
          email: user.email,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      },
    });
  } catch (err) {
    console.error('[Auth] verify error:', err);
    return res.status(500).json({ error: 'Server error', data: null });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('verivid_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res.json({ error: null, data: { message: 'Logged out' } });
});


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
