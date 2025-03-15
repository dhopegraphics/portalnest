import { db } from "./firebaseconfig.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

document.getElementById("edit-manager-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    // Get form values
    const managerId = document.getElementById("edit_manager_id").value;
    const firstName = document.getElementById("edit_first_name").value;
    const lastName = document.getElementById("edit_last_name").value;
    const managerType = document.getElementById("edit_manager_type").value;
    const institutionCode = document.getElementById("edit_institution_code").value;
    const departmentId = document.getElementById("edit_department_id").value;
    const managerActive = document.getElementById("edit_manager_active").checked;

    try {
        // Reference the Firestore document
        const managerRef = doc(db, "school_managers", managerId);

        // Update Firestore
        await updateDoc(managerRef, {
            first_name: firstName,
            last_name: lastName,
            manager_type: managerType,
            institution_code: institutionCode,
            department_id: departmentId || null,
            manager_active: managerActive,
            updated_at: new Date(),
        });

        alert("✅ Manager updated successfully!");
        document.getElementById("edit-form-container").style.display = "none"; // Hide form
    } catch (error) {
        console.error("❌ Error updating manager:", error);
        alert("Error: " + error.message);
    }
});