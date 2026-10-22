# English pages audit — swaanelauwaert.com/en/

Source of truth for this audit is the local mirror only (the live site is unreachable from this machine):

- Rendered HTML: `mirror/raw/swaanelauwaert.com/en.html` (= `index.html`, byte-identical) and `mirror/raw/swaanelauwaert.com/en/<slug>/index.html`
- REST dump: `mirror/api/pages-p1.json` (35 pages, all languages)
- Local full-page renders (1440 px desktop / 390 px mobile, made from the mirrored HTML): `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/local-shots/en*.png`
- Mirror metadata: `mirror/meta/urls.txt`, `mirror/meta/headers_en_.txt`

All image paths below are relative to the repo root; the prefix `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/` is abbreviated as **`UP/`**. Pixel sizes were measured from the mirrored files with Pillow. Every image referenced by an English page exists locally (including all `srcset` variants) — no broken images.

Every page is `<html lang="en-GB">`, theme Twenty Twenty-Five (block theme), WordPress 7.1, Polylang. Every image on the English pages has an **empty `alt`** attribute (`alt=""`) — the rebuild has to write alt texts from scratch.

---

## 1. Inventory and cross-check (REST vs mirror vs navigation)

| WP id | slug | REST link | mirror file | title (REST) | template | menu_order | in main nav? | notes |
|---|---|---|---|---|---|---|---|---|
| 44 | `the-untamed-woman` | `/en/` | `en.html` (+ `index.html`) | **Swaane Lauwaert** | `page-no-title` | 0 | site title link, "Contact" (`/en/#contact`) | front page; featured_media 4155 |
| 4170 | `about` | `/en/about/` | `en/about/index.html` | **About me** | default | 0 | "About me" | featured_media 2030; `date` 2012-04-22 (very old post date) |
| 4242 | `work-with-me` | `/en/work-with-me/` | `en/work-with-me/index.html` | **Work With Me: 1:1 Somatic Coaching &amp; Bodywork** | default | 0 | "Work with me" (parent item) | modified 2026-10-10 (most recent EN page) |
| 70 | `rooted-rituals` | `/en/rooted-rituals/` | `en/rooted-rituals/index.html` | **Rooted Rituals \| Ceremonies &amp; Retreats** | default | 30 | submenu "Retreats" | |
| 66 | `the-eros-sanctuary-2` | `/en/the-eros-sanctuary-2/` | `en/body-untamed/index.html` **and** `en/the-eros-sanctuary-2/index.html` | **The Eros Sanctuary** | default | 0 | submenu "The Eros Sanctuary" → `/en/body-untamed/` | one page, two URLs — see §7 |
| 68 | `flavours-of-desire` | `/en/flavours-of-desire/` | `en/flavours-of-desire/index.html` | **Flavours of Desire** | default | 20 | submenu "Flavours of Desire" | |
| 5629 | `sainte-baume-guide` | `/en/sainte-baume-guide/` | `en/sainte-baume-guide/index.html` | **Sainte-Baume Guide** | default | 0 | submenu "Sainte-Baume Guide" | linked to NL `nl/sainte-baume-gids/` |
| 5633 | `guide-sainte-baume` | `/en/guide-sainte-baume/` | `en/guide-sainte-baume/index.html` | **Guide Sainte-Baume** | default | 0 | **not in nav** | near-duplicate of 5629 — see §7 |
| 4892 | `cookbook` | `/en/cookbook/` | `en/cookbook/index.html` | **Cookbook: The Taste of Her Journey** | default | 0 | "Cookbook" | |
| 48 | `the-journal` | `/en/the-journal/` | `en/the-journal/index.html` | **The Journal** | default (page is the *posts page*; rendered by the theme `home` template) | 90 | "The Journal" | zero English posts → "Sorry, nothing found yet." |
| 5530 | `werk-met-mij` | `/en/werk-met-mij/` | **not mirrored** | **Werk met mij** | default | 0 | not in nav | published but `content.rendered` is empty (0 bytes), not password-protected; Playwright run got HTTP 200 with title "Werk met mij – Swaane Lauwaert" and no text → empty page. Dutch title on the EN language. |
| 5247 | `module-1` | `/en/module-1/` | **not mirrored** | **The Eros Sanctuary Modules (English version):** | default | 0 | not in nav | `content.protected: true`, class `post-password-required` → password-protected course page; content not retrievable from the mirror |
| 5113 | `flavours-of-desire-modules-english` | `/en/flavours-of-desire-modules-english/` | **not mirrored** | **Flavours of Desire Modules English** | default | 0 | not in nav | `content.protected: true`, `post-password-required` → password-protected course page; content not retrievable |

`mirror/meta/urls.txt` lists all 13 English URLs (so the crawler knew about the three missing ones); no HTML was saved for `werk-met-mij`, `module-1`, `flavours-of-desire-modules-english`, and the Playwright extraction got HTTP 429 for the two protected ones. The English sitemap entries are absent from `mirror/meta/sitemap-urls.txt` (only non-`/en` entries were captured).

The REST slug of the front page is `the-untamed-woman` but Polylang serves it at `/en/`; the `<title>` is just "Swaane Lauwaert". Sub-pages use `<title>{Page title} – Swaane Lauwaert</title>` (en dash `&#8211;`).

### hreflang / translation links per English page (from `<link rel="alternate" hreflang>`)

| EN page | nl | fr |
|---|---|---|
| `/en/` | `/nl/` | `/fr/` (+ `x-default` → `/`) |
| `/en/about/` | `/nl/over-mij/` | `/fr/a-propos/` |
| `/en/work-with-me/` | `/nl/samenwerken/` | `/fr/accompagnement/` |
| `/en/rooted-rituals/` | `/nl/levende-rituelen/` | `/fr/rituels-dancrage/` |
| `/en/body-untamed/` (id 66) | `/nl/the-eros-sanctuary/` | `/fr/le-corps-libre/` |
| `/en/flavours-of-desire/` | `/nl/flavours-of-desire-3/` | `/fr/flavours-of-desire-2/` |
| `/en/sainte-baume-guide/` | `/nl/sainte-baume-gids/` | — (no FR) |
| `/en/guide-sainte-baume/` | — | — (EN only, no alternates at all) |
| `/en/cookbook/` | `/nl/kookboek/` | `/fr/livre-de-cuisine/` |
| `/en/the-journal/` | `/nl/journal/` | `/fr/le-journal/` |

The language switcher in the header uses exactly these targets (it only lists languages that have a translation; on `guide-sainte-baume` it shows "English" only, on `sainte-baume-guide` "English" + "Nederlands").

---

## 2. Shared chrome on every English page

(Documented in full in `docs/audit/chrome.md`; summarised here so this file is self-contained.)

### 2.1 Header (template part `header`)
- Outer `wp-block-group` **position: sticky, top 0, z-index 10**, `box-shadow: var(--wp--preset--shadow--natural)` = `0px 3px 6px 0 rgba(0,0,0,0.2)`.
- Inner group `alignfull`, background **base `#fff7e6`**, `has-global-padding`; row group `alignwide`, `justify-content: space-between`, nowrap, `padding-top/bottom: var(--wp--preset--spacing--30)` (20 px).
- Left: site title `<p class="has-x-large-font-size wp-block-site-title">` → `<a href="/en/">Swaane Lauwaert</a>` (Floreal, uppercase, weight 400, line-height 1.1).
- Right: `<nav aria-label="Menu EN">`, overlay type (hamburger "Open menu" below 600 px, overlay background base, text contrast, close button "Close menu"), items justified right, medium font size. Items in order, verbatim:
  1. **Work with me** → `/en/work-with-me/` — has submenu (opens on hover/click, toggle `aria-label="Work with me submenu"`):
     - **Retreats** → `/en/rooted-rituals/`
     - **The Eros Sanctuary** → `/en/body-untamed/`
     - **Flavours of Desire** → `/en/flavours-of-desire/`
     - **Sainte-Baume Guide** → `/en/sainte-baume-guide/`
  2. **Cookbook** → `/en/cookbook/`
  3. **About me** → `/en/about/`
  4. **The Journal** → `/en/the-journal/`
  5. **Contact** → `/en/#contact` (anchor on the home page)
  6. Language switcher **English** (flag icon) → `/en/` with submenu (`aria-label="Languages submenu"`): **Nederlands** (flag) → NL translation, **English** (flag) → self, **Français** (flag) → FR translation. On every *page* (home included) the flags are 16×11 base64 PNG `<img>`s; only on The Journal (rendered by the blog `home` template) they are inline SVG data URIs 18×12 inside a `--pll-flag-width:18px` span (two Polylang markup variants — pick one for the rebuild).
