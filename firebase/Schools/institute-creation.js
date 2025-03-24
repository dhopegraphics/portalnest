import { db, auth } from "../firebaseconfig.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Function to generate unique school_id
async function generateSchoolId(schoolName, district) {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const formattedName = schoolName.replace(/\s+/g, "").toLowerCase();
    const formattedDistrict = district.replace(/\s+/g, "").toLowerCase();
    let schoolId = `${formattedName}_${formattedDistrict}_${randomNum}`;
    
    return schoolId;
}

// Function to save school data locally & check authentication
async function saveSchoolData() {
    try {
        const schoolName = document.querySelector("#school-name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const hotlines = [
            document.querySelector("input[name='hotlines1']").value.trim(),
            document.querySelector("input[name='hotlines2']").value.trim()
        ].filter(Boolean);
        const country = document.querySelector("#country")?.value || null;
        const region = document.querySelector("#region")?.value || null;
        const district = document.querySelector("#district")?.value || null;
        const city = document.querySelector("#city")?.value || null;
        const town = document.querySelector("#town")?.value || null;
        const schoolType = document.querySelector("#School-type").value.trim();
        const aboutSchool = document.querySelector("#about-school").value.trim();

        if (!schoolName || !district || !country || !city) {
            alert("⚠️ Please fill in all required fields.");
            return;
        }

        const schoolId = await generateSchoolId(schoolName, district);

        const schoolData = {
            school_id: schoolId, 
            school_name: schoolName,
            email: email || null,
            hotlines: hotlines.length > 0 ? hotlines : null,
            school_type: schoolType,
            about_school: aboutSchool || null,
            location: { country, region, district, city, town },
            approved: false,
            approved_at: null
        };

        // Store school data in localStorage
        localStorage.setItem("pendingSchoolData", JSON.stringify(schoolData));

        // Check if user is signed in
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is logged in. Saving school data...");
                createSchoolDocument(schoolData);
            } else {
                console.log("No user logged in. Redirecting to signup...");
                window.location.href = "/pages/auth/manager-auth/sign-up-portalNest.html"; // Adjust the path to your signup page
            }
        });

    } catch (error) {
        console.error("❌ Error saving school data:", error.message);
        alert("❌ Failed to save school data: " + error.message);
    }
}

// Function to create school document in Firestore
async function createSchoolDocument(schoolData) {
    try {
        const schoolRef = doc(db, "schools", schoolData.school_id);
        const docSnap = await getDoc(schoolRef);

        if (docSnap.exists()) {
            alert("⚠️ A school with this ID already exists.");
            return;
        }

        await setDoc(schoolRef, schoolData);
        localStorage.removeItem("pendingSchoolData"); // Remove after saving
        console.log("✅ School data saved successfully!");
        alert("✅ School data saved successfully!");
    } catch (error) {
        console.error("❌ Error creating school document:", error.message);
        alert("❌ Failed to save school data: " + error.message);
    }
}

// Listen for authentication state when the page loads
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user.email);
        
        // Check if there is pending school data in localStorage
        const savedData = localStorage.getItem("pendingSchoolData");
        if (savedData) {
            const schoolData = JSON.parse(savedData);
            createSchoolDocument(schoolData);
        }
    }
});

// Attach event listener to button
document.querySelector(".btn.submit").addEventListener("click", (event) => {
    event.preventDefault();
    saveSchoolData();
});