document.addEventListener("click", (e) => {
    // Handle dropdown trigger clicks
    if (e.target.closest(".input-group-text")) {
      const dropdownContainer = e.target.closest(".dropdown-container");
      const dropdownMenu = dropdownContainer.querySelector(".dropdown-menu");
      const isVisible = dropdownMenu.style.display === "block";

      // Toggle dropdown visibility
      dropdownMenu.style.display = isVisible ? "none" : "block";
      dropdownContainer.classList.toggle("active", !isVisible);
    }

    // Handle dropdown item clicks
    if (e.target.classList.contains("dropdown-item")) {
      const dropdownContainer = e.target.closest(".dropdown-container");
      const dropdownInput = dropdownContainer.querySelector(".form-control");
      dropdownInput.value = e.target.textContent;
      dropdownContainer.querySelector(".dropdown-menu").style.display = "none";
      dropdownContainer.classList.remove("active");
    }

    // Handle input filtering and highlighting
    if (e.target.classList.contains("form-control")) {
      const dropdownContainer = e.target.closest(".dropdown-container");
      const dropdownMenu = dropdownContainer.querySelector(".dropdown-menu");
      const filter = e.target.value.toLowerCase();
      const options = dropdownMenu.querySelectorAll(".dropdown-item");

      options.forEach(option => {
        const optionText = option.textContent.toLowerCase();
        const matchIndex = optionText.indexOf(filter);

        // If input is empty, show all options and remove highlighting
        if (filter === "") {
          option.style.display = "block";
          option.innerHTML = optionText; // Remove highlighting
        } else {
          // If there's a match, show the option and highlight the matching text
          if (matchIndex !== -1) {
            option.style.display = "block";
            const highlightedText = `<span style="background-color: yellow;">${optionText.substring(matchIndex, matchIndex + filter.length)}</span>`;
            option.innerHTML = optionText.substring(0, matchIndex) + highlightedText + optionText.substring(matchIndex + filter.length);
          } else {
            // If no match, hide the option
            option.style.display = "none";
          }
        }
      });

      // Always show the dropdown menu when typing or erasing
      dropdownMenu.style.display = "block";
      dropdownContainer.classList.add("active");
    }

    // Close dropdowns when clicking outside
    if (!e.target.closest(".dropdown-container")) {
      document.querySelectorAll(".dropdown-menu").forEach(menu => {
        menu.style.display = "none";
      });
      document.querySelectorAll(".dropdown-container").forEach(container => {
        container.classList.remove("active");
      });
    }

});

document.addEventListener("DOMContentLoaded", function () {
    const proceedButton = document.getElementById("proceed");
    const requiredInputs = document.querySelectorAll(".form-control[required]");
    const checkboxes = document.querySelectorAll('.checkboxes input[type="checkbox"]');

    function updateButtonState() {
        let allFilled = true;

        // Check if all text inputs are filled
        requiredInputs.forEach(input => {
            if (input.value.trim() === "") {
                allFilled = false;
            }
        });

        // Check if one checkbox is selected
        let oneChecked = [...checkboxes].some(checkbox => checkbox.checked);

        // Enable button if all conditions are met
        if (allFilled && oneChecked) {
            proceedButton.style.opacity = "1";
            proceedButton.style.cursor = "pointer"
            proceedButton.disabled = false;
        } else {
            proceedButton.style.opacity = "0.5";
            proceedButton.disabled = true;
        }
    }

    // Attach event listeners to inputs
    requiredInputs.forEach(input => {
        input.addEventListener("input", updateButtonState);
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", updateButtonState);
    });

    // Initialize button state on page load
    updateButtonState();

    // Redirect to another page when button is clicked
    proceedButton.addEventListener("click", function () {
        if (!proceedButton.disabled) {
            window.location.href = "/pages/admission/application-form.html"; // Change this to your desired page
        }
    });
});

    function onlyOne(checkbox) {
        let checkboxes = document.querySelectorAll('.checkboxes input[type="checkbox"]');
        checkboxes.forEach((cb) => {
            if (cb !== checkbox) cb.checked = false;
        });

        // Update button state when a checkbox is selected
        updateButtonState();
}