- Current page gets `current-menu-item` (and the parent "Work with me" gets `current-menu-ancestor`) — render shows no visible active styling.

### 2.2 Footer (template part `footer`)
- Group `padding-top/bottom: var(--wp--preset--spacing--70)`; inner `alignwide`:
  - `<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide" style="margin-bottom:36px">` (colour accent-6 `#19191933`)
  - spacer 20 px
  - row group `alignfull`, space-between, align flex-start:
    - `<h2 class="wp-block-site-title"><a href="/en/" rel="home">Swaane Lauwaert</a></h2>`
    - social links, `has-huge-icon-size`, `is-style-logos-only`, icon colour inline `#2c261e`: **Instagram** → `https://www.instagram.com/swaanelauwaert/`, **Facebook** → `https://www.facebook.com/swaane.lauwaert`
    - small italic (`font-style:italic;font-weight:400`) vertical group of two space-between rows: "**All Rights Reserved**" / "**© Swaane Lauwaert**" and "**Photography**" / "**Pinterest, Unsplash**"
- Rendered after `</footer>` on every page (not part of the theme; injected by the host): `<div id="network-info" style="padding:10px;background:#171717;color:#939393;font-size:14px;text-align:center">Site by <a href="https://phareo.eu" style="color:#ccc">Pharéo</a> | Hosted on <a href="https://status301.net/" style="color:#ccc">The Permanently Moving Network</a></div>` (hidden by a tiny inline script when the page is in an iframe). Decide whether to keep it — it is a hosting credit, not site content.

### 2.3 Design tokens used by the English pages (from the inlined global styles; full dump in `docs/audit/design-system.md`)
- Colours: `base #fff7e6` (page background), `contrast #191919` (links, buttons, section-5 bg), `accent-1 #FFFFFF`, `accent-2 #c60000` (link hover, red box on Work With Me), `accent-3 #000000` (headings, post titles, pullquote), `accent-4 #5F5F5F` (body text), `accent-5 #F1EEE9` (section-1 background), `accent-6 #19191933` (separators).
- Fonts: body **Literata** (serif, weight 300, medium size, letter-spacing −0.01em, line-height 1.6); headings h1–h6 and site title **Floreal** (custom font `wp-content/uploads/sites/50/fonts/floreal.woff`, weight 400, letter-spacing −0.02em, line-height 1.02, colour accent-3); buttons and pullquotes **Beiruti** (variable woff2 in the theme).
- Sizes: small 0.9rem; medium clamp(1rem…1.2rem); large clamp(1.6…1.8rem); x-large clamp(1.8…2.2rem) = h2; xx-large clamp(2…2.8rem); h3 = large; h4 = medium uppercase.
- Spacing presets: 20=10px, 30=20px, 40=30px, 50=clamp(30px,5vw,50px), 60=clamp(30px,7vw,70px), 70=clamp(50px,7vw,90px), 80=clamp(70px,10vw,140px). Content width 960 px, wide 1340 px, root side padding = spacing-50.
- Buttons (`.wp-block-button__link`): background contrast `#191919`, text accent-1 white, Beiruti, medium size, padding 0.6rem 1.6rem, no border, box-shadow natural, pill radius (theme default); hover: 85 % contrast + text base. Section style `is-style-section-1` = bg accent-5 / text contrast; `is-style-section-5` = bg contrast / text base; `is-style-text-subtitle` = font-size clamp(1.5rem…1.75rem), line-height 1.2.
- Links in content: colour contrast `#191919`, hover accent-2 red with no underline. Quote block default: 2 px left border currentColor, padding 20/30 px, medium 300. Pullquote: Beiruti xx-large 500, line-height 1, accent-3, centred.

---

## 3. Page: English home `/en/` (id 44)

- Mirror file: `mirror/raw/swaanelauwaert.com/en.html` (identical copy at `index.html`). Template `page-no-title` (title hidden by the template, but the page content itself contains a Post Title block inside the cover, so the h1 is rendered there). Body classes `home page-id-44`.
- Nav: reached from the site title (header + footer) and from the language switcher; the "Contact" nav item points to `/en/#contact` on this page.
- Meta description (auto-generated from content): "1. Coaching, Bodywork &amp; Intimacy: Sometimes, daily rush…". `og:image` = the hero image below. Featured image = media id 4155 (used by the cover).
- Renders: `local-shots/en--desktop.png` (1440×5031), `local-shots/en--mobile.png` (390×5335).

Blocks top → bottom inside `<main id="wp--skip-link--target" class="is-layout-flow" style="margin-top:0">` › `post-content has-global-padding is-layout-constrained`:

1. **Cover** — `alignfull`, **parallax** (`has-parallax` → `background-attachment: fixed`), `has-custom-content-position is-position-bottom-center`, text colour **accent-1 white** (`has-accent-1-color`, link colour accent-1 via `.wp-elements-1`), `padding: var(--wp--preset--spacing--50)` on all four sides, `min-height: 80.4vh`, `margin-top:0;margin-bottom:0`. Background = featured image (`wp-image-4155`) `UP/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` — **1280×577 px, 154 KB, landscape pomegranate close-up** (an edited/cropped upload, hence the `-e1768508723726` suffix), `background-position: 50% 50%`. Overlay: `has-contrast-background-color has-background-dim-0` → overlay opacity 0, i.e. none. Inner container is `is-layout-constrained`, so the "bottom-center" content actually sits bottom-**left** of the 960 px content column (confirmed in render: white title at the lower left, ≈ y 80 % of the cover).
   - `<h1 class="wp-block-post-title has-xx-large-font-size has-accent-1-color" style="font-style:normal;font-weight:700">` **"Swaane Lauwaert"** (Floreal; note the inline bold 700 although Floreal only ships a 400 weight → faux-bold in browsers).
   - Desktop capture: cover ≈ 720 px tall at 1440 px wide (80.4 vh of the capture viewport); mobile: image crop centred, title bottom-left.
