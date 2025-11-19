// Main JavaScript file for Eurovolt website
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for anchor links
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

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe service cards, product cards, and other animated elements
    document.querySelectorAll('.service-card, .product-preview-card, .product-card, .innovation-card, .team-card').forEach(el => {
        observer.observe(el);
    });

    // Counter animation for statistics
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Initialize counters when they come into view
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Product modal functionality
    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const productName = button.getAttribute('data-product');
            const modalTitle = productModal.querySelector('#productModalTitle');
            const modalBody = productModal.querySelector('#productModalBody');

            modalTitle.textContent = productName + ' - Detailed Specifications';
            
            // Load detailed product information
            loadProductDetails(productName, modalBody);
        });
    }

    function loadProductDetails(productName, container) {
        // Show loading state
        container.innerHTML = '<div class="text-center"><div class="spinner"></div>Loading product details...</div>';

        // Simulate API call or load from data
        setTimeout(() => {
            const productDetails = getProductDetails(productName);
            container.innerHTML = productDetails;
        }, 500);
    }

    function getProductDetails(productName) {
        const productData = {
            'EV-5000H': {
                specifications: {
                    'Rated Power': '5000W',
                    'Input Voltage': 'DC 48V',
                    'Output Voltage': 'AC 230V',
                    'Efficiency': '97.5%',
                    'MPPT Range': '60-145V',
                    'Battery Type': 'Lithium/Lead Acid',
                    'Display': 'LCD with WiFi',
                    'Protection': 'Over/Under voltage, Overload, Short circuit'
                },
                features: [
                    'Advanced MPPT technology with 99.9% tracking efficiency',
                    'Built-in WiFi for remote monitoring',
                    'Compatible with lithium and lead-acid batteries',
                    'Intelligent battery management system',
                    'Mobile app support for iOS and Android',
                    'Grid-tie functionality with anti-islanding protection'
                ],
                certifications: ['CE', 'UL', 'TUV', 'IEC 62109'],
                warranty: '5 years standard warranty, extendable to 10 years'
            },
            'EV-10000H': {
                specifications: {
                    'Rated Power': '10000W',
                    'Input Voltage': 'DC 96V',
                    'Output Voltage': 'AC 230V/400V',
                    'Efficiency': '98.2%',
                    'MPPT Range': '120-450V',
                    'Battery Type': 'Lithium/Lead Acid',
                    'Display': 'Touch Screen with WiFi',
                    'Protection': 'Comprehensive protection suite'
                },
                features: [
                    'Dual MPPT controllers for maximum flexibility',
                    '7-inch color touch screen interface',
                    'Smart grid ready with reactive power control',
                    'Advanced battery charging algorithms',
                    'Remote firmware update capability',
                    'Emergency power supply (EPS) function'
                ],
                certifications: ['CE', 'UL', 'TUV', 'IEC 62109', 'IEEE 1547'],
                warranty: '5 years standard warranty with global support'
            },
            'EV-15000H': {
                specifications: {
                    'Rated Power': '15000W',
                    'Input Voltage': 'DC 192V',
                    'Output Voltage': 'AC 400V',
                    'Efficiency': '98.5%',
                    'MPPT Range': '200-800V',
                    'Battery Type': 'Lithium/Lead Acid',
                    'Display': 'Smart Touch Panel',
                    'Protection': 'AI-powered protection system'
                },
                features: [
                    'Triple MPPT design for commercial applications',
                    'AI-powered energy optimization',
                    'Grid support functions (frequency/voltage regulation)',
                    'Modular design for easy maintenance',
                    'Industrial-grade components (-25°C to +60°C)',
                    'Integrated energy management system'
                ],
                certifications: ['CE', 'UL', 'TUV', 'IEC 62109', 'IEEE 1547', 'VDE-AR-N 4105'],
                warranty: '5 years commercial warranty with 24/7 support'
            }
        };

        const product = productData[productName];
        if (!product) {
            return '<div class="alert alert-warning">Product details not available.</div>';
        }

        let html = '<div class="product-details">';
        
        // Specifications table
        html += '<h5><i class="fas fa-cog me-2"></i>Technical Specifications</h5>';
        html += '<div class="table-responsive mb-4">';
        html += '<table class="table table-striped">';
        for (const [key, value] of Object.entries(product.specifications)) {
            html += `<tr><th>${key}</th><td>${value}</td></tr>`;
        }
        html += '</table></div>';

        // Features
        html += '<h5><i class="fas fa-star me-2"></i>Key Features</h5>';
        html += '<ul class="list-unstyled mb-4">';
        product.features.forEach(feature => {
            html += `<li><i class="fas fa-check text-success me-2"></i>${feature}</li>`;
        });
        html += '</ul>';

        // Certifications
        html += '<h5><i class="fas fa-certificate me-2"></i>Certifications</h5>';
        html += '<div class="mb-3">';
        product.certifications.forEach(cert => {
            html += `<span class="badge bg-primary me-2">${cert}</span>`;
        });
        html += '</div>';

        // Warranty
        html += '<h5><i class="fas fa-shield-alt me-2"></i>Warranty</h5>';
        html += `<p class="mb-0">${product.warranty}</p>`;

        html += '</div>';
        return html;
    }

    // Form validation enhancement
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Loading states for buttons
    document.querySelectorAll('.btn[type="submit"]').forEach(button => {
        button.addEventListener('click', function() {
            const form = this.closest('form');
            if (form && form.checkValidity()) {
                this.innerHTML = '<div class="spinner"></div>Sending...';
                this.disabled = true;
            }
        });
    });

    // Tooltip initialization
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopButton.className = 'btn btn-primary btn-back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: none;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Search functionality (if search input exists)
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const searchableElements = document.querySelectorAll('.searchable');
            
            searchableElements.forEach(element => {
                const text = element.textContent.toLowerCase();
                const parent = element.closest('.product-card, .service-card');
                
                if (text.includes(searchTerm) || searchTerm === '') {
                    if (parent) parent.style.display = 'block';
                } else {
                    if (parent) parent.style.display = 'none';
                }
            });
        });
    }

    // Initialize language on page load
    updatePageLanguage();

    // Update language display
    function updateLanguageDisplay() {
        const currentLang = getCurrentLanguage();
        const langNames = {
            'en': 'English',
            'zh': '中文',
            'es': 'Español',
            'de': 'Deutsch',
            'fr': 'Français'
        };
        const langSpan = document.getElementById('currentLang');
        if (langSpan) {
            langSpan.textContent = langNames[currentLang] || 'English';
        }
    }

    // Update all translatable elements
    function updatePageLanguage() {
        const currentLang = getCurrentLanguage();
        updateLanguageDisplay();

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = getTranslation(key, currentLang);
        });

        // Update specific elements
        const navBrand = document.getElementById('nav-brand');
        if (navBrand) navBrand.textContent = getTranslation('company_name', currentLang);

        const footerCompany = document.getElementById('footer-company');
        if (footerCompany) footerCompany.textContent = getTranslation('company_name', currentLang);

        const footerTagline = document.getElementById('footer-tagline');
        if (footerTagline) footerTagline.textContent = getTranslation('tagline', currentLang);

        const footerCopyright = document.getElementById('footer-copyright');
        if (footerCopyright) footerCopyright.textContent = getTranslation('company_name', currentLang);

        // Update page title
        const titleElement = document.querySelector('title');
        if (titleElement && titleElement.textContent.includes('Eurovolt')) {
            titleElement.textContent = `${getTranslation('company_name', currentLang)} - ${getTranslation('tagline', currentLang)}`;
        }

        // Update chat placeholder
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.placeholder = getTranslation('chat_placeholder', currentLang);
        }
    }

    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // Partner logo hover effects
    document.querySelectorAll('.partner-logo').forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) translateY(-3px)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });

    // Render products if on products page
    if (typeof productData !== 'undefined') {
        renderProducts();
    }

    // Render roadmap if on roadmap page
    if (typeof roadmapData !== 'undefined' && document.getElementById('roadmapTimeline')) {
        renderRoadmap();
    }

    console.log('Eurovolt website initialized successfully');
});

