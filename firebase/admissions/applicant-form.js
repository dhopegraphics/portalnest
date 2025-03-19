import { db } from "../firebaseconfig.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
const selectedSchoolId = localStorage.getItem("selectedSchoolId");

// ✅ Function to Generate a Unique Applicant ID
function generateApplicantID() {
    return Math.floor(1000000 + Math.random() * 9000000); // Random 7-digit number
}

// ✅ Reusable Function to Submit Form Data
export async function submitForm() {
    if (!validateCurrentForm()) {
        alert("⚠️ Please fill all required fields before submitting.");
        return;
    }

    try {
        // ✅ Collect Form Data
        const applicationData = {
            applicant_id: generateApplicantID(),
            personal_info: {
                first_name: document.getElementById("inputFirstName").value.trim(),
                last_name: document.getElementById("inputLastName").value.trim(),
                date_of_birth: document.getElementById("inputDateOfBirth").value.trim(),
                gender: document.getElementById("inputGender").value.trim(),
                email: document.getElementById("inputEmailAddress").value.trim(),
                phone_number: document.getElementById("inputPhoneNumber").value.trim(),
                address: document.getElementById("inputAddress").value.trim()
            },
            education: {
                previous_school_name: document.getElementById("inputHighSchoolName").value.trim(),
                graduation_year: document.getElementById("inputGraduationYear").value.trim(),
                school_location: document.getElementById("inputSchoolDistrict").value.trim(),
                academic_achievements: document.getElementById("inputAcademicAchievement").value.trim()
            },
            guardian_info: {
                full_name: document.getElementById("inputGuardianName").value.trim(),
                contact: document.getElementById("inputGuardianNumber").value.trim(),
                relationship: document.getElementById("inputGuardianRel").value.trim()
            },
            program_choice_id: document.getElementById("inputProgram").value.trim(),
            school_id: selectedSchoolId ,
            status: "submitted",
            submitted_at: new Date().toISOString()
        };

        // ✅ Save to Firestore
        await addDoc(collection(db, "admissions"), applicationData);

        alert("🎉 Application submitted successfully!");
        localStorage.removeItem("admissionFormDraft");
        localStorage.getItem("applicant_id" , applicant_id )
        window.location.href("/pages/Miscellaneous/admission-status.html");
    } catch (error) {
        console.error("❌ Error submitting application:", error);
        alert("❌ Error submitting application. Please try again.");
    }
}


function validateCurrentForm() {
    const currentForm = document.querySelector(".form-section:not([style*='display: none'])");
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