function adjustCardSizes() {
    const cards = document.querySelectorAll('.section-card');
    const container = document.querySelector('.sections-container');
    const screenWidth = window.innerWidth;
    
    // Calculate optimal card size based on screen width
    let cardSize, gap;
    let enableScrolling = false; // Flag to track if we should enable scrolling
    
    if (screenWidth >= 1000) {
        // Large screens - 4 cards in a row
        const availableWidth = screenWidth - 160; // Account for padding and margins
        cardSize = Math.min(220, Math.max(180, availableWidth / 5)); // Dynamic sizing with limits
        gap = Math.max(15, screenWidth * 0.015);
    } else if (screenWidth >= 651) {
        // Medium screens - 4 cards in a row
        const availableWidth = screenWidth - 120;
        cardSize = Math.min(190, Math.max(150, availableWidth / 5));
        gap = Math.max(12, screenWidth * 0.012);
    } else if (screenWidth >= 401) {
        // 2x2 grid
        const availableWidth = screenWidth - 80;
        cardSize = Math.min(180, Math.max(140, availableWidth / 2.5));
        gap = 15;
    } else {
        // Single column
        cardSize = Math.min(160, Math.max(120, screenWidth * 0.4));
        gap = 20;
        enableScrolling = true; // Enable scrolling for single columns
        
        // Enable scrolling for single column layout
        document.body.style.overflowY = 'auto';
        document.body.style.height = 'auto';
        
        // Adjust container for better scrolling
        container.style.minHeight = '100vh';
        container.style.paddingBottom = '200px'; // Space to scroll "Get in Touch" to center
    }
    
    // Apply the calculated sizes
    cards.forEach(card => {
        card.style.width = cardSize + 'px';
        card.style.height = cardSize + 'px';
    });
    
    // Apply gap to container
    container.style.gap = gap + 'px';
    
    // Control scroll.js behavior
    if (enableScrolling) {
        // Disable scroll.js functionality
        disableScrollJS();
    } else {
        // Reset overflow for larger screens and re-enable scroll.js
        document.body.style.overflowY = 'hidden';
        document.body.style.height = '100vh';
        container.style.minHeight = 'auto';
        container.style.paddingBottom = '0';
        enableScrollJS();
    }
}

// Function to disable scroll.js
function disableScrollJS() {
    // Remove all scroll event listeners
    window.removeEventListener('wheel', handleWheelEvent);
    window.removeEventListener('keydown', handleKeydownEvent);
    window.removeEventListener('touchstart', handleTouchEvent);
    
    // Hide the scroll hint
    const scrollHint = document.getElementById('subtle-scroll-hint');
    if (scrollHint) scrollHint.style.display = 'none';
    
    // Set a global flag that scroll.js can check
    window.scrollJSDisabled = true;
}

// Function to enable scroll.js
function enableScrollJS() {
    // Re-add event listeners (these functions should be defined in scroll.js)
    window.addEventListener('wheel', handleWheelEvent);
    window.addEventListener('keydown', handleKeydownEvent);
    window.addEventListener('touchstart', handleTouchEvent);
    
    // Show the scroll hint
    const scrollHint = document.getElementById('subtle-scroll-hint');
    if (scrollHint) scrollHint.style.display = 'block';
    
    // Clear the global flag
    window.scrollJSDisabled = false;
}

// Run on page load and resize
document.addEventListener('DOMContentLoaded', adjustCardSizes);
window.addEventListener('resize', adjustCardSizes);