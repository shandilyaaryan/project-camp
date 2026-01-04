import mongoose from "mongoose";
import z from "zod";

export const userIdSchema = z.object({
  userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    error: "Invalid User ID",
  }),
});

export type userIdType = z.infer<typeof userIdSchema>;
