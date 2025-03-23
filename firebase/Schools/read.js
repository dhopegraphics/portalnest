import { db } from "../firebaseconfig.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Function to fetch approved schools automatically
async function fetchApprovedSchools() {
    try {
        const schoolsCollection = collection(db, "schools");
        const approvedSchoolsQuery = query(schoolsCollection, where("approved", "==", true));
        const querySnapshot = await getDocs(approvedSchoolsQuery);

        const schoolsList = document.querySelector("#schools-list");
        if (!schoolsList) return; // Prevent errors if the element doesn't exist

        schoolsList.innerHTML = ""; // Clear existing list

        if (querySnapshot.empty) {
            schoolsList.innerHTML = "<li>No approved schools found.</li>";
            return;
        }

        querySnapshot.forEach(doc => {
            const schoolData = doc.data();
            const listItem = document.createElement("li");
            listItem.textContent = `${schoolData.school_name} - ${schoolData.location.city}, ${schoolData.location.region}`;
            schoolsList.appendChild(listItem);
        });

        console.log("✅ Approved schools fetched successfully!");
    } catch (error) {
        console.error("❌ Error fetching approved schools:", error.message);
    }
}

// Fetch schools automatically when the page loads
document.addEventListener("DOMContentLoaded", fetchApprovedSchools);