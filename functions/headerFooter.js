class SpecialHeader extends HTMLElement {
    connectedCallback() {
      fetch("components/header.html") // Load navbar from file
        .then(response => response.text())
        .then(data => {
          this.innerHTML = data;
        })
        .catch(error => console.error("Error loading navbar:", error));
    }
  }
  
  class SpecialFooter extends HTMLElement {
    connectedCallback() {
      fetch("components/footer.html") // Load navbar from file
        .then(response => response.text())
        .then(data => {
          this.innerHTML = data;
        })
        .catch(error => console.error("Error loading navbar:", error));
    }
  }
  
  customElements.define("special-header", SpecialHeader);
  customElements.define("special-footer", SpecialFooter);