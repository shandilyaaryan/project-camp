import { ApiResponse } from "../utils/api-response";
import asynchandler from "../utils/async-handler";

const healthCheck = asynchandler(async (req, res, next) => {
    res.status(200).json(new ApiResponse(200, { message: "Server working fine"}))
})
export default healthCheck;
