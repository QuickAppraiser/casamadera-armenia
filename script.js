/**
 * Muebles Excalibur - JavaScript Principal
 * Optimizado para conversión y UX
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // MOBILE MENU
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // ============================================
    // PRODUCT FILTER
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter products
            const filter = this.dataset.filter;

            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ============================================
    // FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ============================================
    // FILE UPLOAD PREVIEW
    // ============================================
    const fileUpload = document.getElementById('fileUpload');
    const fileInput = document.getElementById('imagenes');
    const filePreview = document.getElementById('filePreview');

    if (fileInput && filePreview) {
        fileInput.addEventListener('change', function() {
            filePreview.innerHTML = '';

            if (this.files.length > 5) {
                alert('Máximo 5 imágenes permitidas');
                this.value = '';
                return;
            }

            Array.from(this.files).forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();

                    reader.onload = function(e) {
                        const preview = document.createElement('div');
                        preview.style.cssText = `
                            width: 60px;
                            height: 60px;
                            border-radius: 8px;
                            overflow: hidden;
                            position: relative;
                        `;
                        preview.innerHTML = `
                            <img src="${e.target.result}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">
                            <span style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.5); color: white; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; cursor: pointer;" data-index="${index}">&times;</span>
                        `;
                        filePreview.appendChild(preview);
                    };

                    reader.readAsDataURL(file);
                }
            });
        });

        // Drag and drop
        if (fileUpload) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                fileUpload.addEventListener(eventName, preventDefaults, false);
            });

            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }

            ['dragenter', 'dragover'].forEach(eventName => {
                fileUpload.addEventListener(eventName, () => {
                    fileUpload.style.borderColor = '#5D4037';
                    fileUpload.style.backgroundColor = 'rgba(93, 64, 55, 0.05)';
                });
            });

            ['dragleave', 'drop'].forEach(eventName => {
                fileUpload.addEventListener(eventName, () => {
                    fileUpload.style.borderColor = '';
                    fileUpload.style.backgroundColor = '';
                });
            });

            fileUpload.addEventListener('drop', function(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                fileInput.files = files;
                fileInput.dispatchEvent(new Event('change'));
            });
        }
    }

    // ============================================
    // FORM VALIDATION & SUBMISSION
    // ============================================
    const customOrderForm = document.getElementById('customOrderForm');

    if (customOrderForm) {
        customOrderForm.addEventListener('submit', function(e) {
            const nombre = document.getElementById('nombre').value.trim();
            const whatsapp = document.getElementById('whatsapp').value.trim();
            const tipoMueble = document.getElementById('tipo_mueble').value;
            const descripcion = document.getElementById('descripcion').value.trim();

            if (!nombre || !whatsapp || !tipoMueble || !descripcion) {
                e.preventDefault();
                alert('Por favor completa los campos obligatorios');
                return;
            }

            // Validate WhatsApp number
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            if (!phoneRegex.test(whatsapp.replace(/\s/g, ''))) {
                e.preventDefault();
                alert('Por favor ingresa un número de WhatsApp válido');
                return;
            }

            // Show loading state
            const submitBtn = customOrderForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<svg class="spinner" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4" stroke-dashoffset="31.4"><animate attributeName="stroke-dashoffset" values="31.4;0" dur="1s" repeatCount="indefinite"/></circle></svg> Enviando...';
            submitBtn.disabled = true;
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // WHATSAPP TRACKING (Analytics Ready)
    // ============================================
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');

    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track WhatsApp clicks
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    event_category: 'WhatsApp',
                    event_label: this.textContent.trim() || 'WhatsApp Button',
                    value: 1
                });
            }

            // Track with Facebook Pixel
            if (typeof fbq === 'function') {
                fbq('track', 'Contact', {
                    content_name: 'WhatsApp Click'
                });
            }

            console.log('WhatsApp click tracked:', this.href);
        });
    });

    // ============================================
    // LAZY LOADING IMAGES (Native + Fallback)
    // ============================================
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        const lazyLoad = function() {
            lazyImages.forEach(img => {
                if (img.getBoundingClientRect().top < window.innerHeight + 100) {
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.add('loaded');
                }
            });
        };

        window.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        lazyLoad();
    }

    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.category-card, .product-card, .project-card, .why-card, .testimonial-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // ============================================
    // CATEGORY CARDS CLICK HANDLER
    // ============================================
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;

            // Scroll to products section
            const productsSection = document.getElementById('catalogo');
            if (productsSection) {
                const headerOffset = 80;
                const elementPosition = productsSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset + 400;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Activate filter after scroll
                setTimeout(() => {
                    const filterBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
                    if (filterBtn) {
                        filterBtn.click();
                    }
                }, 500);
            }
        });
    });

    // ============================================
    // VIDEO TESTIMONIAL PLAY (Placeholder)
    // ============================================
    const playButton = document.querySelector('.play-button');

    if (playButton) {
        playButton.addEventListener('click', function() {
            // In production, this would open a video modal
            alert('Video testimonial - Aquí se reproduciría el video del cliente');
        });
    }

    // ============================================
    // SCROLL TO TOP ON LOGO CLICK
    // ============================================
    const logoLinks = document.querySelectorAll('.logo');
    logoLinks.forEach(logo => {
        logo.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#inicio') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // CONSOLE BRANDING
    // ============================================
    console.log('%c Muebles Excalibur ', 'background: #5D4037; color: white; font-size: 16px; padding: 10px;');
    console.log('%c Muebles de calidad en el Quindío ', 'color: #8D6E63; font-size: 12px;');
    console.log('%c WhatsApp: +57 311 311 1669 ', 'color: #25D366; font-size: 12px;');
});

// ============================================
// SERVICE WORKER REGISTRATION (PWA Ready)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed:', err));
    });
}
