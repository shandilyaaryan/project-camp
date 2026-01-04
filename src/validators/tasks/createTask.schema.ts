import z from "zod";
import { AvailableTaskPriority, AvailableTaskStatus } from "../../utils";
import mongoose from "mongoose";

export const createTaskSchema = z.object({
  title: z.string().trim().min(3, "Title shoudl be atleast 3 characters long."),
  description: z.string().trim().optional(),
  priority: z.enum(AvailableTaskPriority as [string, ...string[]]).optional(),
  status: z.enum(AvailableTaskStatus as [string, ...string[]]).optional(),
  assignee: z
    .string()
    .refine(
      (val) => mongoose.Types.ObjectId.isValid(val),
      "Invalid assignee ID",
    )
    .optional(),
  dueDate: z.iso.date("Invalid Date format, expected ISO string").optional(),
});

export type createTaskType = z.infer<typeof createTaskSchema>;
