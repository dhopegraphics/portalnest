import { db } from "../firebaseconfig.js";
import { doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ UPDATE: Modify department details
export async function updateDepartment(departmentId, schoolId, updatedData) {
    try {
        const departmentRef = doc(db, "departments", departmentId);

        // Only update if department belongs to the correct school
        const existingDepartment = await getDepartmentById(departmentId, schoolId);
        if (!existingDepartment.success) {
            throw new Error("Department not found or does not belong to this school.");
        }

        updatedData.updated_at = serverTimestamp(); // Update timestamp
        await updateDoc(departmentRef, updatedData);

        return { success: true, message: "Department updated successfully!" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}