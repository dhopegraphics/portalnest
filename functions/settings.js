// Declare lucide, initSidebar, and initTheme
const lucide = window.lucide; // Assuming lucide is available globally
const initSidebar = window.initSidebar; // Assuming initSidebar is available globally
const initTheme = window.initTheme; // Assuming initTheme is available globally

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  
  // Initialize sidebar functionality from main script
  if (typeof initSidebar === 'function') {
    initSidebar();
  } else {
    // Fallback if main script hasn't loaded
    initSidebarFallback();
  }
  
  // Initialize theme functionality from main script
  if (typeof initTheme === 'function') {
    initTheme();
  } else {
    // Fallback if main script hasn't loaded
    initThemeFallback();
  }
  
  // Initialize settings tabs
  initSettingsTabs();
  
  // Initialize profile image upload
  initProfileImageUpload();
  
  // Initialize user management
  initUserManagement();
});

/**
 * Fallback function to initialize sidebar
 */
function initSidebarFallback() {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  
  // Toggle sidebar on mobile
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.add('open');
      sidebarOverlay.classList.add('visible');
    });
  }
  
  // Close sidebar with close button
  if (sidebarClose) {
    sidebarClose.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('visible');
    });
  }
  
  // Close sidebar when clicking the overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('visible');
    });
  }
}

/**
 * Fallback function to initialize theme
 */
function initThemeFallback() {
  const themeToggle = document.getElementById('themeToggle');
  const themeSelect = document.getElementById('themeSelect');
  
  // Function to set theme
  const setTheme = (dark) => {
    if (dark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      if (themeSelect) themeSelect.value = 'dark';
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      if (themeSelect) themeSelect.value = 'light';
    }
  };
  
  // Initialize theme based on local storage or system preference
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    setTheme(storedTheme === 'dark');
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme(true);
    if (themeSelect) themeSelect.value = 'system';
  } else {
    setTheme(false);
    if (themeSelect) themeSelect.value = 'system';
  }
  
  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      setTheme(!isDark);
    });
  }
  
  // Handle theme select dropdown
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const selectedTheme = e.target.value;
      
      if (selectedTheme === 'dark') {
        setTheme(true);
      } else if (selectedTheme === 'light') {
        setTheme(false);
      } else if (selectedTheme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark);
        localStorage.removeItem('theme');
      }
    });
  }
}

/**
 * Initialize settings tabs functionality
 */
function initSettingsTabs() {
  const tabs = document.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and panels
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      
      panels.forEach(p => {
        p.classList.remove('active');
      });
      
      // Add active class to clicked tab and its panel
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      const panelId = tab.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.classList.add('active');
      }
    });
    
    // Handle keyboard navigation
    tab.addEventListener('keydown', (e) => {
      // Get the index of the current tab
      const index = Array.from(tabs).indexOf(tab);
      
      // Handle arrow keys
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        
        let newIndex;
        if (e.key === 'ArrowRight') {
          newIndex = (index + 1) % tabs.length;
        } else {
          newIndex = (index - 1 + tabs.length) % tabs.length;
        }
        
        tabs[newIndex].focus();
        tabs[newIndex].click();
      }
    });
  });
}

/**
 * Initialize profile image upload functionality
 */
function initProfileImageUpload() {
  const imageUpload = document.getElementById('imageUpload');
  const profileImage = document.getElementById('profileImage');
  const removeImage = document.getElementById('removeImage');
  
  if (!imageUpload || !profileImage || !removeImage) return;
  
  imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Clear the profile image container
        profileImage.innerHTML = '';
        
        // Create the image element
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Profile Picture';
        profileImage.appendChild(img);
        
        // Enable the remove button
        removeImage.disabled = false;
      };
      reader.readAsDataURL(file);
    }
  });
  
  removeImage.addEventListener('click', () => {
    // Reset the profile image
    profileImage.innerHTML = '<i data-lucide="user"></i>';
    // Re-initialize Lucide for the new icon
    lucide.createIcons({
      scope: profileImage
    });
    
    // Clear the file input
    imageUpload.value = '';
    
    // Disable the remove button
    removeImage.disabled = true;
  });
}

/**
 * Initialize user management functionality
 */
function initUserManagement() {
  const userSearch = document.getElementById('userSearch');
  const userTableBody = document.getElementById('userTableBody');
  const emptyUserMessage = document.getElementById('emptyUserMessage');
  
  if (!userSearch || !userTableBody || !emptyUserMessage) return;
  
  // Sample user data
  const users = [
    { id: 1, name: "John Doe", role: "Teacher", status: "Active", lastLogin: "2023-03-22 09:15" },
    { id: 2, name: "Jane Smith", role: "Admin", status: "Active", lastLogin: "2023-03-23 10:30" },
    { id: 3, name: "Robert Johnson", role: "Teacher", status: "Inactive", lastLogin: "2023-03-15 14:45" },
    { id: 4, name: "Emily Davis", role: "Student", status: "Active", lastLogin: "2023-03-23 08:20" },
    { id: 5, name: "Michael Wilson", role: "Teacher", status: "Active", lastLogin: "2023-03-22 16:10" }
  ];
  
  /**
   * Render users in the table
   * @param {Array} usersToRender - The users to display in the table
   */
  function renderUsers(usersToRender) {
    // Clear the table body
    userTableBody.innerHTML = '';
    
    if (usersToRender.length === 0) {
      // Show the empty message if there are no users
      emptyUserMessage.style.display = 'block';
      return;
    }
    
    // Hide the empty message if there are users
    emptyUserMessage.style.display = 'none';
    
    // Render each user
    usersToRender.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.role}</td>
        <td>
          <span class="status-badge ${user.status === 'Active' ? 'status-active' : 'status-inactive'}">
            ${user.status}
          </span>
        </td>
        <td>${user.lastLogin}</td>
        <td>
          <div class="table-actions">
            <button class="icon-button" title="Edit User">
              <i data-lucide="edit-2"></i>
            </button>
            <button class="icon-button" title="Reset Password">
              <i data-lucide="key"></i>
            </button>
            <button class="icon-button" title="Delete User">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      `;
      
      // Add the row to the table
      userTableBody.appendChild(row);
    });
    
    // Initialize Lucide icons for the new buttons
    lucide.createIcons({
      scope: userTableBody
    });
  }
  
  // Initialize the table with all users
  renderUsers(users);
  
  // Filter users when the search input changes
  userSearch.addEventListener('input', () => {
    const searchTerm = userSearch.value.toLowerCase().trim();
    
    if (searchTerm === '') {
      // If the search is empty, show all users
      renderUsers(users);
      return;
    }
    
    // Filter users by name, role, or status
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm) ||
      user.status.toLowerCase().includes(searchTerm)
    );
    
    // Render the filtered users
    renderUsers(filteredUsers);
  });
}