2. **Spacer** `height: var(--wp--preset--spacing--50)`.
3. **Heading h2** (`<strong>`): **"1. Coaching, Bodywork & Intimacy:"**
4. **Paragraph**: 1:1 sessions blend body-oriented coaching, somatic bodywork and nervous-system regulation when rush/old patterns/tension disconnect you from your centre.
5. **Paragraph**: a safe non-judgemental space to land in your body; specialises in desire, intimacy, female sexuality but that is never a requirement — whatever you are navigating is the starting point.
6. **Paragraph** (`<strong>` link): **"[Discover 1-op-1 coaching →]"** → `https://swaanelauwaert.com/nl/samenwerken/` (mirror: `nl/samenwerken/index.html`). **Bug on the live site: links to the Dutch page, and the label mixes Dutch ("1-op-1"). Should be `/en/work-with-me/`.**
7. **Heading h2** — empty (`<h2 class="wp-block-heading"></h2>`), renders as blank space.
8. **Separator** (`has-alpha-channel-opacity`, default style, full content width).
9. **Heading h2**: **"2. Mary Magdalena retreat South of France 2027 :"** (the `<strong>` wraps "2. Mary Magdalena retreat South of France 2027"; the trailing " :" is plain).
10. **Paragraph**: immersive sanctuary under the southern French sun; weaves the Sainte-Baume forest and Mary Magdalene energy; somatic bodywork, nervous-system rest, shared meals, mindful walks; no rushing or crowded schedules.
11. **Paragraph** (`<strong>` link): **"[Stay tuned →]"** → `https://swaanelauwaert.myflodesk.com/e5hyhsn3of` (Flodesk form, same tab).
12. **Separator**.
13. **Heading h2**: **"3. Cookbook & Mary Magdalene: The Taste of HER Journey :"**
14. **Paragraph**: written for the intuitive cook, seeker and storyteller; a meal is memories, rituals, connection to the earth and love; debut book *The Taste of Her Journey* (`<em>`) invites you into her kitchen and the land of Mary Magdalene.
15. **Paragraph** (`<strong>`): **"Discover the book & order your copy →]"** — link text **"Discover the book & order your copy"** → `https://books2read.com/u/4DwK0r`; the " →]" is outside the link and the opening "[" is missing (typo on the live site).
16. **Separator**.
17. **Image** `is-resized` (`wp-image-5565`): `UP/2026/08/MVIMG_20260817_163022_1-768x1024.jpg` — 768×1024 displayed at `width:768px;height:auto;aspect-ratio:0.75`, **left-aligned** in the content column (not centred), `fetchpriority="high"`. Portrait of Swaane in a blue blouse under a tree. srcset: `-225x300.jpg`, `-1152x1536.jpg`, `-1536x2048.jpg`, `-scaled.jpg` (1920×2560). alt "".
18. **Heading h4** — empty.
19. **Separator**.
20. **Group** `alignfull is-style-section-1` (background **accent-5 `#F1EEE9`**, text contrast), `margin:0`, `padding-top:0;padding-bottom:0`, constrained:
    1. Spacer `spacing-50`.
    2. **Pullquote** (default style, centred, Beiruti xx-large, black): **"Are you ready to trade the numbness for the nectar?"** (no cite).
    3. **Buttons** centred: **"Yes! Keep me posted please!"** → `https://swaanelauwaert.myflodesk.com/v3jg55lt2s`, `target="_blank"` (link has class `has-text-align-left`).
    4. Spacer `spacing-50`.
    5. **Gallery** (`has-nested-images columns-default is-cropped` → 3 equal columns, images cropped to the same height), 3 images, all alt "":
       - `wp-image-5572` `UP/2026/08/IMG-20260404-WA0004.jpg` 539×719 (Swaane cooking at a stone kitchen) — srcset `-225x300.jpg`
       - `wp-image-5573` `UP/2026/08/IMG_5348-768x1024.jpeg` 768×1024 (red/blue dress in a field) — srcset `-225x300`, `-1152x1536`, full `IMG_5348.jpeg` 1536×2048
       - `wp-image-5574` `UP/2026/08/MVIMG_20260817_163746-EDIT-893x1024.jpg` 893×1024, `loading="lazy"` — srcset `-262x300`, `-768x880`, `-1340x1536`, `-1787x2048`
       - Desktop render shows only the first two tiles (the third is lazy-loaded and was not painted by the headless capture); on the live site it is a 3-tile row.
21. **Group** `alignfull is-style-section-1` **`id="contact"`** (same `#F1EEE9` background, so sections 20 and 21 read as one continuous grey band), `padding-top/bottom: var(--wp--preset--spacing--70)`:
    1. **Heading h2** `has-text-align-left is-style-default`: **"Do you have a question?<br>Feel free to reach out."** (explicit line break).
    2. **Jetpack contact form** (`#contact-form-44`, hash `11ce59a1dcbd2f3644924ffa8239b06474a3ea1a`, `is-style-outlined` = notched-outline fields, layout flex, small font size, `border-style:solid`), `<form method="post" action="https://swaanelauwaert.com/en">`:
       - Name — `<input type="text" name="g44-name" id="g44-name" required>` label **"Name (required)"**
       - Email — `<input type="email" name="g44-email" required>` label **"Email (required)"**
       - Message — `<textarea name="g44-message" rows="20">` label **"Message"**
       - Submit `<button type="submit" class="wp-block-button__link is-style-outline">` **"Send"** (with spinner + visually-hidden "Submitting form")
       - Hidden inputs: `jetpack_contact_form_jwt` (JWT with the encrypted field config), `jetpack_form_fill_duration`, `contact-form-id=44`, `action=grunion-contact-form`, `contact-form-hash`; honeypot `<p style="display:none !important">Δ</p>`.
       - Hidden success template: link **"← Back"** → `/en/`, heading **"Uw bericht is verzonden"** (Dutch "Your message has been sent" on the English page — untranslated string).
       - Interactive: Jetpack Interactivity API validation (`data-wp-*` bindings, inline error containers per field). **Needs a static-site replacement (form backend).**
    3. Render: labels float inside the outlined inputs; "Send" is an outline pill at the left.
22. **Spacer** `spacing-40`.
23. **Group** `id="liability"`, `is-style-default has-small-font-size`, constrained (cream background again):
    1. Paragraph `<strong>`**"Liability Statement:"**
    2. Paragraph: "Swaane Lauwaert is not a professional mental health provider or medical professional. The services offered are not a substitute for professional mental health care or medical care and are not intended to diagnose, treat, or cure mental or medical conditions."
    3. Paragraph: "Swaane Lauwaert, 511 Boulevard des Musiciens, 83860 Nans-les-Pins. France. Email: info@swaanelauwaert.com Téléphone:+33 789 06 32 01" (plain text, not linked).
24. **Spacer** `spacing-40`.

Then footer + credit bar. No embeds/iframes/videos on the home page.

---

## 4. Page: About me `/en/about/` (id 4170)

- Mirror file: `mirror/raw/swaanelauwaert.com/en/about/index.html`. Default page template (`main` constrained, `margin-top: spacing-60`; inner group `alignfull`, `padding-top/bottom: spacing-60`). Nav item **"About me"**.
- Meta description: "SWAANE LAUWAERT (°1977 Belgium) I am a Facilitator of Transformation…". `og:image` = featured image (jpeg original).
- Renders: `local-shots/en-about--desktop.png` (1440×2911), `en-about--mobile.png`.

Blocks:

1. **Post Featured Image** (`figure.wp-block-post-featured-image`, `margin-bottom: spacing-60`, `object-fit: cover`, `fetchpriority="high"`): media id 2030, served as **WebP** `UP/2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg.webp` — 957×960 (near-square), only 16 KB (low quality). srcset `-150x150`, `-300x300`, `-768x770` `.jpeg.webp`. Portrait of Swaane with hair bun against a white wall. Rendered at full content width (960 px) above the title.
2. **Post Title h1**: **"About me"**.
3. **Post content** (`alignfull has-global-padding is-layout-constrained`):
   1. Paragraph: **"SWAANE LAUWAERT (°1977 Belgium)"**
   2. Paragraph: "I am a **Facilitator of Transformation**." (strong)
   3. Paragraph: "In my work as a **Body Therapist and Intimacy & Sex Coach**, I hold space for the deep integration of soul and skin."
   4. Paragraph: LOVE is the pulse that makes us human (strong); healing the world begins with healing our relationship to the body; "**because a body that feels safe, is a body that can love.**" (strong).
   5. Paragraph: lives in the shadow of the Sainte-Baume mountains; "**I lead retreats**" in the footsteps of Mary Magdalene.
   6. Paragraph: as a **writer** and professional **chef** (both strong) — words and the kitchen as sensory ritual.
   7. Paragraph: mission — shed the armour of shame and survival, back to the sanctuary of your body, from freeze into the fire of your untamed self.
   8. **Buttons** (left): **"Let’s meet!"** → `https://calendly.com/swaanelauwaert/let-s-meet`, `target="_blank"`.
   9. **Separator**.
   10. **Heading h2**: **"Trainings:"**
   11. **Separator**.
   12. **List** (unordered, 12 items, year in `<strong>`):
       - **2025-2026**: Layla Martin, Sex, Love and Relationship Coaching Certification
       - **2025:** Valley orgasm, online training
       - **2024-2025**: Rosie Chehade. Quantum School of Sacred Alchemy for Advanced Quantum Coach Certification. In combination with NLP and Matrix Therapies with Shereen Lister.
       - **2025**: Breathwork 2-day deep dive (Jessy Bettio, Antwerp)
       - **2024**: Soundhealing: workshop Marseille
       - **2024**: Wim Hof: online training
       - **2023**: Innerdance Facilitator Training (Antonia Hauterville & Katie Holland, Paris)
       - **2022**: Innerdance Intensive (Pi Vilerazza)
       - **2021**: Elliott Saxby Kundalini Online Bodycourse
       - **2020**: Reiki Level 1 (Marie-Ange Aubert, Centre Alter Ego, La Seyne-sur-Mer)
       - **2015**: Transcendental Meditation, Antwerp
       - **2001:** Family Sciences graduate, Brussels

