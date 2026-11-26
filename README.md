# Thiru — portfolio site

A single-page portfolio for **Thiru, Cloud Architect & Agentic AI Specialist**: light editorial design, AI-factory and agentic imagery, and a Microsoft Teams meeting-request flow.

No build step, no framework, no dependencies beyond Google Fonts.

---

## Files

```
index.html          The page
styles.css          Design tokens, layout, components
main.js             Navigation, reveals, active section, booking form
thanks.html         Confirmation page after a booking request
assets/             WebP images and SVG illustrations
  hero-ai-factory*.webp  hero: AI factory aisle (Pexels)
  quantum-chip*.webp     featured AI processor
  ai-factory.svg         contact: DGX Spark class
  portrait*.webp         profile photo
README.md
```

## Run locally

```powershell
python -m http.server 4173
```

Open <http://127.0.0.1:4173>. Opening `index.html` directly works too, but a local server gives correct image caching and font loading.

## Publish

### GitHub Pages

1. Push this folder to a repository (keep `index.html` at the repository root).
2. Repository → **Settings → Pages**.
3. **Source:** Deploy from a branch → **main** → **/ (root)** → Save.
4. The site appears at `https://<username>.github.io/<repository>/`.

All paths are relative, so the page also works from a project subpath.

### Netlify / Vercel / Cloudflare Pages

Drag the folder into Netlify Drop, or connect the repository. There is nothing to build — publish the directory as-is.

---

## Before you publish

### 1. Email address — configured

The site uses **gthiru0104@gmail.com**. It appears in:

- the mobile menu (`<div class="menu-foot">`)
- the contact section (`<a id="contact-email" class="contact-email" ...>`)

The booking form reads its recipient from `#contact-email`, so change that link if the address ever changes.

### 2. LinkedIn

Replace `https://www.linkedin.com/in/YOUR-LINKEDIN` in the contact links.

### 3. Meeting form — activate FormSubmit once

The form posts directly to **FormSubmit** (`formsubmit.co`), which emails each request to **gthiru0104@gmail.com** and redirects to `thanks.html`. No backend is required.

**One-time activation:** the first test submission has triggered a confirmation email. Open **gthiru0104@gmail.com** and click **Activate Form** (check spam if needed). FormSubmit holds submissions until the form is confirmed; after that, every request is delivered to the inbox.

To use another address, change the form `action` in `index.html` and the two `mailto:` links. FormSubmit processes the submission; nothing is stored on this site.

### 4. Microsoft Teams instant slots (optional)

The form sends a **meeting request**; you confirm with a Teams invite. To add instant self-serve slots:

1. In Microsoft 365, open **Bookings → Book with me** (or create a booking page) and publish a public page with your available times.
2. Copy the public booking URL.
3. Open `main.js` and set:

```js
const TEAMS_BOOKING_URL = "https://outlook.office.com/bookwithme/user/...";
```

4. A **“Book instantly on Teams”** link appears under the request button. Leave it empty to show only the request flow.

### 5. Certifications

Two certifications still need verification before publishing:

- Azure Solutions Architect Expert
- AWS Solutions Architect

Confirm the titles, or remove the rows from the Toolkit section.

### 6. Social preview (optional)

`og:image` currently points to `assets/quantum-chip.webp`. Some platforms require an absolute URL once hosted — change it to `https://your-domain/assets/quantum-chip.webp`.

---

## How the page is put together

**Structure:** hero → about (portrait, facts, figures) → selected work (featured model + project list) → experience → expertise → NSG framework (LangGraph loop, knowledge graph, intelligence layer, feedback) & reference architecture → toolkit & certifications → contact and Teams booking.

**Palette**

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F2EEE3` | page ground |
| `--paper-2` | `#E9E3D4` | work, framework, booking panel |
| `--ink` | `#171B15` | headlines, primary text |
| `--muted` | `#5A6152` | secondary text (5.5:1 on paper) |
| `--moss` | `#5E6C4B` | rules, process marks |
| `--rust` | `#A34E2C` | one accent: dot, links on hover, errors |

**Type:** Big Shoulders Display for poster caps and figures; Spectral for narrative, labels and UI. Two families, three weights.

**Motion:** one staged page-load reveal, gentle scroll fades, 150–250 ms state transitions. All motion is removed under `prefers-reduced-motion`.

**Accessibility:** skip link, semantic landmarks, one `h1`, visible focus rings, 44 px minimum controls, labelled form fields, inline errors plus an error summary, descriptive alt text, contrast checked to WCAG AA.

**Imagery:** the hero photograph is by **Brett Sayles** via [Pexels](https://www.pexels.com/photo/5408005/) (Pexels licence); the contact band is a custom vector illustration of a DGX-Spark-class system; the featured processor macro was generated for this site. The portrait was supplied by Thiru. Replace the hero photograph or the contact illustration with your own product photo whenever you have one.

---

## Notes

- The form's date field uses the browser's native date picker, so its display format follows the visitor's locale. Times are UK time.
- The booking form posts to FormSubmit and lands on `thanks.html` after success. The one-time FormSubmit activation email must be confirmed first.
- No analytics, cookies or third-party scripts beyond Google Fonts and the FormSubmit endpoint.
