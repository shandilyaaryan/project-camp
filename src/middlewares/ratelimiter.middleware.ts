import type { NextFunction, Request, Response } from "express";
import { ApiResponse, getRedisClient } from "../utils";

export const rateLimiter = (limit: number, windowSec: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const client = getRedisClient();
      const key = `rate:${req.ip}:${req.method}:${req.originalUrl}`;

      const count = await client.incr(key);
      if (count === 1) {
        await client.expire(key, windowSec);
      }

      if (count > limit) {
        return res.status(429).json(
          new ApiResponse({
            statusCode: 429,
            message: "Too many requests",
          }),
        );
      }
      next();
    } catch (err) {
      console.error("Rate limiter error:", err);
      next();
    }
  };
};
