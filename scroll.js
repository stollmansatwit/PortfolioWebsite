let currentIndex = 5; // Track the current band index
const revealBands = document.querySelectorAll('.reveal-band'); // Select all bands
const totalBands = revealBands.length;
let isAnimating = false; // Flag to track if animation is in progress
const animationDelay = 50; // Animation delay between bands in milliseconds

// Check if scroll.js should be disabled
function isScrollJSDisabled() {
    return window.scrollJSDisabled === true;
}

document.addEventListener('DOMContentLoaded', function () {
    const scrollHint = document.getElementById('subtle-scroll-hint');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        scrollHint.textContent = "tap to move background";
    } else {
        scrollHint.textContent = "scroll or use arrow keys to move background";
    }
});

// Named event handler functions for easier removal
function handleKeydownEvent(e) {
    if (isScrollJSDisabled() || isAnimating) return;
    
    if (e.key === 'ArrowDown') {
        animateSingleBand('down');
    } else if (e.key === 'ArrowUp') {
        animateSingleBand('up');
    }
}

function handleWheelEvent(e) {
    if (isScrollJSDisabled() || isAnimating) return;
    
    e.preventDefault(); // Prevent default scroll behavior
    
    const direction = e.deltaY > 0 ? 'down' : 'up';
    
    // Simple approach: multiple scroll = animate all bands
    if (Math.abs(e.deltaY) > 140) {
        animateAllBands(direction);
    } else {
        animateSingleBand(direction);
    }
}

function handleTouchEvent(e) {
    if (isScrollJSDisabled() || isAnimating) return;
    
    if (currentIndex === 5) {
        animateAllBands('up');
    } else if (currentIndex === 0) {
        animateAllBands('down');
    } else {
        if (currentIndex > 2) {
            animateAllBands('up');
        } else {
            animateAllBands('down');
        }
    }
}

// Add event listeners initially
window.addEventListener('keydown', handleKeydownEvent);
window.addEventListener('wheel', handleWheelEvent, { passive: false });
window.addEventListener('touchstart', handleTouchEvent);

// Function to animate single band
function animateSingleBand(direction) {
    if (isScrollJSDisabled() || isAnimating) return;
    
    isAnimating = true;
    
    if (direction === 'down' && currentIndex < totalBands) {
        revealBands[currentIndex].classList.remove('scroll-up');
        revealBands[currentIndex].classList.add('scroll-down');
        currentIndex++;
    } else if (direction === 'up' && currentIndex > 0) {
        currentIndex--;
        revealBands[currentIndex].classList.remove('scroll-down');
        revealBands[currentIndex].classList.add('scroll-up');
    }
    
    updateUIForCurrentIndex();
    
    // Simple timeout to re-enable scrolling
    setTimeout(() => {
        isAnimating = false;
    }, 200); // Give enough time for CSS animation
}

// Function to animate all bands with delay
function animateAllBands(direction) {
    if (isScrollJSDisabled() || isAnimating) return;
    
    isAnimating = true;
    
    let bandsToMove = 0;
    
    if (direction === 'up' && currentIndex > 0) {
        bandsToMove = currentIndex;
    } else if (direction === 'down' && currentIndex < totalBands) {
        bandsToMove = totalBands - currentIndex;
    }
    
    if (bandsToMove === 0) {
        isAnimating = false;
        return;
    }
    
    // Move all bands immediately, then re-enable scrolling after total animation time
    for (let i = 0; i < bandsToMove; i++) {
        setTimeout(() => {
            if (direction === 'down' && currentIndex < totalBands) {
                revealBands[currentIndex].classList.remove('scroll-up');
                revealBands[currentIndex].classList.add('scroll-down');
                currentIndex++;
            } else if (direction === 'up' && currentIndex > 0) {
                currentIndex--;
                revealBands[currentIndex].classList.remove('scroll-down');
                revealBands[currentIndex].classList.add('scroll-up');
            }
            
            updateUIForCurrentIndex();
        }, i * animationDelay);
    }
    
    // Re-enable scrolling after all animations complete
    setTimeout(() => {
        isAnimating = false;
    }, (bandsToMove * animationDelay) + 100); // Add small buffer
}

// Function to animate all bands with dropDown animation (like page load)
function allBandsDown() {

    if (isScrollJSDisabled() || isAnimating) return;
    currentIndex = 0;
    isAnimating = true;
    
    // Apply dropDown animation to all bands with stagger
    revealBands.forEach((band, index) => {
        // Clear any existing classes/animations
        band.classList.remove('scroll-down', 'scroll-up');
        band.style.animation = 'none';
        band.style.top = '-100%'; // Start from top
        band.offsetHeight; // Force reflow
        
        
        // Apply the dropDown animation with stagger (same timing as original CSS)
        setTimeout(() => {
            band.style.animation = `dropDown 1s ease-out forwards`;
            currentIndex++;
            updateUIForCurrentIndex();
        }, index * 300); // 300ms stagger like original page load
    });
    
    // Reset state after all animations complete
    setTimeout(() => {

        revealBands.forEach((band) => {
            band.style.animation = '';
            band.style.top = '';
        });
        currentIndex = 5;
        isAnimating = false;
        
    }, (revealBands.length * 300)+2000); // Wait for all bands to finish (stagger + animation duration)
}

// Function to update UI based on current index
function updateUIForCurrentIndex() {
    // Update header text color based on current index
    const header = document.querySelector('header');
    if (currentIndex === 3) {
        header.style.transition = 'color 0.5s';
        header.style.color = 'white';
    } else if (currentIndex === 2) {
        header.style.transition = 'color 1s';
        header.style.color = 'black';
    }
    if (currentIndex >= 3) {
        header.style.color = 'white';
    } else if (currentIndex <= 2) {
        header.style.color = 'black';
    }
    
    const subtleHint = document.getElementById('subtle-scroll-hint');
    if (currentIndex === 5) {
        subtleHint.classList.add('visible');
    } else {
        subtleHint.classList.remove('visible');
    }
}

// Expose functions globally for use by other scripts
window.animateAllBands = animateAllBands;
window.allBandsDown = allBandsDown;



