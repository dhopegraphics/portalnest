import { auth, db } from "../firebaseconfig.js";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { doc, setDoc, collection, query, where, getDocs, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { setPersistence, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Ensure user stays logged in
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Persistence set to local."))
  .catch(error => console.error("Persistence error:", error.message));

onAuthStateChanged(auth, (user) => {
    const currentPage = window.location.pathname;

    if (user) {
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("loggedInUserEmail", user.email);
        localStorage.setItem("user_id", user.uid);

        if (currentPage !== "/pages/auth/student-auth/SignUp_Login_Form.html") {
            window.location.href = "/pages/Student-Portal/index.html";
        }
    } else {
        localStorage.removeItem("userLoggedIn");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const signUpButton = document.querySelector("#register-button");

    signUpButton.addEventListener("click", async function () {
        const email = document.querySelector(".email-signUp").value;
        const password = document.querySelector("#password-signUp").value;
        const institution_input = document.querySelector("#Institution_code").value;
        const Student_Code = document.querySelector("#Student_id").value;
        const Student_Username = document.querySelector("#Username").value;

        if (!email || !password || !institution_input || !Student_Code) {
            showAlert("⚠️ Please Fill email, password, institution_input and Student_Code");
            return;
        }

        signUpButton.classList.add("loading"); // Start Loading Animation

        try {
            // ✅ Validate student and institution before proceeding
            const isValid = await validateStudentAndInstitution(Student_Code, institution_input);
            if (!isValid) {
                signUpButton.classList.remove("loading");
                return;
            }

            // ✅ Check if email already exists in Firestore
            const usersCollection = collection(db, "users");
            const emailQuery = query(usersCollection, where("email", "==", email));
            const querySnapshot = await getDocs(emailQuery);

            if (!querySnapshot.empty) {
                showAlert("❌ Email already exists in our database.");
                signUpButton.classList.remove("loading");
                return;
            }

            // ✅ Check Firebase Authentication for existing email
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                showAlert("❌ Email already in use. Please try another email.");
                signUpButton.classList.remove("loading");
                return;
            }

            // ✅ Get the last used student ID
            const lastUserQuery = query(usersCollection, orderBy("user_id", "desc"), limit(1));
            const lastUserSnapshot = await getDocs(lastUserQuery);

            let newStudentNumber = 1;
            if (!lastUserSnapshot.empty) {
                const lastUserId = lastUserSnapshot.docs[0].id;
                const lastNumber = parseInt(lastUserId.replace("student", "")) || 0;
                newStudentNumber = lastNumber + 1;
            }

            const documentId = `student${newStudentNumber}`;

            // ✅ Create User in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ✅ Store User Data in Firestore
            const userData = {
                email: email,
                full_name: null,
                user_id: user.uid,
                institution_code: institution_input,
                phone_number: null,
                student_id: Student_Code,
                user_type: "Student",
                username: Student_Username,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            };

            await setDoc(doc(db, "users", documentId), userData);

            signUpButton.classList.remove("loading");

            showAlert("🎉 Sign Up Successful! Click OK to proceed.", () => {
                window.location.href = "/pages/Student-Portal/index.html";
            });

        } catch (error) {
            console.error("Error:", error.message);
            showAlert("❌ Sign Up Failed: " + error.message);
            signUpButton.classList.remove("loading");
        }
    });
});

// ✅ Function to Validate Student ID and Institution Code
async function validateStudentAndInstitution(studentId, institutionCode) {
    try {
        // Check if student ID exists
        const studentsCollection = collection(db, "students");
        const studentQuery = query(studentsCollection, where("student_id", "==", studentId));
        const studentSnapshot = await getDocs(studentQuery);

        if (studentSnapshot.empty) {
            showAlert("❌ Invalid Student ID. Please check and try again.");
            return false;
        }

        const studentData = studentSnapshot.docs[0].data();
        if (studentData.institution_code !== institutionCode) {
            showAlert("❌ Institution Code does not match with student record.");
            return false;
        }

        // Check if institution code exists in schools collection
        const schoolsCollection = collection(db, "schools");
        const schoolQuery = query(schoolsCollection, where("institution_code", "==", institutionCode));
        const schoolSnapshot = await getDocs(schoolQuery);

        if (schoolSnapshot.empty) {
            showAlert("❌ Institution Code not found in schools database.");
            return false;
        }

        return true;
    } catch (error) {
        console.error("Validation Error:", error.message);
        showAlert("❌ Validation Failed: " + error.message);
        return false;
    }
}

// ✅ Function to Show Custom Alert
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
            callback();
        }
    };
}

// Clear localStorage on new login
document.querySelector("#register-button").addEventListener("click", function () {
    document.querySelectorAll("input").forEach(input => {
        localStorage.removeItem(input.name);
    });
});