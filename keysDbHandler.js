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
    const key = userId;
    console.log("key: " + key);
    try {
        const encryptedCreds = await kvDb.get(key, { asBuffer: false });
        const bytes = aes.decrypt(encryptedCreds, secret);
        const decryptedCreds = JSON.parse(bytes.toString(utf8));
        console.log("decryptedCreds: " + JSON.stringify(decryptedCreds))
        return decryptedCreds;
    } catch(e) {
        throw new Error("error with saving keys");
    }
}

// creds: {apiKey: String, apiSecret: String}
export async function setCredentials(userId, creds) {
    const encryptedCreds = aes.encrypt(JSON.stringify(creds), secret).toString();
    return kvDb.put(userId, encryptedCreds, { sync: true });
}

// (async function() {
//     console.log("hihi");
//     // await setCredentials("bWll0qr79mYQv06Nu58WYbT3ZYy2", {key: "testing", secret: "testing"});
//     console.log(await getCredentials("bWll0qr79mYQv06Nu58WYbT3ZYy2"));
// })();