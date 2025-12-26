import { ProjectModel } from "../../models";
import { ApiError, ApiResponse, asynchandler, UserRoleEnum } from "../../utils";

export const getUserProject = asynchandler(async (req, res) => {
  const ownerId = req.user?._id;

  if (!ownerId) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized: User not logged in",
    });
  }

  const projects = await ProjectModel.find({
    $or: [{ owner: ownerId }, { "members.userId": ownerId }],
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: projects,
    }),
  );
});

export const createProject = asynchandler(async (req, res) => {
  const { name, description } = req.body;

  const ownerId = req.user?._id;

  if (!ownerId) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized: User not logged in.",
    });
  }

  // Check for duplicate project name for this owner
  const existingProject = await ProjectModel.findOne({
    name: name.trim(),
    owner: ownerId,
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
    owner: ownerId,
    members: [{ userId: ownerId, role: UserRoleEnum.ADMIN }],
  });

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      data: project,
      message: "Project created successfully.",
    }),
  );
});
