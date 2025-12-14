import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers";
import { authMiddleware, validate } from "../middlewares";
import { loginSchema, registerSchema } from "../validators";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), registerUser);
authRouter.post("/login", validate(loginSchema), loginUser);
authRouter.post("/logout", authMiddleware, logoutUser);
