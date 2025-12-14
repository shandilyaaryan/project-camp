import type { NextFunction, Request, Response } from "express";
import { ApiError, asynchandler } from "../utils";
import jwt, { type Secret } from "jsonwebtoken";

export const authMiddleware = asynchandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { token } =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError({
        statuscode: 401,
        message: "You are not logged in",
      });
    }
    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as Secret,
      );
      req.user = decoded;
      next();
    } catch (err) {
      throw new ApiError({
        statuscode: 401,
        message: "Invalid or expired token",
      });
    }
  },
);
