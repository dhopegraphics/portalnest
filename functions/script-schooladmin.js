"use strict";

// Navigation and Section Content
const buttons = document.querySelectorAll(".btn__navigate");
const contents = document.querySelectorAll(".content__area");

// Managers
const overLay = document.querySelector(".overlay");
const formDisplay = document.querySelector(".manager_form_container");
const closeBtn = document.querySelector(".close_form");

const createLecturerBtn = document.querySelector("#createlecturer");
const createManagerBtn = document.querySelector("#createmanager");
const createOfficerBtn = document.querySelector("#createofficer");
const createExaminerBtn = document.querySelector("#createexaminer");

// Default selection
const dashboardBtn = document.querySelector(".dashboardbtn");
const dashboardContent = document.querySelector("#dashboard");

dashboardBtn.classList.add("active");
dashboardContent.classList.add("active");

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
  document.querySelector(".card_mid_content").classList.toggle("margin");
  document.querySelector(".first_ctext").classList.toggle("margin");
  document.querySelector(".card_scroll").classList.toggle("scroll");
});

// Managers logic
function displayForm() {
  overLay.classList.add("hidden_remove");
  formDisplay.classList.add("hidden_remove");
}

createLecturerBtn.addEventListener("click", displayForm);

createManagerBtn.addEventListener("click", displayForm);

createOfficerBtn.addEventListener("click", displayForm);

createExaminerBtn.addEventListener("click", displayForm);

closeBtn.addEventListener("click", () => {
  overLay.classList.remove("hidden_remove");
  formDisplay.classList.remove("hidden_remove");
});

// Grading chats
/*
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
*/
