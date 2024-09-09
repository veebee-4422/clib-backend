import { NextFunction, Request, Response } from "express";

export async function delayApi(req: Request, res: Response, next: NextFunction){
    setTimeout(next, 30);
}