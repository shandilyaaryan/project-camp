import { ProjectModel } from "../../models";
import {
  ApiError,
  ApiResponse,
  asynchandler,
  ErrorMessages,
} from "../../utils";
import mongoose from "mongoose";

export const updateRole = asynchandler(async (req, res) => {
  const { role } = req.body;
  const { userId, projectId } = req.params;
  const user = req?.user;

  if (!projectId) {
    throw new ApiError({
      statusCode: 400,
      message: "Project ID is missing",
    });
  }
  if (!role) {
    throw new ApiError({
      statusCode: 400,
      message: "Role is missing",
    });
  }
  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: ErrorMessages.UNAUTHORIZED,
    });
  }
  if (!userId) {
    throw new ApiError({
      statusCode: 400,
      message: "UserId is missing",
    });
  }
  const project = await ProjectModel.findOne({
    $and: [{ _id: projectId }, { owner: user._id }],
  });

  if (!project) {
    throw new ApiError({
      statusCode: 404,
      message: ErrorMessages.PROJECT_NOT_FOUND,
    });
  }

  const member = project.members.find(
    (mem) => mem.userId.toString() === userId,
  );

  if (!member) {
    throw new ApiError({
      statusCode: 400,
      message: "Member not found in the project",
    });
  }

  member.role = role;
  await project.save();
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Role updated successfully",
    }),
  );
});
