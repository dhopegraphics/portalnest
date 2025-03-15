import { db } from "../firebaseconfig.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Function to generate a unique course_id (e.g., "course_school456_54321")
function generateCourseId(schoolId) {
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `course_${schoolId}_${randomNum}`;
}

// ✅ CREATE: Add new course
export async function createCourse(courseData) {
    try {
        if (!courseData.school_id || !courseData.course_code || !courseData.course_name || !courseData.credits_hours) {
            throw new Error("Missing required fields.");
        }

        const courseId = generateCourseId(courseData.school_id); // Generate ID
        const courseRef = doc(db, "courses", courseId);

        const newCourse = {
            course_id: courseId,
            course_code: courseData.course_code,
            course_name: courseData.course_name,
            credits_hours: courseData.credits_hours,
            teaching_hours: courseData.teaching_hours || "0", // Default if not provided
            pratical_hours: courseData.pratical_hours || "0", // Default if not provided
            lecturer_id: courseData.lecturer_id || "", // Optional field
            school_id: courseData.school_id,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        };

        await setDoc(courseRef, newCourse);

        return { success: true, message: "Course added successfully!", data: newCourse };
    } catch (error) {
        return { success: false, message: error.message };
    }
}