// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const socialIcons = document.querySelector('.social-icons');

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    socialIcons.classList.toggle('active');
}

hamburger.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        toggleMobileMenu();
    });
});

// Smooth scrolling for navigation links
function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Close mobile menu if open
    toggleMobileMenu();
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', handleNavClick);
});

// Navbar background on scroll - Modified for invisible to black transition
function handleScroll() {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image img');
    
    if (hero && heroImage) {
        const scrollPercent = window.scrollY / window.innerHeight;
        heroImage.style.transform = `translateY(${scrollPercent * 50}px)`;
    }
}

window.addEventListener('scroll', handleScroll);

// Form submission
const contactForm = document.getElementById('contact-form');

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.phone || !data.service) {
        showNotification('Te rog să completezi toate câmpurile obligatorii.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Te rog să introduci o adresă de email validă.', 'error');
        return;
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[0-9\s\-$$$$]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
        showNotification('Te rog să introduci un număr de telefon valid.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Se trimite...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        showNotification('Mulțumesc pentru mesaj! Voi reveni cu un răspuns în cel mai scurt timp.', 'success');
    }, 2000);
}

if (contactForm) {
  contactForm.addEventListener('submit', handleFormSubmit);
}
// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
    observer.observe(card);
});

// Observe contact items
document.querySelectorAll('.contact-item').forEach(item => {
    observer.observe(item);
});

// Gallery data for each service
const galleryData = {
    nunta: [
        '/placeholder.svg?height=800&width=1200&text=Wedding+Photo+1',
        '/placeholder.svg?height=800&width=1200&text=Wedding+Photo+2',
        '/placeholder.svg?height=800&width=1200&text=Wedding+Photo+3',
        '/placeholder.svg?height=800&width=1200&text=Wedding+Photo+4',
        '/placeholder.svg?height=800&width=1200&text=Wedding+Photo+5',
        '/placeholder.svg?height=800&width=1200&text=Wedding+Photo+6',
        '/placeholder.svg?height=800&width=1200&text=Wedding+Photo+7',
        '/placeholder.svg?height=800&width=1200&text=Wedding+Photo+8'
    ],
    botez: [
        '/placeholder.svg?height=800&width=1200&text=Baptism+Photo+1',
        '/placeholder.svg?height=800&width=1200&text=Baptism+Photo+2',
        '/placeholder.svg?height=800&width=1200&text=Baptism+Photo+3',
        '/placeholder.svg?height=800&width=1200&text=Baptism+Photo+4',
        '/placeholder.svg?height=800&width=1200&text=Baptism+Photo+5',
        '/placeholder.svg?height=800&width=1200&text=Baptism+Photo+6'
    ],
    cuplu: [
        '/placeholder.svg?height=800&width=1200&text=Couple+Photo+1',
        '/placeholder.svg?height=800&width=1200&text=Couple+Photo+2',
        '/placeholder.svg?height=800&width=1200&text=Couple+Photo+3',
        '/placeholder.svg?height=800&width=1200&text=Couple+Photo+4',
        '/placeholder.svg?height=800&width=1200&text=Couple+Photo+5'
    ],
    familie: [
        '/placeholder.svg?height=800&width=1200&text=Family+Photo+1',
        '/placeholder.svg?height=800&width=1200&text=Family+Photo+2',
        '/placeholder.svg?height=800&width=1200&text=Family+Photo+3',
        '/placeholder.svg?height=800&width=1200&text=Family+Photo+4',
        '/placeholder.svg?height=800&width=1200&text=Family+Photo+5'
    ],
    amuzante: [
        '/placeholder.svg?height=800&width=1200&text=Fun+Photo+1',
        '/placeholder.svg?height=800&width=1200&text=Fun+Photo+2',
        '/placeholder.svg?height=800&width=1200&text=Fun+Photo+3',
        '/placeholder.svg?height=800&width=1200&text=Fun+Photo+4'
    ],
    'save-date': [
        'assets/images/saveTheDate/112A1791-Enhanced-NR.jpg',
        'assets/images/saveTheDate/112A1836-Enhanced-NR.jpg',
        'assets/images/saveTheDate/112A1877-Enhanced-NR.jpg',
        'assets/images/saveTheDate/112A1895-Enhanced-NR.jpg',
        'assets/images/saveTheDate/112A1916-Enhanced-NR.jpg',
        'assets/images/saveTheDate/112A1931-Enhanced-NR.jpg',
        'assets/images/saveTheDate/112A1973-Enhanced-NR.jpg',
        'assets/images/saveTheDate/112A1977-Enhanced-NR.jpg',
        'assets/images/saveTheDate/112A1986-Enhanced-NR.jpg',
        'assets/images/saveTheDate/5J9A3445-Enhanced-NR.jpg',
        'assets/images/saveTheDate/5J9A3459-Enhanced-NR.jpg',
        'assets/images/saveTheDate/5J9A3464-Enhanced-NR.jpg',
        'assets/images/saveTheDate/5J9A3468-Enhanced-NR.jpg',
        'assets/images/saveTheDate/5J9A3470-Enhanced-NR.jpg',
        'assets/images/saveTheDate/5J9A3499-Enhanced-NR-2.jpg'
    ],
    'trash-dress': [
        '/placeholder.svg?height=800&width=1200&text=Trash+Dress+Photo+1',
        '/placeholder.svg?height=800&width=1200&text=Trash+Dress+Photo+2',
        '/placeholder.svg?height=800&width=1200&text=Trash+Dress+Photo+3'
    ],
    absolvire: [
        '/placeholder.svg?height=800&width=1200&text=Graduation+Photo+1',
        '/placeholder.svg?height=800&width=1200&text=Graduation+Photo+2',
        '/placeholder.svg?height=800&width=1200&text=Graduation+Photo+3',
        '/placeholder.svg?height=800&width=1200&text=Graduation+Photo+4'
    ],
    profesional: [
        '/placeholder.svg?height=800&width=1200&text=Professional+Photo+1',
        '/placeholder.svg?height=800&width=1200&text=Professional+Photo+2',
        '/placeholder.svg?height=800&width=1200&text=Professional+Photo+3'
    ]
};

