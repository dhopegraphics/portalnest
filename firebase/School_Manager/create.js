import { db } from "../firebaseconfig.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

/**
 * Creates a new school manager in Firestore.
 * @param {Object} managerData - The manager details.
 * @returns {Object} Success or error message.
 */
async function createSchoolManager(managerData) {
    try {
        // ✅ Required fields validation
        const requiredFields = ["first_name", "last_name", "manager_type"];
        for (const field of requiredFields) {
            if (!managerData[field]) {
                throw new Error(`❌ Missing required field: ${field}`);
            }
        }

        // ✅ Generate Manager ID (Numbers + First Name)
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const documentId = `${managerData.first_name}${randomNum}`;

        // ✅ Get current user ID from local storage or Firebase Auth
        const currentUserId = localStorage.getItem("current_user_id") || "Unknown";
        const institutionCode = localStorage.getItem("institution_code") || null;

        // ✅ Structure Firestore document
        const schoolManagerDoc = {
            permissions: managerData.permissions || [],
            course_selected: managerData.course_selected || [],
            created_at: serverTimestamp(),
            created_by: currentUserId,
            department_id: null, // Default to null
            first_name: managerData.first_name,
            institution_code: institutionCode,
            last_name: managerData.last_name,
            manager_active: managerData.manager_active ?? false, // Default: false
            manager_id: documentId,
            manager_type: managerData.manager_type,
            updated_at: serverTimestamp(),
            user_id: null, // Default to null
            year_selected: managerData.year_selected || [],
            Salary: managerData.Salary,
            personal_mail: managerData.personal_mail,
            personal_number: managerData.personal_number
        };

        // ✅ Store in Firestore
        await setDoc(doc(db, "school_managers", documentId), schoolManagerDoc);

        console.log("🎉 Success: School Manager created:", schoolManagerDoc);
        return { success: true, message: "School Manager created successfully!" };
    } catch (error) {
        console.error("❌ Error creating School Manager:", error.message);
        return { success: false, message: error.message };
    }
}

// ✅ Handle form submission
document.getElementById("submit").addEventListener("click", async function () {
    // Get values from input fields
    const firstName = document.getElementById("firstname").value.trim();
    const lastName = document.getElementById("lastname").value.trim();
    const managerType = document.getElementById("position").value.trim();
    const department = document.getElementById("department").value.trim();
    const salary = document.getElementById("Salary").value.trim();
    const workEmail = document.getElementById("personmail").value.trim();
    const workPhone = document.getElementById("number").value.trim();


    // Get multiple selected options for courses
    const courseSelected = Array.from(document.querySelectorAll(".course__selection .selected"))
        .map(option => option.dataset.value);

    // Get multiple selected options for year
    const yearSelected = Array.from(document.querySelectorAll(".year-option.selected"))
        .map(option => option.dataset.value);

    // Get multiple selected permissions
    const permissions = Array.from(document.querySelectorAll(".inner-permission_selection .selected"))
        .map(option => option.dataset.value);

    // Validate required fields
    if (!firstName || !lastName || !managerType) {
        alert("❌ Please fill in all required fields.");
        return;
    }

    // ✅ Create the manager object
    const newManager = {
        permissions: permissions,
        course_selected: courseSelected,
        first_name: firstName,
        last_name: lastName,
        manager_active: false, // Default to inactive
        manager_type: managerType,
        year_selected: yearSelected,
        department_id : department,
        Salary: salary,
        personal_mail: workEmail,
        personal_number: workPhone
    };

    try {
        // ✅ Call the function to save in Firestore
        const response = await createSchoolManager(newManager);
        if (response.success) {
            alert("🎉 Manager created successfully!");
            document.getElementById("managerForm").reset(); // Reset form
        } else {
            alert("❌ Error: " + response.message);
        }
    } catch (error) {
        console.error("❌ Error creating manager:", error);
        alert("❌ Error: " + error.message);
    }
});
