import z from "zod";

const strongPasswordRegex = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
);

export const registerSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be atleast 5 characters")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be atleast 8 characters long")
    .regex(strongPasswordRegex, {
      error:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  email: z.email("Please enter a valid email address"),
  fullName: z.string().optional(),
});