// Service titles for gallery modal
const serviceTitles = {
    nunta: 'Galerie Nuntă',
    botez: 'Galerie Botez',
    cuplu: 'Galerie Cuplu',
    familie: 'Galerie Familie',
    amuzante: 'Galerie Fotografii Amuzante',
    'save-date': 'Galerie Save the Date',
    'trash-dress': 'Galerie Trash the Dress',
    absolvire: 'Galerie Absolvire',
    profesional: 'Galerie Profesional'
};

// DOM Elements
const galleryModal = document.getElementById('gallery-modal');
const galleryTitle = document.getElementById('gallery-title');
const galleryGrid = document.getElementById('gallery-grid');
const closeGallery = document.getElementById('close-gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const closeLightbox = document.getElementById('close-lightbox');

// Handle service card clicks
function handleServiceCardClick(e) {
    const card = e.currentTarget;
    const serviceType = card.getAttribute('data-service');
    // Prevent opening gallery on hover, only on click
    if (e.target.closest('.view-gallery-btn') || card.classList.contains('flipped')) {
        openGallery(serviceType);
    }
}

document.querySelectorAll('.service-card').forEach(card => {
  console.log({card}) 
    card.addEventListener('click', handleServiceCardClick);
});

// Open gallery modal
function openGallery(serviceType) {
    const images = galleryData[serviceType];
    const title = serviceTitles[serviceType];
    
    if (!images || images.length === 0) {
        console.error('No images found for service:', serviceType);
        return;
    }
    
    galleryTitle.textContent = title;
    galleryGrid.innerHTML = '';
    
    images.forEach((imageSrc, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${imageSrc}" alt="${title} ${index + 1}" loading="lazy">
        `;
        
        galleryItem.addEventListener('click', () => {
            openLightbox(imageSrc);
        });
        
        galleryGrid.appendChild(galleryItem);
    });
    
    galleryModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close gallery modal
function closeGalleryModal() {
    galleryModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

closeGallery.addEventListener('click', closeGalleryModal);

// Open lightbox
function openLightbox(imageSrc) {
    lightboxImage.src = imageSrc;
    lightbox.style.display = 'block';
}

// Close lightbox modal
function closeLightboxModal() {
    lightbox.style.display = 'none';
    lightboxImage.src = '';
}

lightbox.addEventListener('click', closeLightboxModal);

// Close modals with Escape key
function handleKeyDown(e) {
    if (e.key === 'Escape') {
        if (lightbox.style.display === 'block') {
            closeLightboxModal();
        } else if (galleryModal.style.display === 'block') {
            closeGalleryModal();
        }
    }
}

document.addEventListener('keydown', handleKeyDown);

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 4000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for notification animation
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(notificationStyles);

// Preload images for better performance
function preloadImages() {
    const allImages = Object.values(galleryData).flat();
    allImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

setTimeout(preloadImages, 1000);

// Add smooth reveal animation for service cards
function addServiceCardAnimations() {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

addServiceCardAnimations();

// Add logo rotation on scroll
function addLogoScrollEffect() {
    const logo3d = document.querySelector('.logo-3d');
    if (logo3d) {
        window.addEventListener('scroll', () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const rotation = scrollPercent * 360;
            logo3d.style.transform = `rotateY(${rotation}deg)`;
        });
    }
}

addLogoScrollEffect();

// Add typing effect to hero description
function addTypingEffect() {
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        const text = heroDescription.textContent;
        heroDescription.textContent = '';
        heroDescription.style.borderRight = '2px solid #fbbf24';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroDescription.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                setTimeout(() => {
                    heroDescription.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
}

setTimeout(addTypingEffect, 500);

console.log('Banciu Costin Photography website loaded successfully!');