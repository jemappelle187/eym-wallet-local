// SendNReceive - 2026 Fintech Platform JavaScript
console.log('SendNReceive script loaded successfully');

// Typewriter Effect for Hero Subtitle
function initializeTypewriter() {
  const typewriterElement = document.getElementById('typewriter-subtitle');
  
  if (typewriterElement && window.Typewriter) {
    new Typewriter(typewriterElement, {
      strings: [
        'Send money instantly to Africa, Asia, the UAE & beyond. No hidden fees.'
      ],
      autoStart: true,
      loop: true,
      delay: 25, // Even faster typing speed for subtitle
      deleteSpeed: 20, // Faster deletion speed
      cursor: '<span style="color: #667eea;">|</span>',
      html: true
    });
  } else {
    // Fallback if TypewriterJS is not loaded
    if (typewriterElement) {
      typewriterElement.innerHTML = 'Send money instantly to Africa, Asia, the UAE & beyond. No hidden fees.';
    }
  }
}

// Dynamic Navbar Text Color System
class DynamicNavbarColors {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.observer = null;
    this.isInitialized = false;
    
    this.init();
  }
  
  init() {
    if (!this.navbar) {
      console.warn('Navbar element not found for dynamic colors');
      return;
    }
    
    this.setupIntersectionObserver();
    this.updateTextColors();
    this.isInitialized = true;
    
    // Update colors on scroll and resize
    window.addEventListener('scroll', () => this.updateTextColors());
    window.addEventListener('resize', () => this.updateTextColors());
    
    console.log('Dynamic navbar colors initialized');
  }
  
  setupIntersectionObserver() {
    // Create a small element to detect background colors
    const colorDetector = document.createElement('div');
    colorDetector.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(colorDetector);
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateTextColors();
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -70px 0px' // Account for navbar height
    });
    
    this.observer.observe(colorDetector);
  }
  
  updateTextColors() {
    if (!this.navbar) return;
    
    const navbarRect = this.navbar.getBoundingClientRect();
    const centerX = navbarRect.left + navbarRect.width / 2;
    const centerY = navbarRect.top + navbarRect.height / 2;
    
    // Get the background color at the navbar position
    const backgroundColor = this.getBackgroundColorAt(centerX, centerY);
    const brightness = this.calculateBrightness(backgroundColor);
    
    // Update CSS variables based on background brightness
    this.updateNavbarColors(brightness);
  }
  
  getBackgroundColorAt(x, y) {
    // Create a temporary canvas to sample the background
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Use html2canvas or similar library if available
    // For now, we'll use a simplified approach based on scroll position
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    
    // Determine which section we're in based on scroll position
    const sections = this.getPageSections();
    const currentSection = this.getCurrentSection(scrollY, sections);
    
    return this.getSectionBackgroundColor(currentSection);
  }
  
  getPageSections() {
    // Define the main sections of the page and their background colors
    return [
      { id: 'hero', start: 0, end: 800, color: '#1e40af' }, // Dark blue hero
      { id: 'features', start: 800, end: 1600, color: '#ffffff' }, // White features
      { id: 'we-are-here-for', start: 1600, end: 2400, color: '#f8fafc' }, // Light blue
      { id: 'your-bridge', start: 2400, end: 3200, color: '#ffffff' }, // White
      { id: 'security', start: 3200, end: 4000, color: '#1e293b' }, // Dark security
      { id: 'testimonials', start: 4000, end: 4800, color: '#ffffff' }, // White
      { id: 'cta', start: 4800, end: 5600, color: '#1e40af' }, // Dark blue CTA
      { id: 'footer', start: 5600, end: Infinity, color: '#0f172a' } // Dark footer
    ];
  }
  
  getCurrentSection(scrollY, sections) {
    return sections.find(section => 
      scrollY >= section.start && scrollY < section.end
    ) || sections[0];
  }
  
  getSectionBackgroundColor(section) {
    return section ? section.color : '#ffffff';
  }
  
  calculateBrightness(color) {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance;
  }
  
  updateNavbarColors(brightness) {
    const root = document.documentElement;
    
    if (brightness < 0.5) {
      // Dark background - use light text
      root.style.setProperty('--navbar-text-primary', '#ffffff');
      root.style.setProperty('--navbar-text-secondary', '#e2e8f0');
      root.style.setProperty('--navbar-text-hover', '#ffffff');
      root.style.setProperty('--navbar-text-active', '#ffffff');
      root.style.setProperty('--navbar-logo-color', '#ffffff');
    } else {
      // Light background - use dark text
      root.style.setProperty('--navbar-text-primary', '#1f2937');
      root.style.setProperty('--navbar-text-secondary', '#4b5563');
      root.style.setProperty('--navbar-text-hover', '#1e40af');
      root.style.setProperty('--navbar-text-active', '#1e40af');
      root.style.setProperty('--navbar-logo-color', '#1e40af');
    }
  }
}

// Loading Screen Management
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  
  // Initialize dynamic navbar colors
  const dynamicNavbar = new DynamicNavbarColors();
  
  // Initialize typewriter effect
  initializeTypewriter();
  
  const loadingScreen = document.getElementById('loadingScreen');
  
  // Ensure loading screen exists
  if (loadingScreen) {
    console.log('Loading screen found, starting hide process');
    // Simulate loading process
    setTimeout(() => {
      console.log('Adding hidden class to loading screen');
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        console.log('Setting loading screen display to none');
        loadingScreen.style.display = 'none';
      }, 500);
    }, 2000);
  } else {
    console.warn('Loading screen element not found');
  }
  
  // Force hide loading screen after 3 seconds as fallback
  setTimeout(() => {
    if (loadingScreen && loadingScreen.style.display !== 'none') {
      console.log('Force-hiding loading screen after timeout');
      loadingScreen.style.display = 'none';
      console.log('Loading screen force-hidden after timeout');
    }
  }, 3000);
  
  // Manual override: Press 'L' key to hide loading screen immediately
  document.addEventListener('keydown', (e) => {
    if (e.key === 'l' || e.key === 'L') {
      if (loadingScreen) {
        console.log('Manually hiding loading screen');
        loadingScreen.style.display = 'none';
        console.log('Loading screen manually hidden');
      }
    }
  });
});

// Navbar scroll hide functionality
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
const scrollThreshold = 100; // Minimum scroll distance before hiding

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Only hide/show navbar after scrolling past threshold
  if (scrollTop > scrollThreshold) {
    if (scrollTop > lastScrollTop) {
      // Scrolling down - hide navbar
      navbar.classList.add('nav-hidden');
    } else {
      // Scrolling up - show navbar
      navbar.classList.remove('nav-hidden');
    }
  } else {
    // At top of page - always show navbar
    navbar.classList.remove('nav-hidden');
  }
  
  lastScrollTop = scrollTop;
});

// Mobile Navigation Management - FIXED HAMBURGER MENU
class MobileNavigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.getElementById('hamburger');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.dropdowns = document.querySelectorAll('.dropdown');
    this.isMenuOpen = false;
    
    this.init();
  }
  
  init() {
    this.setupHamburgerMenu();
    this.setupDropdowns();
    this.setupMobileOptimizations();
    this.setupTouchOptimizations();
  }
  
  setupHamburgerMenu() {
    if (this.hamburger && this.navMenu) {
      // Remove any existing event listeners
      const newHamburger = this.hamburger.cloneNode(true);
      this.hamburger.parentNode.replaceChild(newHamburger, this.hamburger);
      this.hamburger = newHamburger;
      
      // Add proper ARIA attributes
      this.hamburger.setAttribute('aria-label', 'Toggle navigation menu');
      this.hamburger.setAttribute('aria-expanded', 'false');
      this.hamburger.setAttribute('aria-controls', 'nav-menu');
      
      // Add click event listener
      this.hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleMenu();
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.isMenuOpen && !this.navbar.contains(e.target)) {
          this.closeMenu();
        }
      });
      
      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isMenuOpen) {
          this.closeMenu();
        }
      });
      
      // Close menu when clicking on nav links
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMenu();
        });
      });
    }
  }
  
  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
  
  openMenu() {
    this.hamburger.classList.add('active');
    this.navMenu.classList.add('active');
    this.hamburger.setAttribute('aria-expanded', 'true');
    this.isMenuOpen = true;
    
    // Add body class for drawer open state
    document.body.classList.add('drawer-open');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
    
    // Update hamburger text label
    const textLabel = this.hamburger.querySelector('text');
    if (textLabel) {
      textLabel.textContent = 'close';
    }
    
    // Focus management
    const firstLink = this.navMenu.querySelector('a');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }
  
  closeMenu() {
    this.hamburger.classList.remove('active');
    this.navMenu.classList.remove('active');
    this.hamburger.setAttribute('aria-expanded', 'false');
    this.isMenuOpen = false;
    
    // Remove body class for drawer open state
    document.body.classList.remove('drawer-open');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Update hamburger text label
    const textLabel = this.hamburger.querySelector('text');
    if (textLabel) {
      textLabel.textContent = 'menu';
    }
    
    // Return focus to hamburger
    this.hamburger.focus();
  }
  
  setupDropdowns() {
    this.dropdowns.forEach(dropdown => {
      const dropdownToggle = dropdown.querySelector('.nav-link');
      const dropdownMenu = dropdown.querySelector('.dropdown-menu');
      
      if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', (e) => {
          e.preventDefault();
          dropdown.classList.toggle('active');
        });
      }
    });
  }
  
  setupMobileOptimizations() {
    // Add mobile-specific classes
    if (window.innerWidth <= 768) {
      document.body.classList.add('mobile-device');
    }
    
    // Handle resize events
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }
  
  setupTouchOptimizations() {
    // Add touch feedback to interactive elements
    const touchElements = document.querySelectorAll('.btn, .nav-link, .dropdown-item');
    
    touchElements.forEach(element => {
      element.addEventListener('touchstart', () => {
        element.style.transform = 'scale(0.98)';
      });
      
      element.addEventListener('touchend', () => {
        element.style.transform = '';
      });
    });
  }
}

