import { ProjectModel, TaskModel } from "../../models";
import {
  ApiError,
  ApiResponse,
  asynchandler,
  ErrorMessages,
} from "../../utils";
import type { createTaskType } from "../../validators";

export const createTask = asynchandler(async (req, res) => {
  const { projectId } = req.params;
  const taskDetails: createTaskType = req.body;
  const user = req?.user;

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

  const isMember = project.members.some(
    (mem) => mem.userId.toString() === user._id.toString(),
  );

  const isOwner = project.owner.toString() === user._id.toString();

  if (!isMember && !isOwner) {
    throw new ApiError({
      statusCode: 403,
      message: "Only owner or members can create tasks",
    });
  }

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
