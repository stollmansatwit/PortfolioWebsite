// changeBackground.js
// Sets a random initial background and handles background changes

(function () {
  // List of available images (relative to public_html)
  const images = [
    'images/img1.jpg',
    'images/img2.jpg',
    'images/img3.jpg',
    'images/img5.jpg',
    'images/img6.jpg',
    'images/img7.jpeg'
  ];

  let currentImage = null;
  let lastClickTime = 0;
  let clickCount = 0;

  function getNextImage(current) {
    if (!images || images.length === 0) return null;
    let idx = 0;
    if (current) {
      idx = images.indexOf(current);
      idx = (idx + 1) % images.length;
    }
    return images[idx];
  }

  function setBackground(url) {
    if (!url) return;
    currentImage = url;
    // Update CSS variable for reveal bands
    document.documentElement.style.setProperty('--image', `url("${url}")`);
    // Also set the body background-image
    document.body.style.backgroundImage = `url("${url}")`;
  }

  function changeBackgroundWithBands() {
    // Use scroll.js functions to properly animate bands
    // This will work with the existing scroll system
    
    // First, check if scroll.js functions are available
    if (typeof window.animateAllBands !== 'function') {
      // Fallback: just change background without animation
      const nextImage = getNextImage(currentImage);
      if (nextImage) {
        setBackground(nextImage);
      }
      return;
    }
    
    // Temporarily disable scroll input to prevent interference
    window.scrollJSDisabled = true;
    
    // Step 1: Animate all bands up (using scroll.js function)
    setTimeout(() => {
    window.animateAllBands('up');
    }, 500);
    
    
    // Step 2: Wait for up animation to complete, then change background
    setTimeout(() => {
      const nextImage = getNextImage(currentImage);
      if (nextImage) {
        setBackground(nextImage);
      }}, 2000);
      
      // Step 3: Animate all bands back down
      setTimeout(() => {
        window.allBandsDown();
      }, 2000);
        // Step 4: Re-enable scroll input after down animation completes
        
        window.scrollJSDisabled = false;
  }

  function initRandomBackground() {
    const randomImage = getNextImage();
    if (randomImage) {
      setBackground(randomImage);
    }
  }

  function createButton() {
    const btn = document.createElement('button');
    btn.className = 'bg-change-btn';
    btn.setAttribute('aria-label', 'Change background');

    // camera SVG
    btn.innerHTML = `
      <svg class="camera-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 9.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM4 7h3l1.7-2.5A1 1 0 019.6 4h4.8c.36 0 .69.19.9.5L16 7h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"/>
      </svg>
      <span class="tooltip" style="font-family: 'Wix Madefor Display', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">change background</span>
    `;

    // Make the button draggable
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let startPos = { x: 0, y: 0 };
    let hasMoved = false;

    btn.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // Left mouse button only
        isDragging = true;
        hasMoved = false;
        startPos.x = e.clientX;
        startPos.y = e.clientY;
        const rect = btn.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        btn.style.cursor = 'grabbing';
        e.preventDefault();
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        // Check if mouse has moved enough to be considered a drag
        const moveDistance = Math.sqrt(
          Math.pow(e.clientX - startPos.x, 2) + 
          Math.pow(e.clientY - startPos.y, 2)
        );
        
        if (moveDistance > 5) { // 5px threshold for drag detection
          hasMoved = true;
          
          const x = e.clientX - dragOffset.x;
          const y = e.clientY - dragOffset.y;
          
          // Keep button within viewport bounds
          const maxX = window.innerWidth - btn.offsetWidth;
          const maxY = window.innerHeight - btn.offsetHeight;
          
          const clampedX = Math.max(0, Math.min(x, maxX));
          const clampedY = Math.max(0, Math.min(y, maxY));
          
          btn.style.right = 'auto';
          btn.style.bottom = 'auto';
          btn.style.left = clampedX + 'px';
          btn.style.top = clampedY + 'px';
        }
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        btn.style.cursor = 'pointer';
      }
    });

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Don't trigger background change if user was dragging
        if (hasMoved) {
            hasMoved = false; // Reset for next interaction
            return;
        }
        
        // Check if button is already disabled (animation in progress)
        if (btn.disabled) {
            return; // Don't do anything if disabled
        }
        
        // Disable the button immediately when clicked
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        
        // Start the background change animation
        changeBackgroundWithBands();
        
        // Re-enable the button after animation completes
        setTimeout(() => {
            btn.disabled = false;
            btn.style.opacity = '';
            btn.style.cursor = 'pointer';
        }, 5000);
        
        return;
      
    });

    document.body.appendChild(btn);
  }

  // Initialize on DOM ready
  function init() {
    initRandomBackground();
    createButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();