// Initialize mobile navigation
document.addEventListener('DOMContentLoaded', () => {
  new MobileNavigation();
  
  // Mobile-specific download functionality
  setupMobileDownloads();
  
  // Mobile-specific cookie banner improvements
  setupMobileCookieBanner();
});

// Mobile Download Functionality
function setupMobileDownloads() {
  const mobileDownloadLinks = document.querySelectorAll('.mobile-app-link');
  
  mobileDownloadLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const platform = link.getAttribute('data-platform');
      
      // Detect if user is on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Direct app store links for mobile users
        if (platform === 'ios') {
          window.open('https://apps.apple.com/app/sendnreceive', '_blank');
        } else if (platform === 'android') {
          window.open('https://play.google.com/store/apps/details?id=com.sendnreceive', '_blank');
        }
      } else {
        // Show QR code or redirect for desktop users
        showDownloadOptions();
      }
    });
  });
}

// Mobile Cookie Banner Improvements
function setupMobileCookieBanner() {
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAcceptAll = document.getElementById('cookieAcceptAll');
  const cookieCustomize = document.getElementById('cookieCustomize');
  
  if (cookieBanner && cookieAcceptAll) {
    // Auto-dismiss cookie banner after 5 seconds on mobile
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        if (cookieBanner.style.display !== 'none') {
          cookieBanner.style.opacity = '0';
          setTimeout(() => {
            cookieBanner.style.display = 'none';
          }, 300);
        }
      }, 5000);
    }
    
    // Improved mobile cookie banner interaction
    cookieAcceptAll.addEventListener('click', () => {
      cookieBanner.style.opacity = '0';
      setTimeout(() => {
        cookieBanner.style.display = 'none';
      }, 300);
      
      // Save cookie preferences
      localStorage.setItem('cookiePreferences', 'all');
    });
    
    cookieCustomize.addEventListener('click', () => {
      // Customize functionality is handled within the floating banner
      // No need for separate modal
    });
  }
}

// Mobile Cookie Modal - Removed old modal functionality
// function showCookieModal() {
//   const modal = document.getElementById('cookieModalOverlay');
//   if (modal) {
//     modal.style.display = 'flex';
//     
//     // Close modal when clicking outside
//     modal.addEventListener('click', (e) => {
//       if (e.target === modal) {
//         modal.style.display = 'none';
//       }
//     });
//   }
// }

// Navigation Management
class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.getElementById('hamburger');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    
    this.init();
  }
  
  init() {
    this.setupMobileMenu();
    this.setupScrollSpy();
    this.setupStickyNav();
    this.setupSmoothScrolling();
  }
  
  setupMobileMenu() {
    // Mobile menu is now handled by MobileNavigation class
    // This method is kept for compatibility but disabled
    console.log('Mobile menu handled by MobileNavigation class');
  }
  
  setupScrollSpy() {
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollY = window.pageYOffset;
      
      this.sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      this.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }
  
  setupStickyNav() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    });
  }
  
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Animation Observer
class AnimationObserver {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    this.init();
  }
  
  init() {
    document.querySelectorAll('[data-aos]').forEach(element => {
      this.observer.observe(element);
    });
  }
}

// Statistics Counter Animation
class StatsCounter {
  constructor() {
    this.stats = document.querySelectorAll('.stat-number[data-target]');
    this.init();
  }
  
  init() {
    this.stats.forEach(stat => {
      this.observer.observe(stat);
    });
  }
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.animateCounter(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }
}

// Currency Hedging Chart
class HedgingChart {
  constructor() {
    this.canvas = document.getElementById('hedgingChart');
    if (this.canvas) {
      this.init();
    }
  }
  
  init() {
    const ctx = this.canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0.1)');
    
    // Simulate chart data
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Local Currency',
          data: [100, 95, 88, 82, 75, 68],
          borderColor: '#f5576c',
          backgroundColor: 'rgba(245, 87, 108, 0.1)',
          tension: 0.4
        },
        {
          label: 'Hedged Portfolio',
          data: [100, 102, 105, 108, 112, 115],
          borderColor: '#4facfe',
          backgroundColor: gradient,
          tension: 0.4
        }
      ]
    };
    
    // Create simple chart visualization
    this.drawChart(ctx, data);
  }
  
  drawChart(ctx, data) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const padding = 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height - 2 * padding) * i / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Draw data lines
    data.datasets.forEach((dataset, index) => {
      ctx.strokeStyle = dataset.borderColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      dataset.data.forEach((value, i) => {
        const x = padding + (width - 2 * padding) * i / (data.labels.length - 1);
        const y = height - padding - (height - 2 * padding) * (value - 60) / 60;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    });
  }
}



// Impact Chart Animation
class ImpactChart {
  constructor() {
    this.bars = document.querySelectorAll('.chart-bar');
    this.init();
  }
  
  init() {
    this.bars.forEach((bar, index) => {
      setTimeout(() => {
        const fill = bar.querySelector('.bar-fill');
        if (fill) {
          fill.style.width = bar.getAttribute('data-value') + '%';
        }
      }, index * 500);
    });
  }
}

// Parallax Effects
class ParallaxEffects {
  constructor() {
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.hero-particles, .hero-grid');
      
      parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }
}

// Form Validation and Enhancement
class FormEnhancement {
  constructor() {
    this.init();
  }
  
  init() {
    // Add floating labels
    document.querySelectorAll('input, textarea, select').forEach(input => {
      if (input.value) {
        input.parentElement.classList.add('has-value');
      }
      
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
        if (input.value) {
          input.parentElement.classList.add('has-value');
        } else {
          input.parentElement.classList.remove('has-value');
        }
      });
    });
  }
}

// Performance Optimization
class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Handle scroll-based animations
      }, 16);
    });
  }
}

// Error Handling
class ErrorHandler {
  constructor() {
    this.init();
  }
  
  init() {
    window.addEventListener('error', (event) => {
      console.error('JavaScript Error:', event.error);
      // Send to analytics service in production
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      // Send to analytics service in production
    });
  }
}

// Analytics and Tracking
class Analytics {
  constructor() {
    this.init();
  }
  
  init() {
    // Track page views
    this.trackPageView();
    
    // Track button clicks
    document.querySelectorAll('a[href], button').forEach(element => {
      element.addEventListener('click', (e) => {
        this.trackEvent('click', element.textContent || element.getAttribute('href'));
      });
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll % 25 === 0) {
          this.trackEvent('scroll_depth', `${maxScroll}%`);
        }
      }
    });
  }
  
  trackPageView() {
    // Send page view to analytics
    console.log('Page View:', window.location.pathname);
  }
  
  trackEvent(action, label) {
    // Send event to analytics
    console.log('Event:', action, label);
  }
}

// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.init();
  }
  
  init() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
    
    // Auto-detect dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setTheme('dark');
    }
  }
  
  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

// Accessibility Enhancements
class AccessibilityEnhancer {
  constructor() {
    this.init();
  }
  
  init() {
    // Add skip links
    this.addSkipLinks();
    
    // Enhance keyboard navigation
    this.enhanceKeyboardNav();
    
    // Add ARIA labels
    this.addAriaLabels();
  }
  
  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 10000;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  enhanceKeyboardNav() {
    // Add keyboard navigation for custom elements
    document.querySelectorAll('[role="button"], [tabindex]').forEach(element => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });
  }
  
  addAriaLabels() {
    // Add missing ARIA labels
    document.querySelectorAll('button:not([aria-label])').forEach(button => {
      if (!button.textContent.trim()) {
        button.setAttribute('aria-label', 'Button');
      }
    });
  }
}

// Auto Language Detector based on IP Geolocation
class AutoLanguageDetector {
  constructor() {
      this.supportedLanguages = {
    'US': 'en',
    'GB': 'en', 
    'CA': 'en',
    'AU': 'en',
    'NG': 'en', // Nigeria
    'GH': 'en', // Ghana
    'KE': 'sw', // Kenya - Swahili
    'ZA': 'en', // South Africa
    'FR': 'fr',
    'DE': 'de',
    'ES': 'es',
    'IT': 'it',
    'PT': 'pt',
    'NL': 'nl',
    'BE': 'nl',
    'CH': 'de',
    'AT': 'de',
    'CN': 'zh',
    'JP': 'ja',
    'KR': 'ko',
    'IN': 'hi',
    'BR': 'pt',
    'MX': 'es',
    'AR': 'es',
    'CO': 'es',
    'PE': 'es',
    'VE': 'es',
    'CL': 'es',
    'EC': 'es',
    'BO': 'es',
    'PY': 'es',
    'UY': 'es',
    'GY': 'en',
    'SR': 'nl',
    'GF': 'fr',
    'FK': 'en',
    'SA': 'ar', // Saudi Arabia - Arabic
    'EG': 'ar', // Egypt - Arabic
    'AE': 'ar', // UAE - Arabic
    'MA': 'ar', // Morocco - Arabic
    'TN': 'ar', // Tunisia - Arabic
    'DZ': 'ar', // Algeria - Arabic
    'LY': 'ar', // Libya - Arabic
    'SD': 'ar', // Sudan - Arabic
    'TD': 'ar', // Chad - Arabic
    'NE': 'ha', // Niger - Hausa
    'CM': 'fr', // Cameroon - French
    'BF': 'fr', // Burkina Faso - French
    'ML': 'fr', // Mali - French
    'SN': 'fr', // Senegal - French
    'CI': 'fr', // Ivory Coast - French
    'TG': 'fr', // Togo - French
    'BJ': 'fr', // Benin - French
    'MG': 'fr', // Madagascar - French
    'RW': 'sw', // Rwanda - Swahili
    'TZ': 'sw', // Tanzania - Swahili
    'UG': 'sw', // Uganda - Swahili
    'BI': 'sw', // Burundi - Swahili
    'CD': 'sw', // DR Congo - Swahili
    'AO': 'pt', // Angola - Portuguese
    'MZ': 'pt', // Mozambique - Portuguese
    'GW': 'pt', // Guinea-Bissau - Portuguese
    'CV': 'pt', // Cape Verde - Portuguese
    'ST': 'pt', // Sao Tome - Portuguese
    'TL': 'pt'  // Timor-Leste - Portuguese
  };
    
    this.defaultLanguage = 'en';
    this.currentLanguage = this.defaultLanguage;
    this.init();
  }

