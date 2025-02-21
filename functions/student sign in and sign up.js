document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (email === "test@example.com" && password === "password123") {
                alert("Login successful!");
                window.location.href = "dashboard.html"; // Redirect after successful login
            } else {
                alert("Invalid email or password. Try again.");
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;
            const institutionCode = document.getElementById("institution-code").value;
            const studentId = document.getElementById("student-id").value;

            if (email && password && institutionCode && studentId) {
                alert("Sign Up Successful! Redirecting to login...");
                window.location.href = "index.html"; // Redirect to login
            } else {
                alert("Please fill out all fields.");
            }
        });
    }
});
