// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZOup5dZj5jrx6JirInSON58u7hRLywkk",
  authDomain: "gs-login-a4bbf.firebaseapp.com",
  projectId: "gs-login-a4bbf",
  storageBucket: "gs-login-a4bbf.firebasestorage.app",
  messagingSenderId: "894060511384",
  appId: "1:894060511384:web:7cfb297394f66c7032d0ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Debug: Check if Firebase is properly initialized
console.log('Firebase initialized:', {
  auth: !!auth,
  db: !!db,
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

export default app;


