import mongoose from "mongoose";
import z from "zod";

export const projectIdSchema = z.object({
  projectId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    error: "Invalid Project ID",
  }),
});

export type projectIdType = z.infer<typeof projectIdSchema>;
