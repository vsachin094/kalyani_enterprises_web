// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu after click
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        }
    });
});

// Advanced navbar scroll effect
function updateNavbar() {
    const mainNav = document.getElementById('mainNav');
    const scrollTop = window.scrollY;
    const hero = document.querySelector('.hero-section'); // Assuming you have a hero section
    
    if (!mainNav || !hero) return;

    const heroBottom = hero.offsetTop + hero.offsetHeight;
    const scrollPercent = Math.min((scrollTop / heroBottom) * 100, 100);
    
    // Check if we're over a light background
    if (scrollTop > 50) {
        mainNav.classList.add('navbar-scrolled');
        // Add smooth opacity transition
        mainNav.style.background = `rgba(255, 255, 255, ${Math.min(scrollPercent / 100 * 0.9, 0.9)})`;
        mainNav.style.backdropFilter = `blur(${Math.min(scrollPercent / 10, 10)}px)`;
    } else {
        mainNav.classList.remove('navbar-scrolled');
        mainNav.style.background = 'transparent';
        mainNav.style.backdropFilter = 'blur(0px)';
    }
}

// Debounce function for better performance
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

// Initialize navbar behavior
document.addEventListener('DOMContentLoaded', function() {
    // Initial check
    updateNavbar();
    
    // Handle scroll with debouncing for better performance
    const debouncedScroll = debounce(() => requestAnimationFrame(updateNavbar), 10);
    window.addEventListener('scroll', debouncedScroll, { passive: true });
    
    // Handle window resize
    window.addEventListener('resize', debouncedScroll, { passive: true });
});

// Add active class to nav links on scroll
window.addEventListener('scroll', function() {
    let scrollPosition = window.scrollY;
    
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Contact Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inquiryForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };
            
            // Disable submit button
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';
            
            fetch('/submit_inquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                const messageDiv = document.getElementById('formMessage');
                if (data.success) {
                    messageDiv.innerHTML = '<div class="alert alert-success"><strong>Success!</strong> ' + data.message + '</div>';
                    form.reset();
                } else {
                    messageDiv.innerHTML = '<div class="alert alert-danger"><strong>Error!</strong> ' + data.message + '</div>';
                }
                
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bi bi-send-fill"></i> Submit Inquiry';
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    messageDiv.innerHTML = '';
                }, 5000);
            })
            .catch(error => {
                const messageDiv = document.getElementById('formMessage');
                messageDiv.innerHTML = '<div class="alert alert-danger"><strong>Error!</strong> Failed to submit form. Please try calling us directly.</div>';
                
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bi bi-send-fill"></i> Submit Inquiry';
                
                console.error('Error:', error);
            });
        });
    }
});

// Portfolio Slider
document.addEventListener('DOMContentLoaded', function() {
    const portfolioTrack = document.querySelector('.portfolio-track');
    const prevBtn = document.querySelector('.btn-portfolio-prev');
    const nextBtn = document.querySelector('.btn-portfolio-next');
    
    if (portfolioTrack && prevBtn && nextBtn) {
        let currentPosition = 0;
        const itemWidth = 370; // 350px + 20px gap
        
        prevBtn.addEventListener('click', function() {
            currentPosition += itemWidth;
            if (currentPosition > 0) currentPosition = 0;
            portfolioTrack.style.transform = `translateX(${currentPosition}px)`;
        });
        
        nextBtn.addEventListener('click', function() {
            const maxScroll = -(portfolioTrack.scrollWidth - portfolioTrack.parentElement.offsetWidth);
            currentPosition -= itemWidth;
            if (currentPosition < maxScroll) currentPosition = maxScroll;
            portfolioTrack.style.transform = `translateX(${currentPosition}px)`;
        });
    }
});

// Testimonials Slider
document.addEventListener('DOMContentLoaded', function() {
    const testimonialsTrack = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.btn-testimonial-prev');
    const nextBtn = document.querySelector('.btn-testimonial-next');
    
    if (testimonialsTrack && prevBtn && nextBtn) {
        let currentPosition = 0;
        const itemWidth = 375; // 350px + 25px gap
        
        prevBtn.addEventListener('click', function() {
            currentPosition += itemWidth;
            if (currentPosition > 0) currentPosition = 0;
            testimonialsTrack.style.transform = `translateX(${currentPosition}px)`;
        });
        
        nextBtn.addEventListener('click', function() {
            const maxScroll = -(testimonialsTrack.scrollWidth - testimonialsTrack.parentElement.offsetWidth);
            currentPosition -= itemWidth;
            if (currentPosition < maxScroll) currentPosition = maxScroll;
            testimonialsTrack.style.transform = `translateX(${currentPosition}px)`;
        });
    }
});

// Animate on scroll for product cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe product cards
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
});

window.addEventListener('scroll', function() {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 40) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});




