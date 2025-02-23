const services = [
  {
    id: 1,
    name: "Custom Admission Portal",
    info: "Efficiently manage student applications by tracking their progress, enabling seamless communication between applicants and administrators. This ensures a transparent, structured, and hassle-free admission process, reducing errors and delays while enhancing user experience.",
  },
  {
    id: 2,
    name: "Student Application Management",
    info: "Simplify the admission workflow by reviewing applications, approving candidates, and managing document submissions from a single, centralized platform. This minimizes administrative burden, speeds up decision-making, and ensures a smooth, organized process for all stakeholders.",
  },
  {
    id: 3,
    name: "Secure student Data & Document Storege",
    info: "Implement advanced encryption techniques to protect sensitive student data while allowing authorized users to securely access relevant information when needed. This ensures a balance between strong data security and user-friendly accessibility.",
  },
  {
    id: 4,
    name: "Automated Communication and notification",
    info: "Keep applicants updated with real-time notifications on their application status, upcoming deadlines, and important announcements. This helps them stay informed, reduces manual inquiries, and enhances their overall experience throughout the admission process.",
  },
  {
    id: 5,
    name: "Real Time analytics and Reporting",
    info: "Leverage real-time reports to analyze application trends, track key performance metrics, and optimize decision-making. These insights enable institutions to improve admission strategies, enhance efficiency, and identify areas for process improvement.",
  },
  {
    id: 6,
    name: "Multi-User Role Access",
    info: "Maintain strict data security by enforcing role-based access control, ensuring that only authorized personnel can view, edit, or manage specific student records and application details. This prevents unauthorized access and safeguards institutional data integrity.",
  },
];

const button = document.querySelector(".call-to-action");
const info = document.querySelector(".info");
const title = document.querySelector(".title");
const radioButtons = document.querySelectorAll('input[type="radio"]');
const gridItem = document.querySelectorAll(".grid-item");
const text = document.querySelector(".text");

radioButtons.forEach((radio) => {
  radio.addEventListener("change", () => {
    // Remove 'selected' class from all labels
    gridItem.forEach((item) => item.classList.remove("selected"));
    text.classList.add("fade-out");

    // Find the associated label and add the 'selected' class
    const selectedLabel = document.querySelector(`label[for="${radio.id}"]`);
    const parentElement = selectedLabel.parentElement;
    if (selectedLabel) {
      parentElement.classList.add("selected");

      setTimeout(() => {
        text.classList.remove("fade-out");
      }, 300);
      info.innerHTML = services[parentElement.id - 1].info;
      title.innerHTML = services[parentElement.id - 1].name;
    }
  });
});
