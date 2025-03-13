import { db } from "/firebase/firebaseconfig.js";
import { doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Function to update user data
async function updateUserData(documentId, updatedData) {
    try {
        const userRef = doc(db, "users", documentId);
        
        await updateDoc(userRef, {
            ...updatedData,
            updated_at: serverTimestamp() // Updates timestamp
        });

        alert("Profile updated successfully!");
    } catch (error) {
        console.error("Error updating user:", error.message);
        alert("Update Failed: " + error.message);
    }
}

// Example Usage:
document.getElementById("updateProfileBtn").addEventListener("click", async function () {
    const documentId = "student___1"; // Fetch dynamically based on logged-in user

    const updatedInfo = {
        full_name: "Isaac Nana Sam Mensah",
        institution_code: "123456",
        phone_number: "+233597959032",
        student_id: "STU-2025-001",
        user_type: "Student",
        username: "dhope_graphics"
    };

    await updateUserData(documentId, updatedInfo);
});