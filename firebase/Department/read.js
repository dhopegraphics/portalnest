import { db } from "../firebaseconfig.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ READ: Get all departments by school_id
export async function getDepartmentsBySchoolId(schoolId) {
    try {
        const departmentsRef = collection(db, "departments");
        const q = query(departmentsRef, where("school_id", "==", schoolId));
        const querySnapshot = await getDocs(q);

        let departments = [];
        querySnapshot.forEach(doc => departments.push(doc.data()));

        return { success: true, data: departments };
    } catch (error) {
        return { success: false, message: error.message };
    }
}