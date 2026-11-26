(() => {
  /* ------------------------------------------------------------------
     Microsoft Teams booking
     Paste your Microsoft Bookings public page URL below to show a direct
     "Book instantly on Teams" link beside the request form.
     Example: "https://outlook.office.com/bookwithme/user/abc123@example.com"
     Leave it empty to use the email request flow only.
     ------------------------------------------------------------------ */
  const TEAMS_BOOKING_URL = "";

  const header = document.getElementById('site-header');
  const root = document.documentElement;

  /* Header state */
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const menu = document.getElementById('menu');
  const openBtn = document.querySelector('[data-menu-open]');
  const closeBtn = document.querySelector('[data-menu-close]');

  if (menu && openBtn) {
    const openMenu = () => {
      menu.showModal();
      openBtn.setAttribute('aria-expanded', 'true');
      root.classList.add('menu-open');
    };

    const closeMenu = () => {
      if (menu.open) menu.close();
    };

    openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    menu.addEventListener('click', (event) => {
      if (event.target === menu) closeMenu();
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    menu.addEventListener('close', () => {
      openBtn.setAttribute('aria-expanded', 'false');
      root.classList.remove('menu-open');
      openBtn.focus();
    });
  }

  /* Scroll reveals */
  const revealItems = document.querySelectorAll('[data-reveal]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reducedMotion) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* Active section in the primary nav */
  const navLinks = Array.from(document.querySelectorAll('.primary-nav a'));
  const allSections = Array.from(document.querySelectorAll('main section[id]')).sort(
    (a, b) => a.offsetTop - b.offsetTop
  );

  if (allSections.length) {
    let ticking = false;

    const updateActive = () => {
      const marker = window.scrollY + window.innerHeight * 0.38;
      let current = '';
      allSections.forEach((section) => {
        if (section.offsetTop <= marker) current = section.id;
      });
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
      });
      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateActive);
      }
    };

    updateActive();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }

  /* Year */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ----------------------------------------------------------------
     Booking request form
     Static site: the form composes an email request and opens the
     visitor's mail app. Nothing is sent from the page itself.
     ---------------------------------------------------------------- */
  const form = document.getElementById('booking-form');
  if (form) {
    form.noValidate = true;

    const status = document.getElementById('form-status');
    const dateInput = document.getElementById('booking-date');
    const directLink = document.getElementById('teams-booking');
    const submitButton = form.querySelector('button[type="submit"]');
    let submitting = false;

    try {
      const nextField = document.createElement('input');
      nextField.type = 'hidden';
      nextField.name = '_next';
      nextField.value = new URL('thanks.html', window.location.href).href;
      form.appendChild(nextField);
    } catch (error) {
      /* leave FormSubmit's default confirmation page in place */
    }

    if (TEAMS_BOOKING_URL && directLink) {
      directLink.href = TEAMS_BOOKING_URL;
      directLink.hidden = false;
    }

    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const pad = (n) => String(n).padStart(2, '0');
      const iso = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;
      dateInput.min = iso;
    }

    const fields = {
      name: {
        input: form.querySelector('#booking-name'),
        error: form.querySelector('#booking-name-error'),
        message() {
          if (this.input.validity.valueMissing) return 'Enter your name.';
          if (this.input.validity.tooShort) return 'Use at least 2 characters.';
          return 'Check your name.';
        }
      },
      email: {
        input: form.querySelector('#booking-email'),
        error: form.querySelector('#booking-email-error'),
        message() {
          if (this.input.validity.valueMissing) return 'Enter your email address.';
          if (this.input.validity.typeMismatch) return 'Use an address like name@company.com.';
          return 'Check your email address.';
        }
      },
      date: {
        input: form.querySelector('#booking-date'),
        error: form.querySelector('#booking-date-error'),
        message() {
          if (this.input.validity.valueMissing) return 'Choose a preferred date.';
          if (this.input.validity.rangeUnderflow) return 'Choose a date from tomorrow onward.';
          return 'Check the date.';
        }
      },
      time: {
        input: form.querySelector('#booking-time'),
        error: form.querySelector('#booking-time-error'),
        message() {
          return this.input.validity.valueMissing ? 'Choose a time window.' : 'Check the time.';
        }
      }
    };

    const keys = Object.keys(fields);
    const touched = new Set();
    const summary = document.getElementById('form-errors');

    const paint = (key, invalid) => {
      const field = fields[key];
      const wrap = field.input.closest('.field');
      field.error.textContent = invalid ? field.message.call(field) : '';
      field.input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
      if (wrap) wrap.dataset.invalid = invalid ? 'true' : 'false';
    };

    const validate = (key) => {
      const ok = fields[key].input.checkValidity();
      paint(key, !ok);
      return ok;
    };

    const hideSummaryIfValid = () => {
      if (summary && !summary.hidden && keys.every((k) => fields[k].input.checkValidity())) {
        summary.hidden = true;
      }
    };

    keys.forEach((key) => {
      const input = fields[key].input;
      input.addEventListener('blur', () => {
        touched.add(key);
        validate(key);
      });
      input.addEventListener('input', () => {
        if (touched.has(key)) validate(key);
        hideSummaryIfValid();
      });
      input.addEventListener('change', () => {
        if (touched.has(key)) validate(key);
        hideSummaryIfValid();
      });
    });

    const showSummary = (invalidKeys) => {
      if (!summary) return;
      const list = summary.querySelector('ul');
      list.innerHTML = '';
      invalidKeys.forEach((key) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${fields[key].input.id}`;
        link.textContent = fields[key].message.call(fields[key]);
        item.appendChild(link);
        list.appendChild(item);
      });
      summary.hidden = false;
      summary.focus();
    };

    form.addEventListener('submit', (event) => {
      if (submitting) {
        event.preventDefault();
        return;
      }

      if (status) status.textContent = '';
      keys.forEach((key) => touched.add(key));

      const invalid = keys.filter((key) => !validate(key));

      if (invalid.length) {
        event.preventDefault();
        showSummary(invalid);
        return;
      }

      if (summary) summary.hidden = true;

      const data = new FormData(form);
      const session = String(data.get('session') || 'Intro call');
      const dateValue = String(data.get('date') || '');

      let readableDate = dateValue;
      if (dateValue) {
        const parsed = new Date(`${dateValue}T12:00:00`);
        if (!Number.isNaN(parsed.getTime())) {
          readableDate = parsed.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
        }
      }

      const subjectField = form.querySelector('[name="_subject"]');
      if (subjectField) subjectField.value = `Meeting request — ${session} — ${readableDate}`;

      submitting = true;
      if (submitButton) submitButton.textContent = 'Sending…';
      if (status) status.textContent = 'Sending your request…';
      window.setTimeout(() => {
        if (!submitting) return;
        submitting = false;
        if (submitButton) submitButton.textContent = 'Request this slot';
        if (status) {
          status.textContent = "That didn't send. Please email gthiru0104@gmail.com directly.";
        }
      }, 8000);
    });
  }
})();
