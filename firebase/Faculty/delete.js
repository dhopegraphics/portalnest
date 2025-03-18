import { db } from "../firebaseconfig.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ DELETE Faculty
export async function deleteFaculty(facultyId) {
    try {
        const facultyRef = doc(db, "faculties", facultyId);
        await deleteDoc(facultyRef);

        return { success: true, message: "Faculty deleted successfully." };
    } catch (error) {
        return { success: false, message: error.message };
    }
}