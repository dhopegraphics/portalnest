window.onload = function () {
  console.log("Navbar script loaded!");

  let currentPath = window.location.pathname;
  console.log("Current Path:", currentPath);

  let navLinks = document.querySelectorAll(".header a");
  console.log("Nav Links Found:", navLinks.length);  // ✅ Check how many links are found

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
};
console.log(document.querySelectorAll("  .header a"));

class SpecialHeader extends HTMLElement {
    connectedCallback() {
      fetch("/components/header.html") // Load Header from file
        .then(response => response.text())
        .then(data => {
          this.innerHTML = data;
        })
        .catch(error => console.error("Error loading Header:", error));
    }
  }
  
  class SpecialFooter extends HTMLElement {
    connectedCallback() {
      fetch("/components/footer.html") // Load Footer from file
        .then(response => response.text())
        .then(data => {
          this.innerHTML = data;
        })
        .catch(error => console.error("Error loading Footer:", error));
    }
  }
  
  customElements.define("special-header", SpecialHeader);
  customElements.define("special-footer", SpecialFooter);



  function toggleMenu() {
    const menu = document.querySelector(".full-header");
    const hamburger = document.querySelector(".hamburger-menu");
    const body = document.body;

    menu.classList.toggle("active");
    hamburger.classList.toggle("active");

    // Disable scrolling when menu is open
    if (menu.classList.contains("active")) {
        body.classList.add("no-scroll");
    } else {
        body.classList.remove("no-scroll");
    }
}


