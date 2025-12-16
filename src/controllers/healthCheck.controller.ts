import { ApiResponse, asynchandler } from "../utils";

export const healthCheck = asynchandler(async (req, res, next) => {
  res.status(200).json(
    new ApiResponse({
      statuscode: 200,
      message: "Server is running...",
    }),
  );
});
