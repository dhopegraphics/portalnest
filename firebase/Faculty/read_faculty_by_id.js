import { db } from "../firebaseconfig.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ READ: Get single faculty by facultyId and schoolId
export async function getFacultyByIdAndSchool(facultyId, schoolId) {
    try {
        if (!facultyId || !schoolId) throw new Error("Faculty ID and School ID are required.");

        const facultiesRef = collection(db, "faculties");
        const q = query(facultiesRef, 
            where("faculty_id", "==", facultyId), 
            where("school_id", "==", schoolId)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) throw new Error("Faculty not found for this school.");

        let facultyData = null;
        querySnapshot.forEach(doc => {
            facultyData = { id: doc.id, ...doc.data() };
        });

        return { success: true, data: facultyData };
    } catch (error) {
        return { success: false, message: error.message };
    }
}