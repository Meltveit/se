import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { Business } from "./types";

export const addBusiness = async (business: Omit<Business, "id">) => {
  return addDoc(collection(db, "businesses"), business);
};

export const getBusinesses = async () => {
  const snapshot = await getDocs(collection(db, "businesses"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Business));
};

export const getBusinessById = async (id: string) => {
  const docRef = doc(db, "businesses", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Business) : null;
};

export const updateBusiness = async (id: string, data: Partial<Business>) => {
  const docRef = doc(db, "businesses", id);
  return updateDoc(docRef, data);
};