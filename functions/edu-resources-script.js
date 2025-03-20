document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('app-sidebar');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const uploadResourceBtn = document.getElementById('upload-resource-btn');
    const viewBookmarksBtn = document.getElementById('view-bookmarks-btn');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const resourceSearch = document.getElementById('resource-search');
    const subjectFilter = document.getElementById('subject-filter');
    const courseFilter = document.getElementById('course-filter');
    const typeFilter = document.getElementById('type-filter');
    const accessFilter = document.getElementById('access-filter');
    const sortSelect = document.getElementById('sort-select');
    const resourcesContainer = document.getElementById('resources-container');
    const resourceCount = document.getElementById('resource-count');
    const categoryCards = document.querySelectorAll('.category-card');
    const viewOptions = document.querySelectorAll('.view-option');
    
    // Modals
    const uploadModal = document.getElementById('upload-modal');
    const resourceDetailsModal = document.getElementById('resource-details-modal');
    const bookmarksModal = document.getElementById('bookmarks-modal');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
    const cancelUploadBtn = document.querySelector('.cancel-upload-btn');
    
    // Forms
    const uploadResourceForm = document.getElementById('upload-resource-form');
    const resourceFileInput = document.getElementById('resource-file');
    const filePreview = document.getElementById('file-preview');
    
    // State
    let currentCategory = 'all';
    let currentView = 'grid';
    let resources = [];
    let bookmarkedResources = [];
    let currentUser = {
        id: 1,
        name: 'John Doe',
        role: 'student',
        isPremium: true
    };
    
    // Initialize
    loadResources();
    loadBookmarks();
    
    // Event Listeners
    
    // Menu Toggle
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Theme Toggle
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
    // Category Selection
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            currentCategory = category;
            
            // Update active state
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Filter resources
            filterResources();
        });
    });
    
    // View Options
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            const view = this.dataset.view;
            currentView = view;
            
            // Update active state
            viewOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            // Update view
            updateResourcesView();
        });
    });
    
    // Search & Filters
    resourceSearch.addEventListener('input', filterResources);
    subjectFilter.addEventListener('change', filterResources);
    courseFilter.addEventListener('change', filterResources);
    typeFilter.addEventListener('change', filterResources);
    accessFilter.addEventListener('change', filterResources);
    sortSelect.addEventListener('change', filterResources);
    
    // Reset Filters
    resetFiltersBtn.addEventListener('click', function() {
        resourceSearch.value = '';
        subjectFilter.value = '';
        courseFilter.value = '';
        typeFilter.value = '';
        accessFilter.value = '';
        sortSelect.value = 'newest';
        
        filterResources();
    });
    
    // Modal Open/Close
    uploadResourceBtn.addEventListener('click', function() {
        openModal(uploadModal);
    });
    
    viewBookmarksBtn.addEventListener('click', function() {
        openModal(bookmarksModal);
        renderBookmarks();
    });
    
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            closeModal(modal);
        });
    });
    
    modalOverlays.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    cancelUploadBtn.addEventListener('click', function() {
        closeModal(uploadModal);
    });
    
    // File Upload Preview
    resourceFileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        // Determine file icon based on type
        let fileIcon = 'fa-file';
        if (file.type.includes('image')) fileIcon = 'fa-file-image';
        else if (file.type.includes('pdf')) fileIcon = 'fa-file-pdf';
        else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) fileIcon = 'fa-file-word';
        else if (file.type.includes('powerpoint') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) fileIcon = 'fa-file-powerpoint';
        else if (file.type.includes('video')) fileIcon = 'fa-file-video';
        else if (file.type.includes('audio')) fileIcon = 'fa-file-audio';
        
        // Format file size
        const fileSize = file.size < 1024 * 1024 
            ? `${(file.size / 1024).toFixed(1)} KB` 
            : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        
        fileItem.innerHTML = `
            <i class="fas ${fileIcon} file-icon"></i>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${fileSize}</div>
            </div>
            <button type="button" class="file-remove">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        filePreview.innerHTML = '';
        filePreview.appendChild(fileItem);
        
        // Add event listener to remove button
        fileItem.querySelector('.file-remove').addEventListener('click', function() {
            resourceFileInput.value = '';
            filePreview.innerHTML = '';
        });
    });
    
    // Form Submission
    uploadResourceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real app, you would send the form data to the server
        // For this demo, we'll simulate adding a new resource
        
        const formData = new FormData(this);
        const newResource = {
            id: resources.length + 1,
            title: formData.get('title'),
            subject: formData.get('subject'),
            course: formData.get('course'),
            category: formData.get('category'),
            access: formData.get('access'),
            description: formData.get('description'),
            tags: formData.get('tags').split(',').map(tag => tag.trim()),
            type: getFileType(resourceFileInput.files[0]),
            thumbnail: getResourceThumbnail(formData.get('category'), getFileType(resourceFileInput.files[0])),
            author: currentUser.name,
            date: new Date().toISOString(),
            downloads: 0,
            comments: 0,
            isBookmarked: false
        };
        
        // Add to resources array
        resources.unshift(newResource);
        
        // Update UI
        filterResources();
        
        // Close modal and reset form
        closeModal(uploadModal);
        this.reset();
        filePreview.innerHTML = '';
        
        // Show success message
        showNotification('Resource uploaded successfully!');
    });
    
    // Functions
    
    function loadResources() {
        // In a real app, you would fetch resources from the server
        // For this demo, we'll use sample data
        resources = [
            {
                id: 1,
                title: 'Introduction to Calculus',
                subject: 'mathematics',
                course: 'math201',
                category: 'ebooks',
                access: 'public',
                description: 'A comprehensive introduction to calculus concepts including limits, derivatives, and integrals.',
                tags: ['calculus', 'mathematics', 'derivatives', 'integrals'],
                type: 'pdf',
                thumbnail: 'https://via.placeholder.com/300x160?text=Calculus+Textbook',
                author: 'Prof. Smith',
                date: '2023-01-15T08:00:00Z',
                downloads: 1245,
                comments: 12,
                isBookmarked: false
            },
            {
                id: 2,
                title: 'Data Structures and Algorithms',
                subject: 'computer-science',
                course: 'cs101',
                category: 'lectures',
                access: 'students',
                description: 'Lecture notes covering fundamental data structures and algorithms with examples in Python.',
                tags: ['data structures', 'algorithms', 'python', 'computer science'],
                type: 'pdf',
                thumbnail: 'https://via.placeholder.com/300x160?text=Data+Structures',
                author: 'Dr. Johnson',
                date: '2023-02-10T10:30:00Z',
                downloads: 876,
                comments: 8,
                isBookmarked: true
            },
            {
                id: 3,
                title: 'Quantum Physics Explained',
                subject: 'physics',
                course: 'phys301',
                category: 'videos',
                access: 'premium',
                description: 'Video tutorial explaining quantum physics concepts in an easy-to-understand manner.',
                tags: ['quantum physics', 'physics', 'tutorial'],
                type: 'video',
                thumbnail: 'https://via.placeholder.com/300x160?text=Quantum+Physics+Video',
                author: 'Dr. Feynman',
                date: '2023-03-05T14:15:00Z',
                downloads: 542,
                comments: 15,
                isBookmarked: false
            },
            {
                id: 4,
                title: 'Organic Chemistry Lab Report',
                subject: 'chemistry',
                course: 'chem202',
                category: 'research',
                access: 'staff',
                description: 'Research paper on organic chemistry experiments conducted in the university lab.',
                tags: ['organic chemistry', 'research', 'lab report'],
                type: 'doc',
                thumbnail: 'https://via.placeholder.com/300x160?text=Chemistry+Research',
                author: 'Prof. Williams',
                date: '2023-02-28T09:45:00Z',
                downloads: 321,
                comments: 5,
                isBookmarked: false
            },
            {
                id: 5,
                title: 'Cell Biology Fundamentals',
                subject: 'biology',
                course: 'bio101',
                category: 'ebooks',
                access: 'public',
                description: 'A comprehensive e-book covering the fundamentals of cell biology with detailed illustrations.',
                tags: ['biology', 'cell biology', 'textbook'],
                type: 'pdf',
                thumbnail: 'https://via.placeholder.com/300x160?text=Biology+Textbook',
                author: 'Dr. Garcia',
                date: '2023-01-20T11:00:00Z',
                downloads: 987,
                comments: 10,
                isBookmarked: true
            },
            {
                id: 6,
                title: 'Shakespeare\'s Hamlet Analysis',
                subject: 'literature',
                course: 'lit305',
                category: 'lectures',
                access: 'students',
                description: 'Lecture notes analyzing Shakespeare\'s Hamlet, including themes, characters, and literary devices.',
                tags: ['literature', 'shakespeare', 'hamlet', 'analysis'],
                type: 'pdf',
                thumbnail: 'https://via.placeholder.com/300x160?text=Hamlet+Analysis',
                author: 'Prof. Thompson',
                date: '2023-03-10T13:30:00Z',
                downloads: 456,
                comments: 7,
                isBookmarked: false
            },
            {
                id: 7,
                title: 'World War II: Causes and Effects',
                subject: 'history',
                course: 'hist101',
                category: 'videos',
                access: 'public',
                description: 'Video lecture exploring the causes and effects of World War II with historical footage.',
                tags: ['history', 'world war II', 'lecture'],
                type: 'video',
                thumbnail: 'https://via.placeholder.com/300x160?text=WWII+History',
                author: 'Dr. Adams',
                date: '2023-02-15T15:45:00Z',
                downloads: 789,
                comments: 14,
                isBookmarked: false
            },
            {
                id: 8,
                title: 'Calculus Midterm Exam 2022',
                subject: 'mathematics',
                course: 'math201',
                category: 'exams',
                access: 'students',
                description: 'Past midterm exam for Calculus course with solutions and explanations.',
                tags: ['calculus', 'exam', 'solutions'],
                type: 'pdf',
                thumbnail: 'https://via.placeholder.com/300x160?text=Calculus+Exam',
                author: 'Prof. Smith',
                date: '2023-01-30T10:00:00Z',
                downloads: 1532,
                comments: 18,
                isBookmarked: true
            }
        ];
        
        // Add more sample resources
        for (let i = 9; i <= 24; i++) {
            const categories = ['ebooks', 'lectures', 'videos', 'research', 'exams'];
            const subjects = ['mathematics', 'computer-science', 'physics', 'chemistry', 'biology', 'literature', 'history'];
            const courses = ['cs101', 'math201', 'phys301', 'chem202', 'bio101', 'lit305', 'hist101'];
            const types = ['pdf', 'doc', 'ppt', 'video', 'audio'];
            const access = ['public', 'students', 'premium', 'staff'];
            
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
            const randomCourse = courses[Math.floor(Math.random() * courses.length)];
            const randomType = types[Math.floor(Math.random() * types.length)];
            const randomAccess = access[Math.floor(Math.random() * access.length)];
            
            resources.push({
                id: i,
                title: `Sample Resource ${i}`,
                subject: randomSubject,
                course: randomCourse,
                category: randomCategory,
                access: randomAccess,
                description: `This is a sample resource description for resource ${i}. It provides an overview of the content and what users can expect to learn.`,
                tags: ['sample', randomSubject, randomCategory],
                type: randomType,
                thumbnail: `https://via.placeholder.com/300x160?text=Resource+${i}`,
                author: 'Various Authors',
                date: new Date(2023, 0, i).toISOString(),
                downloads: Math.floor(Math.random() * 1000),
                comments: Math.floor(Math.random() * 20),
                isBookmarked: Math.random() > 0.8
            });
        }
        
        // Initial render
        filterResources();
    }
    
    function loadBookmarks() {
        // In a real app, you would fetch bookmarks from the server
        // For this demo, we'll filter bookmarked resources
        bookmarkedResources = resources.filter(resource => resource.isBookmarked);
    }
    
    function filterResources() {
        let filteredResources = [...resources];
        
        // Filter by category
        if (currentCategory !== 'all') {
            filteredResources = filteredResources.filter(resource => resource.category === currentCategory);
        }
        
        // Filter by search term
        const searchTerm = resourceSearch.value.toLowerCase();
        if (searchTerm) {
            filteredResources = filteredResources.filter(resource => 
                resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm) ||
                resource.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        // Filter by subject
        if (subjectFilter.value) {
            filteredResources = filteredResources.filter(resource => resource.subject === subjectFilter.value);
        }
        
        // Filter by course
        if (courseFilter.value) {
            filteredResources = filteredResources.filter(resource => resource.course === courseFilter.value);
        }
        
        // Filter by type
        if (typeFilter.value) {
            filteredResources = filteredResources.filter(resource => resource.type === typeFilter.value);
        }
        
        // Filter by access
        if (accessFilter.value) {
            filteredResources = filteredResources.filter(resource => resource.access === accessFilter.value);
        }
        
        // Sort resources
        const sortValue = sortSelect.value;
        switch (sortValue) {
            case 'newest':
                filteredResources.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                filteredResources.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'name-asc':
                filteredResources.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                filteredResources.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'popular':
                filteredResources.sort((a, b) => b.downloads - a.downloads);
                break;
        }
        
        // Update resource count
        resourceCount.textContent = `(${filteredResources.length})`;
        
        // Render resources
        renderResources(filteredResources);
    }
    
    function renderResources(resources) {
        resourcesContainer.innerHTML = '';
        
        if (resources.length === 0) {
            resourcesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No resources found</h3>
                    <p>Try adjusting your filters or search terms to find what you're looking for.</p>
                </div>
            `;
            return;
        }
        
        // Change container class based on view
        resourcesContainer.className = currentView === 'grid' ? 'resources-grid' : 'resources-list';
        
        resources.forEach(resource => {
            if (currentView === 'grid') {
                renderGridItem(resource);
            } else {
                renderListItem(resource);
            }
        });
        
        // Add event listeners to resource cards
        document.querySelectorAll('.resource-card, .resource-list-item').forEach(card => {
            card.addEventListener('click', function(e) {
                // Don't open details if clicking on action buttons
                if (e.target.closest('.resource-action-btn') || e.target.closest('.resource-actions')) {
                    return;
                }
                
                const resourceId = parseInt(this.dataset.id);
                const resource = resources.find(r => r.id === resourceId);
                
                if (resource) {
                    openResourceDetails(resource);
                }
            });
        });
        
        // Add event listeners to bookmark buttons
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const resourceId = parseInt(this.closest('[data-id]').dataset.id);
                toggleBookmark(resourceId);
            });
        });
    }
    
    function renderGridItem(resource) {
        const resourceCard = document.createElement('div');
        resourceCard.className = 'resource-card';
        resourceCard.dataset.id = resource.id;
        
        // Check if user has access
        const hasAccess = checkAccess(resource.access);
        
        resourceCard.innerHTML = `
            <div class="resource-thumbnail">
                <img src="${resource.thumbnail}" alt="${resource.title}">
                <span class="resource-type">${getTypeLabel(resource.type)}</span>
                ${resource.access !== 'public' ? `<span class="resource-access ${resource.access}">${getAccessLabel(resource.access)}</span>` : ''}
            </div>
            <div class="resource-content">
                <h3 class="resource-title">${resource.title}</h3>
                <div class="resource-meta">
                    <div class="resource-meta-item">
                        <i class="fas fa-book"></i> ${getSubjectLabel(resource.subject)}
                    </div>
                    <div class="resource-meta-item">
                        <i class="fas fa-graduation-cap"></i> ${resource.course.toUpperCase()}
                    </div>
                </div>
                <p class="resource-description">${resource.description}</p>
                <div class="resource-footer">
                    <div class="resource-stats">
                        <div class="resource-stat">
                            <i class="fas fa-download"></i> ${resource.downloads}
                        </div>
                        <div class="resource-stat">
                            <i class="fas fa-comment"></i> ${resource.comments}
                        </div>
                    </div>
                    <div class="resource-actions">
                        <button class="resource-action-btn bookmark-btn ${resource.isBookmarked ? 'bookmarked' : ''}" title="Bookmark">
                            <i class="${resource.isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>
                        </button>
                        ${hasAccess ? `
                            <button class="resource-action-btn" title="Download">
                                <i class="fas fa-download"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        resourcesContainer.appendChild(resourceCard);
    }
    
    function renderListItem(resource) {
        const resourceItem = document.createElement('div');
        resourceItem.className = 'resource-list-item';
        resourceItem.dataset.id = resource.id;
        
        // Check if user has access
        const hasAccess = checkAccess(resource.access);
        
        resourceItem.innerHTML = `
            <div class="resource-list-thumbnail">
                <img src="${resource.thumbnail}" alt="${resource.title}">
                <span class="resource-type">${getTypeLabel(resource.type)}</span>
                ${resource.access !== 'public' ? `<span class="resource-access ${resource.access}">${getAccessLabel(resource.access)}</span>` : ''}
            </div>
            <div class="resource-list-content">
                <div class="resource-list-header">
                    <h3 class="resource-list-title">${resource.title}</h3>
                    <div class="resource-actions">
                        <button class="resource-action-btn bookmark-btn ${resource.isBookmarked ? 'bookmarked' : ''}" title="Bookmark">
                            <i class="${resource.isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>
                        </button>
                        ${hasAccess ? `
                            <button class="resource-action-btn" title="Download">
                                <i class="fas fa-download"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                <div class="resource-list-meta">
                    <div class="resource-meta-item">
                        <i class="fas fa-book"></i> ${getSubjectLabel(resource.subject)}
                    </div>
                    <div class="resource-meta-item">
                        <i class="fas fa-graduation-cap"></i> ${resource.course.toUpperCase()}
                    </div>
                    <div class="resource-meta-item">
                        <i class="fas fa-user"></i> ${resource.author}
                    </div>
                    <div class="resource-meta-item">
                        <i class="fas fa-calendar"></i> ${formatDate(resource.date)}
                    </div>
                </div>
                <p class="resource-list-description">${resource.description}</p>
                <div class="resource-list-footer">
                    <div class="resource-stats">
                        <div class="resource-stat">
                            <i class="fas fa-download"></i> ${resource.downloads}
                        </div>
                        <div class="resource-stat">
                            <i class="fas fa-comment"></i> ${resource.comments}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        resourcesContainer.appendChild(resourceItem);
    }
    
    function renderBookmarks() {
        const bookmarksContainer = document.getElementById('bookmarks-container');
        bookmarksContainer.innerHTML = '';
        
        // Refresh bookmarks
        bookmarkedResources = resources.filter(resource => resource.isBookmarked);
        
        if (bookmarkedResources.length === 0) {
            bookmarksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="far fa-bookmark"></i>
                    <h3>No bookmarked resources</h3>
                    <p>You haven't bookmarked any resources yet. Browse the resources and bookmark the ones you want to save for later.</p>
                </div>
            `;
            return;
        }
        
        bookmarkedResources.forEach(resource => {
            const bookmarkItem = document.createElement('div');
            bookmarkItem.className = 'bookmark-item';
            bookmarkItem.dataset.id = resource.id;
            
            bookmarkItem.innerHTML = `
                <div class="bookmark-thumbnail">
                    <img src="${resource.thumbnail}" alt="${resource.title}">
                </div>
                <div class="bookmark-content">
                    <div class="bookmark-info">
                        <h3 class="bookmark-title">${resource.title}</h3>
                        <div class="bookmark-meta">
                            ${getTypeLabel(resource.type)} • ${getSubjectLabel(resource.subject)} • ${resource.course.toUpperCase()}
                        </div>
                    </div>
                    <div class="bookmark-actions">
                        <button class="bookmark-action-btn view-btn" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="bookmark-action-btn remove-bookmark-btn" title="Remove Bookmark">
                            <i class="fas fa-bookmark"></i>
                        </button>
                    </div>
                </div>
            `;
            
            bookmarksContainer.appendChild(bookmarkItem);
            
            // Add event listeners
            bookmarkItem.querySelector('.view-btn').addEventListener('click', function() {
                closeModal(bookmarksModal);
                openResourceDetails(resource);
            });
            
            bookmarkItem.querySelector('.remove-bookmark-btn').addEventListener('click', function() {
                toggleBookmark(resource.id);
                renderBookmarks();
            });
        });
    }
    
    function openResourceDetails(resource) {
        // Set resource details
        document.getElementById('detail-resource-title').textContent = resource.title;
        document.getElementById('detail-category').textContent = getResourceCategoryLabel(resource.category);
        document.getElementById('detail-subject').textContent = getSubjectLabel(resource.subject);
        document.getElementById('detail-course').textContent = resource.course.toUpperCase();
        document.getElementById('detail-type').textContent = getTypeLabel(resource.type);
        document.getElementById('detail-size').textContent = '2.4 MB'; // Placeholder
        document.getElementById('detail-author').textContent = resource.author;
        document.getElementById('detail-date').textContent = formatDate(resource.date);
        document.getElementById('detail-downloads').textContent = resource.downloads.toLocaleString();
        document.getElementById('detail-description').textContent = resource.description;
        
        // Set tags
        const tagsContainer = document.getElementById('detail-tags');
        tagsContainer.innerHTML = '';
        resource.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        // Set resource preview
        const resourcePreview = document.getElementById('resource-preview');
        resourcePreview.innerHTML = '';
        
        if (resource.type === 'pdf') {
            resourcePreview.innerHTML = `
                <iframe src="https://docs.google.com/viewer?url=https://example.com/sample.pdf&embedded=true" width="100%" height="400px" frameborder="0"></iframe>
            `;
        } else if (resource.type === 'video') {
            resourcePreview.innerHTML = `
                <iframe width="100%" height="400" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
        } else {
            resourcePreview.innerHTML = `
                <img src="${resource.thumbnail}" alt="${resource.title}">
            `;
        }
        
        // Set bookmark button state
        const bookmarkBtn = document.getElementById('bookmark-resource-btn');
        if (resource.isBookmarked) {
            bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked';
            bookmarkBtn.classList.add('bookmarked');
        } else {
            bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i> Bookmark';
            bookmarkBtn.classList.remove('bookmarked');
        }
        
        // Add event listener to bookmark button
        bookmarkBtn.addEventListener('click', function() {
            toggleBookmark(resource.id);
            
            if (resource.isBookmarked) {
                this.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked';
                this.classList.add('bookmarked');
            } else {
                this.innerHTML = '<i class="far fa-bookmark"></i> Bookmark';
                this.classList.remove('bookmarked');
            }
        });
        
        // Add event listener to download button
        document.getElementById('download-resource-btn').addEventListener('click', function() {
            // In a real app, you would initiate a download
            // For this demo, we'll just increment the download count
            resource.downloads++;
            document.getElementById('detail-downloads').textContent = resource.downloads.toLocaleString();
            
            // Update the resource in the list
            filterResources();
            
            showNotification('Download started!');
        });
        
        // Add event listener to share button
        document.getElementById('share-resource-btn').addEventListener('click', function() {
            // In a real app, you would show sharing options
            // For this demo, we'll just show a notification
            showNotification('Sharing options would appear here!');
        });
        
        // Load comments
        loadComments(resource.id);
        
        // Open modal
        openModal(resourceDetailsModal);
    }
    
    function loadComments(resourceId) {
        // In a real app, you would fetch comments from the server
        // For this demo, we'll use sample data
        const comments = [
            {
                id: 1,
                author: 'Jane Smith',
                avatar: 'https://via.placeholder.com/40',
                date: '2023-03-10T14:30:00Z',
                text: 'This resource was incredibly helpful for my research project. Thank you for sharing!',
                likes: 5
            },
            {
                id: 2,
                author: 'Michael Brown',
                avatar: 'https://via.placeholder.com/40',
                date: '2023-03-09T10:15:00Z',
                text: 'Could you provide more examples for the concepts covered in chapter 3? I\'m having trouble understanding them.',
                likes: 2
            },
            {
                id: 3,
                author: 'Sarah Johnson',
                avatar: 'https://via.placeholder.com/40',
                date: '2023-03-08T16:45:00Z',
                text: 'The explanations are clear and concise. I especially appreciated the diagrams that helped visualize the concepts.',
                likes: 8
            }
        ];
        
        const discussionContainer = document.getElementById('discussion-container');
        discussionContainer.innerHTML = '';
        
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            
            commentElement.innerHTML = `
                <div class="comment-avatar">
                    <img src="${comment.avatar}" alt="${comment.author}">
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${formatDate(comment.date)}</span>
                    </div>
                    <p class="comment-text">${comment.text}</p>
                    <div class="comment-actions">
                        <span class="comment-action">
                            <i class="far fa-thumbs-up"></i> Like (${comment.likes})
                        </span>
                        <span class="comment-action">
                            <i class="far fa-comment"></i> Reply
                        </span>
                    </div>
                </div>
            `;
            
            discussionContainer.appendChild(commentElement);
        });
    }
    
    function toggleBookmark(resourceId) {
        const resource = resources.find(r => r.id === resourceId);
        if (resource) {
            resource.isBookmarked = !resource.isBookmarked;
            
            // Update bookmarks
            if (resource.isBookmarked) {
                bookmarkedResources.push(resource);
                showNotification('Resource bookmarked!');
            } else {
                bookmarkedResources = bookmarkedResources.filter(r => r.id !== resourceId);
                showNotification('Bookmark removed!');
            }
            
            // Update UI
            filterResources();
        }
    }
    
    function updateResourcesView() {
        // Change container class based on view
        resourcesContainer.className = currentView === 'grid' ? 'resources-grid' : 'resources-list';
        
        // Re-render resources
        filterResources();
    }
    
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Add event listener to close button
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.remove();
        });
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Helper Functions
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    
    function getTypeLabel(type) {
        switch (type) {
            case 'pdf': return 'PDF';
            case 'doc': return 'DOC';
            case 'ppt': return 'PPT';
            case 'video': return 'Video';
            case 'audio': return 'Audio';
            case 'image': return 'Image';
            default: return type.toUpperCase();
        }
    }
    
    function getSubjectLabel(subject) {
        switch (subject) {
            case 'mathematics': return 'Mathematics';
            case 'computer-science': return 'Computer Science';
            case 'physics': return 'Physics';
            case 'chemistry': return 'Chemistry';
            case 'biology': return 'Biology';
            case 'literature': return 'Literature';
            case 'history': return 'History';
            default: return subject.charAt(0).toUpperCase() + subject.slice(1);
        }
    }
    
    function getResourceCategoryLabel(category) {
        switch (category) {
            case 'ebooks': return 'E-Books';
            case 'lectures': return 'Lecture Notes';
            case 'videos': return 'Video Tutorials';
            case 'research': return 'Research Papers';
            case 'exams': return 'Past Exams';
            default: return category.charAt(0).toUpperCase() + category.slice(1);
        }
    }
    
    function getAccessLabel(access) {
        switch (access) {
            case 'public': return 'Public';
            case 'students': return 'Students';
            case 'premium': return 'Premium';
            case 'staff': return 'Staff Only';
            default: return access.charAt(0).toUpperCase() + access.slice(1);
        }
    }
    
    function checkAccess(accessLevel) {
        // Check if current user has access to the resource
        switch (accessLevel) {
            case 'public':
                return true;
            case 'students':
                return currentUser.role === 'student' || currentUser.role === 'staff';
            case 'premium':
                return currentUser.isPremium || currentUser.role === 'staff';
            case 'staff':
                return currentUser.role === 'staff';
            default:
                return false;
        }
    }
    
    function getFileType(file) {
        if (!file) return 'pdf'; // Default
        
        if (file.type.includes('pdf')) return 'pdf';
        if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) return 'doc';
        if (file.type.includes('powerpoint') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) return 'ppt';
        if (file.type.includes('video')) return 'video';
        if (file.type.includes('audio')) return 'audio';
        if (file.type.includes('image')) return 'image';
        
        return 'pdf'; // Default
    }
    
    function getResourceThumbnail(category, type) {
        // Generate a placeholder thumbnail based on category and type
        let text = '';
        
        switch (category) {
            case 'ebooks':
                text = 'E-Book';
                break;
            case 'lectures':
                text = 'Lecture';
                break;
            case 'videos':
                text = 'Video';
                break;
            case 'research':
                text = 'Research';
                break;
            case 'exams':
                text = 'Exam';
                break;
            default:
                text = 'Resource';
        }
        
        return `https://via.placeholder.com/300x160?text=${text}+${type.toUpperCase()}`;
    }
});

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--card-color);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        padding: var(--spacing-md) var(--spacing-lg);
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 2000;
        min-width: 300px;
        border-left: 4px solid var(--primary-color);
        animation: slideIn 0.3s ease;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }
    
    .notification-content i {
        color: var(--primary-color);
        font-size: 1.25rem;
    }
    
    .notification-close {
        background: transparent;
        border: none;
        color: var(--text-tertiary);
        cursor: pointer;
        font-size: 0.875rem;
        padding: var(--spacing-xs);
        border-radius: var(--border-radius-sm);
        transition: color 0.2s ease, background-color 0.2s ease;
    }
    
    .notification-close:hover {
        color: var(--text-primary);
        background-color: var(--surface-color);
    }
    
    .notification.fade-out {
        opacity: 0;
        transform: translateX(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;

document.head.appendChild(style);