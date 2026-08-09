
		// SLTG Builders - JavaScript Functionality

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
		// Mobile bottom navigation - direct navigation only
		const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
		const mobileBookVisit = document.getElementById('mobileBookVisit');
		const mobileGetQuote = document.getElementById('mobileGetQuote');
		
		// Header buttons
		const headerBookVisit = document.getElementById('headerBookVisit');
		const headerGetQuote = document.getElementById('headerGetQuote');
		const mobileMenuGetQuote = document.getElementById('mobileMenuGetQuote');
		
		// Navigation item clicks
		mobileNavItems.forEach(item => {
			item.addEventListener('click', () => {
				const href = item.getAttribute('data-href');
				if (href) {
					window.location.href = href;
				}
			});
		});
		
		// Book visit button
		if (mobileBookVisit) {
			mobileBookVisit.addEventListener('click', () => {
				openVisitModal();
			});
		}
		
		// Get Quote button
		if (mobileGetQuote) {
			mobileGetQuote.addEventListener('click', () => {
				openGetQuoteModal();
			});
		}
		
		// Header Book Visit button
		if (headerBookVisit) {
			headerBookVisit.addEventListener('click', (e) => {
				e.preventDefault();
				openVisitModal();
			});
		}
		
		// Header Get Quote button
		if (headerGetQuote) {
			headerGetQuote.addEventListener('click', () => {
				openGetQuoteModal();
			});
		}
		
		// Mobile Menu Get Quote button
		if (mobileMenuGetQuote) {
			mobileMenuGetQuote.addEventListener('click', () => {
				openGetQuoteModal();
			});
		}
		
		// Mobile menu toggle
		const mobileMenuToggle = document.getElementById('mobileMenuToggle');
		const navCenter = document.getElementById('navCenter');
		const navOverlay = document.getElementById('navOverlay');
		const navItems = document.querySelectorAll('.nav-item');
		const navBookVisit = document.getElementById('navBookVisit');
		const mobileBottomNav = document.getElementById('mobileBottomNav');
		
		// Function to detect current page and set active state
		function setActiveNavigation() {
			const currentHash = window.location.hash || '#home';
			navItems.forEach(item => {
				const href = item.getAttribute('data-href');
				if (href === currentHash) {
					item.classList.add('active');
				} else {
					item.classList.remove('active');
				}
			});
		}
		
		// Function to detect current section based on scroll position
		function setActiveNavigationOnScroll() {
			const sections = document.querySelectorAll('section[id]');
			const scrollPosition = window.scrollY + 100;
			
			let currentSection = '#home';
			sections.forEach(section => {
				const sectionTop = section.offsetTop;
				const sectionHeight = section.offsetHeight;
				const sectionId = '#' + section.getAttribute('id');
				
				if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
					currentSection = sectionId;
				}
			});
			
			navItems.forEach(item => {
				const href = item.getAttribute('data-href');
				if (href === currentSection) {
					item.classList.add('active');
				} else {
					item.classList.remove('active');
				}
			});
		}
		
		// Set active state on page load
		setActiveNavigation();
		setActiveNavigationOnScroll();
		
		// Update active state when hash changes
		window.addEventListener('hashchange', setActiveNavigation);
		
		// Update active state on scroll
		window.addEventListener('scroll', setActiveNavigationOnScroll);
		
		if (mobileMenuToggle && navCenter && navOverlay && mobileBottomNav) {
			mobileMenuToggle.addEventListener('click', () => {
				const isOpen = navCenter.classList.toggle('mobile-open');
				navOverlay.classList.toggle('open', isOpen);
				mobileBottomNav.classList.toggle('menu-open', isOpen);
				mobileMenuToggle.textContent = isOpen ? '✕' : '☰';
			});
			
			// Close menu when clicking overlay
			navOverlay.addEventListener('click', () => {
				navCenter.classList.remove('mobile-open');
				navOverlay.classList.remove('open');
				mobileBottomNav.classList.remove('menu-open');
				mobileMenuToggle.textContent = '☰';
			});
			
			// Navigation item clicks
			navItems.forEach(item => {
				item.addEventListener('click', () => {
					const href = item.getAttribute('data-href');
					if (href) {
						window.location.href = href;
						navCenter.classList.remove('mobile-open');
						navOverlay.classList.remove('open');
						mobileBottomNav.classList.remove('menu-open');
						mobileMenuToggle.textContent = '☰';
					}
				});
			});
			
			// Book visit button in top menu
			if (navBookVisit) {
				navBookVisit.addEventListener('click', () => {
					openVisitModal();
					navCenter.classList.remove('mobile-open');
					navOverlay.classList.remove('open');
					mobileBottomNav.classList.remove('menu-open');
					mobileMenuToggle.textContent = '☰';
				});
			}
		}
		// Hero slider logic
		const slides = document.querySelectorAll('.slide');
		const dots = document.querySelectorAll('.slider-dot');
		let currentSlide = 0;
		function showSlide(idx) {
			slides.forEach((slide, i) => {
				slide.classList.toggle('active', i === idx);
				if (dots[i]) dots[i].classList.toggle('active', i === idx);
			});
		}
		function nextSlide() {
			if (!slides.length) return;
			currentSlide = (currentSlide + 1) % slides.length;
			showSlide(currentSlide);
		}
		let sliderInterval = null;
		if (slides.length > 1) {
			sliderInterval = setInterval(nextSlide, 4000);
			dots.forEach((dot, i) => {
				dot.addEventListener('click', () => {
					if (sliderInterval) clearInterval(sliderInterval);
					currentSlide = i;
					showSlide(currentSlide);
					sliderInterval = setInterval(nextSlide, 4000);
				});
			});
		}
		const footerYear = document.getElementById('footerYear');
		if (footerYear) footerYear.textContent = String(new Date().getFullYear());
		const visitModal = document.getElementById('visitModal');
		const visitModalClose = document.getElementById('visitModalClose');
		const visitModalCancel = document.getElementById('visitModalCancel');
		const dateTrack = document.getElementById('dateTrack');
		const dateScroll = document.getElementById('dateScroll');
		const dateScrollLeft = document.getElementById('dateScrollLeft');
		const dateScrollRight = document.getElementById('dateScrollRight');
		const visitDateInput = document.getElementById('visitDate');
		const visitForm = document.getElementById('visitForm');
		
		// Get Quote Modal elements
		const getQuoteModal = document.getElementById('getQuoteModal');
		const getQuoteModalClose = document.getElementById('getQuoteModalClose');
		const getQuoteModalCancel = document.getElementById('getQuoteModalCancel');
		const getQuoteForm = document.getElementById('getQuoteForm');
		
		// Contact Form element
		const contactForm = document.getElementById('contactForm');
		
		function openVisitModal() {
			if (!visitModal) return;
			visitModal.classList.add('open');
			document.body.style.overflow = 'hidden';
			const nameInput = document.getElementById('visitName');
			if (nameInput) nameInput.focus();
		}
		
		function openGetQuoteModal() {
			if (!getQuoteModal) return;
			getQuoteModal.classList.add('open');
			document.body.style.overflow = 'hidden';
			const nameInput = document.getElementById('quoteName');
			if (nameInput) nameInput.focus();
		}
		
		function closeVisitModal() {
			if (!visitModal) return;
			visitModal.classList.remove('open');
			document.body.style.overflow = '';
		}
		
		function closeGetQuoteModal() {
			if (!getQuoteModal) return;
			getQuoteModal.classList.remove('open');
			document.body.style.overflow = '';
		}
		
		// Success Message Function
