let currentStep = 1; // Global variable

document.addEventListener("DOMContentLoaded", function () {
    const totalSteps = 6;
    loadDraft();

    const formSections = document.querySelectorAll(".form-section");
    const progressIndicators = document.querySelectorAll(".form-progress");
    const nextButtons = document.querySelectorAll(".next-button");
    const prevButtons = document.querySelectorAll(".previous-button");

    function showFormSection(step) {
        formSections.forEach((section, index) => {
            section.style.display = index + 1 === step ? "flex" : "none";
        });

        if (step === totalSteps) {
            populatePreview();
        }
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

        prevButtons.forEach(button => {
            button.disabled = currentStep === 1;
        });

        nextButtons.forEach(button => {
            button.textContent = currentStep === totalSteps ? "Submit" : "Next Step";
        });
    }

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

    nextButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            console.log(`Next button clicked at step ${currentStep}`);
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

    showFormSection(currentStep);
    updateProgress();
});

function saveData() {
    const formData = {};

    document.querySelectorAll("input, select, textarea").forEach(input => {
        if (input.type !== "file") {
            formData[input.id] = input.value;
        } else {
            if (input.files.length > 0) {
                formData[input.id] = Array.from(input.files).map(file => file.name);
            }
            input.value = "";
        }
    });

    formData["currentStep"] = currentStep;

    localStorage.setItem("admissionFormDraft", JSON.stringify(formData));
    alert("Draft saved successfully!");
}

function loadDraft() {
    const draft = JSON.parse(localStorage.getItem("admissionFormDraft"));
    if (draft) {
        document.querySelectorAll("input, select, textarea").forEach(input => {
            if (input.type !== "file" && draft[input.id]) {
                input.value = draft[input.id];
            } else if (input.type === "file" && draft[input.id]) {
                const fileNames = draft[input.id].join(", ");
                const message = document.createElement("small");
                message.textContent = `Please re-upload the following files: ${fileNames}`;
                message.style.color = "red";
                message.style.display = "block";
                input.parentElement.appendChild(message);
            }
        });

        if (draft["currentStep"]) {
            currentStep = parseInt(draft["currentStep"], 10);
        }
    }
}

function populatePreview() {
    let firstName = document.getElementById("inputFirstName").value;
    let lastName = document.getElementById("inputLastName").value;
    let email = document.getElementById("inputEmailAddress").value;
    let program = document.getElementById("inputProgram") ? document.getElementById("inputProgram").value : "Not Selected";

    document.getElementById("previewFullName").textContent = firstName + " " + lastName;
    document.getElementById("previewEmail").textContent = email;
    document.getElementById("previewProgram").textContent = program;
}
