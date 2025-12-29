import { Router } from "express";
import {
  createProject,
  getProjectById,
  getUserProject,
  updateProject,
} from "../controllers";
import { authMiddleware, paramValidator, validate } from "../middlewares";
import { createProjectSchema, projectIdSchema } from "../validators";
import { updateProjectSchema } from "../validators/projects/updateProject.schema";

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
projectRouter.put(
  "/:projectId",
  paramValidator(projectIdSchema),
  authMiddleware,
  validate(updateProjectSchema),
  updateProject,
);
