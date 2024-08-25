export class BadRequestError extends Error {
    constructor(message){
        super(message)
        this.statusCode = 400
    }
}

export class RateLimitError extends Error {
    constructor(message){
        super(message)
        this.statusCode = 429
    }
}

export class InternalServerError extends Error {
    constructor(message){
        super(message)
        this.statusCode = 500
    }
}