import { Router } from "express";
import {
  addSubTaskSchema,
  createTaskSchema,
  taskAndProjectIdSchema,
  updateTaskSchema,
} from "../validators";
import { paramValidator, validate } from "../middlewares";
import {
  createTask,
  listTask,
  getTaskById,
  updateTask,
  deleteTask,
  uploadTaskAttachment,
  addSubTask,
} from "../controllers";
import { upload } from "../middlewares/upload.middleware";

export const taskRouter = Router({ mergeParams: true });

taskRouter.post("/", validate(createTaskSchema), createTask);
taskRouter.get("/", listTask);
taskRouter.get("/:taskId", paramValidator(taskAndProjectIdSchema), getTaskById);
taskRouter.put(
  "/:taskId",
  paramValidator(taskAndProjectIdSchema),
  validate(updateTaskSchema),
  updateTask,
);
taskRouter.delete(
  "/:taskId",
  paramValidator(taskAndProjectIdSchema),
  deleteTask,
);
taskRouter.post(
  "/:taskId/attachments",
  paramValidator(taskAndProjectIdSchema),
  upload.single("attachment"),
  uploadTaskAttachment,
);
taskRouter.post(
  "/:taskId/subtasks",
  paramValidator(taskAndProjectIdSchema),
  validate(addSubTaskSchema),
  addSubTask,
);
