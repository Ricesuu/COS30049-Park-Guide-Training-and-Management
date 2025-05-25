// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

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

// Initialize and configure auth persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export { auth }