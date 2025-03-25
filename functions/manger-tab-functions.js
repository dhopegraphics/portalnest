// Managers
const formDisplay = document.querySelector(".manager_form_container");
const closeBtn = document.getElementById("close_form");

const createLecturerBtn = document.getElementById("createlecturer");
const createManagerBtn = document.getElementById("createmanager");
const createOfficerBtn = document.getElementById("createofficer");
const createExaminerBtn = document.getElementById("createexaminer");


// Managers logic
// Function to display the form
function displayForm() {
  if (formDisplay) {
    formDisplay.style.display = "block";
    setTimeout(() => {
      formDisplay.style.width = "55%";
      formDisplay.style.overflow = "visible";
      formDisplay.style.opacity = "1"; // Ensure visibility
    }, 10);
  }
}

// Function to close the form
function closeForm() {
  if (formDisplay) {
    formDisplay.style.width = "0%";
    formDisplay.style.opacity = "0"; // Smooth fade out
    setTimeout(() => {
      formDisplay.style.display = "none";
    }, 300);
  }
}

createLecturerBtn.addEventListener("click", displayForm);

createManagerBtn.addEventListener("click", displayForm);

createOfficerBtn.addEventListener("click", displayForm);

createExaminerBtn.addEventListener("click", displayForm);

closeBtn.addEventListener("click", closeForm);


