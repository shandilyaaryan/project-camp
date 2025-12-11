import { ApiResponse } from "../utils/api-response";
import asynchandler from "../utils/async-handler";

const healthCheck = asynchandler(async (req, res, next) => {
  res.status(200).json(
    new ApiResponse({
      statuscode: 200,
      data: { message: "Server is running" },
    }),
  );
});
export default healthCheck;
