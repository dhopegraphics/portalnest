// Limit of displayed items
const MAX_DISPLAY = 8;

// Function to render permissions
function renderPermissions(permissions, filter = "") {
    const selectionContainer = document.querySelector('.inner-permission_selection');
    if (!selectionContainer) return;
    
    selectionContainer.innerHTML = ""; // Clear previous content
    
    const filteredPermissions = permissions.filter(permission =>
        permission.name.toLowerCase().includes(filter.toLowerCase())
    );
    
    filteredPermissions.slice(0, MAX_DISPLAY).forEach(permission => {
        const flexDiv = document.createElement('div');
        flexDiv.className = 'flex';
        
        const permissionP = document.createElement('p');
        permissionP.className = 'permission-option';
        permissionP.setAttribute('role', 'button');
        permissionP.setAttribute('data-value', permission.name);
        permissionP.innerHTML = `${permission.name} <span>+</span>`;
        
        flexDiv.appendChild(permissionP);
        selectionContainer.appendChild(flexDiv);
    });
    
    setTimeout(() => handleMultiSelect(".inner-permission_selection", "permission-option"), 0);
}

// Function to render courses
function renderCourses(courses, filter = "") {
    const courseContainer = document.querySelector('.selection.course__selection');
    if (!courseContainer) return;
    
    courseContainer.innerHTML = ""; // Clear previous content
    
    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(filter.toLowerCase()) ||
        (course.code && course.code.toLowerCase().includes(filter.toLowerCase()))
    );
    
    let flexDiv = null;
    filteredCourses.slice(0, MAX_DISPLAY).forEach((course, index) => {
        if (index % 3 === 0) {
            flexDiv = document.createElement('div');
            flexDiv.className = 'flex';
            courseContainer.appendChild(flexDiv);
        }
        
        const courseP = document.createElement('p');
        courseP.className = 'course-option';
        courseP.setAttribute('role', 'button');
        courseP.setAttribute('data-value', course.name);
        courseP.innerHTML = `${course.code} ${course.name} <span>+</span>`;
        
        flexDiv.appendChild(courseP);
    });
    
    setTimeout(() => handleMultiSelect(".selection.course__selection", "course-option"), 0);
}

// Fetch and render permissions
let allPermissions = [];
fetch('/data/permissions.json')
    .then(response => response.json())
    .then(permissions => {
        allPermissions = permissions;
        renderPermissions(permissions);
    })
    .catch(error => console.error('Error loading permissions:', error));

// Fetch and render courses
let allCourses = [];
fetch('/data/courses.json')
    .then(response => response.json())
    .then(courses => {
        allCourses = courses;
        renderCourses(courses);
    })
    .catch(error => console.error('Error loading courses:', error));

// Search functionality for permissions
document.getElementById('search_permission')?.addEventListener('input', (e) => {
    renderPermissions(allPermissions, e.target.value);
});

// Search functionality for courses
document.getElementById('search_courses')?.addEventListener('input', (e) => {
    renderCourses(allCourses, e.target.value);
});

// Multi-select function with debugging
function handleMultiSelect(containerSelector, itemClass) {
    document.addEventListener("DOMContentLoaded", () => {
        const container = document.querySelector(containerSelector);
        if (container) {
            console.log(`Multi-select applied to: ${containerSelector}`);
            container.addEventListener("click", (event) => {
                const target = event.target.closest(`.${itemClass}`);
                if (target) {
                    target.classList.toggle("active"); // Toggle active class
                }
            });
        } else {
            console.warn(`Container not found: ${containerSelector}`);
        }
    });
}

// Ensure multi-select works for all sections
handleMultiSelect(".inner-permission_selection", "permission-option");
handleMultiSelect(".selection.course__selection", "course-option");
handleMultiSelect(".year_selection", "year-option");

// Optional: CSS for active state
const style = document.createElement("style");
style.innerHTML = `
  .active {
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    padding: 5px;
  }
`;
document.head.appendChild(style);
