import mysql, { PoolOptions } from "mysql2/promise";
import { config as dotenvConfig } from "dotenv";



dotenvConfig();

const mainDbPoolConfig: PoolOptions = {
    connectionLimit: Number(process.env.DB_CON_LIM) | 10,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
    host: process.env.MAIN_DB_HOST,
    user: process.env.MAIN_DB_ID,
    password: process.env.MAIN_DB_PASS,
}

const localDbPoolConfig: PoolOptions = {
    connectionLimit: Number(process.env.DB_CON_LIM) | 10,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
    host: process.env.LOCAL_DB_HOST,
    port: Number(process.env.LOCAL_DB_PORT) | 3306,
    user: process.env.LOCAL_DB_ID,
    password: process.env.LOCAL_DB_PASS,
}

// export const mainDb = mysql.createPool(mainDbPoolConfig);
// export const mainDbMulti = mysql.createPool({...mainDbPoolConfig, multipleStatements: true});
export const mainDb = mysql.createPool(localDbPoolConfig);
export const mainDbMulti = mysql.createPool({...localDbPoolConfig, multipleStatements: true});
export const localDb = mysql.createPool(localDbPoolConfig);
export const localDbMulti = mysql.createPool({...localDbPoolConfig, multipleStatements: true});