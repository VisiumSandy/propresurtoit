/* ============================================
   PROPRE SUR TOIT — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAVBAR scroll effect ----
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  // ---- BURGER MENU ----
  const burger = document.getElementById('navBurger');
  const navLinks = document.querySelector('.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Animate burger to X
      const spans = burger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close nav when link clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        const spans = burger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }


  // ---- COUNTDOWN jusqu'au 30 mars ----
  const targetDate = new Date('2025-03-30T23:59:59');

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (!daysEl) return;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);


  // ---- SMOOTH SCROLL pour les ancres ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 70;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ---- FORMULAIRE DEVIS ----
  const form = document.getElementById('devisForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      // Validation basique
      const nom = form.querySelector('#nom');
      const tel = form.querySelector('#tel');
      const ville = form.querySelector('#ville');
      let valid = true;

      [nom, tel, ville].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = 'rgba(180, 60, 60, 0.6)';
          field.style.background = 'rgba(255, 220, 220, 0.3)';
          field.focus();
          valid = false;
        } else {
          field.style.borderColor = '';
          field.style.background = '';
        }
      });

      if (!valid) return;

      // Validation téléphone simple
      const telVal = tel.value.trim().replace(/\s/g, '');
      const telRegex = /^(\+33|0033|0)[1-9](\d{8})$/;
      if (!telRegex.test(telVal)) {
        tel.style.borderColor = 'rgba(180, 60, 60, 0.6)';
        tel.style.background = 'rgba(255, 220, 220, 0.3)';
        tel.focus();
        return;
      }

      // Simulate send (remplacer par vraie logique email/backend)
      const submitBtn = form.querySelector('.btn-submit');
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="8" opacity="0.4"/>
          <path d="M12 2 A10 10 0 0 1 22 12"/>
        </svg>
        Envoi en cours…
      `;

      // Style for spin animation
      if (!document.getElementById('spin-style')) {
        const style = document.createElement('style');
        style.id = 'spin-style';
        style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Recevoir mon devis
        `;

        // Show success
        if (formSuccess) {
          formSuccess.hidden = false;
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => {
            formSuccess.hidden = true;
          }, 6000);
        }
      }, 1200);
    });

    // Clear error on input
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
        field.style.background = '';
      });
    });
  }


  // ---- MOBILE STICKY BAR — hide on scroll up in form area ----
  const stickyBar = document.getElementById('mobileStickyBar');
  if (stickyBar) {
    let lastScrollY = window.scrollY;
    const devisSection = document.getElementById('devis');

    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY;

      // Hide bar when form section is visible and focused
      if (devisSection) {
        const rect = devisSection.getBoundingClientRect();
        if (rect.top < 200 && rect.bottom > 0) {
          stickyBar.style.transform = 'translateY(100%)';
          stickyBar.style.transition = 'transform 0.3s ease';
        } else {
          stickyBar.style.transform = '';
          stickyBar.style.transition = 'transform 0.3s ease';
        }
      }

      lastScrollY = currentY;
    }, { passive: true });
  }


  // ---- FAQ — keyboard accessibility ----
  document.querySelectorAll('.faq-item summary').forEach(summary => {
    summary.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        summary.click();
      }
    });
  });


  // ---- Navbar active link highlight ----
  const sections = document.querySelectorAll('section[id]');
  const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchorLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // Add active style
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `.nav-links a.active { color: var(--col-ardoise-deep) !important; font-weight: 600; }`;
  document.head.appendChild(activeStyle);

});