// Render products dynamically
function renderProducts() {
    if (typeof productData === 'undefined') return;

    const categories = [
        { key: 'hybrid_inverters', containerId: 'hybridInvertersContainer' },
        { key: 'ongrid_inverters', containerId: 'ongridInvertersContainer' },
        { key: 'offgrid_inverters', containerId: 'offgridInvertersContainer' },
        { key: 'mppt_controllers', containerId: 'mpptControllersContainer' },
        { key: 'pwm_controllers', containerId: 'pwmControllersContainer' }
    ];

    categories.forEach(category => {
        const container = document.getElementById(category.containerId);
        if (container && productData[category.key]) {
            container.innerHTML = productData[category.key].map(product => createProductCard(product)).join('');
        }
    });
}

// Create product card HTML
function createProductCard(product) {
    let html = '<div class="col-md-6 col-lg-4 mb-4">';
    html += '<div class="card h-100 product-card">';
    html += '<div class="card-body">';
    html += `<h5 class="card-title text-dark">${product.name}</h5>`;

    if (product.power) html += `<p class="mb-2 text-dark"><strong>Power:</strong> ${product.power}</p>`;
    if (product.current) html += `<p class="mb-2 text-dark"><strong>Current:</strong> ${product.current}</p>`;
    if (product.voltage) html += `<p class="mb-2 text-dark"><strong>Voltage:</strong> ${product.voltage}</p>`;
    if (product.efficiency) html += `<p class="mb-2 text-dark"><strong>Efficiency:</strong> ${product.efficiency}</p>`;
    if (product.mppt_range) html += `<p class="mb-2 text-dark"><strong>MPPT Range:</strong> ${product.mppt_range}</p>`;

    if (product.features && product.features.length > 0) {
        html += '<div class="mt-3 text-dark"><strong>Features:</strong><ul class="list-unstyled mt-2">';
        product.features.slice(0, 3).forEach(feature => {
            html += `<li class="text-dark"><i class="fas fa-check text-success me-2"></i>${feature}</li>`;
        });
        html += '</ul></div>';
    }

    if (product.warranty) html += `<p class="mb-2 text-dark"><strong>Warranty:</strong> ${product.warranty}</p>`;
    if (product.price) html += `<p class="text-primary fw-bold fs-5">${product.price}</p>`;

    html += '<div class="mt-3">';
    html += '<a href="contact.html" class="btn btn-primary btn-sm">Request Quote</a>';
    html += '</div>';

    html += '</div></div></div>';
    return html;
}

// Render roadmap timeline
function renderRoadmap() {
    const timeline = document.getElementById('roadmapTimeline');
    if (!timeline || typeof roadmapData === 'undefined') return;

    timeline.innerHTML = roadmapData.map((item, index) => {
        const isLeft = index % 2 === 0;
        const isFuture = item.goals !== undefined;

        let html = `<div class="timeline-item ${isLeft ? 'left' : 'right'}">`;
        html += '<div class="timeline-content">';
        html += `<div class="timeline-year">${item.year}</div>`;
        html += `<h3>${item.title}</h3>`;

        if (item.achievements) {
            html += '<ul class="achievement-list">';
            item.achievements.forEach(achievement => {
                html += `<li><i class="fas fa-check-circle text-success me-2"></i>${achievement}</li>`;
            });
            html += '</ul>';
        }

        if (item.goals) {
            html += '<ul class="achievement-list">';
            item.goals.forEach(goal => {
                html += `<li><i class="fas fa-star text-warning me-2"></i>${goal}</li>`;
            });
            html += '</ul>';
        }

        html += '</div></div>';
        return html;
    }).join('');
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for use in other scripts
window.EurovoltUtils = {
    debounce,
    throttle
};
