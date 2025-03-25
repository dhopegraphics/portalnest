
document.getElementById("submit").addEventListener("click", function (event) {
  event.preventDefault(); // Prevent page reload

  // Get input values
  let role = document.getElementById("position").value;
  let name = document.getElementById("firstname").value;
  let department = document.getElementById("department").value;
  let course = document.querySelector(".course-option").value;
  let year = document.querySelector(".year-option").value;
  let salary = document.getElementById("salary").value;

  if (!role || !name || !department || !course  ) {
    alert("Please fill all fields.");
    return;
  }

  let container = document.querySelector(".manager_content_container");
  let roleSection = document.getElementById(role.replace(/\s+/g, "_")); // ID without spaces

  // Create section if it doesn't exist
  if (!roleSection) {
    roleSection = document.createElement("div");
    roleSection.id = role.replace(/\s+/g, "_");
    roleSection.innerHTML = `
      <h1>${role}:</h1>
      <div class="initial_title flex">
        <h2>Name</h2>
        <h2>Department</h2>
        <h2>Course</h2>
        <h2>Year</h2>
        <h2>Salary($)</h2>
      </div>
      <div class="manager_list"></div>
    `;
    container.appendChild(roleSection);
  }

  // Append staff data
  let managerList = roleSection.querySelector(".manager_list");
  let newEntry = `
    <div class="initial_content grid">
      <div class="person_details flex">
        <div class="person_img"></div>
        <h4>${name}</h4>
      </div>

      <div class="program_title flex">
        <h4>${department}</h4>
      </div>

      <div class="course_title flex">
        <h4>${course}</h4>
      </div>

      <div class="program_level flex">
        <h4>${year}</h4>
      </div>

      <div class="manager_salary flex">
        <h4>${salary}</h4>

        <div class="salary_btn_container flex">
          <button class="flex"><span>+</span> Add Roles</button>
          <button class="flex"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="flex" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
        </div>
      </div>
    </div>
  `;
  
  managerList.innerHTML += newEntry;
  
  // Clear form
  document.getElementById("staffForm").reset();
});
