// script.js - Complete Portfolio JavaScript

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('.nav-link');

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    // Update menu icon
    const icon = menuToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
}

// Close mobile menu when clicking a link
function closeMobileMenu() {
    navMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.querySelector('i').className = 'fas fa-bars';
}

// Smooth Scroll
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }
}

// Navbar Background on Scroll
function updateNavbarBackground() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'transparent';
        navbar.style.backdropFilter = 'none';
    }
}

// Form Validation and Submission
function validateForm(formData) {
    const errors = [];
    
    // Name validation
    if (!formData.name.trim()) {
        errors.push('Name is required');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email');
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
        errors.push('Subject is required');
    }
    
    // Message validation
    if (!formData.message.trim()) {
        errors.push('Message is required');
    } else if (formData.message.length < 10) {
        errors.push('Message must be at least 10 characters');
    }
    
    return errors;
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: e.target.querySelector('input[type="text"]').value,
        email: e.target.querySelector('input[type="email"]').value,
        subject: e.target.querySelectorAll('input[type="text"]')[1].value,
        message: e.target.querySelector('textarea').value
    };
    
    // Validate form
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showNotification(errors.join(', '), 'error');
        return;
    }
    
    // Disable submit button and show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // In a real application, you would send this data to a server
        // For demo purposes, we'll simulate an API call
        await simulateAPICall(formData);
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        
        // Reset form
        e.target.reset();
        
    } catch (error) {
        // Show error message
        showNotification('Failed to send message. Please try again.', 'error');
        console.error('Form submission error:', error);
    } finally {
        // Re-enable submit button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Simulate API call (replace with actual API call)
function simulateAPICall(formData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form data submitted:', formData);
            resolve({ success: true });
        }, 1500);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    } else {
        notification.style.backgroundColor = '#3b82f6';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add CSS animations for notifications
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Skill Animation on Scroll
function animateSkillsOnScroll() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target;
                const width = skillLevel.style.width;
                skillLevel.style.width = '0%';
                
                // Animate to original width
                setTimeout(() => {
                    skillLevel.style.transition = 'width 1.5s ease-in-out';
                    skillLevel.style.width = width;
                }, 100);
                
                observer.unobserve(skillLevel);
            }
        });
    }, { threshold: 0.5 });
    
    skillLevels.forEach(skill => observer.observe(skill));
}

// Project Filtering (Optional Enhancement)
function initProjectFilter() {
    // This is an optional enhancement you can add later
    console.log('Project filter ready to be implemented');
}

// Initialize Typing Effect for Hero Section (Optional)
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    const nameStart = text.indexOf('Your Name');
    
    if (nameStart !== -1) {
        const beforeName = text.substring(0, nameStart);
        const name = text.substring(nameStart, nameStart + 9);
        const afterName = text.substring(nameStart + 9);
        
        heroTitle.innerHTML = `
            ${beforeName}
            <span class="text-gradient typing-text">${name}</span>
            ${afterName}
        `;
        
        // Add typing animation
        const typingText = document.querySelector('.typing-text');
        typingText.style.cssText = `
            border-right: 2px solid var(--accent-primary);
            animation: blink 1s infinite;
            padding-right: 2px;
        `;
        
        // Add blink animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 100% { border-color: var(--accent-primary); }
                50% { border-color: transparent; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize Counter Animation for Stats
function initCounterAnimation() {
    const statItems = document.querySelectorAll('.stat-item h3');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const target = parseInt(statNumber.textContent);
                let current = 0;
                const increment = target / 50; // 50 steps
                const duration = 1500; // 1.5 seconds
                const stepTime = duration / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    statNumber.textContent = Math.round(current) + (statNumber.textContent.includes('%') ? '%' : '+');
                }, stepTime);
                
                observer.unobserve(statNumber);
            }
        });
    }, { threshold: 0.5 });
    
    statItems.forEach(stat => observer.observe(stat));
}

// Initialize All Event Listeners
function initEventListeners() {
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Scroll event for navbar background
    window.addEventListener('scroll', updateNavbarBackground);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.menu-toggle')) {
            closeMobileMenu();
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize animations
    animateSkillsOnScroll();
    initCounterAnimation();
    
    // Add notification styles
    addNotificationStyles();
    
    // Optional enhancements (uncomment if needed)
    // initTypingEffect();
    // initProjectFilter();
    
    // Set initial navbar background
    updateNavbarBackground();
    
    // Log initialization
    console.log('Portfolio website initialized successfully!');
});

// Add responsive styles for mobile menu
function addMobileMenuStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 80px;
                left: 0;
                right: 0;
                background-color: var(--bg-primary);
                flex-direction: column;
                padding: 20px;
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .nav-menu.active {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            .nav-link {
                padding: 15px 0;
                border-bottom: 1px solid var(--border-color);
                width: 100%;
            }
            
            .menu-toggle {
                display: block;
            }
            
            .hero-container {
                grid-template-columns: 1fr;
                text-align: center;
            }
            
            .hero-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .about-content {
                grid-template-columns: 1fr;
            }
            
            .contact-container {
                grid-template-columns: 1fr;
            }
            
            .projects-grid {
                grid-template-columns: 1fr;
            }
            
            .skills-container {
                grid-template-columns: 1fr;
            }
            
            .footer-container {
                grid-template-columns: 1fr;
                gap: 30px;
            }
        }
        
        @media (max-width: 480px) {
            .hero-title {
                font-size: 2.5rem;
            }
            
            .section-title {
                font-size: 2rem;
            }
            
            .hero-subtitle {
                font-size: 1.2rem;
            }
            
            .about-stats {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add mobile menu styles
addMobileMenuStyles();

// Add console greeting
console.log(`
╔══════════════════════════════════════╗
║   Portfolio Website Initialized!     ║
║   Made with ❤️ for your success      ║
╚══════════════════════════════════════╝
`);

// Add to your existing script.js
function animateTimelineOnScroll() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
}

// Call this in your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    animateTimelineOnScroll();
});