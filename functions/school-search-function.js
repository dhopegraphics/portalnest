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
  // In a real application, this would be an API call
  // For this example, we'll use mock data
  schools = [
    {
      id: "1",
      name: "University of Manila",
      type: "University",
      description: "A premier university offering a wide range of undergraduate and graduate programs with a focus on research and innovation.",
      image: "https://via.placeholder.com/600x300?text=University+of+Manila",
      location: {
        country: "Philippines",
        region: "NCR",
        city: "Manila",
      },
      contact: {
        phone: "+63 2 1234 5678",
        email: "admissions@umanila.edu.ph",
        website: "https://www.umanila.edu.ph",
      },
      programs: ["Science", "Business", "Arts", "Engineering", "IT", "Medicine"],
      programDetails: [
        {
          name: "Computer Science",
          description: "Learn programming, algorithms, and software development.",
          duration: "4 years",
        },
        {
          name: "Business Administration",
          description: "Study management, marketing, and entrepreneurship.",
          duration: "4 years",
        },
        {
          name: "Medicine",
          description: "Comprehensive medical education with clinical rotations.",
          duration: "6 years",
        },
        {
          name: "Civil Engineering",
          description: "Design and build infrastructure and public works.",
          duration: "5 years",
        },
      ],
      admissionStatus: "Open",
      admissionProcess: "Submit application form, entrance exam, interview, and required documents. Applications are accepted from June to August each year.",
      tuitionRange: "Medium",
      tuitionDetails: "Tuition ranges from ₱50,000 to ₱80,000 per semester depending on the program. Scholarships and financial aid are available.",
      accreditation: "Accredited",
      facilities: ["Library", "Labs", "Hostels", "Sports Complex", "Scholarships"],
      rating: 4.5,
      reviews: [
        {
          id: "r1",
          user: "Juan Dela Cruz",
          rating: 5,
          text: "Excellent university with great professors and modern facilities. The campus is beautiful and the community is very supportive.",
          date: "2023-05-15T10:30:00Z",
        },
        {
          id: "r2",
          user: "Maria Santos",
          rating: 4,
          text: "Good academic programs but the registration process can be improved. Overall, I had a positive experience during my time here.",
          date: "2023-03-22T14:15:00Z",
        },
      ],
    },
    {
      id: "2",
      name: "Quezon City College",
      type: "College",
      description: "A community college providing affordable education with a focus on practical skills and workforce readiness.",
      image: "https://via.placeholder.com/600x300?text=Quezon+City+College",
      location: {
        country: "Philippines",
        region: "NCR",
        city: "Quezon City",
      },
      contact: {
        phone: "+63 2 8765 4321",
        email: "info@qcc.edu.ph",
        website: "https://www.qcc.edu.ph",
      },
      programs: ["Business", "IT", "Hospitality"],
      programDetails: [
        {
          name: "Information Technology",
          description: "Practical IT skills for the modern workplace.",
          duration: "4 years",
        },
        {
          name: "Hotel and Restaurant Management",
          description: "Training for careers in hospitality and tourism.",
          duration: "4 years",
        },
      ],
      admissionStatus: "Closed",
      admissionProcess: "Submit application form, high school transcript, and attend orientation. Next admission cycle opens in November.",
      tuitionRange: "Low",
      tuitionDetails: "Tuition is approximately ₱25,000 per semester. City residents receive discounts.",
      accreditation: "Accredited",
      facilities: ["Library", "Computer Labs", "Cafeteria"],
      rating: 3.8,
      reviews: [
        {
          id: "r3",
          user: "Pedro Reyes",
          rating: 4,
          text: "Affordable education with decent quality. The IT program is particularly good with updated curriculum.",
          date: "2023-02-10T09:45:00Z",
        },
      ],
    },
    {
      id: "3",
      name: "Makati Science High School",
      type: "Senior High School",
      description: "A specialized science high school offering STEM-focused education for academically gifted students.",
      image: "https://via.placeholder.com/600x300?text=Makati+Science+High",
      location: {
        country: "Philippines",
        region: "NCR",
        city: "Makati",
      },
      contact: {
        phone: "+63 2 9876 5432",
        email: "admissions@mshs.edu.ph",
        website: "https://www.mshs.edu.ph",
      },
      programs: ["Science", "Mathematics", "Engineering"],
      programDetails: [
        {
          name: "STEM Strand",
          description: "Rigorous curriculum in Science, Technology, Engineering, and Mathematics.",
          duration: "2 years",
        },
        {
          name: "Research Program",
          description: "Specialized track for students interested in scientific research.",
          duration: "2 years",
        },
      ],
      admissionStatus: "Upcoming",
      admissionProcess: "Entrance examination, interview, and review of junior high school records. Only top-performing students are admitted.",
      tuitionRange: "Low",
      tuitionDetails: "Public school with minimal fees. Scholarships available for exceptional students.",
      accreditation: "Accredited",
      facilities: ["Science Labs", "Computer Labs", "Library", "Sports Facilities"],
      rating: 4.7,
      reviews: [
        {
          id: "r4",
          user: "Ana Gonzales",
          rating: 5,
          text: "Excellent science program with dedicated teachers. The research opportunities are outstanding for high school level.",
          date: "2023-06-05T16:20:00Z",
        },
        {
          id: "r5",
          user: "Carlos Tan",
          rating: 4,
          text: "Challenging curriculum that prepares students well for college. The workload is heavy but worth it.",
          date: "2023-04-18T11:30:00Z",
        },
      ],
    },
    {
      id: "4",
      name: "Central Luzon State University",
      type: "University",
      description: "A leading agricultural university known for its research and extension programs in agriculture, forestry, and fisheries.",
      image: "https://via.placeholder.com/600x300?text=Central+Luzon+State+University",
      location: {
        country: "Philippines",
        region: "Central Luzon",
        city: "Science City of Muñoz",
      },
      contact: {
        phone: "+63 44 456 0680",
        email: "info@clsu.edu.ph",
        website: "https://www.clsu.edu.ph",
      },
      programs: ["Agriculture", "Veterinary Medicine", "Engineering", "Science"],
      programDetails: [
        {
          name: "Agricultural Engineering",
          description: "Application of engineering principles to agricultural production and processing.",
          duration: "5 years",
        },
        {
          name: "Veterinary Medicine",
          description: "Comprehensive program for animal health and medicine.",
          duration: "6 years",
        },
        {
          name: "Agriculture",
          description: "Study of crop production, animal husbandry, and agricultural economics.",
          duration: "4 years",
        },
      ],
      admissionStatus: "Open",
      admissionProcess: "Submit application form, entrance examination, and interview. Special consideration for agriculture-related achievements.",
      tuitionRange: "Low",
      tuitionDetails: "State university with subsidized tuition. Free tuition for qualified students under the Universal Access to Quality Tertiary Education Act.",
      accreditation: "Accredited",
      facilities: ["Research Farms", "Laboratories", "Library", "Dormitories", "Sports Complex"],
      rating: 4.3,
      reviews: [
        {
          id: "r6",
          user: "Roberto Mendoza",
          rating: 4,
          text: "Great university for agricultural studies. The hands-on experience with the research farms is invaluable.",
          date: "2023-01-25T13:40:00Z",
        },
      ],
    },
    {
      id: "5",
      name: "St. Paul College Pasig",
      type: "Junior High School",
      description: "A Catholic educational institution offering quality education with a focus on Christian values and character formation.",
      image: "https://via.placeholder.com/600x300?text=St.+Paul+College",
      location: {
        country: "Philippines",
        region: "NCR",
        city: "Pasig",
      },
      contact: {
        phone: "+63 2 8631 4567",
        email: "admissions@spcp.edu.ph",
        website: "https://www.spcp.edu.ph",
      },
      programs: ["Arts", "Science", "Mathematics"],
      programDetails: [
        {
          name: "Regular Academic Program",
          description: "Comprehensive curriculum following the K-12 program.",
          duration: "4 years",
        },
        {
          name: "Special Science Class",
          description: "Advanced science and mathematics for gifted students.",
          duration: "4 years",
        },
      ],
      admissionStatus: "Upcoming",
      admissionProcess: "Entrance examination, interview with parents, and submission of report cards from previous school.",
      tuitionRange: "High",
      tuitionDetails: "Annual tuition ranges from ₱90,000 to ₱120,000 depending on the grade level. Additional fees for special programs.",
      accreditation: "Accredited",
      facilities: ["Library", "Science Labs", "Computer Labs", "Sports Facilities", "Chapel"],
      rating: 4.6,
      reviews: [
        {
          id: "r7",
          user: "Teresa Lim",
          rating: 5,
          text: "Excellent education with a good balance of academics, values formation, and extracurricular activities.",
          date: "2023-07-12T10:15:00Z",
        },
        {
          id: "r8",
          user: "Miguel Reyes",
          rating: 4,
          text: "Strong academic program and good facilities. The teachers are dedicated and supportive.",
          date: "2023-05-30T14:50:00Z",
        },
      ],
    },
    {
      id: "6",
      name: "Ateneo de Manila University",
      type: "University",
      description: "A prestigious Jesuit university known for its liberal arts tradition and formation of leaders for the nation.",
      image: "https://via.placeholder.com/600x300?text=Ateneo+de+Manila",
      location: {
        country: "Philippines",
        region: "NCR",
        city: "Quezon City",
      },
      contact: {
        phone: "+63 2 8426 6001",
        email: "admissions@ateneo.edu",
        website: "https://www.ateneo.edu",
      },
      programs: ["Arts", "Science", "Business", "Law", "Medicine"],
      programDetails: [
        {
          name: "Management",
          description: "Comprehensive business education with a focus on ethics and leadership.",
          duration: "4 years",
        },
        {
          name: "Communications",
          description: "Study of media, journalism, and organizational communication.",
          duration: "4 years",
        },
        {
          name: "Psychology",
          description: "Understanding human behavior and mental processes.",
          duration: "4 years",
        },
      ],
      admissionStatus: "Open",
      admissionProcess: "Submit application, entrance exam (ACET), and interview. Highly competitive admission process.",
      tuitionRange: "High",
      tuitionDetails: "Annual tuition ranges from ₱200,000 to ₱250,000 depending on the program. Financial aid and scholarships available.",
      accreditation: "Accredited",
      facilities: ["Library", "Labs", "Sports Complex", "Theater", "Chapel", "Scholarships"],
      rating: 4.8,
      reviews: [
        {
          id: "r9",
          user: "Jose Garcia",
          rating: 5,
          text: "World-class education with excellent faculty. The Jesuit tradition of education is evident in the holistic formation.",
          date: "2023-08-05T09:30:00Z",
        },
        {
          id: "r10",
          user: "Sofia Cruz",
          rating: 5,
          text: "Amazing university with a beautiful campus. The core curriculum really helps develop critical thinking.",
          date: "2023-06-22T16:45:00Z",
        },
      ],
    },
  ];
  
  filteredSchools = [...schools];
  renderSchools();
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