// Help Center page logic

document.addEventListener('DOMContentLoaded', () => {
    // --- FAQ Accordion (functionality already in animations.js, ensure proper class names) ---
    // The accordion logic is already in animations.js and targets '.accordion-header'
    // and '.accordion-content'. No additional JS is needed here for basic accordion function.
    // If search/filter for FAQ is needed, it would go here.

    const faqSearchInput = document.querySelector('.help-center-container .search-bar input');
    const accordionItems = document.querySelectorAll('.faq-accordion .accordion-item');

    if (faqSearchInput) {
        faqSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            accordionItems.forEach(item => {
                const headerText = item.querySelector('.accordion-header').textContent.toLowerCase();
                const contentText = item.querySelector('.accordion-content') ? item.querySelector('.accordion-content').textContent.toLowerCase() : '';

                if (headerText.includes(searchTerm) || contentText.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // --- Contact Form Logic ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');

            // Simulate loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner"></span> Sending...';

            // In a real application, you'd send an AJAX request here
            setTimeout(() => {
                // Simulate success
                alert('Your message has been sent successfully!');
                submitButton.innerHTML = '<i class="ri-check-line"></i> Sent!';
                submitButton.style.backgroundColor = 'var(--color-success)';
                contactForm.reset();
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Send Message';
                    submitButton.style.backgroundColor = ''; // Reset to default primary
                }, 2000);
            }, 2000);
        });
    }
});