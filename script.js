/* ===========================================
   10 BRIDGE CHALLENGE — Script

   How to update:
   1. Add a new post in index.html (uncomment a template, fill in)
   2. Update BRIDGES_SOLD below when a sale closes
   3. Update START_DATE if you want a different day-zero
   4. That's it — everything else updates automatically

   =========================================== */

// ──────────────────────────────────────────────
// CONFIG
// ──────────────────────────────────────────────
const BRIDGES_SOLD = 0;
const BRIDGES_TOTAL = 10;
const START_DATE = '2026-02-01'; // YYYY-MM-DD — change to your actual start date

// ──────────────────────────────────────────────
// DAYS ELAPSED
// ──────────────────────────────────────────────
function updateDaysElapsed() {
  const start = new Date(START_DATE + 'T00:00:00');
  const now = new Date();
  const diff = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));

  const el = document.getElementById('daysElapsed');
  if (el) el.textContent = diff;
}

// ──────────────────────────────────────────────
// PROGRESS & PIPS
// ──────────────────────────────────────────────
function updateProgress() {
  const pct = Math.round((BRIDGES_SOLD / BRIDGES_TOTAL) * 100);
  const barEl = document.getElementById('progressBar');

  requestAnimationFrame(() => {
    setTimeout(() => {
      if (barEl) barEl.style.width = pct + '%';
    }, 400);
  });

  document.querySelectorAll('.pip').forEach(pip => {
    const bridgeNum = parseInt(pip.dataset.bridge, 10);
    if (bridgeNum <= BRIDGES_SOLD) {
      pip.classList.add('sold');
    }
  });
}

// ──────────────────────────────────────────────
// POSTS — Expand / collapse
// ──────────────────────────────────────────────
function initPosts() {
  const posts = document.querySelectorAll('.post');
  const emptyEl = document.getElementById('postsEmpty');

  // Hide empty state if posts exist
  if (emptyEl && posts.length > 0) {
    emptyEl.style.display = 'none';
  }

  posts.forEach(post => {
    const header = post.querySelector('.post__header');
    if (!header) return;

    function toggle() {
      const isExpanded = post.classList.toggle('expanded');
      header.setAttribute('aria-expanded', isExpanded);
    }

    header.addEventListener('click', toggle);
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  // Handle direct-link to a post (e.g. #post-1)
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target && target.classList.contains('post')) {
      target.classList.add('expanded');
      const header = target.querySelector('.post__header');
      if (header) header.setAttribute('aria-expanded', 'true');
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }
}

// ──────────────────────────────────────────────
// SCROLL REVEAL
// ──────────────────────────────────────────────
function initReveal() {
  const targets = document.querySelectorAll(
    '.section__header, .challenge-item, .bridges__text, .slider, .post, .posts__empty'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}

// ──────────────────────────────────────────────
// SMOOTH SCROLL FOR NAV LINKS
// ──────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ──────────────────────────────────────────────
// SLIDER
// ──────────────────────────────────────────────
function initSlider() {
  const track = document.querySelector('.slider__track');
  const slides = document.querySelectorAll('.slider__slide');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const currentEl = document.getElementById('sliderCurrent');
  const totalEl = document.getElementById('sliderTotal');

  if (!track || slides.length === 0) return;

  let index = 0;
  const count = slides.length;

  if (totalEl) totalEl.textContent = count;

  function goTo(i) {
    index = (i + count) % count; // wrap around
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    if (currentEl) currentEl.textContent = index + 1;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));

  // Keyboard support
  const slider = document.getElementById('slider');
  if (slider) {
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    });
    slider.setAttribute('tabindex', '0');
  }

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(index + 1);
      else goTo(index - 1);
    }
  }, { passive: true });

  // Handle broken placeholder images
  slides.forEach(slide => {
    const img = slide.querySelector('.slider__image img');
    if (img) {
      img.addEventListener('error', () => {
        img.style.display = 'none';
        img.closest('.slider__image').classList.add('slider__image--placeholder');
      });
    }
  });
}

// ──────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateDaysElapsed();
  updateProgress();
  initPosts();
  initReveal();
  initSmoothScroll();
  initSlider();
});
