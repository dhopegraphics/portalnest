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