import { UserModel, type SafeUser } from "../../models";
import { getProjectWithOwnerAccess, isMember } from "../../services";
import {
  ApiError,
  ApiResponse,
  asynchandler,
} from "../../utils";
import type { addMemberType, projectIdType } from "../../validators";

export const addMember = asynchandler(async (req, res) => {
  const { email, role }: addMemberType = req.body;
  const { projectId }: projectIdType = req.params as projectIdType;
  const user: SafeUser = req.user as SafeUser;

  const project = await getProjectWithOwnerAccess(
    projectId,
    user._id.toString(),
  );
  const newMember = await UserModel.findOne({ email });
  if (!newMember) {
    throw new ApiError({
      statusCode: 400,
      message: "Member does not exist",
    });
  }
  const isAlreadyMember = isMember(newMember._id.toString(), project);

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
