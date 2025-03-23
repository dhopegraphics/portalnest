import { auth, db } from "../firebaseconfig.js";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { doc, setDoc, collection, query, where, getDocs, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { setPersistence, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Ensure user stays logged in
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Persistence set to local."))
  .catch(error => console.error("Persistence error:", error.message));

  onAuthStateChanged(auth, (user) => {
    const currentPage = window.location.pathname; // Get the current page URL

    if (user) {
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("loggedInUserEmail", user.email);
        localStorage.setItem("user_id", user.uid);
    } else {
        localStorage.removeItem("userLoggedIn");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const signUpButton = document.querySelector(".sign-up");

    signUpButton.addEventListener("click", async function () {
        const email = document.querySelector(".email input").value;
        const password = document.querySelector("#password-form input").value;

        if (!email || !password) {
            showAlert("⚠️ Please enter both email and password.");
            return;
        }

        signUpButton.classList.add("loading"); // ✅ Start Loading Animation

        try {
            // ✅ Check if email exists in Firestore
            const usersCollection = collection(db, "users");
            const emailQuery = query(usersCollection, where("email", "==", email));
            const querySnapshot = await getDocs(emailQuery);

            // ✅ Check Firebase Authentication for existing email
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length > 0) {
            showConfirm(
                "❌ Email already in use. Do you wish to sign in instead?",
                () => {
                    window.location.href = "/pages/auth/admission/sign-in-to-continue-application.html";
                },
                () => {
                    signUpButton.classList.remove("loading"); // Stop loading
                }
            );
            return;
        }

            // ✅ Get the last used student ID
            const lastUserQuery = query(usersCollection, orderBy("user_id", "desc"), limit(1));
            const lastUserSnapshot = await getDocs(lastUserQuery);

            let newIdNumber = 1;
            if (!lastUserSnapshot.empty) {
                const lastUserId = lastUserSnapshot.docs[0].id;
                const lastNumber = parseInt(lastUserId.replace("school_manager", "")) || 0;
                newIdNumber = lastNumber + 1;
            }

            const documentId = `School_Manager${newIdNumber}`;

            // ✅ Create User in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ✅ Store User Data in Firestore
            const userData = {
                email: email,
                user_id: user.uid,
                user_type: "School Manager",
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            };

            await setDoc(doc(db, "users", documentId), userData); // ✅ Ensure Firestore document is created before moving forward

            // ✅ Stop Loading Animation
            signUpButton.classList.remove("loading");

            // ✅ Show success alert and WAIT for "OK" before redirecting
            showAlert("🎉 Sign Up Successful! Click OK to proceed.", () => {
                // ✅ Redirect after user clicks "OK"
                window.location.href = "/pages/Miscellaneous/institution-status.html";
            });

        } catch (error) {
            console.error("Error:", error.message);
            showAlert("❌ Sign Up Failed: " + error.message);
            signUpButton.classList.remove("loading"); // Stop loading animation on failure
        }
    });
});

// Function to Show Custom Alert and Wait for "OK"
function showAlert(message, callback = null) {
    const alertBox = document.getElementById("custom-alert");
    const alertMessage = document.getElementById("alert-message");
    const closeAlert = document.getElementById("close-alert");

    alertMessage.innerText = message;
    alertBox.classList.remove("hidden");
    alertBox.classList.add("show");

    closeAlert.onclick = function () {
        alertBox.classList.add("hidden");
        alertBox.classList.remove("show");

        if (callback) {
            callback(); // Execute callback AFTER user clicks "OK"
        }
    };
}

function showConfirm(message, onConfirm, onCancel) {
    const confirmBox = document.getElementById("custom-confirm");
    const confirmMessage = document.getElementById("confirm-message");
    const confirmYes = document.getElementById("confirm-yes");
    const confirmNo = document.getElementById("confirm-no");

    confirmMessage.innerText = message;
    confirmBox.classList.remove("hidden");
    confirmBox.classList.add("show");

    confirmYes.onclick = function () {
        confirmBox.classList.add("hidden");
        confirmBox.classList.remove("show");
        if (onConfirm) onConfirm();
    };

    confirmNo.onclick = function () {
        confirmBox.classList.add("hidden");
        confirmBox.classList.remove("show");
        if (onCancel) onCancel();
    };
}


// Clear localStorage on new login
document.querySelector(".sign-up").addEventListener("click", function () {
    document.querySelectorAll("input").forEach(input => {
        localStorage.removeItem(input.name);
    });
});