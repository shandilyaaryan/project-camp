import z from "zod";
import { AvailableTaskPriority, AvailableTaskStatus } from "../../utils";
import mongoose from "mongoose";

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title should be minimum 3 characters long")
    .trim()
    .optional(),
  description: z.string().trim().optional(),
  status: z.enum(AvailableTaskStatus as [string, ...string[]]).optional(),
  priority: z.enum(AvailableTaskPriority as [string, ...string[]]).optional(),
  dueDate: z.iso.date().optional(),
  assignee: z
    .string()
    .refine(
      (val) => mongoose.Types.ObjectId.isValid(val),
      "Assignee ID is not valid.",
    )
    .optional(),
});

export type updateTaskType = z.infer<typeof updateTaskSchema>;
