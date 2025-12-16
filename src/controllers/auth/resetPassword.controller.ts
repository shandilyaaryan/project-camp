import { UserModel } from "../../models";
import { ApiError, ApiResponse, asynchandler } from "../../utils";
import crypto from "crypto";

export const resetPassword = asynchandler(async (req, res) => {
  const token = req.params.resetPasswordToken;
  const newPassword = req.body.newPassword;
  if (!token || !newPassword) {
    throw new ApiError({
      statuscode: 400,
      message: "Token or password not found",
    });
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await UserModel.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    throw new ApiError({
      statuscode: 400,
      message: "Invalid or expired token found",
    });
  }

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  user.refreshToken = undefined;
  user.password = newPassword;
  await user.save();

  return res.status(200).json(
    new ApiResponse({
      statuscode: 200,
      message: "Password successfully updated",
    }),
  );
});
