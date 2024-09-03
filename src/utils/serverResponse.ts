import { Response } from "express"

export function sendSuccessResponse(res: Response, data: any) {
    res.status(200).send({
        data: data,
        error: null
    });
};

export function sendFailureResponse(res: Response, errorMessage: string, errorCode: number) {
    res.status(errorCode).send({
        data: null,
        error: errorMessage
    });
};