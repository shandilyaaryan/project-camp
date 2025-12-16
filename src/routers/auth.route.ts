import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  verifyEmail,
} from "../controllers";
import { authMiddleware, validate } from "../middlewares";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators";
import { rateLimiter } from "../middlewares/ratelimiter.middleware";
import { resetPassword } from "../controllers/auth/resetPassword.controller";

export const authRouter = Router();

authRouter.post(
  "/register",
  rateLimiter(5, 60),
  validate(registerSchema),
  registerUser,
);
authRouter.post("/login", rateLimiter(5, 60), validate(loginSchema), loginUser);
authRouter.post("/refresh-token", rateLimiter(5, 60), refreshAccessToken);
authRouter.post(
  "/verify-email/:verificationToken",
  rateLimiter(10, 300),
  verifyEmail,
);
authRouter.post(
  "/forgot-password",
  rateLimiter(5, 60),
  validate(forgotPasswordSchema),
  forgotPassword,
);

// Protected Routes
authRouter.post("/logout", authMiddleware, logoutUser);
authRouter.get("/current-user", authMiddleware, getCurrentUser);
authRouter.post(
  "/change-password",
  authMiddleware,
  validate(changePasswordSchema),
  changePassword,
);
authRouter.post(
  "/resend-email-verification",
  authMiddleware,
  rateLimiter(3, 300),
  resendEmailVerification,
);
authRouter.post(
  "/reset-password/:resetToken",
  rateLimiter(3, 300),
  validate(resetPasswordSchema),
  resetPassword,
);
