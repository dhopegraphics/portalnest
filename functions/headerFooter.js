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