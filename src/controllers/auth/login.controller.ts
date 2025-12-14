import {
  SAFE_USER_PROJECTION,
  UserModel,
  type SafeUser,
} from "../../models/user.models";
import { issueTokenForUser } from "../../services";
import { ApiError, ApiResponse, asynchandler } from "../../utils";
import { authCookieOptions } from "../../utils/cookie";

export const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError({
      statuscode: 400,
      message: "You are not registered please register before login",
    });
  }
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new ApiError({
      statuscode: 400,
      message: "Incorrect Password. Please try again.",
    });
  }
  const { accessToken, refreshToken } = await issueTokenForUser(user);

  const loggedInUser: SafeUser = await UserModel.findById(user._id).select(
    SAFE_USER_PROJECTION,
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, authCookieOptions)
    .cookie("refreshToken", refreshToken, authCookieOptions)
    .json(
      new ApiResponse({
        statuscode: 200,
        data: {
          user: loggedInUser,
        },
        message: "User logged in successfully",
      }),
    );
});
