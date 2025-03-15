import { db, auth } from "../firebaseconfig.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Function to generate a unique faculty_id
async function generateFacultyId() {
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    let facultyId = `faculty_${randomNum}`;

    // Ensure faculty_id is unique
    const facultyRef = doc(db, "faculties", facultyId);
    const docSnap = await getDoc(facultyRef);

    if (docSnap.exists()) {
        return await generateFacultyId(); // Regenerate if ID already exists
    }

    return facultyId;
}

// Function to save faculty data to Firestore
async function saveFacultyData() {
    try {
        // Get the currently logged-in user
        const user = auth.currentUser;
        if (!user) {
            alert("⚠️ You must be logged in to add a faculty.");
            return;
        }

        const facultyName = document.querySelector("#faculty_name").value.trim();
        const schoolId = document.querySelector("#school_id").value.trim();

        if (!facultyName || !schoolId) {
            alert("⚠️ Please fill in all required fields.");
            return;
        }

        const facultyId = await generateFacultyId(); // Generate unique faculty ID
        const facultyRef = doc(db, "faculties", facultyId); // Use faculty_id as document ID

        const facultyData = {
            faculty_id: facultyId,
            faculty_name: facultyName,
            school_id: schoolId,
            created_by: user.uid, // Logged-in user's ID
            created_at: serverTimestamp(), // Firestore timestamp
            updated_at: serverTimestamp()  // Initially set as created time
        };

        // Save data to Firestore
        await setDoc(facultyRef, facultyData);

        console.log("✅ Faculty data saved successfully!");
        alert("✅ Faculty data saved successfully!");

    } catch (error) {
        console.error("❌ Error saving faculty data:", error.message);
        alert("❌ Failed to save faculty data: " + error.message);
    }
}

// Attach event listener to the "Save" button
document.querySelector("#saveFacultyBtn").addEventListener("click", saveFacultyData);

// Ensure user authentication state is checked
onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert("⚠️ You are not logged in. Please log in first.");
    }
});