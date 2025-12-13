import {
  validationResult,
  type FieldValidationError,
} from "express-validator";

import { ApiError } from "../utils/api-error";
import type { Request, Response, NextFunction } from "express";

export const validator = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors
    .array()
    .filter((err): err is FieldValidationError => err.type === "field")
    .map((err) => ({
      field: err.path,
      message: err.msg,
    }));

  throw new ApiError({
    statuscode: 400,
    message: "Validation failed",
    errors: extractedErrors,
  });
};
