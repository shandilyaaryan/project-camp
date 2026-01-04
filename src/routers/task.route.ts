import { Router } from "express";
import { createTaskSchema } from "../validators";
import { validate } from "../middlewares";
import { createTask } from "../controllers";

export const taskRouter = Router({ mergeParams: true });

taskRouter.post("/", validate(createTaskSchema), createTask);