  async init() {
    try {
      await this.detectLanguage();
      this.applyLanguage();
    } catch (error) {
      console.log('Language detection failed, using default:', this.defaultLanguage);
      this.currentLanguage = this.defaultLanguage;
      this.applyLanguage();
    }
  }

  async detectLanguage() {
    try {
      // Use ipapi.co for geolocation (free tier available)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data && data.country_code) {
        const countryCode = data.country_code.toUpperCase();
        const detectedLanguage = this.supportedLanguages[countryCode];
        
        if (detectedLanguage) {
          this.currentLanguage = detectedLanguage;
          console.log(`Language detected: ${detectedLanguage} (Country: ${countryCode})`);
        } else {
          console.log(`Country ${countryCode} not in supported languages, using default`);
        }
      }
    } catch (error) {
      console.error('Error detecting language:', error);
      throw error;
    }
  }

  applyLanguage() {
    // Set language attribute on html element
    document.documentElement.lang = this.currentLanguage;
    
    // Store in localStorage for future visits
    localStorage.setItem('preferred-language', this.currentLanguage);
    
    // Add language class to body for CSS targeting
    document.body.classList.add(`lang-${this.currentLanguage}`);
    
    // Trigger custom event for other components
    const event = new CustomEvent('languageChanged', {
      detail: { language: this.currentLanguage }
    });
    document.dispatchEvent(event);
    
    console.log(`Language applied: ${this.currentLanguage}`);
  }

  // Method to manually change language
  setLanguage(languageCode) {
    // Check if the language code is valid
    const validLanguages = ['en', 'es', 'fr', 'de', 'nl', 'pt', 'zh', 'ja', 'ko', 'hi', 'ar', 'sw', 'yo', 'ha', 'tw'];
    if (validLanguages.includes(languageCode)) {
      this.currentLanguage = languageCode;
      this.applyLanguage();
      
      // Dispatch custom event for language change
      document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: languageCode }
      }));
      
      return true;
    }
    return false;
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Get supported languages
  getSupportedLanguages() {
    return Object.values(this.supportedLanguages);
  }
}

// Initialize auto language detector
const languageDetector = new AutoLanguageDetector();

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
  new AnimationObserver();
  new StatsCounter();
  new HedgingChart();
  new ImpactChart();
  new ParallaxEffects();
  new FormEnhancement();
  new PerformanceOptimizer();
  new ErrorHandler();
  new Analytics();
  new ThemeManager();
  new AccessibilityEnhancer();
  
  console.log('SendNReceive 2026 Fintech Platform initialized successfully!');
});

// Language selector functionality
document.addEventListener('DOMContentLoaded', function() {
  const languageMenu = document.querySelector('.language-menu');
  const currentLangElement = document.querySelector('.current-lang');
  
  if (languageMenu) {
    console.log('Language menu found, setting up event listeners...');
    
    languageMenu.addEventListener('click', function(e) {
      const dropdownItem = e.target.closest('.dropdown-item');
      if (dropdownItem) {
        e.preventDefault();
        e.stopPropagation();
        
        const langCode = dropdownItem.getAttribute('data-lang');
        console.log('Language selected:', langCode);
        
        if (langCode && languageDetector.setLanguage(langCode)) {
          console.log('Language changed successfully to:', langCode);
          
          // Show success feedback
          showLanguageChangeFeedback(langCode);
        } else {
          console.log('Failed to change language to:', langCode);
        }
      }
    });
  } else {
    console.log('Language menu not found');
  }
  
  // Update current language display on page load
  if (currentLangElement) {
    currentLangElement.textContent = languageDetector.getCurrentLanguage().toUpperCase();
  }
});

