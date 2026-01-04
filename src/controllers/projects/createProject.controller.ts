import { ProjectModel, type SafeUser } from "../../models";
import {
  ApiError,
  ApiResponse,
  asynchandler,
  UserRoleEnum,
} from "../../utils";
import type { createProjectType } from "../../validators";

export const createProject = asynchandler(async (req, res) => {
  const { name, description }: createProjectType = req.body;

  const user: SafeUser = req.user as SafeUser;

  // Check for duplicate project name for this owner
  const existingProject = await ProjectModel.findOne({
    name: name.trim(),
    owner: user._id,
  });

  if (existingProject) {
    throw new ApiError({
      statusCode: 409,
      message: "A project with this name already exists.",
    });
  }

  // Create project with owner as admin
  const project = await ProjectModel.create({
    name: name.trim(),
    description: description?.trim(),
    owner: user._id,
    members: [{ userId: user._id, role: UserRoleEnum.ADMIN }],
  });

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      data: { project },
      message: "Project created successfully.",
    }),
  );
});
