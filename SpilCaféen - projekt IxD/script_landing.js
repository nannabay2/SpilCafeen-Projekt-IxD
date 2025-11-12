// Spilcaféen Landingpage JavaScript

// Menu button toggle (if needed for future functionality)
const menuButton = document.querySelector('.menu-button');
if (menuButton) {
    menuButton.addEventListener('click', () => {
        console.log('Menu clicked');
        // Add menu functionality here
    });
}

// Back button functionality
const backButton = document.querySelector('.back-button');
if (backButton) {
    backButton.addEventListener('click', () => {
        window.history.back();
    });
}

// Smooth scroll for links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Button click tracking
const primaryButton = document.querySelector('.btn-primary-landing');
if (primaryButton) {
    primaryButton.addEventListener('click', (e) => {
        console.log('Hvor spiller i? button clicked');
        // Add analytics or navigation logic here
    });
}

// Add fade-in animation on load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

console.log('Spilcaféen landingpage loaded! 🎮');
