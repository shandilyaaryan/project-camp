import { Router } from "express";
import { createProject, getUserProject } from "../controllers";
import { authMiddleware, validate } from "../middlewares";
import { createProjectSchema } from "../validators";

export const projectRouter = Router();

projectRouter.get("/", authMiddleware, getUserProject);
projectRouter.post(
  "/",
  authMiddleware,
  validate(createProjectSchema),
  createProject,
);
