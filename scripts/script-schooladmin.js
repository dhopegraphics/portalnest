"use strict";

// Function for loading the content from other html files
function loadPage(page) {
  fetch(page)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("content-area").innerHTML = data;
    })
    .catch((error) => console.error("Error loading the page:", error));
}
