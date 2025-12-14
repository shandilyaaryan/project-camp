import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth/login.controller";
import { validate } from "../middlewares/validator.middleware";
import { registerSchema } from "../validators";
import { loginSchema } from "../validators/auth/login.schema";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), registerUser);
authRouter.post("/login", validate(loginSchema), loginUser);
