// Import the functions you need from the SDKs you need
//import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDST-IihTe1smCa_gniua3XyDb28UFQI5c",
  authDomain: "restaurant-b9c2c.firebaseapp.com",
  projectId: "restaurant-b9c2c",
  storageBucket: "restaurant-b9c2c.firebasestorage.app",
  messagingSenderId: "22843503611",
  appId: "1:22843503611:web:25099701e3d7ad16e1915e",
  measurementId: "G-4ZN0XZF5V3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);