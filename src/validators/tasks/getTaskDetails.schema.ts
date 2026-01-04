import type z from "zod";
import { projectIdSchema } from "../projects/projectId.schema";
import { taskIdSchema } from "./getTask.schema";

export const taskAndProjectIdSchema = taskIdSchema.extend(projectIdSchema.shape);

export type taskAndProjectIdParam = z.infer<typeof taskAndProjectIdSchema>;
