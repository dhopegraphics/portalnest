document.querySelectorAll("input").forEach(input => {
    // Load saved values
    if (localStorage.getItem(input.name)) {
        input.value = localStorage.getItem(input.name);
    }

    // Save values
    input.addEventListener("input", () => {
        localStorage.setItem(input.name, input.value);
    });
});

