import { UserModel } from "../../models";
import { ApiError, ApiResponse, asynchandler } from "../../utils";

export const changePassword = asynchandler(async (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const user = await UserModel.findById(req.user?._id).select("+password");
  if (!user) {
    throw new ApiError({
      statusCode: 404,
      message: "User not found",
    });
  }
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError({
      statusCode: 401,
      message: "Old Password is incorrect",
    });
  }
  user.password = newPassword;
  user.refreshToken = "";
  await user.save();
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Password Successfully changed",
    }),
  );
});
