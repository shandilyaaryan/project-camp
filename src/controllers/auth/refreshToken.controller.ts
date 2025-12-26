import { UserModel } from "../../models";
import { issueTokenForUser } from "../../services";
import {
  ApiError,
  ApiResponse,
  asynchandler,
  authCookieOptions,
} from "../../utils";
import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";

interface RefreshTokenPayload extends JwtPayload {
  _id: string;
}

export const refreshAccessToken = asynchandler(async (req, res) => {
  const userRefreshToken = req.cookies?.refreshToken;
  if (!userRefreshToken) {
    throw new ApiError({
      statusCode: 401,
      message: "Refresh Token not found",
    });
  }
  let decoded: RefreshTokenPayload;
  try {
    decoded = jwt.verify(
      userRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret,
    ) as RefreshTokenPayload;
  } catch (error) {
    throw new ApiError({
      statusCode: 401,
      message: "Token is invalid or expired",
    });
  }

  const user = await UserModel.findOne({
    _id: decoded?._id,
    refreshToken: userRefreshToken,
  });
  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid token",
    });
  }

  const { accessToken, refreshToken } = await issueTokenForUser(user);
  res
    .status(200)
    .cookie("accessToken", accessToken, authCookieOptions)
    .cookie("refreshToken", refreshToken, authCookieOptions)
    .json(
      new ApiResponse({
        statusCode: 200,
        message: "Access Token successfully refreshed",
      }),
    );
});
