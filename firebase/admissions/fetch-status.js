import { db } from "../firebaseconfig.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const userEmail = localStorage.getItem("loggedInUserEmail"); // Get user's email from local storage
const selectedSchoolId = localStorage.getItem("selectedSchoolId"); // Get selected school ID
const applicantId = localStorage.getItem("applicant_id"); // Get selected school ID

// Function to fetch and monitor application status
async function checkApplicationStatus() {
    if (!userEmail || !selectedSchoolId) {
        console.error("User email or selected school ID is missing.");
        return;
    }

    try {
        // Reference to the user's admission document in Firestore
        const applicationRef = doc(db, "admissions", userEmail);
        const applicationSnap = await getDoc(applicationRef);

        if (applicationSnap.exists()) {
            const applicationData = applicationSnap.data();
            const status = applicationData.status; // Get status

            console.log("Current Status:", status);

            if (status === "admitted") {
                window.location.href = "/pages/Student-Portal/index.html";
            } else {
                // Keep checking every 5 seconds
                setTimeout(checkApplicationStatus, 5000);
            }
        } else {
            console.warn("No application data found.");
        }
    } catch (error) {
        console.error("Error fetching application status:", error);
    }
}

// Start checking when the page loads
document.addEventListener("DOMContentLoaded", checkApplicationStatus);

