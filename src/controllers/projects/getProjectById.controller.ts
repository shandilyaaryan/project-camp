import { ProjectModel } from "../../models";
import { ApiError, ApiResponse, asynchandler } from "../../utils";

export const getProjectById = asynchandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError({
      statusCode: 400,
      message: "Project ID is missing.",
    });
  }

  const user = req?.user;

  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized: User not logged in",
    });
  }

  const project = await ProjectModel.findOne({
    _id: projectId,
    $or: [{ owner: user._id }, { "members.userId": user._id }],
  });

  if (!project) {
    throw new ApiError({
      statusCode: 404,
      message: "Project not found",
    });
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: { project },
    }),
  );
});
