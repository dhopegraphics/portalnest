// Function to load header and footer
function loadComponent(file, container) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(container).innerHTML = data;
        });
}

// Load Header and Footer
loadComponent("header.html", "header-container");
loadComponent("footer.html", "footer-container");
