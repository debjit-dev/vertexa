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
            <p class="tagline-sub" style="color:var(--teal);font-weight:600;font-size:0.85rem;margin-top:0.35rem;margin-bottom:0.6rem;">"Building Digital Experiences That Scale."</p>
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
            <h4>Work &amp; Legal</h4>
            <ul>
              <li><a href="/portfolio.html">Portfolio &amp; Case Studies</a></li>
              <li><a href="/pricing.html">Pricing &amp; Packages</a></li>
              <li><a href="/privacy-policy.html">Privacy Policy</a></li>
              <li><a href="/terms.html">Terms of Service</a></li>
              <li><button type="button" class="footer-cookie-btn" id="open-cookie-banner">Cookie Preferences</button></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${year} Vertexa Digital Agency. All rights reserved. &bull; Salt Lake Sector V, Kolkata</span>
          <div class="footer-legal">
            <a href="/privacy-policy.html">Privacy Policy</a>
            <a href="/terms.html">Terms of Service</a>
          </div>
        </div>
      </div>
    `;
    const openCookieBtn = document.getElementById("open-cookie-banner");
    if (openCookieBtn) {
      openCookieBtn.addEventListener("click", () => {
        const b = document.getElementById("cookie-banner");
        if (b) b.classList.add("is-visible");
      });
    }
  }

  /* ---------------------------------------------------------
     2. SCROLL REVEAL (native IntersectionObserver)
     --------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal, .reveal-media");
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------
     2.1 DEVICE PARALLAX (Interactive 3D depth on mousemove)
     --------------------------------------------------------- */
  function initDeviceParallax() {
    const stage = document.querySelector(".device-stage");
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    stage.addEventListener("mousemove", (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      const desktop = stage.querySelector(".device.desktop");
      const tablet = stage.querySelector(".device.tablet");
      const mobile = stage.querySelector(".device.mobile");
      
      if (desktop) desktop.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
      if (tablet) tablet.style.transform = `translate(${x * 16}px, ${y * 16}px) rotate(-0.5deg)`;
      if (mobile) mobile.style.transform = `translate(${x * 24}px, ${y * 24}px) rotate(0.8deg)`;
    });
    
    stage.addEventListener("mouseleave", () => {
      const desktop = stage.querySelector(".device.desktop");
      const tablet = stage.querySelector(".device.tablet");
      const mobile = stage.querySelector(".device.mobile");
      if (desktop) desktop.style.transform = "";
      if (tablet) tablet.style.transform = "";
      if (mobile) mobile.style.transform = "";
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
     10. CASE STUDY MODAL DIALOG
     Displays Challenge -> Solution -> Result for projects
     --------------------------------------------------------- */
  const CASE_STUDIES = {
    "northbridge": {
      title: "Northbridge Furnishings",
      client: "Northbridge Furnishings",
      industry: "E-Commerce & Retail",
      service: "Website Revamp & SEO",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      tags: ["Revamp", "SEO", "E-Commerce"],
      challenge: "Their legacy catalog website broke on modern mobile devices, suffered from an unoptimized 4.2MB page weight, and experienced high bounce rates (74%) with declining regional search rankings.",
      solution: "Engineered a responsive-first redesign using clean HTML5 semantic structure, WebP responsive image sets with lazy loading, automated schema markup, and streamlined conversion paths.",
      result: "+58% organic traffic within 90 days post-launch, mobile bounce rate reduced to 29%, and Core Web Vitals score elevated to 98/100.",
      metrics: [
        { val: "+58%", label: "Organic Search Traffic" },
        { val: "0.9s", label: "Page Load Speed" },
        { val: "98/100", label: "Lighthouse Performance" }
      ]
    },
    "calder-vale": {
      title: "Calder & Vale Law",
      client: "Calder & Vale Law Partners",
      industry: "Legal Services",
      service: "Website Development",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      tags: ["Development", "Legal", "WCAG 2.1 AA"],
      challenge: "A fast-growing law firm needed a modern web presence that projected absolute authority and trust, rendered flawlessly across mobile screens, and made client inquiry effortless without bloated third-party plugins.",
      solution: "Crafted a bespoke, lightweight architecture with fluid clamp() typography, WCAG 2.1 AA accessible color contrast, client inquiry encryption, and zero render-blocking scripts.",
      result: "Achieved a flawless 100/100 mobile Lighthouse performance rating and generated 3.4x more consultation inquiries within the first 60 days.",
      metrics: [
        { val: "100/100", label: "Mobile Lighthouse" },
        { val: "3.4x", label: "Consultation Inquiries" },
        { val: "0.8s", label: "First Contentful Paint" }
      ]
    },
    "portside": {
      title: "Portside Analytics",
      client: "Portside Analytics",
      industry: "SaaS & Technology",
      service: "Scalable Web Development & Hosting",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
      tags: ["Scalable Build", "Hosting", "SaaS"],
      challenge: "Anticipating a major tech press feature, this B2B SaaS startup needed an unshakeable marketing site that would not falter under sudden, unpredictable global traffic surges.",
      solution: "Engineered a decoupled static frontend backed by multi-region edge CDN caching, instant DNS failover, and automated synthetic uptime monitoring.",
      result: "Effortlessly absorbed a 12x press-driven traffic spike with 100% uptime and a worldwide average time-to-first-byte (TTFB) of just 45 milliseconds.",
      metrics: [
        { val: "12x", label: "Traffic Spike Handled" },
        { val: "100%", label: "Uptime During Launch" },
        { val: "45ms", label: "Global Edge TTFB" }
      ]
    },
    "harlow-dental": {
      title: "Harlow Dental Group",
      client: "Harlow Dental Group",
      industry: "Healthcare & Clinics",
      service: "Website Revamp & SEO",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
      tags: ["Revamp", "Healthcare", "SEO"],
      challenge: "A multi-clinic practice was bogged down by bloated stock images and uncompressed assets, clocking a painful 4.1s mobile load time that hurt patient appointment bookings.",
      solution: "Rebuilt the front end with modern asset pipelines, implemented medical/local business schema JSON-LD, and simplified the direct online appointment reservation journey.",
      result: "Cut load times from 4.1s down to 1.3s and secured top-3 rankings in local Google Map packs for key dental queries, boosting online bookings by 42%.",
      metrics: [
        { val: "4.1s → 1.3s", label: "Load Time Reduction" },
        { val: "Top 3", label: "Google Map Pack" },
        { val: "+42%", label: "Appointment Inquiries" }
      ]
    },
    "almeida-studio": {
      title: "Almeida Studio",
      client: "Almeida Studio Architecture",
      industry: "Architecture & Design",
      service: "Website Development",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      tags: ["Development", "Design", "Fluid Grid"],
      challenge: "An interior design practice required a visually stunning digital portfolio that felt like an editorial magazine on retina displays without lagging on handheld phones.",
      solution: "Developed an adaptive layout with fluid CSS Grid, hardware-accelerated transitions, responsive image sets, and intuitive touch gestures.",
      result: "Shipped the complete site from discovery to launch in just 5 weeks; visitor average session duration increased by 68%.",
      metrics: [
        { val: "5 Weeks", label: "Delivery Timeline" },
        { val: "+68%", label: "Avg Session Duration" },
        { val: "100%", label: "Fluid Across Screens" }
      ]
    },
    "ferro-co": {
      title: "Ferro & Co. Logistics",
      client: "Ferro & Co. Logistics",
      industry: "B2B Logistics",
      service: "Scalable Web Development",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      tags: ["Scalable Build", "Logistics", "Modular"],
      challenge: "A regional B2B freight provider needed to expand from 8 basic pages to over 60 localized logistics hub pages without rewriting code or introducing maintenance chaos.",
      solution: "Created a component-based modular template architecture with reusable layout partials and design tokens.",
      result: "Successfully scaled to 60+ localized landing pages with zero performance degradation and uniform brand consistency across every route.",
      metrics: [
        { val: "8 → 60+", label: "Pages Scaled" },
        { val: "< 1.0s", label: "Average Page Load" },
        { val: "0", label: "Ground-up Rebuilds" }
      ]
    },
    "meridian-travel": {
      title: "Meridian Travel Co.",
      client: "Meridian Travel Co.",
      industry: "Hospitality & Travel",
      service: "Hosting Solutions",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      tags: ["Hosting", "Hospitality", "Global CDN"],
      challenge: "International travel shoppers across the Americas, Europe, and Asia suffered frequent booking checkout latency and slow page renders during peak vacation booking seasons.",
      solution: "Migrated their infrastructure to a high-speed global edge network with HTTP/3, Brotli compression, automated SSL, and 24/7 endpoint health checks.",
      result: "Sub-second response times achieved across four continents, ensuring continuous 99.99% booking availability throughout peak season.",
      metrics: [
        { val: "< 1s", label: "Across 4 Continents" },
        { val: "99.99%", label: "Observed Uptime" },
        { val: "100%", label: "Automated Edge SSL" }
      ]
    },
    "sable-finch": {
      title: "Sable & Finch Café",
      client: "Sable & Finch Artisan Café",
      industry: "Food & Hospitality",
      service: "Website Development & Revamp",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
      tags: ["Development", "Revamp", "Mobile First"],
      challenge: "Customers commuting to work were forced to download a 6MB PDF to view the breakfast menu on their phones, causing lost orders and frustration during rush hours.",
      solution: "Built a tap-friendly, lightning-fast mobile menu with daily rotating specials, one-tap directions, and direct click-to-call ordering.",
      result: "Mobile bounce rate dropped by 34%, while morning takeaway telephone orders jumped by 47% in the first four weeks.",
      metrics: [
        { val: "-34%", label: "Bounce Rate Reduction" },
        { val: "+47%", label: "Phone Orders Surge" },
        { val: "0.6s", label: "Menu Screen Load" }
      ]
    }
  };

  function initCaseStudyModal() {
    // Check if modal already exists or inject
    let overlay = document.getElementById("case-study-modal");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "case-study-modal";
      overlay.className = "modal-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-hidden", "true");
      overlay.innerHTML = `
        <div class="modal-dialog" id="modal-dialog-content">
          <button class="modal-close" aria-label="Close case study">&times;</button>
          <div id="modal-inner"></div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const closeBtn = overlay.querySelector(".modal-close");
    let lastActiveElement = null;

    function openModal(id) {
      const data = CASE_STUDIES[id];
      if (!data) return;
      lastActiveElement = document.activeElement;

      const inner = overlay.querySelector("#modal-inner");
      const tagsHtml = data.tags.map(t => `<span class="badge">${t}</span>`).join(" ");
      const metricsHtml = data.metrics.map(m => `
        <div>
          <strong>${m.val}</strong>
          <span>${m.label}</span>
        </div>
      `).join("");

      inner.innerHTML = `
        <div class="modal-hero-image">
          <img src="${data.image}" alt="${data.title}" loading="lazy">
          <div class="modal-hero-badge">${data.industry}</div>
        </div>
        <div class="modal-header">
          <div class="modal-tag-row">${tagsHtml}</div>
          <h2>${data.title}</h2>
          <div class="modal-meta">
            <span><strong>Client:</strong> ${data.client}</span>
            <span><strong>Industry:</strong> ${data.industry}</span>
            <span><strong>Service:</strong> ${data.service}</span>
          </div>
        </div>

        <div class="modal-metrics">${metricsHtml}</div>

        <div class="modal-narrative">
          <div class="modal-card">
            <h4>01. Challenge</h4>
            <p>${data.challenge}</p>
          </div>
          <div class="modal-card">
            <h4>02. Vertexa Solution</h4>
            <p>${data.solution}</p>
          </div>
          <div class="modal-card">
            <h4>03. Measurable Result</h4>
            <p>${data.result}</p>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-outline close-modal-action">Close Window</button>
          <a href="/contact.html?service=${encodeURIComponent(data.service)}" class="btn btn-primary">Start a Similar Project &rarr;</a>
        </div>
      `;

      overlay.classList.add("is-active");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();

      inner.querySelector(".close-modal-action").addEventListener("click", closeModal);
    }

    function closeModal() {
      overlay.classList.remove("is-active");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastActiveElement) lastActiveElement.focus();
    }

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("is-active")) {
        closeModal();
      }
    });

    // Attach click listeners to cards with data-case-id
    document.querySelectorAll("[data-case-id]").forEach(card => {
      card.addEventListener("click", (e) => {
        // don't trigger if clicked a link inside
        if (e.target.closest("a") && !e.target.closest(".portfolio-thumb")) return;
        const id = card.getAttribute("data-case-id");
        openModal(id);
      });
      // Allow enter key activation
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-haspopup", "dialog");
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(card.getAttribute("data-case-id"));
        }
      });
    });
  }

  /* ---------------------------------------------------------
     11. COOKIE CONSENT BANNER
     --------------------------------------------------------- */
  function initCookieBanner() {
    const consent = localStorage.getItem("vx-cookie-consent");
    let banner = document.getElementById("cookie-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "cookie-banner";
      banner.className = "cookie-banner";
      banner.setAttribute("role", "region");
      banner.setAttribute("aria-label", "Cookie Consent");
      banner.innerHTML = `
        <div>
          <h4>Privacy &amp; Cookie Preferences</h4>
          <p>We use lightweight, non-tracking cookies to remember your display preferences and guarantee lightning-fast performance across devices. No surveillance or third-party ad networks.</p>
        </div>
        <div class="cookie-actions">
          <button type="button" class="cookie-btn-accept" id="cookie-accept">Accept All</button>
          <button type="button" class="cookie-btn-decline" id="cookie-decline">Essential Only</button>
          <a href="/privacy-policy.html" style="color:var(--teal);font-size:0.84rem;text-decoration:underline;margin-left:auto;">Learn more</a>
        </div>
      `;
      document.body.appendChild(banner);
    }

    function saveChoice(type) {
      localStorage.setItem("vx-cookie-consent", type);
      banner.classList.remove("is-visible");
    }

    document.getElementById("cookie-accept")?.addEventListener("click", () => saveChoice("all"));
    document.getElementById("cookie-decline")?.addEventListener("click", () => saveChoice("essential"));

    if (!consent) {
      setTimeout(() => banner.classList.add("is-visible"), 1000);
    }
  }

  /* ---------------------------------------------------------
     12. DISCOVERY CALL SLOT SELECTOR (Contact Page)
     --------------------------------------------------------- */
  function initBookingSlots() {
    const slots = document.querySelectorAll(".slot-btn");
    const subjectInput = document.getElementById("c-subject");
    const messageInput = document.getElementById("c-message");

    slots.forEach(btn => {
      btn.addEventListener("click", () => {
        const wasSelected = btn.classList.contains("is-selected");
        slots.forEach(s => s.classList.remove("is-selected"));
        if (!wasSelected) {
          btn.classList.add("is-selected");
          const slotTime = btn.getAttribute("data-slot") || btn.textContent.trim();
          if (subjectInput && !subjectInput.value.includes("Discovery Call")) {
            subjectInput.value = `Discovery Call Request: ${slotTime}`;
          }
          if (messageInput && !messageInput.value.includes("Preferred Slot:")) {
            messageInput.value = (messageInput.value ? messageInput.value + "\n\n" : "") + `Preferred Slot: ${slotTime}`;
          }
        }
      });
    });
  }

  /* ---------------------------------------------------------
     13. SHOWCASE SLIDESHOW (Featured Work Slider)
     --------------------------------------------------------- */
  function initShowcaseSlider() {
    const slider = document.querySelector(".showcase-slider");
    if (!slider) return;
    const track = slider.querySelector(".showcase-track");
    const slides = Array.from(slider.querySelectorAll(".showcase-slide"));
    const prevBtn = slider.querySelector(".showcase-prev");
    const nextBtn = slider.querySelector(".showcase-next");
    const dotsContainer = slider.querySelector(".showcase-dots");
    if (!slides.length) return;

    let currentIndex = 0;
    let autoTimer = null;

    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "showcase-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => {
        goToSlide(i);
        restartAuto();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll(".showcase-dot"));

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((d, di) => {
        d.classList.toggle("is-active", di === currentIndex);
      });
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        restartAuto();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        restartAuto();
      });
    }

    function startAuto() {
      autoTimer = setInterval(nextSlide, 5000);
    }

    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
    }

    function restartAuto() {
      stopAuto();
      startAuto();
    }

    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);
    slider.addEventListener("focusin", stopAuto);
    slider.addEventListener("focusout", startAuto);

    let touchStartX = 0;
    slider.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener("touchend", (e) => {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diffX) > 45) {
        if (diffX < 0) nextSlide();
        else prevSlide();
        restartAuto();
      }
    }, { passive: true });

    goToSlide(0);
    startAuto();
  }

  /* ---------------------------------------------------------
     INIT
     --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    initReveal();
    initDeviceParallax();
    initCarousel();
    initPortfolioFilter();
    initCaseStudyModal();
    initFaq();
    initForms();
    initScrollTop();
    initCounters();
    initTheme();
    initCookieBanner();
    initBookingSlots();
    initShowcaseSlider();
  });
})();


