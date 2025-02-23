document.addEventListener("DOMContentLoaded", function () {
  const roleCards = document.querySelectorAll(".role-card");
  const nextButton = document.querySelector(".next-button");
  const roleDescription = document.getElementById("role-description");
  const backButton = document.querySelector(".back-button");

  // Role descriptions
  const descriptions = {
    "school-manager":
      "Manage Admissions Efficiently With A Comprehensive Dashboard, Oversee Applications, Communicate With Applicants, And Generate Insightful Reports.",
    "gain-admission":
      "Apply for admission, track your application status, and communicate directly with school administrators throughout the process.",
    student:
      "Access your student portal, view course materials, submit assignments, and track your academic progress.",
  };

  // Handle role selection
  roleCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Remove selected class from all cards
      roleCards.forEach((c) => c.classList.remove("selected"));

      // Add selected class to clicked card
      this.classList.add("selected");

      // Enable next button
      nextButton.disabled = false;

      // Update description
      const role = this.dataset.role;
      roleDescription.textContent = descriptions[role];
    });
  });

  // Handle back button
  backButton.addEventListener("click", function () {
    window.history.back();
  });

  // Handle next button
  nextButton.addEventListener("click", function () {
    const selectedRole = document.querySelector(".role-card.selected");
    if (selectedRole) {
      const role = selectedRole.dataset.role;
      // Here you can add navigation logic
      alert(`Navigating to ${role} dashboard...`);
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.container').style.opacity = '1';
});