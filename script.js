/**
 * script.js – Mangalam HDPE Pipes Product Page
 * Handles:
 *  1. Sticky bar (appears after scrolling past first fold)
 *  2. Image carousel with prev/next + thumbnails
 *  3. Zoom-on-hover for carousel images
 *  4. Mobile hamburger menu
 *  5. Process tabs (manufacturing section)
 *  6. Applications horizontal scroll carousel (with nav btns)
 *  7. FAQ accordion (native <details> enhanced)
 *  8. Modal open / close (quote & catalogue)
 *  9. Sticky bar + nav offset when sticky bar is visible
 */

/* ===========================================================
   DATA – Carousel images
  Local placeholder images (offline)
=========================================================== */
const carouselImages = [
  {
    src: 'assets/images/placeholder.png',
    alt: 'Industrial site installing HDPE pipes'
  },
  {
    src: 'assets/images/placeholder.png',
    alt: 'Industrial HDPE manufacturing facility'
  },
  {
    src: 'assets/images/placeholder.png',
    alt: 'HDPE pipes stacked for dispatch'
  },
  {
    src: 'assets/images/placeholder.png',
    alt: 'Fusion welding process'
  },
  {
    src: 'assets/images/placeholder.png',
    alt: 'HDPE pipe coils for infrastructure'
  },
  {
    src: 'assets/images/placeholder.png',
    alt: 'Workers laying pipe underground'
  }
];

/* ===========================================================
   STATE
=========================================================== */
let currentSlide = 0;
let zoomActive   = false;

/* ===========================================================
   DOM REFERENCES (set after DOMContentLoaded)
=========================================================== */
let mainNav, stickyBar, mainImg, thumbsContainer,
    prevBtn, nextBtn, zoomPreview, zoomPreviewImg,
    zoomCrosshair, carouselMain,
    hamburger, mobileMenu,
    appTrack, appViewport,
    processTabs, processPanels,
    quoteModalOverlay, quoteModalClose,
    catalogueModalOverlay, catalogueModalClose;

/* ===========================================================
   INIT
=========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  cacheDOMRefs();
  buildThumbs();
  updateCarousel(false);
  initStickyBar();
  initZoom();
  initMobileMenu();
  initProcessTabs();
  initApplicationsCarousel();
  initModals();
});

/* ----------------------------------------------------------
   Cache frequently used DOM elements
---------------------------------------------------------- */
function cacheDOMRefs() {
  mainNav            = document.getElementById('mainNav');
  stickyBar          = document.getElementById('stickyBar');
  mainImg            = document.getElementById('mainCarouselImg');
  thumbsContainer    = document.getElementById('carouselThumbs');
  prevBtn            = document.getElementById('prevBtn');
  nextBtn            = document.getElementById('nextBtn');
  zoomPreview        = document.getElementById('zoomPreview');
  zoomPreviewImg     = document.getElementById('zoomPreviewImg');
  zoomCrosshair      = document.getElementById('zoomCrosshair');
  carouselMain       = document.getElementById('carouselMain');
  hamburger          = document.getElementById('hamburger');
  mobileMenu         = document.getElementById('mobileMenu');
  appTrack           = document.getElementById('appTrack');
  appViewport        = document.getElementById('appViewport');
  quoteModalOverlay  = document.getElementById('quoteModalOverlay');
  quoteModalClose    = document.getElementById('quoteModalClose');
  catalogueModalOverlay = document.getElementById('catalogueModalOverlay');
  catalogueModalClose   = document.getElementById('catalogueModalClose');
}

/* ===========================================================
   1. STICKY PRODUCT BAR
   Appears when user scrolls past the hero section (first fold).
   Disappears when scrolling back to the top.
=========================================================== */
function initStickyBar() {
  const hero = document.getElementById('hero');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          // Hero scrolled out of view – show sticky bar
          stickyBar.classList.add('visible');
          stickyBar.setAttribute('aria-hidden', 'false');
          // Push the main nav down by the height of the sticky bar
          document.body.style.paddingTop = '';
        } else {
          // Hero back in view – hide sticky bar
          stickyBar.classList.remove('visible');
          stickyBar.setAttribute('aria-hidden', 'true');
        }
      });
    },
    {
      // Trigger when hero is 20% or less visible
      threshold: 0.1,
      rootMargin: '-68px 0px 0px 0px' // account for main-nav height
    }
  );

  if (hero) observer.observe(hero);
}

/* ===========================================================
   2 + 3. IMAGE CAROUSEL WITH ZOOM
=========================================================== */

