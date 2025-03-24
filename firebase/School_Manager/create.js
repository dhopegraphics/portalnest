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
        const requiredFields = ["manager_id", "manager_type", "user_id", "institution_code", "first_name", "last_name"];
        for (const field of requiredFields) {
            if (!managerData[field]) {
                throw new Error(`❌ Missing required field: ${field}`);
            }
        }

        // ✅ Document ID is the manager_id
        const documentId = managerData.manager_id;

        // ✅ Structure Firestore document
        const schoolManagerDoc = {
            permissions: managerData.permissions || [],
            course_selected: managerData.course_selected || [],
            created_at: serverTimestamp(), // Firestore Timestamp
            created_by: managerData.created_by || "Unknown",
            department_id: managerData.department_id || "N/A",
            first_name: managerData.first_name,
            institution_code: managerData.institution_code,
            last_name: managerData.last_name,
            manager_active: managerData.manager_active ?? true, // Default: true
            manager_id: managerData.manager_id,
            manager_type: managerData.manager_type,
            updated_at: serverTimestamp(),
            user_id: managerData.user_id,
            year_selected: managerData.year_selected || [],
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
document.getElementById("create-manager-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    // Get values from input fields
    const firstName = document.getElementById("first_name").value.trim();
    const lastName = document.getElementById("last_name").value.trim();
    const institutionCode = document.getElementById("institution_code").value.trim();
    const departmentId = document.getElementById("department_id").value.trim();
    const userId = document.getElementById("user_id").value.trim();
    const managerId = document.getElementById("manager_id").value.trim();
    const managerType = document.getElementById("manager_type").value.trim();
    const createdBy = document.getElementById("created_by").value.trim();

    // Get multiple selected options for courses
    const courseSelected = Array.from(document.getElementById("course_selected").selectedOptions).map(option => option.value);

    // Get multiple selected options for year
    const yearSelected = Array.from(document.getElementById("year_selected").selectedOptions).map(option => option.value);

    // Validate required fields
    if (!firstName || !lastName || !institutionCode || !userId || !managerId || !managerType) {
        alert("❌ Please fill in all required fields.");
        return;
    }

    // ✅ Create the manager object
    const newManager = {
        permissions: ["PERM_001", "PERM_002"], // Modify dynamically if needed
        course_selected: courseSelected,
        created_by: createdBy || "Unknown",
        department_id: departmentId || "N/A",
        first_name: firstName,
        institution_code: institutionCode,
        last_name: lastName,
        manager_active: true, // Default to active
        manager_id: managerId,
        manager_type: managerType,
        user_id: userId,
        year_selected: yearSelected,
    };

    try {
        // ✅ Call the function to save in Firestore
        const response = await createSchoolManager(newManager);
        if (response.success) {
            alert("🎉 Manager created successfully!");
            document.getElementById("create-manager-form").reset(); // Reset form
        } else {
            alert("❌ Error: " + response.message);
        }
    } catch (error) {
        console.error("❌ Error creating manager:", error);
        alert("❌ Error: " + error.message);
    }
});