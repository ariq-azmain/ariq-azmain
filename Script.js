// Prevent scrolling during preloader
document.addEventListener('DOMContentLoaded', function() {
  // Add no-scroll class to body
  document.body.classList.add('no-scroll');
  
  const preloader = document.querySelector('.pre');
  const minLoadingTime = 0; // ন্যূনতম ৩.৮৯ সেকেন্ড
  
  // Start dot animation
  startDotAnimation();
  
  // Enhanced dot animation for better visual effect
  enhanceDotAnimationForDuration();
  
  // Track if preloader has been hidden
  let preloaderHidden = false;
  
  // Function to hide preloader
  function hidePreloader() {
    if (preloaderHidden) return;
    
    preloaderHidden = true;
    preloader.classList.add('hid');
    
    // Remove no-scroll class after transition
    setTimeout(function() {
      document.body.classList.remove('no-scroll');
      
      // Initialize scroll animation after preloader is completely hidden
      initializeScrollAnimation();
    }, 800);
  }
  
  // 1. ন্যূনতম ৩.৮৯ সেকেন্ড পর লুকাতে হবে
  setTimeout(function() {
    // যদি ওয়েবসাইট ইতিমধ্যেই লোড হয়ে থাকে, তাহলে লুকিয়ে দাও
    if (document.readyState === 'complete') {
      hidePreloader();
    }
  }, minLoadingTime);
  
  // 2. সম্পূর্ণ ওয়েবসাইট লোড হওয়ার পর লুকাতে হবে
  window.addEventListener('load', function() {
    // ন্যূনতম টাইম আগে না গেলে অপেক্ষা করবে
    setTimeout(hidePreloader, 0);
  });
  
  // 3. যদি কোনো কারণে load ইভেন্ট না আসে, তবে 10 সেকেন্ড পর স্বয়ংক্রিয়ভাবে লুকিয়ে দাও
  setTimeout(function() {
    if (!preloaderHidden) {
      hidePreloader();
    }
  }, 10000);

  // Prevent scroll on preloader
  function preventScroll(e) {
    if (!document.body.classList.contains('no-scroll')) return;
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  // Add event listeners to prevent scroll
  document.addEventListener('wheel', preventScroll, { passive: false });
  document.addEventListener('touchmove', preventScroll, { passive: false });
  document.addEventListener('keydown', function(e) {
    if ([32, 33, 34, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      if (document.body.classList.contains('no-scroll')) {
        e.preventDefault();
        return false;
      }
    }
  });

  // Typing Animation (only for home page)
  const typedElement = document.querySelector('.typed');
  if (typedElement) {
    const words = ['Student', 'Developer', 'Programmer', 'Writer'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        charIndex--;
        typeSpeed = 70;
      } else {
        charIndex++;
        typeSpeed = 100;
      }

      typedElement.textContent = currentWord.substring(0, charIndex);

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 1000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }

    // Start typing animation only after preloader is hidden
    function startTyping() {
      if (preloaderHidden) {
        type();
      } else {
        setTimeout(startTyping, 100);
      }
    }
    
    startTyping();
  }

  // Handle About link click to scroll to sections
  const aboutLinks = document.querySelectorAll('a[href="/about"], a[href="#about-sections"]');
  aboutLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const currentPage = window.location.pathname;
      if (currentPage === '/' || currentPage === '') {
        // On home page, scroll to about section
        e.preventDefault();
        const aboutSection = document.getElementById('about-sections');
        if (aboutSection) {
          aboutSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Add hover effect to about sections (only for home page)
  const aboutSections = document.querySelectorAll('.about-section');
  aboutSections.forEach(section => {
    section.addEventListener('mouseenter', function() {
      if (preloaderHidden) {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
      }
    });
    
    section.addEventListener('mouseleave', function() {
      if (preloaderHidden) {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
      }
    });
  });

  // Add smooth scrolling to all links with hash
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only process if it's a hash link and not the about link (handled above)
      if (href === '#' || href === '#about-sections') return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Blog card interaction enhancement
  const blogCards = document.querySelectorAll('.blog-card, .blog-page-card');
  blogCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (preloaderHidden) {
        this.style.transform = 'translateY(-10px)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (preloaderHidden) {
        this.style.transform = 'translateY(0)';
      }
    });
  });

  // Email button functionality for contact page
  const emailBtn = document.querySelector('.email-btn');
  if (emailBtn && !emailBtn.hasAttribute('onclick')) {
    emailBtn.addEventListener('click', function() {
      window.location.href = 'mailto:ariqazmain@example.com';
    });
  }
});

