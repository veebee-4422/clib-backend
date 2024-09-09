// import redis from "redis";
// import { config as dotenvConfig } from "dotenv";

// const { subscribedEvents } = require("./redisPubSub.js");

// dotenvConfig();

// const devEnv = process.env.REDIS === "DEVELOPMENT";
// const redisHost = devEnv ? process.env.REDIS_HOST_DEVELOPMENT : process.env.REDIS_HOST_PRODUCTION
// const redisUrl = `redis://${redisHost}:6379`;

// let mainReady = false;
// let pubReady = false;
// let subReady = false;
// let mainResolved = false;
// let pubResolved = false;
// let subResolved = false;

// const redisClient = redis.createClient({
//     url: redisUrl,
//     legacyMode: false
// });

// const publisherClient = redisClient.duplicate();
// const subscriberClient = redisClient.duplicate();

// async function mainPromiseGenerator() {
//     try {
//         const connectedRedisClient = await publisherClient.connect();
//         mainReady = true;

//         connectedRedisClient.on("error", (error) => {
//             mainReady = false;
//             console.log("REDIS PUBLISHER", error.message, new Date());
//         });

//         return connectedRedisClient;
//     } catch (error) {
//         mainReady = false;
//         return publisherClient;
//     } finally {
//         mainResolved = true
//     }
//     // return redisClient.connect()
//     //     .then((connectedRedisClient) => {
//     //         mainReady = true;
//     //         connectedRedisClient.on("error", (error) => {
//     //             mainReady = false;
//     //             console.log("REDIS CLIENT", error.message, new Date());
//     //         });

//     //         return connectedRedisClient;
//     //     })
//     //     .catch(err => mainReady = false)
//     //     .finally(() => mainResolved = true);
// }

// async function pubPromiseGenerator() {
//     try {
//         const connectedRedisClient = await publisherClient.connect();
//         pubReady = true;

//         connectedRedisClient.on("error", (error) => {
//             pubReady = false;
//             console.log("REDIS PUBLISHER", error.message, new Date());
//         });

//         return connectedRedisClient;
//     } catch (error) {
//         pubReady = false;
//         return publisherClient;
//     } finally {
//         pubResolved = true
//     }
// }

// async function subPromiseGenerator() {
//     try {
//         const connectedRedisClient = await publisherClient.connect();
//         pubReady = true;

//         connectedRedisClient.on("error", (error) => {
//             pubReady = false;
//             console.log("REDIS PUBLISHER", error.message, new Date());
//         });

//         return connectedRedisClient;
//     } catch (error) {
//         pubReady = false;
//         return publisherClient;
//     } finally {
//         pubResolved = true
//     }
//     // return subscriberClient.connect()
//     //     .then((connectedRedisClient) => {
//     //         subReady = true;
//     //         connectedRedisClient.on("error", (error) => {
//     //             subReady = false;
//     //             console.log("REDIS SUBSCRIBER", error.message, new Date());
//     //         });

//     //         return connectedRedisClient;
//     //     })
//     //     .catch(err => subReady = false)
//     //     .finally(() => subResolved = true);
// }

// let mainConnectionPromise = mainPromiseGenerator();
// let publisherConnectionPromise = pubPromiseGenerator();
// let subscriberConnectionPromise = subPromiseGenerator();

// async function initialConnections() {
//     await mainConnectionPromise;
//     await publisherConnectionPromise;
//     await subscriberConnectionPromise;

//     redisClient.on("error", (error) => {
//         mainReady = false;
//         console.log("REDIS CLIENT 2", error.message, new Date());
//     });
//     publisherClient.on("error", (error) => {
//         pubReady = false;
//         console.log("REDIS PUBLISHER", error.message, new Date());
//     });
//     subscriberClient.on("error", (error) => {
//         subReady = false;
//         console.log("REDIS SUBSCRIBER", error.message, new Date());
//     });

//     for (let i = 0; i < subscribedEvents.length; i++) {
//         await awaitSubConnection();
//         const [eventName, eventHandler] = subscribedEvents[i];
//         await subscriberClient.subscribe(eventName, eventHandler);
//     }
// }

