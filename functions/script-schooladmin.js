"use strict";

const buttons = document.querySelectorAll(".btn__navigate");
const contents = document.querySelectorAll(".content");

// DEFAULT DISPLAY AND SELECTION OF PAGES
function contentHolder() {
  function loadPage(page) {
    fetch(page)
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("content-area").innerHTML = data;
      })
      .catch((error) => console.error("Error loading the page:", error));
  }

  // loading content function
  function loadComponent(file) {
    fetch(file)
      .then((response) => response.text())
      .then(
        (data) => (document.getElementById("cardContainer").innerHTML = data)
      )
      .catch((error) => console.error(`Error loading ${file}:`, error));
  }

  return function (param1, param2) {
    loadPage(param1);
    loadComponent(param2);
  };
}
const displayPages = contentHolder();

document.addEventListener("DOMContentLoaded", () => {
  const dashboardBtn = document.querySelector(".dashboardbtn");

  if (dashboardBtn) {
    dashboardBtn.classList.add("active");
    displayPages("dashboard.html", "main-hero-content.html");
  }
});

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => btn.classList.remove("active"));
    contents.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");

    const targetData = button.getAttribute("data-target");

    document.getElementById(targetData).classList.add("active");
  });
});

// Header menu button function
const menuBtn = document.querySelector(".btn__menu");
const navigationSection = document.querySelector(".navigation");

menuBtn.addEventListener("click", () => {
  navigationSection.classList.toggle("close");
  document.querySelectorAll(".pending__left-content").forEach((width) => {
    width.classList.toggle("width");
  });
  document.querySelector(".see_all").classList.toggle("width");
});

// Change header text base on navigation buttonn click
document.querySelector(".admissionbtn").addEventListener("click", () => {
  document.querySelector(".header_title_text").textContent =
    "Admissions Management";
});

document
  .querySelector(".student-managementbtn")
  .addEventListener("click", () => {
    document.querySelector(".header_title_text").textContent =
      "Student Management";
  });

document
  .querySelector(".faculty-managementbtn")
  .addEventListener("click", () => {
    document.querySelector(".header_title_text").textContent =
      "Faculties Management";
  });

document.querySelector(".departmentbtn").addEventListener("click", () => {
  document.querySelector(".header_title_text").textContent =
    "Department Managements";
});

document.querySelector(".coursebtn").addEventListener("click", () => {
  document.querySelector(".header_title_text").textContent =
    "Course Management";
});

document.querySelector(".gradingbtn").addEventListener("click", () => {
  document.querySelector(".header_title_text").textContent =
    "Grade Managements";
});

function defaultText() {
  document.querySelector(".header_title_text").textContent =
    "Dashboard-School Manager";
}

document.querySelector(".eventbtn").addEventListener("click", defaultText);
document.querySelector(".reportbtn").addEventListener("click", defaultText);
document.querySelector(".managersbtn").addEventListener("click", defaultText);
document.querySelector(".dashboardbtn").addEventListener("click", defaultText);

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
