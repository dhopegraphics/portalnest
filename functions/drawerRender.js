document.addEventListener("DOMContentLoaded", function () {
    const drawerItems = document.querySelectorAll(".drawer-item");
    const contentContainer = document.getElementById("main-content");

    function loadContent(file, clickedItem) {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                contentContainer.innerHTML = data;
                
                // Remove active class from all sidebar items
                drawerItems.forEach(item => item.classList.remove("active"));
                
                // Add active class if the clicked item is a sidebar item
                if (clickedItem && clickedItem.classList.contains("drawer-item")) {
                    clickedItem.classList.add("active");
                }
                
                // Execute scripts inside the loaded content
                executeScripts(contentContainer);

                // Re-attach internal navigation event listeners
                attachInternalNavigation();
            })
            .catch(error => {
                contentContainer.innerHTML = `<p style="color: red;">Error loading content.</p>`;
                console.error("Error loading content:", error);
            });
    }

    function attachInternalNavigation() {
        document.querySelectorAll(".internal-nav").forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                const file = this.getAttribute("data-file");
                loadContent(file, this);
                
                // Execute scripts inside the loaded content
                executeScripts(contentContainer);
            });
        });
    }

    function executeScripts(container) {
        const scripts = container.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            newScript.textContent = oldScript.textContent;
            document.body.appendChild(newScript).parentNode.removeChild(newScript);
        });
    }

    // Attach event listener to sidebar items
    drawerItems.forEach(item => {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            const file = this.getAttribute("data-file");
            loadContent(file, this);
        });
    });

    // Load default content on page load
    const defaultItem = document.querySelector(".drawer-item[data-file='./home.html']");
    if (defaultItem) {
        loadContent("./home.html", defaultItem);
    }
});