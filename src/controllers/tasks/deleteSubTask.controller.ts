import { TaskModel, type SafeUser } from "../../models";
import { getProjectWithAccess } from "../../services";
import { ApiError, ApiResponse, asynchandler } from "../../utils";
import type { taskAndProjectIdParam } from "../../validators";

export const deleteSubTask = asynchandler(async (req, res) => {
  const { projectId, taskId }: taskAndProjectIdParam =
    req.params as taskAndProjectIdParam;

  const { subTaskId } = req.params;

  const user: SafeUser = req.user as SafeUser;

  // Ensure the user has access to the project
  await getProjectWithAccess(projectId, user._id.toString());

  // Ensure the task exists and belongs to the project
  const taskExists = await TaskModel.exists({
    _id: taskId,
    project: projectId,
  });
  if (!taskExists) {
    throw new ApiError({
      statusCode: 404,
      message: "Task not found",
    });
  }

  // Atomically pull the subtask from the subtasks array
  const updateResult = await TaskModel.updateOne(
    { _id: taskId, project: projectId, "subtasks._id": subTaskId },
    { $pull: { subtasks: { _id: subTaskId } } },
  );

  // If nothing was modified, the subtask wasn't found
  if (!updateResult.acknowledged || (updateResult.modifiedCount ?? 0) === 0) {
    throw new ApiError({
      statusCode: 404,
      message: "Subtask not found",
    });
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Subtask deleted successfully",
    }),
  );
});
