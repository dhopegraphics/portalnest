document.addEventListener('DOMContentLoaded', function() {
    // Modal Open/Close Functionality
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    
    // Open modal when button is clicked
    openModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            // Add active class with a slight delay for animation
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal functions
    function closeModal(modal) {
        modal.classList.remove('active');
        
        // Allow body scrolling again
        document.body.style.overflow = '';
        
        // Reset form
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            
            // Clear error messages
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(error => {
                error.textContent = '';
            });
        }
    }
    
    // Close modal when X button is clicked
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            closeModal(modal);
        });
    });
    
    // Close modal when Cancel button is clicked
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    modalOverlays.forEach(modal => {
        modal.addEventListener('click', function(event) {
            // Close only if clicking on the overlay itself, not its children
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Form Validation
    const forms = document.querySelectorAll('.modal-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Reset error messages
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(error => {
                error.textContent = '';
            });
            
            let isValid = true;
            
            // Validate inputs based on form ID
            switch(form.id) {
                case 'student-form':
                    isValid = validateStudentForm(form);
                    break;
                case 'faculty-form':
                    isValid = validateFacultyForm(form);
                    break;
                case 'department-form':
                    isValid = validateDepartmentForm(form);
                    break;
                case 'course-form':
                    isValid = validateCourseForm(form);
                    break;
                case 'grade-form':
                    isValid = validateGradeForm(form);
                    break;
                case 'event-form':
                    isValid = validateEventForm(form);
                    break;
            }
            
            if (isValid) {
                // Form is valid, show success message
                alert('Form submitted successfully!');
                
                // Close the modal
                const modal = form.closest('.modal-overlay');
                closeModal(modal);
            }
        });
    });
    
    // Validation functions for each form
    function validateStudentForm(form) {
        let isValid = true;
        
        // Validate email
        const emailInput = form.querySelector('#student-email');
        const emailError = form.querySelector('#student-email-error');
        
        if (!emailInput.value) {
            emailError.textContent = 'Email is required';
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Validate name
        const nameInput = form.querySelector('#student-name');
        const nameError = form.querySelector('#student-name-error');
        
        if (!nameInput.value) {
            nameError.textContent = 'Full name is required';
            isValid = false;
        }
        
        // Validate student ID
        const idInput = form.querySelector('#student-id');
        const idError = form.querySelector('#student-id-error');
        
        if (!idInput.value) {
            idError.textContent = 'Student ID is required';
            isValid = false;
        }
        
        // Validate department
        const departmentInput = form.querySelector('#student-department');
        const departmentError = form.querySelector('#student-department-error');
        
        if (!departmentInput.value) {
            departmentError.textContent = 'Please select a department';
            isValid = false;
        }
        
        // Validate program
        const programInput = form.querySelector('#student-program');
        const programError = form.querySelector('#student-program-error');
        
        if (!programInput.value) {
            programError.textContent = 'Please select a program';
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateFacultyForm(form) {
        let isValid = true;
        
        // Validate name
        const nameInput = form.querySelector('#faculty-name');
        const nameError = form.querySelector('#faculty-name-error');
        
        if (!nameInput.value) {
            nameError.textContent = 'Faculty name is required';
            isValid = false;
        }
        
        // Validate faculty ID
        const idInput = form.querySelector('#faculty-id');
        const idError = form.querySelector('#faculty-id-error');
        
        if (!idInput.value) {
            idError.textContent = 'Faculty ID is required';
            isValid = false;
        }
        
        // Validate departments
        const departmentCheckboxes = form.querySelectorAll('input[name="departments"]:checked');
        const departmentError = form.querySelector('#faculty-departments-error');
        
        if (departmentCheckboxes.length === 0) {
            departmentError.textContent = 'Please select at least one department';
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateDepartmentForm(form) {
        let isValid = true;
        
        // Validate department name
        const nameInput = form.querySelector('#department-name');
        const nameError = form.querySelector('#department-name-error');
        
        if (!nameInput.value) {
            nameError.textContent = 'Department name is required';
            isValid = false;
        }
        
        // Validate department ID
        const idInput = form.querySelector('#department-id');
        const idError = form.querySelector('#department-id-error');
        
        if (!idInput.value) {
            idError.textContent = 'Department ID is required';
            isValid = false;
        }
        
        // Validate program name
        const programInput = form.querySelector('#program-name');
        const programError = form.querySelector('#program-name-error');
        
        if (!programInput.value) {
            programError.textContent = 'Program name is required';
            isValid = false;
        }
        
        // Validate courses
        const coursesInput = form.querySelector('#department-courses');
        const coursesError = form.querySelector('#department-courses-error');
        
        if (coursesInput.selectedOptions.length === 0) {
            coursesError.textContent = 'Please select at least one course';
            isValid = false;
        }
        
        // Validate head of department
        const headInput = form.querySelector('#department-head');
        const headError = form.querySelector('#department-head-error');
        
        if (!headInput.value) {
            headError.textContent = 'Please select a head of department';
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateCourseForm(form) {
        let isValid = true;
        
        // Validate course name
        const nameInput = form.querySelector('#course-name');
        const nameError = form.querySelector('#course-name-error');
        
        if (!nameInput.value) {
            nameError.textContent = 'Course name is required';
            isValid = false;
        }
        
        // Validate course ID
        const idInput = form.querySelector('#course-id');
        const idError = form.querySelector('#course-id-error');
        
        if (!idInput.value) {
            idError.textContent = 'Course ID is required';
            isValid = false;
        }
        
        // Validate lecturer
        const lecturerInput = form.querySelector('#course-lecturer');
        const lecturerError = form.querySelector('#course-lecturer-error');
        
        if (!lecturerInput.value) {
            lecturerError.textContent = 'Please select a lecturer';
            isValid = false;
        }
        
        // Validate year of study
        const yearInput = form.querySelector('#course-year');
        const yearError = form.querySelector('#course-year-error');
        
        if (!yearInput.value) {
            yearError.textContent = 'Please select a year of study';
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateGradeForm(form) {
        let isValid = true;
        
        // Validate all grade inputs
        const gradeInputs = form.querySelectorAll('.grade-input');
        const tableError = form.querySelector('#grade-table-error');
        
        let hasEmptyGrade = false;
        let hasInvalidGrade = false;
        
        gradeInputs.forEach(input => {
            if (!input.value) {
                hasEmptyGrade = true;
            } else if (parseInt(input.value) < 0 || parseInt(input.value) > 100) {
                hasInvalidGrade = true;
            }
        });
        
        if (hasEmptyGrade) {
            tableError.textContent = 'All grades are required';
            isValid = false;
        } else if (hasInvalidGrade) {
            tableError.textContent = 'Grades must be between 0 and 100';
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateEventForm(form) {
        let isValid = true;
        
        // Validate event title
        const titleInput = form.querySelector('#event-title');
        const titleError = form.querySelector('#event-title-error');
        
        if (!titleInput.value) {
            titleError.textContent = 'Event title is required';
            isValid = false;
        }
        
        // Validate event ID
        const idInput = form.querySelector('#event-id');
        const idError = form.querySelector('#event-id-error');
        
        if (!idInput.value) {
            idError.textContent = 'Event ID is required';
            isValid = false;
        }
        
        // Validate event type
        const typeInput = form.querySelector('#event-type');
        const typeError = form.querySelector('#event-type-error');
        
        if (!typeInput.value) {
            typeError.textContent = 'Please select an event type';
            isValid = false;
        }
        
        // Validate start date
        const startDateInput = form.querySelector('#event-start-date');
        const startDateError = form.querySelector('#event-start-date-error');
        
        if (!startDateInput.value) {
            startDateError.textContent = 'Start date is required';
            isValid = false;
        }
        
        // Validate end date
        const endDateInput = form.querySelector('#event-end-date');
        const endDateError = form.querySelector('#event-end-date-error');
        
        if (!endDateInput.value) {
            endDateError.textContent = 'End date is required';
            isValid = false;
        } else if (new Date(endDateInput.value) < new Date(startDateInput.value)) {
            endDateError.textContent = 'End date must be after start date';
            isValid = false;
        }
        
        // Validate time
        const timeInput = form.querySelector('#event-time');
        const timeError = form.querySelector('#event-time-error');
        
        if (!timeInput.value) {
            timeError.textContent = 'Time is required';
            isValid = false;
        }
        
        return isValid;
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Add floating label behavior for inputs
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // For initial state (if input has value on page load)
        if (input.value) {
            const label = input.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.classList.add('active');
            }
        }
        
        // For focus state
        input.addEventListener('focus', function() {
            const label = this.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.classList.add('active');
            }
        });
        
        // For blur state
        input.addEventListener('blur', function() {
            if (!this.value) {
                const label = this.nextElementSibling;
                if (label && label.tagName === 'LABEL') {
                    label.classList.remove('active');
                }
            }
        });
    });
});