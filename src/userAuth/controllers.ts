
import { Request, Response, NextFunction } from "express";

import { BadRequestError } from "../utils/customErrors.js";
import { sendSuccessResponse, sendFailureResponse } from "../utils/serverResponse.js";
import { getUserSaltHash, generateSaltHash, createUser, checkPassword } from "./services.js";

export async function registerUser(req: Request, res: Response, next: NextFunction) {
	try {
		const userEmail = req.body.user_email;
		const providedPassword = req.body.password;

		const userInfo = await getUserSaltHash(userEmail);
		if (userInfo) throw new BadRequestError("An account with the provided UserId/Email already exists.");

		const { generatedSalt, generatedHash } = await generateSaltHash(providedPassword);

		await createUser(userEmail, generatedHash, generatedSalt);

		return sendSuccessResponse(res, true);
	} catch (error) {
		console.log("registerUser: ", error);

		return sendFailureResponse(res, error.message, error.statusCode || 500);
	}
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
	try {
		const userEmail = req.body.user_email;
		const providedPassword = req.body.password;

		const userInfo = await getUserSaltHash(userEmail);
		if (!userInfo) throw new BadRequestError("An account with the provided UserId/Email does not exist.");

		const correctPassword = await checkPassword(providedPassword, userInfo.user_hash, userInfo.user_salt);
		if(!correctPassword) throw new BadRequestError("Incorrect credentials.");

		return sendSuccessResponse(res, true);
	} catch (error) {
		console.log("loginUser: ", error);

		return sendFailureResponse(res, error.message, error.statusCode || 500);
	}
}