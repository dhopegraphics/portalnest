document.addEventListener("DOMContentLoaded", function () {
    // New Ticket Button
    document.querySelector(".!rounded-button").addEventListener("click", function () {
        alert("New Ticket feature coming soon!");
    });

    // Dark Mode Toggle
    const darkModeButton = document.querySelector(".fa-moon");
    darkModeButton.addEventListener("click", function () {
        document.body.classList.toggle("dark");
        if (document.body.classList.contains("dark")) {
            document.body.style.backgroundColor = "#1a202c";
            document.body.style.color = "#fff";
        } else {
            document.body.style.backgroundColor = "#f9fafb";
            document.body.style.color = "#000";
        }
    });

    // FAQ Toggle
    document.querySelectorAll(".divide-y button").forEach(button => {
        button.addEventListener("click", function () {
            const answer = this.nextElementSibling;
            if (answer.style.display === "block") {
                answer.style.display = "none";
                this.querySelector("i").classList.replace("fa-chevron-up", "fa-chevron-down");
            } else {
                answer.style.display = "block";
                this.querySelector("i").classList.replace("fa-chevron-down", "fa-chevron-up");
            }
        });
    });

    // Search Functionality
    const searchInput = document.querySelector("input[type='text']");
    searchInput.addEventListener("input", function () {
        const searchValue = searchInput.value.toLowerCase();
        document.querySelectorAll(".grid a").forEach(article => {
            const text = article.textContent.toLowerCase();
            if (text.includes(searchValue)) {
                article.style.display = "block";
            } else {
                article.style.display = "none";
            }
        });
    });
});