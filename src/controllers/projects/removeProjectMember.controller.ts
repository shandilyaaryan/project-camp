import { type SafeUser } from "../../models";
import { getProjectWithOwnerAccess } from "../../services";
import {
  ApiError,
  ApiResponse,
  asynchandler,
} from "../../utils";
import type { projectAndUserParamType } from "../../validators/projects/projectAndUserParam.schema";

export const removeProjectMember = asynchandler(async (req, res) => {
  const { projectId, userId }: projectAndUserParamType =
    req.params as projectAndUserParamType;
  const user: SafeUser = req?.user as SafeUser;

  const project = await getProjectWithOwnerAccess(projectId, user._id.toString())

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
