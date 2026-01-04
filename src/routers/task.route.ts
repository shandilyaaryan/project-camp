import { Router } from "express";
import { createTaskSchema, taskAndProjectIdSchema } from "../validators";
import { paramValidator, validate } from "../middlewares";
import { createTask, listTask, getTaskById } from "../controllers";

export const taskRouter = Router({ mergeParams: true });

taskRouter.post("/", validate(createTaskSchema), createTask);
taskRouter.get("/", listTask);
taskRouter.get("/:taskId", paramValidator(taskAndProjectIdSchema), getTaskById);
