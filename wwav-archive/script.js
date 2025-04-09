// File data using audio files from the audio directory
const FILES_DATA = [
  { name: "tokyo taxi cab", type: "audio", src: "audio/tokyo taxi cab.m4a" },
  { name: "Mission", type: "audio", src: "audio/Mission.mp3" },
  { name: "bushwick", type: "audio", src: "audio/bushwick.m4a" },
  { name: "Micheals Body", type: "audio", src: "audio/Micheals Body.mp3" },
  { name: "White Party", type: "audio", src: "audio/White Party.mp3" },
  { name: "Free?", type: "audio", src: "audio/Free?.mp3" },
  { name: "camp jewell ymca", type: "audio", src: "audio/camp jewell ymca.mp3" },
  { name: "Resurrected", type: "audio", src: "audio/Resurrected.m4a" }
];

// Cache DOM elements to avoid repeated queries
const DOM = {
  mainWindow: document.querySelector('.main-window'),
  contentWindow: document.getElementById('content-window'),
  content: document.querySelector('.content-window .content'),
  closeBtn: document.querySelector('.close-btn'),
  categories: document.querySelectorAll('.category')
};

// Determine media type by file extension
function getMimeType(src) {
  const ext = src.split('.').pop().toLowerCase();
  const mimeTypes = {
    'mp3': 'audio/mpeg',
    'm4a': 'audio/mp4',
    'wav': 'audio/wav',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'mp4': 'video/mp4',
    'mov': 'video/quicktime'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Create file elements using document fragment for better performance
function populateFiles(files) {
  // Clear main window
  DOM.mainWindow.innerHTML = '';
  
  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();
  
  files.forEach(file => {
    const fileElement = document.createElement('div');
    fileElement.className = 'file';
    fileElement.dataset.type = file.type;
    fileElement.dataset.src = file.src;
    fileElement.textContent = file.name;
    
    fragment.appendChild(fileElement);
  });
  
  // Append all elements at once
  DOM.mainWindow.appendChild(fragment);
  
  // Add event delegation instead of individual listeners
  addFileEventListeners();
}

// Use event delegation for file clicks
function addFileEventListeners() {
  // Remove existing listener if any
  DOM.mainWindow.removeEventListener('click', handleFileClick);
  // Add single event listener using delegation
  DOM.mainWindow.addEventListener('click', handleFileClick);
}

// Handle file click with event delegation
function handleFileClick(e) {
  const fileElement = e.target.closest('.file');
  if (!fileElement) return;
  
  const type = fileElement.dataset.type;
  const src = fileElement.dataset.src;
  
  // Clear content first (better performance)
  DOM.content.innerHTML = '';
  
  try {
    if (type === 'film') {
      DOM.content.innerHTML = `<video controls width="100%"><source src="${src}" type="${getMimeType(src)}"></video>`;
    } else if (type === 'audio') {
      DOM.content.innerHTML = `<audio controls style="width: 100%"><source src="${src}" type="${getMimeType(src)}"></audio>`;
    } else if (type === 'image') {
      const img = document.createElement('img');
      img.src = src;
      img.style.width = '100%';
      img.style.cursor = 'zoom-in';
      img.onclick = function() {
        this.style.transform = this.style.transform === 'scale(2)' ? 'scale(1)' : 'scale(2)';
      };
      DOM.content.appendChild(img);
    }
    
    DOM.contentWindow.style.display = 'block';
  } catch (error) {
    console.error('Error displaying file:', error);
    DOM.content.innerHTML = `<div class="error">Error loading file: ${error.message}</div>`;
  }
}

// Set up category filtering with event delegation
function setupCategoryFilters() {
  const sidebar = document.querySelector('.sidebar ul');
  
  // Use event delegation
  sidebar.addEventListener('click', (e) => {
    const category = e.target.closest('.category');
    if (!category) return;
    
    const selectedCategory = category.dataset.category;
    
    // Update selected state
    DOM.categories.forEach(cat => cat.classList.remove('selected'));
    category.classList.add('selected');
    
    // Filter and display files
    const filteredFiles = selectedCategory === 'all' ? 
      FILES_DATA : 
      FILES_DATA.filter(file => file.type === selectedCategory);
    
    populateFiles(filteredFiles);
  });
}

// Initialize the application
function init() {
  // Add 'All' category if it doesn't exist
  if (!document.querySelector('.category[data-category="all"]')) {
    const sidebar = document.querySelector('.sidebar ul');
    const allCategory = document.createElement('li');
    allCategory.className = 'category selected';
    allCategory.dataset.category = 'all';
    allCategory.textContent = 'All Files';
    sidebar.insertBefore(allCategory, sidebar.firstChild);
    
    // Update DOM cache
    DOM.categories = document.querySelectorAll('.category');
  }
  
  // Set up close button
  DOM.closeBtn.addEventListener('click', () => {
    DOM.contentWindow.style.display = 'none';
    // Use timeout to make the transition smoother
    setTimeout(() => { DOM.content.innerHTML = ''; }, 300);
  });
  
  // Add keyboard support for ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.contentWindow.style.display === 'block') {
      DOM.contentWindow.style.display = 'none';
      setTimeout(() => { DOM.content.innerHTML = ''; }, 300);
    }
  });
  
  // Set up category filters
  setupCategoryFilters();
  
  // Initial population of files
  populateFiles(FILES_DATA);
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init(); // DOM already loaded
}