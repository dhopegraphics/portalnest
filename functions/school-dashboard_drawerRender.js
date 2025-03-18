

document.addEventListener("DOMContentLoaded", function () {
    const drawerItems = document.querySelectorAll(".drawer-item");
    const contentContainer = document.getElementById("overall__main");

    // Function to load content dynamically
    function loadContent(file, clickedItem) {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                contentContainer.innerHTML = data;

                // Remove active class from all items
                drawerItems.forEach(item => item.classList.remove("active"));

                // Add active class to the clicked item
                clickedItem.classList.add("active");
            })
            .catch(error => {
                contentContainer.innerHTML = `<p style="color: red;">Error loading content.</p>`;
                console.error("Error loading content:", error);
            });
    }

    // Attach event listener to each drawer item
    drawerItems.forEach(item => {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            const file = this.getAttribute("data-file"); // Get the file name
            loadContent(file, this); // Pass the clicked item
        });
    });

    // Load default content and set active item on page load
    const defaultItem = document.querySelector(".drawer-item[data-file='dashboard.html']");
    if (defaultItem) {
        loadContent("dashboard.html", defaultItem);
    }
});

