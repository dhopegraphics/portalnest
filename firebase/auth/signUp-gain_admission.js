import { auth, db } from "../firebaseconfig.js";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { doc, setDoc, collection, query, where, getDocs, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async function () {
    const signUpButton = document.querySelector(".log-in"); // "Create An Account" button

    signUpButton.addEventListener("click", async function () {
        const email = document.querySelector(".email input").value;
        const password = document.querySelector("#password-form input").value;

        if (!email || !password) {
            showAlert("⚠️ Please enter both email and password.");
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

            // ✅ Step 3: Get the last used student ID
            const lastUserQuery = query(usersCollection, orderBy("user_id", "desc"), limit(1));
            const lastUserSnapshot = await getDocs(lastUserQuery);

            let newStudentNumber = 1; // Default if no users exist

            if (!lastUserSnapshot.empty) {
                const lastUserId = lastUserSnapshot.docs[0].id; // Get last document ID (e.g., "student5")
                const lastNumber = parseInt(lastUserId.replace("student", "")) || 0; // Extract number (5)
                newStudentNumber = lastNumber + 1; // Increment properly
            }

            const documentId = `student${newStudentNumber}`; // Generate next unique ID

            // ✅ Step 4: Create User in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ✅ Step 5: Store User Data in Firestore
            const userData = {
                email: email,
                full_name: null, 
                user_id: user.uid,
                institution_code: null,
                phone_number: null,
                staff_code: null,
                student_id: null,
                user_type: "Student",
                username: null,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            };

            await setDoc(doc(db, "users", documentId), userData);
// ✅ Save login state (keep user logged in)
localStorage.setItem("userLoggedIn", "true");
localStorage.setItem("loggedInUserEmail", email);

            // ✅ Step 6: Stop Loading Effect & Redirect
            signUpButton.classList.remove("loading");
            showAlert("🎉 Sign Up Successful! Redirecting...");

            setTimeout(() => {
                window.location.href = "/pages/admission/application-form.html";
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

    alertMessage.innerText = message; // Set alert message
    alertBox.classList.remove("hidden");
    alertBox.classList.add("show");

    // Close alert when clicking the button
    closeAlert.onclick = function () {
        alertBox.classList.add("hidden");
        alertBox.classList.remove("show");
    };
}

document.querySelector(".log-in").addEventListener("click", function () {
    document.querySelectorAll("input").forEach(input => {
        localStorage.removeItem(input.name);
    });
});