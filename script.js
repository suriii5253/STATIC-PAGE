const carousel = document.querySelector('.carousel-container');
const cards = carousel.querySelectorAll('.card');
const prevBtn = document.querySelector('.nav-btn.left');
const nextBtn = document.querySelector('.nav-btn.right');
let currentIndex = 0;
let startX, moveX;
const cardWidth = cards[0].offsetWidth + 20; 

// Debounce function for performance
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

const updateCarousel = debounce(() => {
    requestAnimationFrame(() => {
        carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex + 1);
        });

        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= cards.length - 3 ? '0.5' : '1';
    });
}, 16); 

// Touch support
carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
}, { passive: true });

carousel.addEventListener('touchmove', (e) => {
    if (!startX) return;
    moveX = e.touches[0].clientX;
    const diff = moveX - startX;
    
    if (Math.abs(diff) > 50) { 
        if (diff > 0 && currentIndex > 0) {
            currentIndex--;
        } else if (diff < 0 && currentIndex < cards.length - 3) {
            currentIndex++;
        }
        startX = null;
        updateCarousel();
    }
}, { passive: true });

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < cards.length - 3) {
        currentIndex++;
        updateCarousel();
    }
});

// Initialize carousel
updateCarousel();

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartCount = document.querySelector('.cart-count');
let count = 0;

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        count++;
        cartCount.textContent = count;
        
        // Animation for button
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    });
});

// Search functionality
const searchForm = document.querySelector('.search-bar');
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchInput = searchForm.querySelector('input');
    // Add your search logic here
    console.log('Searching for:', searchInput.value);
});

// Form validation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        // Add your form submission logic here
        console.log('Form submitted:', Object.fromEntries(formData));
    });
}

// Quantity controls
const quantityControls = document.querySelectorAll('.quantity-control');
quantityControls.forEach(control => {
    const minusBtn = control.querySelector('.minus');
    const plusBtn = control.querySelector('.plus');
    const quantitySpan = control.querySelector('span');
    let quantity = 1;

    minusBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantitySpan.textContent = quantity;
        }
    });

    plusBtn.addEventListener('click', () => {
        quantity++;
        quantitySpan.textContent = quantity;
    });
});

// Modal functionality with optimizations
const modal = document.getElementById('requestDishModal');
const requestDishBtn = document.querySelector('.request-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const submitBtn = document.querySelector('.submit-btn');
const requestDishForm = document.getElementById('requestDishForm');

let scrollPosition = 0;

function lockScroll() {
    scrollPosition = window.pageYOffset;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
}

function unlockScroll() {
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, scrollPosition);
}

function openModal() {
    modal.classList.add('active');
    lockScroll();
    modal.setAttribute('aria-hidden', 'false');
    
    // Trap focus inside modal
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    firstFocusableElement.focus();
    
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function closeModal() {
    modal.classList.remove('active');
    unlockScroll();
    modal.setAttribute('aria-hidden', 'true');
    requestDishForm.reset();
    requestDishBtn.focus(); // Return focus to trigger button
}

requestDishBtn.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

requestDishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add form validation
    const formData = new FormData(requestDishForm);
    const isValid = Array.from(formData.entries()).every(([_, value]) => value.trim() !== '');
    
    if (isValid) {
        closeModal();
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Your dish request has been submitted!';
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    } else {
        alert('Please fill in all fields');
    }
});

// Smooth scroll for navigation
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add animation classes on scroll
function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}

const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.2
});

const sections = document.querySelectorAll('section');
sections.forEach(section => {
    observer.observe(section);
});

// Update CSS for smooth transitions
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .video-overlay {
            transition: opacity 0.3s ease !important;
        }
        .video-container {
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
});