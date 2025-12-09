import type { Request, Response } from "express";
import { ApiResponse } from "../utils/api-response";

const healthCheck = (req: Request, res: Response) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, { message: "Server is running" }));
  } catch (error) {}
};
export default healthCheck;
