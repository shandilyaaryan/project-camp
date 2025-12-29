import { ProjectModel } from "../../models";
import {
  ApiError,
  ApiResponse,
  asynchandler,
  ErrorMessages,
} from "../../utils";

export const deleteProject = asynchandler(async (req, res) => {
  const { projectId } = req.params;
  const user = req?.user;

  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: ErrorMessages.UNAUTHORIZED,
    });
  }

  if (!projectId) {
    throw new ApiError({
      statusCode: 404,
      message: ErrorMessages.PROJECT_NOT_FOUND,
    });
  }

  const project = await ProjectModel.deleteOne({
    $and: [{ _id: projectId }, { owner: user._id }],
  });

  if (project.deletedCount === 0) {
    throw new ApiError({
      statusCode: 404,
      message: ErrorMessages.PROJECT_NOT_FOUND,
    });
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Project Deleted Successfully",
    }),
  );
});
