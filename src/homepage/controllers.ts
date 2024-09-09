
import { Request, Response, NextFunction } from "express";

import { sendSuccessResponse, sendFailureResponse } from "../utils/serverResponse.js";
import { getRecommendations} from "./services.js";

export async function getHomepageData(req: Request, res: Response, next: NextFunction) {
	try {
		const recommendations = await getRecommendations();

		return sendSuccessResponse(res, recommendations);
	} catch (error) {
		console.log("registerUser: ", error);

		return sendFailureResponse(res, error.message, error.statusCode || 500);
	}
}