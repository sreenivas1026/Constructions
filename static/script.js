/**
 * SLTG Builders - Clean, Minimal JavaScript
 * Handles essential interactions
 */

(function() {
    'use strict';

    // DOM Elements
    const loadingScreen = document.getElementById('loadingScreen');
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const yearSpan = document.getElementById('year');
    const footerYearSpan = document.getElementById('footerYear');
    
    // Hero Slider Elements
    const heroSlider = document.getElementById('heroSlider');
    const heroDots = document.getElementById('heroDots');
    
    // Modal Elements
    const visitModal = document.getElementById('visitModal');
    const getQuoteModal = document.getElementById('getQuoteModal');
    const headerBookVisit = document.getElementById('headerBookVisit');
    const headerGetQuote = document.getElementById('headerGetQuote');
    const mobileBookVisit = document.getElementById('mobileBookVisit');
    const mobileGetQuote = document.getElementById('mobileGetQuote');
    
    // Visit Modal Elements
    const visitModalClose = document.getElementById('visitModalClose');
    const visitModalBackdrop = document.getElementById('visitModalBackdrop');
    const visitModalCancel = document.getElementById('visitModalCancel');
    const dateTrack = document.getElementById('dateTrack');
    const timeTrack = document.getElementById('timeTrack');
    const dateScrollLeft = document.getElementById('dateScrollLeft');
    const dateScrollRight = document.getElementById('dateScrollRight');
    const timeScrollLeft = document.getElementById('timeScrollLeft');
    const timeScrollRight = document.getElementById('timeScrollRight');
    const selectedSlot = document.getElementById('selectedSlot');
    const slotDisplay = document.getElementById('slotDisplay');
    const visitDate = document.getElementById('visitDate');
    
    // Quote Modal Elements
    const getQuoteModalClose = document.getElementById('getQuoteModalClose');
    const getQuoteModalBackdrop = document.getElementById('getQuoteModalBackdrop');
    const getQuoteModalCancel = document.getElementById('getQuoteModalCancel');
    
    // Form Elements
    const visitForm = document.getElementById('visitForm');
    const getQuoteForm = document.getElementById('getQuoteForm');
    const contactForm = document.getElementById('contactForm');
    const subscribeForm = document.getElementById('subscribeForm');

    // API base: use same-origin for all requests in production and deployment.
    const apiBaseUrl = '';

    // Hero Slider State
    let currentSlide = 0;
    let slideInterval;
    const slides = heroSlider ? heroSlider.querySelectorAll('.hero-slide') : [];

    // Initialize
    function init() {
        hideLoadingScreen();
        setupHeaderScroll();
        setupMobileNavigation();
        setupSmoothScroll();
        setupActiveNavigation();
        setupHeroSlider();
        setupModals();
        setupDateSelector();
        setupTimeSelector();
        setupForms();
        updateFooterYear();
    }

    // Hide Loading Screen
    function hideLoadingScreen() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }

    // Header Scroll Effect
    function setupHeaderScroll() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Navigation
    function setupMobileNavigation() {
        if (!mobileToggle || !mobileNav) return;

        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileNav.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        });

        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', () => {
                closeMobileNav();
            });
        }

        mobileNavOverlay.addEventListener('click', () => {
            closeMobileNav();
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileNav();
            });
        });
    }

    function closeMobileNav() {
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Smooth Scroll
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = 70;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Active Navigation on Scroll
    function setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');

        function updateActiveSection() {
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = '#' + section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === sectionId) {
                            link.classList.add('active');
                        }
                    });
                    mobileNavLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveSection);
        updateActiveSection();
    }

    // Hero Slider
    function setupHeroSlider() {
        if (!heroSlider || slides.length === 0) return;
        
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('hero-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            heroDots.appendChild(dot);
        });
        
        // Start auto-slide
        startSlideShow();
        
        // Pause on hover
        heroSlider.addEventListener('mouseenter', stopSlideShow);
        heroSlider.addEventListener('mouseleave', startSlideShow);
    }
    
    function goToSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (heroDots.children[i]) {
                heroDots.children[i].classList.remove('active');
            }
        });
        
        slides[index].classList.add('active');
        if (heroDots.children[index]) {
            heroDots.children[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }
    
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // Modals
    function setupModals() {
        // Visit Modal
        if (headerBookVisit) {
            headerBookVisit.addEventListener('click', () => openModal(visitModal));
        }
        if (mobileBookVisit) {
            mobileBookVisit.addEventListener('click', () => openModal(visitModal));
        }
        
        // Quote Modal
        if (headerGetQuote) {
            headerGetQuote.addEventListener('click', () => openModal(getQuoteModal));
        }
        if (mobileGetQuote) {
            mobileGetQuote.addEventListener('click', () => openModal(getQuoteModal));
        }
        
        // Data attributes
        document.querySelectorAll('[data-open-visit]').forEach(btn => {
            btn.addEventListener('click', () => openModal(visitModal));
        });
        
        // Close buttons
        if (visitModalClose) {
            visitModalClose.addEventListener('click', () => closeModal(visitModal));
        }
        if (visitModalBackdrop) {
            visitModalBackdrop.addEventListener('click', () => closeModal(visitModal));
        }
        if (visitModalCancel) {
            visitModalCancel.addEventListener('click', () => closeModal(visitModal));
        }
        
        if (getQuoteModalClose) {
            getQuoteModalClose.addEventListener('click', () => closeModal(getQuoteModal));
        }
        if (getQuoteModalBackdrop) {
            getQuoteModalBackdrop.addEventListener('click', () => closeModal(getQuoteModal));
        }
        if (getQuoteModalCancel) {
            getQuoteModalCancel.addEventListener('click', () => closeModal(getQuoteModal));
        }
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal(visitModal);
                closeModal(getQuoteModal);
            }
        });
    }
    
    function openModal(modal) {
        closeMobileNav();
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Date Selector
    function setupDateSelector() {
        if (!dateTrack) return;
        
        const today = new Date();
        const dates = [];
        
        for (let i = 1; i <= 15; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        
        dates.forEach(date => {
            const dateBtn = document.createElement('button');
            dateBtn.type = 'button';
            dateBtn.className = 'date-btn';
            dateBtn.innerHTML = `
                <span class="date-day">${date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span class="date-date">${date.getDate()}</span>
                <span class="date-month">${date.toLocaleDateString('en-US', { month: 'short' })}</span>
            `;
            dateBtn.addEventListener('click', () => selectDate(date, dateBtn));
            dateTrack.appendChild(dateBtn);
        });
        
        if (dateScrollLeft) {
            dateScrollLeft.addEventListener('click', () => {
                dateTrack.scrollBy({ left: -100, behavior: 'smooth' });
            });
        }
        
        if (dateScrollRight) {
            dateScrollRight.addEventListener('click', () => {
                dateTrack.scrollBy({ left: 100, behavior: 'smooth' });
            });
        }
    }
    
    let selectedDate = null;
    let selectedTime = null;
    
    function selectDate(date, btn) {
        selectedDate = date;
        
        // Remove active from all
        dateTrack.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        updateSlotDisplay();
    }

    // Time Selector
    function setupTimeSelector() {
        if (!timeTrack) return;
        
        const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
        
        times.forEach(time => {
            const timeBtn = document.createElement('button');
            timeBtn.type = 'button';
            timeBtn.className = 'time-btn';
            timeBtn.textContent = time;
            timeBtn.addEventListener('click', () => selectTime(time, timeBtn));
            timeTrack.appendChild(timeBtn);
        });
        
        if (timeScrollLeft) {
            timeScrollLeft.addEventListener('click', () => {
                timeTrack.scrollBy({ left: -100, behavior: 'smooth' });
            });
        }
        
        if (timeScrollRight) {
            timeScrollRight.addEventListener('click', () => {
                timeTrack.scrollBy({ left: 100, behavior: 'smooth' });
            });
        }
    }
    
    function selectTime(time, btn) {
        selectedTime = time;
        
        // Remove active from all
        timeTrack.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        updateSlotDisplay();
    }
    
    function updateSlotDisplay() {
        if (selectedDate && selectedTime) {
            const dateStr = selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            slotDisplay.textContent = `${dateStr} at ${selectedTime}`;
            selectedSlot.style.display = 'block';
            visitDate.value = `${dateStr} at ${selectedTime}`;
        }
    }

    function buildFormPayload(form) {
        const payload = {};
        const data = new FormData(form);
        data.forEach((value, key) => {
            payload[key] = value;
        });
        return payload;
    }

    function clearFormStatus(form) {
        const existingStatus = form.parentElement.querySelector('.form-status');
        if (existingStatus) {
            existingStatus.remove();
        }
    }

    function showFormStatus(form, type, message) {
        clearFormStatus(form);
        const status = document.createElement('div');
        status.className = `form-status ${type}`;
        status.setAttribute('role', 'status');
        status.textContent = message;
        form.insertAdjacentElement('afterend', status);
    }

    function resetVisitSelection() {
        selectedDate = null;
        selectedTime = null;
        if (selectedSlot) {
            selectedSlot.style.display = 'none';
        }
        if (dateTrack) {
            dateTrack.querySelectorAll('.date-btn.active').forEach(btn => btn.classList.remove('active'));
        }
        if (timeTrack) {
            timeTrack.querySelectorAll('.time-btn.active').forEach(btn => btn.classList.remove('active'));
        }
    }

    async function submitFormRequest(form, endpoint, successMessage) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalContent = submitButton ? submitButton.innerHTML : '';

        clearFormStatus(form);
        showFormStatus(form, 'loading', 'Sending your request...');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }

        try {
            const payload = buildFormPayload(form);
            if (form.id === 'visitForm') {
                payload.selectedTime = selectedTime || '';
                payload.visitDate = visitDate ? visitDate.value : payload.visitDate || '';
            }
            const response = await fetch(`${apiBaseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Unable to send your request right now. Please try again.');
            }

            showFormStatus(form, 'success', successMessage || result.message || 'Thanks! Your request was sent successfully.');
            form.reset();
            if (form.id === 'visitForm') {
                resetVisitSelection();
                closeModal(visitModal);
            } else if (form.id === 'getQuoteForm') {
                closeModal(getQuoteModal);
            }
        } catch (error) {
            showFormStatus(form, 'error', error.message || 'Unable to send your request right now. Please try again.');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalContent;
            }
        }
    }

    function updateBudgetOptions() {
        const serviceSelect = document.getElementById('quoteService');
        const budgetSelect = document.getElementById('quoteBudget');
        const requirementsField = document.getElementById('quoteRequirements');

        if (!serviceSelect || !budgetSelect) return;

        const service = serviceSelect.value;
        budgetSelect.innerHTML = '<option value="">Select budget range</option>';

        if (service === 'contracting') {
            budgetSelect.innerHTML += `
                <option value="15-25 lakhs">Basic Construction</option>
                <option value="25-40 lakhs">Standard Finishing</option>
                <option value="40-60 lakhs">Premium Finishing</option>
                <option value="60+ lakhs">Luxury Finishing</option>
            `;
            if (requirementsField) {
                requirementsField.placeholder = 'Number of floors, rooms, facing, special requirements, construction type...';
            }
        } else if (service === 'owned-construction') {
            budgetSelect.innerHTML += `
                <option value="unfurnished">Unfurnished (Basic Structure)</option>
                <option value="semi-furnished">Semi-Furnished (Kitchen + Wardrobes)</option>
                <option value="fully-furnished">Fully Furnished (Complete Setup)</option>
                <option value="luxury-furnished">Luxury Furnished (Premium Everything)</option>
            `;
            if (requirementsField) {
                requirementsField.placeholder = 'Number of floors, rooms, facing, furnishing preference, special requirements...';
            }
        } else if (service === 'real-estate') {
            budgetSelect.innerHTML += `
                <option value="consultation">Consultation Only</option>
                <option value="buying">Buying Property</option>
                <option value="selling">Selling Property</option>
                <option value="investment">Investment Property</option>
            `;
            if (requirementsField) {
                requirementsField.placeholder = 'Property type preference, location preference, requirements...';
            }
        }
    }

    window.updateBudgetOptions = updateBudgetOptions;

    // Forms
    function setupForms() {
        if (visitForm) {
            visitForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const payload = buildFormPayload(visitForm);
                payload.selectedTime = selectedTime || '';
                if (visitDate) {
                    payload.visitDate = visitDate.value;
                }
                if (!payload.visitDate) {
                    showFormStatus(visitForm, 'error', 'Please select a preferred date and time before sending your request.');
                    return;
                }
                submitFormRequest(visitForm, '/api/submit-site-visit', 'Your site visit request has been sent. We will contact you shortly.');
            });
        }
        
        if (getQuoteForm) {
            getQuoteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                submitFormRequest(getQuoteForm, '/api/submit-get-quote', 'Your quote request has been sent. We will get back to you within 24 hours.');
            });
        }
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                submitFormRequest(contactForm, '/api/submit-contact', 'Your message has been sent. We will contact you shortly.');
            });
        }
        
        if (subscribeForm) {
            subscribeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('subscribeEmail').value;
                submitFormRequest(subscribeForm, '/api/submit-subscribe', 'Thanks for subscribing! Check your email for details.');
            });
        }
    }

    // Update Footer Year
    function updateFooterYear() {
        const currentYear = new Date().getFullYear();
        if (yearSpan) {
            yearSpan.textContent = currentYear;
        }
        if (footerYearSpan) {
            footerYearSpan.textContent = currentYear;
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
