// SendNReceive - 2026 Fintech Platform JavaScript

// Loading Screen Management
document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  
  // Simulate loading process
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 2000);
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
    if (this.hamburger && this.navMenu) {
      this.hamburger.addEventListener('click', () => {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
      });
      
      // Close mobile menu when clicking on a link
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.hamburger.classList.remove('active');
          this.navMenu.classList.remove('active');
        });
      });
    }
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
    
    // Optimize video playback on mobile
    const heroVideo = document.querySelector('.hero-bg-video');
    if (heroVideo && this.isMobile) {
      // Reduce video quality on mobile for better performance
      heroVideo.setAttribute('preload', 'metadata');
      
      // Pause video when not visible to save battery
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            heroVideo.play().catch(() => {
              // Video autoplay failed, keep it paused
            });
          } else {
            heroVideo.pause();
          }
        });
      });
      
      videoObserver.observe(heroVideo);
    }
    
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
    // Improve mobile navigation accessibility
    const mobileMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    if (mobileMenu && hamburger) {
      // Add ARIA labels for mobile menu
      hamburger.setAttribute('aria-label', 'Toggle navigation menu');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-controls', 'nav-menu');
      
      hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
      });
      
      // Trap focus in mobile menu when open
      const focusableElements = mobileMenu.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      
      mobileMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              e.preventDefault();
              lastFocusable.focus();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              e.preventDefault();
              firstFocusable.focus();
            }
          }
        }
        
        if (e.key === 'Escape') {
          hamburger.click();
          hamburger.focus();
        }
      });
    }
    
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

// Simple Currency Slider - Global Functions
let currentSlide = 'usd';
const slides = ['usd', 'aed', 'ghs'];

// Global functions for onclick handlers
function showSlide(slideName) {
  console.log(`Global showSlide called with: ${slideName}`);
  
  // Hide all slides
  slides.forEach(slide => {
    const slideElement = document.getElementById(`slide-${slide}`);
    if (slideElement) {
      slideElement.classList.remove('active', 'prev');
      console.log(`Removed active from slide: ${slide}`);
    }
  });
  
  // Remove active from all navigation
  slides.forEach(slide => {
    const dot = document.querySelector(`.nav-dot[data-slide="${slide}"]`);
    const btn = document.querySelector(`.currency-btn[data-slide="${slide}"]`);
    if (dot) {
      dot.classList.remove('active');
      console.log(`Removed active from dot: ${slide}`);
    }
    if (btn) {
      btn.classList.remove('active');
      console.log(`Removed active from button: ${slide}`);
    }
  });
  
  // Show current slide
  const currentSlideElement = document.getElementById(`slide-${slideName}`);
  if (currentSlideElement) {
    currentSlideElement.classList.add('active');
    console.log(`Activated slide: ${slideName}`);
    console.log(`Slide element classes:`, currentSlideElement.className);
    console.log(`Slide element computed style:`, window.getComputedStyle(currentSlideElement).opacity);
  } else {
    console.error(`Slide element not found: slide-${slideName}`);
  }
  
  // Activate navigation
  const currentDot = document.querySelector(`.nav-dot[data-slide="${slideName}"]`);
  const currentBtn = document.querySelector(`.currency-btn[data-slide="${slideName}"]`);
  if (currentDot) {
    currentDot.classList.add('active');
    console.log(`Activated dot: ${slideName}`);
  }
  if (currentBtn) {
    currentBtn.classList.add('active');
    console.log(`Activated button: ${slideName}`);
  }
  
  currentSlide = slideName;
  updateArrowStates();
}

function prevSlide() {
  const currentIndex = slides.indexOf(currentSlide);
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
  showSlide(slides[prevIndex]);
}

function nextSlide() {
  const currentIndex = slides.indexOf(currentSlide);
  const nextIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
  showSlide(slides[nextIndex]);
}

function updateArrowStates() {
  const prevBtn = document.getElementById('currencyPrevBtn');
  const nextBtn = document.getElementById('currencyNextBtn');
  
  if (prevBtn && nextBtn) {
    prevBtn.style.opacity = '1';
    nextBtn.style.opacity = '1';
  }
}

class SimpleCurrencySlider {
  constructor() {
    this.init();
  }
  
  init() {
    console.log('Simple Currency Slider initialized');
    showSlide('usd'); // Start with USD
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });
  }
  
  showSlide(slideName) {
    console.log(`Showing slide: ${slideName}`);
    
    // Hide all slides
    Object.values(this.slideElements).forEach(slide => {
      if (slide) {
        slide.classList.remove('active', 'prev');
        console.log(`Removed active from slide: ${slide.id}`);
      }
    });
    
    // Remove active from all navigation
    Object.values(this.navDots).forEach(dot => {
      if (dot) {
        dot.classList.remove('active');
        console.log(`Removed active from dot: ${dot.getAttribute('data-slide')}`);
      }
    });
    Object.values(this.currencyBtns).forEach(btn => {
      if (btn) {
        btn.classList.remove('active');
        console.log(`Removed active from button: ${btn.getAttribute('data-slide')}`);
      }
    });
    
    // Show current slide
    if (this.slideElements[slideName]) {
      this.slideElements[slideName].classList.add('active');
      console.log(`Added active to slide: ${slideName}`);
    } else {
      console.error(`Slide element not found: ${slideName}`);
    }
    
    // Activate navigation
    if (this.navDots[slideName]) {
      this.navDots[slideName].classList.add('active');
      console.log(`Added active to dot: ${slideName}`);
    } else {
      console.error(`Nav dot not found: ${slideName}`);
    }
    if (this.currencyBtns[slideName]) {
      this.currencyBtns[slideName].classList.add('active');
      console.log(`Added active to button: ${slideName}`);
    } else {
      console.error(`Currency button not found: ${slideName}`);
    }
    
    this.currentSlide = slideName;
    this.updateArrowStates();
  }
  
  prevSlide() {
    const currentIndex = this.slides.indexOf(this.currentSlide);
    const prevIndex = currentIndex - 1;
    const slideName = prevIndex >= 0 ? this.slides[prevIndex] : this.slides[this.slides.length - 1];
    this.showSlide(slideName);
  }
  
  nextSlide() {
    const currentIndex = this.slides.indexOf(this.currentSlide);
    const nextIndex = currentIndex + 1;
    const slideName = nextIndex < this.slides.length ? this.slides[nextIndex] : this.slides[0];
    this.showSlide(slideName);
  }
  
  updateArrowStates() {
    // Enable/disable arrows based on current slide
    if (this.prevBtn && this.nextBtn) {
      // For now, keep both enabled for circular navigation
      this.prevBtn.disabled = false;
      this.nextBtn.disabled = false;
    }
  }
}

// Initialize the currency slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize existing functionality
  initializeAnimations();
  initializeNavbarControls();
  initializeRemittanceCalculator();
  
  // Initialize the new simple currency slider
  new SimpleCurrencySlider();
  
  // Test the slider immediately
  console.log('Testing slider functionality...');
  console.log('USD slide element:', document.getElementById('slide-usd'));
  console.log('AED slide element:', document.getElementById('slide-aed'));
  console.log('GHS slide element:', document.getElementById('slide-ghs'));
  
  // Force initial state
  setTimeout(() => {
    showSlide('usd');
    console.log('Forced initial slide state');
  }, 100);
  
  // Add window resize handler to fix mobile/desktop issues
  window.addEventListener('resize', () => {
    setTimeout(() => {
      showSlide(currentSlide);
      console.log('Fixed slider after resize');
    }, 100);
  });
}); 