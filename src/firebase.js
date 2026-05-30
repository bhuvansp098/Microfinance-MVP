// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGB8-urdlpA9GmWXPqVVhMOo9OuKyoPXY",
  authDomain: "microfinance-mvpfinal.firebaseapp.com",
  projectId: "microfinance-mvpfinal",
  storageBucket: "microfinance-mvpfinal.firebasestorage.app",
  messagingSenderId: "570312298874",
  appId: "1:570312298874:web:c34b0ba33e026541f4c6c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);