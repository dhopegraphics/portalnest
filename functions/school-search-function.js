// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const mobileFilterBtn = document.getElementById('mobile-filter-btn');
const filtersSidebar = document.getElementById('filters-sidebar');
const filterOverlay = document.getElementById('filter-overlay');
const closeModal = document.getElementById('close-modal');
const schoolModal = document.getElementById('school-modal');
const resultsGrid = document.getElementById('results-grid');
const resultsCount = document.getElementById('results-count');
const noResults = document.getElementById('no-results');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const resetFilters = document.getElementById('reset-filters');
const filterGroups = document.querySelectorAll('.filter-group-header');
const tabButtons = document.querySelectorAll('.tab-button');
const ratingStars = document.querySelectorAll('#rating-stars i');
const reviewText = document.getElementById('review-text');
const submitReview = document.getElementById('submit-review');
const reviewsList = document.getElementById('reviews-list');
const noReviews = document.getElementById('no-reviews');

// State
let schools = [];
let filteredSchools = [];
let selectedSchool = null;
let currentRating = 0;
let darkMode = localStorage.getItem('darkMode') === 'true';

// Apply dark mode if saved
if (darkMode) {
  document.body.classList.add('dark-theme');
}

// Fetch schools data
async function fetchSchools() {
  try {
    const response = await fetch("/data/schools.json"); // Adjust path if needed
    const schoolsData = await response.json();

    schools = schoolsData;
    filteredSchools = [...schools];
    renderSchools();
  } catch (error) {
    console.error("Error fetching school data:", error);
  }
}

// Render schools to the grid
function renderSchools() {
  resultsGrid.innerHTML = '';
  resultsCount.textContent = `${filteredSchools.length} ${filteredSchools.length === 1 ? 'School' : 'Schools'} Found`;
  
  if (filteredSchools.length === 0) {
    resultsGrid.style.display = 'none';
    noResults.style.display = 'flex';
  } else {
    resultsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    filteredSchools.forEach(school => {
      const card = createSchoolCard(school);
      resultsGrid.appendChild(card);
    });
  }
}

// Create a school card element
function createSchoolCard(school) {
  const card = document.createElement('div');
  card.className = 'school-card';
  
  let badgeClass = '';
  if (school.admissionStatus === 'Open') {
    badgeClass = 'badge-open';
  } else if (school.admissionStatus === 'Closed') {
    badgeClass = 'badge-closed';
  } else {
    badgeClass = 'badge-upcoming';
  }
  
  card.innerHTML = `
    <div class="card-image">
      <img src="${school.image}" alt="${school.name}">
      <div class="card-badge ${badgeClass}">${school.admissionStatus}</div>
    </div>
    <div class="card-header">
      <div class="card-title-row">
        <h3 class="card-title">${school.name}</h3>
        <div class="card-rating">
          <i class="fas fa-star"></i>
          <span>${school.rating.toFixed(1)}</span>
        </div>
      </div>
      <div class="card-location">
        <i class="fas fa-map-marker-alt"></i>
        <span>${school.location.city}, ${school.location.region}</span>
      </div>
    </div>
    <div class="card-content">
      <div class="card-type">
        <i class="fas fa-graduation-cap"></i>
        <span>${school.type}</span>
      </div>
      <div class="card-programs">
        ${school.programs.slice(0, 3).map(program => 
          `<span class="program-badge">${program}</span>`
        ).join('')}
        ${school.programs.length > 3 ? 
          `<span class="program-badge">+${school.programs.length - 3} more</span>` : 
          ''}
      </div>
      <div class="card-tuition">
        <i class="fas fa-clock"></i>
        <span>Tuition: <span>${school.tuitionRange}</span></span>
      </div>
    </div>
    <div class="card-footer">
      <button class="view-details-btn" data-id="${school.id}">View Details</button>
    </div>
  `;
  
  const viewDetailsBtn = card.querySelector('.view-details-btn');
  viewDetailsBtn.addEventListener('click', () => {
    openSchoolModal(school);
  });
  
  return card;
}

