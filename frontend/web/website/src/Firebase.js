// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaJxPU2OXZhJ7EaTmtdiGgLF6I5smx06s",
  authDomain: "cos30049-park-guide-management.firebaseapp.com",
  projectId: "cos30049-park-guide-management",
  storageBucket: "cos30049-park-guide-management.firebasestorage.app",
  messagingSenderId: "624295518895",
  appId: "1:624295518895:web:11cc813604b3cc8ccbaa5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);