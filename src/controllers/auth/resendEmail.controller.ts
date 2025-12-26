import { UserModel } from "../../models";
import {
  ApiError,
  ApiResponse,
  asynchandler,
  emailVerificationMailgenContent,
  sendEmail,
} from "../../utils";

export const resendEmailVerification = asynchandler(async (req, res) => {
  const id = req?.user?._id;
  const user = await UserModel.findById(id);
  if (!user) {
    throw new ApiError({
      statusCode: 400,
      message: "User does not exist",
    });
  }
  if (user.isEmailVerified) {
    throw new ApiError({
      statusCode: 409,
      message: "Email is already verified",
    });
  }
  const { hashedToken, unhashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });
  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    mailGenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unhashedToken}`,
    ),
  });
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Email sent successfully to the registered email",
    }),
  );
});
