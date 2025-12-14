import { UserModel } from "../../models";
import { ApiResponse, asynchandler } from "../../utils";
import { authCookieOptions } from "../../utils/cookie";

export const logoutUser = asynchandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { refreshToken: "" },
    },
  );
  return res
    .status(200)
    .clearCookie("accessToken", authCookieOptions)
    .clearCookie("refreshToken", authCookieOptions)
    .json(
      new ApiResponse({
        statuscode: 200,
        data: {},
        message: "User successfully logged out",
      }),
    );
});
