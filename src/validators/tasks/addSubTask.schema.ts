import z from "zod";

export const addSubTaskSchema = z.object({
  title: z.string().min(3, "Title should be atleast 3 characters long"),
});

export type addSubTaskType = z.infer<typeof addSubTaskSchema>;
