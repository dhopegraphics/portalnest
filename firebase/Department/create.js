import { db } from "../firebaseconfig.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Function to generate a unique department_id (e.g., "dept_knust232_12345")
function generateDepartmentId(schoolId) {
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `dept_${schoolId}_${randomNum}`;
}

// ✅ CREATE: Add new department
export async function createDepartment(departmentData) {
    try {
        if (!departmentData.school_id || !departmentData.faculty_id || !departmentData.department_name) {
            throw new Error("Missing required fields.");
        }

        const departmentId = generateDepartmentId(departmentData.school_id); // Generate ID
        const departmentRef = doc(db, "departments", departmentId);

        const newDepartment = {
            department_id: departmentId,
            department_name: departmentData.department_name,
            faculty_id: departmentData.faculty_id,
            school_id: departmentData.school_id,
            institution_code: departmentData.institution_code || "", // Default empty if not provided
            created_by: departmentData.created_by, // Logged-in user
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        };

        await setDoc(departmentRef, newDepartment);

        return { success: true, message: "Department added successfully!", data: newDepartment };
    } catch (error) {
        return { success: false, message: error.message };
    }
}