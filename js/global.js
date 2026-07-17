 // Navbar scroll state
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 10); });

    // Mobile nav
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    navToggle.addEventListener('click', () => { navLinks.classList.toggle('open'); });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

    // Reveal on scroll
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));

    // Animated counters
    const counters = document.querySelectorAll('.stat-num');
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const dur = 1400; const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          cio.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));

    // Form submit (front-end only demo)
    const requestForm = document.getElementById('requestForm');
    requestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('formFields').style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
      // Same reasoning as above: swapping the form for the success
      // message changes this section's height, so recalculate trigger
      // positions for the fly button.
      requestAnimationFrame(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
    });

// modal-plaqiue //
    document.querySelectorAll('.certificate').forEach(cert => {
      cert.addEventListener('click', () => {
        const img = cert.querySelector('img');
        const lightbox = document.getElementById('certLightbox');
        const lightboxImg = document.getElementById('certLightboxImg');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('is-open');
      });
    });

    document.querySelector('.cert-lightbox__close').addEventListener('click', () => {
      document.getElementById('certLightbox').classList.remove('is-open');
    });

    document.getElementById('certLightbox').addEventListener('click', (e) => {
      if (e.target.id === 'certLightbox') {
        e.currentTarget.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.getElementById('certLightbox').classList.remove('is-open');
      }
    });