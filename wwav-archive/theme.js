// Theme management system
(function() {
  // Execute immediately
  initThemeSystem();

  function initThemeSystem() {
    // Create and add theme toggle button if it doesn't exist
    ensureThemeToggleExists();
    
    // Apply saved theme preference
    applySavedTheme();
    
    // Set up theme toggle event handler
    setupThemeToggle();
  }
  
  function ensureThemeToggleExists() {
    // Only create if it doesn't exist
    if (!document.getElementById('theme-toggle')) {
      const header = document.querySelector('.main-header');
      if (header) {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle';
        toggleBtn.className = 'theme-toggle';
        toggleBtn.innerHTML = '<span class="theme-icon">☀️</span>';
        header.appendChild(toggleBtn);
      }
    }
  }
  
  function applySavedTheme() {
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    
    // Set default theme class if none exists
    if (!htmlElement.classList.contains('light-theme') && 
        !htmlElement.classList.contains('dark-theme')) {
      htmlElement.classList.add('light-theme');
    }
    
    // Apply saved theme if it exists
    if (savedTheme === 'dark') {
      enableDarkMode();
    }
  }
  
  function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
  }
  
  function toggleTheme() {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains('dark-theme')) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  }
  
  function enableDarkMode() {
    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    
    htmlElement.classList.remove('light-theme');
    htmlElement.classList.add('dark-theme');
    
    if (themeToggle) {
      const themeIcon = themeToggle.querySelector('.theme-icon');
      if (themeIcon) {
        themeIcon.textContent = '🌙';
      }
    }
    
    localStorage.setItem('theme', 'dark');
  }
  
  function disableDarkMode() {
    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    
    htmlElement.classList.remove('dark-theme');
    htmlElement.classList.add('light-theme');
    
    if (themeToggle) {
      const themeIcon = themeToggle.querySelector('.theme-icon');
      if (themeIcon) {
        themeIcon.textContent = '☀️';
      }
    }
    
    localStorage.setItem('theme', 'light');
  }
  
  // Handle DOM content loaded event for initialization
  document.addEventListener('DOMContentLoaded', initThemeSystem);
  
  // Re-initialize theme periodically to handle dynamic DOM changes
  // This ensures theme toggle works even after script.js rebuilds DOM elements
  setInterval(function() {
    ensureThemeToggleExists();
    setupThemeToggle();
  }, 1000);
})();

// Make theme functions available globally
window.themeUtils = {
    initTheme: initThemeSystem
}; 