let jsonData = {}; // Store JSON data globally

// Fetch JSON data when the page loads
fetch("/data/dashboard_data.json")
  .then(response => response.json())
  .then(data => {
    jsonData = data;
  })
  .catch(error => console.error("Error loading JSON data:", error));

// Function to expand/collapse the card
function expandCard(button, category) {
  const card = button.closest(".card");
  const isExpanded = card.classList.contains("expanded");

  // Collapse any open card
  document.querySelectorAll(".card.expanded").forEach(expandedCard => {
    expandedCard.classList.remove("expanded");
    expandedCard.querySelector(".card-details")?.remove();
    resetButton(expandedCard);
  });

  // Hide overlay if clicking the same card again
  if (isExpanded) {
    document.querySelector(".overlay").classList.remove("show");
    return;
  }

  // Show overlay
  document.querySelector(".overlay").classList.add("show");

  // Expand card
  card.classList.add("expanded");

  // Create and insert details container
  const detailsDiv = document.createElement("div");
  detailsDiv.className = "card-details";

  if (jsonData[category]) {
    detailsDiv.innerHTML = `<h3>Details</h3><ul>${
      jsonData[category].map(item => `<li>${Object.values(item).join(" - ")}</li>`).join("")
    }</ul><span class="card-close">&times;</span>`;
  } else {
    detailsDiv.innerHTML = `<h3>Details</h3><p>No data available.</p><span class="card-close">&times;</span>`;
  }

  card.appendChild(detailsDiv);

  // Update button text and rotate icon
  button.querySelector("p").textContent = "See Less Details";
  button.querySelector("i").style.transform = "rotate(60deg)";

  // Close button inside the card
  detailsDiv.querySelector(".card-close").addEventListener("click", () => collapseCard(card));
}

// Function to collapse a card
function collapseCard(card) {
  card.classList.remove("expanded");
  card.querySelector(".card-details")?.remove();
  document.querySelector(".overlay").classList.remove("show");
  resetButton(card);
}

// Function to reset button text and arrow
function resetButton(card) {
  const button = card.querySelector(".card__footer");
  button.querySelector("p").textContent = "See Details";
  button.querySelector("i").style.transform = "rotate(0deg)";
}

// Add event listeners for each button
document.getElementById("reports_details").addEventListener("click", function () {
  expandCard(this, "reports");
});

document.getElementById("unresolved_reports_details").addEventListener("click", function () {
  expandCard(this, "unresolved_reports");
});

document.getElementById("resolved_reports_details").addEventListener("click", function () {
  expandCard(this, "resolved_reports");
});
document.getElementById("portal_nest_reports_details").addEventListener("click", function () {
  expandCard(this, "portal_nest_reports");
});

// Overlay close event
document.querySelector(".overlay").addEventListener("click", () => {
  document.querySelectorAll(".card.expanded").forEach(collapseCard);
});