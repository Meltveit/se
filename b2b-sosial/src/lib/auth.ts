import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const registerBusiness = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginBusiness = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};