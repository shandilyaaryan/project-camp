import { TaskModel, type SafeUser } from "../../models";
import { getProjectWithAccess } from "../../services";
import { ApiError, ApiResponse, asynchandler } from "../../utils";
import type { taskAndProjectIdParam, updateTaskType } from "../../validators";

export const updateTask = asynchandler(async (req, res) => {
  const { projectId, taskId }: taskAndProjectIdParam =
    req.params as taskAndProjectIdParam;
  const newTaskDetails: updateTaskType = req.body as updateTaskType;
  const user: SafeUser = req.user as SafeUser;

  const project = await getProjectWithAccess(projectId, user._id.toString());

  const task = await TaskModel.findOne({ _id: taskId, project: projectId });

  if (!task) {
    throw new ApiError({
      statusCode: 404,
      message: "Task not found",
    });
  }

  if (newTaskDetails.assignee) {
    const isMember = project.members.some(
      (mem) => mem.userId.toString() === newTaskDetails.assignee?.toString(),
    );
    if (!isMember) {
      throw new ApiError({
        statusCode: 403,
        message: "Assignee don't belong to this project.",
      });
    }
  }

  const updates = Object.fromEntries(
    Object.entries(newTaskDetails).filter(([_, value]) => value !== undefined),
  );

  Object.assign(task, updates);
  await task.save();
  await task.populate("assignee", "username email avatar");

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        task,
      },
      message: "Task details updated successfully.",
    }),
  );
});
