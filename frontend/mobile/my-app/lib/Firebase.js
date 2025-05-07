import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Initialize Auth with proper persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth, app };