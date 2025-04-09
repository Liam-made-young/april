// Get elements
const categories = document.querySelectorAll('.category');
const files = document.querySelectorAll('.file');
const contentWindow = document.getElementById('content-window');
const content = contentWindow.querySelector('.content');
const closeBtn = contentWindow.querySelector('.close-btn');

// Filter files by category
categories.forEach(category => {
    category.addEventListener('click', () => {
        const selectedCategory = category.getAttribute('data-category');
        files.forEach(file => {
            if (file.getAttribute('data-type') === selectedCategory || selectedCategory === 'all') {
                file.style.display = 'flex';
            } else {
                file.style.display = 'none';
            }
        });
    });
});

// Open content window when clicking a file
files.forEach(file => {
    file.addEventListener('click', () => {
        const type = file.getAttribute('data-type');
        const src = file.getAttribute('data-src');

        if (type === 'film') {
            content.innerHTML = `<video controls width="100%"><source src="${src}" type="video/mp4"></video>`;
        } else if (type === 'audio') {
            content.innerHTML = `<audio controls style="width: 100%"><source src="${src}" type="audio/mpeg"></audio>`;
        } else if (type === 'image') {
            content.innerHTML = `<img src="${src}" style="width: 100%; cursor: zoom-in;" onclick="this.style.transform = this.style.transform === 'scale(2)' ? 'scale(1)' : 'scale(2)';">`;
        }

        contentWindow.style.display = 'block';
    });
});

// Close content window
closeBtn.addEventListener('click', () => {
    contentWindow.style.display = 'none';
    content.innerHTML = '';
});