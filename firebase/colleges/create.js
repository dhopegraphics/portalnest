import { db } from "../firebaseconfig.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Function to generate a unique college_id (e.g., "college_sch3433_12345")
function generateCollegeId(schoolId) {
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `college_${schoolId}_${randomNum}`;
}

// ✅ CREATE: Add new college
export async function createCollege(collegeData) {
    try {
        if (!collegeData.school_id || !collegeData.college_name || !collegeData.institution_code) {
            throw new Error("Missing required fields.");
        }

        const collegeId = generateCollegeId(collegeData.school_id); // Generate ID
        const collegeRef = doc(db, "colleges", collegeId);

        const newCollege = {
            college_id: collegeId,
            college_name: collegeData.college_name,
            institution_code: collegeData.institution_code,
            school_id: collegeData.school_id,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        };

        await setDoc(collegeRef, newCollege);

        return { success: true, message: "College added successfully!", data: newCollege };
    } catch (error) {
        return { success: false, message: error.message };
    }
}