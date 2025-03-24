import { db } from "../firebaseconfig.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ READ: Get all colleges by school_id
export async function getCollegesBySchoolId(schoolId) {
    try {
        const collegesRef = collection(db, "colleges");
        const q = query(collegesRef, where("school_id", "==", schoolId));
        const querySnapshot = await getDocs(q);

        let colleges = [];
        querySnapshot.forEach(doc => colleges.push(doc.data()));

        return { success: true, data: colleges };
    } catch (error) {
        return { success: false, message: error.message };
    }
}