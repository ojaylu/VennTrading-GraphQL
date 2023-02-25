import * as dotenv from "dotenv";
import aes from "crypto-js/aes.js";
import utf8 from "crypto-js/enc-utf8.js";
import levelup from "levelup";
import leveldown from "leveldown";
dotenv.config();

const secret = process.env.KEY;

// init db 
const kvDb = levelup(leveldown("./keysDB"));

export async function getCredentials(userId) {
    const key = process.env.TEST? "testing": userId;
    const encryptedCreds = await kvDb.get(key, { asBuffer: false });
    const bytes = aes.decrypt(encryptedCreds, secret);
    const decryptedCreds = JSON.parse(bytes.toString(utf8));
    return decryptedCreds;
}

// creds: {apiKey: String, apiSecret: String}
export async function setCredentials(userId, creds) {
    const encryptedCreds = aes.encrypt(JSON.stringify(creds), secret).toString();
    return kvDb.put(userId, encryptedCreds, { sync: true });
}

// (async function() {
//     console.log("hihi");
//     await setCredentials("testing", {apiKey: "oSLErlkBYInpC86b36vRXVuaB0WdqvLpKTKUox0Xd3VSYTr9piVHtm7oqWmw9Wve", apiSecret: "JVhgRcKn5cETyMyzvA9ydRKqc0N9YPJ5mk39RUO1IahluHR637RYg4YKE2JEtkxJ"});
//     console.log(await getCredentials("testing"));
// })();