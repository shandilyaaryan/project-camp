import mongoose from "mongoose";
import z from "zod";

export const taskIdSchema = z.object({
  taskId: z
    .string()
    .refine(
      (val) => mongoose.Types.ObjectId.isValid(val),
      "Task Id is incorrect",
    ),
});

export type taskIdType = z.infer<typeof taskIdSchema>;
