// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB5kCkvmkuamrK6B9fqd6ud7cBuMP9_JUk",
  authDomain: "meetingtranslator.firebaseapp.com",
  projectId: "meetingtranslator",
  storageBucket: "meetingtranslator.firebasestorage.app",
  messagingSenderId: "805486094392",
  appId: "1:805486094392:web:bd3697a82b17b94b7cdecd",
  measurementId: "G-K14VJBJWSD",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);


export { auth, provider, signInWithPopup };




// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase
// const app = initializeApp(firebaseConfig);

