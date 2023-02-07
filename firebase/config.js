import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../firebaseAccountKey.json" assert {type: "json"};

initializeApp({
    credential: cert(serviceAccount)
});

export const auth = getAuth();
export const db = getFirestore();