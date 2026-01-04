import { ProjectModel } from "../../models";
import {
  ApiError,
  ApiResponse,
  asynchandler,
  ErrorMessages,
} from "../../utils";
import type { projectAndUserParamType } from "../../validators/projects/projectAndUserParam.schema";

export const removeProjectMember = asynchandler(async (req, res) => {
  const { projectId, userId }: projectAndUserParamType =
    req.params as projectAndUserParamType;
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

  const project = await ProjectModel.findOne({
    _id: projectId,
    owner: user._id,
  });

  if (!project) {
    throw new ApiError({
      statusCode: 404,
      message: ErrorMessages.PROJECT_NOT_FOUND,
    });
  }

  if (project.owner.toString() === userId?.toString()) {
    throw new ApiError({
      statusCode: 403,
      message: "Cannot remove the project owner",
    });
  }
  const initialMemberCount = project.members.length;
  project.members = project.members.filter(
    (mem) => mem.userId.toString() !== userId?.toString(),
  );

  if (project.members.length === initialMemberCount) {
    throw new ApiError({
      statusCode: 404,
      message: "Member not found in this project",
    });
  }

  await project.save();
  await project.populate("members.userId", "username email avatar");

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        project,
      },
      message: "Member removed successfully",
    }),
  );
});
