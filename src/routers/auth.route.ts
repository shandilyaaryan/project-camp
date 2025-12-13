import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";
import { validate } from "../middlewares/validator.middleware";
import { registerSchema } from "../validators/auth/register.schema";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), registerUser);

export default authRouter;
