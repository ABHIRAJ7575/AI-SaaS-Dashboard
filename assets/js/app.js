// Main application logic will go here
// This file will orchestrate interactions between other modules

document.addEventListener('DOMContentLoaded', () => {
    console.log('App.js loaded and DOM fully parsed.');

    // Remove all authentication-related code
    console.log('App loaded - no authentication required');

    // Example: Sidebar toggle for dashboard layout
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    if (hamburgerMenu && sidebar) {
        hamburgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Placeholder for global search (Ctrl+K)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            console.log('Ctrl+K pressed - Open global search/command palette');
            // Implement modal open logic here
        }
    });

    // Page transition animation on load
    document.body.classList.add('page-enter');

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-links a, .scroll-indicator a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active section highlighting in navbar on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', debounce(() => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });

        // Change header background on scroll
        const mainHeader = document.querySelector('.main-header');
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }

    }, 100)); // Debounce scroll event for performance

    // --- Hero Section Floating Elements animation (JS driven for more control) ---
    // (Could also be CSS animations for simpler cases)
    const floatingElements = document.querySelectorAll('.floating-element');
    if (floatingElements.length > 0) {
        const moveElements = () => {
            floatingElements.forEach(el => {
                const speed = parseFloat(el.dataset.speed) || Math.random() * 0.5 + 0.1; // random speed
                const x = (window.innerWidth / 2 - el.getBoundingClientRect().left) / 20 * speed;
                const y = (window.innerHeight / 2 - el.getBoundingClientRect().top) / 20 * speed;
                el.style.transform = `translate(${x}px, ${y}px)`;
            });
            requestAnimationFrame(moveElements);
        };
        // Adding initial random positions to elements to make it more dynamic
        floatingElements.forEach(el => {
            el.style.left = `${Math.random() * 90 + 5}%`;
            el.style.top = `${Math.random() * 90 + 5}%`;
            el.dataset.speed = Math.random() * 0.5 + 0.1;
        });
        requestAnimationFrame(moveElements);
    }

    // --- Dashboard Specifics ---

    // Simple greeting for dashboard
    const dashboardGreeting = document.querySelector('#dashboardGreeting');
    if (dashboardGreeting) {
        const hour = new Date().getHours();
        let greeting;
        if (hour >= 5 && hour < 12) {
            greeting = 'Good Morning';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Good Afternoon';
        } else if (hour >= 17 && hour < 21) {
            greeting = 'Good Evening';
        } else {
            greeting = 'Good Night';
        }
        dashboardGreeting.textContent = `${greeting}!`;
    }

    // Sidebar toggle for dashboard layout
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    if (hamburgerMenu && sidebar) {
        hamburgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            // Store sidebar state in local storage
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        });

        // Restore sidebar state from local storage on load
        if (localStorage.getItem('sidebarCollapsed') === 'true') {
            sidebar.classList.add('collapsed');
        }
    }

    // Remove logout and authentication functionality
    console.log('No authentication required');

    // --- Notifications Popover ---
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', () => {
            console.log('Notifications clicked - implement notification system');
        });
    }

    // --- User Avatar Dropdown ---
    const userAvatarDropdown = document.querySelector('.user-avatar-dropdown');
    if (userAvatarDropdown) {
        userAvatarDropdown.addEventListener('click', () => {
            console.log('User dropdown clicked - implement user menu');
        });
    }

    // --- Global Search / Command Palette (Ctrl+K) ---
    const searchBarInput = document.querySelector('.top-navbar .search-bar input');
    if (searchBarInput) {
        searchBarInput.addEventListener('focus', () => {
            // Show search overlay/suggestions
            console.log('Search bar focused');
        });
        searchBarInput.addEventListener('blur', () => {
            // Hide search overlay/suggestions
            console.log('Search bar unfocused');
        });
    }

    // Remove sidebar user name functionality since no auth
    console.log('Dashboard loaded successfully');

});

// Helper function to dynamically load JS modules if needed
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

