
function setActiveTab() {
    const navLinks = document.querySelectorAll(".btn__navigate");
    const currentPage = window.location.pathname;

    navLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;

        if (linkPath === currentPage) {
            document.querySelector(".btn__navigate.active")?.classList.remove("active");
            link.classList.add("active");
        }
    });
}

function loadSidebarAndHeader() {
    fetch("/components/admin-dashboard-sideandtopbar.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
        })
        .then(() => {
            setActiveTab(); // Set active tab after loading sidebar
            initializeSidebarLogic(); // Initialize sidebar toggle logic after loading
        })
        .catch(error => console.error("Error loading sidebar-header:", error));
}

function initializeSidebarLogic() {
    const sidebar = document.querySelector(".navigation");
    const mainHeader = document.querySelector(".main__header");
    const sliderBtn = document.getElementById("slider_btn");
    const mainContent  = document.querySelector(".overall__main");
    const theCardFit_container = document.querySelector(".admission_scroll")
    const body = document.body;

    if (!sidebar || !mainHeader || !sliderBtn) {
        console.error("Sidebar or header elements not found!");
        return;
    }

    function adjustHeader() {
        if (body.classList.contains("sidebar-hidden")) {
            mainHeader.style.position = "fixed"; // Ensure positioning
            mainHeader.style.width = "100vw"; // Full width
            mainHeader.style.left = "0"; // Align to left
            mainContent.style.marginLeft = "0"; // Align to right
            theCardFit_container.style.width = "86%"

            
        } else {
          const sidebarWidth = sidebar.offsetWidth;
            mainHeader.style.position = "fixed"; // Remove from normal flow
            mainHeader.style.width = `calc(100vw - ${sidebarWidth}px)`; // Adjust width
            mainHeader.style.left = `${sidebarWidth}px`; // Push main header right
            mainHeader.style.right = "0"; // Reset rig
            mainContent.style.marginLeft = `${sidebarWidth}px`;
             theCardFit_container.style.width = "887px"

        }
    }

    sliderBtn.addEventListener("click", function () {
        body.classList.toggle("sidebar-hidden");
        adjustHeader();
    });

    adjustHeader(); // Set initial state
}

document.addEventListener("DOMContentLoaded", loadSidebarAndHeader);




