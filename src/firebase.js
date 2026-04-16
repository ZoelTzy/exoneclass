// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"

import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyC-GIuSgMM259niXe8MoWPQoC15yGxCDYs",
  authDomain: "x1gallery.firebaseapp.com",
  projectId: "x1gallery",
  storageBucket: "x1gallery.firebasestorage.app",
  messagingSenderId: "133639907548",
  appId: "1:133639907548:web:514da717c5800af4f42c19",
  measurementId: "G-JL968PSVMG"


};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();