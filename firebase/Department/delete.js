import { db } from "../firebaseconfig.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ DELETE: Remove department by ID
export async function deleteDepartment(departmentId, schoolId) {
    try {
        const departmentRef = doc(db, "departments", departmentId);

        // Only delete if department belongs to the correct school
        const existingDepartment = await getDepartmentById(departmentId, schoolId);
        if (!existingDepartment.success) {
            throw new Error("Department not found or does not belong to this school.");
        }

        await deleteDoc(departmentRef);
        return { success: true, message: "Department deleted successfully!" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}