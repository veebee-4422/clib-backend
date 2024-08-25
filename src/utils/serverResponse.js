export function sendSuccessResponse(res, data) {
    res.status(200).send({
        data: data,
        error: null
    });
};

export function sendFailureResponse(res, errorMessage, errorCode) {
    res.status(errorCode).send({
        data: null,
        error: errorMessage
    });
};