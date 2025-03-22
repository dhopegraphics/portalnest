import { db } from "../firebaseconfig.js";
import { collection, doc, getDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const applicantId = 7816140; // Replace with localStorage.getItem("applicant_id") if dynamic

function redirectToPortal() {
    window.location.href = "/pages/Student-Portal/index.html"; // Change this to the actual portal link
}

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
            const programChoiceId = applicationData.program_choice_id || "N/A";
            const submissionDate = new Date(applicationData.submitted_at).toLocaleDateString();
            const status = applicationData.status || "Submitted";
            console.log("school id" , schoolId);
         

           
            getSchoolName(schoolId).then(schoolName => {
                console.log("School Name:", schoolName);

                document.getElementById("institution").textContent = schoolName;
            });

            // Fetch and display program name
            getProgramName(programChoiceId).then(programName => {
                document.getElementById("course").textContent = programName;

                // Check faculty for program
                checkFacultyForProgram(schoolId, programChoiceId).then(facultyData => {
                    if (facultyData) {
                        document.getElementById("faculty").textContent = facultyData.faculty_name || "No faculty found";

                        // Now check for the department under this faculty
                        checkDepartmentForFaculty(schoolId, facultyData.faculty_id).then(departmentName => {
                            document.getElementById("department").textContent = departmentName || "No department found";
                        });
                    } else {
                        document.getElementById("faculty").textContent = "No faculty found";
                    }
                });
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
            document.getElementById("submission-date").textContent = submissionDate;
            document.getElementById("current-status").textContent = statusDisplay;
            document.getElementById("status-message").textContent = `Your admission is currently ${statusDisplay}`;

            // Handle progress bar
            const progressBar = document.getElementById("progress-bar");
            if (status.toLowerCase() === "submitted") {
                progressBar.style.width = "33%";
                progressBar.style.backgroundColor = "#007bff";
            } else if (status.toLowerCase() === "under review") {
                progressBar.style.width = "66%";
                progressBar.style.backgroundColor = "#ffc107";
                 // Calculate Expected Decision Date (Submission Date + 3 Weeks)
    let decisionDate = new Date(applicationData.submitted_at);
    decisionDate.setDate(decisionDate.getDate() + 21); // Add 21 days (3 weeks)
    
    let today = new Date();
    if (today > decisionDate) {
        // If 3 weeks have passed and it's NOT rejected, extend by 2 more weeks
        decisionDate.setDate(decisionDate.getDate() + 14); // Add 14 more days (2 weeks)
    }

    // Update the Expected Decision Date in the HTML
    document.getElementById("decision-date").textContent = decisionDate.toLocaleDateString();
            } else if (status.toLowerCase() === "accepted") {
                progressBar.style.width = "100%";
                progressBar.style.backgroundColor = "#28a745";
                // Show the "Go to Portal" button
    document.getElementById("portal-button").style.display = "block";
               
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

// ✅ Function to fetch program name by program_choice_id
async function getProgramName(program_id) {
    if (!program_id) {
        console.error("Program ID is missing.");
        return "Unknown Program";
    }

    try {
        const programDocRef = doc(db, "programs", program_id);
        const docSnap = await getDoc(programDocRef);

        if (docSnap.exists()) {
            return docSnap.data().program_name || "Unknown Program";
        } else {
            return "Unknown Program";
        }
    } catch (error) {
        console.error("Error fetching program name:", error);
        return "Error retrieving program name";
    }
}

// ✅ Function to check if the program exists under a faculty
async function checkFacultyForProgram(school_id, program_id) {
    if (!school_id || !program_id) {
        console.error("Missing school ID or program ID.");
        return null;
    }

    try {
        // Query faculties collection for a document with the matching school_id (institution_code)
        const q = query(collection(db, "faculties"), where("institution_code", "==", school_id));
        const querySnapshot = await getDocs(q);

        for (const docSnap of querySnapshot.docs) {
            const facultyData = docSnap.data();

            // Check if the program_id is in the program_under_ids array
            if (facultyData.program_under_ids && facultyData.program_under_ids.includes(program_id)) {
                return { faculty_name: facultyData.faculty_name, faculty_id: docSnap.id };
            }
        }

        return null;
    } catch (error) {
        console.error("Error checking faculty for program:", error);
        return null;
    }
}

// ✅ Function to check if a department exists under the faculty
async function checkDepartmentForFaculty(school_id, faculty_id) {
    if (!school_id || !faculty_id) {
        console.error("Missing school ID or faculty ID.");
        return null;
    }

    try {
        // Query departments collection where institution_code matches school_id and faculty_id matches
        const q = query(collection(db, "departments"), where("institution_code", "==", school_id), where("faculty_id", "==", faculty_id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data().department_name || "Department Found";
        } else {
            return "No department found";
        }
    } catch (error) {
        console.error("Error checking department for faculty:", error);
        return "Error retrieving department";
    }
}