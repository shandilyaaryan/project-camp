import { ProjectModel } from "../../models";
import { ApiError, ApiResponse, asynchandler, ErrorMessages, UserRoleEnum } from "../../utils";

export const getUserProject = asynchandler(async (req, res) => {
  const ownerId = req.user?._id;

  if (!ownerId) {
    throw new ApiError({
      statusCode: 401,
      message: ErrorMessages.UNAUTHORIZED,
    });
  }

  const projects = await ProjectModel.find({
    $or: [{ owner: ownerId }, { "members.userId": ownerId }],
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: { projects },
    }),
  );
});
