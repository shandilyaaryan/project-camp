import { UserModel } from "../../models";
import {
  ApiResponse,
  asynchandler,
  resetPasswordMailgenContent,
  sendEmail,
} from "../../utils";

export const forgotPassword = asynchandler(async (req, res) => {
  const email = req.body.email;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Email successfully sent to the registered email address.",
      }),
    );
  }
  const { hashedToken, unhashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  await user.updateOne({
    $set: {
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiry: tokenExpiry,
    },
  });
  await sendEmail({
    email: user?.email,
    subject: "Reset your account's password",
    mailGenContent: resetPasswordMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/reset-password/${unhashedToken}`,
    ),
  });
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Email successfully sent to the registered email address.",
    }),
  );
});
