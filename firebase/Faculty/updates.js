import { db } from "../firebaseconfig.js";
import { doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ✅ UPDATE Faculty
export async function updateFaculty(facultyId, updatedData) {
    try {
        const facultyRef = doc(db, "faculties", facultyId);

        await updateDoc(facultyRef, {
            ...updatedData,
            updated_at: serverTimestamp()
        });

        return { success: true, message: "Faculty updated successfully." };
    } catch (error) {
        return { success: false, message: error.message };
    }
}