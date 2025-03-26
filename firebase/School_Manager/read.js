import { db } from "../firebaseconfig.js";
import { collection, getDocs, doc, deleteDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

async function fetchAndRenderManagers() {
    try {
        const querySnapshot = await getDocs(collection(db, "school_managers"));
        const managers = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            managers.push({
                manager_id: doc.id, // ✅ Store document ID
                first_name: data.first_name || "N/A",
                last_name: data.last_name || "N/A",
                email: data.personal_mail || "N/A",
                phone: data.personal_number || "N/A",
                salary: data.Salary || "N/A",
                department: data.department_id || "Unknown Dept",
                manager_type: data.manager_type || "Unknown",
                position: data.position || "1",
                year_selected: data.year_selected || [],
                course_selected: data.course_selected || []
            });
        });

        renderManagers(managers);
    } catch (error) {
        console.error("❌ Error fetching managers:", error);
    }
}

function renderManagers(managers) {
    const container = document.querySelector(".initial_content_container");
    
    container.innerHTML = "";

    if (managers.length === 0) {
        container.innerHTML = `<h1 class="no_manager" >No managers found.</h1>`;
        return;
    }

    let lecturerRendered = false;
    let managerRendered = false;

    managers.forEach(manager => {
        const { manager_id, first_name, last_name, email, phone, salary, department, manager_type, position, year_selected, course_selected } = manager;

        if (manager_type === "Lecturer" || manager_type === "Teacher" || manager_type === "2") {
            if (!lecturerRendered) {
                container.innerHTML += `
                    <div class="manager_content_container">
                        <h1>Lecturer/Teacher :</h1>
                        <div class="initial_title flex">
                            <h2>Name</h2>
                            <h2>Department</h2>
                            <h2>Course</h2>
                            <h2>Year</h2>
                            <h2>Salary($)</h2>
                        </div>
                    </div>
                `;
                lecturerRendered = true;
            }

            container.innerHTML += `
                <div class="initial_content grid" data-id="${manager_id}">
                    <div class="person_details flex">
                        <div class="person_img"></div>
                        <h4>${first_name} ${last_name}</h4>
                    </div>
                    <div class="program_title flex">
                        <h4>${department}</h4>
                    </div>
                    <div class="course_title flex">
                        <h4>${course_selected.length > 0 ? course_selected.join(", ") : "N/A"}</h4>
                    </div>
                    <div class="program_level flex">
                        <h4>${year_selected.length > 0 ? year_selected.join(", ") : "N/A"}</h4>
                    </div>
                    <div class="manager_salary flex">
                        <h4>${salary !== "N/A" ? salary.toLocaleString() : "N/A"}</h4>
                        <div class="salary_btn_container flex">
                            <button class="flex"><span>+</span> Add Roles</button>
                            <button  class="edit-btn flex" data-id="${manager_id}"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="delete-btn flex" data-id="${manager_id}">&times;</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            if (!managerRendered) {
                container.innerHTML += `<div class="manager_content_container"><h1>School Manager/Staff:</h1></div>`;
                managerRendered = true;
            }
        }
    });

    // ✅ Attach event listeners after rendering
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", (e) => deleteManager(e.target.dataset.id));
    });
    
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", async (e) => {
            const buttonElement = e.currentTarget; // Ensure we reference the button
            const iconElement = buttonElement.querySelector("i"); // Get the icon inside the button
    
            if (!iconElement) return; // Ensure the button contains an icon
    
            // Store the original icon class
            const originalIconClass = iconElement.className;
    
            // Change to loading spinner
            iconElement.className = "fa fa-spinner fa-spin";
            buttonElement.disabled = true;
    
            // Load the edit form
            await loadEditForm(buttonElement.dataset.id);
    
            // Restore the original icon
            iconElement.className = originalIconClass;
            buttonElement.disabled = false;
        });
    });
    
}


// 🛑 DELETE MANAGER FUNCTION
async function deleteManager(manager_id) {
    if (!confirm("Are you sure you want to delete this manager?")) return;

    try {
        await deleteDoc(doc(db, "school_managers", manager_id));
        alert("✅ Manager deleted successfully!");
        fetchAndRenderManagers();
    } catch (error) {
        console.error("❌ Error deleting manager:", error);
    }
}




// ✏️ LOAD EDIT FORM FUNCTION
async function loadEditForm(manager_id) {
    try {
        const docRef = doc(db, "school_managers", manager_id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            document.getElementById("editfirstname").value = data.first_name || "";
            document.getElementById("editlastname").value = data.last_name || "";
            document.getElementById("editpersonmail").value = data.personal_mail || "";
            document.getElementById("editnumber").value = data.personal_number || "";
            document.getElementById("editSalary").value = data.Salary ? parseInt(data.Salary, 10) : "";
            document.getElementById("editposition").value = data.manager_type || "1";
            document.getElementById("editdepartment").value = data.department_id || "1";

            displayFormToEdit();
            document.getElementById("managerFormEdit").setAttribute("data-edit-id", manager_id);
        } else {
            alert("Manager not found.");
        }
    } catch (error) {
        console.error("❌ Error fetching manager data:", error);
    }
}

// Function to display the form
function displayFormToEdit() {
    const formDisplay = document.querySelector(".manager_form_edit_container");
   
    if (formDisplay) {
      formDisplay.style.display = "block";
      setTimeout(() => {
        formDisplay.style.width = "55%";
        formDisplay.style.overflow = "visible";
        formDisplay.style.opacity = "1"; // Ensure visibility
      }, 10);
    }
  }

  const closeForm = document.getElementById("close_form_edit");
  
  // Function to close the form
  function closeFormEdit() {
    const formDisplay = document.querySelector(".manager_form_edit_container");

    if (formDisplay) {
      formDisplay.style.width = "0%";
      formDisplay.style.opacity = "0"; // Smooth fade out
      setTimeout(() => {
        formDisplay.style.display = "none";
      }, 300);
    }
  }

    closeForm.addEventListener("click", closeFormEdit);

document.getElementById("submit_edit").addEventListener("click", async function () {
    const managerFormEdit = document.getElementById("managerFormEdit");
    const submitButton = document.getElementById("submit_edit");
    const manager_id = managerFormEdit.getAttribute("data-edit-id");
    
    if (!manager_id) return alert("No manager selected for editing.");
    
    submitButton.textContent = "Updating...";
    submitButton.disabled = true;

    try {
        const updatedData = {
            first_name: document.getElementById("editfirstname").value,
            last_name: document.getElementById("editlastname").value,
            email: document.getElementById("editpersonmail").value,
            phone: document.getElementById("editnumber").value,
            salary: Number(document.getElementById("editSalary").value) || 0,
            position: document.getElementById("editposition").value,
            department_id: document.getElementById("editdepartment").value
        };

        await updateDoc(doc(db, "school_managers", manager_id), updatedData);

        alert("✅ Manager updated successfully!");
        closeFormEdit();
        fetchAndRenderManagers();
    } catch (error) {
        console.error("❌ Error updating manager:", error);
    } finally {
        submitButton.textContent = "Submit";
        submitButton.disabled = false;
    }
});


// ✅ Fetch and Render Managers on Load
document.addEventListener("DOMContentLoaded", fetchAndRenderManagers);
