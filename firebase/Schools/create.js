import { db } from "../firebaseconfig.js";
import { doc, setDoc, getDoc, getDocs, query, collection, where } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Function to generate unique school_id
async function generateSchoolId(schoolName, district) {
    const randomNum = Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit random number
    const formattedName = schoolName.replace(/\s+/g, "").toLowerCase(); // Remove spaces & lowercase
    const formattedDistrict = district.replace(/\s+/g, "").toLowerCase();

    let schoolId = `${formattedName}_${formattedDistrict}_${randomNum}`;

    // Ensure the school_id is unique in Firestore
    const schoolRef = doc(db, "schools", schoolId);
    const docSnap = await getDoc(schoolRef);

    if (docSnap.exists()) {
        return await generateSchoolId(schoolName, district); // Regenerate if ID already exists
    }

    return schoolId;
}

// Function to save school data to Firestore
async function saveSchoolData() {
    try {
        const schoolName = document.querySelector("#school_name").value.trim();
        const district = document.querySelector("#district").value.trim();

        if (!schoolName || !district) {
            alert("⚠️ Please enter both school name and district.");
            return;
        }

        const schoolId = await generateSchoolId(schoolName, district); // Generate unique school ID
        const schoolRef = doc(db, "schools", schoolId); // Use school_id as document ID

        // Check if school already exists
        const docSnap = await getDoc(schoolRef);
        if (docSnap.exists()) {
            alert("⚠️ A school with this ID already exists.");
            return;
        }

        const schoolData = {
            school_id: schoolId,
            school_name: schoolName,
            school_category: document.querySelector("#school_category").value.trim(),
            school_type: document.querySelector("#school_type").value.trim(),
            approved: false, // Default approval status
            approved_at: null, // Default null, will be updated later

            location: {
                city: document.querySelector("#city").value.trim(),
                country: document.querySelector("#country").value.trim(),
                district: district,
                region: document.querySelector("#region").value.trim(),
            },

            requirements: {
                academic_documents: {
                    documents_types: Array.from(document.querySelectorAll(".documents_types input")).map(input => input.value.trim()),
                    required: document.querySelector("#academic_documents_required").checked
                },

                accepted_nationalities: Array.from(document.querySelectorAll(".accepted_nationalities input")).map(input => input.value.trim()),

                admission_fee: document.querySelector("#admission_fee").value.trim(),

                entrance_exam: {
                    exam_type: document.querySelector("#exam_type").value || null,
                    required: document.querySelector("#entrance_exam_required").checked
                },

                identification_documents: {
                    identification_types: Array.from(document.querySelectorAll(".identification_types input")).map(input => input.value.trim()),
                    required: document.querySelector("#identification_required").checked
                },

                interview_required: document.querySelector("#interview_required").checked,
                minimum_gpa: document.querySelector("#minimum_gpa").value.trim()
            }
        };

        // Save data to Firestore
        await setDoc(schoolRef, schoolData);

        console.log("✅ School data saved successfully!");

        alert("✅ School data saved successfully!");
    } catch (error) {
        console.error("❌ Error saving school data:", error.message);
        alert("❌ Failed to save school data: " + error.message);
    }
}

// Attach event listener to the "Save" button
document.querySelector("#saveSchoolBtn").addEventListener("click", saveSchoolData);