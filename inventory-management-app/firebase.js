// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAewkX3g5DzWgU2qSMJLPw55lNMj50q3A",
  authDomain: "inventory-management-13c8a.firebaseapp.com",
  projectId: "inventory-management-13c8a",
  storageBucket: "inventory-management-13c8a.appspot.com",
  messagingSenderId: "335636893726",
  appId: "1:335636893726:web:78a90db14df3dc6eea1e0f",
  measurementId: "G-KH4QJPKWQN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

export {firestore}

