import { Router } from "express";
import { createTaskSchema } from "../validators";
import { validate } from "../middlewares";
import { createTask, listTask } from "../controllers";

export const taskRouter = Router({ mergeParams: true });

taskRouter.post("/", validate(createTaskSchema), createTask);
taskRouter.get("/", listTask);
