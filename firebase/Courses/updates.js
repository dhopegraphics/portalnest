import { db } from "../firebaseconfig.js";
import { doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ UPDATE: Modify course details
export async function updateCourse(courseId, schoolId, updatedData) {
    try {
        const courseRef = doc(db, "courses", courseId);

        // Only update if course belongs to the correct school
        const existingCourse = await getCourseById(courseId, schoolId);
        if (!existingCourse.success) {
            throw new Error("Course not found or does not belong to this school.");
        }

        updatedData.updated_at = serverTimestamp(); // Update timestamp
        await updateDoc(courseRef, updatedData);

        return { success: true, message: "Course updated successfully!" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}