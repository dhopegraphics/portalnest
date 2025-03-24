import { db } from "../firebaseconfig.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ READ: Get single course by ID
export async function getCourseById(courseId, schoolId) {
    try {
        const courseRef = doc(db, "courses", courseId);
        const docSnap = await getDoc(courseRef);

        if (docSnap.exists() && docSnap.data().school_id === schoolId) {
            return { success: true, data: docSnap.data() };
        } else {
            throw new Error("Course not found or does not belong to this school.");
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}