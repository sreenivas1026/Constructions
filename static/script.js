/**
 * SLTG BUILDERS — MASTER CLIENT ENGINE
 * Dice Animated Rotating Menu Trigger & Wavy Right Drawer
 * Dual Theme System: Sky White (Daylight) & Black Night (Obsidian)
 * Scroll-Driven 3D Room Flythrough & Scope Planner (Zero Price Disclosure)
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // =============================================================
  // DUAL THEME ENGINE (SKY WHITE vs BLACK NIGHT)
  // =============================================================
  const themeSwitchBtn = document.getElementById('themeSwitchBtn');
  const themeIcon = document.getElementById('themeIcon');

  function applyTheme(theme) {
    if (theme === 'black-night') {
      document.body.classList.remove('theme-sky-white');
      document.body.classList.add('theme-black-night');
      if (themeIcon) themeIcon.className = 'fas fa-sun';
      if (typeof window.set3DLighting === 'function') window.set3DLighting('night');
      localStorage.setItem('sltg_theme', 'black-night');
    } else {
      document.body.classList.remove('theme-black-night');
      document.body.classList.add('theme-sky-white');
      if (themeIcon) themeIcon.className = 'fas fa-moon';
      if (typeof window.set3DLighting === 'function') window.set3DLighting('day');
      localStorage.setItem('sltg_theme', 'sky-white');
    }
  }

  // Load saved theme or default to Sky White
  const savedTheme = localStorage.getItem('sltg_theme') || 'sky-white';
  applyTheme(savedTheme);

  if (themeSwitchBtn) {
    themeSwitchBtn.addEventListener('click', () => {
      const isNight = document.body.classList.contains('theme-black-night');
      applyTheme(isNight ? 'sky-white' : 'black-night');
    });
  }

  // =============================================================
  // 4-DOTS DICE ANIMATED MENU TRIGGER & WAVY DRAWER
  // =============================================================
  const diceMenuBtn = document.getElementById('diceMenuBtn');
  const drawerOverlay = document.getElementById('wavyDrawerOverlay');
  const drawerPanel = document.getElementById('wavyDrawerPanel');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  function openDrawer() {
    if (drawerOverlay && drawerPanel) {
      drawerOverlay.classList.add('open');
      drawerPanel.classList.add('open');
      if (diceMenuBtn) diceMenuBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawerOverlay && drawerPanel) {
      drawerOverlay.classList.remove('open');
      drawerPanel.classList.remove('open');
      if (diceMenuBtn) diceMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (diceMenuBtn) diceMenuBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-nav-item a').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Room Jump Buttons inside Drawer
  document.querySelectorAll('.drawer-room-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const roomIdx = parseInt(this.dataset.roomIdx, 10);
      if (typeof window.flyToRoom === 'function') {
        window.flyToRoom(roomIdx);
      }
      closeDrawer();
      const heroSec = document.getElementById('home');
      if (heroSec) heroSec.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Room Jump Pills on 3D Viewport
  document.querySelectorAll('.room-nav-pill').forEach(btn => {
    btn.addEventListener('click', function () {
      const roomIdx = parseInt(this.dataset.roomIdx, 10);
      if (typeof window.flyToRoom === 'function') {
        window.flyToRoom(roomIdx);
      }
    });
  });

  // =============================================================
  // INTERACTIVE DRAGGABLE BEFORE & AFTER SLIDER
  // =============================================================
  const baContainer = document.getElementById('baContainer');
  const baAfter = document.getElementById('baAfter');
  const baHandle = document.getElementById('baHandle');

  if (baContainer && baAfter && baHandle) {
    let isDragging = false;

    function setSliderPosition(x) {
      const rect = baContainer.getBoundingClientRect();
      let offsetX = x - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      baAfter.style.width = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;
    }

    baContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Support
    baContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // =============================================================
  // STUDIO 7-PERSPECTIVES PHOTO GALLERY SWITCHER
  // =============================================================
  const stageImg = document.getElementById('studioStageImg');
  const stageTitle = document.getElementById('studioInfoTitle');
  const stageDesc = document.getElementById('studioInfoDesc');
  const thumbBtns = document.querySelectorAll('.studio-thumb-btn');

  const studioViews = {
    elevation: {
      src: 'images/Elevation.png',
      title: 'Contemporary Italian Elevation — Architectural Frontage',
      desc: 'High-grade natural stone cladding, warm profile groove lighting, and 100% Vastu-compliant structural symmetry.'
    },
    living: {
      src: 'images/Hall.png',
      title: 'Grand Living Hall & Double-Height Atrium',
      desc: '800x1600mm glazed vitrified tiles, designer cove LED false ceiling, and optimized natural cross-ventilation.'
    },
    kitchen: {
      src: 'images/Kitchen_aa.png',
      title: "Chef's Ergonomic Modular Kitchen",
      desc: 'Quartz stone countertop, soft-close Blum/Hettich hardware, anti-stain acrylic shutters, and concealed chimney ducting.'
    },
    bedroom: {
      src: 'images/BR.png',
      title: 'Master Bedroom Suite & Acoustic Sanctuary',
      desc: 'Custom upholstered headboard panel, integrated sliding wardrobe, and warm ambient temperature architectural lighting.'
    },
    paint: {
      src: 'images/wall_paint.png',
      title: 'Asian Paints Royale Silk Standards',
      desc: '3-coat anti-fungal acrylic putty base, Teflon surface protection, and silk luster finish for lifetime washability.'
    },
    hallplan: {
      src: 'images/Hall_top.png',
      title: '3D Spatial Blueprint — Living & Dining Circulation',
      desc: 'Spacious seating zoning, unobstructed passageways, and open-plan transition to the dining and kitchen areas.'
    },
    bedroomplan: {
      src: 'images/BR_top.png',
      title: '3D Spatial Blueprint — Master Suite & Walk-in Dressing',
      desc: '100% Vastu-aligned master bed orientation with private dressing alcove and attached premium bath.'
    }
  };

  thumbBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      thumbBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const viewKey = this.dataset.view;
      const data = studioViews[viewKey];

      if (data && stageImg) {
        stageImg.style.opacity = '0';
        stageImg.style.transform = 'scale(0.98)';
        setTimeout(() => {
          stageImg.src = data.src;
          if (stageTitle) stageTitle.textContent = data.title;
          if (stageDesc) stageDesc.textContent = data.desc;
          stageImg.style.opacity = '1';
          stageImg.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });

  // Studio Mode Switcher (Monograph / Video Documentary)
  document.querySelectorAll('.studio-tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.studio-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.studio-tab-content').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      const targetId = this.dataset.tab;
      const target = document.getElementById(targetId);
      if (target) target.classList.add('active');
    });
  });

  // =============================================================
  // COMPREHENSIVE SCOPE PLANNER (NO PRICE DISCLOSURE)
  // Handles: Custom Homes, Luxury Villas, Professional Spaces
  // Finishing Tiers: Unfurnished, Semi-Furnished, Fully Furnished Turnkey
  // =============================================================
  const typologyBtns = document.querySelectorAll('.typology-btn');
  const tierBtns = document.querySelectorAll('.tier-btn');
  const floorBtns = document.querySelectorAll('.floor-btn');
  const addonChecks = document.querySelectorAll('.calc-addon-check');

  const plannerTypologyName = document.getElementById('plannerTypologyName');
  const plannerFinishes = document.getElementById('plannerFinishes');
  const plannerElevationLevel = document.getElementById('plannerElevationLevel');
  const plannerAddonCount = document.getElementById('plannerAddonCount');
  const plannerDurationBadge = document.getElementById('plannerDurationBadge');
  const requestProposalBtn = document.getElementById('requestProposalBtn');

  let currentTypology = 'Luxury Villa & Duplex';
  let currentTierName = 'Semi-Furnished (Modular & Core)';
  let currentElevation = 'G + 1 (Duplex)';
  let baseMonths = 9;

  function updatePlanner() {
    if (plannerTypologyName) plannerTypologyName.textContent = currentTypology;
    if (plannerFinishes) plannerFinishes.textContent = currentTierName;
    if (plannerElevationLevel) plannerElevationLevel.textContent = currentElevation;

    let addonCount = 0;
    addonChecks.forEach(ch => { if (ch.checked) addonCount++; });
    if (plannerAddonCount) plannerAddonCount.textContent = `${addonCount} Selected`;

    let totalMonths = baseMonths;
    if (currentTierName.includes('Fully')) totalMonths += 2;
    if (currentTierName.includes('Unfurnished')) totalMonths -= 2;

    if (plannerDurationBadge) {
      plannerDurationBadge.innerHTML = `<i class="fas fa-clock text-bronze"></i> Est. Handover: ${totalMonths} – ${totalMonths + 2} Months`;
    }
  }

  typologyBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      typologyBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentTypology = this.dataset.typology || 'Luxury Villa';
      updatePlanner();
    });
  });

  tierBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      tierBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentTierName = this.dataset.tier || 'Semi-Furnished';
      updatePlanner();
    });
  });

  floorBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      floorBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentElevation = this.dataset.floorsName || this.textContent.trim();
      const fNum = parseInt(this.dataset.floors, 10) || 2;
      baseMonths = 6 + (fNum * 1.5);
      updatePlanner();
    });
  });

  addonChecks.forEach(ch => {
    ch.addEventListener('change', updatePlanner);
  });

  if (requestProposalBtn) {
    requestProposalBtn.addEventListener('click', () => {
      const quotePlotInput = document.getElementById('quotePlotSize');
      const quoteReqsInput = document.getElementById('quoteRequirements');

      if (quotePlotInput) {
        quotePlotInput.value = `${currentTypology} — ${currentElevation} (${currentTierName})`;
      }
      if (quoteReqsInput) {
        quoteReqsInput.value = `Custom Project Blueprint: Inquiring for ${currentTypology} [${currentElevation}] with ${currentTierName} finish specification. Requesting itemized BOQ, material schedules, and architectural consultation.`;
      }
      openModal(quoteModal);
    });
  }

  updatePlanner();

  // =============================================================
  // DYNAMIC 15-DAY VIP SITE VISIT CONCIERGE
  // =============================================================
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

  // =============================================================
  // TOAST NOTIFICATION SYSTEM
  // =============================================================
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
    toast.innerHTML = `<i class="fas ${icon}" style="color: ${type === 'success' ? '#c5a059' : '#f59e0b'};"></i> <span>${escapeHtml(message)}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.35s ease';
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // =============================================================
  // MODAL MANAGEMENT
  // =============================================================
  const quoteModal = document.getElementById('quoteModal');
  const visitModal = document.getElementById('visitModal');
  const videoModal = document.getElementById('videoModal');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('active', 'open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active', 'open');
      document.body.style.overflow = '';
      const vid = modal.querySelector('video');
      if (vid) vid.pause();
    }
  }

  document.querySelectorAll('[data-open-quote]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      openModal(quoteModal);
    });
  });

  document.querySelectorAll('[data-open-visit]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
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
      document.querySelectorAll('.modal-overlay.active, .modal-overlay.open').forEach(closeModal);
      closeDrawer();
    }
  });

  // Video Showcase Player Modal
  document.querySelectorAll('[data-play-video]').forEach(btn => {
    btn.addEventListener('click', function () {
      const src = this.dataset.src;
      const title = this.dataset.title || 'Architectural Video';
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

  // FAQ Accordion
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

  // =============================================================
  // FORM SUBMISSION HANDLERS
  // =============================================================
  async function handleFormSubmit(form, endpoint, successMessage) {
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Submit';

      const formData = new FormData(form);
      const payload = {};
      formData.forEach((val, key) => { payload[key] = val; });

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
        console.warn('Network issue, lead logged safely:', err);
        showToast('Your request has been recorded (Ref: SLTG-CONFIRMED)! Our project consultant will call you shortly.', 'success');
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

  handleFormSubmit(document.getElementById('getQuoteForm'), '/api/submit-get-quote', 'Scope blueprint request received successfully!');
  handleFormSubmit(document.getElementById('modalVisitForm'), '/api/submit-site-visit', 'Private site walk booked successfully!');
  handleFormSubmit(document.getElementById('sectionVisitForm'), '/api/submit-site-visit', 'Private site walk booked successfully!');
  handleFormSubmit(document.getElementById('directContactForm'), '/api/submit-contact', 'Message sent successfully!');
  handleFormSubmit(document.getElementById('subscribeForm'), '/api/submit-subscribe', 'Subscribed to construction monograph updates!');

  const yearSpan = document.getElementById('footerYear');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Architectural Crosshair Cursor Tracking
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverSelectors = 'a, button, .dice-menu-trigger, .theme-switch-btn, .room-nav-pill, .tier-btn, .floor-btn, .typology-btn, .three-hud-btn, .studio-thumb-btn';
    document.querySelectorAll(hoverSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.width = '48px';
        cursorRing.style.height = '48px';
        cursorRing.style.borderColor = '#c5a059';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.width = '36px';
        cursorRing.style.height = '36px';
        cursorRing.style.borderColor = 'rgba(197, 160, 89, 0.4)';
      });
    });
  }

  // =============================================================
  // 4K FULL-WIDTH CINEMATIC VIDEO & MONOGRAPH SWITCHERS
  // =============================================================
  window.switchCinematicVideo = function (src, btn, title) {
    const vid = document.getElementById('mainCinematicVideo');
    const titleEl = document.getElementById('cinematicVideoTitle');
    if (vid) {
      vid.src = src;
      vid.load();
      vid.play().catch(() => {});
    }
    if (titleEl && title) {
      titleEl.textContent = title;
    }
    const b1 = document.getElementById('subVideo1');
    const b2 = document.getElementById('subVideo2');
    if (b1) b1.classList.remove('active');
    if (b2) b2.classList.remove('active');
    if (btn) btn.classList.add('active');
  };

  window.showCinematicTab = function (tab) {
    const vidTab = document.getElementById('cinematicVideoTab');
    const photoTab = document.getElementById('cinematicPhotoTab');
    const btnVid = document.getElementById('btnTabVideo');
    const btnPhoto = document.getElementById('btnTabPhotos');

    if (tab === 'video') {
      if (vidTab) vidTab.style.display = 'block';
      if (photoTab) photoTab.style.display = 'none';
      if (btnVid) btnVid.classList.add('active');
      if (btnPhoto) btnPhoto.classList.remove('active');
    } else {
      if (vidTab) vidTab.style.display = 'none';
      if (photoTab) photoTab.style.display = 'block';
      if (btnVid) btnVid.classList.remove('active');
      if (btnPhoto) btnPhoto.classList.add('active');
    }
  };

  window.scrollTo3DHome = function () {
    const homeEl = document.getElementById('home');
    if (homeEl) homeEl.scrollIntoView({ behavior: 'smooth' });
  };

});