// Show language change feedback
function showLanguageChangeFeedback(languageCode) {
  const languageNames = {
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'nl': 'Nederlands',
    'pt': 'Português',
    'zh': '中文',
    'ja': '日本語',
    'ko': '한국어',
    'hi': 'हिन्दी',
    'ar': 'العربية',
    'sw': 'Kiswahili',
    'yo': 'Yorùbá',
    'ha': 'Hausa',
    'tw': 'Twi'
  };
  
  const languageName = languageNames[languageCode] || languageCode.toUpperCase();
  
  // Create a temporary notification
  const notification = document.createElement('div');
  notification.className = 'language-notification';
  notification.innerHTML = `
    <span class="notification-icon">✅</span>
    <span class="notification-text">Language changed to ${languageName}</span>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-brand-blue);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Listen for language change events
document.addEventListener('languageChanged', function(e) {
  console.log('Language changed to:', e.detail.language);
  
  // Update current language display
  const currentLangElement = document.querySelector('.current-lang');
  const currentFlagElement = document.querySelector('.current-flag');
  
  if (currentLangElement) {
    currentLangElement.textContent = e.detail.language.toUpperCase();
  }
  
  // Update flag icon
  if (currentFlagElement) {
    // Remove existing flag classes
    currentFlagElement.className = 'flag-icon current-flag';
    // Add new flag class
    currentFlagElement.classList.add(`flag-icon-${e.detail.language}`);
  }
  
  // You can add more language-specific functionality here
  // For example, loading translated content, updating meta tags, etc.
});

// Real-time exchange rates from mobile app APIs
let calcRates = {};
let lastRatesUpdate = null;

// Fetch real-time exchange rates from the same APIs used in mobile app
async function fetchExchangeRates() {
  try {
    // Fetch traditional rates from exchangerate-api.com
    const traditionalResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const traditionalData = await traditionalResponse.json();
    
    // Fetch stablecoin rates from CoinGecko
    const stablecoinResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,euro-coin,solana&vs_currencies=usd,eur,ghs,ngn,aed');
    const stablecoinData = await stablecoinResponse.json();
    
    // Build comprehensive rates object
    const rates = {
      traditional: traditionalData.rates,
      stablecoin: stablecoinData,
      timestamp: new Date().toISOString()
    };
    
    // Convert to our calculator format
    calcRates = {
      // USD pairs
      'USD_GHS': rates.traditional.GHS || 14.5,
      'USD_NGN': rates.traditional.NGN || 1500,
      'USD_KES': rates.traditional.KES || 160,
      'USD_UGX': rates.traditional.UGX || 3800,
      'USD_ZAR': rates.traditional.ZAR || 18.5,
      'USD_ZMW': rates.traditional.ZMW || 25.8,
      'USD_CAD': rates.traditional.CAD || 1.35,
      'USD_AUD': rates.traditional.AUD || 1.52,
      'USD_CHF': rates.traditional.CHF || 0.88,
      'USD_GBP': rates.traditional.GBP || 0.79,
      'USD_EUR': rates.traditional.EUR || 0.92,
      
      // EUR pairs
      'EUR_GHS': (rates.traditional.GHS || 14.5) / (rates.traditional.EUR || 0.92),
      'EUR_NGN': (rates.traditional.NGN || 1500) / (rates.traditional.EUR || 0.92),
      'EUR_KES': (rates.traditional.KES || 160) / (rates.traditional.EUR || 0.92),
      'EUR_UGX': (rates.traditional.UGX || 3800) / (rates.traditional.EUR || 0.92),
      'EUR_ZAR': (rates.traditional.ZAR || 18.5) / (rates.traditional.EUR || 0.92),
      'EUR_ZMW': (rates.traditional.ZMW || 25.8) / (rates.traditional.EUR || 0.92),
      'EUR_CAD': (rates.traditional.CAD || 1.35) / (rates.traditional.EUR || 0.92),
      'EUR_AUD': (rates.traditional.AUD || 1.52) / (rates.traditional.EUR || 0.92),
      'EUR_CHF': (rates.traditional.CHF || 0.88) / (rates.traditional.EUR || 0.92),
      'EUR_GBP': (rates.traditional.GBP || 0.79) / (rates.traditional.EUR || 0.92),
      'EUR_USD': 1 / (rates.traditional.EUR || 0.92),
      
      // GBP pairs
      'GBP_GHS': (rates.traditional.GHS || 14.5) / (rates.traditional.GBP || 0.79),
      'GBP_NGN': (rates.traditional.NGN || 1500) / (rates.traditional.GBP || 0.79),
      'GBP_KES': (rates.traditional.KES || 160) / (rates.traditional.GBP || 0.79),
      'GBP_UGX': (rates.traditional.UGX || 3800) / (rates.traditional.GBP || 0.79),
      'GBP_ZAR': (rates.traditional.ZAR || 18.5) / (rates.traditional.GBP || 0.79),
      'GBP_ZMW': (rates.traditional.ZMW || 25.8) / (rates.traditional.GBP || 0.79),
      'GBP_CAD': (rates.traditional.CAD || 1.35) / (rates.traditional.GBP || 0.79),
      'GBP_AUD': (rates.traditional.AUD || 1.52) / (rates.traditional.GBP || 0.79),
      'GBP_CHF': (rates.traditional.CHF || 0.88) / (rates.traditional.GBP || 0.79),
      'GBP_EUR': (rates.traditional.EUR || 0.92) / (rates.traditional.GBP || 0.79),
      'GBP_USD': 1 / (rates.traditional.GBP || 0.79),
      
      // Reverse pairs for all currencies
      'GHS_USD': 1 / (rates.traditional.GHS || 14.5),
      'NGN_USD': 1 / (rates.traditional.NGN || 1500),
      'KES_USD': 1 / (rates.traditional.KES || 160),
      'UGX_USD': 1 / (rates.traditional.UGX || 3800),
      'ZAR_USD': 1 / (rates.traditional.ZAR || 18.5),
      'ZMW_USD': 1 / (rates.traditional.ZMW || 25.8),
      'CAD_USD': 1 / (rates.traditional.CAD || 1.35),
      'AUD_USD': 1 / (rates.traditional.AUD || 1.52),
      'CHF_USD': 1 / (rates.traditional.CHF || 0.88),
      
      'GHS_EUR': 1 / ((rates.traditional.GHS || 14.5) / (rates.traditional.EUR || 0.92)),
      'NGN_EUR': 1 / ((rates.traditional.NGN || 1500) / (rates.traditional.EUR || 0.92)),
      'KES_EUR': 1 / ((rates.traditional.KES || 160) / (rates.traditional.EUR || 0.92)),
      'UGX_EUR': 1 / ((rates.traditional.UGX || 3800) / (rates.traditional.EUR || 0.92)),
      'ZAR_EUR': 1 / ((rates.traditional.ZAR || 18.5) / (rates.traditional.EUR || 0.92)),
      'ZMW_EUR': 1 / ((rates.traditional.ZMW || 25.8) / (rates.traditional.EUR || 0.92)),
      'CAD_EUR': 1 / ((rates.traditional.CAD || 1.35) / (rates.traditional.EUR || 0.92)),
      'AUD_EUR': 1 / ((rates.traditional.AUD || 1.52) / (rates.traditional.EUR || 0.92)),
      'CHF_EUR': 1 / ((rates.traditional.CHF || 0.88) / (rates.traditional.EUR || 0.92)),
      
      'GHS_GBP': 1 / ((rates.traditional.GHS || 14.5) / (rates.traditional.GBP || 0.79)),
      'NGN_GBP': 1 / ((rates.traditional.NGN || 1500) / (rates.traditional.GBP || 0.79)),
      'KES_GBP': 1 / ((rates.traditional.KES || 160) / (rates.traditional.GBP || 0.79)),
      'UGX_GBP': 1 / ((rates.traditional.UGX || 3800) / (rates.traditional.GBP || 0.79)),
      'ZAR_GBP': 1 / ((rates.traditional.ZAR || 18.5) / (rates.traditional.GBP || 0.79)),
      'ZMW_GBP': 1 / ((rates.traditional.ZMW || 25.8) / (rates.traditional.GBP || 0.79)),
      'CAD_GBP': 1 / ((rates.traditional.CAD || 1.35) / (rates.traditional.GBP || 0.79)),
      'AUD_GBP': 1 / ((rates.traditional.AUD || 1.52) / (rates.traditional.GBP || 0.79)),
      'CHF_GBP': 1 / ((rates.traditional.CHF || 0.88) / (rates.traditional.GBP || 0.79)),
      
      // Cross-currency pairs
      'GHS_NGN': (rates.traditional.NGN || 1500) / (rates.traditional.GHS || 14.5),
      'GHS_KES': (rates.traditional.KES || 160) / (rates.traditional.GHS || 14.5),
      'GHS_UGX': (rates.traditional.UGX || 3800) / (rates.traditional.GHS || 14.5),
      'GHS_ZAR': (rates.traditional.ZAR || 18.5) / (rates.traditional.GHS || 14.5),
      'GHS_ZMW': (rates.traditional.ZMW || 25.8) / (rates.traditional.GHS || 14.5),
      'GHS_CAD': (rates.traditional.CAD || 1.35) / (rates.traditional.GHS || 14.5),
      'GHS_AUD': (rates.traditional.AUD || 1.52) / (rates.traditional.GHS || 14.5),
      'GHS_CHF': (rates.traditional.CHF || 0.88) / (rates.traditional.GHS || 14.5),
      
      'NGN_KES': (rates.traditional.KES || 160) / (rates.traditional.NGN || 1500),
      'NGN_UGX': (rates.traditional.UGX || 3800) / (rates.traditional.NGN || 1500),
      'NGN_ZAR': (rates.traditional.ZAR || 18.5) / (rates.traditional.NGN || 1500),
      'NGN_ZMW': (rates.traditional.ZMW || 25.8) / (rates.traditional.NGN || 1500),
      'NGN_CAD': (rates.traditional.CAD || 1.35) / (rates.traditional.NGN || 1500),
      'NGN_AUD': (rates.traditional.AUD || 1.52) / (rates.traditional.NGN || 1500),
      'NGN_CHF': (rates.traditional.CHF || 0.88) / (rates.traditional.NGN || 1500),
      
      'KES_UGX': (rates.traditional.UGX || 3800) / (rates.traditional.KES || 160),
      'KES_ZAR': (rates.traditional.ZAR || 18.5) / (rates.traditional.KES || 160),
      'KES_ZMW': (rates.traditional.ZMW || 25.8) / (rates.traditional.KES || 160),
      'KES_CAD': (rates.traditional.CAD || 1.35) / (rates.traditional.KES || 160),
      'KES_AUD': (rates.traditional.AUD || 1.52) / (rates.traditional.KES || 160),
      'KES_CHF': (rates.traditional.CHF || 0.88) / (rates.traditional.KES || 160),
      
      'UGX_ZAR': (rates.traditional.ZAR || 18.5) / (rates.traditional.UGX || 3800),
      'UGX_ZMW': (rates.traditional.ZMW || 25.8) / (rates.traditional.UGX || 3800),
      'UGX_CAD': (rates.traditional.CAD || 1.35) / (rates.traditional.UGX || 3800),
      'UGX_AUD': (rates.traditional.AUD || 1.52) / (rates.traditional.UGX || 3800),
      'UGX_CHF': (rates.traditional.CHF || 0.88) / (rates.traditional.UGX || 3800),
      
      'ZAR_ZMW': (rates.traditional.ZMW || 25.8) / (rates.traditional.ZAR || 18.5),
      'ZAR_CAD': (rates.traditional.CAD || 1.35) / (rates.traditional.ZAR || 18.5),
      'ZAR_AUD': (rates.traditional.AUD || 1.52) / (rates.traditional.ZAR || 18.5),
      'ZAR_CHF': (rates.traditional.CHF || 0.88) / (rates.traditional.ZAR || 18.5),
      
      'ZMW_CAD': (rates.traditional.CAD || 1.35) / (rates.traditional.ZMW || 25.8),
      'ZMW_AUD': (rates.traditional.AUD || 1.52) / (rates.traditional.ZMW || 25.8),
      'ZMW_CHF': (rates.traditional.CHF || 0.88) / (rates.traditional.ZMW || 25.8),
      
      'CAD_AUD': (rates.traditional.AUD || 1.52) / (rates.traditional.CAD || 1.35),
      'CAD_CHF': (rates.traditional.CHF || 0.88) / (rates.traditional.CAD || 1.35),
      
      'AUD_CHF': (rates.traditional.CHF || 0.88) / (rates.traditional.AUD || 1.52)
    };
    
    lastRatesUpdate = new Date();
    console.log('Exchange rates updated:', lastRatesUpdate);
    
    // Update calculator display
    updateCalc();
    
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Fallback to static rates if API fails
    calcRates = {
      // USD pairs
      'USD_GHS': 14.5, 'USD_NGN': 1500, 'USD_KES': 160, 'USD_UGX': 3800, 'USD_ZAR': 18.5, 'USD_ZMW': 25.8,
      'USD_CAD': 1.35, 'USD_AUD': 1.52, 'USD_CHF': 0.88, 'USD_GBP': 0.79, 'USD_EUR': 0.92,
      // EUR pairs
      'EUR_GHS': 15.7, 'EUR_NGN': 1630, 'EUR_KES': 174, 'EUR_UGX': 4130, 'EUR_ZAR': 20.1, 'EUR_ZMW': 28.0,
      'EUR_CAD': 1.47, 'EUR_AUD': 1.65, 'EUR_CHF': 0.96, 'EUR_GBP': 0.86, 'EUR_USD': 1.09,
      // GBP pairs
      'GBP_GHS': 18.3, 'GBP_NGN': 1900, 'GBP_KES': 203, 'GBP_UGX': 4810, 'GBP_ZAR': 23.4, 'GBP_ZMW': 32.6,
      'GBP_CAD': 1.71, 'GBP_AUD': 1.92, 'GBP_CHF': 1.12, 'GBP_EUR': 1.16, 'GBP_USD': 1.27,
      // African currencies
      'GHS_NGN': 103, 'GHS_KES': 11.0, 'GHS_UGX': 262, 'GHS_ZAR': 1.28, 'GHS_ZMW': 1.78,
      'NGN_KES': 0.107, 'NGN_UGX': 2.53, 'NGN_ZAR': 0.0123, 'NGN_ZMW': 0.0172,
      'KES_UGX': 23.8, 'KES_ZAR': 0.116, 'KES_ZMW': 0.161,
      'UGX_ZAR': 0.00487, 'UGX_ZMW': 0.00679,
      'ZAR_ZMW': 1.39,
      // Reverse pairs
      'GHS_USD': 0.069, 'NGN_USD': 0.00067, 'KES_USD': 0.00625, 'UGX_USD': 0.00026, 'ZAR_USD': 0.054, 'ZMW_USD': 0.0388,
      'GHS_EUR': 0.064, 'NGN_EUR': 0.00061, 'KES_EUR': 0.00575, 'UGX_EUR': 0.00024, 'ZAR_EUR': 0.0498, 'ZMW_EUR': 0.0357,
      'GHS_GBP': 0.055, 'NGN_GBP': 0.00053, 'KES_GBP': 0.00493, 'UGX_GBP': 0.00021, 'ZAR_GBP': 0.0427, 'ZMW_GBP': 0.0307,
      'CAD_USD': 0.741, 'AUD_USD': 0.658, 'CHF_USD': 1.136, 'GBP_USD': 1.266,
      'CAD_EUR': 0.680, 'AUD_EUR': 0.606, 'CHF_EUR': 1.042, 'GBP_EUR': 1.163,
      'CAD_GBP': 0.585, 'AUD_GBP': 0.521, 'CHF_GBP': 0.893
    };
  }
}

// Initialize rates on page load
document.addEventListener('DOMContentLoaded', function() {
  fetchExchangeRates();
  
  // Update rates every 5 minutes
  setInterval(fetchExchangeRates, 5 * 60 * 1000);
});

function updateCalc() {
  const amount = parseFloat(document.getElementById('calcAmount').value) || 0;
  const fromCurrency = document.getElementById('calcFrom').value;
  const toCurrency = document.getElementById('calcTo').value;
  
  if (amount <= 0) {
    document.getElementById('calcConverted').textContent = 'Enter amount';
    document.getElementById('rateInfo').textContent = 'Enter amount to calculate';
    return;
  }
  
  // Get exchange rate
  const rateKey = `${fromCurrency}_${toCurrency}`;
  const rate = calcRates[rateKey] || 1;
  
  // Calculate converted amount
  const convertedAmount = amount * rate;
  
  // Format the result
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: toCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(convertedAmount);
  
  // Update display
  document.getElementById('calcConverted').textContent = formattedAmount;
  
  // Update rate info
  const rateInfo = document.getElementById('rateInfo');
  if (rate && rate !== 1) {
    const rateFormatted = rate.toFixed(4);
    rateInfo.textContent = `1 ${fromCurrency} = ${rateFormatted} ${toCurrency}`;
  } else {
    rateInfo.textContent = 'Same currency';
  }
}

function updateCalculatorDisplay() {
  // Update the calculator if it exists
  if (document.getElementById('calcAmount')) {
    updateCalc();
  }
}

// Add event listeners for the calculator
document.addEventListener('DOMContentLoaded', function() {
  const calcAmount = document.getElementById('calcAmount');
  const calcFrom = document.getElementById('calcFrom');
  const calcTo = document.getElementById('calcTo');
  const exchangeForm = document.querySelector('.exchange-form');
  
  if (calcAmount) {
    calcAmount.addEventListener('input', updateCalc);
  }
  if (calcFrom) {
    calcFrom.addEventListener('change', updateCalc);
  }
  if (calcTo) {
    calcTo.addEventListener('change', updateCalc);
  }
  if (exchangeForm) {
    exchangeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      updateCalc();
    });
  }
  
  // Initialize calculator
  updateCalc();
});

// Cookie Consent Modal logic
// Premium Cookie Banner Logic
document.addEventListener('DOMContentLoaded', function() {
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAcceptAll = document.getElementById('cookieAcceptAll');
  const cookieCustomize = document.getElementById('cookieCustomize');
  const analyticsCookies = document.getElementById('analyticsCookies');
  const marketingCookies = document.getElementById('marketingCookies');
  
  // Check if cookies were already accepted
  const cookiesAccepted = localStorage.getItem('cookiePreferences');
  
  if (!cookiesAccepted && cookieBanner) {
    // Show banner after a short delay
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1000);
  }
  
  // Accept all cookies
  if (cookieAcceptAll) {
    cookieAcceptAll.addEventListener('click', function() {
      const preferences = {
        essential: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
      cookieBanner.classList.remove('show');
      
      // Track acceptance
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted'
        });
      }
      
      showNotification('Cookie preferences saved!', 'success');
    });
  }
  
  // Customize cookies
  if (cookieCustomize) {
    cookieCustomize.addEventListener('click', function() {
      const preferences = {
        essential: true,
        analytics: analyticsCookies.checked,
        marketing: marketingCookies.checked,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
      cookieBanner.classList.remove('show');
      
      // Track custom preferences
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          'analytics_storage': preferences.analytics ? 'granted' : 'denied',
          'ad_storage': preferences.marketing ? 'granted' : 'denied'
        });
      }
      
      showNotification('Cookie preferences saved!', 'success');
    });
  }
  
  // Load saved preferences
  if (cookiesAccepted) {
    try {
      const preferences = JSON.parse(cookiesAccepted);
      if (preferences.analytics && analyticsCookies) {
        analyticsCookies.checked = true;
      }
      if (preferences.marketing && marketingCookies) {
        marketingCookies.checked = true;
      }
    } catch (e) {
      console.log('Error parsing cookie preferences');
    }
  }
});

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
      <span class="notification-text">${message}</span>
    </div>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, 1d4ed8)'};
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 500;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Newsletter form logic
document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Collect form data
      const formData = new FormData(this);
      const email = formData.get('email');
      
      // Add timestamp and user agent
      document.getElementById('timestamp').value = new Date().toISOString();
      document.getElementById('userAgent').value = navigator.userAgent;
      
      // Log the data (you can replace this with your actual API endpoint)
      const leadData = {
        email: email,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        source: 'website_newsletter',
        ip: 'Will be captured by server',
        location: 'Will be captured by server'
      };
      
      console.log('Newsletter signup:', leadData);
      
      // Show success message
      this.reset();
      alert('Thank you for subscribing! We\'ll keep you updated with the latest news and exclusive offers.');
      
      // Here you would typically send the data to your server
      // fetch('/api/newsletter-signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(leadData)
      // });
    });
  }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Navigation,
    AnimationObserver,
    StatsCounter,
    HedgingChart,
    NetworkMap,
    ImpactChart,
    ParallaxEffects,
    FormEnhancement,
    PerformanceOptimizer,
    ErrorHandler,
    Analytics,
    ThemeManager,
    AccessibilityEnhancer
  };
} 

// Animated Counters for Social Proof
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'), 10) || 0;
  const format = element.getAttribute('data-format') || '';
  const duration = 2000;
  const start = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(target * easeOutQuart);
    
    // Format the number
    let displayValue = current.toLocaleString();
    if (format === '$') {
      displayValue = '$' + displayValue;
    } else if (format === '%') {
      displayValue = displayValue + '%';
    } else if (format === '+') {
      displayValue = '+' + displayValue;
    }
    
    element.textContent = displayValue;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Intersection Observer for Social Proof Animation
document.addEventListener('DOMContentLoaded', function() {
  const statCards = document.querySelectorAll('.stat-card');
  
  if (statCards.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumber = entry.target.querySelector('.stat-number');
          if (statNumber && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            animateCounter(statNumber);
          }
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -50px 0px'
    });
    
    statCards.forEach(card => {
      statsObserver.observe(card);
    });
  }
}); 

// ===== MOBILE OPTIMIZATIONS =====
// Enhanced mobile experience without affecting desktop

class MobileOptimizer {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.touchStartY = 0;
    this.touchStartX = 0;
    
    this.init();
  }
  
  init() {
    if (this.isMobile) {
      this.setupMobileOptimizations();
      this.setupTouchGestures();
      this.setupMobilePerformance();
      this.setupMobileAccessibility();
    }
  }
  
  setupMobileOptimizations() {
    // Optimize scroll performance on mobile
    let ticking = false;
    
    const updateScroll = () => {
      // Update scroll-based animations only when needed
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Optimize resize events on mobile
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleMobileResize();
      }, 250);
    });
    
    // Reduce motion on mobile for better performance
    if (this.isMobile) {
      document.documentElement.style.setProperty('--transition-fast', '0.2s');
      document.documentElement.style.setProperty('--transition-base', '0.3s');
    }
  }
  
  setupTouchGestures() {
    if (!this.isTouchDevice) return;
    
    // Handle touch gestures for better mobile navigation
    document.addEventListener('touchstart', (e) => {
      this.touchStartY = e.touches[0].clientY;
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = this.touchStartY - touchEndY;
      const deltaX = this.touchStartX - touchEndX;
      
      // Swipe up to show navbar
      if (deltaY > 50 && Math.abs(deltaX) < 50) {
        document.querySelector('.navbar')?.classList.remove('nav-hidden');
      }
      
      // Swipe down to hide navbar
      if (deltaY < -50 && Math.abs(deltaX) < 50) {
        document.querySelector('.navbar')?.classList.add('nav-hidden');
      }
    }, { passive: true });
    
    // Optimize touch feedback
    const touchElements = document.querySelectorAll('.btn, .card, .solution-card, .security-card, .receive-method');
    touchElements.forEach(element => {
      element.addEventListener('touchstart', () => {
        element.style.transform = 'scale(0.98)';
      }, { passive: true });
      
      element.addEventListener('touchend', () => {
        element.style.transform = 'scale(1)';
      }, { passive: true });
    });
  }
  
  setupMobilePerformance() {
    // Lazy load images on mobile for better performance
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      });
      
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Optimize video playback on mobile and desktop
    const heroVideos = document.querySelectorAll('.hero-bg-video');
    heroVideos.forEach(heroVideo => {
      if (heroVideo) {
        // Ensure video is properly configured for all devices
        heroVideo.setAttribute('preload', 'metadata');
        heroVideo.setAttribute('playsinline', 'true');
        heroVideo.setAttribute('muted', 'true');
        heroVideo.setAttribute('loop', 'true');
        heroVideo.setAttribute('autoplay', 'true');
        
        // Ensure video is visible
        heroVideo.style.display = 'block';
        heroVideo.style.visibility = 'visible';
        
        // Optimize for mobile performance
        if (this.isMobile) {
          // Reduce video quality on mobile for better performance
          heroVideo.style.objectFit = 'cover';
          
          // Pause video when not visible to save battery
          const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                heroVideo.play().catch(() => {
                  // Video autoplay failed, keep it paused
                  console.log('Video autoplay failed, using fallback');
                });
              } else {
                heroVideo.pause();
              }
            });
          }, {
            threshold: 0.1,
            rootMargin: '50px'
          });
          
          videoObserver.observe(heroVideo);
        } else {
          // Desktop: ensure video plays smoothly
          heroVideo.play().catch(() => {
            console.log('Desktop video autoplay failed');
          });
        }
        
        // Handle video loading errors
        heroVideo.addEventListener('error', () => {
          console.log('Video loading error, using poster image');
          heroVideo.style.display = 'none';
          const poster = heroVideo.getAttribute('poster');
          if (poster) {
            const videoWrap = heroVideo.closest('.hero-video-wrap');
            if (videoWrap) {
              videoWrap.style.backgroundImage = `url(${poster})`;
              videoWrap.style.backgroundSize = 'cover';
              videoWrap.style.backgroundPosition = 'center';
            }
          }
        });
      }
    });
    
    // Optimize animations on mobile
    if (this.isMobile) {
      const animatedElements = document.querySelectorAll('[data-aos], .fade-in, .slide-in-left, .slide-in-right, .scale-in');
      animatedElements.forEach(element => {
        element.style.animationDuration = '0.4s';
        element.style.transitionDuration = '0.3s';
      });
    }
  }
  
  setupMobileAccessibility() {
    // Mobile navigation accessibility is now handled by MobileNavigation class
    // This section is kept for compatibility but disabled
    console.log('Mobile navigation accessibility handled by MobileNavigation class');
    
    // FIXED: Optimize scroll performance to prevent blocking
    this.optimizeScrollPerformance();
    
    // Improve mobile form accessibility
    const mobileForms = document.querySelectorAll('form');
    mobileForms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        // Ensure proper input sizing on mobile
        if (input.type === 'text' || input.type === 'email' || input.type === 'password') {
          input.style.fontSize = '16px'; // Prevents zoom on iOS
        }
        
        // Add mobile-friendly labels
        if (!input.id && !input.getAttribute('aria-label')) {
          const placeholder = input.placeholder;
          if (placeholder) {
            input.setAttribute('aria-label', placeholder);
          }
        }
      });
    });
  }
  
  handleMobileResize() {
    // Handle orientation changes and resize events
    const isLandscape = window.innerWidth > window.innerHeight;
    
    if (isLandscape && this.isMobile) {
      // Optimize for landscape mode
      document.documentElement.style.setProperty('--hero-padding', '60px 20px 30px');
      document.documentElement.style.setProperty('--hero-title-size', '2.2rem');
    } else if (this.isMobile) {
      // Optimize for portrait mode
      document.documentElement.style.setProperty('--hero-padding', '80px 20px 40px');
      document.documentElement.style.setProperty('--hero-title-size', '2.5rem');
    }
  }
  
  // FIXED: Optimize scroll performance to prevent blocking
  optimizeScrollPerformance() {
    // Prevent scroll blocking during animations
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-item');
    
    animatedElements.forEach(element => {
      // Use passive event listeners for better scroll performance
      element.addEventListener('touchstart', () => {}, { passive: true });
      element.addEventListener('touchmove', () => {}, { passive: true });
      element.addEventListener('touchend', () => {}, { passive: true });
      
      // Optimize CSS properties for better performance
      element.style.willChange = 'auto';
      element.style.transform = 'translateZ(0)';
      element.style.backfaceVisibility = 'hidden';
    });
    
    // Optimize scroll containers
    const scrollContainers = document.querySelectorAll('.container, .hero, section');
    scrollContainers.forEach(container => {
      container.style.overflowX = 'hidden';
      container.style.position = 'relative';
      container.style.willChange = 'auto';
    });
    
    // Debounce scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        // Handle scroll end
      }, 16); // ~60fps
    }, { passive: true });
  }
  
  // Mobile-specific utility methods
  static isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  static isLowEndDevice() {
    // Detect low-end devices for additional optimizations
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    return memory < 4 || cores < 4;
  }
  
  static optimizeForLowEnd() {
    if (this.isLowEndDevice()) {
      // Disable complex animations on low-end devices
      document.documentElement.style.setProperty('--animation-complexity', 'simple');
      
      // Reduce shadow complexity
      const style = document.createElement('style');
      style.textContent = `
        .card, .btn, .solution-card, .security-card {
          box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        }
        .hero-particles, .hero-waves, .hero-connections {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', () => {
  new MobileOptimizer();
  
  // Apply low-end device optimizations
  MobileOptimizer.optimizeForLowEnd();
  
  // Mobile hamburger menu functionality
  const mobileMenu = document.getElementById('nav-menu');
  const hamburger = document.getElementById('navHamburger');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', 
        hamburger.classList.contains('active').toString());
      
      // Prevent body scroll when menu is open
      if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Enhanced mobile dropdown functionality
    const dropdownItems = mobileMenu.querySelectorAll('.dropdown');
    dropdownItems.forEach(dropdown => {
      const dropdownLink = dropdown.querySelector('.nav-link');
      const dropdownMenu = dropdown.querySelector('.dropdown-menu');
      
      if (dropdownLink && dropdownMenu) {
        dropdownLink.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Close other dropdowns
          dropdownItems.forEach(otherDropdown => {
            if (otherDropdown !== dropdown) {
              otherDropdown.classList.remove('active');
            }
          });
          
          // Toggle current dropdown
          dropdown.classList.toggle('active');
        });
      }
    });
    
    // Close menu when clicking on a non-dropdown link
    const navLinks = mobileMenu.querySelectorAll('.nav-link:not(.dropdown .nav-link)');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        
        // Close all dropdowns
        dropdownItems.forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        
        // Close all dropdowns
        dropdownItems.forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      }
    });
    
    // Mobile language dropdown functionality
    const languageBtn = mobileMenu.querySelector('.language-btn');
    const languageDropdown = mobileMenu.querySelector('.nav-language-dropdown');
    
    if (languageBtn && languageDropdown) {
      languageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        languageDropdown.classList.toggle('active');
      });
      
      // Close language dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
          languageDropdown.classList.remove('active');
        }
      });
    }
  }
  
  // Mobile-specific scroll optimizations
  if (window.innerWidth <= 768) {
    // Use passive scroll listeners for better mobile performance
    const scrollElements = document.querySelectorAll('.scroll-container, .scroll-content');
    scrollElements.forEach(element => {
      element.addEventListener('scroll', () => {}, { passive: true });
    });
    
    // Optimize mobile menu performance
    const mobileMenu = document.getElementById('nav-menu');
    if (mobileMenu) {
      // Use transform instead of height for better performance
      mobileMenu.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      
      // Optimize mobile menu animations
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.opacity = '1';
          }
        });
      });
      
      observer.observe(mobileMenu);
    }
  }
});

