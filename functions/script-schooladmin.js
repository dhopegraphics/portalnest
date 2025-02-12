"use strict";

// DEFAULT DISPLAY AND SELECTION OF PAGES
const buttons = document.querySelectorAll(".btn__navigate");
const contents = document.querySelectorAll(".content");

function loadPage(page) {
  fetch(page)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("content-area").innerHTML = data;
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