// Function to initialize scroll animation after preloader is hidden
function initializeScrollAnimation() {
  const animatedElements = document.querySelectorAll('.identity, .Education, .co-curricular');
  
  if (animatedElements.length > 0) {
    function checkScroll() {
      animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.8) {
          element.classList.add('animate-in');
        }
      });
    }
    
    // Check immediately
    checkScroll();
    
    // Add event listeners
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
  }
}

// Dot Animation Function
function startDotAnimation() {
  const dots = document.querySelectorAll('.dot');
  if (dots.length === 0) return;
  
  let colorIndex = 0;
  const colors = [
    '#f00', '#ffff00', '#0f0', '#00ffff', '#0d01ff', 
    '#ff00fa', '#8d00ff', '#007fff', '#00ff94', '#0cff00',
    '#83ff00', '#cdff00', '#ffc600', '#ff6400', '#00ff2f',
    '#00fff5', '#0003ff', '#80ff00', '#f00', '#7d00ff'
  ];

  function updateDotColors() {
    dots.forEach((dot, index) => {
      const colorIndexForDot = (colorIndex + index * 2) % colors.length;
      dot.style.backgroundColor = colors[colorIndexForDot];
      dot.style.boxShadow = `0 0 15px ${colors[colorIndexForDot]}`;
    });
    colorIndex = (colorIndex + 1) % colors.length;
  }

  setInterval(updateDotColors, 200);
  updateDotColors();
}

// Enhanced dot animation with better visual effects
function enhanceDotAnimationForDuration() {
  const preloader = document.querySelector('.pre');
  if (preloader) {
    // Add pulse animation to dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.style.animation += ', pulse 2s ease-in-out infinite';
      dot.style.animationDelay += `, calc(var(--delay) * 0.5s)`;
    });
    
    // Add pulse animation to text
    const textSpans = document.querySelectorAll('.pre .text span');
    textSpans.forEach((span, index) => {
      span.style.animation += ', pulse-text 2.5s ease-in-out infinite';
      span.style.animationDelay += `, calc(${index} * 0.3s)`;
    });
    
    // Add the pulse animations to the style
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
      @keyframes pulse {
        0%, 100% { 
          transform: scale(1); 
          opacity: 1;
        }
        50% { 
          transform: scale(1.1); 
          opacity: 0.8;
        }
      }
      @keyframes pulse-text {
        0%, 100% { 
          transform: translateY(0); 
          text-shadow: 0 2px 20px currentColor;
        }
        50% { 
          transform: translateY(-5px); 
          text-shadow: 0 5px 25px currentColor, 0 0 10px currentColor;
        }
      }
      .pre {
        transition: opacity 1.2s ease-out;
      }
      .pre.hid {
        opacity: 0 !important;
        pointer-events: none;
      }
    `;
    document.head.appendChild(pulseStyle);
  }
}

// Handle window resize for better responsiveness
let resizeTimeout;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function() {
    // Re-check scroll animations on resize
    const animatedElements = document.querySelectorAll('.identity, .Education, .co-curricular');
    if (animatedElements.length > 0) {
      animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.8) {
          element.classList.add('animate-in');
        }
      });
    }
  }, 250);
});

// Add loading state to all links for better UX
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function(e) {
    // Only for internal links
    const href = this.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('//')) {
      // Add loading indicator
      this.classList.add('loading');
      
      // If it's a navigation link, wait a bit for smoother transition
      if (this.parentElement.parentElement.tagName === 'NAV') {
        setTimeout(() => {
          this.classList.remove('loading');
        }, 500);
      }
    }
  });
});

// Add CSS for loading indicator
const style = document.createElement('style');
style.textContent = `
  a.loading {
    position: relative;
    color: transparent !important;
  }
  a.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border: 2px solid #8c96ff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
  
  /* Ensure smooth transition for preloader */
  .pre {
    opacity: 1;
    transition: opacity 1.2s ease-out;
  }
  
  .pre.hid {
    opacity: 0;
    transition: opacity 1.2s ease-out;
  }
`;
document.head.appendChild(style);

// Check document ready state periodically
function checkDocumentReadyState() {
  const preloader = document.querySelector('.pre');
  if (!preloader || preloader.classList.contains('hid')) return;
  
  // If document is already complete and min time has passed
  if (document.readyState === 'complete') {
    const minTimePassed = performance.now() >= 3890;
    if (minTimePassed) {
      preloader.classList.add('hid');
      document.body.classList.remove('no-scroll');
    }
  }
}

// Check periodically (every 100ms)
setInterval(checkDocumentReadyState, 100);