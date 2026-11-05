document.addEventListener('DOMContentLoaded', function () {

    const initMobileNav = () => {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.main-nav');
        const navLinks = document.querySelectorAll('.main-nav a');

        if (!hamburger || !navMenu) return;

        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggleMenu);

        navLinks.forEach(link => link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) toggleMenu();
        }));
    };

    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('href').startsWith('#') && this.getAttribute('href').length > 1) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }
                }
            });
        });
    };

    const initScrollSpy = () => {
        const sections = document.querySelectorAll('main section[id]');
        const navLinks = document.querySelectorAll('.main-nav a');

        if (sections.length === 0 || navLinks.length === 0) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { rootMargin: '-40% 0px -60% 0px' });

        sections.forEach(section => observer.observe(section));
    };

    const initFaqAccordion = () => {
        const faqContainer = document.querySelector('.faq-container');
        if (!faqContainer) return;

        faqContainer.addEventListener('click', function (e) {
            const questionButton = e.target.closest('.faq-question');
            if (!questionButton) return;

            const activeItem = document.querySelector('.faq-item.active');
            const clickedItem = questionButton.parentElement;

            if (activeItem && activeItem !== clickedItem) {
                activeItem.classList.remove('active');
            }

            clickedItem.classList.toggle('active');
        });
    };

    const initTabs = () => {
        const tabsContainer = document.querySelector('.tabs-container');
        if (!tabsContainer) return;

        const tabButtons = tabsContainer.querySelectorAll('.tab-button');
        const tabContents = tabsContainer.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === targetTab) {
                        content.classList.add('active');
                    }
                });
            });
        });
    };

    const impactAreas = [
        { icon: 'fas fa-sitemap',
          title_es: 'Direccionamiento Estratégico', text_es: 'Convertimos su visión en objetivos claros para un desarrollo sostenible.',
          title_en: 'Strategic Direction', text_en: 'We turn your vision into clear objectives for sustainable development.' },
        { icon: 'fas fa-users-gear',
          title_es: 'Talento Humano', text_es: 'Capitalizamos el talento para gestionar el cambio e impulsar el desarrollo integral.',
          title_en: 'Human Talent', text_en: 'We capitalize on talent to manage change and drive integral development.' },
        { icon: 'fas fa-robot',
          title_es: 'Innovación y Tecnología', text_es: 'Integramos tecnología para transformar el Talento Humano con creatividad.',
          title_en: 'Innovation & Technology', text_en: 'We integrate technology to creatively transform Human Talent.' },
        { icon: 'fas fa-chart-line',
          title_es: 'Finanzas Corporativas', text_es: 'Mejoramos la rentabilidad y la toma de decisiones con análisis profundos.',
          title_en: 'Corporate Finance', text_en: 'We improve profitability and decision-making with in-depth analysis.' },
        { icon: 'fas fa-headset',
          title_es: 'Experiencia del Cliente', text_es: 'Garantizamos la fidelización a través de estrategias efectivas y empáticas.',
          title_en: 'Customer Experience', text_en: 'We ensure loyalty through effective and empathetic strategies.' },
        { icon: 'fas fa-bullhorn',
          title_es: 'Comunicaciones y Medios', text_es: 'Ejecutamos estrategias para que su imagen refleje su identidad y valores.',
          title_en: 'Communications & Media', text_en: 'We execute strategies so your image reflects your identity and values.' }
    ];

    const initImpactCarousel = () => {
        if (typeof Swiper === 'undefined') {
            console.error('Swiper.js no está cargado.');
            return;
        }

        const swiperWrapper = document.querySelector('.impact-carousel .swiper-wrapper');
        if (!swiperWrapper) return;

        const lang = localStorage.getItem('jpl_lang') || 'es';
        const allSlides = [...impactAreas, ...impactAreas, ...impactAreas, ...impactAreas];
        let slidesHTML = '';

        allSlides.forEach(area => {
            slidesHTML += `
                <div class="swiper-slide">
                    <div class="service-card">
                        <div class="icon"><i class="${area.icon}"></i></div>
                        <h3 data-lang="es">${area.title_es}</h3>
                        <h3 data-lang="en">${area.title_en}</h3>
                        <p data-lang="es">${area.text_es}</p>
                        <p data-lang="en">${area.text_en}</p>
                    </div>
                </div>
            `;
        });

        swiperWrapper.innerHTML = slidesHTML;

        const carousel = document.querySelector('.impact-carousel');
        const swiper = new Swiper(carousel, {
            loop: true,
            slidesPerView: 'auto',
            spaceBetween: 40,
            speed: 800,
            grabCursor: true,

            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },

            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

        // Apply language to dynamically-generated slides
        applyLang(lang);
    };

    // --- NUEVA FUNCIÓN PARA ANIMACIONES DE SCROLL ---
    const initScrollAnimations = () => {
        // Seleccionamos todos los elementos que queremos animar
        const animatedElements = document.querySelectorAll('.scroll-animation');
        if (!animatedElements.length) return;

        // Creamos un observador de intersección
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Si el elemento está en el viewport, agregamos la clase 'visible'
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    // Si el elemento sale del viewport, quitamos la clase para que pueda volver a animarse
                    entry.target.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.1 // La animación se dispara cuando el 10% del elemento es visible
        });

        // Observamos cada uno de los elementos seleccionados
        animatedElements.forEach(el => observer.observe(el));
    };

    // --- FORMULARIO DE CONTACTO (selector empleo/servicio) ---
    const initContactForm = () => {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const toggleButtons = form.querySelectorAll('.form-toggle .toggle-btn');
        const sectionServicio = form.querySelector('#section-servicio');
        const sectionEmpleo = form.querySelector('#section-empleo');
        const statusBox = form.querySelector('.form-status');

        const setRequiredForSection = (sectionEl, isActive) => {
            if (!sectionEl) return;
            sectionEl.querySelectorAll('input, select, textarea').forEach(el => {
                const isFile = el.type === 'file';
                if (isActive) {
                    if (el.id === 'puesto' || el.id === 'cv') {
                        el.required = true;
                    }
                    if (el.id === 'proyecto' || el.id === 'descripcion' || el.id === 'imagenProducto' || el.id === 'areaAplicacion' || el.id === 'vinculo' || el.id === 'carrera') {
                        el.required = true;
                    }
                } else {
                    if (!isFile) el.required = false;
                    if (isFile) el.required = false;
                }
            });
        };

        const showSection = (type) => {
            const isServicio = type === 'servicio';
            sectionServicio.hidden = !isServicio;
            sectionEmpleo.hidden = isServicio;

            sectionServicio.classList.toggle('active', isServicio);
            sectionEmpleo.classList.toggle('active', !isServicio);

            toggleButtons.forEach(btn => {
                const active = btn.dataset.target === type;
                btn.classList.toggle('active', active);
                btn.setAttribute('aria-pressed', String(active));
            });

            setRequiredForSection(sectionServicio, isServicio);
            setRequiredForSection(sectionEmpleo, !isServicio);
        };

        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => showSection(btn.dataset.target));
        });

        // Validación de tamaño de archivos
        form.addEventListener('change', (e) => {
            const input = e.target;
            if (input && input.type === 'file' && input.files && input.files[0]) {
                const max = parseInt(input.getAttribute('data-max') || '0', 10);
                if (max && input.files[0].size > max) {
                    input.value = '';
                    alert('El archivo excede el tamaño permitido.');
                }
            }
        });

        // Envío real al backend vía fetch
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Validación de teléfono en un solo campo (ya se envía como #telefono)

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const isServicio = sectionServicio.classList.contains('active');
            const tipo = isServicio ? 'servicio' : 'empleo';

            const formData = new FormData(form);
            formData.append('tipo', tipo);

            // (Captcha/honeypot eliminados)

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : '';
            const loadingText = submitBtn ? submitBtn.getAttribute('data-loading-text') || 'Enviando…' : 'Enviando…';
            const successText = submitBtn ? submitBtn.getAttribute('data-success-text') || 'Enviado' : 'Enviado';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = loadingText;
            }

            const lang = localStorage.getItem('jpl_lang') || 'es';
            statusBox.textContent = lang === 'en' ? 'Sending…' : 'Enviando…';
            statusBox.classList.add('show');

            try {
                const resp = await fetch('send_contact.php', {
                    method: 'POST',
                    body: formData,
                });
                const data = await resp.json().catch(() => ({ ok: false, error: 'invalid_json' }));
                if (resp.ok && data.ok) {
                    statusBox.textContent = lang === 'en' ? '✓ Thank you! We have received your request.' : '¡Gracias! Hemos recibido su solicitud.';
                    if (submitBtn) submitBtn.textContent = lang === 'en'
                        ? (submitBtn.getAttribute('data-success-text-en') || 'Sent')
                        : (submitBtn.getAttribute('data-success-text-es') || 'Enviado');
                    form.reset();
                    showSection('servicio');
                    setTimeout(() => {
                        statusBox.classList.remove('show');
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = lang === 'en'
                                ? (submitBtn.getAttribute('data-lang-en') || 'Send')
                                : (submitBtn.getAttribute('data-lang-es') || 'Enviar');
                        }
                    }, 4000);
                } else {
                    statusBox.textContent = lang === 'en' ? 'There was a problem sending. Please try again.' : 'Hubo un problema al enviar. Intente nuevamente.';
                    setTimeout(() => {
                        statusBox.classList.remove('show');
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = lang === 'en'
                                ? (submitBtn.getAttribute('data-lang-en') || 'Send')
                                : (submitBtn.getAttribute('data-lang-es') || 'Enviar');
                        }
                    }, 5000);
                }
            } catch (err) {
                statusBox.textContent = lang === 'en' ? 'Network error. Please check your connection.' : 'Error de red. Verifique su conexión.';
                setTimeout(() => {
                    statusBox.classList.remove('show');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = lang === 'en'
                            ? (submitBtn.getAttribute('data-lang-en') || 'Send')
                            : (submitBtn.getAttribute('data-lang-es') || 'Enviar');
                    }
                }, 5000);
            }
        });

        // Estado inicial
        showSection('servicio');
    };


    // Inicialización de todas las funciones
    initMobileNav();
    initSmoothScroll();
    initScrollSpy();
    initFaqAccordion();
    initTabs();
    initImpactCarousel();
    initScrollAnimations(); // Llamamos a la nueva función de animación
    initContactForm();
});

