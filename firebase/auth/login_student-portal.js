import { auth } from "../firebaseconfig.js";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Ensure user stays logged in
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Persistence set to local."))
  .catch(error => console.error("Persistence error:", error.message));

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector(".btn.login-btn");

    loginButton.addEventListener("click", async function () {
        const email = document.querySelector(".email-signIn").value.trim();
        const password = document.querySelector(".password-signIn").value.trim();
        const rememberMeCheckbox = document.querySelector(".checker");

        if (!email || !password) {
            showAlert("⚠️ Please enter both email and password.");
            return;
        }

        loginButton.classList.add("loading"); // Start Loading Animation

        try {
            // ✅ Sign In with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                showAlert("⚠️ Please verify your email before logging in.");
                loginButton.classList.remove("loading");
                return;
            }

            // ✅ Store User Data in LocalStorage (Only if 'Remember Me' is checked)
            if (rememberMeCheckbox.classList.contains("checked")) {
                localStorage.setItem("userLoggedIn", "true");
                localStorage.setItem("loggedInUserEmail", user.email);
                localStorage.setItem("user_id", user.uid);
            }

            loginButton.classList.remove("loading");

            showAlert("✅ Login Successful! Redirecting...", () => {
                window.location.href = "/pages/Student-Portal/index.html";
            });

        } catch (error) {
            console.error("Login Error:", error.message);
            showAlert("❌ Login Failed: " + error.message);
            loginButton.classList.remove("loading");
        }
    });
});

// ✅ Function to Show Custom Alert
function showAlert(message, callback = null) {
    const alertBox = document.getElementById("custom-alert");
    const alertMessage = document.getElementById("alert-message");
    const closeAlert = document.getElementById("close-alert");

    alertMessage.innerText = message;
    alertBox.classList.remove("hidden");
    alertBox.classList.add("show");

    closeAlert.onclick = function () {
        alertBox.classList.add("hidden");
        alertBox.classList.remove("show");

        if (callback) {
            callback();
        }
    };
}

// ✅ Toggle "Remember Me" Checkbox
document.querySelector(".remember-me-tick").addEventListener("click", function () {
    const checker = document.querySelector(".checker");
    if (checker.classList.contains("checked")) {
        checker.classList.remove("checked");
        checker.src = "/assets/icons/check_box.svg";
    } else {
        checker.classList.add("checked");
        checker.src = "/assets/icons/check_box_checked.svg"; // Make sure this checked icon exists
    }
});