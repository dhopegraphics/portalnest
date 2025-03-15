import { db } from "../firebaseconfig.js";
import { doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ UPDATE: Modify course registration
export async function updateRegistration(registrationId, studentId, institutionCode, updatedData) {
    try {
        const registrationRef = doc(db, "course_registrations", registrationId);

        // Ensure the registration belongs to the student and institution
        const existingRegistration = await getRegistrationById(registrationId, studentId, institutionCode);
        if (!existingRegistration.success) {
            throw new Error("Registration not found or does not belong to this institution.");
        }

        updatedData.updated_at = serverTimestamp();
        await updateDoc(registrationRef, updatedData);

        return { success: true, message: "Registration updated successfully!" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}