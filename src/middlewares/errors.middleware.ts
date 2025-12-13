import type { NextFunction, Request, Response } from "express";
import type { ApiError } from "../utils";

export const errmiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("ERROR: ", err);

  return res.status(err.statuscode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
};
