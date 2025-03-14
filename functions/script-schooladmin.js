"use strict";

const buttons = document.querySelectorAll(".btn__navigate");
const contents = document.querySelectorAll(".content");

// DEFAULT DISPLAY AND SELECTION OF PAGES
function contentHolder() {
  function loadPage(page) {
    fetch(page)
      .then((response) => response.text())
      .then((data) => {
        const contentArea = document.getElementById("content-area");
        contentArea.innerHTML = data;
        executeScripts(contentArea);
      })
      .catch((error) => console.error("Error loading the page:", error));
  }

  // Function to execute <script> tags manually
  function executeScripts(container) {
    const scripts = container.querySelectorAll("script");

    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");

      // Copy attributes like 'type', 'src', and 'async'
      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.async = false; // Ensure correct execution order
      } else {
        newScript.textContent = oldScript.textContent;
      }

      // Copy other attributes (like type or id if needed)
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });

      // Append to the body to ensure execution
      document.body.appendChild(newScript);

      // Optional: Remove the original script to avoid duplication
      oldScript.remove();
    });
  }

  return function (param1) {
    loadPage(param1);
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
  document.querySelector(".card_mid_content").classList.toggle("margin");
  document.querySelector(".first_ctext").classList.toggle("margin");
  document.querySelector(".card_scroll").classList.toggle("scroll");
});
