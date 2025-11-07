import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user?: {
    wallet: string;
    userId: string;
  };
}

export function verifyAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.verivid_token;

    if (!token) {
      return res
        .status(401)
        .json({ error: 'Unauthorized - no token', data: null });
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.clearCookie('verivid_token');
      return res.status(401).json({ error: 'Invalid token', data: null });
    }

    req.user = {
      wallet: payload.wallet,
      userId: payload.userId,
    };

    next();
    return;
  } catch (error) {
    console.error('[Auth Middleware] Error:', error);
    res.clearCookie('verivid_token');
    return res.status(401).json({ error: 'Authentication failed', data: null });
  }
}
