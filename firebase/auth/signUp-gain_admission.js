import { auth , db } from "../firebaseconfig.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { doc, setDoc, collection, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async function () {
    const signUpButton = document.querySelector(".log-in"); // "Create An Account" button

    signUpButton.addEventListener("click", async function () {
        const email = document.querySelector(".email input").value;
        const password = document.querySelector("#password-form input").value;

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        try {
            // Step 1: Get the current number of students in the collection
            const usersCollection = collection(db, "users");
            const snapshot = await getDocs(usersCollection);
            const totalUsers = snapshot.size + 1; // Next student number
            
            const documentId = `student${totalUsers}`; // Generate document ID
            
            // Step 2: Create User in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Step 3: Store User Data in Firestore
            const userData = {
                email: email,
                full_name: null, 
                user_id: user.uid,
                institution_code: null,
                phone_number: null,
                staff_code: null,
                student_id: null,
                user_type: "Student",
                username: null,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            };

            await setDoc(doc(db, "users", documentId), userData);

            alert("Sign Up Successful! User data saved.");
            window.location.href = "/login.html"; // Redirect to login page
        } catch (error) {
            console.error("Error:", error.message);
            alert("Sign Up Failed: " + error.message);
        }
    });
});