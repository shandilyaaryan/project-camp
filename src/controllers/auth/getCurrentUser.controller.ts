import { ApiResponse, asynchandler } from "../../utils";

export const getCurrentUser = asynchandler((req, res) => {
    return res.status(200).json(
        new ApiResponse({
            statuscode: 200,
            data: req.user,
            message: "Current user fetched successfully"
        })
    )
})