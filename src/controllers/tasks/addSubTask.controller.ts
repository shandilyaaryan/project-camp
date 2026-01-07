import { TaskModel, type SafeUser } from "../../models";
import { getProjectWithAccess } from "../../services";
import { ApiError, ApiResponse, asynchandler } from "../../utils";
import type { addSubTaskType, taskAndProjectIdParam } from "../../validators";

export const addSubTask = asynchandler(async (req, res) => {
  const { title }: addSubTaskType = req.body as addSubTaskType;

  const { projectId, taskId }: taskAndProjectIdParam =
    req.params as taskAndProjectIdParam;
  const user: SafeUser = req.user as SafeUser;

  await getProjectWithAccess(projectId, user._id.toString());

  const task = await TaskModel.findOne({ _id: taskId, project: projectId });

  if (!task) {
    throw new ApiError({
      statusCode: 404,
      message: "Task not found",
    });
  }

  task.subtasks?.push({ title, isCompleted: false });
  await task.save();

  await task.populate("assignee", "username email avatar");
  await task.populate("reporter", "username email avatar");

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      data: {
        task,
      },
      message: "Subtask created successfully",
    }),
  );
});
