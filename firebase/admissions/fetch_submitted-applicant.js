import { db } from "../firebaseconfig.js";
import { collection, doc, getDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const applicantId = 7816140; // Replace with localStorage.getItem("applicant_id") if dynamic

async function fetchApplicationDetails() {
    if (!applicantId) {
        console.error("Applicant ID is missing.");
        return;
    }

    try {
        // Query Firestore for document with matching applicant_id in "admissions" collection
        const q = query(collection(db, "admissions"), where("applicant_id", "==", applicantId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const applicationData = querySnapshot.docs[0].data();

            // Extract details from application
            const applicantName = `${applicationData.personal_info.first_name} ${applicationData.personal_info.last_name}`;
            const schoolId = applicationData.school_id || "N/A";
            const programChoice = applicationData.program_choice_id || "N/A";
            const submissionDate = new Date(applicationData.submitted_at).toLocaleDateString();
            const status = applicationData.status || "Submitted";
            console.log("school id" , schoolId);
         

           
            getSchoolName(schoolId).then(schoolName => {
                console.log("School Name:", schoolName);

                document.getElementById("institution").textContent = schoolName;
            });

            // Map status to progress
            const statusMap = {
                "submitted": "🔵 Submitted",
                "under review": "🟡 Under Review",
                "accepted": "🟢 Accepted",
                "rejected": "🔴 Rejected"
            };
            const statusDisplay = statusMap[status.toLowerCase()] || "🔵 Submitted";

            // Update HTML elements
            document.getElementById("applicant-name").textContent = applicantName;
         
            document.getElementById("course").textContent = programChoice;
            document.getElementById("submission-date").textContent = submissionDate;
            document.getElementById("current-status").textContent = statusDisplay;

            // Handle progress bar
            const progressBar = document.getElementById("progress-bar");
            if (status.toLowerCase() === "submitted") {
                progressBar.style.width = "33%";
                progressBar.style.backgroundColor = "#007bff";
            } else if (status.toLowerCase() === "under review") {
                progressBar.style.width = "66%";
                progressBar.style.backgroundColor = "#ffc107";
            } else if (status.toLowerCase() === "accepted") {
                progressBar.style.width = "100%";
                progressBar.style.backgroundColor = "#28a745";
            } else if (status.toLowerCase() === "rejected") {
                progressBar.style.width = "100%";
                progressBar.style.backgroundColor = "#dc3545";
            }

        } else {
            console.warn("No application data found.");
            document.getElementById("status-message").textContent = "Application not found.";
        }
    } catch (error) {
        console.error("Error fetching application details:", error);
        document.getElementById("status-message").textContent = "Error fetching application data.";
    }
}

// Fetch application details when the page loads
document.addEventListener("DOMContentLoaded", fetchApplicationDetails);

// ✅ Function to fetch school name by school_id
async function getSchoolName(school_id) {
    if (!school_id) {
        console.error("School ID is missing.");
        return "Unknown Institution";
    }

    try {
        console.log("Searching for school with ID:", school_id);

        // Query Firestore where school_id matches
        const q = query(collection(db, "schools"), where("school_id", "==", school_id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const schoolData = querySnapshot.docs[0].data();  // Get the first match
            console.log("Firestore School Data:", schoolData);
            return schoolData.school_name || "Unknown Institution";
        } else {
            console.warn("School not found in Firestore.");
            return "Unknown Institution";
        }
    } catch (error) {
        console.error("Error fetching school name:", error);
        return "Error retrieving school name";
    }
}

// async function getProgramFaculty(school_id) {
//     if (!school_id) {
//         console.error("School ID is missing.");
//         return "Unknown Institution";
//     }

//     try {
//         console.log("Searching for school with ID:", school_id);

//         // Query Firestore where school_id matches
//         const q = query(collection(db, "schools"), where("school_id", "==", school_id));
//         const querySnapshot = await getDocs(q);

//         if (!querySnapshot.empty) {
//             const schoolData = querySnapshot.docs[0].data();  // Get the first match
//             console.log("Firestore School Data:", schoolData);
//             return schoolData.school_name || "Unknown Institution";
//         } else {
//             console.warn("School not found in Firestore.");
//             return "Unknown Institution";
//         }
//     } catch (error) {
//         console.error("Error fetching school name:", error);
//         return "Error retrieving school name";
//     }
// }