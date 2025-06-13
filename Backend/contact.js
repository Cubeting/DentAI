// ===== CONTACT PAGE REDESIGN JAVASCRIPT =====
// Script untuk menangani interaksi pada halaman contact DentAI
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SMOOTH SCROLLING =====
    // Smooth scrolling untuk anchor links
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

    // ===== FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const submitBtn = this.querySelector('.submit-btn');
            const formData = new FormData(this);
            const originalText = submitBtn.textContent;
            
            // Validate form
            if (!validateForm(this)) {
                return;
            }
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Success state
                submitBtn.textContent = 'Message Sent!';
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                
                // Show success notification
                showNotification('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
                
                // Reset form after delay
                setTimeout(() => {
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('success');
                    clearValidationErrors(this);
                }, 3000);
                
            }, 2000);
        });
    }
    
    // ===== FORM VALIDATION =====
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        // Clear previous errors
        clearValidationErrors(form);
        
        requiredFields.forEach(field => {
            const value = field.value.trim();
            
            if (!value) {
                showFieldError(field, 'Field ini wajib diisi');
                isValid = false;
            } else if (field.type === 'email' && !isValidEmail(value)) {
                showFieldError(field, 'Format email tidak valid');
                isValid = false;
            } else if (field.tagName === 'TEXTAREA' && value.length < 10) {
                showFieldError(field, 'Pesan minimal 10 karakter');
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        field.style.borderColor = '#ff4757';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#ff4757';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        field.parentNode.appendChild(errorElement);
    }
    
    function clearValidationErrors(form) {
        // Remove error classes and styles
        form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
            field.style.borderColor = '';
        });
        
        // Remove error messages
        form.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
    }
    
    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#667eea',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'all 0.3s ease',
            maxWidth: '300px',
            fontSize: '14px'
        });
        
        const content = notification.querySelector('.notification-content');
        Object.assign(content.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
        });
        
        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '0',
            lineHeight: '1'
        });
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto hide after 5 seconds
        const autoHideTimer = setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Close button functionality
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoHideTimer);
            hideNotification(notification);
        });
    }
    
    function hideNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
    
    // ===== INPUT FOCUS EFFECTS =====
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    
    formInputs.forEach(input => {
        // Focus effects
        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
            this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)';
        });
        
        input.addEventListener('blur', function() {
            if (!this.classList.contains('error')) {
                this.style.borderColor = '#555';
                this.style.boxShadow = 'none';
            }
        });
        
        // Real-time validation
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                // Remove error state if user starts typing
                this.classList.remove('error');
                this.style.borderColor = '#667eea';
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
    });
    
    // ===== CONTACT INFO ANIMATIONS =====
    const observerOptions = {
        threshold: 0.2,
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
    
    // Observe contact elements
    const contactElements = document.querySelectorAll('.contact-info-item, .contact-form-section, .map-container');
    contactElements.forEach((el, index) => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        
        observer.observe(el);
    });
    
    // ===== CTA BUTTON INTERACTION =====
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            // Scroll to contact form
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Focus on first input after scroll
                setTimeout(() => {
                    const firstInput = contactForm.querySelector('input');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 500);
            }
        });
    }
    
    // ===== CONTACT INFO CLICK ACTIONS =====
    const contactInfoItems = document.querySelectorAll('.contact-info-item');
    
    contactInfoItems.forEach(item => {
        const icon = item.querySelector('.contact-info-icon');
        const text = item.querySelector('p').textContent;
        
        item.addEventListener('click', function() {
            const iconText = icon.textContent;
            
            if (iconText === '📞' || iconText === '💬') {
                // Phone or WhatsApp
                const phoneNumber = text.replace(/\s/g, '');
                if (iconText === '💬') {
                    window.open(`https://wa.me/${phoneNumber.replace('+', '')}`, '_blank');
                } else {
                    window.open(`tel:${phoneNumber}`, '_blank');
                }
            } else if (iconText === '✉️') {
                // Email
                window.open(`mailto:${text}`, '_blank');
            } else if (iconText === '📍') {
                // Location - open Google Maps
                const location = encodeURIComponent(text);
                window.open(`https://www.google.com/maps/search/?api=1&query=${location}`, '_blank');
            }
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Add cursor pointer for clickable items
        item.style.cursor = 'pointer';
    });
    
    // ===== MAP PLACEHOLDER INTERACTION =====
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            const location = 'Sidoarjo, East Java, Indonesia';
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
        });
        
        mapPlaceholder.style.cursor = 'pointer';
        
        // Hover effect
        mapPlaceholder.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        mapPlaceholder.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // ===== BREADCRUMB NAVIGATION =====
    const breadcrumbLinks = document.querySelectorAll('.breadcrumb a');
    breadcrumbLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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
    
    // ===== SCROLL ANIMATIONS =====
    let lastScrollTop = 0;
    const contactHero = document.querySelector('.contact-hero');
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Parallax effect for hero section
        if (contactHero) {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            contactHero.style.transform = `translateY(${parallax}px)`;
        }
        
        lastScrollTop = scrollTop;
    }, 16));
    
    // ===== FORM FIELD COUNTERS =====
    const textarea = document.querySelector('#contactForm textarea');
    if (textarea) {
        const maxLength = 500;
        textarea.setAttribute('maxlength', maxLength);
        
        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.8rem;
            color: #999;
            margin-top: 5px;
        `;
        textarea.parentNode.appendChild(counter);
        
        // Update counter
        function updateCounter() {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${remaining} karakter tersisa`;
            counter.style.color = remaining < 50 ? '#ff4757' : '#999';
        }
        
        textarea.addEventListener('input', updateCounter);
        updateCounter(); // Initial update
    }
    
    // ===== SUCCESS ANIMATION =====
    function addSuccessAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            .submit-btn.success {
                background: #2ed573 !important;
                transform: scale(1.05);
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .notification {
                animation: slideInRight 0.3s ease;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===== INITIALIZE =====
    addSuccessAnimation();
    
    console.log('DentAI Contact page JavaScript initialized successfully!');
});

// ===== UTILITY FUNCTIONS =====
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== INTEGRATION WITH EXISTING SCRIPTS =====
// Pastikan tidak ada konflik dengan script lain
window.DentAIContact = {
    showNotification: function(message, type) {
        // Public method untuk menampilkan notifikasi dari script lain
        const event = new CustomEvent('showContactNotification', {
            detail: { message, type }
        });
        document.dispatchEvent(event);
    }
};

// Listen for external notification requests
document.addEventListener('showContactNotification', function(e) {
    showNotification(e.detail.message, e.detail.type);
});