import { db } from "../firebaseconfig.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ READ: Get single department by ID
export async function getDepartmentById(departmentId, schoolId) {
    try {
        const departmentRef = doc(db, "departments", departmentId);
        const docSnap = await getDoc(departmentRef);

        if (docSnap.exists() && docSnap.data().school_id === schoolId) {
            return { success: true, data: docSnap.data() };
        } else {
            throw new Error("Department not found or does not belong to the school.");
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}