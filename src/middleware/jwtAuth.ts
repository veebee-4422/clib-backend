import { Request, Response, NextFunction } from "express";

// import pkg from "jsonwebtoken"
import { sign as signToken, verify as verifyToken } from "jsonwebtoken"
import { InternalServerError } from "../utils/customErrors.js";

// const { sign: signToken, verify: verifyToken } = pkg;

const jwtSecret = process.env.JWTSECRET || "topsecret";

function generateJwt(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = Number(req.headers.userId);
        if(!userId) throw new InternalServerError("User ID not found.");

        const token = signToken({
                userId: userId,
            },
            jwtSecret,
            { expiresIn: "30d" }
        );

        return res.status(200).send({
            data: {
                userId: userId,
                token: token
            },
            error: null
        });
    } catch (error) {
        const errorString = `generateJwt | Error generating token: ${error.message}`;
        console.log(errorString);

        return res.status(error.statusCode || 500).send({
            data: null,
            error: errorString
        })
    }
}

function verifyJwt(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.query.userId;
        const token = signToken({
                userId: userId,
            },
            jwtSecret,
            { expiresIn: "30d" }
        );

        return token;
    } catch (error) {
        throw new Error("generateJwt | Error generating token: ");
    }
}

