import CryptoJS from "crypto-js";

export function encryptObj(data, secret) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
}

export function decryptObj(ciphertext, secret) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}