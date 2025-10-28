// Automatically update footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu functionality
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuToggle.addEventListener('click', function() {
  mobileMenu.classList.toggle('active');
  
  // Toggle between hamburger and close icon
  const icon = mobileMenuToggle.querySelector('i');
  if (mobileMenu.classList.contains('active')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
  } else {
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
});

// Close mobile menu when clicking on a link
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
  link.addEventListener('click', function() {
    mobileMenu.classList.remove('active');
    const icon = mobileMenuToggle.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
  if (!event.target.closest('#mobile-menu-toggle') && !event.target.closest('#mobile-menu')) {
    mobileMenu.classList.remove('active');
    const icon = mobileMenuToggle.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
});

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('section-visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.section-hidden').forEach(section => {
  observer.observe(section);
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.classList.add('shadow-lg');
    header.classList.add('py-3');
    header.classList.remove('py-4');
  } else {
    header.classList.remove('shadow-lg');
    header.classList.remove('py-3');
    header.classList.add('py-4');
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Handle form submission
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  // Create form data
  const formData = new FormData(form);
  
  // Send form data using Fetch API
  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      // Show success message
      formStatus.textContent = 'Thank you for your message! I will get back to you soon.';
      formStatus.classList.add('success');
      form.reset();
    } else {
      throw new Error('Form submission failed');
    }
  })
  .catch(error => {
    // Show error message
    formStatus.textContent = 'Oops! There was a problem sending your message. Please try again.';
    formStatus.classList.add('error');
  })
  .finally(() => {
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Hide status message after 5 seconds
    setTimeout(() => {
      formStatus.classList.remove('success', 'error');
      formStatus.textContent = '';
    }, 5000);
  });
});