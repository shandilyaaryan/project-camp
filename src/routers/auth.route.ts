import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers";
import { authMiddleware, validate } from "../middlewares";
import { loginSchema, registerSchema } from "../validators";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), registerUser);
authRouter.post("/login", validate(loginSchema), loginUser);

// Protected Routes
authRouter.post("/logout", authMiddleware, logoutUser);
authRouter.get("/current-user", authMiddleware, getCurrentUser);
