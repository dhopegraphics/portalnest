import { db } from "../firebaseconfig.js";
import { doc, setDoc, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Function to generate a unique registration_id
function generateRegistrationId(studentId) {
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `course_reg_${studentId}_${randomNum}`;
}

// ✅ CREATE: Register student for courses
export async function registerCourses(registrationData) {
    try {
        const { student_id, institution_code, courses_id, semester, academic_year, status } = registrationData;

        if (!student_id || !institution_code || !courses_id.length || !semester || !academic_year) {
            throw new Error("Missing required fields.");
        }

        // 🔍 Check if student exists and belongs to the institution
        const studentRef = doc(db, "students", student_id);
        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {
            throw new Error("Student does not exist.");
        }

        const studentData = studentSnap.data();
        if (studentData.institution_code !== institution_code) {
            throw new Error("Student does not belong to this institution.");
        }

        // Generate a unique registration ID
        const registrationId = generateRegistrationId(student_id);
        const registrationRef = doc(db, "course_registrations", registrationId);

        const newRegistration = {
            registration_id: registrationId,
            student_id,
            institution_code,
            courses_id,
            semester,
            academic_year,
            status: status || "pending", // Default status to 'pending' if not provided
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        };

        await setDoc(registrationRef, newRegistration);

        return { success: true, message: "Course registration successful!", data: newRegistration };
    } catch (error) {
        return { success: false, message: error.message };
    }
}