// Mobile-specific error handling
window.addEventListener('error', (e) => {
  if (window.innerWidth <= 768) {
    // Log mobile-specific errors
    console.warn('Mobile error detected:', e.error);
    
    // Gracefully handle common mobile issues
    if (e.error && e.error.message.includes('video')) {
      // Handle video playback errors on mobile
      const heroVideo = document.querySelector('.hero-bg-video');
      if (heroVideo) {
        heroVideo.style.display = 'none';
        // Show fallback background
        document.querySelector('.hero-bg-overlay').style.background = 'var(--premium-gradient)';
      }
    }
  }
});

// Mobile-specific performance monitoring
if (window.innerWidth <= 768) {
  // Monitor mobile performance
  let frameCount = 0;
  let lastTime = performance.now();
  
  function checkPerformance() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      
      if (fps < 30) {
        // Apply performance optimizations for low FPS
        document.documentElement.style.setProperty('--animation-complexity', 'minimal');
        console.warn('Low FPS detected on mobile, applying optimizations');
      }
      
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(checkPerformance);
  }
  
  requestAnimationFrame(checkPerformance);
}

// ===== NAVBAR CONTROLS =====
// Dark Mode and Language Controls

class NavbarControls {
  constructor() {
    this.darkModeBtn = document.getElementById('darkModeBtn');
    this.languageBtn = document.getElementById('languageBtn');
    this.languageDropdown = document.getElementById('navLanguageDropdown');
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    this.init();
  }
  
