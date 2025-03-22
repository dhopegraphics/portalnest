// Managers
const formDisplay = document.querySelector(".manager_form_container");
const closeBtn = document.getElementById("close_form");

const createLecturerBtn = document.getElementById("createlecturer");
const createManagerBtn = document.getElementById("createmanager");
const createOfficerBtn = document.getElementById("createofficer");
const createExaminerBtn = document.getElementById("createexaminer");


// Managers logic
function displayForm() {
  formDisplay.style.display = "block";
   setTimeout(() => {
    formDisplay.style.width = "55%"; // Adjust width as needed
    formDisplay.style.overflow = "visible"; // Enable scrolling once open
    }, 10);
}

function closeForm() {
  formDisplay.style.width = "0%";
  setTimeout(() => {
    formDisplay.style.display = "none";
  }, 200);
}

createLecturerBtn.addEventListener("click", displayForm);

createManagerBtn.addEventListener("click", displayForm);

createOfficerBtn.addEventListener("click", displayForm);

createExaminerBtn.addEventListener("click", displayForm);

closeBtn.addEventListener("click", closeForm);
