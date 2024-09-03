const allowedIps = ""

export function checkSafeIp(ip){
    try {
        const thisIpArray = ip.split("."), allowedIpsArray = JSON.parse(allowedIps).map((element) => element.split("."));
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

export function corsFix(req, res, next){
    const ip = req.headers["x-forwarded-for"];
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
    // if(checkSafeIp(ip)) res.setHeader("Access-Control-Allow-Origin", ip);
    // res.setHeader("Access-Control-Allow-Origin", "http://3.110.186.202");

    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    // Request headers you wish to allow
    // res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.setHeader("Access-Control-Allow-Headers", "*");

    // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Pass to next layer of middleware
    return next();
}