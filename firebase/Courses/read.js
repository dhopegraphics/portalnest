import { db } from "../firebaseconfig.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ READ: Get all courses by school_id
export async function getCoursesBySchoolId(schoolId) {
    try {
        const coursesRef = collection(db, "courses");
        const q = query(coursesRef, where("school_id", "==", schoolId));
        const querySnapshot = await getDocs(q);

        let courses = [];
        querySnapshot.forEach(doc => courses.push(doc.data()));

        return { success: true, data: courses };
    } catch (error) {
        return { success: false, message: error.message };
    }
}