import type { Request, Response, NextFunction } from "express"

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

export function rateLimit(windowMs = 60000, maxRequests = 10) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || "unknown"
    const now = Date.now()

    if (!store[key] || now > store[key].resetTime) {
      store[key] = { count: 1, resetTime: now + windowMs }
      return next()
    }

    if (store[key].count >= maxRequests) {
      return res.status(429).json({
        error: "Too many requests",
        data: null,
      })
    }

    store[key].count++
    next()
  }
}
