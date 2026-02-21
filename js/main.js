/**
 * GLOBAL-MKTS.COM MAIN JAVASCRIPT
 * Interactions, Animations, and Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initSmoothScroll();
  initMobileMenu();
  initParallax();
});

/**
 * NAVBAR SCROLL EFFECT
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class
    if (currentScroll > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
    
    // Hide/show on scroll direction (optional)
    if (currentScroll > lastScroll && currentScroll > 500) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

/**
 * SCROLL REVEAL ANIMATIONS
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .stagger-children');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * SMOOTH SCROLL FOR ANCHOR LINKS
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * MOBILE MENU TOGGLE
 */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggle || !navLinks) return;
  
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggle.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
  
  // Close menu when clicking on a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

/**
 * PARALLAX EFFECTS
 */
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        parallaxElements.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.5;
          const rect = el.getBoundingClientRect();
          const scrolled = window.pageYOffset;
          const rate = scrolled * speed;
          
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.style.transform = `translateY(${rate}px)`;
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * COUNTER ANIMATION
 * Usage: Add data-count="1234" to element
 */
function animateCounter(element) {
  const target = parseInt(element.dataset.count);
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(easeOutQuart * (target - start) + start);
    
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// Initialize counters when visible
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.dataset.count) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(counter => {
  counterObserver.observe(counter);
});

/**
 * TYPING EFFECT
 * Usage: Add data-typing="Your text here" to element
 */
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize typing effect
const typingObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.dataset.typing) {
      typeWriter(entry.target, entry.target.dataset.typing, 30);
      typingObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-typing]').forEach(el => {
  typingObserver.observe(el);
});

/**
 * TABS COMPONENT
 */
function initTabs(container) {
  const tabs = container.querySelectorAll('[data-tab]');
  const panels = container.querySelectorAll('[data-panel]');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      
      // Update active states
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      container.querySelector(`[data-panel="${target}"]`)?.classList.add('active');
    });
  });
}

// Auto-initialize tabs
document.querySelectorAll('[data-tabs]').forEach(initTabs);

/**
 * ACCORDION COMPONENT
 */
function initAccordion(container) {
  const items = container.querySelectorAll('.accordion-item');
  
  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all items
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-content').style.maxHeight = null;
      });
      
      // Open clicked item if it was closed
      if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// Auto-initialize accordions
document.querySelectorAll('[data-accordion]').forEach(initAccordion);

/**
 * FORM VALIDATION
 */
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add('error');
      
      // Remove error on input
      input.addEventListener('input', () => {
        input.classList.remove('error');
      }, { once: true });
    }
  });
  
  // Email validation
  const emailInput = form.querySelector('input[type="email"]');
  if (emailInput && emailInput.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      isValid = false;
      emailInput.classList.add('error');
    }
  }
  
  return isValid;
}

// Attach to forms
document.querySelectorAll('form[data-validate]').forEach(form => {
  form.addEventListener('submit', (e) => {
    if (!validateForm(form)) {
      e.preventDefault();
    }
  });
});

/**
 * LAZY LOADING IMAGES
 */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * UTILITY FUNCTIONS
 */

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Detect touch device
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
document.body.classList.toggle('touch-device', isTouchDevice);

/**
 * PERFORMANCE: Reduce motion preference
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  document.documentElement.style.setProperty('--transition-base', '0ms');
  document.documentElement.style.setProperty('--transition-slow', '0ms');
}

/**
 * CONSOLE WELCOME MESSAGE
 */
console.log('%c🎯 Welcome to GLOBAL-MKTS.COM', 'font-size: 20px; font-weight: bold; color: #E53935;');
console.log('%cBuilt by Zeeshan Sabri | Transformation Architect', 'font-size: 12px; color: #C9A227;');
