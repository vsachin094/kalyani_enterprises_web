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
    const hero = document.querySelector('.hero-section');
    
    if (!mainNav) return;

    const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0;
    const scrollPercent = heroBottom ? Math.min((scrollTop / heroBottom) * 100, 100) : 100;
    
    if (scrollTop > 50) {
        mainNav.classList.add('navbar-scrolled');
        mainNav.style.background = `rgba(255, 255, 255, ${hero ? Math.min(scrollPercent / 100 * 0.9, 0.9) : 0.98})`;
        mainNav.style.backdropFilter = `blur(${hero ? Math.min(scrollPercent / 10, 10) : 15}px)`;
    } else {
        mainNav.classList.remove('navbar-scrolled');
        mainNav.style.background = 'rgba(255, 255, 255, 0.95)';
        mainNav.style.backdropFilter = 'blur(10px)';
    }
}

// Debounce function
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
    updateNavbar();
    const debouncedScroll = debounce(() => requestAnimationFrame(updateNavbar), 10);
    window.addEventListener('scroll', debouncedScroll, { passive: true });
    window.addEventListener('resize', debouncedScroll, { passive: true });
});

// Randomly choose a hero video or image on each homepage load.
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.getElementById('home');
    const heroVideo = document.getElementById('heroVideo');
    if (!hero || !heroVideo) return;

    const imageOptions = (hero.dataset.heroImages || '').split('|').filter(Boolean);
    const useVideo = Math.random() < 0.5;

    function useRandomImage() {
        if (!imageOptions.length) return;
        const image = imageOptions[Math.floor(Math.random() * imageOptions.length)];
        hero.style.setProperty('--hero-image', `url("${image}")`);
        hero.classList.remove('hero-video-active');
    }

    heroVideo.addEventListener('error', useRandomImage, { once: true });

    if (useVideo) {
        hero.classList.add('hero-video-active');
        heroVideo.play().catch(useRandomImage);
    } else {
        useRandomImage();
    }
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
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bi bi-send-fill"></i> Submit Inquiry';
                
                setTimeout(() => {
                    messageDiv.innerHTML = '';
                }, 5000);
            })
            .catch(error => {
                const messageDiv = document.getElementById('formMessage');
                messageDiv.innerHTML = '<div class="alert alert-danger"><strong>Error!</strong> Failed to submit form. Please try calling us directly.</div>';
                
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
        const itemWidth = 370;
        
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

// Testimonials Slider with Auto-slide (UPDATED)
document.addEventListener('DOMContentLoaded', function() {
    const testimonialsTrack = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.btn-testimonial-prev');
    const nextBtn = document.querySelector('.btn-testimonial-next');
    
    if (testimonialsTrack && prevBtn && nextBtn) {
        let currentPosition = 0;
        const itemWidth = 375; // 350px + 25px gap
        let autoSlideInterval;
        
        // Auto-slide function
        function autoSlide() {
            const maxScroll = -(testimonialsTrack.scrollWidth - testimonialsTrack.parentElement.offsetWidth);
            currentPosition -= itemWidth;
            
            // Loop back to start if reached end
            if (currentPosition < maxScroll) {
                currentPosition = 0;
            }
            
            testimonialsTrack.style.transform = `translateX(${currentPosition}px)`;
        }
        
        // Start auto-slide
        function startAutoSlide() {
            autoSlideInterval = setInterval(autoSlide, 10000); // 10 seconds
        }
        
        // Stop auto-slide
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Manual Previous
        prevBtn.addEventListener('click', function() {
            stopAutoSlide();
            currentPosition += itemWidth;
            if (currentPosition > 0) currentPosition = 0;
            testimonialsTrack.style.transform = `translateX(${currentPosition}px)`;
            startAutoSlide();
        });
        
        // Manual Next
        nextBtn.addEventListener('click', function() {
            stopAutoSlide();
            const maxScroll = -(testimonialsTrack.scrollWidth - testimonialsTrack.parentElement.offsetWidth);
            currentPosition -= itemWidth;
            if (currentPosition < maxScroll) currentPosition = maxScroll;
            testimonialsTrack.style.transform = `translateX(${currentPosition}px)`;
            startAutoSlide();
        });
        
        // Pause on hover
        testimonialsTrack.addEventListener('mouseenter', stopAutoSlide);
        testimonialsTrack.addEventListener('mouseleave', startAutoSlide);
        
        // Start auto-slide on page load
        startAutoSlide();
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

// Observe product and service cards
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.product-card, .service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
});

// Image error handling
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.product-img, .service-img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            if (this.nextElementSibling) {
                this.nextElementSibling.style.display = 'flex';
            }
        });
    });
});

// About Section - Scroll-Based Image Shuffle (Slow & Smooth)
document.addEventListener('DOMContentLoaded', function() {
    const mainImg = document.querySelector('.collage-main img');
    const gridItems = document.querySelectorAll('.collage-grid .collage-item img');
    const aboutSection = document.querySelector('.about-section');
    
    if (mainImg && mainImg.dataset.images && aboutSection) {
        const collageImages = JSON.parse(mainImg.dataset.images);
        
        if (collageImages.length > 0 && gridItems.length > 0) {
            let currentIndex = 0;
            let hasShuffledOnce = false;
            let isShuffling = false;
            
            // Smooth image change function
            function changeImage(imgElement, newSrc) {
                return new Promise((resolve) => {
                    imgElement.style.opacity = '0';
                    setTimeout(() => {
                        imgElement.src = `/static/${newSrc}`;
                        imgElement.style.opacity = '1';
                        resolve();
                    }, 400);
                });
            }
            
            // Shuffle function
            async function shuffleImages() {
                if (isShuffling) return;
                isShuffling = true;
                
                // Change main image
                currentIndex = (currentIndex + 1) % collageImages.length;
                await changeImage(mainImg, collageImages[currentIndex]);
                
                // Change grid images one by one with delay
                for (let i = 0; i < gridItems.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                    const randomIndex = Math.floor(Math.random() * collageImages.length);
                    await changeImage(gridItems[i], collageImages[randomIndex]);
                }
                
                isShuffling = false;
            }
            
            // Intersection Observer for scroll detection
            const observerOptions = {
                threshold: 0.3,
                rootMargin: '0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasShuffledOnce) {
                        // First shuffle when scrolled into view
                        setTimeout(() => shuffleImages(), 500);
                        hasShuffledOnce = true;
                    }
                });
            }, observerOptions);
            
            observer.observe(aboutSection);
            
            // Slower auto-shuffle every 12 seconds (only after first view)
            setInterval(() => {
                if (hasShuffledOnce) {
                    shuffleImages();
                }
            }, 12000); // 12 seconds instead of 5
            
            // Add smooth opacity transitions
            mainImg.style.transition = 'opacity 0.4s ease';
            gridItems.forEach(img => {
                img.style.transition = 'opacity 0.4s ease';
            });
        }
    }
});