function showSuccessMessage(formType, formContainer) {
    // Remove existing success message
    const existingMessage = formContainer.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-top: 15px;
        text-align: center;
        font-weight: 500;
        animation: slideInUp 0.5s ease;
        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
    `;
    
    let message = '';
    if (formType === 'quote') {
        message = '✅ Quote request submitted successfully! Check your email for confirmation.';
    } else if (formType === 'visit') {
        message = '✅ Site visit request submitted! We will contact you within 24 hours to confirm.';
    } else if (formType === 'contact') {
        message = '✅ Message sent successfully! We will get back to you shortly.';
    }
    
    successDiv.innerHTML = `
        <div style="font-size: 16px; margin-bottom: 5px;">${message}</div>
        <div style="font-size: 12px; opacity: 0.9;">Reference: #${Date.now().toString().slice(-6)}</div>
    `;
    formContainer.appendChild(successDiv);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.animation = 'slideOutDown 0.5s ease';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 500);
        }
    }, 8000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
`;
document.head.appendChild(style);
		function updateBudgetOptions() {
			const serviceSelect = document.getElementById('quoteService');
			const budgetSelect = document.getElementById('quoteBudget');
			const requirementsField = document.getElementById('quoteRequirements');
			
			if (!serviceSelect || !budgetSelect) return;
			
			const service = serviceSelect.value;
			budgetSelect.innerHTML = '<option value="">Select budget range</option>';
			
			// Remove any existing guidance fee note
			const existingNote = budgetSelect.parentNode.querySelector('.guidance-fee-note');
			if (existingNote) {
				existingNote.remove();
			}
			
			if (service === 'contracting') {
				// Contracting - based on construction cost per sq ft
				budgetSelect.innerHTML += `
					<option value="15-25 lakhs">Basic Construction</option>
					<option value="25-40 lakhs">Standard Finishing</option>
					<option value="40-60 lakhs">Premium Finishing</option>
					<option value="60+ lakhs">Luxury Finishing</option>
				`;
				requirementsField.placeholder = 'Number of floors, rooms, facing, special requirements, construction type...';
			} else if (service === 'owned-construction') {
				// Owned Constructions - based on furnished/unfurnished
				budgetSelect.innerHTML += `
					<option value="unfurnished">Unfurnished (Basic Structure)</option>
					<option value="semi-furnished">Semi-Furnished (Kitchen + Wardrobes)</option>
					<option value="fully-furnished">Fully Furnished (Complete Setup)</option>
					<option value="luxury-furnished">Luxury Furnished (Premium Everything)</option>
				`;
				requirementsField.placeholder = 'Number of floors, rooms, facing, furnishing preference, special requirements...';
			} else if (service === 'real-estate') {
				// Real Estate - consultation only
				budgetSelect.innerHTML += `
					<option value="consultation">Consultation Only</option>
					<option value="buying">Buying Property</option>
					<option value="selling">Selling Property</option>
					<option value="investment">Investment Property</option>
				`;
				requirementsField.placeholder = 'Property type preference, location preference, requirements...';
				
				// Add guidance fee note (only once)
				const guidanceNote = document.createElement('div');
				guidanceNote.className = 'guidance-fee-note';
				guidanceNote.style.cssText = 'font-size: 0.75rem; color: rgba(255,255,255,0.7); margin-top: 8px;';
				guidanceNote.textContent = '* Guidance fee applicable for consultation services';
				budgetSelect.parentNode.appendChild(guidanceNote);
			}
		}
		function formatDow(d) {
			return d.toLocaleDateString(undefined, { weekday: 'short' });
		}
		function formatMd(d) {
			return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
		}
		function formatValue(d) {
			const yyyy = d.getFullYear();
			const mm = String(d.getMonth() + 1).padStart(2, '0');
			const dd = String(d.getDate()).padStart(2, '0');
			return `${yyyy}-${mm}-${dd}`;
		}
		function setActiveDate(value) {
			if (!dateTrack || !visitDateInput) return;
			visitDateInput.value = value;
			Array.from(dateTrack.querySelectorAll('.date-chip')).forEach((el) => {
				el.classList.toggle('active', el.getAttribute('data-value') === value);
			});
			updatePreferredSlot();
		}
		
		// Time slot functions
		const timeTrack = document.getElementById('timeTrack');
		const timeScroll = document.getElementById('timeScroll');
		const timeScrollLeft = document.getElementById('timeScrollLeft');
		const timeScrollRight = document.getElementById('timeScrollRight');
		const preferredSlot = document.getElementById('preferredSlot');
		const slotDisplay = document.getElementById('slotDisplay');
		let selectedTime = '';
		
		function buildTimeSlots() {
			if (!timeTrack) return;
			timeTrack.innerHTML = '';
			const timeSlots = [
				{ display: '11 AM', value: '11:00 AM - 12:00 PM' },
				{ display: '12 PM', value: '12:00 PM - 1:00 PM' },
				{ display: '1 PM', value: '1:00 PM - 2:00 PM' },
				{ display: '2 PM', value: '2:00 PM - 3:00 PM' },
				{ display: '3 PM', value: '3:00 PM - 4:00 PM' },
				{ display: '4 PM', value: '4:00 PM - 5:00 PM' }
			];
			
			timeSlots.forEach((slot, index) => {
				const chip = document.createElement('div');
				chip.className = 'time-chip';
				chip.setAttribute('data-value', slot.value);
				chip.setAttribute('data-display', slot.display);
				chip.innerHTML = slot.display;
				chip.addEventListener('click', () => setActiveTime(slot.value, slot.display));
				timeTrack.appendChild(chip);
			});
		}
		
		function setActiveTime(value, display) {
			if (!timeTrack) return;
			selectedTime = value;
			Array.from(timeTrack.querySelectorAll('.time-chip')).forEach((el) => {
				el.classList.toggle('active', el.getAttribute('data-value') === value);
			});
			updatePreferredSlot();
		}
		
		function updatePreferredSlot() {
			if (!preferredSlot || !slotDisplay || !visitDateInput || !selectedTime) {
				if (preferredSlot) preferredSlot.style.display = 'none';
				return;
			}
			
			const selectedDate = visitDateInput.value;
			if (selectedDate) {
				const date = new Date(selectedDate);
				const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });
				const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
				slotDisplay.textContent = `${dayName}, ${dateStr} - ${selectedTime}`;
				preferredSlot.style.display = 'block';
			}
		}
		
		buildTimeSlots();
		buildNextDates();
		
		// Time scroll functionality
		if (timeScrollLeft && timeScroll) {
			timeScrollLeft.addEventListener('click', () => timeScroll.scrollBy({ left: -320, behavior: 'smooth' }));
		}
		if (timeScrollRight && timeScroll) {
			timeScrollRight.addEventListener('click', () => timeScroll.scrollBy({ left: 320, behavior: 'smooth' }));
		}
		
		function buildNextDates() {
			if (!dateTrack) return;
			dateTrack.innerHTML = '';
			const today = new Date();
			for (let i = 0; i < 15; i++) {
				const d = new Date(today);
				d.setDate(today.getDate() + i);
				const value = formatValue(d);
				const chip = document.createElement('div');
				chip.className = 'date-chip';
				chip.setAttribute('data-value', value);
				chip.innerHTML = `<div class="dow">${formatDow(d)}</div><div class="md">${formatMd(d)}</div>`;
				chip.addEventListener('click', () => setActiveDate(value));
				dateTrack.appendChild(chip);
			}
			setActiveDate(formatValue(today));
		}
		buildNextDates();
		document.querySelectorAll('[data-open-visit]').forEach((btn) => {
			btn.addEventListener('click', openVisitModal);
		});
		if (visitModalClose) visitModalClose.addEventListener('click', closeVisitModal);
		if (visitModalCancel) visitModalCancel.addEventListener('click', closeVisitModal);
		
		// Get Quote Modal event listeners
		if (getQuoteModalClose) getQuoteModalClose.addEventListener('click', closeGetQuoteModal);
		if (getQuoteModalCancel) getQuoteModalCancel.addEventListener('click', closeGetQuoteModal);
		
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && visitModal.classList.contains('open')) closeVisitModal();
			if (e.key === 'Escape' && getQuoteModal.classList.contains('open')) closeGetQuoteModal();
		});
		// Smooth Navigation and Form Handling
		const navLinks = document.querySelectorAll('a[href^="#"]');
		
		// Smooth scrolling for navigation links
		navLinks.forEach(link => {
			link.addEventListener('click', function(e) {
				e.preventDefault();
				const targetId = this.getAttribute('href').substring(1);
				const targetSection = document.getElementById(targetId);
				
				if (targetSection) {
					const headerHeight = 64; // Header height
					const targetPosition = targetSection.offsetTop - headerHeight;
					
					window.scrollTo({
						top: targetPosition,
						behavior: 'smooth'
					});
					
					// Close mobile menu if open
					const navCenter = document.getElementById('navCenter');
					const navOverlay = document.getElementById('navOverlay');
					const mobileBottomNav = document.getElementById('mobileBottomNav');
					
					if (navCenter && navCenter.classList.contains('mobile-open')) {
						navCenter.classList.remove('mobile-open');
						navOverlay.classList.remove('open');
						mobileBottomNav.classList.remove('menu-open');
					}
				}
			});
		});
		
		// Get Quote Form Submission
		if (getQuoteForm) {
			getQuoteForm.addEventListener('submit', async function(e) {
				e.preventDefault();
				
				// Get form data
				const formData = new FormData(getQuoteForm);
				const quoteData = {
					name: formData.get('name'),
					phone: formData.get('phone'),
					email: formData.get('email'),
					service: formData.get('service'),
					plotSize: formData.get('plotSize'),
					budget: formData.get('budget'),
					timeline: formData.get('timeline'),
					requirements: formData.get('requirements'),
					timestamp: new Date().toISOString()
				};
				
				// Validate required fields
				if (!quoteData.name || !quoteData.phone || !quoteData.service || !quoteData.plotSize || !quoteData.requirements) {
					alert('Please fill in all required fields marked with *');
					return;
				}
				
				// Phone number validation
				const phoneRegex = /^[6-9]\d{9}$/;
				if (!phoneRegex.test(quoteData.phone.replace(/\D/g, ''))) {
					alert('Please enter a valid 10-digit mobile number');
					return;
				}
				
				// Email validation (if provided)
				if (quoteData.email) {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (!emailRegex.test(quoteData.email)) {
						alert('Please enter a valid email address');
						return;
					}
				}
				
				// Show loading state
				const submitBtn = getQuoteForm.querySelector('button[type="submit"]');
				const originalText = submitBtn.textContent;
				submitBtn.textContent = 'Sending...';
				submitBtn.disabled = true;
				
				try {
					// Send data to backend API
					const response = await fetch('/api/submit-get-quote/', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(quoteData)
					});
					
					const result = await response.json();
					
					if (result.success) {
						// Show success message
						showSuccessMessage('quote', getQuoteForm.parentElement);
						getQuoteForm.reset();
						closeGetQuoteModal();
						
						// Reset budget options
						const budgetSelect = document.getElementById('quoteBudget');
						if (budgetSelect) {
							budgetSelect.innerHTML = '<option value="">Select budget range</option>';
						}
					} else {
						// Error
						alert('Error: ' + result.message);
					}
				} catch (error) {
					console.error('Submission error:', error);
					alert('Network error. Please try again or contact us directly.');
				} finally {
					// Restore button state
					submitBtn.textContent = originalText;
					submitBtn.disabled = false;
				}
			});
		}
		
		// Active section highlighting based on scroll
		function updateActiveSection() {
			const sections = document.querySelectorAll('section[id]');
			const scrollPosition = window.scrollY + 100;
			
			sections.forEach(section => {
				const sectionTop = section.offsetTop;
				const sectionHeight = section.offsetHeight;
				const sectionId = section.getAttribute('id');
				
				if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
					// Update active state in navigation
					navLinks.forEach(link => {
						link.classList.remove('active');
						if (link.getAttribute('href') === '#' + sectionId) {
							link.classList.add('active');
						}
					});
					
					// Update mobile menu active state
					const mobileNavItems = document.querySelectorAll('.nav-item[data-href]');
					mobileNavItems.forEach(item => {
						item.classList.remove('active');
						if (item.getAttribute('data-href') === '#' + sectionId) {
							item.classList.add('active');
						}
					});
				}
			});
		}
		
		// Scroll event listener for active section
		window.addEventListener('scroll', updateActiveSection);
		
		// Initialize active section on page load
		updateActiveSection();
		
		// Service select change handler for budget options
		const serviceSelect = document.getElementById('quoteService');
		if (serviceSelect) {
			serviceSelect.addEventListener('change', updateBudgetOptions);
		}
		
		// Contact Form Submission
		if (contactForm) {
			contactForm.addEventListener('submit', async function(e) {
				e.preventDefault();
				
				// Get form data
				const formData = new FormData(contactForm);
				const contactData = {
					name: formData.get('name'),
					phone: formData.get('phone'),
					email: formData.get('email'),
					subject: formData.get('service') || 'General Inquiry',
					message: formData.get('message'),
					timestamp: new Date().toISOString()
				};
				
				// Debug logging
				console.log('=== CONTACT FORM DEBUG ===');
				console.log('Form data:', contactData);
				console.log('Email field:', contactData.email);
				console.log('Email field type:', typeof contactData.email);
				console.log('Email field truthy:', !!contactData.email);
				console.log('========================');
				
				// Validate required fields
				if (!contactData.name || !contactData.phone || !contactData.message) {
					alert('Please fill in all required fields marked with *');
					return;
				}
				
				// Phone number validation
				const phoneRegex = /^[6-9]\d{9}$/;
				if (!phoneRegex.test(contactData.phone.replace(/\D/g, ''))) {
					alert('Please enter a valid 10-digit mobile number');
					return;
				}
				
				// Email validation (if provided)
				if (contactData.email) {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (!emailRegex.test(contactData.email)) {
						alert('Please enter a valid email address');
						return;
					}
				}
				
				// Show loading state
				const submitBtn = contactForm.querySelector('button[type="submit"]');
				const originalText = submitBtn.textContent;
				submitBtn.textContent = 'Sending...';
				submitBtn.disabled = true;
				
				try {
					// Send data to backend API
					const response = await fetch('/api/submit-contact/', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(contactData)
					});
					
					const result = await response.json();
					
					if (result.success) {
						// Show success message
						showSuccessMessage('contact', contactForm.parentElement);
						contactForm.reset();
					} else {
						// Error
						alert('Error: ' + result.message);
					}
				} catch (error) {
					console.error('Submission error:', error);
					alert('Network error. Please try again or contact us directly.');
				} finally {
					// Restore button state
					submitBtn.textContent = originalText;
					submitBtn.disabled = false;
				}
			});
		}
		
		if (visitForm) {
			visitForm.addEventListener('submit', async function(e) {
				e.preventDefault();
				
				const formData = new FormData(visitForm);
				const visitData = {
					name: formData.get('name'),
					phone: formData.get('phone'),
					email: formData.get('email'),
					visitLocation: formData.get('visitLocation'),
					visitDate: formData.get('visitDate'),
					selectedTime: selectedTime || 'Not specified'
				};
				
				// Validate required fields
				if (!visitData.name || !visitData.phone || !visitData.email || !visitData.visitLocation || !visitData.visitDate) {
					alert('Please fill in all required fields and select a date and time');
					return;
				}
				
				// Phone number validation
				const phoneRegex = /^[6-9]\d{9}$/;
				if (!phoneRegex.test(visitData.phone.replace(/\D/g, ''))) {
					alert('Please enter a valid 10-digit mobile number');
					return;
				}
				
				// Email validation
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(visitData.email)) {
					alert('Please enter a valid email address');
					return;
				}
				
				// Show loading state
				const submitBtn = visitForm.querySelector('button[type="submit"]');
				const originalText = submitBtn.textContent;
				submitBtn.textContent = 'Sending...';
				submitBtn.disabled = true;
				
				try {
					// Send data to backend API
					const response = await fetch('/api/submit-site-visit/', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(visitData)
					});
					
					const result = await response.json();
					
					if (result.success) {
						// Show success message
						showSuccessMessage('visit', visitForm.parentElement);
						visitForm.reset();
						closeVisitModal();
						
						// Reset date and time selection
						selectedTime = '';
						updatePreferredSlot();
						setActiveDate(formatValue(new Date()));
					} else {
						// Error
						alert('Error: ' + result.message);
					}
				} catch (error) {
					console.error('Submission error:', error);
					alert('Network error. Please try again or contact us directly.');
				} finally {
					// Restore button state
					submitBtn.textContent = originalText;
					submitBtn.disabled = false;
				}
			});
		}
}); // Close DOMContentLoaded event listener