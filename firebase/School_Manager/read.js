import { db } from "../firebaseconfig";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

/**
 * Listens for real-time updates from the school_managers collection.
 */
function listenForSchoolManagers() {
    const managersCollection = collection(db, "school_managers");

    // ✅ Firestore real-time listener
    onSnapshot(managersCollection, (snapshot) => {
        const managers = [];

        snapshot.forEach((doc) => {
            managers.push({ id: doc.id, ...doc.data() });
        });

        console.log("🔄 Real-time update received:", managers);
        renderManagersTable(managers); // Render updated data
    });
}


/**
 * Renders managers in the HTML table.
 * @param {Array} managers - List of managers.
 */
function renderManagersTable(managers) {
    const tableBody = document.getElementById("managers-table-body");
    tableBody.innerHTML = ""; // Clear existing table data

    if (managers.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7">⚠️ No managers found.</td></tr>`;
        return;
    }

    managers.forEach((manager) => {
        const row = `
            <tr>
                <td>${manager.manager_id}</td>
                <td>${manager.first_name} ${manager.last_name}</td>
                <td>${manager.manager_type}</td>
                <td>${manager.institution_code}</td>
                <td>${manager.department_id || "N/A"}</td>
                <td>${manager.manager_active ? "✅ Active" : "❌ Inactive"}</td>
                <td>
                    <button onclick="editManager('${manager.manager_id}')">✏️ Edit</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// ✅ Start real-time listening when the page loads
listenForSchoolManagers();

{/* <table border="1">
    <thead>
        <tr>
            <th>Manager ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Institution Code</th>
            <th>Department ID</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody id="managers-table-body">
        <tr><td colspan="6">⏳ Loading...</td></tr>
    </tbody>
</table> */}