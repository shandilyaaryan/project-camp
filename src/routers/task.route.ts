import { Router } from "express";
import {
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
} from "../controllers";

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