/* --- Build thumbnail strip --- */
function buildThumbs() {
  if (!thumbsContainer) return;
  thumbsContainer.innerHTML = '';

  carouselImages.forEach((img, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'carousel-thumb' + (i === 0 ? ' active' : '');
    thumb.setAttribute('role', 'listitem');
    thumb.setAttribute('tabindex', '0');
    thumb.setAttribute('aria-label', `View image ${i + 1}: ${img.alt}`);

    const imgEl = document.createElement('img');
    imgEl.src  = img.src.replace('w=800&h=600', 'w=72&h=72');
    imgEl.alt  = img.alt;
    imgEl.loading = 'lazy';

    thumb.appendChild(imgEl);
    thumb.addEventListener('click', () => goToSlide(i));
    thumb.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToSlide(i); } });

    thumbsContainer.appendChild(thumb);
  });

  // Wire prev/next
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
}

/* --- Navigate to a specific slide --- */
function goToSlide(index) {
  // Wrap around
  currentSlide = ((index % carouselImages.length) + carouselImages.length) % carouselImages.length;
  updateCarousel(true);
}

/* --- Update main image + thumbnails --- */
function updateCarousel(animate) {
  if (!mainImg) return;
  const img = carouselImages[currentSlide];

  if (animate) {
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = img.src;
      mainImg.alt = img.alt;
      // Update zoom preview src too
      if (zoomPreviewImg) zoomPreviewImg.src = img.src;
      mainImg.style.opacity = '1';
    }, 200);
  } else {
    mainImg.src = img.src;
    mainImg.alt = img.alt;
    if (zoomPreviewImg) zoomPreviewImg.src = img.src;
  }

  // Update thumbnail active state
  const thumbs = thumbsContainer?.querySelectorAll('.carousel-thumb');
  thumbs?.forEach((t, i) => {
    t.classList.toggle('active', i === currentSlide);
  });
}

/* --- Keyboard navigation on carousel --- */
document.addEventListener('keydown', e => {
  if (document.activeElement?.closest('.carousel-wrapper')) {
    if (e.key === 'ArrowLeft')  goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
  }
});

