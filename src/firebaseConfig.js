// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj2KfZICXDYgMxTrE3M6Ti6GaoYN-cu6g",
  authDomain: "liinkdin-clone.firebaseapp.com",
  projectId: "liinkdin-clone",
  storageBucket: "liinkdin-clone.firebasestorage.app",
  messagingSenderId: "890524016367",
  appId: "1:890524016367:web:7b7d4612ae1d36d3a2851a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

 const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);

export default db;
