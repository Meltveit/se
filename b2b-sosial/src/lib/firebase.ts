import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCyPn-Lhu7smXuYleDFBqwuiAH1r71Y4xs",
    authDomain: "bsocial-5872f.firebaseapp.com",
    projectId: "bsocial-5872f",
    storageBucket: "bsocial-5872f.firebasestorage.app",
    messagingSenderId: "680948415961",
    appId: "1:680948415961:web:e3a115fd3e90bc080e6dc8",
    measurementId: "G-P1R7R2T9VZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);