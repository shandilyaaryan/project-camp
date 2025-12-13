import { UserModel, type SafeUser } from "../models/user.models";
import { ApiError, ApiResponse, asynchandler } from "../utils";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail";

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
export const registerUser = asynchandler(async (req, res) => {
  const { email, username, password } = req.body;

  const existingUser = await UserModel.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError({
      statuscode: 409,
      message: "User with username or email already exists",
    });
  }

  const user = await UserModel.create({
    username,
    password,
    email,
  });
  const { hashedToken, unhashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailGenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`,
    ),
  });
  const createdUser: SafeUser = await UserModel.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  return res.status(201).json(
    new ApiResponse({
      statuscode: 201,
      data: { user: createdUser },
      message:
        "User registered successfully and verification email has been sent to your email",
    }),
  );
});

export const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError({
      statuscode: 400,
      message: "Email is required",
    });
  }

  const user = await UserModel.findOne({ email });
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
  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id.toString(),
  );

  const loggedInUser: SafeUser = await UserModel.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  const options: {
    httpOnly: true;
    secure: true;
    sameSite: "strict";
  } = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
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
