import { db } from "../firebaseconfig.js";
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


// ✅ Define schoolDataMap globally
const schoolDataMap = {};

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
          const selectedSchoolData = schoolDataMap[schoolName];
    if (selectedSchoolData && selectedSchoolData.school_id) {
        localStorage.setItem("selectedSchoolId", selectedSchoolData.school_id);
        console.log("✅ School ID saved to localStorage:", selectedSchoolData.school_id);
    }
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
    // ✅ Function to update School Level dropdown and handle download button
function updateSchoolLevels(selectedSchool) {
    const schoolData = schoolDataMap[selectedSchool];
    const schoolLevelDropdown = document.querySelector("#SchoolLevel");
    const downloadBtn = document.querySelector("#downloadRequirementsBtn");

    if (schoolData) {
        // ✅ Update school levels
        if (schoolData.school_levels_available) {
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

       // ✅ Handle the requirements download button
if (schoolData.requirement_dwn) {
    downloadBtn.href = schoolData.requirement_dwn; // Set the PDF link
    downloadBtn.style.display = "block"; // Show the button
} else {
    downloadBtn.style.display = "block"; // Show the button but handle alert

    // Remove any previous event listeners to prevent duplicate alerts
    downloadBtn.replaceWith(downloadBtn.cloneNode(true));
    const newDownloadBtn = document.querySelector("#downloadRequirementsBtn");

    newDownloadBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default behavior

        if (!selectedSchool) {
            showAlert("❌ Please select a school before downloading requirements.");
            return;
        }

        showAlert("⚠ No requirements document available for this school.");
    });
}
    } else {
        schoolLevelDropdown.innerHTML =
            "<li><a class='dropdown-item'>No levels available</a></li>";
        downloadBtn.style.display = "none"; // Hide button if schoolData is not found
    }
}

    console.log("✅ Approved schools loaded into dropdown!");
  } catch (error) {
    console.error("❌ Error fetching approved schools:", error.message);
  }
}

// Fetch schools automatically when the page loads
document.addEventListener("DOMContentLoaded", populateSchoolDropdown);

document.addEventListener("DOMContentLoaded", function () {
    const downloadBtn = document.querySelector("#downloadRequirementsBtn");
    const dropdownInput = document.querySelector("#dropdownInput");
    const noCheckbox = document.querySelector("#no");

    // Hide button by default
    if (downloadBtn) downloadBtn.style.display = "none";

    // ✅ Show button when "No" is checked
    if (noCheckbox) {
        noCheckbox.addEventListener("change", function () {
            if (noCheckbox.checked) {
                downloadBtn.style.display = "block"; // Show button
            } else {
                downloadBtn.style.display = "none"; // Hide button if unchecked
            }
        });
    }

    // ✅ Handle button click event
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default behavior

            const selectedSchool = dropdownInput.value.trim();
            console.log("🔍 Selected School:", selectedSchool);

            if (!selectedSchool) {
                showAlert("❌ Please select a school before downloading requirements.");
                return;
            }

            // ✅ Get school data
            const schoolData = schoolDataMap[selectedSchool];

            console.log("📂 schoolDataMap:", schoolDataMap);
            console.log("📌 Retrieved School Data:", schoolData);

            if (!schoolData) {
                showAlert("❌ School data not found. Please select a valid school.");
                return;
            }

            console.log("📁 requirement_dwn:", schoolData.requirement_dwn);

            // ✅ SAFARI FIX: Ensure requirement_dwn is valid
            if (
                !schoolData.requirement_dwn ||
                schoolData.requirement_dwn.trim() === "" ||
                typeof schoolData.requirement_dwn !== "string"
            ) {
                showAlert("⚠ No requirements document available for this school.");
                return;
            }

            // ✅ WORKAROUND: Try opening in a new tab (fixes some Safari issues)
            console.log("📥 Downloading file:", schoolData.requirement_dwn);
            window.open(schoolData.requirement_dwn, "_blank");
        });
    }
});



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