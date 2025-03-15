// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth  } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


// Firebase Config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAX2K0TK_qaQWcT8TayXVfz57EAluzRXY",
  authDomain: "portalnest-82470.firebaseapp.com",
  projectId: "portalnest-82470",
  storageBucket: "portalnest-82470.firebasestorage.app",
  messagingSenderId: "351167922561",
  appId: "1:351167922561:web:5c216dc987bee78d306880"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firebase instances
export { app, db, auth };