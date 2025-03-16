document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 1;
    const totalSteps = 6;
    loadDraft();

    const formSections = document.querySelectorAll(".form-section");
    const progressIndicators = document.querySelectorAll(".form-progress");
    const nextButtons = document.querySelectorAll(".next-button");
    const prevButtons = document.querySelectorAll(".previous-button");

    // Function to show the current form section and hide others
    function showFormSection(step) {
        formSections.forEach((section, index) => {
            if (index + 1 === step) {
                section.style.display = "flex"; // Show the current section
            } else {
                section.style.display = "none"; // Hide other sections
            }
        });
    }

    // Function to update the progress indicator
    function updateProgress() {
        progressIndicators.forEach((indicator, index) => {
            const formNumber = indicator.querySelector(".form-number");
            const description = indicator.querySelector(".description");

            if (index + 1 <= currentStep) {
                formNumber.style.backgroundColor = "black";
                formNumber.style.color = "white";
                description.style.color = "black";
            } else {
                formNumber.style.backgroundColor = "gray";
                formNumber.style.color = "white";
                description.style.color = "gray";
            }
        });

        // Enable/disable the "Previous" button
        prevButtons.forEach(button => {
            button.disabled = currentStep === 1;
        });

        // Update the "Next Step" button text
        nextButtons.forEach(button => {
            button.textContent = currentStep === totalSteps ? "Submit" : "Next Step";
        });
    }

    // Function to validate the current form section
    function validateCurrentForm() {
        const currentForm = formSections[currentStep - 1];
        const inputs = currentForm.querySelectorAll("input, select, textarea");

        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                showError(input, "This field is required");
                isValid = false;
            } else {
                clearError(input);
            }
        });

        return isValid;
    }

    // Show error message
    function showError(input, message) {
        let errorMsg = input.parentElement.querySelector(".error-message");
        if (!errorMsg) {
            errorMsg = document.createElement("small");
            errorMsg.classList.add("error-message");
            errorMsg.style.color = "red";
            errorMsg.style.fontSize = "12px";
            errorMsg.style.display = "block";
            input.parentElement.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
        input.style.border = "2px solid red";
    }

    // Clear error message
    function clearError(input) {
        let errorMsg = input.parentElement.querySelector(".error-message");
        if (errorMsg) {
            errorMsg.remove();
        }
        input.style.border = "";
    }

    // Next button click event
    nextButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            if (validateCurrentForm()) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    showFormSection(currentStep);
                    updateProgress();
                } else {
                    alert("Form Submitted!");
                }
            }
        });
    });

    // Previous button click event
    prevButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            if (currentStep > 1) {
                currentStep--;
                showFormSection(currentStep);
                updateProgress();
            }
        });
    });

    // Initialize
    showFormSection(currentStep);
    updateProgress();
});

function saveData() {
    const formData = {
        firstName: document.getElementById("inputFirstName").value,
        lastName: document.getElementById("inputLastName").value,
        dateOfBirth: document.getElementById("inputDateOfBirth").value,
        gender: document.getElementById("inputState").value,
        email: document.getElementById("inputEmailAddress").value,
        phone: document.getElementById("inputPhoneNumber").value,
        address: document.getElementById("inputAddress").value
    };
    localStorage.setItem("admissionFormDraft", JSON.stringify(formData));
    alert("Draft saved successfully!");
}

function loadDraft() {
    const draft = JSON.parse(localStorage.getItem("admissionFormDraft"));
    if (draft) {
        document.getElementById("inputFirstName").value = draft.firstName;
        document.getElementById("inputLastName").value = draft.lastName;
        document.getElementById("inputDateOfBirth").value = draft.dateOfBirth;
        document.getElementById("inputState").value = draft.gender;
        document.getElementById("inputEmailAddress").value = draft.email;
        document.getElementById("inputPhoneNumber").value = draft.phone;
        document.getElementById("inputAddress").value = draft.address;
    }
}