# Vertexa Digital Agency — Website

Plain **HTML, CSS, and vanilla JavaScript** build of the Vertexa Digital
Agency site, built from `Vertexa_Digital_Agency_Website_Spec.docx`
(Section 6 page specs, Section 7 service copy, Section 8 tech stack).

No framework, no build step, no application back end.

## Running it locally

Because the navbar/footer and internal links use root-absolute paths
(`/assets/...`, `/about.html`, etc.), open the site through a local
web server rather than double-clicking the HTML files (`file://` won't
resolve absolute paths correctly).

From this folder, run one of:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then visit `http://localhost:8000/index.html`.

Any static host (Netlify, Vercel static, GitHub Pages, S3 + CloudFront,
Azure Static Web Apps, etc.) serves this exactly the same way in
production — just deploy the folder as-is.

## Structure

```
index.html                          Home
about.html                          About Us
services.html                       Services overview (hub)
services/website-development.html   Service 1
services/website-revamp-seo.html    Service 2
services/scalable-web-development.html  Service 3
services/hosting-solutions.html     Service 4
portfolio.html                      Filterable case-study grid
pricing.html                        Packages + quote form + FAQ
contact.html                        Contact form
careers.html / blog.html            Footer utility pages
privacy-policy.html / terms.html    Legal pages
404.html                            Not-found page
assets/css/style.css                Whole design system (one file)
assets/js/main.js                   All interactivity (one file)
```

## How the shared navbar/footer work

Every page has empty mount points:

```html
<header class="site-header" id="site-header"></header>
...
<footer class="site-footer" id="site-footer"></footer>
```

`assets/js/main.js` injects the real markup into both on page load,
so the navbar and footer live in **one place** (`NAV_ITEMS` array and
`renderFooter()` in `main.js`) instead of being duplicated across 15
files. Add a nav link or footer link there and it updates everywhere.

Each `<body data-page="...">` tag sets which nav link gets
`aria-current="page"` — match the `key` values used in `NAV_ITEMS`.

## Forms

Forms (`pricing.html`, `contact.html`) validate client-side, then
`fetch()` a `FORM_ENDPOINT` constant defined near the top of
`initForms()` in `main.js`. There's no application server, so before
launch, point `FORM_ENDPOINT` at a real static-form service (e.g.
Formspree, Getform) or a small serverless function that emails/stores
submissions.

## What's left to plug in before launch

- **Google Fonts**: `<link>` tags for Sora/Inter are already in every
  `<head>` — just needs outbound internet access at build/serve time
  (already CDN-hosted, nothing to install).
- **Real photography/screenshots**: hero and portfolio visuals are
  CSS-drawn placeholder mockups (device frames, abstract content
  blocks) so the layout ships without stock imagery. Swap in real
  screenshots/photos where marked.
- **FORM_ENDPOINT** in `assets/js/main.js` (see above).
- Real social links, office address, and phone number in
  `contact.html` and `renderFooter()`.
- Domain-specific `<link rel="canonical">` / Open Graph URLs are set
  to `https://www.vertexa.agency/...` — update if the domain changes.

## Responsive testing

Every page was built mobile-first against the breakpoints from the
spec: 320–767px (mobile), 768–1023px (tablet), 1024–1439px (desktop),
1440px+ (large desktop). Test by resizing the browser or using dev
tools' device toolbar.
