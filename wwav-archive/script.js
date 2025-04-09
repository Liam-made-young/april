// File data using files from audio, films, and images directories
const FILES_DATA = [
  // Audio files
  { name: "tokyo taxi cab", type: "audio", src: "audio/tokyo taxi cab.m4a" },
  { name: "Mission", type: "audio", src: "audio/Mission.mp3" },
  { name: "bushwick", type: "audio", src: "audio/bushwick.m4a" },
  { name: "Micheals Body", type: "audio", src: "audio/Micheals Body.mp3" },
  { name: "White Party", type: "audio", src: "audio/White Party.mp3" },
  { name: "Free?", type: "audio", src: "audio/Free?.mp3" },
  { name: "camp jewell ymca", type: "audio", src: "audio/camp jewell ymca.mp3" },
  { name: "Resurrected", type: "audio", src: "audio/Resurrected.m4a" },
  
  // Film files
  { name: "Screen Recording", type: "film", src: "films/ScreenRecording_01-02-2025 02-34-14_1.mp4" },
  
  // Image files
  { name: "Photo", type: "image", src: "images/381B29C6-F186-40BF-A29B-883F121222ED_1_105_c.jpeg" }
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

// Updated draggable popup function
function makePopupDraggable() {
  const popup = DOM.contentWindow;
  const content = DOM.content;
  
  // Create a title bar for dragging
  const titleBar = document.createElement('div');
  titleBar.className = 'popup-titlebar';
  titleBar.innerHTML = '<span class="popup-title">Media Viewer</span>';
  
  // Reposition close button to be inside title bar
  DOM.closeBtn.remove(); // Remove from current position
  titleBar.appendChild(DOM.closeBtn);
  
  // Insert title bar at the beginning of popup
  popup.insertBefore(titleBar, popup.firstChild);
  
  // Variables for drag state
  let isDragging = false;
  let offsetX, offsetY;
  
  // Mouse down on title bar starts drag
  titleBar.addEventListener('mousedown', startDrag);
  
  function startDrag(e) {
    // Ignore if it's the close button
    if (e.target === DOM.closeBtn) return;
    
    isDragging = true;
    
    // Get current position and compute real coordinates
    const rect = popup.getBoundingClientRect();
    
    // Fix initial position to current visual position
    popup.style.top = rect.top + 'px';
    popup.style.left = rect.left + 'px';
    popup.style.transform = 'none'; // Remove centering transform
    
    // Calculate offset within the titlebar
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    // Add event listeners for drag and end
    document.addEventListener('mousemove', dragPopup);
    document.addEventListener('mouseup', stopDrag);
    
    // Prevent default behavior and text selection
    e.preventDefault();
  }
  
  function dragPopup(e) {
    if (!isDragging) return;
    
    // Calculate new position
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    
    // Update position - use direct top/left instead of transform
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    
    e.preventDefault();
  }
  
  function stopDrag() {
    isDragging = false;
    
    // Remove event listeners
    document.removeEventListener('mousemove', dragPopup);
    document.removeEventListener('mouseup', stopDrag);
  }
  
  // Update close button behavior
  DOM.closeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling to title bar
    popup.style.display = 'none';
    
    // Clear content
    setTimeout(() => { content.innerHTML = ''; }, 300);
    
    // Reset position for next opening
    setTimeout(() => {
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
    }, 300);
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
  
  // Make popup draggable
  makePopupDraggable();
  
  // Initial population of files
  populateFiles(FILES_DATA);
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init(); // DOM already loaded
}