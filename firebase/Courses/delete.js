import { db } from "../firebaseconfig.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ DELETE: Remove course by ID
export async function deleteCourse(courseId, schoolId) {
    try {
        const courseRef = doc(db, "courses", courseId);

        // Only delete if course belongs to the correct school
        const existingCourse = await getCourseById(courseId, schoolId);
        if (!existingCourse.success) {
            throw new Error("Course not found or does not belong to this school.");
        }

        await deleteDoc(courseRef);
        return { success: true, message: "Course deleted successfully!" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}