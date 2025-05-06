// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzSMZt_rCiaQmB6cF_9VLOLekkeiWlBu8",
  authDomain: "mjk-dokter.firebaseapp.com",
  projectId: "mjk-dokter",
  storageBucket: "mjk-dokter.firebasestorage.app",
  messagingSenderId: "695540643402",
  appId: "1:695540643402:web:85a58f779524e9f72098b3",
  measurementId: "G-RLEY3Y6VD3",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };