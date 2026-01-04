import { type SafeUser } from "../../models";
import { getProjectTasks, getProjectWithAccess } from "../../services";
import { ApiResponse, asynchandler } from "../../utils";
import type { projectIdType } from "../../validators";

export const listTask = asynchandler(async (req, res) => {
  const { projectId }: projectIdType = req.params as projectIdType;
  const user: SafeUser = req.user as SafeUser;

  await getProjectWithAccess(projectId, user._id.toString());

  const tasks = await getProjectTasks(projectId)
    .populate("assignee", "username email avatar")
    .populate("reporter", "username email avatar");

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        tasks,
      },
    }),
  );
});