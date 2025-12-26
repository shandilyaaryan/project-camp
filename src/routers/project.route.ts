import { Router } from "express";
import { createProject } from "../controllers";
import { authMiddleware, validate } from "../middlewares";
import { createProjectSchema } from "../validators";

export const projectRouter = Router();

projectRouter.post(
  "/",
  authMiddleware,
  validate(createProjectSchema),
  createProject,
);
