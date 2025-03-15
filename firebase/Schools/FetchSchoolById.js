import { db } from "../firebaseconfig.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ READ: Get single faculty by ID
export async function getFacultyById(facultyId) {
    try {
        const facultyRef = doc(db, "faculties", facultyId);
        const docSnap = await getDoc(facultyRef);

        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() };
        } else {
            throw new Error("Faculty not found.");
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ✅ READ: Get all faculties
export async function getAllFaculties() {
    try {
        const facultiesRef = collection(db, "faculties");
        const querySnapshot = await getDocs(facultiesRef);

        let faculties = [];
        querySnapshot.forEach(doc => faculties.push(doc.data()));

        return { success: true, data: faculties };
    } catch (error) {
        return { success: false, message: error.message };
    }
}