import { Request, Response, NextFunction } from "express";

// import pkg from "jsonwebtoken"
import { sign as signToken, verify as verifyToken } from "jsonwebtoken"
import { InternalServerError, NoContentError } from "../utils/customErrors.js";

// const { sign: signToken, verify: verifyToken } = pkg;

const jwtSecret = process.env.JWTSECRET || "topsecret";

export function generateJwt(userId: number) {
    try {
        if(!userId) throw new InternalServerError("User ID not found.");

        const token = signToken({
                sub: userId,
            },
            jwtSecret,
            { expiresIn: "30d" }
        );

        return token;
    } catch (error) {
        console.log(`generateJwt | Error generating token: ${error.message}`);

        return null;
    }
}

export async function authMiddleware(req:Request, res: Response, next: NextFunction){
	try {
		const token = (req.headers.authorization || req.query.token as string || " ").split(" ")[1];
		if (!token) throw new NoContentError("No valid JSON Web Token provided.");

		try {
			const decoded = verifyToken(token, jwtSecret);
			req.headers.userId = decoded.sub as string;
		} catch (error) {
			const errorMessage = error.message === "jwt expired" ? "JSON Web Token expired." : error.message;
			throw new NoContentError(errorMessage);
		}

		return next();
    } catch (error) {
		console.log("authMiddleware", error.message);

		return res.status(error.statusCode || 401).send({
			status: "error",
			code: error.statusCode || 401,
			message: error.message,
			data: null
		});
    }
}