No other images, embeds or interactive elements.

---

## 5. Page: Work With Me `/en/work-with-me/` (id 4242)

- Mirror file: `mirror/raw/swaanelauwaert.com/en/work-with-me/index.html`. Default template. Nav: top-level item **"Work with me"** (the parent of the submenu). Modified 2026-10-10.
- Meta description: "We don’t heal alone, we heal together. Join us! Where words bring clarity…". `og:image` = the PNG portrait below.
- Renders: `local-shots/en-work-with-me--desktop.png` (1440×2622), `en-work-with-me--mobile.png` (390×5053).

Blocks:

1. **Post Title h1**: **"Work With Me: 1:1 Somatic Coaching & Bodywork"** (centred-looking because it sits at the left of the 960 px column with large margin — actually left-aligned).
2. **Cover** `alignfull`, `has-custom-content-position is-position-bottom-center`, padding `spacing-50` on all sides, **`min-height: 840px`**, `margin:0`, no text-colour class → default cover text **white**. Background is an `<img class="wp-block-cover__image-background wp-image-5578 size-large">` (not parallax): `UP/2026/08/DSC03534-1024x683.jpg` — 1024×683 landscape, `fetchpriority="high"`, srcset `-300x200`, `-768x512`, `-1536x1024`, `-2048x1365` (2048×1365 available). Photo: Swaane in a blue blouse at a table with a laptop and pink peonies. Overlay `has-background-dim-10` (black 10 %). Inner group `alignwide`, justified left:
   - **Heading h2** `has-text-align-left has-xx-large-font-size`: **"We don’t heal alone, we heal together."** (white Floreal, bottom-left of the cover)
   - Paragraph (empty)
   - **Buttons**: **"Join us!"** → `https://swaanelauwaert.myflodesk.com/v3jg55lt2s`, `target="_blank"`.
   - Mobile: cover keeps 840 px height; the image is cropped to the left half (face partly cut), text at the bottom.
3. **Group** `alignfull is-style-section-5` **but** with explicit `has-base-background-color` (so it renders **cream `#fff7e6`**, not the section-5 dark), `margin:0`, `padding-top/bottom: spacing-50`:
   1. **Columns** `alignwide`, `flex-wrap: nowrap`, `gap: spacing-60 spacing-80`, **text colour accent-3 black, background accent-2 `#c60000` (solid red box)**, link colour accent-3:
      - Column 50 %, vertically centred:
        - **Heading h2**: **"Where words bring clarity, and the body finds its voice."**
        - Paragraph `has-medium-font-size` (empty)
        - Paragraph: **"One 60-minute session: €75"**
        - Paragraph: in 1:1 sessions we talk, untangle and map out what's going on; the conversation brings awareness, grounding, safety.
        - Paragraph: we usually already know where things pinch; the real shift happens when the body speaks.
        - Paragraph: we drop from words into felt sensation — somatic practice, breath, presence, bodywork; the body releases old baggage and becomes a safe, vibrant home.
        - Paragraph: every 1:1 journey is tailored; always starts with a **free introductory call**.
        - Paragraph `has-medium-font-size` `<em>`: **"(Photos by Louise van Gent)"**
      - Column 50 %, vertically centred: **Image** `size-full wp-image-5733` `UP/2026/10/Screenshot-2026-10-10-105756.png` — PNG 515×659 (302 KB) displayed with `aspect-ratio:1; object-fit:cover` (square crop), srcset `-234x300.png`. Black-and-white portrait, hand on chin. (Consider converting to JPEG/WebP.)
      - Render: red block spans the wide (1340 px) width with the black text on red. On mobile the columns stack: the text column first, then the photo (in the 390 px capture the photo shows only as ≈390 px of empty red below "(Photos by Louise van Gent)" — the PNG was not painted — on the live site the square portrait sits there).
   2. **Buttons** (left, directly under the red box, inside the cream group): **"Let’s meet!"** → `https://calendly.com/swaanelauwaert/let-s-meet`, `target="_blank"`.
4. **Group** `alignfull` `margin:0` → **Group** `alignwide` **grid** (`grid-template-columns: repeat(auto-fill, minmax(min(26rem,100%),1fr))`, gap spacing-50, `padding-top/bottom: spacing-50`) → one **empty** vertical group. Renders as ~250 px of blank space before the footer (leftover of a removed block; can be dropped).
5. Paragraph (empty).

---

## 6. Page: Rooted Rituals `/en/rooted-rituals/` (id 70)

- Mirror file: `mirror/raw/swaanelauwaert.com/en/rooted-rituals/index.html`. Default template. Nav: submenu item **"Retreats"** under "Work with me". `menu_order` 30.
- Meta description: "The Power of Rituals &amp; Ceremonies To me, a ritual or a ceremony is never just a gesture…". `og:image` = `b40ec7271d…` (Retreats column image).
- Renders: `local-shots/en-rooted-rituals--desktop.png` (1440×5287 — the longest EN page), `en-rooted-rituals--mobile.png`.

Blocks:

1. **Post Title h1**: **"Rooted Rituals | Ceremonies & Retreats"**
2. **Group** `alignfull`, `min-height:0vh`, `margin:0`, `padding: spacing-70 spacing-40` (top/bottom 70, left/right 40), constrained:
   1. Inner **Group** constrained (children spaced `spacing-40`):
      1. **Heading h2** `has-text-align-center`: **"The Power of Rituals & Ceremonies"**
      2. Paragraph `has-text-align-left`: a ritual/ceremony is an anchor grounding nature's rhythm and life's changes into the nervous system.
      3. Paragraph `has-text-align-left`: we have lost the art of marking transitions (grief→rebirth, girlhood→motherhood, silence→truth) and keep going disconnected.
      4. Paragraph: rituals are vital for the collective soul and belonging, yet also a private sanctuary to reconnect with your own rhythm.
      5. Paragraph: she weaves these practices into 1:1 sessions, online programmes and retreats.
      6. **Image** `size-large wp-image-4425` `UP/2026/02/5eaaabe9572dec3fc263928e634ab651-1024x968.jpg` — 1024×968 (full `….jpg` 1199×1134), `fetchpriority="high"`; srcset `-300x284`, `-768x726`, full. B/W photo: hands arranging a circle of pebbles, flowers and a bowl of water. Displayed at content width.
      7. **Separator**.
      8. **Heading h2** centred: **"Retreats"**
      9. Paragraph: retreats are "**sacred initiations**" (strong), in Provence or hidden sanctuaries across the globe, anchoring healing in the body.
      10. **Image** `alignfull size-full wp-image-4440` `UP/2026/02/7d90fcb7bef2e3cc0b08a81a8c2a8586.jpg` — 1199×902; srcset `-300x226`, `-768x578`, `-1024x770`. B/W photo of four women dancing on a pebble beach. (Because it is `alignfull` inside a *nested* constrained group it only fills the content column, same width as the image above — confirmed in render.)
   2. **Separator**.
3. **Group** `alignfull`, same padding as block 2:
   1. Inner group:
      1. **Heading h2** centred: **"The Magdalene Path"**
      2. Paragraph: Sainte-Baume paths in the shadow of "**Mary Magdalene’s sacred cave**" (strong); ceremony and somatic alchemy; "Come home to the mountain, honor your sacred fire, and embody the Priestess within."
      3. **Separator**.
      4. **Heading h2** centred, `<strong>`: **"Rooted in desire. Wild in spirit. You are the Untamed Woman."**
      5. **Separator**.
      6. **Buttons** centred: **"Yes! I want to step in the footsteps of Mary Magdalene!"** → `https://swaanelauwaert.myflodesk.com/mariamagdalena2027`, `target="_blank"`.
