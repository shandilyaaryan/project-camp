import { type SafeUser } from "../../models";
import { getProjectWithOwnerAccess } from "../../services";
import { ApiResponse, asynchandler } from "../../utils";
import type { projectIdType } from "../../validators";
import type { updateProjectType } from "../../validators/projects/updateProject.schema";

export const updateProject = asynchandler(async (req, res) => {
  const { projectId }: projectIdType = req.params as projectIdType;
  const { name, description }: updateProjectType = req.body;
  const user: SafeUser = req.user as SafeUser;

  const project = await getProjectWithOwnerAccess(
    projectId,
    user._id.toString(),
  );
  
  if (name) project.name = name;
  if (description) project.description = description;
  await project.save();
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        project,
      },
      message: "Project details updated successfully.",
    }),
  );
});
