// Search functionality
document.getElementById('searchBtn').addEventListener('click', function() {
    const schoolType = document.getElementById('schoolType').value;
    const location = document.getElementById('location').value;
    
    alert(`Searching for ${schoolType} schools in ${location}`);
});

// Distance slider functionality
const distanceSlider = document.getElementById('distance');
distanceSlider.addEventListener('input', function() {
    // Update any UI elements that should reflect the distance value
    console.log(`Distance set to: ${this.value}km`);
});

// Checkbox event listeners
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const category = this.name;
        const value = this.value;
        const isChecked = this.checked;
        
        console.log(`${category} filter: ${value} is ${isChecked ? 'checked' : 'unchecked'}`);
        // Add filter logic here
    });
});

// Call button functionality
document.querySelectorAll('.call-btn').forEach(button => {
    button.addEventListener('click', function() {
        alert('Connecting to school...');
    });
});

// View school button functionality
document.querySelectorAll('.view-btn').forEach(button => {
    button.addEventListener('click', function() {
        alert('Opening school details...');
    });
});