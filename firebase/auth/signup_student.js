import { auth } from "../firebaseconfig.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const signUpButton = document.querySelector(".log-in"); // The 'Create An Account' button

    signUpButton.addEventListener("click", function () {
        const email = document.querySelector(".email input").value;
        const password = document.querySelector("#password-form input").value;
        const institutionCode = document.querySelector("#institution-form input").value;
        const studentId = document.querySelector("#student-id-form input").value;

        if (!email || !password || !institutionCode || !studentId) {
            alert("Please fill in all fields.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User Registered:", userCredential.user);
                alert("Sign Up Successful! You can now log in.");
                window.location.href = "/login.html"; // Redirect to login page
            })
            .catch((error) => {
                console.error("Error:", error.message);
                alert("Sign Up Failed: " + error.message);
            });
    });
});