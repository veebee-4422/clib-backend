import mysql from "mysql";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const mainDbPoolConfig = {
    connectionLimit: process.env.DB_CON_LIM,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
    host: process.env.MAIN_DB_HOST,
    user: process.env.MAIN_DB_ID,
    password: process.env.MAIN_DB_PASS,
}

const localDbPoolConfig = {
    connectionLimit: process.env.DB_CON_LIM,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
    host: process.env.LOCAL_DB_HOST,
    port: process.env.LOCAL_DB_PORT,
    user: process.env.LOCAL_DB_ID,
    password: process.env.LOCAL_DB_PASS,
}

// export const mainDb = mysql.createPool(mainDbPoolConfig);
// export const mainDbMulti = mysql.createPool({...mainDbPoolConfig, multipleStatements: true});
export const mainDb = mysql.createPool(localDbPoolConfig);
export const mainDbMulti = mysql.createPool({...localDbPoolConfig, multipleStatements: true});
export const localDb = mysql.createPool(localDbPoolConfig);
export const localDbMulti = mysql.createPool({...localDbPoolConfig, multipleStatements: true});