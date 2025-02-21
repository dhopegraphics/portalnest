document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("manager-login-form");
    const signupForm = document.getElementById("manager-signup-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const email = document.getElementById("manager-email").value;
            const password = document.getElementById("manager-password").value;

            if (email === "manager@example.com" && password === "manager123") {
                alert("Login successful!");
                window.location.href = "manager-dashboard.html"; // Redirect to manager dashboard
            } else {
                alert("Invalid email or password. Try again.");
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const name = document.getElementById("manager-name").value;
            const email = document.getElementById("manager-email").value;
            const password = document.getElementById("manager-password").value;
            const organization = document.getElementById("organization").value;

            if (name && email && password && organization) {
                alert("Sign Up Successful! Redirecting to login...");
                window.location.href = "manager-signin.html"; // Redirect to login
            } else {
                alert("Please fill out all fields.");
            }
        });
    }
});
