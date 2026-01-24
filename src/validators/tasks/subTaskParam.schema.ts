import mongoose from "mongoose";
import z from "zod";
import { taskAndProjectIdSchema } from "./getTaskDetails.schema";

export const subTaskParamSchema = taskAndProjectIdSchema.extend({
  subTaskId: z
    .string()
    .refine(
      (val) => mongoose.Types.ObjectId.isValid(val),
      "Invalid Subtask ID",
    ),
});

export type subTaskParamType = z.infer<typeof subTaskParamSchema>;
