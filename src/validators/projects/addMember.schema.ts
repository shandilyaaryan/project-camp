import z from "zod";

export const addMemberSchema = z.object({
  email: z.email(),
  role: z.enum(["admin", "project_admin", "member"]),
});

export type addMemberType = z.infer<typeof addMemberSchema>;
