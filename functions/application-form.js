document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 1;
    const totalSteps = 6;

    const formSections = [
        "Personal Info",
        "Education",
        "Program",
        "Documents",
        "Guardian",
        "Submit"
    ];

    const nextButton = document.querySelector(".next-button");
    const prevButton = document.querySelector(".previous-button");
    const progressIndicators = document.querySelectorAll(".form-progress");
    const form = document.getElementById("form");

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

    function clearError(input) {
        let errorMsg = input.parentElement.querySelector(".error-message");
        if (errorMsg) {
            errorMsg.remove();
        }
        input.style.border = "";
    }

    function validateInputs() {
        let isValid = true;

        const firstName = document.getElementById("inputFirstName");
        const lastName = document.getElementById("inputLastName");
        const dateOfBirth = document.getElementById("inputDateOfBirth");
        const email = document.getElementById("inputEmailAddress");
        const phone = document.getElementById("inputPhoneNumber");
        const gender = document.getElementById("inputState");
        const address = document.getElementById("inputAddress");

        // Validate first name
        if (!firstName.value.trim()) {
            showError(firstName, "First Name is required");
            isValid = false;
        } else {
            clearError(firstName);
        }

        // Validate last name
        if (!lastName.value.trim()) {
            showError(lastName, "Last Name is required");
            isValid = false;
        } else {
            clearError(lastName);
        }

        // Validate date of birth
        if (!dateOfBirth.value.trim()) {
            showError(dateOfBirth, "Date of Birth is required");
            isValid = false;
        } else {
            clearError(dateOfBirth);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError(email, "Email Address is required");
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            showError(email, "Enter a valid email address");
            isValid = false;
        } else {
            clearError(email);
        }

        // Validate phone number (only numbers allowed)
        const phoneRegex = /^[0-9]+$/;
        if (!phone.value.trim()) {
            showError(phone, "Phone Number is required");
            isValid = false;
        } else if (!phoneRegex.test(phone.value.trim())) {
            showError(phone, "Phone Number must contain only digits");
            isValid = false;
        } else {
            clearError(phone);
        }

        // Validate gender selection
        if (gender.value === "Choose...") {
            showError(gender, "Please select a gender");
            isValid = false;
        } else {
            clearError(gender);
        }

        // Validate address
        if (!address.value.trim()) {
            showError(address, "Address is required");
            isValid = false;
        } else {
            clearError(address);
        }

        return isValid;
    }

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

        prevButton.disabled = currentStep === 1;
        nextButton.textContent = currentStep === totalSteps ? "Submit" : "Next Step";

        document.querySelector(".form-title-desc h1").textContent = formSections[currentStep - 1];
    }

    nextButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (validateInputs()) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateProgress();
            } else {
                alert("Form Submitted!");
                form.submit();
            }
        }
    });

    prevButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (currentStep > 1) {
            currentStep--;
            updateProgress();
        }
    });

    updateProgress();
});