  init() {
    this.setupDarkMode();
    this.setupLanguageSelector();
    this.applyInitialState();
  }
  
  setupDarkMode() {
    if (this.darkModeBtn) {
      this.darkModeBtn.addEventListener('click', () => {
        this.toggleDarkMode();
      });
    }
  }
  
  setupLanguageSelector() {
    if (this.languageBtn && this.languageDropdown) {
      this.languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleLanguageDropdown();
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.languageBtn.contains(e.target) && !this.languageDropdown.contains(e.target)) {
          this.languageDropdown.classList.remove('show');
        }
      });
      
      // Language option clicks
      const languageOptions = this.languageDropdown.querySelectorAll('.nav-language-option');
      languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          e.preventDefault();
          const lang = option.getAttribute('data-lang');
          this.changeLanguage(lang);
          this.languageDropdown.classList.remove('show');
        });
      });
    }
  }
  
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode);
    this.applyDarkMode();
  }
  
  applyDarkMode() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      this.darkModeBtn.classList.add('active');
    } else {
      document.documentElement.classList.remove('dark-mode');
      this.darkModeBtn.classList.remove('active');
    }
  }
  
  toggleLanguageDropdown() {
    this.languageDropdown.classList.toggle('show');
  }
  
  changeLanguage(lang) {
    // Store selected language
    localStorage.setItem('selectedLanguage', lang);
    
    // Apply language change (you can integrate with your existing language system)
    this.applyLanguage(lang);
  }
  
  applyLanguage(lang) {
    // Add language class to body for CSS targeting
    document.body.className = document.body.className.replace(/lang-\w+/g, '');
    document.body.classList.add(`lang-${lang}`);
    
    // You can add more language-specific logic here
    console.log(`Language changed to: ${lang}`);
  }
  
  applyInitialState() {
    // Apply saved dark mode state
    this.applyDarkMode();
    
    // Apply saved language
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    this.changeLanguage(savedLang);
  }
}

// Initialize navbar controls
document.addEventListener('DOMContentLoaded', () => {
  new NavbarControls();
}); 

// Enhanced Multi-Currency Slider - Global Functions
let currentSlide = 0;
const slides = ['usd', 'aed', 'ghs'];
let autoPlayInterval;

// Show specific slide
function showSlide(slideIndex) {
  // Convert string to index if needed
  if (typeof slideIndex === 'string') {
    slideIndex = slides.indexOf(slideIndex);
  }
  
  if (slideIndex < 0 || slideIndex >= slides.length) return;
  
  // Update current slide
  currentSlide = slideIndex;
  
  // Hide all slides
  slides.forEach((slide, index) => {
    const slideElement = document.getElementById(`slide-${slide}`);
    if (slideElement) {
      slideElement.classList.remove('active', 'prev', 'next');
      if (index < currentSlide) {
        slideElement.classList.add('prev');
      } else if (index > currentSlide) {
        slideElement.classList.add('next');
      }
    }
  });
  
  // Show current slide
  const currentSlideElement = document.getElementById(`slide-${slides[currentSlide]}`);
  if (currentSlideElement) {
    currentSlideElement.classList.add('active');
  }
  
  // Update navigation states
  updateNavigation();
  
  // Reset auto-play
  resetAutoPlay();
}

