/* =========================================================
   VERTEXA DIGITAL AGENCY — main.js
   Vanilla JS (ES6+). No framework, no build step.
   Handles: header/footer injection, sticky nav shrink,
   mega menu, mobile drawer, scroll-reveal, testimonial
   carousel (with swipe), portfolio filter, FAQ accordion,
   form validation, scroll-to-top, stat counters.
   ========================================================= */

(function () {
  "use strict";

  /* ---- SVG icon snippets (inline, crisp at all sizes) ---- */
  const ICONS = {
    WD: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
    RS: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    SW: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>`,
    HS: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
  };

  /* ---------------------------------------------------------
     1. HEADER + FOOTER (shared partials, injected via JS so
        every page keeps one navbar/footer to maintain — no
        server-side include, works on any static host)
     --------------------------------------------------------- */
  const NAV_ITEMS = [
    { label: "Home",      href: "/index.html",     key: "home" },
    { label: "About",     href: "/about.html",      key: "about" },
    {
      label: "Services", href: "/services.html", key: "services",
      mega: [
        { title: "Website Development",    desc: "Custom sites built for every screen.",       href: "/services/website-development.html",    icon: "WD" },
        { title: "Website Revamp & SEO",   desc: "Modernize your site. Get found on Google.",  href: "/services/website-revamp-seo.html",     icon: "RS" },
        { title: "Scalable Web Development", desc: "Built to grow with your business.",        href: "/services/scalable-web-development.html", icon: "SW" },
        { title: "Hosting Solutions",      desc: "Fast, secure, available worldwide.",         href: "/services/hosting-solutions.html",       icon: "HS" },
      ],
    },
    { label: "Portfolio", href: "/portfolio.html",  key: "portfolio" },
    { label: "Pricing",   href: "/pricing.html",    key: "pricing" },
    { label: "Contact", href: "/contact.html", key: "contact" },
  ];

  function renderHeader() {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    const current = document.body.getAttribute("data-page") || "";

    const desktopLinks = NAV_ITEMS.map((item) => {
      const current_attr = item.key === current ? ' aria-current="page"' : "";
      if (item.mega) {
        const megaItems = item.mega.map((m) => `
          <a class="mega-item" href="${m.href}">
            <span class="mega-icon" aria-hidden="true">${ICONS[m.icon] || m.icon}</span>
            <span><h4>${m.title}</h4><p>${m.desc}</p></span>
          </a>`).join("");
        return `
          <li class="has-mega">
            <a href="${item.href}"${current_attr}>${item.label}</a>
            <div class="mega-panel">${megaItems}</div>
          </li>`;
      }
      return `<li><a href="${item.href}"${current_attr}>${item.label}</a></li>`;
    }).join("");

    const drawerLinks = NAV_ITEMS.map((item) => {
      if (item.mega) {
        const subLinks = item.mega.map((m) => `<a href="${m.href}">${m.title}</a>`).join("");
        return `
          <li>
            <button class="drawer-accordion-trigger" aria-expanded="false">
              ${item.label} <span class="chev" aria-hidden="true">&#9662;</span>
            </button>
            <div class="drawer-sub">${subLinks}</div>
          </li>`;
      }
      return `<li><a href="${item.href}">${item.label}</a></li>`;
    }).join("");

    mount.innerHTML = `
      <div class="navbar">
        <a href="/index.html" class="logo">
          <span class="logo-mark" aria-hidden="true">V</span>
          <span>Vertexa<small>Digital Agency</small></span>
        </a>
        <ul class="nav-links">${desktopLinks}</ul>
        <a href="/contact.html" class="btn btn-primary nav-cta">Get a Free Quote</a>
        <button id="theme-toggle" class="theme-toggle" aria-label="Switch to dark mode" aria-pressed="false" title="Toggle dark / light mode"></button>
        <button class="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-drawer">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="drawer-overlay" id="drawer-overlay"></div>
      <nav class="mobile-drawer" id="mobile-drawer" aria-label="Mobile navigation">
        <button class="drawer-close" aria-label="Close menu">&times;</button>
        <ul class="drawer-links">${drawerLinks}</ul>
        <div class="drawer-cta">
          <a href="/contact.html" class="btn btn-primary btn-block">Get a Free Quote</a>
        </div>
      </nav>
    `;

    initHeaderBehavior();
  }

  function initHeaderBehavior() {
    const header = document.querySelector(".site-header");
    const onScroll = () => {
      if (window.scrollY > 40) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const hamburger = document.querySelector(".hamburger");
    const drawer = document.getElementById("mobile-drawer");
    const overlay = document.getElementById("drawer-overlay");
    const closeBtn = document.querySelector(".drawer-close");

    function openDrawer() {
      drawer.classList.add("is-open");
      overlay.classList.add("is-open");
      hamburger.setAttribute("aria-expanded", "true");
      hamburger.setAttribute("aria-label", "Close menu");
      document.body.style.overflow = "hidden";
    }
    function closeDrawer() {
      drawer.classList.remove("is-open");
      overlay.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Open menu");
      document.body.style.overflow = "";
    }
    hamburger.addEventListener("click", () => {
      drawer.classList.contains("is-open") ? closeDrawer() : openDrawer();
    });
    closeBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
    drawer.querySelectorAll(".drawer-links > li > a").forEach((a) => a.addEventListener("click", closeDrawer));

    drawer.querySelectorAll(".drawer-accordion-trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        btn.nextElementSibling.classList.toggle("is-open", !open);
      });
    });
  }

  function renderFooter() {
    const mount = document.getElementById("site-footer");
    if (!mount) return;
    const year = new Date().getFullYear();
    mount.innerHTML = `
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <a href="/index.html" class="logo">
              <span class="logo-mark" aria-hidden="true">V</span>
              <span>Vertexa<small>Digital Agency</small></span>
            </a>
            <p>We design, build, revamp, and host websites that work perfectly on every screen &mdash; and are built to grow with your business.</p>
            <div class="social-row">
              <a href="#" aria-label="Vertexa on LinkedIn">in</a>
              <a href="#" aria-label="Vertexa on X">X</a>
              <a href="#" aria-label="Vertexa on Instagram">IG</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="/about.html">About</a></li>
              <li><a href="/careers.html">Careers</a></li>
              <li><a href="/blog.html">Blog</a></li>
              <li><a href="/contact.html">Contact</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="/services/website-development.html">Website Development</a></li>
              <li><a href="/services/website-revamp-seo.html">Website Revamp &amp; SEO</a></li>
              <li><a href="/services/scalable-web-development.html">Scalable Web Development</a></li>
              <li><a href="/services/hosting-solutions.html">Hosting Solutions</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Work</h4>
            <ul>
              <li><a href="/portfolio.html">Portfolio</a></li>
              <li><a href="/pricing.html">Pricing</a></li>
              <li><a href="/portfolio.html#testimonials">Testimonials</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${year} Vertexa Digital Agency. All rights reserved.</span>
          <div class="footer-legal">
            <a href="/privacy-policy.html">Privacy Policy</a>
            <a href="/terms.html">Terms of Service</a>
          </div>
        </div>
      </div>
    `;
  }

  /* ---------------------------------------------------------
     2. SCROLL REVEAL (native IntersectionObserver)
     --------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || items.length === 0) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------
     3. TESTIMONIAL CAROUSEL (with swipe + prev/next)
     --------------------------------------------------------- */
  function initCarousel() {
    const root = document.querySelector("[data-carousel]");
    if (!root) return;
    const track = root.querySelector(".carousel-slides");
    const slides = Array.from(root.querySelectorAll(".slide"));
    const controls = root.querySelector(".carousel-controls");
    let index = 0;
    let timer;

    /* Prev / Next arrow buttons */
    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-btn";
    prevBtn.setAttribute("aria-label", "Previous testimonial");
    prevBtn.innerHTML = `&#8592;`;
    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-btn";
    nextBtn.setAttribute("aria-label", "Next testimonial");
    nextBtn.innerHTML = `&#8594;`;

    /* Dot buttons */
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Show testimonial ${i + 1}`);
      dot.setAttribute("aria-current", i === 0 ? "true" : "false");
      dot.addEventListener("click", () => { goTo(i); stopAuto(); });
      controls.appendChild(dot);
    });

    controls.prepend(prevBtn);
    controls.appendChild(nextBtn);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      controls.querySelectorAll(".carousel-dot").forEach((d, di) => {
        d.setAttribute("aria-current", String(di === index));
      });
    }
    function prev() { goTo(index - 1); }
    function next() { goTo(index + 1); }

    prevBtn.addEventListener("click", () => { prev(); stopAuto(); });
    nextBtn.addEventListener("click", () => { next(); stopAuto(); });

    function startAuto() { timer = setInterval(next, 6000); }
    function stopAuto()  { clearInterval(timer); }

    root.addEventListener("mouseenter", stopAuto);
    root.addEventListener("mouseleave", startAuto);
    root.addEventListener("focusin",    stopAuto);
    root.addEventListener("focusout",   startAuto);

    /* Touch swipe */
    let touchStartX = 0;
    track.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend",   (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); stopAuto(); }
    }, { passive: true });

    goTo(0);
    startAuto();
  }

  /* ---------------------------------------------------------
     4. PORTFOLIO FILTER
     --------------------------------------------------------- */
  function initPortfolioFilter() {
    const bar = document.querySelector("[data-filter-bar]");
    if (!bar) return;
    const buttons = Array.from(bar.querySelectorAll(".filter-btn"));
    const cards = Array.from(document.querySelectorAll("[data-filter-card]"));

    function applyFilter(filter) {
      cards.forEach((card) => {
        const tags = card.getAttribute("data-filter-card").split(" ");
        const show = filter === "all" || tags.includes(filter);
        card.style.display = show ? "" : "none";
      });
    }
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        applyFilter(btn.getAttribute("data-filter"));
      });
    });
  }

  /* ---------------------------------------------------------
     5. FAQ ACCORDION
     --------------------------------------------------------- */
  function initFaq() {
    document.querySelectorAll(".faq-q").forEach((btn) => {
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        document.querySelectorAll(".faq-q").forEach((b) => b.setAttribute("aria-expanded", "false"));
        btn.setAttribute("aria-expanded", String(!open));
      });
    });
  }

  /* ---------------------------------------------------------
     6. FORM VALIDATION + SUBMISSION
     Client-side validation, then fetch() to a form endpoint.
     No application back end — swap FORM_ENDPOINT for a real
     static-form service (Formspree/Getform) or small
     serverless function URL before going live.
     --------------------------------------------------------- */
  const FORM_ENDPOINT = "https://example.com/api/form-handler"; // TODO: replace with live endpoint

  function validateField(field) {
    const input = field.querySelector("input, textarea, select");
    if (!input) return true;
    let valid = true;

    if (input.hasAttribute("required") && !input.value.trim()) valid = false;
    if (input.type === "email" && input.value.trim()) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(input.value.trim())) valid = false;
    }

    field.classList.toggle("has-error", !valid);
    return valid;
  }

  function initForms() {
    document.querySelectorAll("[data-validate-form]").forEach((form) => {
      const status = form.querySelector(".form-status");

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Honeypot spam check
        const honeypot = form.querySelector('input[name="company_website"]');
        if (honeypot && honeypot.value) return;

        const fields = Array.from(form.querySelectorAll(".field"));
        const allValid = fields.map(validateField).every(Boolean);

        if (!allValid) {
          status.textContent = "Please fill in the required fields correctly.";
          status.className = "form-status is-visible error";
          return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        try {
          const data = Object.fromEntries(new FormData(form).entries());
          // Front-end-only site: no application server, so the form
          // posts straight to a form-handling endpoint over fetch().
          await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }).catch(() => { /* demo endpoint — network error expected here */ });

          status.textContent = "Thanks — your message is in. We'll be in touch within one business day.";
          status.className = "form-status is-visible success";
          form.reset();
        } catch (err) {
          status.textContent = "Something went wrong sending that. Please try again or email us directly.";
          status.className = "form-status is-visible error";
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      });

      form.querySelectorAll(".field input, .field textarea, .field select").forEach((input) => {
        input.addEventListener("blur", () => validateField(input.closest(".field")));
      });
    });
  }

  /* ---------------------------------------------------------
     7. SCROLL-TO-TOP BUTTON
     --------------------------------------------------------- */
  function initScrollTop() {
    const btn = document.createElement("button");
    btn.className = "scroll-top";
    btn.setAttribute("aria-label", "Scroll to top");
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
    document.body.appendChild(btn);

    const onScroll = () => btn.classList.toggle("is-visible", window.scrollY > 400);
    document.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------------------------------------------------------
     8. ANIMATED STAT COUNTERS
     --------------------------------------------------------- */
  function initCounters() {
    const targets = document.querySelectorAll("[data-count]");
    if (!targets.length || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        const el  = entry.target;
        const end = parseFloat(el.getAttribute("data-count"));
        const suffix = el.getAttribute("data-suffix") || "";
        const dur = 1600;
        const start = performance.now();
        const isFloat = String(end).includes(".");
        (function step(now) {
          const progress = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = eased * end;
          el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.5 });

    targets.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     9. DARK / LIGHT MODE TOGGLE
     Persists to localStorage. Respects prefers-color-scheme.
     --------------------------------------------------------- */
  const MOON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const SUN_SVG  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

  function initTheme() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const html = document.documentElement;

    function applyTheme(theme) {
      html.setAttribute("data-theme", theme);
      localStorage.setItem("vx-theme", theme);
      const isDark = theme === "dark";
      btn.innerHTML = isDark ? SUN_SVG : MOON_SVG;
      btn.setAttribute("aria-label",  isDark ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("aria-pressed", String(isDark));
    }

    /* Set initial icon from already-applied theme (set by FOUC script in <head>) */
    const current = html.getAttribute("data-theme") || "light";
    btn.innerHTML = current === "dark" ? SUN_SVG : MOON_SVG;
    btn.setAttribute("aria-pressed", String(current === "dark"));
    btn.setAttribute("aria-label", current === "dark" ? "Switch to light mode" : "Switch to dark mode");

    btn.addEventListener("click", () => {
      const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });

    /* Sync with OS preference changes (when no manual preference is saved) */
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("vx-theme")) applyTheme(e.matches ? "dark" : "light");
    });
  }

  /* ---------------------------------------------------------
     INIT
     --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    initReveal();
    initCarousel();
    initPortfolioFilter();
    initFaq();
    initForms();
    initScrollTop();
    initCounters();
    initTheme();
  });
})();
