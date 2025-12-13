import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError({
        statuscode: 400,
        message: "Validation Failed",
        errors: parsed.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
    req.body = parsed.data;
    next();
  };
