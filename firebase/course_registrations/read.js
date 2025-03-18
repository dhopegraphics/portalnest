import { db } from "../firebaseconfig.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ READ: Get all registered students in a specific institution
export async function getAllRegisteredStudentsByInstitution(institutionCode) {
    try {
        const registrationsRef = collection(db, "course_registrations");
        const q = query(registrationsRef, where("institution_code", "==", institutionCode));
        const querySnapshot = await getDocs(q);

        let students = new Set(); // Use a Set to avoid duplicate student IDs
        querySnapshot.forEach(doc => {
            const registration = doc.data();
            students.add(registration.student_id);
        });

        return { success: true, data: Array.from(students) }; // Convert Set to Array
    } catch (error) {
        return { success: false, message: error.message };
    }
}