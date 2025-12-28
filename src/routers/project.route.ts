import { Router } from "express";
import { createProject, getProjectById, getUserProject } from "../controllers";
import { authMiddleware, paramValidator, validate } from "../middlewares";
import { createProjectSchema, projectIdSchema } from "../validators";

export const projectRouter = Router();

projectRouter.get("/", authMiddleware, getUserProject);
projectRouter.post(
  "/",
  authMiddleware,
  validate(createProjectSchema),
  createProject,
);
projectRouter.get(
  "/:projectId",
  paramValidator(projectIdSchema),
  authMiddleware,
  getProjectById,
);