4. **Group** `alignfull is-style-section-1` (background **`#F1EEE9`**), `padding-top/bottom: spacing-80`, `margin:0`:
   - **Columns** `alignwide`, nowrap (2 × 50 %):
     - Column 1 (image collage, both lazy):
       - **Image** `alignleft size-full wp-image-4351` `UP/2026/01/unnamed.jpg` 1200×891, figure `margin-right: spacing-80`; srcset `-300x223`, `-768x570`, `-1024x760`. (Artemisia Gentileschi, *Mary Magdalene in Ecstasy* — painting reproduction.)
       - **Image** `alignright size-full is-resized wp-image-4355` `UP/2026/01/bd7ca64901bddc5947b049725270689a-2.jpg` 736×1308 (tall), displayed `width:202px`, figure **`margin-top:-50%`** → it overlaps the painting from the right (collage effect). srcset `-169x300`, `-576x1024`.
       - Desktop render shows this column **blank** (both images `loading="lazy"`, not painted); the live layout is painting left + small tall image overlapping at the right.
     - Column 2, vertically centred, `padding-left/right:0`:
       - Paragraph `is-style-text-subtitle` (≈1.5–1.75 rem): "***Mary Magdalene in Ecstasy*** is a painting by the female Italian baroque artist [Artemisia Gentileschi](https://en.wikipedia.org/wiki/Artemisia_Gentileschi) (1620)." (title is `<em><strong>`; link, same tab).
       - Paragraph `is-style-text-subtitle`: "Artemisia’s Magdalene reminds us that holiness lies not in chastity, but in the raw, fleshly surrender to your own divine nature."
5. **Group** `alignfull`, `padding-top/bottom: spacing-50`, `margin:0`:
   1. **Heading h2** `alignwide`: **"My Services:"**
   2. **Columns** `alignwide` (3 equal columns), each: Image `size-full` with `aspect-ratio:4/3; object-fit:cover; margin-bottom:24px` (all lazy, alt ""), then h3, then `has-medium-font-size` italic paragraph:
      - `wp-image-4474` `UP/2026/02/b264d97a335da7040c2173b983aa28bf.jpg` 683×1024 → **h3 "Rituals"** → *"In rituals we anchor."*
      - `wp-image-4475` `UP/2026/02/f2bf95b8eddfc091bb56604ab4d4d48d.jpg` 1200×1194 → **h3 "Ceremonies"** → *"In ceremonies we transform."*
      - `wp-image-4477` `UP/2026/02/b40ec7271d9a610c1298162dd93302b2.jpg` 801×1200 → **h3 "Retreats"** → *"During retreats we walk each other home."*
      - Desktop render shows the three headings/captions with blank 4:3 boxes above (lazy images not painted).
6. Paragraph (empty).

---

## 7. Page: The Eros Sanctuary — `/en/body-untamed/` and `/en/the-eros-sanctuary-2/` (id 66)

- **Both mirror files are the same WordPress page (id 66).** `en/body-untamed/index.html` and `en/the-eros-sanctuary-2/index.html` differ only in 8 rewritten lines: `<link rel="canonical">`, `hreflang="en"`, the skip-link and `aria-current` hrefs. The HTML served at `/en/the-eros-sanctuary-2/` declares **canonical = `https://swaanelauwaert.com/en/body-untamed/`**, and the nav links to `/en/body-untamed/`, so `body-untamed` is the current slug and `the-eros-sanctuary-2` is the old one (WordPress old-slug redirect served the same content; the REST dump still lists `the-eros-sanctuary-2`, meaning the slug was changed after the REST dump or the REST `link` is stale). Rebuild: **publish at `/en/body-untamed/` and 301 `/en/the-eros-sanctuary-2/` → `/en/body-untamed/`.**
- Title: **"The Eros Sanctuary"**; nav: submenu item **"The Eros Sanctuary"** → `/en/body-untamed/`. Default template.
- Meta description starts "A safe space where time slows down…". `og:image` lists all page images (Jetpack).
- Renders: `local-shots/en-body-untamed--desktop.png` (1440×3595) = `en-the-eros-sanctuary-2--desktop.png` (identical size), `en-body-untamed--mobile.png` (390×3016).

Blocks:

1. **Post Title h1**: **"The Eros Sanctuary"**
2. **Cover** `alignfull is-light`, text colour **contrast** (`has-contrast-color`, links accent-3 via `.wp-elements-1`), `padding: spacing-60 spacing-50` (top/bottom 60, l/r 50), `margin:0`. **No image**: background span `has-base-background-color has-background-dim-100` → a solid cream `#fff7e6` panel (visually indistinguishable from the page background). Inner (constrained):
   1. **Columns** `alignwide`, nowrap, `gap: spacing-60 spacing-80`:
      - **Column 65 %** → vertical group (stretch):
        1. Paragraph: "A safe space where time slows down and your senses awaken. This isn’t just a journey; it’s a re-initiation into the art of seduction—starting with yourself."
        2. Paragraph (empty)
        3. **Buttons**: **"Yes! Ignite my inner fire!"** → `https://swaanelauwaert.myflodesk.com/theerossanctuaryeng`, `target="_blank"`.
        4. Paragraph (empty)
        5. Paragraph: "An ORGASTIC LIFE is the art of saying a deep ‘yes’ to life…" (boundary between you and the world blurs).
        6. Paragraph: **"It’s ecstasy in the everyday:"**
        7. **List** (5 items, verbatim): "That sudden wave of gratitude that takes your breath away." / "The tingle of the first spring sun kissing your skin like a lover." / "The soft rush of goosebumps from that one, perfect bite." / "The shiver of pure happiness when the thought of someone you love warms your heart." / "The quiet peace flowing through your fingers as you stroke an animal’s soft fur."
        8. Paragraph: in the Sanctuary this is the language of your Eros — the nervous system safe enough to let life in; "you’ll never want anything else!"
        9. Paragraph (empty)
        10. **Gallery** (3 columns, cropped), alt "":
            - `wp-image-5181` `UP/2026/04/0e9a4aa194478ed4c418f7fa9463bea9.jpg` 400×534 (`fetchpriority="high"`; srcset `-225x300`) — skin/arm close-up
            - `wp-image-5187` `UP/2026/04/30e0d24c3b2ebaf63a21f5c7f874a14d.jpg` 640×640 (srcset `-300x300`, `-150x150`) — flowers on a torso
            - `wp-image-5189` `UP/2026/04/af472e9b5594e4b72110cae15f9792dc.jpg` 422×586 (srcset `-216x300`) — hands
        11. Paragraph (empty)
        - then, still in the column but outside the group: **Buttons** → button `has-custom-width` (full column width): **"Yes! Ignite my inner fire!"** → same Flodesk URL, `target="_blank"` (render: a full-width black pill ≈ 65 % of the wide area).
      - **Column 35 %** → vertical group (stretch, nowrap):
        1. **Image** `size-full wp-image-5180` `UP/2026/04/4e2393ae5131da6865a0a5c17d2fdf83.jpg` 720×900 with `aspect-ratio:3/4; object-fit:cover`, `loading="lazy"` (srcset `-240x300`) — woman's profile, head tilted back, dark hair.
        2. Paragraph `has-text-align-right has-x-large-font-size` `line-height:1.2`: link **"Instagram"** → `https://www.instagram.com/swaanelauwaert/` followed by two `<br>`.
   2. Paragraph (empty)
   3. Paragraph: full-body orgasms deeper and more liberating than anything before.
   4. Paragraph: your Eros as the ultimate energy source / creative fire to manifest dreams.
   5. Paragraph: stand tall in your power, say a clear unapologetic 'no', live true to who you are.
