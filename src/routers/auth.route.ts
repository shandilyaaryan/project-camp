import { Router } from "express";
import {
  changePassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  verifyEmail,
} from "../controllers";
import { authMiddleware, validate } from "../middlewares";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from "../validators";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), registerUser);
authRouter.post("/login", validate(loginSchema), loginUser);

// Protected Routes
authRouter.post("/logout", authMiddleware, logoutUser);
authRouter.get("/current-user", authMiddleware, getCurrentUser);
authRouter.post(
  "/change-password",
  authMiddleware,
  validate(changePasswordSchema),
  changePassword,
);
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.post("/verify-email/:verificationToken", verifyEmail);
