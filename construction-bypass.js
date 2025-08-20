// Construction Page Bypass System
// This script handles showing the construction page or bypassing to the main site

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        // Secret parameter to bypass construction page
        BYPASS_PARAM: 'preview',
        BYPASS_VALUE: '2026',
        
        // URLs
        CONSTRUCTION_PAGE: 'under-construction.html',
        MAIN_PAGE: 'index.html',
        
        // Local storage key to remember bypass
        STORAGE_KEY: 'sendnreceive_bypass'
    };
    
    // Check if user should see construction page
    function shouldShowConstructionPage() {
        // Check URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const bypassParam = urlParams.get(CONFIG.BYPASS_PARAM);
        
        // If bypass parameter is correct, allow access
        if (bypassParam === CONFIG.BYPASS_VALUE) {
            // Store bypass in localStorage for future visits
            localStorage.setItem(CONFIG.STORAGE_KEY, 'true');
            return false;
        }
        
        // Check if user has previously bypassed
        const hasBypassed = localStorage.getItem(CONFIG.STORAGE_KEY) === 'true';
        if (hasBypassed) {
            return false;
        }
        
        // Show construction page by default
        return true;
    }
    
    // Redirect to appropriate page
    function redirectToAppropriatePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // If we're already on the construction page, don't redirect
        if (currentPage === CONFIG.CONSTRUCTION_PAGE) {
            return;
        }
        
        // If we should show construction page and we're not on it
        if (shouldShowConstructionPage() && currentPage !== CONFIG.CONSTRUCTION_PAGE) {
            // Redirect to construction page
            window.location.href = CONFIG.CONSTRUCTION_PAGE;
            return;
        }
        
        // If we shouldn't show construction page and we're on it
        if (!shouldShowConstructionPage() && currentPage === CONFIG.CONSTRUCTION_PAGE) {
            // Redirect to main page
            window.location.href = CONFIG.MAIN_PAGE;
            return;
        }
    }
    
    // Add bypass link to construction page
    function addBypassLink() {
        if (window.location.pathname.includes(CONFIG.CONSTRUCTION_PAGE)) {
            // Create a subtle bypass link
            const bypassLink = document.createElement('a');
            bypassLink.href = `${CONFIG.MAIN_PAGE}?${CONFIG.BYPASS_PARAM}=${CONFIG.BYPASS_VALUE}`;
            bypassLink.textContent = 'Developer Access';
            bypassLink.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                font-size: 10px;
                color: rgba(255, 255, 255, 0.3);
                text-decoration: none;
                padding: 5px 8px;
                border-radius: 4px;
                background: rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                z-index: 1000;
                font-family: monospace;
            `;
            
            bypassLink.addEventListener('mouseenter', function() {
                this.style.color = 'rgba(255, 255, 255, 0.6)';
                this.style.background = 'rgba(0, 0, 0, 0.4)';
            });
            
            bypassLink.addEventListener('mouseleave', function() {
                this.style.color = 'rgba(255, 255, 255, 0.3)';
                this.style.background = 'rgba(0, 0, 0, 0.2)';
            });
            
            document.body.appendChild(bypassLink);
        }
    }
    
    // Clear bypass (for testing)
    function clearBypass() {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        console.log('Bypass cleared. Refresh to see construction page.');
    }
    
    // Expose clearBypass function globally for testing
    window.clearBypass = clearBypass;
    
    // Run immediately for faster redirect
    redirectToAppropriatePage();
    addBypassLink();
    
    // Also run when DOM is ready as backup
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            redirectToAppropriatePage();
            addBypassLink();
        });
    }
    
    // Also run on page load for SPA-like behavior
    window.addEventListener('load', function() {
        redirectToAppropriatePage();
        addBypassLink();
    });
    
})();
