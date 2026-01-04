import type z from "zod";
import { projectIdSchema } from "./projectId.schema";
import { userIdSchema } from "./userId.schema";

export const projectAndUserParamSchema = projectIdSchema.extend(
  userIdSchema.shape,
);

export type projectAndUserParamType = z.infer<typeof projectAndUserParamSchema>;
