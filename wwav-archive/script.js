// Mock file data using actual files from the dance tto death 1 directory
const mockFiles = [
  { name: "tokyo taxi cab", type: "audio", src: "dance tto death 1/tokyo taxi cab.m4a" },
  { name: "Mission", type: "audio", src: "dance tto death 1/Mission.mp3" },
  { name: "bushwick", type: "audio", src: "dance tto death 1/bushwick.m4a" },
  { name: "Micheals Body", type: "audio", src: "dance tto death 1/Micheals Body.mp3" },
  { name: "White Party", type: "audio", src: "dance tto death 1/White Party.mp3" },
  { name: "Free?", type: "audio", src: "dance tto death 1/Free?.mp3" },
  { name: "camp jewell ymca", type: "audio", src: "dance tto death 1/camp jewell ymca.mp3" },
  { name: "Resurrected", type: "audio", src: "dance tto death 1/Resurrected.m4a" }
];

// Function to populate files in the UI
function populateFiles(files) {
  const mainWindow = document.querySelector('.main-window');
  
  // Clear existing files
  mainWindow.innerHTML = '';
  
  // Add files to the UI
  files.forEach(file => {
    const fileElement = document.createElement('div');
    fileElement.className = 'file';
    fileElement.setAttribute('data-type', file.type);
    fileElement.setAttribute('data-src', file.src);
    fileElement.textContent = file.name;
    
    mainWindow.appendChild(fileElement);
  });
  
  // Add click event listeners to the newly created files
  setupFileClickHandlers();
}

// Function to set up click handlers for files
function setupFileClickHandlers() {
  const files = document.querySelectorAll('.file');
  const contentWindow = document.getElementById('content-window');
  const content = contentWindow.querySelector('.content');
  
  files.forEach(file => {
    file.addEventListener('click', () => {
      const type = file.getAttribute('data-type');
      const src = file.getAttribute('data-src');
      
      if (type === 'film') {
        content.innerHTML = `<video controls width="100%"><source src="${src}" type="video/mp4"></video>`;
      } else if (type === 'audio') {
        // Handle both mp3 and m4a formats
        const fileExtension = src.split('.').pop().toLowerCase();
        const mimeType = fileExtension === 'mp3' ? 'audio/mpeg' : 'audio/mp4';
        content.innerHTML = `<audio controls style="width: 100%"><source src="${src}" type="${mimeType}"></audio>`;
      } else if (type === 'image') {
        content.innerHTML = `<img src="${src}" style="width: 100%; cursor: zoom-in;" onclick="this.style.transform = this.style.transform === 'scale(2)' ? 'scale(1)' : 'scale(2)';">`;
      }
      
      contentWindow.style.display = 'block';
    });
  });
}

// Setup category filtering
function setupCategoryFilters() {
  const categories = document.querySelectorAll('.category');
  
  categories.forEach(category => {
    category.addEventListener('click', () => {
      const selectedCategory = category.getAttribute('data-category');
      
      // Visual feedback - add selected class
      categories.forEach(cat => cat.classList.remove('selected'));
      category.classList.add('selected');
      
      if (selectedCategory === 'all') {
        // Show all files
        populateFiles(mockFiles);
      } else {
        // Filter files by category
        const filteredFiles = mockFiles.filter(file => file.type === selectedCategory);
        populateFiles(filteredFiles);
      }
    });
  });
}

// Close content window
function setupCloseButton() {
  const contentWindow = document.getElementById('content-window');
  const content = contentWindow.querySelector('.content');
  const closeBtn = contentWindow.querySelector('.close-btn');
  
  closeBtn.addEventListener('click', () => {
    contentWindow.style.display = 'none';
    content.innerHTML = '';
  });
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Add 'All' category to sidebar
  const sidebar = document.querySelector('.sidebar ul');
  const allCategory = document.createElement('li');
  allCategory.className = 'category selected';
  allCategory.setAttribute('data-category', 'all');
  allCategory.textContent = 'All Files';
  sidebar.insertBefore(allCategory, sidebar.firstChild);
  
  // Populate files
  populateFiles(mockFiles);
  
  // Setup filters
  setupCategoryFilters();
  
  // Setup close button
  setupCloseButton();
});