import { db } from "../firebaseconfig.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Function to generate unique school_id
async function generateSchoolId(schoolName, district) {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const formattedName = schoolName.replace(/\s+/g, "").toLowerCase();
    const formattedDistrict = district.replace(/\s+/g, "").toLowerCase();
    let schoolId = `${formattedName}_${formattedDistrict}_${randomNum}`;
    
    return schoolId;
}

// Function to save school data to Firestore
async function saveSchoolData() {
    try {
        const schoolName = document.querySelector("#school-name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const hotlines = [
            document.querySelector("input[name='hotlines1']").value.trim(),
            document.querySelector("input[name='hotlines2']").value.trim()
        ].filter(Boolean);
        const countrySelect = document.querySelector("#country");
        const country = countrySelect.options[countrySelect.selectedIndex]?.text || null;
        
        const regionSelect = document.querySelector("#region");
        const region = regionSelect.options[regionSelect.selectedIndex]?.text || null;
        
        const districtSelect = document.querySelector("#district");
        const district = districtSelect.options[districtSelect.selectedIndex]?.text || null;
        
        const citySelect = document.querySelector("#city");
        const city = citySelect.options[citySelect.selectedIndex]?.text || null;
        
        const townSelect = document.querySelector("#town");
        const town = townSelect.options[townSelect.selectedIndex]?.text || null;

        const schoolType = document.querySelector("#School-type").value.trim();
        const aboutSchool = document.querySelector("#about-school").value.trim();


        
        if (!schoolName || !district) {
            alert("⚠️ Please enter both school name and district.");
            return;
        }

        if (!country || !city) {
            alert("⚠️ Please enter both city and country.");
            return;
        }

        const schoolId = await generateSchoolId(schoolName, district);
        const schoolRef = doc(db, "schools", schoolId);
        
        const docSnap = await getDoc(schoolRef);
        if (docSnap.exists()) {
            alert("⚠️ A school with this ID already exists.");
            return;
        }
        
        const schoolData = {
            school_id: schoolId, // Ensure school_id matches document ID
            school_name: schoolName,
            email: email || null,
            hotlines: hotlines.length > 0 ? hotlines : null,
            school_type: schoolType,
            about_school: aboutSchool || null,
            location: {
                country: country || null,
                region: region || null,
                district: district,
                city: city || null,
                town: town || null,
            },
            approved: false,
            approved_at: null,
        };
        
        await setDoc(schoolRef, schoolData);

        console.log("✅ School data saved successfully!");
        alert("✅ School data saved successfully!");
    } catch (error) {
        console.error("❌ Error saving school data:", error.message);
        alert("❌ Failed to save school data: " + error.message);
    }
}

document.querySelector(".btn.submit").addEventListener("click", (event) => {
    event.preventDefault(); // Prevents form submission
    saveSchoolData();
});
