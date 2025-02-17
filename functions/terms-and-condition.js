document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.querySelector('.main-content');
    const acceptButton = document.querySelector('.btn-accept');
    const declineButton = document.querySelector('.btn-decline');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    // Track scroll position to enable accept button
    mainContent.addEventListener('scroll', function() {
        const isAtBottom = mainContent.scrollHeight - mainContent.scrollTop <= mainContent.clientHeight + 100;
        if (isAtBottom) {
            acceptButton.disabled = false;
        }
    });

    // Handle sidebar item clicks
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Scroll to corresponding section
            const sectionTitle = this.textContent.split('. ')[1];
            const section = Array.from(document.querySelectorAll('.section-title'))
                .find(title => title.textContent.includes(sectionTitle));
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Handle button clicks
    acceptButton.addEventListener('click', () => {
        alert('Terms accepted!');
    });

    declineButton.addEventListener('click', () => {
        alert('Terms declined!');
    });
});


class SpecialTermsAndCondition extends HTMLElement {
    connectedCallback() {
      fetch("/components/Previews-T&C.html") // Load Footer from file
        .then(response => response.text())
        .then(data => {
          this.innerHTML = data;
        })
        .catch(error => console.error("Error loading Footer:", error));
    }
  }

  customElements.define("special-terms-conditions", SpecialTermsAndCondition);