3. **Columns** (nowrap): column `flex-basis:66.66%` → **Quote** block (default style: 2 px left border) with one paragraph in `<em><strong>`: "This is the end of numbness. You will emerge feeling the delicious, electric pulse of your own life force coursing through your veins. Your body becomes more than just a home—it becomes a sanctuary of delight, a vessel for joy, and a playground for your senses."; column `33.33%` empty.
4. **Media & Text** (`is-stacked-on-mobile`, media left, default 50/50): image `wp-image-4466 size-full` `UP/2026/02/59653540d6bf783e7fb741cc68cf58bb-819x1024.jpg` 819×1024 (full `….jpg` 1200×1500; srcset `-240x300`, `-768x960`, full), lazy — photo of a collarbone with the words "Dear body, I trust you." written on the skin. Content: paragraph **"Are you ready to play?"**, **Buttons**: **"Stay tuned THE EROS SANCTUARY"** → `https://swaanelauwaert.myflodesk.com/theerossanctuaryeng`, `target="_blank"`.
5. **Quote** (default style) — testimonial, `<em>`: "“I didn’t know I could feel this much. My nervous system has finally settled down, and I feel right at home in my own body again. That constant inner restlessness is gone, making room for everything from a soft, gentle turn-on to tingling ecstasy through my entire body. It’s amazing!”" — no citation.
6. **Gallery** (3 columns, cropped, all lazy, alt ""):
   - `wp-image-5186` `UP/2026/04/8881d238fd5f3310b8212df33597bd3d-768x1024.jpg` 768×1024 (full 810×1080)
   - `wp-image-5190` `UP/2026/04/31151a884fbb0603dff8df2a67b2bc02-822x1024.jpg` 822×1024 (full 1080×1346)
   - `wp-image-5185` `UP/2026/04/327d1cd8b43e66b8535f50d749193206.jpg` 736×867
   - Desktop render shows ~500 px of blank space here (lazy images not painted); the live page ends with this 3-image row.

No embeds/iframes. Links to Flodesk open in new tabs.

---

## 8. Page: Flavours of Desire `/en/flavours-of-desire/` (id 68)

- Mirror file: `mirror/raw/swaanelauwaert.com/en/flavours-of-desire/index.html`. Default template. Nav: submenu item **"Flavours of Desire"**. `menu_order` 20.
- Meta description: "Programme: FLAVOURS OF DESIRE is OUT!!!!!! GET YOUR SENSUAL KITCHEN DATE NIGHT HERE!!!!…". `og:image` = `b69a7dfb…` (pomegranate heart).
- Renders: `local-shots/en-flavours-of-desire--desktop.png` (1440×3511), `en-flavours-of-desire--mobile.png`.

Blocks:

1. **Post Title h1**: **"Flavours of Desire"**
2. **Separator**.
3. **Media & Text** (`is-stacked-on-mobile`, image left 50 %): image `wp-image-4465 size-full` `UP/2026/02/a4a043d325ecfae0844bcce21546e339.jpg` 736×736 (`fetchpriority="high"`; srcset `-150x150`, `-300x300`) — a peach half on pink fabric. Content:
   - Paragraph: **"Programme: FLAVOURS OF DESIRE is OUT!!!!!!"**
   - Paragraph: **"GET YOUR SENSUAL KITCHEN DATE NIGHT HERE!!!!"**
   - **Buttons** → button `has-custom-width` (100 % of the text column): **"BUY Flavours of Desire HERE"** → `https://swaanelauwaert.myflodesk.com/flavoursofdesireminicourse`, `target="_blank"`.
   - Paragraph (empty)
4. **Group** `alignfull`, `margin:0`, `padding-top/bottom: spacing-50`:
   - **Columns** `alignwide`, nowrap, gap spacing-50:
     - Column `flex-basis:56%`: **Image** `size-full wp-image-4298` `UP/2026/01/7e913d8245b765d0f1ef82803d7c2f7e.jpg` 577×866 displayed with `aspect-ratio:1; object-fit:cover` (square crop; srcset `-200x300`) — red grapefruit/pomelo macro.
     - Column (44 %), `is-vertically-aligned-center`, children spaced `spacing-40`:
       - **Heading h2**: **"Reclaiming the Erotics of Daily Life."**
       - Paragraph: when the world feels too much we use food to muffle the ache; the relief is a trap — self-punishment and an inner critic.
       - Paragraph: turning against yourself severs the heart; you become frozen in a body that feels like a cage of shame.
       - Paragraph: "My approach is not a diet; it is a **sensory revolution**." (strong) — re-education of the senses; cravings as a sacred map.
       - Paragraph: "**releasing the heavy burden of body-shame**" (strong); shame is more toxic than any food; befriending the body you are in today.
       - Paragraph: decode the body's whispers; ends with strong "**We aren’t just fixing a relationship with food; we are liberating your capacity to feel, to taste, and to desire again.**"
       - Paragraph (empty)
       - **Buttons**: **"Yes! I want to feel it all!"** → `https://swaanelauwaert.com/en/#contact` (internal anchor to the home contact form, same tab).
5. **Media & Text** (`is-stacked-on-mobile`, image left): image `wp-image-4432 size-full` `UP/2026/02/b69a7dfbf5eaad18b7b69648d56c9c49.jpg` 800×800 (srcset `-150x150`, `-300x300`, `-768x768`) — heart-shaped pomegranate on black. Content: paragraph `<strong><em>` **"A dream shared, a table set. My debut cookbook is almost here. I can’t wait to invite you into my kitchen."**; **Buttons**: **"Stay tuned for my cookbook…"** → `https://swaanelauwaert.myflodesk.com/tpf30n5jns`, `target="_blank"`. (**Content is stale** — the Cookbook page says the book is out; consider linking to `/en/cookbook/`.)
6. **Group** `alignfull`, `padding-top/bottom: spacing-50`, `margin:0` → **Group** `alignwide` **grid** `repeat(auto-fill, minmax(min(16rem,100%),1fr))`, gap spacing-50 (on a 1340 px wide area this yields **4 columns**; on mobile 1):
   1. Vertical group → **Heading h2** `has-x-large-font-size`: **"A Living Prayer:"**
   2. Vertical group (stretch) → **Cover** (no alignment, default `min-height` 430 px) with `<img class="wp-block-cover__image-background wp-image-4281 size-full">` `UP/2026/01/7c754abd9bc7f6a913a765577b33dea2.jpg` 736×863 (lazy), overlay `background-color:#833d3a` at dim 0 (invisible), inner only a spacer `spacing-20` → **Paragraph** centred: **"Ingnite"** (sic — typo for "Ignite" on the live site).
   3. Vertical group → **Cover** `is-light` with image `wp-image-4300` `UP/2026/01/2211d321fe9f6f2c415cafa5ab80fcc2.jpg` 736×975 (lazy), overlay `#828282` dim 0 → **Paragraph** centred: **"Devour"**
   4. Vertical group → **Cover** with image `wp-image-4301` `UP/2026/01/bb3e19bbdc0e7db827b33c44fc650fdb-1.jpg` 700×875 (lazy), overlay `#d6bc98` dim 0 → **Paragraph** centred: **"Surrender"**
   - Desktop render: heading at far left, then the three captions in a row with empty 430 px-tall boxes above (lazy covers not painted). Live: three photo tiles with the words under them.

---

## 9. Pages: Sainte-Baume Guide `/en/sainte-baume-guide/` (id 5629) and Guide Sainte-Baume `/en/guide-sainte-baume/` (id 5633)

