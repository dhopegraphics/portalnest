"use strict";

const buttons = document.querySelectorAll(".btn__navigate");
const contents = document.querySelectorAll(".content");

// DEFAULT DISPLAY AND SELECTION OF PAGES
// let lastloadpages = "";
function loadPage(page) {
  fetch(page)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("content-area").innerHTML = data;
      // lastloadpages = page;
    })
    .catch((error) => console.error("Error loading the page:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  const dashboardBtn = document.querySelector(".dashboardbtn");

  if (dashboardBtn) {
    dashboardBtn.classList.add("active");
    loadPage("dashboard.html");
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
const container = document.querySelector(".main__container");
const contentsMain = document.querySelector(".overall__main");
const menuBtn = document.querySelector(".btn__menu");
const navigationSection = document.querySelector(".navigation");

menuBtn.addEventListener("click", () => {
  navigationSection.classList.toggle("close");
  container.classList.toggle("active");
  contentsMain.classList.toggle("active");
  document.querySelectorAll(".pending__left-content").forEach((width) => {
    width.classList.toggle("width");
  });
  document.querySelector(".see_all").classList.toggle("width");
});

//
// function managerFun() {
//   return (lastloadpages = "managers.html");
// }

// document.querySelector(".managersbtn").addEventListener("click", () => {
//   if (managerFun())
//     document.querySelector(".people_icon").innerHTML =
//       '<i class="bi bi-people col_green"></i>';
// });
