// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.backgroundColor = '#FFFFFF';
    }
});

// Search functionality
const searchBox = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');

searchButton.addEventListener('click', function() {
    const searchTerm = searchBox.value.trim();
    if (searchTerm) {
        // Here you would typically make an API call to search destinations
        alert(`Searching for: ${searchTerm}`);
    }
});

// Connect button functionality
const connectButtons = document.querySelectorAll('.connect-btn');
connectButtons.forEach(button => {
    button.addEventListener('click', function() {
        const buddyName = this.parentElement.querySelector('h3').textContent;
        if (this.textContent === 'Connect') {
            this.textContent = 'Connected';
            this.style.backgroundColor = '#654321';
            alert(`Connected with ${buddyName}!`);
        } else {
            this.textContent = 'Connect';
            this.style.backgroundColor = '#8B4513';
            alert(`Disconnected from ${buddyName}`);
        }
    });
});

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
        }
    });
});

// AI Assistant hover effects
const features = document.querySelectorAll('.feature');
features.forEach(feature => {
    feature.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    });

    feature.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 3px 10px rgba(0,0,0,0.1)';
    });
});

// Login and Signup button functionality
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');

loginBtn.addEventListener('click', function() {
    // Here you would typically show a login modal
    alert('Login functionality coming soon!');
});

signupBtn.addEventListener('click', function() {
    // Here you would typically show a signup modal
    alert('Sign up functionality coming soon!');
}); 