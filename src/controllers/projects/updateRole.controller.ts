import { type SafeUser } from "../../models";
import { getProjectWithOwnerAccess } from "../../services";
import {
  ApiError,
  ApiResponse,
  asynchandler,
} from "../../utils";
import type { updateRoleType } from "../../validators";
import type { projectAndUserParamType } from "../../validators/projects/projectAndUserParam.schema";

export const updateRole = asynchandler(async (req, res) => {
  const { role }: updateRoleType = req.body;
  const { userId, projectId }: projectAndUserParamType =
    req.params as projectAndUserParamType;
  const user: SafeUser = req.user as SafeUser;

  const project = await getProjectWithOwnerAccess(
    projectId,
    user._id.toString(),
  );

  const member = project.members.find(
    (mem) => mem.userId.toString() === userId,
  );

  if (!member) {
    throw new ApiError({
      statusCode: 400,
      message: "Member not found in the project",
    });
  }

  member.role = role;
  await project.save();
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Role updated successfully",
    }),
  );
});
