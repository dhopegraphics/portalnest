import { db } from "../firebaseconfig.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ DELETE: Remove course registration
export async function deleteRegistration(registrationId, studentId, institutionCode) {
    try {
        const registrationRef = doc(db, "course_registrations", registrationId);

        // Ensure the registration belongs to the student and institution
        const existingRegistration = await getRegistrationById(registrationId, studentId, institutionCode);
        if (!existingRegistration.success) {
            throw new Error("Registration not found or does not belong to this institution.");
        }

        await deleteDoc(registrationRef);
        return { success: true, message: "Course registration deleted successfully!" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}