// Pandian Flowers - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initMobileMenu();
    initActiveNav();
    initScrollAnimations();
    initFormValidation();
    initGalleryFilters();
    initSmoothScroll();
    
    console.log('🌸 Pandian Flowers website loaded successfully!');
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle hamburger icon
            const icon = this.querySelector('svg');
            if (icon) {
                // You can add icon animation here
            }
        });
        
        // Close menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// Active Navigation Highlighting
function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a, .mobile-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('text-yellow-400', 'font-bold');
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearFormErrors(this);
            
            if (validateForm(this)) {
                // Show success message
                showMessage('success', 'Thank you! Your submission has been received. We will contact you soon.');
                
                // Reset form after short delay
                setTimeout(() => {
                    this.reset();
                }, 2000);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
            return;
        }
        
        // Email validation
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
                return;
            }
        }
        
        // Phone validation
        if (field.type === 'tel') {
            const phoneRegex = /^[0-9]{10,}$/;
            const cleanPhone = field.value.replace(/\D/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showFieldError(field, 'Please enter a valid phone number (10+ digits)');
                isValid = false;
                return;
            }
        }
        
        // Date validation (not in the past)
        if (field.type === 'date') {
            const selectedDate = new Date(field.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showFieldError(field, 'Event date cannot be in the past');
                isValid = false;
                return;
            }
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('border-red-500');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-sm mt-1 error-message';
    errorDiv.textContent = message;
    
    field.parentElement.appendChild(errorDiv);
}

function clearFormErrors(form) {
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    const errorFields = form.querySelectorAll('.border-red-500');
    errorFields.forEach(field => field.classList.remove('border-red-500'));
}

function showMessage(type, message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message-success, .message-error');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'message-success' : 'message-error';
    messageDiv.textContent = message;
    
    // Add to the top of the form or page
    const form = document.querySelector('form');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'opacity 0.5s';
        setTimeout(() => messageDiv.remove(), 500);
    }, 5000);
}

// Gallery Filters
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('fade-in');
                    }, 10);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Smooth Scroll
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Gallery Lightbox (Optional)
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                return; // Don't open lightbox if clicking button
            }
            
            const lightbox = document.createElement('div');
            lightbox.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4';
            lightbox.style.cursor = 'pointer';
            
            const content = document.createElement('div');
            content.className = 'text-center text-white max-w-4xl';
            content.innerHTML = `
                <div class="text-8xl mb-4">🌸</div>
                <h3 class="text-3xl font-bold mb-2">${this.querySelector('h3')?.textContent || 'Garland'}</h3>
                <p class="text-lg">${this.querySelector('p')?.textContent || ''}</p>
                <p class="mt-4 text-sm opacity-75">Click anywhere to close</p>
            `;
            
            lightbox.appendChild(content);
            document.body.appendChild(lightbox);
            
            lightbox.addEventListener('click', function() {
                this.style.opacity = '0';
                this.style.transition = 'opacity 0.3s';
                setTimeout(() => this.remove(), 300);
            });
        });
    });
}

// Initialize lightbox if on gallery page
if (window.location.pathname.includes('gallery')) {
    setTimeout(initLightbox, 500);
}

// Testimonial Carousel (Optional)
function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;
    
    let currentIndex = 0;
    const items = carousel.querySelectorAll('.testimonial-item');
    const totalItems = items.length;
    
    if (totalItems === 0) return;
    
    function showTestimonial(index) {
        items.forEach((item, i) => {
            item.style.display = i === index ? 'block' : 'none';
        });
    }
    
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % totalItems;
        showTestimonial(currentIndex);
    }
    
    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        showTestimonial(currentIndex);
    }
    
    // Show first testimonial
    showTestimonial(0);
    
    // Auto-rotate every 5 seconds
    setInterval(nextTestimonial, 5000);
    
    // Add navigation buttons if they exist
    const nextBtn = document.querySelector('.testimonial-next');
    const prevBtn = document.querySelector('.testimonial-prev');
    
    if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
    if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
}

initTestimonialCarousel();

// Back to Top Button
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '↑';
backToTopButton.className = 'fixed bottom-8 right-8 bg-green-700 text-white w-12 h-12 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hidden z-40';
backToTopButton.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.remove('hidden');
    } else {
        backToTopButton.classList.add('hidden');
    }
});
