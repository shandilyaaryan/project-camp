export const UserRoleEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};

export const AvailableRole = Object.values(UserRoleEnum);

export const TaskStatusEnum = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

export const AvailableTaskStatus = Object.values(TaskStatusEnum);

export const TaskPriorityEnum = {
  P1: "priority_1",
  P2: "priority_2",
  P3: "priority_3",
  P4: "priority_4",
};

export const AvailableTaskPriority = Object.values(TaskPriorityEnum);

export const ErrorMessages = {
  UNAUTHORIZED: "Unauthorized: User not logged in.",
  PROJECT_NOT_FOUND: "Project not found",
  BAD_REQUEST: "Bad Request.",
};
