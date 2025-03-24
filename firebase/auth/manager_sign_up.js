import { auth, db } from "../firebaseconfig.js";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async function () {
  const signUpButton = document.querySelector(".create-in"); // "Create An Account" button

  signUpButton.addEventListener("click", async function () {
    const email = document.querySelector(".email input").value;
    const password = document.querySelector("#password-form input").value;
    const institutionCode = document.querySelector(
      "#institution-form input"
    ).value;
    const staffCode = document.querySelector("#staff-form input").value;
    const userType = document.querySelector("#role-form select").value; // Get selected role
    // ✅ Check if all required fields are filled
    if (!email || !password || !institutionCode || !staffCode || !userType) {
      showAlert(
        "⚠️ Please fill in all fields: Email, Password, Institution Code, Staff Code, and Role."
      );
      return;
    }

    // Start Loading Animation
    signUpButton.classList.add("loading");

    try {
      // ✅ Step 1: Check if email exists in Firestore first
      const usersCollection = collection(db, "users");
      const emailQuery = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(emailQuery);

      if (!querySnapshot.empty) {
        showAlert("❌ Email already exists in our database.");
        signUpButton.classList.remove("loading");
        return;
      }

      // ✅ Step 2: Check Firebase Authentication for existing email
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        showAlert("❌ Email already in use. Please try another email.");
        signUpButton.classList.remove("loading");
        return;
      }

      // ✅ Step 3: Get the last used user ID with the same userType
      const lastUserQuery = query(
        usersCollection,
        where("user_type", "==", userType),
        orderBy("user_id", "desc"),
        limit(1)
      );
      const lastUserSnapshot = await getDocs(lastUserQuery);

      let newNumber = 1; // Default if no users exist for this type
      if (!lastUserSnapshot.empty) {
        const lastUserId = lastUserSnapshot.docs[0].id; // Get last document ID (e.g., "Lecturer5")
        const lastNumber = parseInt(lastUserId.replace(userType, "")) || 0;
        newNumber = lastNumber + 1;
      }

      // ✅ Generate document ID using selected user type
      const documentId = `${userType}${newNumber}`; // Example: "Lecturer1", "Administrator2"

      // ✅ Step 4: Create User in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Step 5: Store User Data in Firestore (Now includes institution_code & staff_code)
      const userData = {
        email: email,
        full_name: null,
        user_id: user.uid,
        institution_code: institutionCode, // Store institution code
        staff_code: staffCode, // Store staff code
        phone_number: null,
        user_type: userType, // ✅ Store selected user type
        username: null,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };

      await setDoc(doc(db, "users", documentId), userData);

      // ✅ Step 6: Stop Loading Effect & Redirect
      signUpButton.classList.remove("loading");
      showAlert("🎉 Sign Up Successful! Redirecting...");

      setTimeout(() => {
        window.location.href = "pages/School-Managers/index.html";
      }, 2000);
    } catch (error) {
      console.error("Error:", error.message);
      showAlert("❌ Sign Up Failed: " + error.message);
      signUpButton.classList.remove("loading");
    }
  });
});

// Function to Show Custom Alert
function showAlert(message) {
  const alertBox = document.getElementById("custom-alert");
  const alertMessage = document.getElementById("alert-message");
  const closeAlert = document.getElementById("close-alert");

  alertMessage.innerText = message;
  alertBox.classList.remove("hidden");
  alertBox.classList.add("show");

  // Close alert when clicking the button
  closeAlert.onclick = function () {
    alertBox.classList.add("hidden");
    alertBox.classList.remove("show");
  };
}

// Clear stored inputs after sign-up
document.querySelector(".create-in").addEventListener("click", function () {
  document.querySelectorAll("input").forEach((input) => {
    localStorage.removeItem(input.name);
  });
});
``;
