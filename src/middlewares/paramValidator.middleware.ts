import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils";
import type { z, ZodType } from "zod";

export const paramValidator =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);

    if (!parsed.success) {
      throw new ApiError({
        statusCode: 400,
        message: "Validation Failed",
        errors: parsed.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    req.params = parsed.data as any;
    next();
  };
