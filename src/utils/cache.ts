import redis from "redis";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const devEnv = process.env.REDIS === "DEVELOPMENT";
const redisHost = devEnv ? process.env.REDIS_HOST_DEVELOPMENT : process.env.REDIS_HOST_PRODUCTION
const redisUrl = `redis://${redisHost}:6379`;

const redisClient = redis.createClient({
    url: redisUrl,
    legacyMode: false
});

redisClient.connect()
.then((connectedRedisClient)=>{
    connectedRedisClient.on("error", error => {
        console.log("REDIS CLIENT", error.message, new Date());
    })
});

async function sendCommand(commandArray: string[]){
    return await redisClient.sendCommand(commandArray);
}

async function checkBaseKey(keyPattern: string){
    return await redisClient.sendCommand(["KEYS", keyPattern]);
}

function dropCache(){
    console.log("Cache Dropped")
    redisClient.flushAll();
};

async function setCache(key: string, exTime: number, data: any){
    try {
        return await redisClient.setEx(key, exTime, JSON.stringify(data));
    } catch (error) {
        console.log("setCache", error);
        throw error;
    }
};

async function setCacheRaw(key: string, exTime: number, data: string){
    try {
        return await redisClient.setEx(key, exTime, data);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

async function getCacheSingle(baseKey: string){
    const data = await redisClient.get(baseKey) || "{}";
    return JSON.parse(data);
};

async function getCacheSingleRaw(baseKey: string){
    return await redisClient.get(baseKey);
};

async function checkCache(key: string){
    const results = await redisClient.sendCommand(["EXISTS", key]);
    return Boolean(results);
}

async function deleteKey(key: string){
    return await redisClient.sendCommand(["DEL", key]);
}

module.exports = {
    sendCommand,
    setCache, 
    setCacheRaw, 
    dropCache, 
    checkCache, 
    getCacheSingle, 
    getCacheSingleRaw, 
    deleteKey,
    checkBaseKey,
};