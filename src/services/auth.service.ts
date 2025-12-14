import { UserModel } from "../models";
import { ApiError } from "../utils";

export const generateAccessandRefreshToken = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ApiError({
        statuscode: 404,
        message: "User not found",
      });
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError({
      statuscode: 500,
      message: "Something went wrong while generating tokens",
    });
  }
};