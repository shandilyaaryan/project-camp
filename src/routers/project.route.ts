import { Router } from "express";
import {
  addMember,
  createProject,
  deleteProject,
  getProjectById,
  getUserProject,
  listProjectMember,
  removeProjectMember,
  updateProject,
  updateRole,
} from "../controllers";
import { authMiddleware, paramValidator, validate } from "../middlewares";
import {
  addMemberSchema,
  createProjectSchema,
  projectIdSchema,
  updateRoleSchema,
} from "../validators";
import { updateProjectSchema } from "../validators/projects/updateProject.schema";
import { projectAndUserParamSchema } from "../validators/projects/projectAndUserParam.schema";

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
projectRouter.delete(
  "/:projectId",
  paramValidator(projectIdSchema),
  authMiddleware,
  deleteProject,
);
projectRouter.post(
  "/:projectId/members",
  paramValidator(projectIdSchema),
  authMiddleware,
  validate(addMemberSchema),
  addMember,
);
projectRouter.get(
  "/:projectId/members",
  paramValidator(projectIdSchema),
  authMiddleware,
  listProjectMember,
);
projectRouter.put(
  "/:projectId/members/:userId",
  paramValidator(projectAndUserParamSchema),
  validate(updateRoleSchema),
  authMiddleware,
  updateRole,
);
projectRouter.delete(
  "/:projectId/members/:userId",
  paramValidator(projectAndUserParamSchema),
  authMiddleware,
  removeProjectMember,
);
