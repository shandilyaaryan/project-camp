import z from "zod";
import { strongPasswordRegex } from "./register.schema";

export const changePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z
      .string()
      .trim()
      .min(8, "Password must be atleast 8 characters")
      .regex(strongPasswordRegex, {
        error:
          "Password must contain one uppercase letter, one lowercase, one number and one special character",
      }),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    error: "Please choose another password different from your old password",
    path: ["newPassword"]
  });
