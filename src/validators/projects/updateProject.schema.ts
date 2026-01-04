import z from "zod";

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(5, "Project Name should be atleast 5 characters long")
    .trim()
    .optional(),
  description: z.string().optional(),
});

export type updateProjectType = z.infer<typeof updateProjectSchema>;
