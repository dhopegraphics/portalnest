/**
 * PortalNest Loader
 * A customizable loading animation overlay using the PortalNest logo
 */
(function() {
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
    
      // Configuration object with default values
      const config = {
        animationSpeed: 1.5, // in seconds
        darkMode: false,
        logoSize: 100, // in pixels
        overlayColor: 'rgba(255, 255, 255, 0.8)',
        darkOverlayColor: 'rgba(0, 0, 0, 0.8)',
        textColor: '#333',
        darkTextColor: '#fff',
        logoPath: '/assets/logo/portalnest-Variation-Logo.png' // Default logo path
      };

        // Check if the loader HTML exists, if not, create it
        if (!document.getElementById('portalnest-loader')) {
          createLoaderHTML();
        }
        
      
      // Get loader elements
      const loader = document.getElementById('portalnest-loader');
      const logo = loader.querySelector('.portalnest-logo');
      const root = document.documentElement;
      
      // Apply initial configuration
      updateStyles();
      
      // Global PortalNestLoader object with public methods
      window.PortalNestLoader = {
        /**
         * Show the loader overlay
         */
        show: function() {
          loader.style.display = 'flex';
        },
        
        /**
         * Hide the loader overlay
         */
        hide: function() {
          loader.style.display = 'none';
        },
        
        /**
         * Toggle dark mode on/off
         * @param {boolean} [isDark] - Force specific mode, or toggle if not provided
         */
        toggleDarkMode: function(isDark) {
          if (typeof isDark !== 'undefined') {
            config.darkMode = isDark;
          } else {
            config.darkMode = !config.darkMode;
          }
          
          if (config.darkMode) {
            loader.classList.add('dark-mode');
          } else {
            loader.classList.remove('dark-mode');
          }
          
          updateStyles();
        },
        
        /**
         * Set animation speed
         * @param {number} speed - Animation speed in seconds
         */
        setAnimationSpeed: function(speed) {
          config.animationSpeed = parseFloat(speed);
          updateStyles();
        },
        
        /**
         * Set logo size
         * @param {number} size - Logo size in pixels
         */
        setLogoSize: function(size) {
          config.logoSize = parseInt(size);
          updateStyles();
        },
        
        /**
         * Set overlay color
         * @param {string} color - CSS color value for the overlay
         * @param {string} [darkColor] - CSS color value for dark mode
         */
        setOverlayColor: function(color, darkColor) {
          config.overlayColor = color;
          if (darkColor) {
            config.darkOverlayColor = darkColor;
          }
          updateStyles();
        },
        
        /**
         * Set custom loading text
         * @param {string} text - Text to display
         */
        setText: function(text) {
          const textElement = loader.querySelector('.portalnest-loader-text');
          textElement.textContent = text;
        },
        
        /**
         * Set logo path
         * @param {string} path - Path to the logo image
         */
        setLogoPath: function(path) {
          config.logoPath = path;
          logo.src = path;
        }
      };
      
      /**
       * Update CSS variables based on current configuration
       */
      function updateStyles() {
        root.style.setProperty('--animation-speed', config.animationSpeed + 's');
        root.style.setProperty('--logo-size', config.logoSize + 'px');
        root.style.setProperty('--overlay-color', config.darkMode ? config.darkOverlayColor : config.overlayColor);
        root.style.setProperty('--text-color', config.darkMode ? config.darkTextColor : config.textColor);
      }
      
      /**
       * Create the loader HTML and append it to the body
       */
      function createLoaderHTML() {
        const loaderHTML = `
          <div id="portalnest-loader" class="portalnest-loader-overlay" role="alert" aria-busy="true" aria-label="Loading content">
            <div class="portalnest-loader-container">
              <div class="portalnest-logo-wrapper">
                <img src="${config.logoPath}" alt="PortalNest Loading" class="portalnest-logo">
              </div>
              <div class="portalnest-loader-text">Loading...</div>
            </div>
          </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loaderHTML);
      }
      
      // Hide loader by default
      loader.style.display = 'none';
    });
  })();