import { ProjectModel } from "../../models";
import {
  ApiError,
  ApiResponse,
  asynchandler,
  ErrorMessages,
} from "../../utils";
import type { projectIdType } from "../../validators";

export const getProjectById = asynchandler(async (req, res) => {
  const { projectId }: projectIdType = req.params as projectIdType;

  if (!projectId) {
    throw new ApiError({
      statusCode: 400,
      message: ErrorMessages.BAD_REQUEST,
    });
  }

  const user = req?.user;

  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: ErrorMessages.UNAUTHORIZED,
    });
  }

  const project = await ProjectModel.findOne({
    _id: projectId,
    $or: [{ owner: user._id }, { "members.userId": user._id }],
  });

  if (!project) {
    throw new ApiError({
      statusCode: 404,
      message: ErrorMessages.PROJECT_NOT_FOUND,
    });
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: { project },
    }),
  );
});
