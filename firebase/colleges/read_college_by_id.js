import { db } from "../firebaseconfig.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ READ: Get single college by ID
export async function getCollegeById(collegeId, schoolId) {
    try {
        const collegeRef = doc(db, "colleges", collegeId);
        const docSnap = await getDoc(collegeRef);

        if (docSnap.exists() && docSnap.data().school_id === schoolId) {
            return { success: true, data: docSnap.data() };
        } else {
            throw new Error("College not found or does not belong to this school.");
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}