/* --- Touch / Swipe support --- */
let touchStartX = 0;
document.addEventListener('DOMContentLoaded', () => {
  const cMain = document.getElementById('carouselMain');
  if (!cMain) return;

  cMain.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  cMain.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      goToSlide(currentSlide + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
});

/* ===========================================================
   3. ZOOM ON HOVER
   Shows a magnified preview panel next to the carousel.
   Tracks mouse position to show the correct region at 2× zoom.
=========================================================== */
function initZoom() {
  if (!carouselMain || !zoomPreview || !zoomPreviewImg || !zoomCrosshair) return;

  /* Zoom only on desktop (pointer:fine) */
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return;

  carouselMain.addEventListener('mouseenter', handleZoomEnter);
  carouselMain.addEventListener('mouseleave', handleZoomLeave);
  carouselMain.addEventListener('mousemove', handleZoomMove);
}

function handleZoomEnter() {
  zoomActive = true;
  zoomPreview.classList.add('active');
  zoomPreview.setAttribute('aria-hidden', 'false');
  /* Make sure preview has current image */
  zoomPreviewImg.src = carouselImages[currentSlide].src;
}

function handleZoomLeave() {
  zoomActive = false;
  zoomPreview.classList.remove('active');
  zoomPreview.setAttribute('aria-hidden', 'true');
  if (zoomCrosshair) {
    zoomCrosshair.style.opacity = '0';
  }
}

function handleZoomMove(e) {
  if (!zoomActive) return;

  const rect   = carouselMain.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  /* Relative position (0-1) */
  const relX = Math.max(0, Math.min(1, mouseX / rect.width));
  const relY = Math.max(0, Math.min(1, mouseY / rect.height));

  /* Move crosshair SVG to cursor */
  const chSize = 32;
  if (zoomCrosshair) {
    zoomCrosshair.style.left   = `${mouseX - chSize / 2}px`;
    zoomCrosshair.style.top    = `${mouseY - chSize / 2}px`;
    zoomCrosshair.style.opacity = '1';
    zoomCrosshair.style.position = 'absolute';
  }

  /* Zoom factor: 2× */
  const ZOOM = 2.5;
  const previewW = zoomPreview.offsetWidth;
  const previewH = zoomPreview.offsetHeight;

  /* The zoomed image is ZOOM× bigger than the preview area.
     We offset it so the hovered region is centred. */
  const imgW = previewW * ZOOM;
  const imgH = previewH * ZOOM;

  const offsetX = -(relX * imgW - previewW / 2);
  const offsetY = -(relY * imgH - previewH / 2);

  /* Clamp so image doesn't go outside preview */
  const clampedX = Math.min(0, Math.max(previewW - imgW, offsetX));
  const clampedY = Math.min(0, Math.max(previewH - imgH, offsetY));

  zoomPreviewImg.style.width     = `${imgW}px`;
  zoomPreviewImg.style.height    = `${imgH}px`;
  zoomPreviewImg.style.objectFit = 'cover';
  zoomPreviewImg.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
}

/* ===========================================================
   4. MOBILE HAMBURGER MENU
=========================================================== */
function initMobileMenu() {
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  /* Close menu on link click */
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ===========================================================
   5. PROCESS TABS (Manufacturing section)
=========================================================== */
function initProcessTabs() {
  const tabs   = document.querySelectorAll('.process-tab');
  const panels = document.querySelectorAll('.process-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      /* Deactivate all */
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      /* Activate clicked */
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const panel = document.getElementById(`tab-${target}`);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ===========================================================
   6. APPLICATIONS HORIZONTAL CAROUSEL
=========================================================== */
function initApplicationsCarousel() {
  const prevBtn = document.getElementById('appPrev');
  const nextBtn = document.getElementById('appNext');
  if (!appTrack || !prevBtn || !nextBtn) return;

  let appIndex = 0;

  function getCardWidth() {
    const card = appTrack.querySelector('.app-card');
    if (!card) return 310;
    const style = window.getComputedStyle(card);
    const gap   = parseInt(window.getComputedStyle(appTrack).gap) || 20;
    return card.offsetWidth + gap;
  }

  function updateAppCarousel() {
    const offset = appIndex * getCardWidth();
    appTrack.style.transform = `translateX(-${offset}px)`;
  }

  function maxIndex() {
    const cards  = appTrack.querySelectorAll('.app-card');
    const viewW  = appViewport?.offsetWidth || window.innerWidth;
    const cardW  = getCardWidth();
    const visible = Math.floor(viewW / cardW);
    return Math.max(0, cards.length - visible);
  }

  nextBtn.addEventListener('click', () => {
    if (appIndex < maxIndex()) { appIndex++; updateAppCarousel(); }
  });

  prevBtn.addEventListener('click', () => {
    if (appIndex > 0) { appIndex--; updateAppCarousel(); }
  });

  /* Touch support */
  let tStartX = 0;
  if (appTrack) {
    appTrack.addEventListener('touchstart', e => { tStartX = e.changedTouches[0].clientX; }, { passive: true });
    appTrack.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - tStartX;
      if (dx < -40 && appIndex < maxIndex()) { appIndex++; updateAppCarousel(); }
      if (dx >  40 && appIndex > 0)          { appIndex--; updateAppCarousel(); }
    }, { passive: true });
  }
}

/* ===========================================================
   7. MODALS
   - "Get Custom Quote" and sticky bar button → quote modal
   - "Request a Quote" in features section → quote modal
   - "Download Full Technical Datasheet" → catalogue modal
   - "Request Catalogue" in FAQ section → catalogue modal
=========================================================== */
function initModals() {
  /* Open triggers for Quote modal */
  const quoteOpenBtns = [
    document.getElementById('getQuoteBtn'),
    document.getElementById('requestQuoteFeatures'),
    document.querySelectorAll('.sticky-inner .btn-primary')[0]
  ];

  quoteOpenBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', () => openModal(quoteModalOverlay));
  });

  /* Also wire any "Get Custom Quote" buttons in sticky bar */
  document.querySelectorAll('.sticky-inner .btn-primary').forEach(btn => {
    btn.addEventListener('click', () => openModal(quoteModalOverlay));
  });

  /* Open triggers for Catalogue modal */
  const catOpenBtns = [
    document.getElementById('downloadDatasheetBtn'),
    document.getElementById('requestCatalogueBtn')
  ];
  catOpenBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', () => openModal(catalogueModalOverlay));
  });

  /* Close buttons */
  if (quoteModalClose)     quoteModalClose.addEventListener('click',     () => closeModal(quoteModalOverlay));
  if (catalogueModalClose) catalogueModalClose.addEventListener('click', () => closeModal(catalogueModalOverlay));

  /* Close on overlay backdrop click */
  [quoteModalOverlay, catalogueModalOverlay].forEach(overlay => {
    if (!overlay) return;
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  /* Close on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal(quoteModalOverlay);
      closeModal(catalogueModalOverlay);
    }
  });
}

function openModal(overlay) {
  if (!overlay) return;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  /* Focus first input for accessibility */
  const firstInput = overlay.querySelector('input, select, textarea');
  if (firstInput) setTimeout(() => firstInput.focus(), 100);
}

function closeModal(overlay) {
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ===========================================================
   UTILITY – debounce for resize events
=========================================================== */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* Re-run applications carousel calculation on resize */
window.addEventListener('resize', debounce(() => {
  const appTrackEl = document.getElementById('appTrack');
  if (appTrackEl) appTrackEl.style.transform = 'translateX(0)';
}, 250));