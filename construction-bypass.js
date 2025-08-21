// Enhanced Construction Page with IP Tracking and Email Notifications
// This script handles secure password-based access with tracking

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        // URLs
        CONSTRUCTION_PAGE: 'under-construction.html',
        MAIN_PAGE: 'index.html',
        
        // Local storage key to remember access
        STORAGE_KEY: 'sendnreceive_authorized_access',
        
        // API endpoint
        API_ENDPOINT: '/api/access-log'
    };
    
    // Check if user is already authorized
    function isAuthorized() {
        const hasAccess = localStorage.getItem(CONFIG.STORAGE_KEY) === 'true';
        return hasAccess;
    }
    
    // Redirect to appropriate page
    function redirectToAppropriatePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // If we're already on the construction page, don't redirect
        if (currentPage === CONFIG.CONSTRUCTION_PAGE) {
            return;
        }
        
        // If user is not authorized and not on construction page
        if (!isAuthorized() && currentPage !== CONFIG.CONSTRUCTION_PAGE) {
            // Redirect to construction page
            window.location.href = CONFIG.CONSTRUCTION_PAGE;
            return;
        }
        
        // If user is authorized and on construction page
        if (isAuthorized() && currentPage === CONFIG.CONSTRUCTION_PAGE) {
            // Redirect to main page
            window.location.href = CONFIG.MAIN_PAGE;
            return;
        }
    }
    
    // Handle password submission
    async function handlePasswordSubmit(password) {
        const button = document.getElementById('passwordButton');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        // Disable button and show loading
        button.disabled = true;
        button.textContent = 'Verifying...';
        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');
        
        try {
            console.log('Attempting to verify password:', password);
            
            // Send password to API for verification and tracking
            const response = await fetch(CONFIG.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: password,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                })
            });
            
            console.log('API Response status:', response.status);
            const data = await response.json();
            console.log('API Response data:', data);
            
            if (data.success) {
                // Password correct - grant access
                successMessage.classList.add('show');
                localStorage.setItem(CONFIG.STORAGE_KEY, 'true');
                
                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = CONFIG.MAIN_PAGE;
                }, 1500);
                
            } else {
                // Password incorrect
                errorMessage.classList.add('show');
                button.textContent = 'Access Website';
                button.disabled = false;
                
                // Clear password input
                document.getElementById('passwordInput').value = '';
                document.getElementById('passwordInput').focus();
            }
            
        } catch (error) {
            console.error('Password verification error:', error);
            errorMessage.textContent = 'Network error. Please try again.';
            errorMessage.classList.add('show');
            button.textContent = 'Access Website';
            button.disabled = false;
        }
    }
    
    // Initialize password modal
    function initializePasswordModal() {
        const modal = document.getElementById('passwordModal');
        const form = document.getElementById('passwordForm');
        const input = document.getElementById('passwordInput');
        
        if (!modal || !form || !input) {
            console.error('Password modal elements not found');
            return;
        }
        
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = input.value.trim();
            
            if (password) {
                handlePasswordSubmit(password);
            }
        });
        
        // Handle Enter key
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const password = input.value.trim();
                
                if (password) {
                    handlePasswordSubmit(password);
                }
            }
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
        
        // Focus on input when modal opens
        input.focus();
    }
    
    // Close modal function
    function closeModal() {
        const modal = document.getElementById('passwordModal');
        const input = document.getElementById('passwordInput');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        if (modal) {
            modal.classList.add('hidden');
            // Clear form
            if (input) input.value = '';
            if (errorMessage) errorMessage.classList.remove('show');
            if (successMessage) successMessage.classList.remove('show');
        }
    }
    
    // Add developer access button to construction page
    function addDeveloperAccessButton() {
        if (window.location.pathname.includes(CONFIG.CONSTRUCTION_PAGE)) {
            // Create developer access button
            const accessButton = document.createElement('button');
            accessButton.textContent = '🔐 Developer Access';
            accessButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 1000;
                font-family: 'Inter', sans-serif;
                backdrop-filter: blur(10px);
            `;
            
            accessButton.addEventListener('mouseenter', function() {
                this.style.color = 'rgba(255, 255, 255, 0.9)';
                this.style.background = 'rgba(0, 0, 0, 0.5)';
                this.style.transform = 'translateY(-2px)';
            });
            
            accessButton.addEventListener('mouseleave', function() {
                this.style.color = 'rgba(255, 255, 255, 0.7)';
                this.style.background = 'rgba(0, 0, 0, 0.3)';
                this.style.transform = 'translateY(0)';
            });
            
            accessButton.addEventListener('click', function() {
                const modal = document.getElementById('passwordModal');
                if (modal) {
                    modal.classList.remove('hidden');
                    document.getElementById('passwordInput').focus();
                }
            });
            
            document.body.appendChild(accessButton);
        }
    }
    
    // Clear authorization (for testing)
    function clearAuthorization() {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        console.log('Authorization cleared. Refresh to see construction page.');
    }
    
    // Expose functions globally for testing and modal control
    window.clearAuthorization = clearAuthorization;
    window.closeModal = closeModal;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            redirectToAppropriatePage();
            addDeveloperAccessButton();
            initializePasswordModal();
        });
    } else {
        redirectToAppropriatePage();
        addDeveloperAccessButton();
        initializePasswordModal();
    }
    
})();
