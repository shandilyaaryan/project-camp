import { TaskModel, type SafeUser } from "../../models";
import { getProjectWithAccess } from "../../services";
import {
  ApiError,
  ApiResponse,
  asynchandler,
} from "../../utils";
import type { createTaskType, projectIdType } from "../../validators";

export const createTask = asynchandler(async (req, res) => {
  const { projectId }: projectIdType = req.params as projectIdType;
  const taskDetails: createTaskType = req.body;
  const user: SafeUser = req.user as SafeUser;

  const project = await getProjectWithAccess(projectId, user._id.toString());

  if (taskDetails.assignee) {
    const isAssigneeMember = project.members.find(
      (mem) => mem.userId.toString() === taskDetails.assignee?.toString(),
    );

    const isAssigneeOwner =
      project.owner.toString() === taskDetails.assignee?.toString();

    if (!isAssigneeMember && !isAssigneeOwner) {
      throw new ApiError({
        statusCode: 400,
        message: "Assignee is not a member or owner of the project.",
      });
    }
  }

  const task = await TaskModel.create({
    title: taskDetails.title,
    description: taskDetails?.description,
    priority: taskDetails?.priority,
    status: taskDetails?.status,
    assignee: taskDetails?.assignee,
    dueDate: taskDetails?.dueDate,
    project: projectId,
    reporter: user._id,
  });

  await task.populate("project", "name");
  await task.populate("assignee", "username email avatar");
  await task.populate("reporter", "username email avatar");

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      data: {
        task,
      },
      message: "Task created successfully",
    }),
  );
});
