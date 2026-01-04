import { ProjectModel } from "../../models";
import {
  ApiError,
  ApiResponse,
  asynchandler,
  ErrorMessages,
} from "../../utils";
import type { projectIdType } from "../../validators";

export const listProjectMember = asynchandler(async (req, res) => {
  const { projectId }: projectIdType = req.params as projectIdType;
  const user = req?.user;

  if (!projectId) {
    throw new ApiError({
      statusCode: 400,
      message: ErrorMessages.BAD_REQUEST,
    });
  }

  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: ErrorMessages.UNAUTHORIZED,
    });
  }

  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new ApiError({
      statusCode: 404,
      message: ErrorMessages.PROJECT_NOT_FOUND,
    });
  }

  const isOwner = project.owner.toString() === user._id.toString();

  const isMember = project.members.some(
    (mem) => mem.userId.toString() === user._id.toString(),
  );

  if (!isMember && !isOwner) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized Action",
    });
  }

  await project.populate("members.userId", "username email avatar");

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: { members: project.members },
    }),
  );
});
