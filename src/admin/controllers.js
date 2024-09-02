import { BadRequestError } from "../utils/customErrors.js";
import { sendFailureResponse } from "../utils/serverResponse.js";
import AdminService from "./services.js";

export async function adminLogin(req, res, next) {
	try {
		const userId = req.body.user_id;
		const providedPassword = req.body.password;

		
	} catch (error) {
		console.log("adminLogin: ", error);
		
		return sendFailureResponse(res, error.message, error.statusCode || 500);
	}
}