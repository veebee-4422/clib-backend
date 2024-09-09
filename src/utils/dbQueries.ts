import fs from "fs"

import {
    mainDb,
    mainDbMulti,
    localDb,
    localDbMulti,
} from "./mainDbConfig";

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

function log(query = "", params: any[] = [], time = 0, queryType = "") {
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

    let writeFunc: any = fs.appendFile;
    if (Math.random() < 0.01 && (fs.statSync(logFilePath)).size > 2 ** 25) writeFunc = fs.writeFileSync; // 2**25 ~ 32MB

    writeFunc(logFilePath, logMessage, (error: Error) => {
        if (error) console.log("DBlog", error);
        console.log(`SQL query took: ${time}ms, details appended to the log file. Type: ${queryType}, Caller: ${getCaller()}`);
    });
}

export async function makeQuery(query: string, params: any[] = [], multipleQueries = false) {
    const now = Date.now();
    const [queryResults, fieldResults] = multipleQueries ? await mainDbMulti.execute(query, params) :
        await mainDb.execute(query, params);
    if (Date.now() - now > latencyThreshold) log(query, params, Date.now() - now, "makeQuery");

    return queryResults;
}

export async function makeLocalQuery(query: string, params: any[] = [], multipleQueries = false) {
    const now = Date.now();
    const [queryResults, fieldResults] = multipleQueries ? await localDbMulti.execute(query, params) :
        await localDb.execute(query, params);
    if (Date.now() - now > latencyThreshold) log(query, params, Date.now() - now, "makeLocalQuery")

    return queryResults;
}

export async function makeCustomSqlQuery(args: [string, any[] | undefined, boolean | undefined], dbName = "MAIN") {
    if (dbName === "LOCAL") {
        return await makeLocalQuery(...args);
    }
    return await makeQuery(...args);
}