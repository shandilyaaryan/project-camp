import { ProjectModel } from "../../models";
import { ApiError, ApiResponse, asynchandler } from "../../utils";

export const updateProject = asynchandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;
  const user = req?.user;

  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized: Please log in.",
    });
  }

  if (!projectId) {
    throw new ApiError({
      statusCode: 400,
      message: "Project ID is missing.",
    });
  }

  const project = await ProjectModel.findOneAndUpdate(
    { $and: [{ owner: user._id }, { _id: projectId }] },
    {
      $set: {
        name,
        description,
      },
    },
    { new: true },
  );

  if (!project) {
    throw new ApiError({
      statusCode: 404,
      message: "Project not found.",
    });
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        project,
      },
      message: "Project details updated successfully.",
    }),
  );
});
