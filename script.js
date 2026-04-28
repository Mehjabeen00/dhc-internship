
(function () {
  'use strict';


  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('hm-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('hm-theme', next);
  });

 
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });


  const pages = {
    home: document.getElementById('page-home'),
    about: document.getElementById('page-about'),
    services: document.getElementById('page-services'),
    pricing: document.getElementById('page-pricing'),
    drivers: document.getElementById('page-drivers'),
    contact: document.getElementById('page-contact'),
  };

  let currentPage = 'home';

  function showPage(pageId) {
    if (!pages[pageId]) return;

    // Animate out
    const outPage = pages[currentPage];
    outPage.style.opacity = '0';
    outPage.style.transform = 'translateY(20px)';
    outPage.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

    setTimeout(() => {
      outPage.classList.add('hidden');
      outPage.style.opacity = '';
      outPage.style.transform = '';
      outPage.style.transition = '';

      const inPage = pages[pageId];
      inPage.classList.remove('hidden');
      inPage.style.opacity = '0';
      inPage.style.transform = 'translateY(20px)';
      inPage.style.transition = 'none';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          inPage.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          inPage.style.opacity = '1';
          inPage.style.transform = 'translateY(0)';
        });
      });

      currentPage = pageId;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
      });

      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');


      setTimeout(() => {
        triggerReveals();
        initCounters();
        initFAQs();
      }, 100);

    }, 250);
  }

  
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-page]');
    if (el) {
      e.preventDefault();
      const page = el.dataset.page;
      if (page && pages[page]) {
        showPage(page);
      }
    }


    const serviceCard = e.target.closest('.service-card');
    if (serviceCard && serviceCard.dataset.page) {
      showPage(serviceCard.dataset.page);
    }
  });


  function triggerReveals() {
    const reveals = document.querySelectorAll(`#page-${currentPage} .reveal:not(.visible)`);
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  let countersInitialized = new Set();

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const id = `${currentPage}-${el.dataset.count}`;
    if (countersInitialized.has(id)) return;
    countersInitialized.add(id);

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  function initCounters() {
    const page = document.getElementById(`page-${currentPage}`);
    if (!page) return;
    const counters = page.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

 
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideTimer;

  function goToSlide(n) {
    testimonials[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + testimonials.length) % testimonials.length;
    testimonials[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startAutoSlide() {
    slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  function resetAutoSlide() {
    clearInterval(slideTimer);
    startAutoSlide();
  }

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoSlide(); });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoSlide(); });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); resetAutoSlide(); });
  });

  startAutoSlide();

  function initFAQs() {
    const faqs = document.querySelectorAll('.faq-item');
    faqs.forEach(faq => {
      if (faq._faqInit) return;
      faq._faqInit = true;
      const btn = faq.querySelector('.faq-q');
      btn.addEventListener('click', () => {
        const wasOpen = faq.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
        if (!wasOpen) faq.classList.add('open');
      });
    });
  }

  const toast = document.getElementById('toast');

  function showToast(message) {
    toast.textContent = '✓ ' + message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  document.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.id === 'driverForm') {
      showToast('Registration submitted! A dispatcher will contact you within 2 hours.');
      form.reset();
    } else if (form.id === 'quoteForm') {
      showToast('Quote request sent! We\'ll be in touch within 2 business hours.');
      form.reset();
    }
  });


  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', function () {
      this.style.color = 'var(--text)';
    });
    link.addEventListener('mouseleave', function () {
      if (!this.classList.contains('active')) {
        this.style.color = '';
      }
    });
  });

  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.service-card, .pricing-card, .team-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const tiltX = ((y - centerY) / centerY) * 3;
        const tiltY = ((x - centerX) / centerX) * -3;
        card.style.transform = `translateY(-4px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
    });
  });

  document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.service-card, .pricing-card, .team-card').forEach(card => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('focus', function () {
      this.parentElement.style.transform = 'scale(1.01)';
      this.parentElement.style.transition = 'transform 0.2s ease';
    });
    el.addEventListener('blur', function () {
      this.parentElement.style.transform = '';
    });
  });

  document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.hero-glow');
    if (!glow) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 15;
    glow.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px)`;
  });

  const ticker = document.querySelector('.ticker');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
    ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
  }

  function setActiveNav(pageId) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
    });
  }

  function init() {
    triggerReveals();
    initCounters();
    initFAQs();
    setActiveNav('home');

    setTimeout(() => {
      document.querySelectorAll('#page-home .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 80);
      });
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('scroll', () => {
    const reveals = document.querySelectorAll(`#page-${currentPage} .reveal:not(.visible)`);
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });

    const counters = document.querySelectorAll(`#page-${currentPage} [data-count]`);
    counters.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        animateCounter(el);
      }
    });
  }, { passive: true });

})();