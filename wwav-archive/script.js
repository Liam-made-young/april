// Cache DOM elements
const DOM = {
  mainWindow: document.querySelector('.main-window'),
  contentWindow: document.getElementById('content-window'),
  content: document.querySelector('.content-window .content'),
  closeBtn: document.querySelector('.close-btn'),
  categories: document.querySelectorAll('.category')
};

// Global files data
let FILES_DATA = [];

// Navigation stack for folder browsing
const navigationStack = [];
let currentFolder = null;

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

// Create sidebar sections with headers and categories
function createSidebarSections() {
  // Get the sidebar
  const sidebar = document.querySelector('.sidebar');
  
  // Clear current sidebar content
  sidebar.innerHTML = '';
  
  // Create the main heading
  const mainHeading = document.createElement('h2');
  mainHeading.textContent = 'Files';
  sidebar.appendChild(mainHeading);
  
  // Create sections based on file types
  const sections = [
    {
      title: 'All',
      items: [{ name: 'All Files', category: 'all', selected: true }]
    },
    {
      title: 'Audio',
      items: [
        { name: 'All Audio', category: 'audio' },
        { name: 'Stem Players', category: 'stems' }
      ]
    },
    {
      title: 'Visual',
      items: [
        { name: 'Films', category: 'film' },
        { name: 'Images', category: 'image' }
      ]
    }
  ];
  
  // Create each section
  sections.forEach(section => {
    // Create section container
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'sidebar-section';
    
    // Create section header
    const sectionHeader = document.createElement('h3');
    sectionHeader.className = 'section-header';
    sectionHeader.textContent = section.title;
    sectionDiv.appendChild(sectionHeader);
    
    // Create category list
    const categoryList = document.createElement('ul');
    
    // Add items to category list
    section.items.forEach(item => {
      const categoryItem = document.createElement('li');
      categoryItem.className = 'category' + (item.selected ? ' selected' : '');
      categoryItem.dataset.category = item.category;
      categoryItem.textContent = item.name;
      categoryList.appendChild(categoryItem);
    });
    
    sectionDiv.appendChild(categoryList);
    sidebar.appendChild(sectionDiv);
  });
  
  // Update DOM cache for categories
  DOM.categories = document.querySelectorAll('.category');
}

// Set up category filtering with event delegation - UPDATED
function setupCategoryFilters() {
  // Target the entire sidebar instead of just one ul
  const sidebar = document.querySelector('.sidebar');
  
  // Use event delegation
  sidebar.addEventListener('click', (e) => {
    const category = e.target.closest('.category');
    if (!category) return;
    
    const selectedCategory = category.dataset.category;
    
    // Update selected state for all categories
    DOM.categories.forEach(cat => cat.classList.remove('selected'));
    category.classList.add('selected');
    
    // Filter and display files
    const filteredFiles = selectedCategory === 'all' ? 
      FILES_DATA : 
      FILES_DATA.filter(file => file.type === selectedCategory);
    
    populateFiles(filteredFiles);
  });
}

