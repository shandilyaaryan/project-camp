import z from "zod";
import { strongPasswordRegex } from "./register.schema";

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password should be atleast 8 characters")
    .regex(strongPasswordRegex, {
      error:
        "Password must contain atleast one uppercase letter, one lowercase, one number and one special character",
    }),
});
