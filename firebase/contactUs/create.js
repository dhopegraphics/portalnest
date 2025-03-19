import { db } from "../firebaseconfig.js";
import { doc, setDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Function to get user ID from email
async function getUserIdFromEmail(email) {
    if (!email) return null;

    try {
        // Query the 'users' collection to find the user by email
        const usersRef = collection(db, "users"); // Ensure your user data is stored in the "users" collection
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            return userData.user_id || null; // Ensure the user document has a 'user_id' field
        }
    } catch (error) {
        console.error("Error fetching user ID from email:", error);
    }
    return null;
}

// Function to handle form submission
async function submitContactForm() {
    // Check if the user is logged in
    const isUserLoggedIn = localStorage.getItem("userLoggedIn") === "true";
    let userId = localStorage.getItem("user_id") || null; // Get user ID from localStorage
    const email = localStorage.getItem("email") || null; // Get email from localStorage

    // Get form values
    const fullName = document.getElementById("fullname").value.trim();
    const formEmail = document.getElementById("email").value.trim();
    const formMessage = document.getElementById("message").value.trim();

    if (!fullName || !formEmail || !formMessage) {
        alert("Please fill in all fields.");
        return;
    }

    // If userId is null, try getting it from Firestore using the email
    if (!userId && email) {
        userId = await getUserIdFromEmail(email);
    }

    // Prepare Firestore document data
    const contactData = {
        full_name: fullName,
        email: formEmail,
        form_message: formMessage,
        is_user: isUserLoggedIn,
        user_id: userId ? userId : "", // Use retrieved user_id or an empty string if not found
    };

    try {
        // Generate a new document reference in the contact_form collection
        const docRef = doc(collection(db, "contact_form"));

        // Save the document
        await setDoc(docRef, contactData);
        alert("Form submitted successfully!");
    } catch (error) {
        console.error("Error submitting form: ", error);
        alert("Failed to submit form. Try again.");
    }
}

// Attach event listener to form submission button
document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submitBtn");
    if (submitButton) {
        submitButton.addEventListener("click", submitContactForm);
    }
});