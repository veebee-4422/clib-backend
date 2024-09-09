
import { Request, Response, NextFunction } from "express";

import { BadRequestError, InternalServerError } from "../utils/customErrors";
import { sendSuccessResponse, sendFailureResponse } from "../utils/serverResponse";
import { getUserSaltHash, generateSaltHash, createUser, checkPassword } from "./services";
import { generateJwt } from "../middleware/jwtAuth";

export async function registerUser(req: Request, res: Response, next: NextFunction) {
	try {
		const userEmail = req.body.user_email;
		const providedPassword = req.body.password;

		const userInfo = await getUserSaltHash(userEmail);
		if (userInfo) throw new BadRequestError("An account with the provided UserId/Email already exists.");

		const { generatedSalt, generatedHash } = await generateSaltHash(providedPassword);

		const insertInfo = await createUser(userEmail, generatedHash, generatedSalt);

		const generatedJwt = generateJwt(insertInfo.insertId);
		if (!generatedJwt) throw new InternalServerError("JWT generation failed.");

		return sendSuccessResponse(res, { token: generatedJwt });
	} catch (error) {
		console.log("registerUser: ", error);

		return sendFailureResponse(res, error.message, error.statusCode || 500);
	}
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
	try {
		const userEmail = req.body.user_email as string;
		const providedPassword = req.body.password as string;

		const userInfo = await getUserSaltHash(userEmail);
		if (!userInfo) throw new BadRequestError("An account with the provided UserId/Email does not exist.");

		const correctPassword = await checkPassword(providedPassword, userInfo.user_hash, userInfo.user_salt);
		if (!correctPassword) throw new BadRequestError("Incorrect credentials.");

		const generatedJwt = generateJwt(userInfo.id);
		if (!generatedJwt) throw new InternalServerError("JWT generation failed.");

		return sendSuccessResponse(res, { token: generatedJwt });
	} catch (error) {
		console.log("loginUser: ", error);

		return sendFailureResponse(res, error.message, error.statusCode || 500);
	}
}