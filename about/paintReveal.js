// This script handles the paint reveal effect on the canvas element.
const canvas = document.getElementById('reveal-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let lastX = 0;
let lastY = 0;
let hasMoved = false;
let isRevealed = false;



function renderLargeText() {
        const largeTextCanvas = document.getElementById('large-text');
        const textCtx = largeTextCanvas.getContext('2d');
        largeTextCanvas.width = window.innerWidth;
        largeTextCanvas.height = window.innerHeight;

        

        textCtx.fillStyle = 'rgba(128, 128, 128, 0.53)'; // Light gray with transparency
        const fontSize = Math.min(window.innerWidth, window.innerHeight) * 0.2; // Dynamically adjust font size based on screen size
        textCtx.font = `${fontSize}px Wix Madefor Display`; // Set font size and family
        textCtx.textAlign = 'center';
        textCtx.textBaseline = 'middle';
        textCtx.fillText('ERASE', largeTextCanvas.width / 2, largeTextCanvas.height / 2);

        
}

const brushRadius = 50;
const lerp = (a, b, t) => a * (1 - t) + b * t;

// Function to draw image with 'cover' behavior (like CSS background-size: cover)
function drawImageCover(ctx, img, x, y, w, h) {
    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;
    
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
    
    // Calculate dimensions to cover the entire canvas while maintaining aspect ratio
    if (imgRatio > canvasRatio) {
        // Image is wider than canvas (relative to height)
        drawHeight = h;
        drawWidth = h * imgRatio;
        offsetX = (w - drawWidth) / 2;
    } else {
        // Image is taller than canvas (relative to width)
        drawWidth = w;
        drawHeight = w / imgRatio;
        offsetY = (h - drawHeight) / 2;
    }
    
    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
}
// Create image object for the background
let bgImage = new Image();
bgImage.src = 'images/img9.jpeg';
let imageLoaded = false;

bgImage.onload = function() {
    imageLoaded = true;
    resizeCanvas(); // Redraw once the image is loaded
};

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isRevealed) {
        if (imageLoaded) {
            // Draw the image with cover behavior
            drawImageCover(ctx, bgImage, 0, 0, canvas.width / dpr, canvas.height / dpr);
        } else {
            // Fallback to black if image isn't loaded yet
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        }
        ctx.globalCompositeOperation = 'destination-out';    } else {
        // Redraw the image background if revealed
        ctx.globalCompositeOperation = 'source-over';
            // Fallback to gradient if image isn't loaded
            const gradient = ctx.createRadialGradient(lastX, lastY, 0, lastX, lastY, Math.max(canvas.width, canvas.height));
            gradient.addColorStop(0, 'rgb(157, 161, 255)');
            gradient.addColorStop(1, 'rgb(110, 114, 255)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.globalCompositeOperation = 'destination-out';
    }
}

function animateColorDrop(x, y, maxRadius = Math.max(canvas.width, canvas.height)) {
    let radius = 0;
    const step = 10;
    
    // Create a semi-transparent white overlay
    function expand() {
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over'; // Draw normally
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgb(157, 161, 255)');
        gradient.addColorStop(1, 'rgb(110, 114, 255)');
        ctx.fillStyle = gradient;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        radius += step;
        //bring text and image over the canvas and make text background transparent
        const maskedContent = document.getElementById('masked-content');
        maskedContent.style.zIndex = '10'; // Bring to the front
        maskedContent.style.backgroundColor = 'transparent'; // Make background transparent
        maskedContent.style.position = 'relative'; // Ensure proper stacking context
        maskedContent.style.pointerEvents = 'auto'; // Make text clickable
        maskedContent.style.cursor = 'default'; // Change cursor to default

        if (radius < maxRadius) {
            requestAnimationFrame(expand);
        }

    }

    expand();
}

window.addEventListener('resize', () => {
    resizeCanvas();
    renderLargeText();
});
document.fonts.ready.then(() => {
    if (document.fonts.check('10rem Wix Madefor Display')) {
        renderLargeText();
    } else {
        console.warn('Font "Wix Madefor Display" is not loaded.');
    }
});
renderLargeText();
resizeCanvas();

function drawCircle(x, y) {
    // if drawCircle is called, it means the user has moved the mouse or touched the screen
    // Now I can load in hidden content
    const maskedContent = document.getElementById('masked-content');
    maskedContent.style.display = 'block'; // Show the content
    ctx.beginPath();
    ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
    ctx.fill();

    // Erase the corresponding portion of the large text
    const largeText = document.getElementById('large-text');
    const textCtx = largeText.getContext('2d'); // Get the 2D context of the large text
    textCtx.globalCompositeOperation = 'destination-out'; // Erase mode
    textCtx.beginPath();
    textCtx.arc(x, y, brushRadius, 0, Math.PI * 2);
    textCtx.fill();
}

function checkRevealCompletion(threshold = 0.35) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;

    // Loop through every pixel's alpha value
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentCount++;
    }

    const totalPixels = canvas.width * canvas.height;
    const transparentRatio = transparentCount / totalPixels;

    if (transparentRatio >= threshold) {
        isRevealed = true;

        //Remove Large Text
        const largeTextCanvas = document.getElementById('large-text');
        largeTextCanvas.style.display = 'none'; // Hide the canvas

        // Remove the mousemove event listener
        canvas.removeEventListener('mousemove', handleMouseMove);

        // Trigger any additional actions

        animateColorDrop(lastX, lastY, 4000); // Animate the color drop effect
        flipText360(); // Call the flip function
        // Add hover effect to scale up heading elements
        const wrappers = document.querySelectorAll('.heading-wrapper');

        wrappers.forEach((wrapper) => {
            const heading = wrapper.querySelector('h1, h2, h3, h5, h6');
            if (!heading) return;

            heading.style.transition = 'transform 0.3s ease-in-out'; // Smooth scaling
            heading.style.display = 'inline-block'; // Prevent layout shift

            wrapper.style.overflow = 'hidden'; // Clip any overflow

            heading.addEventListener('mouseover', () => {
                heading.style.transform = 'scale(1.2)';
            });

            heading.addEventListener('mouseout', () => {
                heading.style.transform = 'scale(1)';
            });
        });



    }
}

function flipText360() {
    const allTextElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, button'); // Include <a> tags
    allTextElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.transition = 'transform 1s ease-in-out'; // Smooth transition
            element.style.transformOrigin = 'top'; // Set the origin to the top
            element.style.transform = 'rotateX(360deg)'; // Rotate 360 degrees on the X-axis
        }, index * 200); // Delay each flip by 200ms
    });
}





function handleMouseMove(e) {

    const rect = canvas.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;

    if (!hasMoved) {
        drawCircle(newX, newY);
        hasMoved = true;
    } else {
        const distX = newX - lastX;
        const distY = newY - lastY;
        const distance = Math.hypot(distX, distY);

        const steps = Math.ceil(distance / (brushRadius / 4));
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = lerp(lastX, newX, t);
            const y = lerp(lastY, newY, t);
            drawCircle(x, y);
        }
    }

    lastX = newX;
    lastY = newY;

}

// Add the event listener
// Mouse support
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent right-click context menu


// Touch support
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    if (touch) {
        handleMouseMove({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    }
}, { passive: false });

canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (touch) {
        handleMouseMove({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    }
}, { passive: false });



const intervalId = setInterval(() => {
    if (!isRevealed) {
        checkRevealCompletion(0.23); // 15% reveal threshold
    } else {
        clearInterval(intervalId); // Stop checking once revealed
    }
}, 1000);


