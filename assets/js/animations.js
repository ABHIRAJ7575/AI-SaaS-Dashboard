// This file contains JavaScript for controlling animations and interactions.

document.addEventListener('DOMContentLoaded', () => {
    // --- Intersection Observer for element reveal animations ---
    const animatedElements = document.querySelectorAll('[data-animate-on-scroll]');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible'); // Add a class to trigger CSS animation
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // --- Animated Counting Numbers (for stats section) ---
    function animateNumber(element, start, end, duration) {
        let startTime = null;
        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue.toLocaleString(); // Add comma for thousands
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = end.toLocaleString();
            }
        };
        window.requestAnimationFrame(step);
    }

    const statNumbers = document.querySelectorAll('.stats-grid .stat-number');
    statNumbers.forEach(stat => {
        const targetValue = parseInt(stat.dataset.target, 10);
        stat.textContent = '0'; // Initialize to 0
        new IntersectionObserver((entries, observerNum) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(stat, 0, targetValue, 2000); // Animate from 0 to target over 2 seconds
                    observerNum.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }).observe(stat);
    });

    // --- Testimonial Carousel ---
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');

    if (testimonialCarousel && prevButton && nextButton) {
        let scrollAmount = 0;
        // Ensure that testimonial-card exists before calculating width
        const firstCard = testimonialCarousel.querySelector('.testimonial-card');
        const cardWidth = firstCard ? firstCard.offsetWidth + 20 : 370; // Card width + gap, fallback if not found

        prevButton.addEventListener('click', () => {
            scrollAmount -= cardWidth;
            testimonialCarousel.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
            if (scrollAmount < 0) scrollAmount = 0; // Prevent scrolling too far left
        });

        nextButton.addEventListener('click', () => {
            scrollAmount += cardWidth;
            testimonialCarousel.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
            // Optional: Prevent scrolling too far right - would need to calculate total scrollable width
        });
    }

    // --- FAQ Accordion ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const content = header.nextElementSibling;

            // Toggle active class on current item
            currentItem.classList.toggle('active');

            // Toggle display of content
            if (currentItem.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = 0;
            }

            // Rotate icon (assuming an icon like ri-arrow-down-s-line is used)
            const icon = header.querySelector('i');
            if (icon) {
                icon.style.transform = currentItem.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
    });

    // Initialize accordion content height
    document.querySelectorAll('.accordion-content').forEach(content => {
        content.style.maxHeight = 0;
        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.3s ease-out';
    });
});
