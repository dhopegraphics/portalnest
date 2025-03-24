let pendingApplicants = [];

// Fetch pending applicants from JSON
fetch("/data/pending_applicants.json")
  .then(response => response.json())
  .then(data => {
    pendingApplicants = data.pending_applicants;
    renderPendingApplicants(pendingApplicants.slice(0, 4)); // Show only 4 initially
  })
  .catch(error => console.error("Error fetching data:", error));

// Function to render pending applicants
function renderPendingApplicants(applicants) {
  const container = document.querySelector(".dashboardnext__card-container");
  container.innerHTML = ""; // Clear existing content

  applicants.forEach((applicant, index) => {
    const card = document.createElement("div");
    card.className = "pending__card grid";
    card.innerHTML = `
      <div class="pending__left-content grid">
        <img src="${applicant.image}" alt="image of ${applicant.name}" />

        <div class="personinfo__container">
          <div class="program flex">
            <p>${applicant.program}</p>
            <div class="level ">
              <span><i class="fa-solid fa-circle"></i></span>
              <p>${applicant.level}</p>
            </div>
          </div>

          <h2>${applicant.name}</h2>
          <div class="approval flex">
            <div class="date flex">
              <span><i class="bi bi-calendar4-week"></i></span>
              <p>${applicant.date}</p>
            </div>

            <div class="flex">
              <span><i class="bi bi-clock"></i></span>
              <p>${applicant.time}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="pending__right-content">
        <button class="btn approval_btn" onclick="approveApplicant(${index})">Approve</button>
        <button class="btn decline_btn" onclick="declineApplicant(${index})">Decline</button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Approve applicant (remove card)
function approveApplicant(index) {
  pendingApplicants.splice(index, 1); // Remove from array
  renderPendingApplicants(pendingApplicants.slice(0, 4)); // Re-render
}

// Decline applicant (remove card)
function declineApplicant(index) {
  pendingApplicants.splice(index, 1); // Remove from array
  renderPendingApplicants(pendingApplicants.slice(0, 4)); // Re-render
}

// See all applicants
document.querySelector(".see_all").addEventListener("click", function () {
  window.location.href = "/pages/Miscellaneous/all-applicants-page.html"; // Redirect to another page
});