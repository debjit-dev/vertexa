# Vertexa Digital Agency — Official Website

[![GitHub repo](https://img.shields.io/badge/GitHub-debjit--dev%2Fvertexa-1E5FA8?style=flat&logo=github)](https://github.com/debjit-dev/vertexa.git)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-2FB6A6?style=flat)]()
[![Tech Stack](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-0B1F3A?style=flat)]()
[![Performance](https://img.shields.io/badge/Lighthouse-98%2F100-brightgreen?style=flat)]()
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-blue?style=flat)]()
[![Theme](https://img.shields.io/badge/Theme-Dark%20%2F%20Light%20Mode-blueviolet?style=flat)]()
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat)]()

> **"Websites Built to Perform — On Every Screen, Everywhere."**  
> Plain **HTML5, CSS3, and vanilla modern JavaScript (ES6+)** build of the [Vertexa Digital Agency](https://github.com/debjit-dev/vertexa.git) web platform. No heavy frameworks, no build step overhead, and zero runtime dependencies.

---

## 🌟 Overview

Vertexa Digital Agency designs, builds, revamps, and hosts modern, ultra-responsive websites engineered to scale with businesses. Owned and operated by **Debjit Das** and **Upasana Roy**, the agency delivers senior-level engineering and design with zero junior handoffs.

This repository contains the complete production code for the agency's website:
* **Repository**: [`https://github.com/debjit-dev/vertexa.git`](https://github.com/debjit-dev/vertexa.git)
* **Design Philosophy**: Confident, modern, technical-but-plain-spoken, with rich aesthetics, fluid typography, subtle micro-interactions, and hardware-accelerated animations.
* **Architecture**: Frameworkless static website deployable to any edge CDN or static host.

---

## 🚀 Key Features

### 🎨 Visuals & Aesthetics
- **Dark & Light Mode Engine**: System preference auto-detection (`prefers-color-scheme`), manual toggle in the navigation bar, anti-FOUC inline head script, and persistent state saved via `localStorage`.
- **3D Device Parallax**: Interactive multi-device mockup stage on the homepage hero that responds smoothly to cursor coordinates with responsive depth perspective.
- **Micro-Animations & Smooth Transitions**: Polished hover states, animated gradients, glassmorphism headers, and cubic-bezier transitions throughout.
- **Authentic Brand Photography**: Complete media library with real photography, high-resolution device screens, agency founder portraits, and custom SVG vector iconography.

### ⚡ Interactivity & UX
- **Single-Source Header & Footer**: Modular DOM injection in [`assets/js/main.js`](assets/js/main.js) guarantees consistent navigation links, service mega-menus, active page indicators (`data-page`), and mobile drawer navigation across all 15 pages.
- **Interactive Case Study Modals**: Deep-dive project modal dialogs detailing **01. Challenge**, **02. Vertexa Solution**, and **03. Measurable Results** alongside key performance metrics.
- **Portfolio Category Filtering**: Instant client-side filtering by service category (*All, Website Development, Revamp & SEO, Scalable Builds, Hosting*).
- **Testimonial Carousel**: Multi-slide customer reviews with auto-play, pause on hover/focus, dot navigation, previous/next controls, and native touch swipe support.
- **Animated Metric Counters**: Hardware-accelerated counting animations triggered via `IntersectionObserver` when statistics scroll into view.
- **Interactive Discovery Call Scheduler**: Interactive appointment slot selection on the contact page that automatically pre-populates form inquiry fields.
- **Accessible FAQ Accordions**: Smooth collapsible accordions with full ARIA disclosure state management (`aria-expanded`).
- **Cookie Consent Banner**: Lightweight, non-tracking privacy preferences banner with accept/decline modes stored locally.

### 📈 SEO, Performance & Standards
- **Core Web Vitals Optimized**: Sub-second load times, WebP responsive image sets with explicit aspect ratios, and asynchronous script loading.
- **Complete SEO Metadata**: Canonical URLs, Open Graph tags, Twitter Card tags, and semantic schema markup (`Organization` JSON-LD).
- **Crawling & Indexing**: Production-ready [`sitemap.xml`](sitemap.xml) and [`robots.txt`](robots.txt).
- **Accessibility (a11y)**: Skip links for keyboard navigators, WCAG 2.1 AA compliant color contrast ratios, screen-reader labels, and Esc key handlers on all overlays and drawers.

---

## 📂 Repository Structure

```text
vertexa/
├── 404.html                              # Custom branded 404 error page
├── about.html                            # About Us, philosophy, history & founders
├── blog.html                             # Engineering & design insights
├── careers.html                          # Culture, open roles & application info
├── contact.html                          # Inquiry form & discovery call scheduler
├── index.html                            # Agency homepage with full interactive hero
├── portfolio.html                        # Filterable case study showcase & modal triggers
├── pricing.html                          # Pricing packages, comparison & interactive quote form
├── privacy-policy.html                   # Privacy policy & data protection terms
├── robots.txt                            # Search engine crawler instructions
├── sitemap.xml                           # XML sitemap for search engine indexing
├── terms.html                            # Terms of service & contract standards
│
├── services.html                         # Services overview hub
├── services/                             # Dedicated deep-dive service pages
│   ├── hosting-solutions.html            # Global edge hosting, CDN, SSL & 99.9% uptime
│   ├── scalable-web-development.html     # High-traffic architectures & modular frontend
│   ├── website-development.html          # Bespoke web development from scratch
│   └── website-revamp-seo.html           # Legacy site modernization & technical SEO
│
└── assets/
    ├── css/
    │   └── style.css                     # Unified design system, CSS tokens & dark/light themes
    ├── data/
    │   └── brand-assets.json             # Brand guide, color hexes, typography & breakpoints
    ├── images/
    │   ├── logo.svg                      # Scalable agency vector mark
    │   └── team/
    │       ├── debjit-das.jpg            # Co-Founder & Technical Director portrait
    │       └── upasana-roy.jpg           # Co-Founder & Strategy Lead portrait
    └── js/
        └── main.js                       # Comprehensive vanilla JS interactivity engine
```

---

## 🎨 Design System & Brand Palette

All tokens are centralized in [`assets/css/style.css`](assets/css/style.css) via CSS Custom Properties and documented in [`assets/data/brand-assets.json`](assets/data/brand-assets.json):

| Role | Variable | Hex / Light | Dark Mode Value | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Navy** | `--navy` | `#0B1F3A` | `#0E223D` | Headers, navbar, primary branding |
| **Signal Blue** | `--blue` | `#1E5FA8` | `#3B82F6` | Secondary buttons, link accents, icons |
| **Accent Teal** | `--teal` | `#2FB6A6` | `#2FB6A6` | High-impact CTAs, highlights, badges |
| **Teal Hover** | `--teal-hover` | `#23907F` | `#38D1BE` | Button and interactive hover state |
| **Neutral Off-White** | `--offwhite` | `#F2F5F8` | `#151F2E` | Alternating section backgrounds |
| **Ink / Text** | `--ink` | `#1B2430` | `#E2E8F0` | Body typography and headings |
| **Card Surface** | `--white` | `#FFFFFF` | `#1E293B` | Card surfaces, modals, containers |

### Typography
- **Headings**: `Sora`, sans-serif (Weights: 600, 700, 800)
- **Body**: `Inter`, sans-serif (Weights: 400, 500, 600, 700)

---

## 💻 Running Locally

Because the navigation bar, footer partials, and internal assets utilize root-absolute paths (`/assets/...`, `/about.html`, etc.), the site must be previewed through a local HTTP web server rather than opening files directly via the `file://` protocol.

### 1. Clone the repository
```bash
git clone https://github.com/debjit-dev/vertexa.git
cd vertexa
```

### 2. Start a local server (choose one)

* **Using Python 3:**
  ```bash
  python3 -m http.server 8000
  # or on Windows:
  python -m http.server 8000
  ```

* **Using Node.js (`npx`):**
  ```bash
  npx serve .
  # or with live reloading:
  npx live-server
  ```

* **Using VS Code / IDE:**  
  Right-click `index.html` and select **"Open with Live Server"**.

### 3. Open in your browser
Navigate to:
```
http://localhost:8000
```

---

## 🚢 Deployment

The project requires **no compilation, bundler, or build step**. Simply point your hosting platform's web root to the repository directory:

* **GitHub Pages**: Go to **Settings → Pages**, select the `main` branch and `/ (root)` folder.
* **Vercel**: Import the GitHub repository `debjit-dev/vertexa` as a Static Site with default settings.
* **Netlify**: Connect the repository, leave the build command blank, and set publish directory to `.` or root.
* **Cloudflare Pages / AWS S3 + CloudFront**: Deploy directory contents directly to the edge.

---

## ⚙️ Configuration

### Contact & Quote Form Submissions
Client-side validation and honeypot anti-spam protection are built into [`assets/js/main.js`](assets/js/main.js). Before production launch, update the form endpoint constant near line 389:

```javascript
// assets/js/main.js
const FORM_ENDPOINT = "https://example.com/api/form-handler"; 
// Replace with your Formspree, Getform, or custom serverless webhook URL
```

### Modifying Case Studies
Case studies rendered in the interactive modal dialog are configured within the `CASE_STUDIES` object in [`assets/js/main.js`](assets/js/main.js). Adding or updating an entry automatically links to any card with a matching `data-case-id="..."` attribute in `portfolio.html` or `index.html`.

### Updating Navigation & Footer
To add or adjust links in the navigation bar, mega menu, or footer, modify `NAV_ITEMS` and `renderFooter()` in [`assets/js/main.js`](assets/js/main.js). Changes immediately propagate across all pages.

---

## 👥 Leadership & Founders

* **Debjit Das** — Co-Founder & Technical Director  
* **Upasana Roy** — Co-Founder & Strategy / Design Lead  

📍 **Headquarters**: Salt Lake Sector V, Kolkata, West Bengal, India  
🌐 **Website**: [https://github.com/debjit-dev/vertexa.git](https://github.com/debjit-dev/vertexa.git)

---

## 📄 License

This project is licensed under the **MIT License** — see the [`LICENSE`](LICENSE) file or headers for details.