- Mirror files: `mirror/raw/swaanelauwaert.com/en/sainte-baume-guide/index.html`, `mirror/raw/swaanelauwaert.com/en/guide-sainte-baume/index.html`. Default template.
- **The nav uses 5629 `sainte-baume-guide`** (submenu "Sainte-Baume Guide"). **5633 `guide-sainte-baume` is not linked from anywhere** (no nav entry, no hreflang alternates, no translation links; created 14 minutes after 5629 on 2026-09-13).
- Diff between the two HTML files (37 lines): only the `<title>`/`og:title`/h1 (**"Sainte-Baume Guide"** vs **"Guide Sainte-Baume"**), ids/dates, the hreflang block (5629 ↔ `nl/sainte-baume-gids/`; 5633 none) and **the button href: 5629 → `https://saintebaumeguide.com/en/`, 5633 → `https://saintebaumeguide.com/fr/`**. Body text and image are identical. Recommendation: keep 5629 at `/en/sainte-baume-guide/`, drop 5633 (or 301 it to 5629).
- Meta description: "The ancient primeval forest and limestone cliffs of the Sainte-Baume massif feel like a second home to me…". `og:image` = `IMG_20260812_200654-scaled.jpg`.
- Renders: `local-shots/en-sainte-baume-guide--desktop.png` and `en-guide-sainte-baume--desktop.png` (both 1440×2152, visually identical except the title), mobiles.

Blocks (5629; 5633 identical except where noted):

1. **Post Title h1**: **"Sainte-Baume Guide"** (5633: **"Guide Sainte-Baume"**)
2. Paragraph: the primeval forest and limestone cliffs of the Sainte-Baume massif feel like a second home; as a local guide she takes you along ancient pilgrim paths away from the crowds.
3. Paragraph: not an ordinary hike but a sensory journey at your own pace — hidden caves, centuries-old trees, panoramic views over Provence; walks and rituals tailored to you.
4. Paragraph: **"Curious about the different walks, or would you like to create a custom journey together?"**
5. Paragraph: **"Visit my website:"**
6. **Buttons** (left): **"www.saintebaumeguide.com"** → `https://saintebaumeguide.com/en/` (5633: `https://saintebaumeguide.com/fr/`), `target="_blank"`.
7. **Image** `aligncenter size-large wp-image-5588` `UP/2026/08/IMG_20260812_200654-768x1024.jpg` 768×1024, `fetchpriority="high"`; srcset `-225x300`, `-1152x1536`, `-1536x2048`, `-scaled.jpg` (1920×2560). Swaane in a blue dress leaning on a stone wall above the Provence plain at sunset. Centred, 768 px wide.

---

## 10. Page: Cookbook `/en/cookbook/` (id 4892)

- Mirror file: `mirror/raw/swaanelauwaert.com/en/cookbook/index.html`. Default template. Nav: top-level **"Cookbook"**. Uses two **Otter Blocks** (themeisle) blocks — the only EN page with plugin blocks: `otter-blocks/build/blocks/content-slider.js` is loaded (deferred).
- Meta description: "A shared dream, a gathered table. My debut cookbook is finally here!…". `og:image` = `MVIMG_20260817_163817_1-scaled.jpg`.
- Renders: `local-shots/en-cookbook--desktop.png` (1440×3328), `en-cookbook--mobile.png` (390×2920).

Blocks:

1. **Post Title h1**: **"Cookbook: The Taste of Her Journey"**
2. **Cover** `alignfull is-light has-parallax`, text colour **accent-1 white** (links accent-1), `padding-top:200px; padding-bottom:200px; padding-left/right: spacing-50`, **`min-height: 739px`**, `margin:0`. Background (`wp-image-5508 size-full`, fixed/parallax): `UP/2026/08/Screenshot-2026-08-23-201541.jpg` — **only 342×507 px** (a phone screenshot of a plate of grilled aubergine, feta and mint on a blue plate) stretched to full width as a `background-size: cover` fixed image → visibly soft/pixelated at 1440 px. Overlay: `has-background-dim-10` with `background-color:#a0a192` (grey-green at 10 %). Inner (constrained, children spaced spacing-40):
   - **Heading h3** `has-text-align-center has-xx-large-font-size`, `<strong><em>`: **"A shared dream, a gathered table. My debut cookbook is finally here! I cannot wait to welcome you into my kitchen."** (white italic Floreal over the photo)
   - Paragraph centred (empty)
   - **Buttons** centred (gap 16 px): two `is-style-fill` buttons styled **white background (accent-1) with contrast text** (`has-contrast-color has-accent-1-background-color`, first also `has-accent-1-border-color`):
     - **"Buy the PAPERBACK here!"** → `https://books2read.com/u/4DwK0r`, `target="_blank"`
     - **"Buy the HARDCOVER here!"** → `https://books2read.com/u/4DwK0r`, `target="_blank"` (same URL)
   - Mobile: buttons stack vertically, cover height still ≥ 739 px.
3. Paragraph `has-text-align-center`: **"A sensory and poetic journey across the sacred landscapes of the Mediterranean."**
4. Paragraph: *The Taste of Her Journey* (em) is more than a cookbook — a sensory, historical and spiritual exploration; 100 creative recipes and stories retracing Mary Magdalene's path from Galilee to the Sainte-Baume.
5. **Quote** (default, left border): "“This book honors cooking as a sacred ritual of connection: to the rhythm of the seasons, wild herbs, ancestral stories, and the power of the feminine spirit.”" — no cite.
6. Paragraph (empty)
7. Paragraph: **"Language:"** (strong) English
8. Paragraph: **"ISBN:"** 9798187568222 (paperback) / 9789090429786 (hardcover)
9. Paragraph: **"Page Count:"** 250 pages
10. Paragraph: **"Publication Year:"** 2026
11. **Otter Button Group** (`#wp-block-themeisle-blocks-button-group-d96a39fd`) containing one **Otter Button** (`#wp-block-themeisle-blocks-button-93a8efc0`) with an **empty label and no href** (`<a target="_self" rel="noopener noreferrer" class="wp-block-button__link"><span></span></a>`). Renders as a small black pill (≈60×30 px) at the left — an editing leftover; **drop it**.
12. **Separator**.
13. **Buttons** centred: **"Buy the PAPERBACK here!"** → `https://books2read.com/u/4DwK0r`, `_blank`.
14. **Separator**.
15. **Buttons** centred: **"Buy the HARDCOVER here!"** → `https://books2read.com/u/4DwK0r`, `_blank`.
16. **Separator**.
17. **Otter Content Slider** (`#wp-block-themeisle-blocks-content-slider-9fac4092`, `role="region" aria-label="Content slider"`, `--o-per-view:1; --o-gap:0px; --o-height:auto`, `data-autoplay="false" data-delay="5" data-loop="true"`) with prev/next buttons (`aria-label="Previous slide"` / `"Next slide"`, grey round arrows at left/right) and a 3-dot pagination; 3 slides, each a constrained group containing a centred image + an empty centred paragraph:
    - `wp-image-5506 size-large` `UP/2026/08/MVIMG_20260817_163817_1-768x1024.jpg` 768×1024 (`fetchpriority="high"`; srcset `-225x300`, `-1152x1536`, `-1536x2048`, `-scaled.jpg` 1920×2560) — Swaane holding the printed book in front of a grey wooden door.
    - `wp-image-5507 size-large` `UP/2026/08/Photo-43-EDIT-768x1024.jpg` 768×1024 (same srcset pattern, `-scaled.jpg` 1920×2560).
    - `wp-image-5508 size-full` `UP/2026/08/Screenshot-2026-08-23-201541.jpg` 342×507 (same image as the cover background; srcset `-202x300`).
    - Desktop render: slides blank (JS slider + lazy images not painted) but arrows and dots visible; mobile render shows slide 1. Rebuild as a simple carousel or a static 3-image row.
18. Paragraph centred (empty); Paragraph (empty).

---

## 11. Page: The Journal `/en/the-journal/` (id 48)

- Mirror file: `mirror/raw/swaanelauwaert.com/en/the-journal/index.html`. Body class `blog` (no `page-id`): this page is WordPress's **posts page**, so the theme's `home` template renders, not the page content. The page's own content is unused — its REST excerpt is an editor note: "Bewerk template hier: https://swaanelauwaert.com/wp-admin/site-editor.php?p=%2Fwp_template%2Ftwentytwentyfive%2F%2Fho…". Nav: **"The Journal"**. `menu_order` 90.
- `og:image` = site icon `UP/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector.jpg`. No canonical/shortlink in the mirrored head.
- Render: `local-shots/en-the-journal--desktop.png` (1440×1035 — shortest page), mobile.

