import z from "zod";

export const updateRoleSchema = z.object({
  role: z.enum(["admin", "project_admin", "member"]),
});

export type updateRoleType = z.infer<typeof updateRoleSchema>;