// ========================
// LANGUAGE SWITCHER
// ========================

/**
 * Applies the given language ("es" or "en") to all [data-lang] elements.
 * Stores the choice in localStorage so it persists across pages.
 */
function applyLang(lang) {
    document.querySelectorAll('[data-lang]').forEach(el => {
        if (el.getAttribute('data-lang') === lang) {
            el.classList.add('lang-visible');
        } else {
            el.classList.remove('lang-visible');
        }
    });

    // Update placeholder attributes for textareas / inputs that store both languages
    document.querySelectorAll('[data-placeholder-es], [data-placeholder-en]').forEach(el => {
        const ph = el.getAttribute('data-placeholder-' + lang);
        if (ph) el.setAttribute('placeholder', ph);
    });

    // Update submit button text based on data-lang-es / data-lang-en attributes
    document.querySelectorAll('button[data-lang-es], button[data-lang-en]').forEach(btn => {
        const txt = btn.getAttribute('data-lang-' + lang);
        if (txt) btn.textContent = txt;
    });

    // Sync switcher button states on all pages
    const btnES = document.getElementById('btnES');
    const btnEN = document.getElementById('btnEN');
    if (btnES && btnEN) {
        btnES.classList.toggle('active', lang === 'es');
        btnEN.classList.toggle('active', lang === 'en');
    }

    // Update the html lang attribute
    document.documentElement.setAttribute('lang', lang);
}

function setLang(lang) {
    localStorage.setItem('jpl_lang', lang);
    applyLang(lang);
}

// Apply stored language immediately on page load (before DOMContentLoaded)
(function () {
    const saved = localStorage.getItem('jpl_lang') || 'es';
    // Wait for DOM to be ready before applying
    document.addEventListener('DOMContentLoaded', function () {
        applyLang(saved);
    });
}());