// Next slide
function nextSlide() {
  const nextIndex = (currentSlide + 1) % slides.length;
  showSlide(nextIndex);
}

// Previous slide
function prevSlide() {
  const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(prevIndex);
}

// Update navigation states
function updateNavigation() {
  // Update dots
  const dots = document.querySelectorAll('.nav-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
  
  // Update currency buttons
  const currencyBtns = document.querySelectorAll('.currency-btn');
  currencyBtns.forEach((btn, index) => {
    btn.classList.toggle('active', index === currentSlide);
  });
  
  // Update arrows
  const prevBtn = document.getElementById('currencyPrevBtn');
  const nextBtn = document.getElementById('currencyNextBtn');
  
  if (prevBtn) prevBtn.disabled = false;
  if (nextBtn) nextBtn.disabled = false;
}

// Auto-play functionality
function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    nextSlide();
  }, 5000); // Change slide every 5 seconds
}

function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
}

function resetAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

// Keyboard navigation
function handleKeyboardNavigation(e) {
  switch(e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      prevSlide();
      break;
    case 'ArrowRight':
      e.preventDefault();
      nextSlide();
      break;
    case 'Escape':
      e.preventDefault();
      stopAutoPlay();
      break;
  }
}

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide(); // Swipe left
    } else {
      prevSlide(); // Swipe right
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  try {
    // Initialize currency slider
    const currencySlider = document.querySelector('.currency-slider');
    if (currencySlider) {
      // Add touch event listeners
      currencySlider.addEventListener('touchstart', handleTouchStart, { passive: true });
      currencySlider.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      // Add keyboard navigation
      document.addEventListener('keydown', handleKeyboardNavigation);
      
      // Start auto-play
      startAutoPlay();
      
      // Pause auto-play on hover
      currencySlider.addEventListener('mouseenter', stopAutoPlay);
      currencySlider.addEventListener('mouseleave', startAutoPlay);
      
      console.log('Currency slider initialized successfully');
    }
    
    // Initialize existing functionality
    console.log('Website initialized successfully');
  } catch (error) {
    console.error('Error during initialization:', error);
  }
  
  // Ensure loading screen is hidden even if there are errors
  setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
      console.log('Loading screen hidden after initialization');
    }
  }, 1000);
});

// ===== SCROLL TO TOP FUNCTIONALITY =====
class ScrollToTop {
  constructor() {
    this.button = document.getElementById('scrollToTop');
    this.scrollThreshold = 300; // Show button after scrolling 300px
    this.isVisible = false;
    this.isMobile = window.innerWidth <= 768;
    
    this.init();
  }
  
  init() {
    if (!this.button) {
      console.warn('Scroll to top button not found');
      return;
    }
    
    this.setupEventListeners();
    this.checkScrollPosition();
  }
  
  setupEventListeners() {
    // Scroll event listener with throttling for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.checkScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Click event listener for smooth scroll to top
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.scrollToTop();
    });
    
    // Touch events for mobile
    if (this.isMobile) {
      this.button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.button.style.transform = 'translateY(0) scale(0.95)';
      }, { passive: false });
      
      this.button.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.button.style.transform = 'translateY(0) scale(1)';
        this.scrollToTop();
      }, { passive: false });
      
      this.button.addEventListener('touchcancel', () => {
        this.button.style.transform = 'translateY(0) scale(1)';
      });
    }
    
    // Keyboard accessibility
    this.button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.scrollToTop();
      }
    });
  }
  
  checkScrollPosition() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > this.scrollThreshold && !this.isVisible) {
      this.show();
    } else if (scrollTop <= this.scrollThreshold && this.isVisible) {
      this.hide();
    }
  }
  
  show() {
    this.button.classList.add('visible');
    this.isVisible = true;
  }
  
  hide() {
    this.button.classList.remove('visible');
    this.isVisible = false;
  }
  
  scrollToTop() {
    // Smooth scroll to top with easing
    const startPosition = window.pageYOffset || document.documentElement.scrollTop;
    const startTime = performance.now();
    const duration = this.isMobile ? 600 : 800; // Faster on mobile
    
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      const newPosition = startPosition * (1 - easedProgress);
      window.scrollTo(0, newPosition);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }
}

// Initialize scroll to top functionality
document.addEventListener('DOMContentLoaded', () => {
  new ScrollToTop();
});

// Removed ProgressRingsAnimation class - no longer needed

// Initialize functionality for "We Are Here For" Section
document.addEventListener('DOMContentLoaded', () => {
  // Initialize collapsible footer functionality
  initializeCollapsibleFooter();
  
  // Initialize interactive stacked cards
  initializeInteractiveStackedCards();
  
  // FAQ section removed; no auto-open needed
});

// Removed auto-expand logic for regulatory disclosures (section deleted)

// Interactive Stacked Cards Functionality
function initializeInteractiveStackedCards() {
  const cardStack = document.querySelector(".card-stack");
  if (!cardStack) return;
  
  let cards = [...document.querySelectorAll(".card")];
  let isSwiping = false;
  let startX = 0;
  let currentX = 0;
  let animationFrameId = null;

  const getDurationFromCSS = (variableName, element = document.documentElement) => {
    const value = getComputedStyle(element)?.getPropertyValue(variableName)?.trim();
    if (!value) return 0;
    if (value.endsWith("ms")) return parseFloat(value);
    if (value.endsWith("s")) return parseFloat(value) * 1000;
    return parseFloat(value) || 0;
  };

  const getActiveCard = () => cards[0];

  const updatePositions = () => {
    cards.forEach((card, i) => {
      card.style.setProperty("--i", i + 1);
      card.style.setProperty("--swipe-x", "0px");
      card.style.setProperty("--swipe-rotate", "0deg");
      card.style.opacity = "1";
    });
  };

  const applySwipeStyles = (deltaX) => {
    const card = getActiveCard();
    if (!card) return;
    card.style.setProperty("--swipe-x", `${deltaX}px`);
    card.style.setProperty("--swipe-rotate", `${deltaX * 0.2}deg`);
    card.style.opacity = 1 - Math.min(Math.abs(deltaX) / 100, 1) * 0.75;
  };

  const handleStart = (clientX) => {
    if (isSwiping) return;
    isSwiping = true;
    startX = currentX = clientX;
    const card = getActiveCard();
    card && (card.style.transition = "none");
  };

  const handleMove = (clientX) => {
    if (!isSwiping) return;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(() => {
      currentX = clientX;
      const deltaX = currentX - startX;
      applySwipeStyles(deltaX);
      if (Math.abs(deltaX) > 50) handleEnd();
    });
  };

  const handleEnd = () => {
    if (!isSwiping) return;
    cancelAnimationFrame(animationFrameId);
    const deltaX = currentX - startX;
    const threshold = 50;
    const duration = getDurationFromCSS("--card-swap-duration");
    const card = getActiveCard();

    if (card) {
      card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
      if (Math.abs(deltaX) > threshold) {
        const direction = Math.sign(deltaX);
        card.style.setProperty("--swipe-x", `${direction * 300}px`);
        card.style.setProperty("--swipe-rotate", `${direction * 20}deg`);
        setTimeout(() => {
          card.style.setProperty("--swipe-rotate", `${-direction * 20}deg`);
        }, duration * 0.5);
        setTimeout(() => {
          cards = [...cards.slice(1), card];
          updatePositions();
        }, duration);
      } else {
        applySwipeStyles(0);
      }
    }
    isSwiping = false;
    startX = currentX = 0;
  };

  const addEventListeners = () => {
    cardStack?.addEventListener("pointerdown", ({ clientX }) => handleStart(clientX));
    cardStack?.addEventListener("pointermove", ({ clientX }) => handleMove(clientX));
    cardStack?.addEventListener("pointerup", handleEnd);
  };

  updatePositions();
  addEventListeners();
}
        

        
        // Collapsible Footer Functionality
        function initializeCollapsibleFooter() {
          const footerSections = document.querySelectorAll('.footer-section.collapsible');
          
          footerSections.forEach(section => {
            const header = section.querySelector('.footer-header');
            const toggle = section.querySelector('.footer-toggle');
            const links = section.querySelector('.footer-links');
            
            // Set initial state - collapsed on mobile
            if (window.innerWidth <= 768) {
              section.classList.add('collapsed');
            }
            
            // Toggle functionality
            const toggleSection = () => {
              if (window.innerWidth <= 768) {
                if (section.classList.contains('collapsed')) {
                  section.classList.remove('collapsed');
                  section.classList.add('expanded');
                  toggle.querySelector('.toggle-icon').textContent = '−';
                } else {
                  section.classList.remove('expanded');
                  section.classList.add('collapsed');
                  toggle.querySelector('.toggle-icon').textContent = '+';
                }
              }
            };
            
            // Add event listeners
            if (header) {
              header.addEventListener('click', toggleSection);
            }
            
            if (toggle) {
              toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleSection();
              });
            }
          });
          
          // Handle window resize
          window.addEventListener('resize', () => {
            footerSections.forEach(section => {
              if (window.innerWidth > 768) {
                // Desktop - always show
                section.classList.remove('collapsed', 'expanded');
                section.querySelector('.toggle-icon').textContent = '+';
              } else {
                // Mobile - start collapsed
                if (!section.classList.contains('expanded')) {
                  section.classList.add('collapsed');
                  section.querySelector('.toggle-icon').textContent = '+';
                }
              }
            });
          });
        }

