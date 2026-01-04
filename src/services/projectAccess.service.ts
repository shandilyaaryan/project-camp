import { ProjectModel, TaskModel, type IProject } from "../models";
import { ApiError, ErrorMessages } from "../utils";

export const isMember = (userId: string, project: IProject): boolean => {
  return project.members.some(
    (mem) => mem.userId.toString() === userId.toString(),
  );
};

export const isOwner = (userId: string, project: IProject): boolean => {
  return project.owner.toString() === userId.toString();
};

export const hasProjectAccess = (
  userId: string,
  project: IProject,
): boolean => {
  if (isMember(userId, project) || isOwner(userId, project)) {
    return true;
  }
  return false;
};

export const getProjectWithAccess = async (
  projectId: string,
  userId: string,
): Promise<IProject> => {
  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new ApiError({
      statusCode: 404,
      message: ErrorMessages.PROJECT_NOT_FOUND,
    });
  }

  const member = isMember(userId, project);
  const owner = isOwner(userId, project);

  if (!member && !owner) {
    throw new ApiError({
      statusCode: 403,
      message: "You are not authorized to access this project.",
    });
  }

  return project;
};

export const getProjectWithOwnerAccess = async (
  projectId: string,
  userId: string,
): Promise<IProject> => {
  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new ApiError({
      statusCode: 404,
      message: ErrorMessages.PROJECT_NOT_FOUND,
    });
  }

  const owner = isOwner(userId, project);

  if (!owner) {
    throw new ApiError({
      statusCode: 403,
      message: "Only the owner can perform this action",
    });
  }

  return project;
};

export const getProjectTasks = (projectId: string) => {
  return TaskModel.find({ project: projectId });
};
