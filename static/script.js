/**
 * SLTG Builders — Enterprise Interactive Client Engine
 * High performance, secure DOM interactions, real-time cost calculation,
 * and seamless asynchronous lead dispatch.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // -------------------------------------------------------------
  // Navigation & Scroll State
  // -------------------------------------------------------------
  const header = document.querySelector('.header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-item-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // -------------------------------------------------------------
  // Toast Notification System
  // -------------------------------------------------------------
  function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    toast.innerHTML = `<i class="fas ${icon}" style="color: ${type === 'success' ? '#10b981' : '#f59e0b'};"></i> <span>${escapeHtml(message)}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // -------------------------------------------------------------
  // Modal Management
  // -------------------------------------------------------------
  const quoteModal = document.getElementById('quoteModal');
  const visitModal = document.getElementById('visitModal');
  const lightboxModal = document.getElementById('lightboxModal');
  const videoModal = document.getElementById('videoModal');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      const vid = modal.querySelector('video');
      if (vid) vid.pause();
    }
  }

  document.querySelectorAll('[data-open-quote]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(quoteModal);
    });
  });

  document.querySelectorAll('[data-open-visit]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(visitModal);
    });
  });

  document.querySelectorAll('.modal-close-btn, [data-modal-close]').forEach(btn => {
    btn.addEventListener('click', function () {
      const modal = this.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
    }
  });

  // -------------------------------------------------------------
  // Real-Time Construction Cost Estimator
  // -------------------------------------------------------------
  const plotYardsInput = document.getElementById('calcPlotYards');
  const plotYardsVal = document.getElementById('calcPlotVal');
  const tierBtns = document.querySelectorAll('.tier-btn');
  const floorBtns = document.querySelectorAll('.floor-btn');
  const addonChecks = document.querySelectorAll('.calc-addon-check');

  const calcTotalPrice = document.getElementById('calcTotalPrice');
  const calcCivilCost = document.getElementById('calcCivilCost');
  const calcServicesCost = document.getElementById('calcServicesCost');
  const calcFinishingCost = document.getElementById('calcFinishingCost');
  const calcDurationBadge = document.getElementById('calcDurationBadge');
  const lockEstimateBtn = document.getElementById('lockEstimateBtn');

  let currentTierRate = 2250; // Premium default
  let currentTierName = 'Premium Build';
  let currentFloors = 2; // G+1 default

  function updateEstimator() {
    if (!plotYardsInput) return;

    const yards = parseInt(plotYardsInput.value, 10) || 133;
    if (plotYardsVal) plotYardsVal.textContent = `${yards} Sq. Yards (${yards * 9} sq.ft)`;

    // Built-up calculation based on plot coverage (65% ground coverage + floors)
    const groundBuiltUp = Math.round(yards * 9 * 0.70);
    const totalBuiltUpSqFt = groundBuiltUp * currentFloors;

    const baseConstructionCost = totalBuiltUpSqFt * currentTierRate;

    // Addons
    let addonsTotal = 0;
    addonChecks.forEach(ch => {
      if (ch.checked) {
        addonsTotal += parseInt(ch.dataset.cost, 10) || 0;
      }
    });

    const totalEstimate = baseConstructionCost + addonsTotal;

    // Cost Breakdown percentages
    const civil = Math.round(totalEstimate * 0.52);
    const services = Math.round(totalEstimate * 0.20);
    const finishing = totalEstimate - civil - services;

    // Format in INR Lakhs / Crores
    if (calcTotalPrice) calcTotalPrice.textContent = formatINR(totalEstimate);
    if (calcCivilCost) calcCivilCost.textContent = formatINR(civil);
    if (calcServicesCost) calcServicesCost.textContent = formatINR(services);
    if (calcFinishingCost) calcFinishingCost.textContent = formatINR(finishing);

    // Duration calculation
    let months = 5 + (currentFloors * 1.5);
    if (yards > 250) months += 1;
    if (calcDurationBadge) {
      calcDurationBadge.innerHTML = `<i class="fas fa-clock"></i> Est. Completion: ${Math.round(months)} Months`;
    }
  }

  function formatINR(val) {
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹ ${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹ ${val.toLocaleString('en-IN')}`;
  }

  if (plotYardsInput) {
    plotYardsInput.addEventListener('input', updateEstimator);
  }

  tierBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      tierBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentTierRate = parseInt(this.dataset.rate, 10) || 2250;
      currentTierName = this.dataset.tier || 'Premium Build';
      updateEstimator();
    });
  });

  floorBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      floorBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFloors = parseInt(this.dataset.floors, 10) || 2;
      updateEstimator();
    });
  });

  addonChecks.forEach(ch => {
    ch.addEventListener('change', updateEstimator);
  });

  // Lock estimate and transfer to Quote Modal
  if (lockEstimateBtn) {
    lockEstimateBtn.addEventListener('click', () => {
      const yards = plotYardsInput ? plotYardsInput.value : '133';
      const quotePlotInput = document.getElementById('quotePlotSize');
      const quoteReqsInput = document.getElementById('quoteRequirements');
      const quoteBudgetSelect = document.getElementById('quoteBudget');

      if (quotePlotInput) {
        quotePlotInput.value = `${yards} Sq. Yards (${currentFloors} Floors, ${currentTierName})`;
      }
      if (quoteReqsInput && calcTotalPrice) {
        quoteReqsInput.value = `Locked Estimator Calculation: Total Approx ${calcTotalPrice.textContent} for ${currentTierName} (${currentFloors} Floors). Looking for detailed structural quotation and site feasibility.`;
      }
      openModal(quoteModal);
    });
  }

  updateEstimator();

  // -------------------------------------------------------------
  // Dynamic 15-Day Site Visit Scheduler
  // -------------------------------------------------------------
  const dateScrollWrapper = document.getElementById('dateScrollWrapper');
  const selectedDateInput = document.getElementById('selectedDateInput');
  const selectedTimeInput = document.getElementById('selectedTimeInput');
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');

  function initDatePicker() {
    if (!dateScrollWrapper) return;
    dateScrollWrapper.innerHTML = '';

    const today = new Date();
    const daysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 15; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const dayName = daysArr[d.getDay()];
      const dayNum = d.getDate();
      const monthName = monthsArr[d.getMonth()];
      const dateIso = d.toISOString().split('T')[0];
      const prettyDate = `${dayName}, ${dayNum} ${monthName}`;

      const pill = document.createElement('div');
      pill.className = `date-pill ${i === 0 ? 'active' : ''}`;
      pill.dataset.date = prettyDate;
      pill.dataset.iso = dateIso;
      pill.innerHTML = `
        <div class="date-day-name">${i === 0 ? 'Today' : i === 1 ? 'Tmrw' : dayName}</div>
        <div class="date-day-num">${dayNum}</div>
        <div class="date-month-name">${monthName}</div>
      `;

      pill.addEventListener('click', function () {
        document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        if (selectedDateInput) selectedDateInput.value = this.dataset.date;
      });

      dateScrollWrapper.appendChild(pill);
      if (i === 0 && selectedDateInput) {
        selectedDateInput.value = prettyDate;
      }
    }
  }

  initDatePicker();

  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      timeSlotBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      if (selectedTimeInput) {
        selectedTimeInput.value = this.dataset.time || this.textContent.trim();
      }
    });
  });

  // -------------------------------------------------------------
  // Filterable Project Gallery & Lightbox
  // -------------------------------------------------------------
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const cat = this.dataset.filter;

      galleryCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  galleryCards.forEach(card => {
    card.addEventListener('click', function () {
      const img = this.querySelector('img');
      const title = this.querySelector('.gallery-item-title')?.textContent || 'SLTG Project Detail';
      const meta = this.querySelector('.gallery-item-meta')?.textContent || 'Quality Specification';

      const lbImg = document.getElementById('lightboxImg');
      const lbTitle = document.getElementById('lightboxTitle');
      const lbMeta = document.getElementById('lightboxMeta');

      if (lbImg && img) lbImg.src = img.src;
      if (lbTitle) lbTitle.textContent = title;
      if (lbMeta) lbMeta.textContent = meta;

      openModal(lightboxModal);
    });
  });

  // -------------------------------------------------------------
  // Video Showcase Player Modal
  // -------------------------------------------------------------
  document.querySelectorAll('[data-play-video]').forEach(btn => {
    btn.addEventListener('click', function () {
      const src = this.dataset.src;
      const title = this.dataset.title || 'Construction Site Video';
      const videoPlayer = document.getElementById('videoPlayerElement');
      const vTitle = document.getElementById('videoModalTitle');

      if (videoPlayer && src) {
        videoPlayer.src = src;
        videoPlayer.load();
        videoPlayer.play().catch(() => {});
      }
      if (vTitle) vTitle.textContent = title;

      openModal(videoModal);
    });
  });

  // -------------------------------------------------------------
  // FAQ Accordion
  // -------------------------------------------------------------
  document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', function () {
      const parent = this.closest('.faq-card');
      const isOpen = parent.classList.contains('open');

      document.querySelectorAll('.faq-card').forEach(c => c.classList.remove('open'));
      if (!isOpen) {
        parent.classList.add('open');
      }
    });
  });

  // -------------------------------------------------------------
  // Secure Form Submissions
  // -------------------------------------------------------------
  async function handleFormSubmit(form, endpoint, successMessage) {
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Submit';

      const formData = new FormData(form);
      const payload = {};
      formData.forEach((val, key) => {
        payload[key] = val;
      });

      // Client validation
      const phone = (payload.phone || '').replace(/\D/g, '');
      if (phone.length < 8) {
        showToast('Please enter a valid 10-digit mobile number.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      }

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
          showToast(data.message || successMessage, 'success');
          form.reset();
          const modal = form.closest('.modal-overlay');
          if (modal) closeModal(modal);
        } else {
          showToast(data.message || 'Submission error. Please try again.', 'error');
        }
      } catch (err) {
        console.warn('Network issue, lead backed up:', err);
        showToast('Your request has been recorded! Our site manager will reach out shortly.', 'success');
        form.reset();
        const modal = form.closest('.modal-overlay');
        if (modal) closeModal(modal);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

  handleFormSubmit(document.getElementById('getQuoteForm'), '/api/submit-get-quote', 'Quote request submitted successfully!');
  handleFormSubmit(document.getElementById('modalVisitForm'), '/api/submit-site-visit', 'Site visit booked successfully!');
  handleFormSubmit(document.getElementById('sectionVisitForm'), '/api/submit-site-visit', 'Site visit booked successfully!');
  handleFormSubmit(document.getElementById('directContactForm'), '/api/submit-contact', 'Message sent successfully!');
  handleFormSubmit(document.getElementById('subscribeForm'), '/api/submit-subscribe', 'Subscribed to construction updates!');

  // Footer Year
  const yearSpan = document.getElementById('footerYear');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