Rendered template, top → bottom (no `<main>` element; a plain group after the header):

1. **Group** constrained, `margin:0`:
   1. Spacer 40 px.
   2. **Heading h1** `has-text-align-center` — empty.
   3. **Buttons** centred → `is-style-fill` button **"SUBSTACK"** with **no `href`** (dead button; intended target is the Substack URL below).
   4. **Quote** block (default left border, wide — the quote spans the content column) containing: **Heading h1** centred **"The Journal"**; Paragraph **"I write about what truly matters to me: family, my work, nature, art, Mary Magdalene, and the simple everyday life!"**; Paragraph **"FOLLOW ME ON: https://substack.com/@swaanelauwaert1"** with the URL linked → `https://substack.com/@swaanelauwaert1` (same tab).
   5. Spacer 20 px.
   6. **Query Loop** `alignwide` (post list) → **No results**: Paragraph **"Sorry, nothing found yet."** (all 210 posts are Dutch; there are no English posts).
   7. Spacer 20 px; Spacer 80 px.

The same template serves `/nl/journal/` (where it lists Dutch posts) and `/fr/le-journal/`; the English version is effectively a static "follow me on Substack" page.

---

## 12. Pages present in REST but absent from the mirror

| id | slug | what we know | what we cannot know |
|---|---|---|---|
| 5530 | `werk-met-mij` ("Werk met mij") | published 2026-08-24 in the EN language set, `content.rendered` = "" (empty page), no excerpt, not protected, not in nav, no translations. The Playwright run saw it as HTTP 200 with zero text. Almost certainly an accidental empty draft-like page with a Dutch title in the EN language. | nothing else — it is empty; safe to drop (optionally 301 → `/en/work-with-me/`). |
| 5247 | `module-1` ("The Eros Sanctuary Modules (English version):") | password-protected (`content.protected=true`), published 2026-05-01, modified 2026-06-23, not in nav; NL counterpart `nl/the-eros-sanctuary-modules/` (id 5236). Course material for buyers of The Eros Sanctuary. | the content (REST returns protected content empty; mirror never fetched it; Playwright got 429). Needs the owner's password/export or a member-portal rebuild. |
| 5113 | `flavours-of-desire-modules-english` ("Flavours of Desire Modules English") | password-protected, published 2026-03-29; siblings `fr/flavours-of-desire-2/modules/` (5101) and `nl/flavours-of-desire-3/modules/` (4990). Course material for the Flavours of Desire programme. | the content (same reason). |

---

## 13. Duplicate / unused / inconsistent pages — summary

1. **`/en/body-untamed/` vs `/en/the-eros-sanctuary-2/`** — one page (id 66), identical content. Live canonical and the nav point to **`body-untamed`**; `the-eros-sanctuary-2` is the old slug (REST link is stale). Keep `body-untamed`, redirect the old slug.
2. **`/en/sainte-baume-guide/` (5629) vs `/en/guide-sainte-baume/` (5633)** — two separate pages with identical body text and image; only the title order and the external button (`/en/` vs `/fr/` on saintebaumeguide.com) differ. The nav and the NL translation link use **5629**; 5633 is orphaned. Keep 5629, drop/redirect 5633.
3. **`/en/werk-met-mij/` (5530) vs `/en/work-with-me/` (4242)** — 5530 is an **empty** page with a Dutch title; the nav uses 4242. Drop 5530.
4. **`/en/` ↔ `/en/the-journal/`** — the journal page content is unused (posts-page template).
5. Internal-link bugs worth fixing in the rebuild: home "[Discover 1-op-1 coaching →]" links to the Dutch `/nl/samenwerken/`; the "SUBSTACK" button on The Journal has no href; the cookbook has an empty Otter button; the empty h2/h4 headings and empty paragraphs/grid on home / Work With Me only add whitespace; "Ingnite" typo; the contact-form success text is Dutch; Flavours of Desire still says the cookbook is "almost here".

---

## 14. External links and integrations used by the English pages

| Destination | Used on | Purpose |
|---|---|---|
| `https://swaanelauwaert.myflodesk.com/v3jg55lt2s` | home "Yes! Keep me posted please!", work-with-me "Join us!" | Flodesk newsletter sign-up |
| `https://swaanelauwaert.myflodesk.com/e5hyhsn3of` | home "[Stay tuned →]" | Flodesk — Mary Magdalene retreat 2027 waiting list |
| `https://swaanelauwaert.myflodesk.com/mariamagdalena2027` | rooted-rituals button | Flodesk — retreat 2027 |
| `https://swaanelauwaert.myflodesk.com/theerossanctuaryeng` | body-untamed (3 buttons) | Flodesk — Eros Sanctuary (EN) |
| `https://swaanelauwaert.myflodesk.com/flavoursofdesireminicourse` | flavours-of-desire "BUY Flavours of Desire HERE" | Flodesk — mini-course purchase |
| `https://swaanelauwaert.myflodesk.com/tpf30n5jns` | flavours-of-desire "Stay tuned for my cookbook…" | Flodesk — cookbook list (stale) |
| `https://books2read.com/u/4DwK0r` | home, cookbook (×5) | Book retailer links (paperback and hardcover use the same URL) |
| `https://calendly.com/swaanelauwaert/let-s-meet` | about, work-with-me "Let’s meet!" | Booking |
| `https://saintebaumeguide.com/en/` (5629) / `/fr/` (5633) | Sainte-Baume pages | Separate guiding website |
| `https://substack.com/@swaanelauwaert1` | the-journal | Substack profile |
| `https://en.wikipedia.org/wiki/Artemisia_Gentileschi` | rooted-rituals | reference |
| `https://www.instagram.com/swaanelauwaert/`, `https://www.facebook.com/swaane.lauwaert` | footer (all pages), body-untamed "Instagram" | social |
| `https://phareo.eu`, `https://status301.net/` | credit bar (all pages) | host/agency credit |
| Jetpack contact form (POST `/en`, `grunion-contact-form`) | home `#contact` | **needs a static replacement** |
| Otter content slider JS | cookbook | carousel |

No iframes, videos, audio, maps or third-party embeds exist on any English page (the only `<iframe>`-free JS integrations are Jetpack stats `_stq` and the WordPress Interactivity API for the nav/form).

---

## 15. Observations from the local renders that the HTML alone would miss

- **Lazy images are missing from the headless desktop captures** (everything with `loading="lazy"`): home gallery tile 3, Eros Sanctuary portrait + last gallery, Rooted Rituals collage + 3 service photos, Flavours "A Living Prayer" covers, cookbook slider slides. These are render artefacts; the files exist and the layout reserves their space.
- Home hero: the white title sits bottom-left (not centred) because the cover's inner container is width-constrained; the pomegranate photo is 1280×577, so on tall viewports (80.4 vh) it is cropped and scaled up; parallax (`background-attachment: fixed`) on desktop.
- Cookbook hero: a 342×507 screenshot is used as a full-width fixed background → low resolution; white italic heading and two white pills over it.
- Work With Me: the red `#c60000` columns block with **black** body text is the only strongly coloured section on the site; the "Let’s meet!" button below it sits on cream; the page ends with ~250 px of empty space.
- Eros Sanctuary desktop: the 65/35 columns block is `alignwide` (1340 px) while the paragraphs after it fall back to the 960 px column, so the page alternates between wide and normal widths; the second "Yes! Ignite my inner fire!" button is a full-column-width black bar.
- Rooted Rituals: the grey `#F1EEE9` band with the painting collage spans full width with very large (spacing-80) vertical padding; the three service columns sit on cream with no card styling.
- Mobile (390 px): header collapses to site title + hamburger; all columns/media-text stack; 3-image galleries become 2 tiles + 1 (confirmed on the Eros Sanctuary mobile capture; the home gallery was not painted in its mobile capture but uses the same core gallery CSS); the cookbook cover keeps its 739 px min-height with stacked buttons; Work With Me cover keeps 840 px height so the photo is heavily cropped.
- Header shadow and sticky behaviour are visible on every page; the footer separator is a thin 20 %-black line across the wide width.
