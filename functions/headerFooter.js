class SpecialHeader extends HTMLElement {
  connectedCallback() {
      fetch("/components/header.html")
          .then(response => response.text())
          .then(data => {
              this.innerHTML = data;
              console.log("Header loaded!");

              initializeNavHighlight(); // ✅ Run nav highlight after header loads
              attachMiddleBarListeners(); // ✅ Attach event listeners after header loads
          })
          .catch(error => console.error("Error loading Header:", error));
  }
}

class SpecialFooter extends HTMLElement {
  connectedCallback() {
      fetch("/components/footer.html")
          .then(response => response.text())
          .then(data => {
              this.innerHTML = data;
          })
          .catch(error => console.error("Error loading Footer:", error));
  }
}

customElements.define("special-header", SpecialHeader);
customElements.define("special-footer", SpecialFooter);

// ✅ Function to highlight the active navbar link
function initializeNavHighlight() {
  console.log("Navbar script loaded!");

  let currentPath = window.location.pathname;
  console.log("Current Path:", currentPath);

  let navLinks = document.querySelectorAll(".header a");
  console.log("Nav Links Found:", navLinks.length);

  if (navLinks.length === 0) {
      console.error("No navigation links found. Check if your .header a elements exist.");
      return;
  }

  navLinks.forEach(link => {
      let linkPath = new URL(link.href, window.location.origin).pathname;
      console.log("Checking link:", linkPath);

      if (currentPath === linkPath) {
          console.log("Match found for:", link);
          link.classList.add("active-nav-bar");
      }
  });
}

// ✅ Function to attach event listeners to middle-bar divs
function attachMiddleBarListeners() {
  console.log("Attaching event listeners...");

  const middleBarDivs = document.querySelectorAll(".middle-bar > div");

  if (middleBarDivs.length === 0) {
      console.error("No .middle-bar divs found! Check if header has loaded correctly.");
      return;
  }

  middleBarDivs.forEach(div => {
      div.addEventListener("click", function () {
          console.log("Clicked:", this.id); // Debugging log

          // Remove active class from all divs
          middleBarDivs.forEach(item => item.classList.remove("active"));

          // Add active class to the clicked div
          this.classList.add("active");
      });
  });
}

function toggleMenu() {
    document.querySelector(".full-header").classList.toggle("active");
    document.querySelector(".hamburger-menu").classList.toggle("active");
    document.body.classList.toggle("no-scroll"); // Prevents scrolling when menu is open
}