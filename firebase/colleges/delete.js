import { db } from "../firebaseconfig.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ DELETE: Remove college by ID
export async function deleteCollege(collegeId, schoolId) {
    try {
        const collegeRef = doc(db, "colleges", collegeId);

        // Only delete if college belongs to the correct school
        const existingCollege = await getCollegeById(collegeId, schoolId);
        if (!existingCollege.success) {
            throw new Error("College not found or does not belong to this school.");
        }

        await deleteDoc(collegeRef);
        return { success: true, message: "College deleted successfully!" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}