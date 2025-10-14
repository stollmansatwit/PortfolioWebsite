document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.section-card, .hi');
  
    cards.forEach(card => {
      const shine = card.querySelector('.shine');
  
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // Mouse X inside card
        const y = e.clientY - rect.top;  // Mouse Y inside card
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
  
        const rotateX = (centerY - y) / 10;
        const rotateY = (x - centerX) / 10;
  
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  
        if (shine) {
          shine.style.left = `${x}px`;
          shine.style.top = `${y}px`;
        }
      });
  
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        if (shine) {
        //   shine.style.left = `50%`;  // Reset shine to center
        //   shine.style.top = `50%`;
        }
      });
    });
  });
  