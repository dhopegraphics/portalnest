import { db } from "../firebaseconfig.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

/**
 * Deletes a school manager from Firestore.
 * @param {string} managerId - The ID of the manager to delete.
 * @returns {Object} Success or error message.
 */
async function deleteSchoolManager(managerId) {
    try {
        if (!managerId) {
            throw new Error("❌ Manager ID is required.");
        }

        // ✅ Reference to the document
        const managerDocRef = doc(db, "school_managers", managerId);

        // ✅ Delete from Firestore
        await deleteDoc(managerDocRef);

        console.log(`🗑️ Manager '${managerId}' deleted successfully.`);
        return { success: true, message: "Manager deleted successfully!" };
    } catch (error) {
        console.error("❌ Error deleting manager:", error.message);
        return { success: false, message: error.message };
    }
}