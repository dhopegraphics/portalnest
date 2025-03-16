import { auth } from "../firebaseconfig.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector(".log-in");

    loginButton.addEventListener("click", async function () {
        const email = document.querySelector(".email input").value;
        const password = document.querySelector("#password-form input").value;

        if (!email || !password) {
            showAlert("⚠️ Please enter both email and password.");
            return;
        }

        loginButton.classList.add("loading"); // Start loading animation

        try {
            // ✅ Sign in user with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ✅ Store login state in localStorage
            localStorage.setItem("userLoggedIn", "true");
            localStorage.setItem("loggedInUserEmail", user.email);

            // ✅ Redirect to dashboard or another page after login
            showAlert("✅ Login Successful! Redirecting...", () => {
                window.location.href = "/dashboard.html"; // Change to your desired page
            });

        } catch (error) {
            console.error("Login Error:", error.message);
            showAlert("❌ Login Failed: " + error.message);
        } finally {
            loginButton.classList.remove("loading"); // Stop loading animation
        }
    });
});

// ✅ Keep user logged in after refresh
onAuthStateChanged(auth, (user) => {
    if (user) {
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("loggedInUserEmail", user.email);
    } else {
        localStorage.removeItem("userLoggedIn");
    }
});