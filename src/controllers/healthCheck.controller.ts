import { ApiResponse, asynchandler } from "../utils";

export const healthCheck = asynchandler(async (req, res, next) => {
  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Server is running...",
    }),
  );
});
