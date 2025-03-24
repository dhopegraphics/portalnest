
// Sample ticket data
const sampleTickets = [
    {
        id: '#2023-5678',
        subject: 'Unable to access online course materials',
        category: 'Technical Issues',
        priority: 'High',
        status: 'Open',
        date: '2023-03-15',
        attachments: 2,
        isNew: false
    },
    {
        id: '#2023-4321',
        subject: 'Request for transcript for graduate school application',
        category: 'Student Services',
        priority: 'Medium',
        status: 'In Progress',
        date: '2023-03-10',
        attachments: 1,
        isNew: false
    },
    {
        id: '#2023-9876',
        subject: 'Error when submitting assignment in Biology 101',
        category: 'Technical Issues',
        priority: 'Medium',
        status: 'Closed',
        date: '2023-02-28',
        attachments: 3,
        isNew: false
    },
    {
        id: '#2023-2468',
        subject: 'Question about financial aid deadline',
        category: 'Admissions',
        priority: 'Low',
        status: 'Open',
        date: '2023-03-12',
        attachments: 0,
        isNew: false
    }
];

// Function to render tickets
function renderTickets(tickets) {
    const ticketList = document.getElementById('ticket-list');
    
    // Clear current list
    ticketList.innerHTML = '';
    
    if (tickets.length === 0) {
        // Show empty state
        ticketList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-ticket-alt"></i>
                <h3>No tickets found</h3>
                <p>You don't have any tickets matching your current filters. Try adjusting your filters or create a new ticket.</p>
                <button class="action-btn primary">
                    <i class="fas fa-plus"></i> Create New Ticket
                </button>
            </div>
        `;
        
        // Add event listener to the new ticket button
        const newTicketBtn = ticketList.querySelector('.action-btn.primary');
        newTicketBtn.addEventListener('click', () => {
            openModal();
        });
        
        return;
    }
    
    // Render each ticket
    tickets.forEach(ticket => {
        const ticketCard = document.createElement('div');
        ticketCard.className = `ticket-card${ticket.isNew ? ' new-ticket' : ''}`;
        
        // Get status class
        let statusClass = '';
        switch (ticket.status.toLowerCase()) {
            case 'open':
                statusClass = 'open';
                break;
            case 'in progress':
                statusClass = 'in-progress';
                break;
            case 'closed':
                statusClass = 'closed';
                break;
        }
        
        ticketCard.innerHTML = `
            <div class="ticket-header">
                <span class="ticket-id">${ticket.id}</span>
                <span class="ticket-date">${formatDate(ticket.date)}</span>
            </div>
            <div class="ticket-body">
                <div class="ticket-subject">${ticket.subject}</div>
                <div class="ticket-meta">
                    <span class="ticket-category">${ticket.category}</span>
                    <span class="ticket-priority">${ticket.priority}</span>
                    <span class="status-badge ${statusClass}">${ticket.status}</span>
                </div>
            </div>
            <div class="ticket-footer">
                <div class="ticket-attachments">
                    ${ticket.attachments > 0 ? `<i class="fas fa-paperclip"></i> ${ticket.attachments} ${ticket.attachments === 1 ? 'file' : 'files'}` : ''}
                </div>
                <div class="ticket-actions">
                    <button class="ticket-action-btn view-btn">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${ticket.status !== 'Closed' ? `
                        <button class="ticket-action-btn reply-btn">
                            <i class="fas fa-reply"></i> Reply
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        ticketList.appendChild(ticketCard);
    });
    
    // Add event listeners to ticket action buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketCard = this.closest('.ticket-card');
            const ticketId = ticketCard.querySelector('.ticket-id').textContent;
            alert(`Viewing ticket ${ticketId}`);
            // In a real app, you would navigate to the ticket detail page
        });
    });
    
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketCard = this.closest('.ticket-card');
            const ticketId = ticketCard.querySelector('.ticket-id').textContent;
            alert(`Replying to ticket ${ticketId}`);
            // In a real app, you would open a reply modal or navigate to the reply page
        });
    });
}

// Format date function
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Filter tickets function
function filterTickets() {
    const statusFilter = document.getElementById('status-filter').value;
    const priorityFilter = document.getElementById('priority-filter').value;
    const categoryFilter = document.getElementById('category-filter').value;
    const searchTerm = document.getElementById('ticket-search').value.toLowerCase();
    
    let filteredTickets = [...sampleTickets];
    
    // Apply status filter
    if (statusFilter !== 'all') {
        filteredTickets = filteredTickets.filter(ticket => 
            ticket.status.toLowerCase() === statusFilter
        );
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
        filteredTickets = filteredTickets.filter(ticket => 
            ticket.priority.toLowerCase() === priorityFilter
        );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        filteredTickets = filteredTickets.filter(ticket => 
            ticket.category.toLowerCase().includes(categoryFilter)
        );
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredTickets = filteredTickets.filter(ticket => 
            ticket.subject.toLowerCase().includes(searchTerm) ||
            ticket.id.toLowerCase().includes(searchTerm) ||
            ticket.category.toLowerCase().includes(searchTerm)
        );
    }
    
    renderTickets(filteredTickets);
}

// Modal functionality - Enhanced version
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const newTicketButtons = document.querySelectorAll('.action-btn.primary');
    const modalOverlay = document.getElementById('new-ticket-modal');
    const modalContainer = document.querySelector('.modal-container');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const newTicketForm = document.getElementById('new-ticket-form');
    const fileInput = document.getElementById('ticket-attachments');
    const fileList = document.getElementById('file-list');
    const submitBtn = document.querySelector('.submit-btn');
    
    // Configuration
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxFiles = 5;
    
    // State
    let selectedFiles = [];
    let isSubmitting = false;
    
    // Initialize ticket list
    renderTickets(sampleTickets);
    
    // Add event listeners to filter controls
    document.getElementById('status-filter').addEventListener('change', filterTickets);
    document.getElementById('priority-filter').addEventListener('change', filterTickets);
    document.getElementById('category-filter').addEventListener('change', filterTickets);
    document.getElementById('ticket-search').addEventListener('input', filterTickets);
    
    // Open modal when "Create New Ticket" button is clicked
    newTicketButtons.forEach(button => {
        if (button.textContent.includes('Create New Ticket')) {
            button.addEventListener('click', () => {
                openModal();
            });
        }
    });
    
    // Open modal function
    function openModal() {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        
        // Focus the first input for accessibility
        setTimeout(() => {
            const firstInput = modalContainer.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }, 100);
        
        // Add keyboard event listener
        document.addEventListener('keydown', handleKeyDown);
    }
    
    // Close modal function
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
        resetForm();
        
        // Remove keyboard event listener
        document.removeEventListener('keydown', handleKeyDown);
    }
    
    // Reset form function
    function resetForm() {
        newTicketForm.reset(); // Reset form fields
        fileList.innerHTML = ''; // Clear file list
        selectedFiles = []; // Clear selected files array
        
        // Remove all error messages and classes
        const errorElements = newTicketForm.querySelectorAll('.error');
        errorElements.forEach(el => el.classList.remove('error'));
        
        const errorMessages = newTicketForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        // Reset submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Ticket';
    }
    
    // Handle keyboard events
    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'Tab') {
            // Trap focus inside modal
            const focusableElements = modalContainer.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    // Close modal when close button is clicked
    modalCloseBtn.addEventListener('click', closeModal);
    
    // Close modal when cancel button is clicked
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the modal
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // File upload handling with validation
    fileInput.addEventListener('change', handleFileSelection);
    
    function handleFileSelection() {
        // Get newly selected files
        const newFiles = Array.from(fileInput.files);
        
        // Validate files
        const validatedFiles = validateFiles(newFiles);
        
        // Add valid files to selected files array
        selectedFiles = [...selectedFiles, ...validatedFiles.validFiles];
        
        // Update file list UI
        updateFileListUI();
        
        // Show error messages for invalid files
        if (validatedFiles.errors.length > 0) {
            showFileErrors(validatedFiles.errors);
        }
        
        // Reset file input to allow selecting the same file again
        fileInput.value = '';
    }
    
    function validateFiles(files) {
        const validFiles = [];
        const errors = [];
        
        // Check if adding these files would exceed the maximum
        if (selectedFiles.length + files.length > maxFiles) {
            errors.push(`You can only upload a maximum of ${maxFiles} files.`);
            // Only process files up to the maximum
            const remainingSlots = maxFiles - selectedFiles.length;
            files = files.slice(0, remainingSlots);
        }
        
        // Validate each file
        files.forEach(file => {
            // Check file type
            if (!allowedFileTypes.includes(file.type)) {
                errors.push(`"${file.name}" is not a supported file type.`);
                return;
              alert.error("is not a supported file type.")
               
            }
            
            // Check file size
            if (file.size > maxFileSize) {
                errors.push(`"${file.name}" exceeds the maximum file size of 5MB.`);
                return;
            }
            
            // Check for duplicate files
            const isDuplicate = selectedFiles.some(existingFile => 
                existingFile.name === file.name && 
                existingFile.size === file.size && 
                existingFile.type === file.type
            );
            
            if (isDuplicate) {
                errors.push(`"${file.name}" has already been added.`);
                return;
            }
            
            // File is valid
            validFiles.push(file);
        });
        
        return { validFiles, errors };
    }
    
    function showFileErrors(errors) {
        // Create error container if it doesn't exist
        let errorContainer = document.querySelector('.file-error-container');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'file-error-container error-message';
            const fileUploadContainer = document.querySelector('.file-upload-container');
            fileUploadContainer.parentNode.insertBefore(errorContainer, fileUploadContainer.nextSibling);
        }
        
        // Add error messages
        errorContainer.innerHTML = errors.map(error => `<div>• ${error}</div>`).join('');
        
        // Auto-remove errors after 5 seconds
        setTimeout(() => {
            errorContainer.remove();
        }, 5000);
    }
    
    function updateFileListUI() {
        fileList.innerHTML = ''; // Clear current list
        
        if (selectedFiles.length === 0) {
            return;
        }
        
        // Create file items
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            // Determine file icon based on type
            let fileIcon = 'fa-file';
            if (file.type.includes('image')) fileIcon = 'fa-file-image';
            else if (file.type.includes('pdf')) fileIcon = 'fa-file-pdf';
            else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) fileIcon = 'fa-file-word';
            
            // Format file size
            const fileSize = file.size < 1024 * 1024 
                ? `${(file.size / 1024).toFixed(1)} KB` 
                : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
            
            // Create preview for images
            let previewHTML = '';
            if (file.type.includes('image')) {
                previewHTML = `<div class="file-preview" id="preview-${index}"></div>`;
                
                // Create object URL and set as background
                setTimeout(() => {
                    const previewElement = document.getElementById(`preview-${index}`);
                    if (previewElement) {
                        const objectUrl = URL.createObjectURL(file);
                        previewElement.style.backgroundImage = `url(${objectUrl})`;
                        
                        // Clean up object URL when no longer needed
                        previewElement.dataset.objectUrl = objectUrl;
                    }
                }, 0);
            }
            
            // Set file item HTML
            fileItem.innerHTML = `
                ${previewHTML}
                <div class="file-info">
                    <i class="fas ${fileIcon} file-icon"></i>
                    <div>
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${fileSize}</div>
                    </div>
                </div>
                <button type="button" class="file-remove" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            fileList.appendChild(fileItem);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.file-remove').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                
                // Clean up object URL if it exists
                const previewElement = document.getElementById(`preview-${index}`);
                if (previewElement && previewElement.dataset.objectUrl) {
                    URL.revokeObjectURL(previewElement.dataset.objectUrl);
                }
                
                // Remove file from array
                selectedFiles.splice(index, 1);
                
                // Update UI
                updateFileListUI();
            });
        });
    }
    
    // Drag and drop functionality for file upload
    const fileUploadLabel = document.querySelector('.file-upload-label');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUploadLabel.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        fileUploadLabel.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        fileUploadLabel.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        fileUploadLabel.classList.add('highlight');
    }
    
    function unhighlight() {
        fileUploadLabel.classList.remove('highlight');
    }
    
    fileUploadLabel.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        
        // Validate and add files
        const validatedFiles = validateFiles(droppedFiles);
        
        // Add valid files to selected files array
        selectedFiles = [...selectedFiles, ...validatedFiles.validFiles];
        
        // Update file list UI
        updateFileListUI();
        
        // Show error messages for invalid files
        if (validatedFiles.errors.length > 0) {
            showFileErrors(validatedFiles.errors);
        }
    }
    
    // Form validation and submission
    newTicketForm.addEventListener('submit', handleFormSubmit);
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Set submitting state
        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        // Simulate form submission (in a real app, you would send data to server)
        setTimeout(() => {
            // Add the new ticket to the sample tickets
            const newTicket = {
                id: `#${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                subject: document.getElementById('ticket-subject').value,
                category: document.getElementById('ticket-category').options[document.getElementById('ticket-category').selectedIndex].text,
                priority: document.getElementById('ticket-priority').options[document.getElementById('ticket-priority').selectedIndex].text,
                status: 'Open',
                date: new Date().toISOString().split('T')[0],
                attachments: selectedFiles.length,
                isNew: true
            };
            
            // Add to beginning of array
            sampleTickets.unshift(newTicket);
            
            // Show success message
            showSuccessMessage(newTicket);
            
            isSubmitting = false;
        }, 1500);
    }
    
    function validateForm() {
        let isValid = true;
        const requiredFields = newTicketForm.querySelectorAll('[required]');
        
        // Remove all existing error messages
        const errorMessages = newTicketForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        // Validate each required field
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                markFieldAsError(field, 'This field is required');
                isValid = false;
            } else {
                // Additional validation based on field type
                if (field.id === 'ticket-subject' && field.value.length < 5) {
                    markFieldAsError(field, 'Subject must be at least 5 characters long');
                    isValid = false;
                } else if (field.id === 'ticket-description' && field.value.length < 20) {
                    markFieldAsError(field, 'Please provide a more detailed description (at least 20 characters)');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    function markFieldAsError(field, errorMessage) {
        field.classList.add('error');
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        field.parentElement.appendChild(errorElement);
        
        // Focus the first field with an error
        if (!document.querySelector('.error:focus')) {
            field.focus();
        }
    }
    
    // Remove error class when user starts typing/selecting
    newTicketForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => {
            field.classList.remove('error');
            const errorMessage = field.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
    
    function showSuccessMessage(newTicket) {
        // Get form data for the success message
        const category = document.getElementById('ticket-category');
        const categoryText = category.options[category.selectedIndex].text;
        
        const priority = document.getElementById('ticket-priority');
        const priorityText = priority.options[priority.selectedIndex].text;
        
        // Clear the form and show success message
        newTicketForm.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Ticket submitted successfully!</strong>
                    <p>Your ticket has been created with ID ${newTicket.id}.</p>
                </div>
            </div>
            
            <div class="ticket-summary">
                <h4>Ticket Summary</h4>
                <div class="summary-item">
                    <span class="summary-label">Subject:</span>
                    <span class="summary-value">${document.getElementById('ticket-subject').value}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Category:</span>
                    <span class="summary-value">${categoryText}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Priority:</span>
                    <span class="summary-value">${priorityText}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Attachments:</span>
                    <span class="summary-value">${selectedFiles.length} file(s)</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Status:</span>
                    <span class="summary-value status-badge open">Open</span>
                </div>
                <div class="summary-note">
                    <p>We'll respond to your ticket as soon as possible. You can track the status of your ticket in the "My Tickets" section.</p>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="action-btn secondary view-tickets-btn">
                    <i class="fas fa-ticket-alt"></i> View My Tickets
                </button>
                <button type="button" class="action-btn primary close-success-btn">
                    <i class="fas fa-check"></i> Done
                </button>
            </div>
        `;
        
        // Add event listeners to buttons
        document.querySelector('.close-success-btn').addEventListener('click', () => {
            closeModal();
            // Refresh ticket list to show the new ticket
            renderTickets(sampleTickets);
        });
        
        document.querySelector('.view-tickets-btn').addEventListener('click', () => {
            closeModal();
            // Refresh ticket list to show the new ticket
            renderTickets(sampleTickets);
            // Scroll to the new ticket
            setTimeout(() => {
                const newTicketElement = document.querySelector('.ticket-card.new-ticket');
                if (newTicketElement) {
                    newTicketElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        });
    }
    
    // Pagination functionality
    document.getElementById('prev-page').addEventListener('click', function() {
        if (!this.classList.contains('disabled')) {
            // In a real app, you would implement pagination logic here
            alert('Previous page');
        }
    });
    
    document.getElementById('next-page').addEventListener('click', function() {
        // In a real app, you would implement pagination logic here
        alert('Next page');
    });
    
    // Make pagination buttons clickable
    document.querySelectorAll('.pagination-btn:not(#prev-page):not(#next-page)').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.pagination-btn.active').classList.remove('active');
            this.classList.add('active');
            // In a real app, you would load the corresponding page
        });
    });
});
