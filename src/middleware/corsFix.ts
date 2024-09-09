import { NextFunction, Request, Response } from "express";

const allowedIps = ""

export function checkSafeIp(ip: string){
    try {
        const thisIpArray = ip.split("."), allowedIpsArray = JSON.parse(allowedIps).map((element: string) => element.split("."));
        if(thisIpArray.length !== 4) return false;
        for(let i=0; i<allowedIpsArray.length; i++){
            let flag = false;
            for(let j=0; j<4; j++){
                if(allowedIpsArray[i][j] !== "*" && allowedIpsArray[i][j] !== thisIpArray[j]) flag = true;
            }
            if(!flag) return true;
        }

        return false;
    } catch (error) {

        return false;
    }
}

export function corsFix(req:Request, res: Response, next: NextFunction){
    // const ip = req.headers["x-forwarded-for"];
    // Website you wish to allow to connect
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // if(checkSafeIp(ip)) res.setHeader("Access-Control-Allow-Origin", ip);
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

    // Request methods you wish to allow
    // res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    // Request headers you wish to allow
    // res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    // res.setHeader("Access-Control-Allow-Headers", "*");

    // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", "false");

    // Pass to next layer of middleware
    return next();
}