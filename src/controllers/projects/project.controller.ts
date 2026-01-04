import { ProjectModel, type SafeUser } from "../../models";
import { ApiResponse, asynchandler } from "../../utils";

export const getUserProject = asynchandler(async (req, res) => {
  const user: SafeUser = req.user as SafeUser;

  const projects = await ProjectModel.find({
    $or: [{ owner: user._id }, { "members.userId": user._id }],
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: { projects },
    }),
  );
});
