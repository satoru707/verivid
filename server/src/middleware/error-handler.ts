import type { Request, Response, NextFunction } from "express"

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
  ) {
    super(message)
  }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error("Error:", err)

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: err.message,
      code: err.code,
      data: null,
    })
  }

  return res.status(500).json({
    error: "Internal server error",
    data: null,
  })
}
