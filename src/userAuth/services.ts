import bcrypt from "bcrypt";

import { makeQuery } from "../utils/dbQueries.js";

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

export async function getUserSaltHash(userEmail: string) {
    const [userInfo] = await makeQuery(`
        SELECT user_hash, user_salt
        FROM user_auth
        WHERE user_email = ?;
    `, [userEmail]);

    return userInfo
}

export async function generateSaltHash(password: string) {
    const generatedSalt = await bcrypt.genSalt(saltRounds);
    const generatedHash = await bcrypt.hash(password, generatedSalt);

    return { generatedSalt, generatedHash };
}

export async function createUser(userEmail: string, userHash: string, userSalt: string) {
    await makeQuery(`
        INSERT INTO user_auth
        (user_email, user_hash, user_salt, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?);
    `, [userEmail, userHash, userSalt, new Date(), new Date()]);
}

export async function checkPassword(providedPassword: string, storedHash: string, storedSalt: string) {
    const generatedHash = await bcrypt.hash(providedPassword, storedSalt);

    return generatedHash === storedHash;
}