// // initialConnections();

// async function awaitMainConnection() {
//     if (mainReady) return;
//     if (!mainResolved) {
//         await redisClient.disconnect();
//         mainConnectionPromise = mainPromiseGenerator();
//     }
//     await mainConnectionPromise;
// }

// async function awaitPubConnection() {
//     if (pubReady) return;
//     if (!pubResolved) {
//         await publisherClient.disconnect();
//         publisherConnectionPromise = pubPromiseGenerator();
//     }
//     await publisherConnectionPromise;
// }

// async function awaitSubConnection() {
//     if (subReady) return;
//     if (!subResolved) {
//         await subscriberClient.disconnect();
//         subscriberConnectionPromise = subPromiseGenerator();
//     }
//     await subscriberConnectionPromise;
// }

// async function publishRedisEvent(eventName, eventObject) {
//     await awaitPubConnection();
//     const publishResult = await publisherClient.publish(eventName, JSON.stringify(eventObject));
//     return Boolean(publishResult);
// }

// async function sendCommand(commandArray) {
//     await awaitMainConnection();
//     return await redisClient.sendCommand(commandArray);
// }

// async function checkBaseKey(keyPattern) {
//     await awaitMainConnection();
//     return await redisClient.sendCommand(["KEYS", keyPattern]);
// }

// async function dropCache() {
//     await awaitMainConnection();
//     await redisClient.flushAll();
// };

// async function setCache(key, exTime, data) {
//     await awaitMainConnection();
//     return await redisClient.setEx(key, exTime, JSON.stringify(data));
// };

// async function setCacheRaw(key, exTime, data) {
//     await awaitMainConnection();
//     return await redisClient.setEx(key, exTime, data);
// };

// async function getCache(baseKey, suffixKeyArray = [null]) {
//     await awaitMainConnection();
//     let results = [];
//     for (let i = 0; i < suffixKeyArray.length; i++) {
//         const data = await redisClient.get(suffixKeyArray[i] ? `${baseKey}:${suffixKeyArray[i]}` : baseKey)
//         results.push(JSON.parse(data));
//         // console.log("Cache hit");
//         if (i === suffixKeyArray.length - 1) return suffixKeyArray[0] ? results : results[0];
//     }
// };

// async function getCacheSingle(baseKey) {
//     await awaitMainConnection();
//     const data = await redisClient.get(baseKey);
//     return JSON.parse(data);
// };

// async function getCacheSingleRaw(baseKey) {
//     await awaitMainConnection();
//     const data = await redisClient.get(baseKey);
//     return data;
// };

// // SearchValue === null means you dont have any requirements, you want all the data from the table
// async function getSetSearchCache(table, pk, searchField, searchValue, exTime, getFreshData) {
//     if (searchValue && !searchValue.length) searchValue = [searchValue];
//     let newData = [];
//     const keys = await checkBaseKey(table);
//     if (keys.length) {
//         for (let i = 0; i < keys.length; i++) {
//             const data = JSON.parse(await redisClient.get(keys[i]));
//             if (!searchValue || searchValue.includes(data[searchField])) newData.push(data);
//         }
//     } else {
//         const freshData = await getFreshData();
//         for (let i = 0; i < freshData.length; i++) {
//             if (!searchValue || searchValue.includes(freshData[i][searchField])) newData.push(freshData[i]);
//             await redisClient.setEx(`${table}:${freshData[i][pk]}`, exTime, JSON.stringify(freshData[i]));
//         }
//     }
//     return newData;
// };

// async function checkCache(key) {
//     await awaitMainConnection();
//     const results = await redisClient.sendCommand(["EXISTS", key]);
//     return Boolean(results);
// }

// async function deleteKey(key) {
//     await awaitMainConnection();
//     return await redisClient.sendCommand(["DEL", key]);
// }

// module.exports = {
//     sendCommand,
//     getSetSearchCache,
//     getCache,
//     setCache,
//     setCacheRaw,
//     dropCache,
//     checkCache,
//     getCacheSingle,
//     getCacheSingleRaw,
//     deleteKey,
//     checkBaseKey,
//     publishRedisEvent,
// };