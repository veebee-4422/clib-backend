import fs from "fs"
import util from "util"

import {
    mainDb,
    mainDbMulti,
    localDb,
    localDbMulti,
} from "./mainDbConfig.js";

const mainDbQuery = util.promisify(mainDb.query).bind(mainDb);
const mainDbMultiQuery = util.promisify(mainDbMulti.query).bind(mainDbMulti);
const localDbQuery = util.promisify(localDb.query).bind(localDb);
const localDbMultiQuery = util.promisify(localDbMulti.query).bind(localDbMulti);

const logFilePath = "./temp/logs.log";
const latencyThreshold = 300;

function getCaller() {
    try {
        throw new Error();
    } catch (e) {
        const functionName = e.stack.split("\n")[5]?.split(" ")[6];
        return functionName;
    }

}

function log(query = "", params = [], time = 0, queryType = "") {
    const logMessage = `
    ____________________________________________________________________________NEW_LOG_____________________________________________________________________________
    QUERY
    ___________
    ${query}

    PARAMS
    ___________
    ${params ? params.toString() : ""}
    ________________________________________________________________${new Date().toISOString()}___${time}ms_______________________________________________________________
    `;

    let writeFunc = fs.appendFile;
    if (Math.random() < 0.01 && (fs.statSync(logFilePath)).size > 2 ** 25) writeFunc = fs.writeFileSync; // 2**25 ~ 32MB

    writeFunc(logFilePath, logMessage, (error) => {
        if (error) console.log("DBlog", error);
        console.log(`SQL query took: ${time}ms, details appended to the log file. Type: ${queryType}, Caller: ${getCaller()}`);
    });
}

export async function makeQuery(query, params = [], multipleQueries = false) {
    const now = Date.now();
    const queryResults = multipleQueries ? await mainDbMultiQuery(query, params) :
        await mainDbQuery(query, params);
    if (Date.now() - now > latencyThreshold) log(query, params, Date.now() - now, "makeQuery").catch(e => { });

    return queryResults;
}

export async function makeLocalQuery(query, params = [], multipleQueries = false) {
    const now = Date.now();
    const queryResults = multipleQueries ? await localDbMultiQuery(query, params) :
        await localDbQuery(query, params);
    if (Date.now() - now > latencyThreshold) log(query, params, Date.now() - now, "makeLocalQuery").catch(e => { });

    return queryResults;
}

export async function makeCustomSqlQuery(args, dbName = "MAIN") {
    if (dbName === "LOCAL") {
        return await makeLocalQuery(...args);
    }
    return await makeQuery(...args);
}