// Load files data from JSON
async function loadFilesData() {
  try {
    const response = await fetch('files.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    FILES_DATA = []; // Clear the array first to avoid duplicates
    
    // Process audio files - handle both new and old format
    if (data.audio) {
      if (Array.isArray(data.audio)) {
        // Old format
        data.audio.forEach(file => {
          FILES_DATA.push({
            name: file.name,
            type: 'audio',
            src: file.src
          });
        });
      } else if (data.audio.files && Array.isArray(data.audio.files)) {
        // New format
        data.audio.files.forEach(file => {
          FILES_DATA.push({
            name: file.name,
            type: 'audio',
            src: file.src
          });
        });
        
        // Process audio folders if present in new format
        if (data.audio.folders && Array.isArray(data.audio.folders)) {
          data.audio.folders.forEach(folder => {
            FILES_DATA.push({
              name: folder.name,
              type: 'folder',
              contentType: 'audio',
              path: folder.path,
              contents: folder.contents
            });
          });
        }
      }
    }
    
    // Process films
    if (data.films) {
      if (Array.isArray(data.films)) {
        // Old format
        data.films.forEach(file => {
          FILES_DATA.push({
            name: file.name,
            type: 'film',
            src: file.src
          });
        });
      } else if (data.films.files && Array.isArray(data.films.files)) {
        // New format
        data.films.files.forEach(file => {
          FILES_DATA.push({
            name: file.name,
            type: 'film',
            src: file.src
          });
        });
        
        // Process film folders if present in new format
        if (data.films.folders && Array.isArray(data.films.folders)) {
          data.films.folders.forEach(folder => {
            FILES_DATA.push({
              name: folder.name,
              type: 'folder',
              contentType: 'film',
              path: folder.path,
              contents: folder.contents
            });
          });
        }
      }
    }
    
    // Process images
    if (data.images) {
      if (Array.isArray(data.images)) {
        // Old format
        data.images.forEach(file => {
          FILES_DATA.push({
            name: file.name,
            type: 'image',
            src: file.src
          });
        });
      } else if (data.images.files && Array.isArray(data.images.files)) {
        // New format
        data.images.files.forEach(file => {
          FILES_DATA.push({
            name: file.name,
            type: 'image',
            src: file.src
          });
        });
        
        // Process image folders if present in new format
        if (data.images.folders && Array.isArray(data.images.folders)) {
          data.images.folders.forEach(folder => {
            FILES_DATA.push({
              name: folder.name,
              type: 'folder',
              contentType: 'image',
              path: folder.path,
              contents: folder.contents
            });
          });
        }
      }
    }
    
    // Process stem folders - keep this the same as it was
    if (data.stems && Array.isArray(data.stems)) {
      data.stems.forEach(stem => {
        FILES_DATA.push({
          name: stem.name + " (Stem Player)",
          type: 'stems',
          src: stem.folder,
          stemData: stem
        });
      });
    }
    
    console.log(`Loaded ${FILES_DATA.length} files from JSON`);
    
    // Initial population of files
    populateFiles(FILES_DATA);
    
  } catch (error) {
    console.error('Error loading files data:', error);
    DOM.mainWindow.innerHTML = `<div class="error">Error loading files: ${error.message}</div>`;
  }
}

// Create file elements using document fragment for better performance
function populateFiles(files) {
  // Clear main window
  DOM.mainWindow.innerHTML = '';
  
  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();
  
  // Add back button if we're in a folder (navigationStack has items)
  if (navigationStack.length > 0) {
    const backButton = document.createElement('div');
    backButton.className = 'file back-button';
    backButton.id = 'back-button';
    backButton.textContent = 'Return to Parent Folder';
    
    // Add click handler directly to the button
    backButton.addEventListener('click', navigateBack);
    
    fragment.appendChild(backButton);
  }
  
  // Add all the files and folders
  files.forEach(file => {
    const fileElement = document.createElement('div');
    fileElement.className = 'file';
    fileElement.dataset.type = file.type;
    
    if (file.type === 'folder') {
      fileElement.classList.add('folder');
      fileElement.dataset.path = file.path;
    } else {
      fileElement.dataset.src = file.src;
    }
    
    // Store stem data reference if applicable
    if (file.stemData) {
      fileElement.dataset.stems = "true";
    }
    
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
  
  // Handle folder click
  if (type === 'folder') {
    const folderPath = fileElement.dataset.path;
    const folderData = currentFolder ? 
      currentFolder.files.find(f => f.type === 'folder' && f.path === folderPath) :
      FILES_DATA.find(f => f.type === 'folder' && f.path === folderPath);
    
    if (folderData) {
      navigateToFolder(folderData);
    }
    return;
  }
  
  // Clear content first (better performance)
  DOM.content.innerHTML = '';
  
  try {
    if (type === 'stems') {
      // Find the stem data
      const stemData = FILES_DATA.find(file => 
        file.type === 'stems' && file.src === src
      ).stemData;
      
      createStemPlayer(stemData);
    } else if (type === 'film') {
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

// Create the minimalist stem player interface
function createStemPlayer(stemData) {
  // Create audio context only when playing to avoid autoplay policy issues
  let audioContext;
  
  // Create stem player container
  const stemPlayerContainer = document.createElement('div');
  stemPlayerContainer.className = 'stem-player';
  
  // Create controls grid
  const controlsGrid = document.createElement('div');
  controlsGrid.className = 'stem-controls-grid';
  
  // Track objects to store audio
  const tracks = [];
  
  // Initialize tracks
  stemData.tracks.forEach(track => {
    const audioElement = new Audio();
    audioElement.preload = 'auto'; // Ensure preloading
    audioElement.src = `${stemData.folder}/${track.file}`;
    
    tracks.push({
      name: track.name,
      file: track.file,
      audio: audioElement,
      source: null,
      gainNode: null,
      volumeLevel: 3 // Default middle level
    });
  });
  
  // Create grid of dots - 4 columns (tracks) x 7 rows (volume levels)
  for (let row = 0; row < 7; row++) {
    const volumeLevel = 6 - row; // Invert so top row is highest volume
    
    tracks.forEach((track, trackIndex) => {
      const cell = document.createElement('div');
      cell.className = 'volume-cell';
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `volume-${trackIndex}`;
      radio.value = volumeLevel;
      radio.id = `volume-${trackIndex}-${volumeLevel}`;
      radio.checked = volumeLevel === track.volumeLevel;
      
      radio.addEventListener('change', function() {
        if (audioContext) { // Only if audio context is initialized
          adjustVolume(trackIndex, volumeLevel);
        }
      });
      
      const label = document.createElement('label');
      label.htmlFor = radio.id;
      label.className = 'volume-label';
      
      cell.appendChild(radio);
      cell.appendChild(label);
      controlsGrid.appendChild(cell);
    });
  }
  
  stemPlayerContainer.appendChild(controlsGrid);
  
  // Add simple play button
  const playButton = document.createElement('div');
  playButton.className = 'play-button';
  
  // Add debug message
  const debugMsg = document.createElement('div');
  debugMsg.className = 'debug-message';
  debugMsg.style.display = 'none';
  stemPlayerContainer.appendChild(debugMsg);
  
  // Play button event handler
  playButton.addEventListener('click', async () => {
    try {
      // Initialize audio context on first play (to avoid autoplay policy)
      if (!audioContext) {
        // Create audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        
        // Connect audio nodes
        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i];
          track.gainNode = audioContext.createGain();
          track.source = audioContext.createMediaElementSource(track.audio);
          track.source.connect(track.gainNode);
          track.gainNode.connect(audioContext.destination);
          
          // Set initial volume level
          track.gainNode.gain.value = mapLevelToVolume(track.volumeLevel);
          
          // Add update progress handler
          track.audio.addEventListener('timeupdate', updateProgress);
        }
      }
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      togglePlayAll();
    } catch (error) {
      console.error('Audio playback error:', error);
      debugMsg.textContent = `Error: ${error.message}`;
      debugMsg.style.display = 'block';
    }
  });
  
  stemPlayerContainer.appendChild(playButton);
  
  // Add simple progress bar
  const progressContainer = document.createElement('div');
  progressContainer.className = 'progress-container';
  
  const progressMarker = document.createElement('div');
  progressMarker.className = 'progress-marker';
  
  progressContainer.appendChild(progressMarker);
  stemPlayerContainer.appendChild(progressContainer);
  
  // Append to content
  DOM.content.appendChild(stemPlayerContainer);
  
  // Status variables
  let isPlaying = false;
  
  // Map volume level (0-6) to actual gain value (0-1)
  function mapLevelToVolume(level) {
    return Math.pow(level / 6, 1.5);
  }
  
  // Adjust volume for a track
  function adjustVolume(trackIndex, level) {
    const track = tracks[trackIndex];
    track.volumeLevel = level;
    if (track.gainNode) {
      track.gainNode.gain.value = mapLevelToVolume(level);
    }
  }
  
  // Toggle play/pause for all tracks
  function togglePlayAll() {
    if (!isPlaying) {
      // Start playback
      const playPromises = tracks.map(track => {
        // Reset to beginning if ended
        if (track.audio.ended) {
          track.audio.currentTime = 0;
        }
        return track.audio.play();
      });
      
      // Handle all play promises
      Promise.all(playPromises)
        .then(() => {
          debugMsg.style.display = 'none';
          playButton.style.opacity = 0.6;
          isPlaying = true;
        })
        .catch(error => {
          console.error('Play error:', error);
          debugMsg.textContent = `Playback error: ${error.message}`;
          debugMsg.style.display = 'block';
        });
    } else {
      // Pause playback
      tracks.forEach(track => {
        track.audio.pause();
      });
      
      playButton.style.opacity = 1;
      isPlaying = false;
    }
  }
  
  // Update progress marker
  function updateProgress() {
    if (tracks.length === 0 || !tracks[0].audio) return;
    
    const audio = tracks[0].audio;
    if (audio.duration && !isNaN(audio.duration)) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressMarker.style.left = `${progress}%`;
    }
  }
}

// Make popup draggable
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

// Add this function to handle folder navigation
function navigateToFolder(folder) {
  // Push current state to navigation stack
  if (currentFolder) {
    navigationStack.push(currentFolder);
  } else {
    navigationStack.push({
      files: FILES_DATA,
      name: 'Home'
    });
  }
  
  // Set current folder
  currentFolder = {
    files: [...folder.contents.files.map(file => ({
      name: file.name,
      type: folder.contentType,
      src: file.src
    })), ...folder.contents.folders.map(subFolder => ({
      name: subFolder.name,
      type: 'folder',
      contentType: folder.contentType,
      path: subFolder.path,
      contents: subFolder.contents
    }))],
    name: folder.name
  };
  
  // Display folder contents
  populateFiles(currentFolder.files);
}

// Function to navigate back
function navigateBack() {
  if (navigationStack.length > 0) {
    // Pop the last folder from the stack
    currentFolder = navigationStack.pop();
    
    // Display folder contents
    populateFiles(currentFolder.files);
  }
}

// Update the init function
function init() {
  // Replace the old category creation with our new sections
  createSidebarSections();
  
  // Make popup draggable
  makePopupDraggable();
  
  // Set up category filters
  setupCategoryFilters();
  
  // Add keyboard support for ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.contentWindow.style.display === 'block') {
      DOM.contentWindow.style.display = 'none';
      setTimeout(() => { DOM.content.innerHTML = ''; }, 300);
    }
  });
  
  // Load files data from JSON
  loadFilesData();
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init(); // DOM already loaded
}