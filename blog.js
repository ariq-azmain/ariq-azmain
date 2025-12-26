// Carousel functionality for blog page
document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.querySelector('.carousel');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dots = document.querySelectorAll('.carousel-dot');
  
  if (!carousel || slides.length === 0) return;
  
  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 5000; // 5 seconds
  
  // Initialize carousel
  function initCarousel() {
    updateCarousel();
    startAutoSlide();
    
    // Event listeners for buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        resetAutoSlide();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        resetAutoSlide();
      });
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoSlide();
      });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToSlide(currentSlide - 1);
        resetAutoSlide();
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentSlide + 1);
        resetAutoSlide();
      }
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }
  
  // Go to specific slide
  function goToSlide(n) {
    currentSlide = (n + slides.length) % slides.length;
    updateCarousel();
  }
  
  // Update carousel display
  function updateCarousel() {
    // Calculate the percentage to move (100% / number of slides)
    const slidePercentage = 100 / slides.length;
    // Move carousel by the correct percentage
    carousel.style.transform = `translateX(-${currentSlide * slidePercentage}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  // Start automatic sliding
  function startAutoSlide() {
    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, slideDuration);
  }
  
  // Reset automatic sliding timer
  function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
  }
  
  // Handle swipe gestures
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next slide
        goToSlide(currentSlide + 1);
      } else {
        // Swipe right - previous slide
        goToSlide(currentSlide - 1);
      }
      resetAutoSlide();
    }
  }
  
  // Pause auto-slide on hover
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
      startAutoSlide();
    });
  }
  
  // Initialize carousel when page loads
  window.addEventListener('load', function() {
    setTimeout(initCarousel, 100);
  });
});