
import { Request, Response, NextFunction } from "express";

import { BadRequestError } from "../utils/customErrors.js";
import { sendFailureResponse } from "../utils/serverResponse.js";
import AdminService from "./services.js";

export async function adminLogin(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = req.body.user_id;
		const providedPassword = req.body.password;

		
	} catch (error) {
		console.log("adminLogin: ", error);
		
		return sendFailureResponse(res, error.message, error.statusCode || 500);
	}
}