// Open school details modal
function openSchoolModal(school) {
  selectedSchool = school;
  
  // Set modal title and image
  document.getElementById('modal-title').textContent = school.name;
  document.getElementById('modal-image').src = school.image;
  document.getElementById('modal-image').alt = school.name;
  
  // Set badges
  const badgesContainer = document.getElementById('modal-badges');
  badgesContainer.innerHTML = `
    <div class="school-badge badge-primary">${school.type}</div>
    <div class="school-badge badge-outline">${school.accreditation}</div>
    <div class="school-badge ${
      school.admissionStatus === 'Open' ? 'badge-open' : 
      school.admissionStatus === 'Closed' ? 'badge-closed' : 
      'badge-upcoming'
    }">${school.admissionStatus}</div>
  `;
  
  // Set description
  document.getElementById('modal-description').textContent = school.description;
  
  // Set contact information
  const contactContainer = document.getElementById('modal-contact');
  contactContainer.innerHTML = `
    <div class="contact-item">
      <i class="fas fa-map-marker-alt"></i>
      <span>${school.location.city}, ${school.location.region}, ${school.location.country}</span>
    </div>
    <div class="contact-item">
      <i class="fas fa-phone"></i>
      <span>${school.contact.phone}</span>
    </div>
    <div class="contact-item">
      <i class="fas fa-envelope"></i>
      <span>${school.contact.email}</span>
    </div>
    <div class="contact-item">
      <i class="fas fa-globe"></i>
      <a href="${school.contact.website}" target="_blank">${school.contact.website.replace(/^https?:\/\//, '')}</a>
    </div>
  `;
  
  // Set tuition information
  const tuitionContainer = document.getElementById('modal-tuition');
  tuitionContainer.innerHTML = `
    <div class="tuition-range">
      <i class="fas fa-clock"></i>
      <span>Range: <span>${school.tuitionRange}</span></span>
    </div>
    <p class="tuition-details">${school.tuitionDetails}</p>
  `;
  
  // Set facilities
  const facilitiesContainer = document.getElementById('modal-facilities');
  facilitiesContainer.innerHTML = school.facilities.map(facility => `
    <div class="facility-item">
      <i class="fas fa-check-circle"></i>
      <span>${facility}</span>
    </div>
  `).join('');
  
  // Set admission information
  const admissionContainer = document.getElementById('modal-admission');
  admissionContainer.innerHTML = `
    <p>${school.admissionProcess}</p>
    <div class="admission-status">
      <span>Status:</span>
      <div class="school-badge ${
        school.admissionStatus === 'Open' ? 'badge-open' : 
        school.admissionStatus === 'Closed' ? 'badge-closed' : 
        'badge-upcoming'
      }">${school.admissionStatus}</div>
    </div>
  `;
  
  // Set programs
  const programsContainer = document.getElementById('modal-programs');
  programsContainer.innerHTML = school.programDetails.map(program => `
    <div class="program-card">
      <h4>${program.name}</h4>
      <p>${program.description}</p>
      <div class="program-duration">
        <i class="fas fa-clock"></i>
        <span>Duration: ${program.duration}</span>
      </div>
    </div>
  `).join('');
  
  // Set reviews
  const reviews = school.reviews || [];
  const reviewsContainer = document.getElementById('reviews-list');
  const noReviewsElement = document.getElementById('no-reviews');
  
  if (reviews.length > 0) {
    reviewsContainer.innerHTML = reviews.map(review => {
      const date = new Date(review.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      return `
        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="review-user">${review.user}</div>
              <div class="review-stars">
                ${Array(5).fill().map((_, i) => 
                  `<i class="${i < review.rating ? 'fas' : 'far'} fa-star"></i>`
                ).join('')}
              </div>
            </div>
            <div class="review-date">${formattedDate}</div>
          </div>
          <p class="review-text">${review.text}</p>
        </div>
      `;
    }).join('');
    
    reviewsContainer.style.display = 'flex';
    noReviewsElement.style.display = 'none';
  } else {
    reviewsContainer.style.display = 'none';
    noReviewsElement.style.display = 'block';
  }
  
  // Set rating display
  const ratingContainer = document.getElementById('modal-rating');
  ratingContainer.innerHTML = `
    <i class="fas fa-star"></i>
    <span>${school.rating.toFixed(1)}</span>
    <span class="rating-count">(${reviews.length} reviews)</span>
  `;
  
  // Reset review form
  resetReviewForm();
  
  // Show the first tab
  document.querySelector('.tab-button[data-tab="overview"]').click();
  
  // Show modal
  schoolModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Reset review form
function resetReviewForm() {
  currentRating = 0;
  reviewText.value = '';
  submitReview.disabled = true;
  
  ratingStars.forEach(star => {
    star.classList.remove('fas');
    star.classList.add('far');
  });
}

// Apply filters to schools
function applyFilters() {
  const searchQuery = searchInput.value.toLowerCase().trim();
  
  // Get selected school types
  const selectedSchoolTypes = Array.from(document.querySelectorAll('input[name="school-type"]:checked'))
    .map(checkbox => checkbox.value);
  
  // Get location filters
  const country = document.getElementById('country').value;
  const region = document.getElementById('region').value;
  const city = document.getElementById('city').value;
  
  // Get selected programs
  const selectedPrograms = Array.from(document.querySelectorAll('input[name="programs"]:checked'))
    .map(checkbox => checkbox.value);
  
  // Get selected admission statuses
  const selectedAdmissionStatuses = Array.from(document.querySelectorAll('input[name="admission-status"]:checked'))
    .map(checkbox => checkbox.value);
  
  // Get tuition range
  const tuitionRange = document.querySelector('input[name="tuition-range"]:checked').value;
  
  // Get accreditation status
  const accreditation = document.querySelector('input[name="accreditation"]:checked').value;
  
  // Get selected facilities
  const selectedFacilities = Array.from(document.querySelectorAll('input[name="facilities"]:checked'))
    .map(checkbox => checkbox.value);
  
  // Filter schools
  filteredSchools = schools.filter(school => {
    // Search query filter
    if (searchQuery && !(
      school.name.toLowerCase().includes(searchQuery) ||
      school.location.city.toLowerCase().includes(searchQuery) ||
      school.location.region.toLowerCase().includes(searchQuery) ||
      school.location.country.toLowerCase().includes(searchQuery)
    )) {
      return false;
    }
    
    // School type filter
    if (selectedSchoolTypes.length > 0 && !selectedSchoolTypes.includes(school.type)) {
      return false;
    }
    
    // Location filters
    if (country && country !== '' && school.location.country !== country) {
      return false;
    }
    
    if (region && region !== '' && school.location.region !== region) {
      return false;
    }
    
    if (city && city !== '' && school.location.city !== city) {
      return false;
    }
    
    // Programs filter
    if (selectedPrograms.length > 0 && !selectedPrograms.some(program => school.programs.includes(program))) {
      return false;
    }
    
    // Admission status filter
    if (selectedAdmissionStatuses.length > 0 && !selectedAdmissionStatuses.includes(school.admissionStatus)) {
      return false;
    }
    
    // Tuition range filter
    if (tuitionRange && tuitionRange !== '' && school.tuitionRange !== tuitionRange) {
      return false;
    }
    
    // Accreditation filter
    if (accreditation && accreditation !== '' && school.accreditation !== accreditation) {
      return false;
    }
    
    // Facilities filter
    if (selectedFacilities.length > 0 && !selectedFacilities.every(facility => school.facilities.includes(facility))) {
      return false;
    }
    
    return true;
  });
  
  renderSchools();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Fetch schools data
  fetchSchools();
  
  // Theme toggle
  themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-theme', darkMode);
    localStorage.setItem('darkMode', darkMode);
  });
  
  // Mobile filter button
  mobileFilterBtn.addEventListener('click', () => {
    filtersSidebar.classList.add('active');
    filterOverlay.classList.add('active');
  });
  
  // Filter overlay click
  filterOverlay.addEventListener('click', () => {
    filtersSidebar.classList.remove('active');
    filterOverlay.classList.remove('active');
  });
  
  // Close modal
  closeModal.addEventListener('click', () => {
    schoolModal.style.display = 'none';
    document.body.style.overflow = '';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === schoolModal) {
      schoolModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
  
  // Search form submit
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters();
  });
  
  // Search input change
  searchInput.addEventListener('input', () => {
    applyFilters();
  });
  
  // Reset filters
  resetFilters.addEventListener('click', () => {
    // Reset checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // Reset radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      if (radio.value === '') {
        radio.checked = true;
      } else {
        radio.checked = false;
      }
    });
    
    // Reset selects
    document.querySelectorAll('select').forEach(select => {
      select.value = '';
    });
    
    // Reset search
    searchInput.value = '';
    
    // Apply filters
    applyFilters();
  });
  
  // Filter group toggles
  filterGroups.forEach(header => {
    header.addEventListener('click', () => {
      const groupId = header.getAttribute('data-toggle');
      const content = document.getElementById(groupId);
      
      // Toggle content visibility
      if (content.style.display === 'none') {
        content.style.display = 'flex';
        header.querySelector('i').classList.remove('fa-chevron-right');
        header.querySelector('i').classList.add('fa-chevron-down');
      } else {
        content.style.display = 'none';
        header.querySelector('i').classList.remove('fa-chevron-down');
        header.querySelector('i').classList.add('fa-chevron-right');
      }
    });
  });
  
  // Filter inputs change
  document.querySelectorAll('input[type="checkbox"], input[type="radio"], select').forEach(input => {
    input.addEventListener('change', () => {
      applyFilters();
    });
  });
  
  // Tab buttons
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
  
  // Rating stars
  ratingStars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.getAttribute('data-rating'));
      currentRating = rating;
      
      // Update star display
      ratingStars.forEach((s, index) => {
        if (index < rating) {
          s.classList.remove('far');
          s.classList.add('fas');
        } else {
          s.classList.remove('fas');
          s.classList.add('far');
        }
      });
      
      // Enable/disable submit button
      submitReview.disabled = !(currentRating > 0 && reviewText.value.trim() !== '');
    });
    
    // Hover effect
    star.addEventListener('mouseenter', () => {
      const rating = parseInt(star.getAttribute('data-rating'));
      
      ratingStars.forEach((s, index) => {
        if (index < rating) {
          s.classList.remove('far');
          s.classList.add('fas');
        } else {
          s.classList.remove('fas');
          s.classList.add('far');
        }
      });
    });
    
    star.addEventListener('mouseleave', () => {
      ratingStars.forEach((s, index) => {
        if (index < currentRating) {
          s.classList.remove('far');
          s.classList.add('fas');
        } else {
          s.classList.remove('fas');
          s.classList.add('far');
        }
      });
    });
  });
  
  // Review text input
  reviewText.addEventListener('input', () => {
    submitReview.disabled = !(currentRating > 0 && reviewText.value.trim() !== '');
  });
  
  // Submit review
  submitReview.addEventListener('click', () => {
    if (currentRating > 0 && reviewText.value.trim() !== '') {
      const newReview = {
        id: `r${Date.now()}`,
        user: "Current User",
        rating: currentRating,
        text: reviewText.value.trim(),
        date: new Date().toISOString(),
      };
      
      // Add review to school
      if (!selectedSchool.reviews) {
        selectedSchool.reviews = [];
      }
      
      selectedSchool.reviews.unshift(newReview);
      
      // Update school rating
      const totalRatings = selectedSchool.reviews.reduce((sum, review) => sum + review.rating, 0);
      selectedSchool.rating = totalRatings / selectedSchool.reviews.length;
      
      // Reset form
      resetReviewForm();
      
      // Reopen modal to refresh content
      openSchoolModal(selectedSchool);
    }
  });
});