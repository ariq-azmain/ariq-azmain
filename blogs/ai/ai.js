 // Back to top button
 const backToTopButton = document.querySelector('.back-to-top');
 
 window.addEventListener('scroll', () => {
     if (window.pageYOffset > 300) {
  backToTopButton.style.display = 'flex';
     } else {
  backToTopButton.style.display = 'none';
     }
 });
 
 // Smooth scrolling for navigation links
 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
     anchor.addEventListener('click', function(e) {
  e.preventDefault();
  
  const targetId = this.getAttribute('href');
  if (targetId === '#') return;
  
  const targetElement = document.querySelector(targetId);
  if (targetElement) {
      window.scrollTo({
   top: targetElement.offsetTop - 70,
   behavior: 'smooth'
      });
  }
     });
 });
 
 // Simple animation for fun facts on scroll
 const observerOptions = {
     threshold: 0.1,
     rootMargin: '0px 0px -50px 0px'
 };
 
 const observer = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
  if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
  }
     });
 }, observerOptions);
 
 // Observe fun facts and examples
 document.querySelectorAll('.fun-fact, .ai-example').forEach(el => {
     el.style.opacity = '0';
     el.style.transform = 'translateY(20px)';
     el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
     observer.observe(el);
 });