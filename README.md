# PORTAL-NEST
PortalNest is a comprehensive school management system designed to simplify and centralize the management of institutions. It empowers school owners, administrators, and staff to manage students, courses, admissions, grading, and more in an efficient and customizable way.

## 🌐 Key Features

### School Owner Dashboard
- **Manage Staff & Roles**: Create, edit, and assign custom permissions for staff.
- **Admissions Management**: Review, approve, or reject applications with custom criteria.
- **Student Management**: View, edit, and manage student records, withdrawals, and deferrals.
- **Courses & Faculty**: Create and manage courses, faculties, and departments.
- **Grading & Exams**: Define grading policies and manage result approvals/releases.
- **Settings & Reports**: Access school analytics and customize school-wide settings.

### Staff (Managers) Dashboard
- Permissions tailored to their roles, allowing controlled access to:
  - Admissions
  - Student records
  - Grading and exam submissions
  - Courses and department management
- Fully customizable by the School Owner.

### Student Dashboard
- Access personal academic records, results, and course registration.
- Apply for admissions or register for courses.
- View announcements, schedules, and more.

### 🛠️ Technologies Used
- Frontend: HTML5, CSS3, JavaScript (Vanilla JS)
-	Database: Firebase Realtime Database & Firestore
-	Hosting: Firebase Hosting

### 🔑 Authentication & Role-Based Access Control
PortalNest uses Firebase Authentication for user login. Role-based access is implemented using the following approach:
	1.	Institution Code: Links users to their schools.
	2.	Role Management: Roles and permissions are stored in Firestore for scalability.
	3.	Frontend Rendering: Dynamic UI rendering based on the user’s permissions and roles.

### 🌟 Contributions
Contributions are always welcome! Please fork the repository, make changes, and submit a pull request.







