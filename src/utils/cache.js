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

async function sendCommand(commandArray){
    return await redisClient.sendCommand(commandArray);
}

async function checkBaseKey(keyPattern){
    return await redisClient.sendCommand(["KEYS", keyPattern]);
}

function dropCache(){
    console.log("Cache Dropped")
    redisClient.flushAll();
};

async function setCache(key, exTime, data){
    try {
        return await redisClient.setEx(key, exTime, JSON.stringify(data));
    } catch (error) {
        console.log("setCache", error);
        throw error;
    }
};

async function setCacheRaw(key, exTime, data){
    try {
        return await redisClient.setEx(key, exTime, data);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

async function getCacheSingle(baseKey){
    try {
        const data = await redisClient.get(baseKey) || "{}";
        return JSON.parse(data);
    } catch (error) {
        // console.log(error);
        throw error;
    }
};

async function getCacheSingleRaw(baseKey){
    try {
        const data = await redisClient.get(baseKey);
        return data;
    } catch (error) {
        // console.log(error);
        throw error;
    }
};
// SearchValue === null means you dont have any requirements, you want all the data from the table
function getSetSearchCache(table, pk, searchField, searchValue, exTime, getFreshData){
    if(searchValue && !searchValue.length) searchValue = [searchValue];
    return new Promise(async (resolve, reject)=>{
        try {
            let newData = [];
            const keys = checkBaseKey(table);
            if(keys.length){
                keys.forEach(async (key)=>{
                    let data = JSON.parse(await redisClient.get(key));
                    if(!searchValue || searchValue.includes(data[searchField])) newData.push(data);
                })
            } else {
                let freshData = await getFreshData();
                freshData.forEach(element => {
                    if(!searchValue || searchValue.includes(element[searchField])) newData.push(element); 
                    redisClient.setEx(`${table}:${element[pk]}`, exTime, JSON.stringify(element));
                });
            }
            return resolve(newData);
        } catch (error) {
            return reject(error);
        }
    })  //promise end
};

function getSetCache(key, exTime, getFreshData){
    return new Promise((resolve, reject)=>{
        try{
            redisClient.get(key)
            .then((data)=>{
                if(data!= null){ 
                    return resolve(JSON.parse(data))
                }
                getFreshData()
                .then((freshData)=>{
                    redisClient.setEx(key, exTime, JSON.stringify(freshData));
                    return resolve(freshData); 
                })            
            })
            .catch((error)=>{
                reject(error);
            });
        } catch(error){
            console.log("getSetCache", error)
        }
    })  //promise end
};

function testCache(){
    redisClient.setEx("key", 10, "A");
}

async function checkCache(key){
    const results = await redisClient.sendCommand(["EXISTS", key]);
    return Boolean(results);
}

async function deleteKey(key){
    return await redisClient.sendCommand(["DEL", key]);
}

module.exports = {
    sendCommand, 
    searchCache, 
    getSetSearchCache,
    getSetCache, 
    getCache, 
    setCache, 
    setCacheRaw, 
    dropCache, 
    testCache, 
    checkCache, 
    getCacheSingle, 
    getCacheSingleRaw, 
    deleteKey,
    checkBaseKey,
};