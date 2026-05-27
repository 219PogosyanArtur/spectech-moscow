/* ============================================================
   СпецТехМосква — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Burger / Mobile Nav ---- */
  const burger        = document.getElementById('burger');
  const mobileNav     = document.getElementById('mobileNav');
  const overlay       = document.getElementById('mobileNavOverlay');
  const mobileClose   = document.getElementById('mobileNavClose');

  function openNav() {
    mobileNav.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (burger)      burger.addEventListener('click', openNav);
  if (mobileClose) mobileClose.addEventListener('click', closeNav);
  if (overlay)     overlay.addEventListener('click', closeNav);

  document.querySelectorAll('.mobile-nav__link, .mobile-nav__cta').forEach(a => {
    a.addEventListener('click', closeNav);
  });

  /* ---- Sticky header shadow ---- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (header) {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 20px rgba(0,0,0,.12)'
        : '0 2px 12px rgba(0,0,0,.06)';
    }
  }, { passive: true });

  /* ---- Smooth scroll for .scroll-to ---- */
  document.querySelectorAll('.scroll-to, a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeNav();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- Catalog filter ---- */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const catalogCards = document.querySelectorAll('#catalogGrid .card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      catalogCards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const cats = (card.dataset.category || '').split(' ');
          card.classList.toggle('hidden', !cats.includes(filter));
        }
      });
    });
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq__q').forEach(q => {
    q.addEventListener('click', () => {
      const item   = q.closest('.faq__item');
      const answer = item.querySelector('.faq__a');
      const isOpen = q.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq__q.open').forEach(openQ => {
        openQ.classList.remove('open');
        const a = openQ.closest('.faq__item').querySelector('.faq__a');
        slideUp(a);
      });

      if (!isOpen) {
        q.classList.add('open');
        slideDown(answer);
      }
    });
  });

  function slideDown(el) {
    el.style.display = 'block';
    el.style.overflow = 'hidden';
    const h = el.scrollHeight + 'px';
    el.style.maxHeight = '0';
    requestAnimationFrame(() => {
      el.style.transition = 'max-height .3s ease';
      el.style.maxHeight = h;
    });
    setTimeout(() => { el.style.overflow = ''; el.style.maxHeight = ''; }, 320);
  }

  function slideUp(el) {
    el.style.overflow = 'hidden';
    el.style.maxHeight = el.scrollHeight + 'px';
    requestAnimationFrame(() => {
      el.style.transition = 'max-height .25s ease';
      el.style.maxHeight = '0';
    });
    setTimeout(() => {
      el.style.display = 'none';
      el.style.maxHeight = '';
      el.style.overflow = '';
      el.style.transition = '';
    }, 260);
  }

  /* ---- Form: phone mask ---- */
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', e => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('8')) val = '7' + val.slice(1);
      if (!val.startsWith('7') && val.length > 0) val = '7' + val;
      val = val.slice(0, 11);

      let masked = '';
      if (val.length > 0) masked = '+7';
      if (val.length > 1) masked += ' (' + val.slice(1, 4);
      if (val.length > 4) masked += ') ' + val.slice(4, 7);
      if (val.length > 7) masked += '-' + val.slice(7, 9);
      if (val.length > 9) masked += '-' + val.slice(9, 11);

      e.target.value = masked;
    });
  });

  /* ---- Form submission ---- */
  function handleForm(formId, successId) {
    const form = document.getElementById(formId);
    const successEl = document.getElementById(successId);
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const phoneInput = form.querySelector('input[type="tel"]');
      const phoneVal   = (phoneInput?.value || '').replace(/\D/g, '');

      if (!phoneInput || phoneVal.length < 11) {
        phoneInput?.classList.add('error');
        phoneInput?.focus();
        phoneInput?.addEventListener('input', () => phoneInput.classList.remove('error'), { once: true });
        return;
      }

      // Simulate submit (replace with real endpoint)
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
      btn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        if (successEl) successEl.style.display = 'flex';
      }, 900);
    });
  }

  handleForm('heroForm', 'formSuccess');
  handleForm('orderForm', 'orderFormSuccess');

  /* ---- Fade-up on scroll ---- */
  const fadeEls = document.querySelectorAll('.adv-card, .step, .review-card, .card, .doc-item, .factor');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(el => {
      el.classList.add('fade-up');
      observer.observe(el);
    });
  } else {
    // Fallback: show all
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.header__nav a');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.header__nav a[href="#${id}"]`);
      if (link) {
        link.style.color = (scrollY >= top && scrollY < bottom) ? 'var(--primary)' : '';
        link.style.fontWeight = (scrollY >= top && scrollY < bottom) ? '700' : '';
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

});
