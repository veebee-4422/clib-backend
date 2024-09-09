export class BadRequestError extends Error {
    public statusCode;
    constructor(message: string){
        super(message)
        this.statusCode = 400
    }
}

export class RateLimitError extends Error {
    public statusCode;
    constructor(message: string){
        super(message)
        this.statusCode = 429
    }
}

export class InternalServerError extends Error {
    public statusCode;
    constructor(message: string){
        super(message)
        this.statusCode = 500
    }
}

export class NoContentError extends Error {
    public statusCode;
    constructor(message: string){
        super(message)
        this.statusCode = 204
    }
}