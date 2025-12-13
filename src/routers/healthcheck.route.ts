import { Router } from "express";
import { healthCheck } from "../controllers";

export const healthCheckRouter = Router();

healthCheckRouter.get("/", healthCheck);
