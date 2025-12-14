import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils";
import jwt, { type Secret } from "jsonwebtoken";
import {
  SAFE_USER_PROJECTION,
  UserModel,
  type AccessTokenPayload,
  type SafeUser,
} from "../models";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError({
      statuscode: 401,
      message: "Unauthorized user",
    });
  }
  let decoded: AccessTokenPayload;
  try {
    decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as Secret,
    ) as AccessTokenPayload;
  } catch (err) {
    throw new ApiError({
      statuscode: 401,
      message: "Invalid or expired token",
    });
  }
  const user = await UserModel.findById(decoded._id)
    .select(SAFE_USER_PROJECTION)
    .lean();
  if (!user) {
    throw new ApiError({
      statuscode: 401,
      message: "Invalid access token",
    });
  }
  req.user = user as SafeUser;
  next();
};
