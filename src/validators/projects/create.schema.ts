import z from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(5, "Project Name should be atleast 5 characters long").trim(),
  description: z.string().optional(),
});
