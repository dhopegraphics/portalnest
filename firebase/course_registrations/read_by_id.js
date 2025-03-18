import { db } from "../firebaseconfig.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ READ: Get registration by ID
export async function getRegistrationById(registrationId, studentId, institutionCode) {
    try {
        const registrationRef = doc(db, "course_registrations", registrationId);
        const registrationSnap = await getDoc(registrationRef);

        if (!registrationSnap.exists()) {
            throw new Error("Registration not found.");
        }

        const registrationData = registrationSnap.data();

        // Ensure the student and institution match
        if (registrationData.student_id !== studentId || registrationData.institution_code !== institutionCode) {
            throw new Error("Unauthorized access or incorrect institution.");
        }

        return { success: true, data: registrationData };
    } catch (error) {
        return { success: false, message: error.message };
    }
}