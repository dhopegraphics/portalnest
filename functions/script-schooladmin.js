






const managersForm = document.querySelector(".manager_form");
const firstName = document.querySelector("#fristname");
const lastName = document.querySelector("#lastname");
const personEmail = document.querySelector("#personmail");
const personNumber = document.querySelector("#number");
const formPosition = document.querySelector("#position");
const formDepartment = document.querySelector("#department");
const yearOption = document.querySelectorAll(".year-option");
const permissionOptions = document.querySelectorAll(".permission-option");
const courseOptions = document.querySelectorAll(".course-option");
const formDisplayContainer = document.querySelector(
  ".initial_content_container"
);

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Function to get selected values from dataset-based options
function getSelectedOption(options) {
  let selected = "";
  options.forEach((option) => {
    // if (option.classList.contains("selected")) {
    selected = option.getAttribute("data-value");
    option.classList.add("active");

    console.log(selected);
    // }
  });
  return selected;
}

// Function to collect form data
function collectFormData() {
  return {
    fullName: `${firstName.value.trim()} ${lastName.value.trim()}`,
    email: personEmail.value.trim(),
    phone: personNumber.value.trim(),
    role: formPosition.options[formPosition.selectedIndex].text,
    department: formDepartment.options[formDepartment.selectedIndex].text,
    year: getSelectedOption(yearOption),
    course: getSelectedOption(courseOptions),
    permission: getSelectedOption(permissionOptions),
  };
}

// Function to render manager info
function renderManagerCard(data) {
  const managerInfo = document.createElement("div");
  managerInfo.classList.add("manager_content_container");
  managerInfo.dataset.id = Date.now();

  managerInfo.innerHTML = `
    <h1>Lecturer/Teacher :</h1>
    <div class="initial_title flex">
      <p>Name</p>
      <p>Department</p>
      <p>Course</p>
      <p>Year</p>
      <p>Salary($)</p>
    </div>
    <div class="initial_content grid">
      <div class="person_details flex">
        <div class="person_img"></div>
        <p>${data.fullName}</p>
      </div>
      <div class="program_title flex">
        <p>${data.department}</p>
      </div>
      <div class="course_title flex">
        <p>${data.course}</p>
      </div>
      <div class="program_level flex">
        <p>${data.year}</p>
      </div>
      <div class="manager_salary flex">
        <p>12000</p>
        <div class="salary_btn_container flex">
          <button class="flex"><span>+</span> Add Roles</button>
          <button class="flex"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="flex">&times;</button>
        </div>
      </div>
    </div>
  `;

  formDisplayContainer.appendChild(managerInfo);
}

managersForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = collectFormData();
  console.log(formData);

  if (
    !formData.fullName ||
    !formData.email ||
    !formData.phone ||
    !formData.role ||
    !formData.department ||
    !formData.year ||
    !formData.course ||
    !formData.permission
  ) {
    alert("Please fill out all fields correctly.");
    return;
  }

  if (!validateEmail(formData.email)) {
    alert("Please enter a valid email address.");
    return;
  }

  renderManagerCard(formData);
  managersForm.reset();
});

managersForm.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.tagName === "INPUT") {
    e.preventDefault();
    managersForm.requestSubmit();
    closeForm();
  }
});

// Grading chats
const performanceCtx = document
  .getElementById("performanceChart")
  .getContext("2d");
const gradeCtx = document.getElementById("gradeChart").getContext("2d");

new Chart(performanceCtx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Performance",
        data: [75, 80, 82, 78, 81],
        borderColor: "#4c6ef5",
        fill: false,
        tension: 0.4,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

new Chart(gradeCtx, {
  type: "doughnut",
  data: {
    labels: ["A", "B", "C", "D", "F"],
    datasets: [
      {
        data: [40, 25, 20, 10, 5],
        backgroundColor: [
          "#4c6ef5",
          "#5c7cfa",
          "#748ffc",
          "#91a7ff",
          "#bac8ff",
        ],
      },
    ],
  },
});

// Toggling on the setting button
document.querySelector(".setting_first_icon").addEventListener("click", () => {
  document.querySelector(".btn_setting_on").classList.toggle("active");
  document.querySelector(".btn_setting_off").classList.toggle("active");
});

document.querySelector(".setting_last_icon").addEventListener("click", () => {
  document.querySelector(".btn_setting_last_on").classList.toggle("active");
  document.querySelector(".btn_setting_last_off").classList.toggle("active");
});
