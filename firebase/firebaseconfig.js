// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth  } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


// Firebase Config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB23ym2RPjajlLSIZUMTG30XgxYASgPMrw",
  authDomain: "portalnest-a6e55.firebaseapp.com",
  projectId: "portalnest-a6e55",
  storageBucket: "portalnest-a6e55.firebasestorage.app",
  messagingSenderId: "541170085452",
  appId: "1:541170085452:web:9cd69d890f171637ebcee9",
  measurementId: "G-C897YQDD6N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firebase instances
export { app, db, auth };