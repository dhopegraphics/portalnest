document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("institution-signup-form");

    if (signupForm) {
        signupForm.addEventListener("submit", function(event) {
            event.preventDefault();
            
            const name = document.getElementById("institution-name").value;
            const email = document.getElementById("admin-email").value;
            const password = document.getElementById("admin-password").value;
            const code = document.getElementById("institution-code").value;
            const address = document.getElementById("institution-address").value;

            if (name && email && password && code && address) {
                alert("Institution Registered Successfully!");
                window.location.href = "manager-signin.html"; // Redirect to login
            } else {
                alert("Please fill out all fields.");
            }
        });
    }
});
