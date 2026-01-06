import { TaskModel, type SafeUser } from "../../models";
import { getProjectWithAccess } from "../../services";
import { ApiError, ApiResponse, asynchandler } from "../../utils";
import type { taskAndProjectIdParam } from "../../validators";

export const uploadTaskAttachment = asynchandler(async (req, res) => {
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

  if (!req.file) {
    throw new ApiError({
      statusCode: 400,
      message: "No file uploaded",
    });
  }

  task.attachments?.push({
    originalName: req.file.originalname,
    filename: req.file.filename,
    url: req.file.path,
  });
  await task.save();
  await task.populate("assignee", "username email avatar");
  await task.populate("reporter", "username email avatar");

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        task,
      },
    }),
  );
});
