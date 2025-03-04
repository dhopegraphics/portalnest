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
