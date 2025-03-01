document.getElementById("signUpNow").addEventListener("click", function() {
  const container = document.querySelector(".container");
  const leftPanel = document.querySelector(".left");

  // Add animation class to move screens
  container.classList.add("sign-up");

  // Wait for animation to complete before changing content
  setTimeout(() => {
      leftPanel.innerHTML = `
          <span id="backToSignIn" class="material-icons-sharp">
              arrow_back_ios
          </span>
          <div class="form-filling">
              <img class="portalnest-logo" src="/assets/logo/portalnest logo.png" />
              <div>
                  <h1 class="log-in-to-your">Create Your Account</h1>
                  <h2 class="welcome-back-to">Join Portalnest today!</h2>
              </div>
          </div>
          <div class="mail-form">
              <div class="outer-form email">
                  <img class="form-icon" src="/assets/icons/email.svg">
                  <input type="email" placeholder="Email" required>
              </div>
              <div class="outer-form">
                  <img class="form-icon" src="/assets/icons/user.svg">
                  <input type="text" placeholder="Full Name" required>
              </div>
              <div id="password-form" class="outer-form">
                  <img class="form-icon" src="/assets/icons/lock.svg">
                  <input type="password" placeholder="Password" required>
                  <img class="eye-off" src="/assets/icons/visibility_off.svg">
              </div>
          </div>
          <div class="log-in">
              <div class="log-in-2">Sign Up</div>
          </div>
          <div class="account-creation">
              <div class="dont-have-account">Already have an account?</div>
              <div class="sign-up-now" id="signInNow">Sign In</div>
          </div>
      `;

      // Re-add event listener for switching back to Sign-In
      document.getElementById("signInNow").addEventListener("click", function() {
          container.classList.remove("sign-up");
          location.reload(); // Reloads to reset to the original sign-in content
      });

      document.getElementById("backToSignIn").addEventListener("click", function() {
          container.classList.remove("sign-up");
          location.reload();
      });

  }, 300); // Matches the CSS transition duration
});