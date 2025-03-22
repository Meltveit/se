import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};