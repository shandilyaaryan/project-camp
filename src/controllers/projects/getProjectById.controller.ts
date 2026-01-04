import { type SafeUser } from "../../models";
import { getProjectWithAccess } from "../../services";
import {
  ApiResponse,
  asynchandler,
} from "../../utils";
import type { projectIdType } from "../../validators";

export const getProjectById = asynchandler(async (req, res) => {
  const { projectId }: projectIdType = req.params as projectIdType;

  const user: SafeUser = req.user as SafeUser;

  const project = await getProjectWithAccess(projectId, user._id.toString());

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: { project },
    }),
  );
});
