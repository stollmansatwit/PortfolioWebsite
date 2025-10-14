const player = document.getElementById("player");
const game = document.getElementById("game");

let targetPosition = 0; // The target position for the player
let currentPosition = 0; // The current position of the player

function lerp(start, end, alpha) {
  return (1 - alpha) * start + alpha * end;
}

// Animation loop
function animate() {
  // Smoothly interpolate the current position toward the target position
  currentPosition = lerp(currentPosition, targetPosition, 0.1);
  player.style.left = currentPosition + "px";

  // Continue the animation loop
  requestAnimationFrame(animate);
}

// Start the animation loop
animate();

// Handle input to update the target position
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    targetPosition += 10; // Increment the target position
  } else if (event.key === "ArrowLeft") {
    targetPosition -= 10; // Decrement the target position
  } else if (event.key === "ArrowUp") {
    targetPosition -= 10; // Decrement the target position
  } else if (event.key === "ArrowDown") {
    targetPosition += 10; // Increment the target position
  }
  
});
