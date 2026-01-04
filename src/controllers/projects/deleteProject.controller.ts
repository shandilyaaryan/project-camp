import { type SafeUser } from "../../models";
import { getProjectWithOwnerAccess } from "../../services";
import {
  ApiResponse,
  asynchandler,
} from "../../utils";
import type { projectIdType } from "../../validators";

export const deleteProject = asynchandler(async (req, res) => {
  const { projectId }: projectIdType = req.params as projectIdType;
  const user: SafeUser = req.user as SafeUser;

  const project = await getProjectWithOwnerAccess(
    projectId,
    user._id.toString(),
  );
  await project.deleteOne();

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Project Deleted Successfully",
    }),
  );
});
