import { ProjectModel, UserModel } from "../../models";
import {
  ApiError,
  ApiResponse,
  asynchandler,
  ErrorMessages,
} from "../../utils";

export const addMember = asynchandler(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;
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
  if (project.owner.toString() !== user._id.toString()) {
    throw new ApiError({
      statusCode: 403,
      message: "Only owner can add members",
    });
  }
  const newMember = await UserModel.findOne({ email });
  if (!newMember) {
    throw new ApiError({
      statusCode: 400,
      message: "Member does not exist",
    });
  }
  const isAlreadyMember = project.members.some(
    (member) => member.userId.toString() === newMember._id.toString(),
  );

  if (isAlreadyMember) {
    throw new ApiError({
      statusCode: 409,
      message: "Member already exists in the project",
    });
  }
  project.members.push({ userId: newMember._id, role: role });
  await project.save();
  await project.populate("members.userId", "username email");

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        project,
      },
      message: "New member added successfully",
    }),
  );
});
