import { db } from "../firebaseconfig.js";
import { doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ UPDATE: Modify college details
export async function updateCollege(collegeId, schoolId, updatedData) {
    try {
        const collegeRef = doc(db, "colleges", collegeId);

        // Only update if college belongs to the correct school
        const existingCollege = await getCollegeById(collegeId, schoolId);
        if (!existingCollege.success) {
            throw new Error("College not found or does not belong to this school.");
        }

        updatedData.updated_at = serverTimestamp(); // Update timestamp
        await updateDoc(collegeRef, updatedData);

        return { success: true, message: "College updated successfully!" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}