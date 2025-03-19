import { db } from "../firebaseconfig.js";
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Function to fetch approved schools and populate dropdown
async function populateSchoolDropdown() {
  try {
    const schoolsCollection = collection(db, "schools");
    const approvedSchoolsQuery = query(
      schoolsCollection,
      where("approved", "==", true)
    );
    const querySnapshot = await getDocs(approvedSchoolsQuery);

    console.log("📌 Query executed!");
    console.log("Query snapshot size:", querySnapshot.size);

    const dropdownMenu = document.querySelector("#schoolList");
    const dropdownInput = document.querySelector("#dropdownInput");
    const schoolLevelDropdown = document.querySelector("#SchoolLevel"); // School Level dropdown

    if (!dropdownMenu || !dropdownInput || !schoolLevelDropdown) return; // Ensure elements exist

    dropdownMenu.innerHTML = ""; // Clear existing data
    const schoolsArray = [];

    if (querySnapshot.empty) {
      dropdownMenu.innerHTML =
        "<li><a class='dropdown-item'>No approved schools found</a></li>";
      return;
    }

    // Store school data for quick access
    const schoolDataMap = {};

    querySnapshot.forEach((doc) => {
      const schoolData = doc.data();
      schoolsArray.push(schoolData.school_name);
      schoolDataMap[schoolData.school_name] = schoolData; // Store school data
    });

    // Function to display schools in the dropdown
    function displaySchools(filteredSchools) {
      dropdownMenu.innerHTML = ""; // Clear previous list

      filteredSchools.forEach((schoolName) => {
        const listItem = document.createElement("li");
        const anchor = document.createElement("a");

        anchor.classList.add("dropdown-item", "schoolListNameDropDown");
        anchor.textContent = schoolName;
        anchor.href = "#"; // Prevent default behavior

        // ✅ Select school when clicked
        anchor.addEventListener("click", function (event) {
          event.preventDefault();
          dropdownInput.value = schoolName;
          dropdownMenu.style.display = "none"; // Hide dropdown after selection

          // ✅ Fetch and update school levels
          updateSchoolLevels(schoolName);
        });

        listItem.appendChild(anchor);
        dropdownMenu.appendChild(listItem);
      });

      dropdownMenu.style.display = filteredSchools.length ? "block" : "none"; // Hide if no results
    }

    // ✅ Display all schools initially
    displaySchools(schoolsArray);

    // ✅ Add search functionality
    dropdownInput.addEventListener("input", function () {
      const searchValue = dropdownInput.value.toLowerCase();
      const filteredSchools = schoolsArray.filter((school) =>
        school.toLowerCase().includes(searchValue)
      );
      displaySchools(filteredSchools);
    });

    // ✅ Function to update School Level dropdown
    function updateSchoolLevels(selectedSchool) {
      const schoolData = schoolDataMap[selectedSchool];

      if (schoolData && schoolData.school_levels_available) {
        schoolLevelDropdown.innerHTML = ""; // Clear existing levels

        schoolData.school_levels_available.forEach((level) => {
          const listItem = document.createElement("li");
          const anchor = document.createElement("a");

          anchor.classList.add("dropdown-item");
          anchor.textContent = level;
          anchor.href = "#";

          // ✅ Select level when clicked
          anchor.addEventListener("click", function (event) {
            event.preventDefault();
            document.querySelector("#schoolLevelInput").value = level; // Update input
            schoolLevelDropdown.style.display = "none"; // Hide dropdown after selection
          });

          listItem.appendChild(anchor);
          schoolLevelDropdown.appendChild(listItem);
        });

        schoolLevelDropdown.style.display = "block"; // Show levels dropdown
      } else {
        schoolLevelDropdown.innerHTML =
          "<li><a class='dropdown-item'>No levels available</a></li>";
      }
    }

    console.log("✅ Approved schools loaded into dropdown!");
  } catch (error) {
    console.error("❌ Error fetching approved schools:", error.message);
  }
}

// Fetch schools automatically when the page loads
document.addEventListener("DOMContentLoaded", populateSchoolDropdown);

function onlyOne(checkbox) {
  const downloadBtn = document.querySelector("#downloadRequirementsBtn");
  const selectedSchool = document.querySelector("#dropdownInput").value; // Selected school name

  // Uncheck the other checkbox
  document
    .querySelectorAll(".checkboxes input[type='checkbox']")
    .forEach((cb) => {
      if (cb !== checkbox) cb.checked = false;
    });

  if (checkbox.checked && checkbox.id === "no") {
    // Ensure a school is selected
    if (!selectedSchool) {
      alert("Please select a school first!");
      checkbox.checked = false; // Uncheck if no school is selected
      return;
    }

    // Fetch the school's requirement_dwn URL
    fetchSchoolRequirement(selectedSchool, downloadBtn);
  } else {
    downloadBtn.style.display = "none"; // Hide button if unchecked
  }
}
// Function to fetch school requirement PDF link
async function fetchSchoolRequirement(schoolName, button) {
  try {
    console.log("📌 Fetching requirements for:", schoolName);
    const schoolsCollection = collection(db, "schools");
    const schoolQuery = query(
      schoolsCollection,
      where("school_name", "==", schoolName)
    );
    const querySnapshot = await getDocs(schoolQuery);

    if (!querySnapshot.empty) {
      const schoolData = querySnapshot.docs[0].data();
      console.log("✅ School Data:", schoolData);

      if (schoolData.requirement_dwn) {
        button.href = schoolData.requirement_dwn; // Set PDF link
        button.style.display = "block"; // Show button
        console.log(
          "✅ Download button shown with link:",
          schoolData.requirement_dwn
        );
      } else {
        console.warn("⚠️ No requirement file available for this school.");
        button.style.display = "none"; // Hide button if no file exists
      }
    } else {
      console.error("❌ School not found in database!");
    }
  } catch (error) {
    console.error("❌ Error fetching school requirement:", error.message);
  }
}

document.addEventListener("DOMContentLoaded", function () {
    const dropdownInput = document.querySelector("#dropdownInput");
    const dropdownMenu = document.querySelector("#schoolList");
    const schoolLevelDropdown = document.querySelector("#SchoolLevel");
  
    if (dropdownInput && dropdownMenu) {
      dropdownInput.addEventListener("focus", function () {
        dropdownMenu.style.display = "block";
      });
    }
  
    if (schoolLevelDropdown) {
      schoolLevelDropdown.style.display = "none"; // Hide initially
    }
  });