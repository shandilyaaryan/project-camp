import { UserModel, type IUser } from "../../models";
import { ApiError, ApiResponse, asynchandler } from "../../utils";
import crypto from "crypto";

export const verifyEmail = asynchandler(async (req, res) => {
  const verificationToken = req.params.verificationToken;

  if (!verificationToken) {
    throw new ApiError({
      statusCode: 401,
      message: "Verification token is missing or not found",
    });
  }

  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const user = await UserModel.findOneAndUpdate(
    {
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: { $gt: Date.now() },
    },
    {
      $set: {
        isEmailVerified: true,
      },
      $unset: {
        emailVerificationExpiry: "",
        emailVerificationToken: "",
      },
    },
  );

  if (!user) {
    throw new ApiError({
      statusCode: 400,
      message: "Invalid or Expired Token",
    });
  }
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        isEmailVerified: true,
      },
      message: "Email successfully verified",
    }),
  );
});