// Handle URL parameters for style switching
function handleStyleParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const style = urlParams.get('style');
    const isMobile = window.innerWidth <= 768;
    
    const hamburger = document.getElementById('navHamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        // Remove all style classes
        hamburger.className = 'nav-hamburger';
        navMenu.className = 'nav-menu';
        
        // Default to Style 6 on mobile only; keep desktop default
        const selectedStyle = style || (isMobile ? '6' : null);
        if (!selectedStyle) {
            // Ensure default desktop nav remains unaffected
            hamburger.style.display = '';
            return;
        }
        
        // Hide original hamburger for custom styles (2-8 and liquid variants)
        if ((selectedStyle >= '2' && selectedStyle <= '8') || selectedStyle === '8-liquid') {
            hamburger.style.display = 'none';
        } else {
            hamburger.style.display = 'flex';
        }
        
        // Apply specific style
        switch(selectedStyle) {
            case '1':
                // Style 1: Slide-Down Overlay
                break;
            case '2':
                hamburger.className = 'nav-hamburger-style2';
                navMenu.className = 'nav-menu-style2';
                break;
            case '3':
                hamburger.className = 'nav-hamburger-style3';
                navMenu.className = 'nav-menu-style3';
                break;
            case '4':
                hamburger.className = 'nav-hamburger-style4';
                navMenu.className = 'nav-menu-style4';
                break;
            case '5':
                hamburger.className = 'nav-hamburger-style5';
                navMenu.className = 'nav-menu-style5';
                break;
            case '6':
                hamburger.className = 'nav-hamburger-style6';
                navMenu.className = 'nav-menu-style6';
                break;
            case '7':
                hamburger.className = 'nav-hamburger-style7';
                navMenu.className = 'nav-menu-style7';
                break;
            case '8':
                hamburger.className = 'nav-hamburger-style8';
                navMenu.className = 'nav-menu-style8';
                break;
            case '8-liquid':
                hamburger.className = 'nav-hamburger-style8-liquid';
                navMenu.className = 'nav-menu-style8-liquid';
                break;
        }
    }
}

// Initialize style based on URL parameter
handleStyleParameter();

// Premium Calculator Functionality
document.addEventListener('DOMContentLoaded', function() {
  const calcAmount = document.getElementById('calcAmount');
  const calcResult = document.getElementById('calcResult');
  const currencyButtons = document.querySelectorAll('.inline-currency');
  
  // Sample exchange rates (in real app, these would come from API)
  const exchangeRates = {
    'USD-EUR': 0.925,
    'USD-GBP': 0.785,
    'EUR-USD': 1.081,
    'EUR-GBP': 0.848,
    'GBP-USD': 1.274,
    'GBP-EUR': 1.179
  };

  let fromCurrency = 'USD';
  let toCurrency = 'EUR';

  // Set initial active state
  if (currencyButtons.length > 0) {
    currencyButtons[0].classList.add('active');
  }

  // Currency selection
  currencyButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      currencyButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Update currencies based on which button was clicked
      if (index === 0) {
        fromCurrency = 'USD';
      } else if (index === 1) {
        toCurrency = 'EUR';
      }
      
      // Recalculate
      calculateConversion();
    });
  });

  // Amount input change
  if (calcAmount) {
    calcAmount.addEventListener('input', calculateConversion);
  }

  function calculateConversion() {
    if (!calcAmount || !calcResult) return;
    
    const amount = parseFloat(calcAmount.value) || 0;
    const rateKey = `${fromCurrency}-${toCurrency}`;
    const rate = exchangeRates[rateKey] || 1;
    
    const result = amount * rate;
    calcResult.value = result.toFixed(2);
    
    // Add subtle animation
    calcResult.style.transform = 'scale(1.02)';
    setTimeout(() => {
      calcResult.style.transform = 'scale(1)';
    }, 150);
  }

  // Initialize calculation
  calculateConversion();
});

// Comprehensive Remittance Calculator Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize remittance calculator if it exists
  const remittanceCalculator = document.getElementById('remittance-calculator');
  if (!remittanceCalculator) return;

  // Elements
  const amountInput = document.getElementById('remittanceAmount');
  const resultAmount = document.getElementById('resultAmount');
  const resultCurrency = document.getElementById('resultCurrency');
  const feeAmount = document.getElementById('feeAmount');
  const fxRate = document.getElementById('fxRate');
  const savingsHighlight = document.getElementById('savingsHighlight');
  const sendCurrencyDropdown = document.getElementById('sendCurrency');
  const receiveCurrencyDropdown = document.getElementById('receiveCurrency');
  const toggleTabs = document.querySelectorAll('.toggle-tab');

  // Exchange rates and fees for different providers
  const rates = {
    'our-price': {
      'USD-EUR': { rate: 0.925, fee: 0, savings: '7.5%' },
      'USD-GBP': { rate: 0.785, fee: 0, savings: '8.2%' },
      'USD-GHS': { rate: 12.5, fee: 0, savings: '6.8%' },
      'USD-NGN': { rate: 850, fee: 0, savings: '9.1%' },
      'EUR-USD': { rate: 1.081, fee: 0, savings: '7.2%' },
      'EUR-GBP': { rate: 0.848, fee: 0, savings: '8.5%' },
      'GBP-USD': { rate: 1.274, fee: 0, savings: '6.9%' },
      'GBP-EUR': { rate: 1.179, fee: 0, savings: '7.8%' }
    },
    'bank-price': {
      'USD-EUR': { rate: 0.855, fee: 25, savings: '0%' },
      'USD-GBP': { rate: 0.725, fee: 30, savings: '0%' },
      'USD-GHS': { rate: 11.8, fee: 35, savings: '0%' },
      'USD-NGN': { rate: 780, fee: 40, savings: '0%' },
      'EUR-USD': { rate: 1.008, fee: 25, savings: '0%' },
      'EUR-GBP': { rate: 0.782, fee: 30, savings: '0%' },
      'GBP-USD': { rate: 1.189, fee: 30, savings: '0%' },
      'GBP-EUR': { rate: 1.092, fee: 25, savings: '0%' }
    },
    'western-union': {
      'USD-EUR': { rate: 0.875, fee: 15, savings: '0%' },
      'USD-GBP': { rate: 0.745, fee: 18, savings: '0%' },
      'USD-GHS': { rate: 12.0, fee: 20, savings: '0%' },
      'USD-NGN': { rate: 800, fee: 22, savings: '0%' },
      'EUR-USD': { rate: 1.042, fee: 15, savings: '0%' },
      'EUR-GBP': { rate: 0.815, fee: 18, savings: '0%' },
      'GBP-USD': { rate: 1.221, fee: 18, savings: '0%' },
      'GBP-EUR': { rate: 1.127, fee: 15, savings: '0%' }
    }
  };

  let currentProvider = 'our-price';
  let fromCurrency = 'USD';
  let toCurrency = 'EUR';

  // Initialize calculator
  function initCalculator() {
    updateResult();
    setupEventListeners();
  }

  // Setup event listeners
  function setupEventListeners() {
    // Amount input
    if (amountInput) {
      amountInput.addEventListener('input', updateResult);
    }

    // Currency dropdowns
    setupCurrencyDropdown(sendCurrencyDropdown, 'send');
    setupCurrencyDropdown(receiveCurrencyDropdown, 'receive');

    // Toggle tabs
    toggleTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const option = this.getAttribute('data-option');
        setActiveProvider(option);
      });
    });
  }

  // Setup currency dropdown functionality
  function setupCurrencyDropdown(dropdown, type) {
    if (!dropdown) return;

    const display = dropdown.querySelector('.currency-display');
    const options = dropdown.querySelectorAll('.currency-option');

    // Show/hide options on click
    display.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      
      // Close all dropdowns
      document.querySelectorAll('.currency-dropdown').forEach(d => d.classList.remove('open'));
      
      if (!isOpen) {
        dropdown.classList.add('open');
      }
    });

    // Handle option selection
    options.forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        const currency = this.getAttribute('data-currency');
        const flag = this.getAttribute('data-flag');
        
        // Update display
        const flagSpan = display.querySelector('.currency-flag');
        const codeSpan = display.querySelector('.currency-code');
        
        if (flagSpan) flagSpan.textContent = flag;
        if (codeSpan) codeSpan.textContent = currency;
        
        // Update currency variables
        if (type === 'send') {
          fromCurrency = currency;
        } else {
          toCurrency = currency;
        }
        
        // Close dropdown
        dropdown.classList.remove('open');
        
        // Update result
        updateResult();
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      dropdown.classList.remove('open');
    });
  }

  // Set active provider
  function setActiveProvider(provider) {
    currentProvider = provider;
    
    // Update active tab
    toggleTabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.getAttribute('data-option') === provider) {
        tab.classList.add('active');
      }
    });
    
    updateResult();
  }

  // Update calculation result
  function updateResult() {
    if (!amountInput || !resultAmount || !resultCurrency) return;
    
    const amount = parseFloat(amountInput.value) || 0;
    const rateKey = `${fromCurrency}-${toCurrency}`;
    const providerRates = rates[currentProvider];
    
    if (!providerRates || !providerRates[rateKey]) {
      // Fallback to 1:1 if rate not found
      resultAmount.textContent = amount.toFixed(2);
      resultCurrency.textContent = toCurrency;
      feeAmount.textContent = '$0';
      fxRate.textContent = `1 ${fromCurrency} = 1.0000 ${toCurrency}`;
      savingsHighlight.textContent = 'Rate not available';
      return;
    }
    
    const { rate, fee, savings } = providerRates[rateKey];
    const totalReceived = (amount * rate) - fee;
    
    // Update result display
    resultAmount.textContent = totalReceived.toFixed(2);
    resultCurrency.textContent = toCurrency;
    
    // Update fee display
    const feeSymbol = fromCurrency === 'USD' ? '$' : fromCurrency === 'EUR' ? '€' : fromCurrency === 'GBP' ? '£' : '';
    feeAmount.textContent = fee > 0 ? `${feeSymbol}${fee}` : '$0';
    
    // Update FX rate display
    fxRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
    
    // Update savings highlight
    if (currentProvider === 'our-price') {
      savingsHighlight.textContent = `Save up to ${savings} vs traditional banks`;
      savingsHighlight.style.display = 'block';
    } else {
      savingsHighlight.style.display = 'none';
    }
    
    // Add animation effect
    resultAmount.style.transform = 'scale(1.05)';
    setTimeout(() => {
      resultAmount.style.transform = 'scale(1)';
    }, 200);
  }

  // Initialize calculator
  initCalculator();
});