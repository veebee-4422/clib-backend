import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

async function checkPassword(providedPassword, storedHash, storedSalt) {
    const generatedHash = await bcrypt.hash(providedPassword, storedSalt);

    return generatedHash === storedHash;
}

async function generateSaltHash(password) {
    const generatedSalt = uuid().replaceAll("-", "");
    const generatedHash = await bcrypt.hash(password, generatedSalt);

    return { generatedSalt, generatedHash };
}

export async function registerUser(userId, password) {
    
}

console.log(uuid().replaceAll("-", ""))
