import CryptoJS from "crypto-js";

export function encryptObj(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();
}

export function decryptObj(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}