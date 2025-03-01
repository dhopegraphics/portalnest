function loadForm(formType) {
  const authContainer = document.getElementById("authContainer");
  const formStyle = document.getElementById("formStyle");
  const filePath = formType === "signup" ? "/components/sign-up-forms.html" : "/components/sign-in-forms.html";
  const stylePath = formType === "signup" ? "/style/sign-up-style.css" : "/style/sign-in-style.css";

   // Fetch the corresponding form
   fetch(filePath)
   .then(response => response.text())
   .then(html => {
       authContainer.innerHTML = html;
       formStyle.href = stylePath; // Switch styles dynamically

       // Wait for DOM update, then attach event listeners
       setTimeout(() => {
           if (formType === "signup") {
               // Attach event listener to the existing back button
               const backButton = document.getElementById("back-icon");
               if (backButton) {
                   backButton.addEventListener("click", function () {
                       document.querySelector(".container").classList.remove("sign-up");
                       setTimeout(() => {
                        loadForm("signin");
                    }, 400); // 🔹 Matches animation duration
                });
            }
           } else {
               // Attach event listener to switch to Sign-Up
               const signUpNow = document.getElementById("signUpNow");
               if (signUpNow) {
                   signUpNow.addEventListener("click", function () {
                       document.querySelector(".container").classList.add("sign-up");
                       loadForm("signup");
                   });
               }
           }
       }, 400); // Small delay ensures the elements exist before adding event listeners
   })
   .catch(error => console.error("Error loading the form:", error));
}

// Initial load (default to Sign-In form)
document.addEventListener("DOMContentLoaded", function () {
loadForm("signin");
});