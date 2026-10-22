# Dutch pages audit — swaanelauwaert.com (`/nl/`)

Scope: the Dutch home page and every Dutch **static page** (no dated posts, tag/category/author archives). Everything below was read from the local mirror only (`mirror/raw/swaanelauwaert.com/…`, `mirror/api/pages-p1.json`, `mirror/meta/…`) and checked against the local full-page renders in `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/local-shots/`. The live site was not reachable.

Companion documents (not repeated here): `docs/audit/chrome.md` (header, nav, footer, language switcher, the shared bottom bands of the home page, the Jetpack contact form, the `#liability` block) and `docs/audit/design-system.md` (fonts, palette, type scale, spacing, button/separator/gallery styling).

Conventions used in the block lists:

* **Paths** are repo-relative. `U/` = `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/`. Every file named below was verified to exist in the mirror (size and pixel dimensions were read from the file). Where WordPress serves a resized variant, the `-scaled`/original variant is also present under `U/` or `mirror/media/wp-content/uploads/sites/50/` unless stated otherwise.
* **Spacing presets** (`--wp--preset--spacing--N`): 20 = 10px, 30 = 20px, 40 = 30px, 50 = `clamp(30px,5vw,50px)`, 60 = `clamp(30px,7vw,70px)`, 70 = `clamp(50px,7vw,90px)`, 80 = `clamp(70px,10vw,140px)`.
* **Colours**: `base` #fff7e6 (cream page background), `contrast` #191919, `accent-1` #FFFFFF, `accent-2` #c60000 (red), `accent-3` #000, `accent-4` #5F5F5F (body text), `accent-5` #F1EEE9 (grey band = `is-style-section-1`), `accent-6` #19191933 (separators). `is-style-section-5` = `contrast` background with `base` text (headings also `base`).
* **Font sizes**: `small` 0.9rem, `medium` `clamp(1rem,…,1.2rem)`, `large` `clamp(1.6rem,…,1.8rem)`, `x-large` `clamp(1.8em,…,2.2rem)`, `xx-large` `clamp(2rem,…,2.8rem)`.
* "Button" = `div.wp-block-buttons > div.wp-block-button > a.wp-block-button__link.wp-element-button` → dark pill (`contrast` background, white Beiruti text, `border-radius:9999px`, natural shadow) unless a style override is noted. Buttons containers are left-aligned unless `is-content-justification-center` is noted.
* "Separator" = `<hr class="wp-block-separator has-alpha-channel-opacity">` — theme override: 1 px hairline in `accent-6` (20 % black), full content width (960 px); see design-system §5.2.
* "Gallery" = `figure.wp-block-gallery.has-nested-images.columns-default.is-cropped` (3 equal-height columns, `gap:0.5em`, every image `alt=""`).
* Alignment: `alignfull` = edge to edge, `alignwide` = 1340 px wide band, default = 960 px constrained content width.
* Paragraph gists are one line each; the full text is in `mirror/api/pages-p1.json` (`.content.rendered` of the page id) and in the scratchpad dump `…/scratchpad/text/<id>-<slug>.txt`.
* Lazy images: the local renders were made headless and **did not paint `loading="lazy"` images** (and sometimes other below-the-fold images). Blank areas in the renders noted below are render artefacts, not missing content — every file exists.

---

## 0. Inventory and cross-check

### 0.1 Raw mirror vs REST dump vs sitemap

| REST id | slug (REST) | URL | REST title (`title.rendered`, verbatim) | parent | menu_order | template | modified | raw mirror file | sitemap | NL nav item |
|---|---|---|---|---|---|---|---|---|---|---|
| 74 | `the-untamed-woman-2` | `/nl/` | `Swaane Lauwaert` | 0 | 0 | `page-no-title` | 2026-10-09 | `nl.html` (= `nl/index.html`, identical apart from relative paths; `.orig` has absolute URLs) | yes | site title / 🇧🇪 `Nederlands` |
| 4505 | `samenwerken` | `/nl/samenwerken/` | `Samenwerken 1:1 Somatische Coaching &amp; Lichaamswerk` | 0 | 0 | default | 2026-10-10 | `nl/samenwerken/index.html` | yes | `Werk met mij` › `Samenwerken` |
| 5441 | `weekendretreat-27-28-29-november-2026-play` | `/nl/weekendretreat-27-28-29-november-2026-play/` | `Weekendretreat 27-28-29 november 2026: PLAY` | 0 | 13 | default | 2026-08-31 | `nl/weekendretreat-27-28-29-november-2026-play/index.html` | yes | `Werk met mij` › `Weekendretreat 27-28-29 november 2026: PLAY` |
| 4728 | `maria-magdalena-retreat-zuid-frankrijk-2027` | `/nl/maria-magdalena-retreat-zuid-frankrijk-2027/` | `Maria Magdalena &#8216;Wild&amp;Rooted&#8217; Retreat Zuid Frankrijk 5-10 april 2027` | 0 | 0 | default | 2026-10-17 | `nl/maria-magdalena-retreat-zuid-frankrijk-2027/index.html` **and** `nl/maria-magdalena-retreat-zuid-frankrijk-2026/index.html` (byte-identical `.orig`, both `canonical` → `…-2027/`, both `page-id-4728`) | yes (2027 only) | `Werk met mij` › `Maria Magdalena Retreat Zuid Frankrijk 2027` (href `…-2027/`) |
| 4533 | `flavours-of-desire-3` | `/nl/flavours-of-desire-3/` | `Flavours of Desire: mini online course at your own pace` | 0 | 20 | default | 2026-08-24 | `nl/flavours-of-desire-3/index.html` | yes | `Werk met mij` › `Flavours of Desire \| Voeding, Verlangen &amp; Zelfliefde` |
| 4990 | `modules` | `/nl/flavours-of-desire-3/modules/` | `Flavours of Desire Modules Nederlands` | **4533** | 0 | default | 2026-04-22 | **not in raw mirror** | yes | none (no link anywhere in the mirror) |
| 4525 | `the-eros-sanctuary` | `/nl/the-eros-sanctuary/` | `The Eros Sanctuary: 6 weken live online programma` | 0 | 0 | default | 2026-08-24 | `nl/the-eros-sanctuary/index.html` | yes | `Werk met mij` › `The Eros Sanctuary \| Somatic Coaching &amp; Sacred Sexuality` |
| 5236 | `the-eros-sanctuary-modules` | `/nl/the-eros-sanctuary-modules/` | `The Eros Sanctuary Modules (Nederlands)` | 0 | 0 | default | 2026-08-31 | **not in raw mirror** | yes | none (no link anywhere in the mirror) |
| 5541 | `sainte-baume-gids` | `/nl/sainte-baume-gids/` | `Sainte-Baume Gids` | 0 | 0 | default | 2026-08-24 | `nl/sainte-baume-gids/index.html` | yes | `Werk met mij` › `Sainte-Baume Gids` |
| 4914 | `kookboek` | `/nl/kookboek/` | `Kookboek: The Taste of Her Journey` | 0 | 0 | default | 2026-09-18 | `nl/kookboek/index.html` | yes | `Kookboek` |
| 4541 | `levende-rituelen` | `/nl/levende-rituelen/` | `Levende Rituelen \| Ceremonies &amp; Retraites` | 0 | 30 | default | 2026-03-28 | `nl/levende-rituelen/index.html` | yes | **none** — not in the NL menu and not linked from any NL page; only reachable via the language switcher from `/en/rooted-rituals/` and `/fr/rituels-dancrage/` |
| 4093 | `over-mij` | `/nl/over-mij/` | `Over mij` | 0 | 0 | default | 2026-03-09 | `nl/over-mij/index.html` | yes | `Over mij` |
| 78 | `journal` | `/nl/journal/` | `The Journal` | 0 | 90 | default (but rendered by the theme's **`home`** template: body class `blog`, this is the "posts page") | 2026-03-09 | `nl/journal/index.html` (+ paginated copies `index.html?query-1-page=N.html` for N = 1–6, 8, 20–24) | yes | `The Journal` |

Findings:

1. **Two pages exist in the REST dump / sitemap but not in the raw mirror: ids 4990 and 5236.** Both are **password-protected** (`content.protected: true`, `content.rendered: ""`, `class_list` contains `post-password-required`; 4990 additionally has `jetpack_seo_noindex: true`). No page in the mirror links to either URL. **Their module content is therefore unrecoverable from this snapshot** — see §12. (The task text expected the Eros modules at `the-eros-sanctuary/modules`; the real URL is the top-level `/nl/the-eros-sanctuary-modules/`.) The EN/FR siblings (`/en/module-1/` 5247, `/en/flavours-of-desire-modules-english/` 5113, `/fr/flavours-of-desire-2/modules/` 5101) are password-protected too.
2. **One URL exists in the raw mirror but not in REST: `/nl/maria-magdalena-retreat-zuid-frankrijk-2026/`.** It is an alias of page 4728 (identical HTML, canonical `…-2027/`). It is still linked from `nl/levende-rituelen` (button) — the home page and the nav already use the `-2027` URL. Whether the live server answers the `-2026` URL with a 200 (page slug history / Redirection plugin) or a 301 cannot be determined from the mirror (wget stored a 200 body; `mirror/meta/headers*.txt` only cover the home pages). The rebuild should keep a redirect `/nl/maria-magdalena-retreat-zuid-frankrijk-2026/ → /nl/maria-magdalena-retreat-zuid-frankrijk-2027/`.
3. `nl.html` and `nl/index.html` are the same page (diff = relative asset paths only). Use `nl.orig` for absolute URLs.
4. The REST `content.rendered` of page 78 (`journal`) is only an editor note (`Bewerk template hier: https://swaanelauwaert.com/wp-admin/site-editor.php?p=%2Fwp_template%2Ftwentytwentyfive%2F%2Fhome&canvas=edit`) that is **not rendered** on the site; the journal layout lives in the theme template (§11).

### 0.2 Translation links (`<link rel="alternate" hreflang>` in each `.orig`)

| NL page | EN | FR |
|---|---|---|
| `/nl/` | `/en/` | `/fr/` (+ `x-default` → `/`) |
| `/nl/samenwerken/` | `/en/work-with-me/` | `/fr/accompagnement/` |
| `/nl/the-eros-sanctuary/` | `/en/the-eros-sanctuary-2/` | `/fr/le-corps-libre/` |
| `/nl/flavours-of-desire-3/` | `/en/flavours-of-desire/` | `/fr/flavours-of-desire-2/` |
| `/nl/levende-rituelen/` | `/en/rooted-rituals/` | `/fr/rituels-dancrage/` |
| `/nl/kookboek/` | `/en/cookbook/` | `/fr/livre-de-cuisine/` |
| `/nl/over-mij/` | `/en/about/` | `/fr/a-propos/` |
| `/nl/journal/` | `/en/the-journal/` | `/fr/le-journal/` |
| `/nl/sainte-baume-gids/` | `/en/sainte-baume-guide/` | — (no FR) |
| `/nl/weekendretreat-27-28-29-november-2026-play/` | — | — (NL only, no hreflang at all) |
| `/nl/maria-magdalena-retreat-zuid-frankrijk-2027/` | — | — (NL only, no hreflang at all) |

### 0.3 Head data per page (`<title>`, `og:image`)

| Page | `<title>` (verbatim) | `og:image` (original URL; file under `U/`) |
|---|---|---|
| home | `Swaane Lauwaert` | `2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` |
| samenwerken | `Samenwerken 1:1 Somatische Coaching &amp; Lichaamswerk &#8211; Swaane Lauwaert` | `2026/10/Screenshot-2026-10-10-105756.png` |
| weekendretreat | `Weekendretreat 27-28-29 november 2026: PLAY &#8211; Swaane Lauwaert` | `2026/08/95067da75856898475877e5c4bd47736.jpg` |
| MM retreat 2027 | `Maria Magdalena &#8216;Wild&amp;Rooted&#8217; Retreat Zuid Frankrijk 5-10 april 2027 &#8211; Swaane Lauwaert` | `2026/02/DSCF0973-1-scaled.jpg` |
| flavours-of-desire-3 | `Flavours of Desire: mini online course at your own pace &#8211; Swaane Lauwaert` | `2026/02/a4a043d325ecfae0844bcce21546e339.jpg` |
| the-eros-sanctuary | `The Eros Sanctuary: 6 weken live online programma &#8211; Swaane Lauwaert` | `2026/04/8881d238fd5f3310b8212df33597bd3d-150x150.jpg` (150 px thumbnail!) |
| sainte-baume-gids | `Sainte-Baume Gids &#8211; Swaane Lauwaert` | `2026/08/IMG_20260812_200654-scaled.jpg` |
| kookboek | `Kookboek: The Taste of Her Journey &#8211; Swaane Lauwaert` | `2026/08/Screenshot-2026-08-25-001028.jpg` |
| levende-rituelen | `Levende Rituelen \| Ceremonies &amp; Retraites &#8211; Swaane Lauwaert` | `2026/02/5eaaabe9572dec3fc263928e634ab651.jpg` |
| over-mij | `Over mij &#8211; Swaane Lauwaert` | `2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` |
| journal | `The Journal &#8211; Swaane Lauwaert` | `2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector.jpg` (site icon) |

`meta name="description"` is Jetpack's auto-excerpt of the first ~300 characters of the content on every page (no hand-written descriptions; `meta.advanced_seo_description` is empty for all pages).

### 0.4 Shared inner-page frame (all pages except home and journal)

```html
<main id="wp--skip-link--target" class="wp-block-group has-global-padding is-layout-constrained …" style="margin-top:var(--wp--preset--spacing--60)">
  <div class="wp-block-group alignfull has-global-padding is-layout-constrained …" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
    [<figure class="wp-block-post-featured-image" style="margin-bottom:var(--wp--preset--spacing--60)"><img class="attachment-post-thumbnail size-post-thumbnail wp-post-image" style="object-fit:cover;" …></figure>]   ← only when the page has a featured image (over-mij, MM retreat)
    <h1 class="wp-block-post-title">…</h1>                       ← Floreal, left aligned, 960 px wide
    <div class="entry-content alignfull wp-block-post-content has-global-padding is-layout-constrained …">
      … page blocks …
    </div>
  </div>
</main>
```

The title sits **above** any cover/hero (see the renders: title, then the full-bleed cover on `samenwerken` and `kookboek`). Inner pages end with their last block and go straight to the footer; none of them has the contact form or the grey bands.

---

## 1. Home — `/nl/` (page 74)

* File: `mirror/raw/swaanelauwaert.com/nl.html` (absolute-URL copy: `nl.orig`). Title `Swaane Lauwaert`. Template `page-no-title`; body `home wp-singular page-template page-template-page-no-title page page-id-74`.
* Nav: site title (`Swaane Lauwaert` → `/nl/`), language switcher `Nederlands` → `/nl/`; `Contact` → `/nl/#contact` (anchor on this page).
* Renders: `local-shots/nl--desktop.png` (1440×3701), `nl--mobile.png`.
* `<main>` contains a single `div.wp-block-post-content.has-global-padding` (no `<h1>` outside the cover). Order:

| # | Block | Details |
|---|---|---|
| 1 | **Cover** `alignfull has-parallax has-custom-content-position is-position-bottom-center has-accent-1-color has-text-color has-link-color` | `style="margin-top:0;margin-bottom:0;padding:var(--wp--preset--spacing--50) (all four sides);min-height:80.4vh;aspect-ratio:unset"`. Background: `div.wp-block-cover__image-background.wp-image-4155.has-parallax` `background-image:url(U/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg)` (**1280×577**, 154 KB — halved pomegranates on dark background; served as a fixed `background-attachment` image, not an `<img>`, `background-position:50% 50%`). Overlay `span.wp-block-cover__background.has-contrast-background-color.has-background-dim-0` (invisible). Inner container `has-global-padding`: `<h1 class="has-link-color wp-elements-2 wp-block-post-title has-text-color has-accent-1-color has-xx-large-font-size" style="font-style:normal;font-weight:700">Swaane Lauwaert</h1>` — white Floreal, bottom-left of the cover (the render shows the title sitting at the bottom-left edge of the full-bleed photo; the actual cover height is `80.4vh`, so it depends on the viewport). |
| 2 | Spacer | `height:var(--wp--preset--spacing--50)` |
| 3 | h2 `wp-block-heading` | `1. Coaching, Lichaamswerk &amp; Intimiteit:` |
| 4 | p | Gist: losing contact with yourself through busyness/old patterns; 1-op-1 sessions combine body-oriented coaching, somatic bodywork and nervous-system regulation. |
| 5 | p | Gist: a safe, non-judgemental space to land in the body; special depth in desire/intimacy/female sexuality but never obligatory; your current question is central. |
| 6 | p (link line) | `<strong><a href="https://swaanelauwaert.com/nl/samenwerken/">[Ontdek 1-op-1 begeleiding →]</a></strong>` — plain bold underlined link, **not** a button (same tab). |
| 7 | Separator | |
| 8 | h2 | `2. Weekendretreat: PLAY (Antwerpen, 27-29 November 2026)` |
| 9 | p | Gist: the PLAY weekend in Antwerp — a safe space to drop out of the head into the body; movement, soft encounter, deep breathing, playfulness. |
| 10 | p (link line) | `<strong><a href="https://swaanelauwaert.com/nl/weekendretreat-27-28-29-november-2026-play/">[Lees alles over het PLAY retreat →]</a></strong>` |
| 11 | Separator | |
| 12 | h2 | `3. Maria Magdalena Retreat (Zuid-Frankrijk, 5–10 April 2027)` (en dash) |
| 13 | p | Gist: five days landing in yourself under the southern-French sun; Sainte-Baume forest and the Mary Magdalene archetype as thread; somatic bodywork, rest, good food, two walks; no overfull agenda. |
| 14 | p (link line) | `<strong><a href="https://swaanelauwaert.com/nl/maria-magdalena-retreat-zuid-frankrijk-2027/">[Reserveer je plek &amp; bekijk het programma →]</a></strong>` |
| 15 | Separator | |
| 16 | h2 | `4. Kookboek: The Taste of Her Journey` |
| 17 | p | Gist: the book is for the intuitive cook / storyteller; meals are memory, ritual, earth and above all love; her debut *The Taste of Her Journey* takes you to her kitchen and the land of Mary Magdalene. (Contains `<em>The Taste of Her Journey</em>`.) |
| 18 | p (link line) | `<strong><a href="https://books2read.com/u/4DwK0r" target="_blank" rel="noopener">[Ontdek het boek &amp; bestel jouw exemplaar →]</a></strong>` (external, new tab) |
| 19 | Separator | |
| 20 | **Image** `figure.wp-block-image.aligncenter.size-large` | `U/2026/08/MVIMG_20260817_163022_1-768x1024.jpg` 768×1024 (3:4 portrait, 185 KB), `alt=""`, `wp-image-5565`, `fetchpriority="high"`, srcset 225/768/1152/1536 w + `-scaled.jpg` (full `-scaled` is in `U/` and `mirror/media`). **The local render shows a blank cream area here** (~y 820–1180 in `nl--desktop.png`); the file exists. |
| 21 | p, p | two empty `<p class="wp-block-paragraph"></p>` |
| 22 | Separator | |
| 23 | **Band A** (grey `is-style-section-1--5`, `alignfull`, padding 0) | spacer-50 → pullquote `Are you ready to trade the numbness for the nectar?` (English, untranslated) → centred button `Yes! I am ready to reclaim my most sacred desire!` → `https://swaanelauwaert.myflodesk.com/g8dtc4po0h` (`_blank`) → gallery of 3 (`U/2026/08/IMG-20260404-WA0004.jpg` 539×719 id 5572; `U/2026/08/IMG_5348-768x1024.jpeg` 768×1024 id 5573; `U/2026/08/MVIMG_20260817_163817_1-768x1024.jpg` 768×1024 id 5506, lazy) → spacer `height:50px`. Full markup in `chrome.md` §3.1–3.2. The render shows the band with pullquote + button and then an empty grey area where the gallery should be. |
| 24 | **Contact section** `#contact` (grey `is-style-section-1--7`, padding spacing-70) | h2 `Do you have a question?<br>Feel free to reach out.` (English) + Jetpack form id 74: fields `Naam (verplicht)`, `E-mail (verplicht)`, `Bericht`, submit `Verzenden`; success `Uw bericht is verzonden`, back link `← Terug`. Full markup in `chrome.md` §3.4. |
| 25 | Spacer-40 → `#liability` group (`has-small-font-size`) → Spacer-40 | `Disclaimer:` / NL disclaimer paragraph / `Swaane Lauwaert, 511 Boulevard des Musiciens, 83860 Nans-les-Pins. France. Email: info@swaanelauwaert.com Téléphone:+33 789 06 32 01` (plain text). See `chrome.md` §3.5. |

Interactive elements: the Flodesk sign-up (external), the Jetpack contact form (needs a backend), four plain links. No prices, no embeds, no Calendly on the home page.

---

## 2. Samenwerken — `/nl/samenwerken/` (page 4505)

* File: `mirror/raw/swaanelauwaert.com/nl/samenwerken/index.html`. h1 `Samenwerken 1:1 Somatische Coaching &amp; Lichaamswerk`. Default page template, no featured image. Nav: `Werk met mij` › `Samenwerken`. Renders: `nl-samenwerken--desktop.png` (1440×5206), `nl-samenwerken--mobile.png`.

| # | Block | Details |
|---|---|---|
| 1 | **Cover** `alignfull has-custom-content-position is-position-bottom-center` (no `is-light`, so core default white text) | `margin:0; padding: spacing-50 all sides; min-height:840px; aspect-ratio:unset`. Image element `<img class="wp-block-cover__image-background wp-image-5578 size-large" src="U/2026/08/DSC03534-1024x683.jpg" width=1024 height=683 alt="">` (3:2 landscape, 110 KB; Swaane in a blue blouse at a table with pink flowers, `object-fit:cover`; srcset 300/768/1024/1536/2048 w + `DSC03534-scaled.jpg` in `U/` and `mirror/media`). Overlay `has-background-dim-10` (black 10 %). Inner: `div.wp-block-group.alignwide.has-global-padding.is-content-justification-left` → `<h2 class="wp-block-heading has-text-align-left has-xx-large-font-size">We don’t heal alone, we heal together.</h2>` (white Floreal, bottom-left) → empty `<p>` → button `Join us!` → `https://swaanelauwaert.myflodesk.com/g8dtc4po0h` (`_blank`). |
| 2 | **Group** `alignfull is-style-section-5 has-base-background-color has-background has-global-padding is-style-section-5--5` | `margin:0; padding-top/bottom: spacing-50`. The section-5 style would make it dark, but `has-base-background-color` forces the **cream** background back; the section-5 text colour rule (`color: base`, headings `base`) still applies to everything inside → the text in the red panel is cream/white (confirmed in the render). Contains: |
| 2a | Columns `alignwide has-accent-2-background-color has-background` (**red #c60000 panel**, `flex-wrap:nowrap`, gap `spacing-60 spacing-80`) | Column 1 (`flex-basis:50%`, vertically centred): h2 `Waar woorden helderheid brengen en het lichaam mag spreken.`; empty p `has-medium-font-size`; p **`Eén sessie van 60 minuten: €75`** (the only price on the Dutch site); p gist: in 1-op-1 trajectories we talk and map what is going on — talking is needed for awareness and safety; p gist: we usually already know what chafes — the real shift comes when the body speaks; p gist: during the session we move from words to physical sensations via somatic work, breath, presence and bodywork so the body can release old charge; p `has-medium-font-size` gist: "Laten we samen kijken naar wat jij nodig hebt." — every trajectory is tailored and starts with a **free introductory call** (`gratis kennismakingsgesprek`); p `(Photos by Louise van Gent)`. Column 2 (`flex-basis:50%`, vertically centred): `figure.wp-block-image.size-full` → `U/2026/10/Screenshot-2026-10-10-105756.png` 515×659 (302 KB, black-and-white portrait), `style="aspect-ratio:1;object-fit:cover"` (displayed square), `wp-image-5733`, `alt=""`. |
| 2b | Buttons (left-aligned, below the red panel, still inside the cream group) | `Let’s talk!` → `https://calendly.com/swaanelauwaert/let-s-meet` (`_blank`) — **Calendly** booking link. |
| 3 | Group `alignfull has-global-padding` (`margin:0`) → inner group `alignwide` **`is-layout-grid`** (`grid-template-columns:repeat(auto-fill,minmax(min(26rem,100%),1fr))`, gap spacing-50, `padding-top/bottom: spacing-50`) | **Empty** — renders as vertical whitespace only. |
| 4 | Group `alignfull has-global-padding` (`margin:0`) → inner group `alignwide` (`padding-top/bottom: spacing-50`) | `<h2 class="wp-block-heading has-x-large-font-size"></h2>` (empty), an empty `div.wp-block-columns`, and a `div.wp-block-columns` with two empty `div.wp-block-column`. **All empty** — whitespace only. Blocks 3–4 are why the render shows ~600 px of nothing between `Let’s talk!` and `Got questions?`. |
| 5 | Group `alignfull has-global-padding` (`margin:0; padding-top/bottom: spacing-80`) → group `alignwide` | p `has-text-align-center is-style-text-display is-style-text-display--6` `style="font-style:normal;font-weight:400"`: `Got questions? <br><a href="https://swaanelauwaert.com/nl/#contact" data-type="link" data-id="https://https://swaanelauwaert.com/nl/#contactformulier">Feel free to reach out.</a>` (English, untranslated; large display size, grey then black underlined link — see render). → spacer spacing-40 → `ul.wp-block-social-links.has-icon-color.is-style-logos-only.is-content-justification-center` with two `li.wp-block-social-link.has-contrast-color`: `Facebook` and `Instagram`, **both `href="#"`** (dead links; small black logos, centred). |

No embeds. Price: **€75 / 60 min**. CTAs: Flodesk `g8dtc4po0h`, Calendly, `#contact` anchor on the home page.

---

## 3. The Eros Sanctuary — `/nl/the-eros-sanctuary/` (page 4525)

* File: `mirror/raw/swaanelauwaert.com/nl/the-eros-sanctuary/index.html`. h1 `The Eros Sanctuary: 6 weken live online programma`. Default template, no featured image. Nav: `Werk met mij` › `The Eros Sanctuary | Somatic Coaching &amp; Sacred Sexuality`. Renders: `nl-the-eros-sanctuary--desktop.png` (1440×3372), `nl-the-eros-sanctuary--mobile.png`.
* **This page contains no module list, no lesson titles, no prices and no dates.** It is a wait-list page for the 2027 edition (`Schrijf je in en weet als eerste wanneer de deuren openen in 2027!`). The module page (`/nl/the-eros-sanctuary-modules/`, id 5236) is password-protected and absent from the mirror (§12).

| # | Block | Details |
|---|---|---|
| 1 | **Cover** `alignfull is-light has-contrast-color has-text-color has-link-color` | `margin:0; padding-top/bottom: spacing-60; padding-left/right: spacing-50`; **no image** — overlay `span.has-base-background-color.has-background-dim-100` = solid cream, so it behaves as a plain full-width cream section with black text. Inner container → **Columns** `alignwide` (`nowrap`, gap spacing-60/spacing-80): |
| 1a | Column `flex-basis:65%` → group `is-vertical is-content-justification-stretch` | p gist: a safe place where time slows and the senses awaken; a re-initiation into the art of seduction, starting with yourself. → p `Schrijf je in en weet als eerste wanneer de deuren openen in 2027!` → button `Yes! Ignite my inner fire!` → `https://swaanelauwaert.myflodesk.com/erosnl` (`_blank`) → empty p → p `Een <strong>ORGASTISCH LEVEN</strong> is de kunst van het diepe ‘ja’ zeggen tegen het leven. …` → p `Het is de extase in het alledaagse:` → five one-line paragraphs: `De plotselinge golf van <strong>dankbaarheid</strong> die je adem beneemt.` / `De tinteling van de <strong>eerste lentezon</strong> die je huid kust als een minnaar.` / `De zachte schok van <strong>kippenvel</strong> bij die ene, perfecte hap.` / `De rilling van <strong>puur geluk</strong> wanneer de gedachte aan een geliefde je hart verwarmt.` / `De <strong>stille vrede</strong> die door je vingers stroomt terwijl je de zachte vacht van een dier streelt.` → p gist: in the Sanctuary this is the language of your Eros — a nervous system safe enough to let life in. → **Gallery** (3, `wp-block-gallery-5`): `U/2026/04/0e9a4aa194478ed4c418f7fa9463bea9.jpg` 400×534 `size-full` id 5181 (skin/arm close-up); `U/2026/04/30e0d24c3b2ebaf63a21f5c7f874a14d.jpg` 640×640 `size-large` id 5187 (blue lace with flowers); `U/2026/04/af472e9b5594e4b72110cae15f9792dc.jpg` 422×586 `size-full` id 5189 (two hands). → empty p. Then, outside the vertical group but inside the column: buttons → `div.wp-block-button.has-custom-width.wp-block-button__width-100` `Yes! Ignite my inner fire!` → same Flodesk URL (**full-width** dark pill). |
| 1b | Column `flex-basis:35%` → group `is-vertical is-content-justification-stretch is-nowrap` | `figure.wp-block-image.size-full` → `U/2026/04/4e2393ae5131da6865a0a5c17d2fdf83.jpg` 720×900 (27 KB; woman with head tilted back), `style="aspect-ratio:3/4;object-fit:cover"`, `loading="lazy"`, `wp-image-5180` → p `has-text-align-right has-x-large-font-size` `style="line-height:1.2"`: `<a href="https://www.instagram.com/swaanelauwaert/">Instagram</a><br><br>` (large right-aligned underlined link). |
| 2 | p | **`Hier is de vertaling in een vloeiende, krachtige Nederlandse spreektaal:`** — a leftover AI-translation preamble that is live on the page (it is also the start of the REST excerpt). Flag for removal in the rebuild, or reproduce if fidelity is required. |
| 3 | p | Gist: we dive into what pleasure really means and open the door to full-body orgasms deeper than anything before. |
| 4 | p | Gist: see your Eros as the ultimate energy source, the creative fire that feeds your vision and drive. |
| 5 | p | Gist: this journey teaches you to stand in your power and say "no" without excuses, to live 100 % true to yourself. |
| 6 | Columns (default width) | Column `flex-basis:66.66%` → `blockquote.wp-block-quote` → p `<em><strong>Wanneer een vrouw haar Eros claimt, verandert alles. Haar uitstraling wordt magnetisch, haar creativiteit stroomt en haar grenzen worden kristalhelder.</strong></em>` (left border quote, no cite). Column `flex-basis:33.33%` **empty**. |
| 7 | **Media-text** `is-stacked-on-mobile` (media left, 50/50) | Media: `U/2026/02/59653540d6bf783e7fb741cc68cf58bb-819x1024.jpg` 819×1024 (126 KB; back/shoulder with the words "Dear body, I trust you."), `size-full` id 4466, lazy (full `59653540…cf58bb.jpg` also in `U/`). Content: p `Kom je mee spelen?` → button `Schrijf je hier in voor THE EROS SANCTUARY ` (trailing space) → `https://swaanelauwaert.myflodesk.com/erosnl` (`_blank`). |
| 8 | Quote **nested in a quote** (`blockquote.wp-block-quote > blockquote.wp-block-quote > p`) | `<em>“Ik wist niet dat ik zoveel kon voelen. Mijn zenuwstelsel is eindelijk tot rust gekomen. En ik voel me weer thuis in mijn eigen lichaam. De constante innerlijke onrust is weg, waardoor er nu ruimte is voor  zachte opwinding tot tintelende extase in mijn hele lijf!</em> Heerlijk!”` — testimonial, no author/cite; the double blockquote gives a double left border + double indent in the render. |
| 9 | **Gallery** (3, `wp-block-gallery-6`, all lazy) | `U/2026/04/8881d238fd5f3310b8212df33597bd3d-768x1024.jpg` 768×1024 id 5186; `U/2026/04/31151a884fbb0603dff8df2a67b2bc02-822x1024.jpg` 822×1024 id 5190; `U/2026/04/327d1cd8b43e66b8535f50d749193206.jpg` 736×867 id 5185 (full-size originals of the first two also in `U/`). Not painted in the render (blank area above the footer). |

CTAs: Flodesk `erosnl` ×3, Instagram link. Purchase mechanics: none on this page (wait-list only).

---

## 4. Flavours of Desire — `/nl/flavours-of-desire-3/` (page 4533)

* File: `mirror/raw/swaanelauwaert.com/nl/flavours-of-desire-3/index.html`. h1 `Flavours of Desire: mini online course at your own pace`. Default template, no featured image. Nav: `Werk met mij` › `Flavours of Desire | Voeding, Verlangen &amp; Zelfliefde`. Child page: 4990 `modules` (password-protected, §12). Renders: `nl-flavours-of-desire-3--desktop.png` (1440×2812), `--mobile.png`.
* **Purchase mechanics:** one button `Koop FLAVOURS OF DESIRE hier` → Flodesk page `https://swaanelauwaert.myflodesk.com/flavoursofdesireprogramma` (checkout happens on Flodesk; **no price is shown on the site**). The second button only jumps to the home contact form. No module list or lesson titles are public.

| # | Block | Details |
|---|---|---|
| 1 | Separator | (directly under the h1) |
| 2 | **Media-text** `is-stacked-on-mobile` (media left) | Media: `U/2026/02/a4a043d325ecfae0844bcce21546e339.jpg` 736×736 (square, 69 KB; a halved peach on pink fabric) `size-full` id 4465, `fetchpriority="high"`. Content: p `<strong>Mini Programma:</strong>` → p `<strong> FLAVOURS OF DESIRE</strong> is nu te koop!!!!` → p `<strong>Eat, Play, Love: The Sensual Kitchen Date Night.</strong>&nbsp;` → p gist: step out of routine and rediscover desire by tasting and playing together, without performance pressure → empty p → button `Koop FLAVOURS OF DESIRE hier` → `https://swaanelauwaert.myflodesk.com/flavoursofdesireprogramma` (`_blank`). |
| 3 | Group `alignfull has-global-padding` (`margin:0; padding-top/bottom: spacing-50`) → **Columns** `alignwide` | Column 1 `flex-basis:33.33%`: `figure.wp-block-image.size-full` → `U/2026/01/7e913d8245b765d0f1ef82803d7c2f7e.jpg` 577×866 (106 KB; red grapefruit macro) `style="aspect-ratio:1;object-fit:cover"` id 4298; then **Vimeo embed** `figure.wp-block-embed.is-type-video.is-provider-vimeo.wp-block-embed-vimeo.wp-embed-aspect-16-9.wp-has-aspect-ratio > div.wp-block-embed__wrapper > <iframe title="INTRO Flavours of Desire NL" src="https://player.vimeo.com/video/1177988427?dnt=1&amp;app_id=122963" width="500" height="281" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin">` (16:9). The editor's original paste was the share URL `https://vimeo.com/1177988427/b9332c6ba5?share=copy&fl=sv&fe=ci` (visible in the auto meta description) — the `b9332c6ba5` hash suggests an unlisted video; whether the player URL works without `h=b9332c6ba5` could not be verified offline (the local render shows nothing where the iframe is). Column 2 (no basis, vertically centred): h2 `Herontdek de Erotiek in het dagelijkse leven.`; p gist: when the world is too much we use food to soothe pain — a trap that fuels self-punishment and an inner critic; p gist: turning against yourself breaks the connection with your heart; frozen in a body that feels like a cage of shame; p gist: not a diet but a sensory revolution — cravings as a sacred map to ignored hungers; p gist: releasing shame (more toxic than any food) via somatic exercises, befriending the body you have today; p gist: learning to decode the body's whispers — biological hunger vs emotional emptiness — freeing your ability to feel, taste and desire; button `Ja! Ik wil het allemaal voelen!` → `https://swaanelauwaert.com/nl/#contact` (same tab, home contact form). |
| 4 | Group `alignfull has-global-padding` (`margin:0; padding-top/bottom: spacing-50`) → group `alignwide` **`is-layout-grid`** (`grid-template-columns:repeat(auto-fill,minmax(min(16rem,100%),1fr))`, gap spacing-50 → 4 cells at desktop, see render) | Cell 1: group `is-vertical` → `<h2 class="wp-block-heading has-x-large-font-size">Een tastbaar gebed:</h2>`. Cells 2–4: each `group.is-vertical.is-content-justification-stretch` → **Cover** (no alignment, no text; inner container holds only a spacer spacing-20, so the cover takes core's default `min-height:430px`) with `<img class="wp-block-cover__image-background wp-image-N size-full">` and an overlay `has-background-dim-0` whose colour is set but invisible → caption p `has-text-align-center`. Cards: (a) `U/2026/01/7c754abd9bc7f6a913a765577b33dea2.jpg` 736×863 id 4281, overlay `#833d3a`, caption `Ontvlam.`; (b) cover `is-light`, `U/2026/01/2211d321fe9f6f2c415cafa5ab80fcc2.jpg` 736×975 id 4300, overlay `#828282`, caption `Verslind.`; (c) `U/2026/01/bb3e19bbdc0e7db827b33c44fc650fdb-1.jpg` 700×875 id 4301, overlay `#d6bc98`, caption `Versmelt.` All three images `loading="lazy"` (they did paint in the render: red tulip macro, lips with a flower, red orchid). |

---

## 5. Levende Rituelen — `/nl/levende-rituelen/` (page 4541)

* File: `mirror/raw/swaanelauwaert.com/nl/levende-rituelen/index.html`. h1 `Levende Rituelen | Ceremonies &amp; Retraites`. Default template, no featured image. **Not in the NL navigation and not linked from any NL page** (only via the language switcher of `/en/rooted-rituals/` and `/fr/rituels-dancrage/`). Renders: `nl-levende-rituelen--desktop.png` (1440×5348), `--mobile.png`.

| # | Block | Details |
|---|---|---|
| 1 | Group `alignfull has-global-padding` `style="min-height:0vh;margin:0;padding-top/bottom: spacing-70;padding-left/right: spacing-40"` → group `has-global-padding` (constrained 960 px) | h2 `has-text-align-center` `De Kracht van Rituelen &amp; Ceremonies` → p `has-text-align-left` gist: a ritual is never just a gesture — a resting point anchoring nature's rhythm and life's changes in the nervous system → p gist: modern life has lost the art of marking transitions (grief→rebirth, girl→mother, silence→speaking truth); without them we race on and lose depth → p gist: rituals are essential to our collective soul and sense of belonging; also deeply personal markers → p gist: she weaves these practices through 1-op-1 sessions, online programmes and retreats → `figure.wp-block-image.size-large` → `U/2026/02/5eaaabe9572dec3fc263928e634ab651-1024x968.jpg` 1024×968 (147 KB; B&W hands arranging a circle of stones and flowers) id 4425 (full original in `U/`) → separator → h2 centred `Retraites` → p `Mijn retraites zijn meer dan een ontsnapping; <strong>het zijn heilige initiaties</strong>. …` gist: sacred initiations, in Provence or hidden places worldwide, designed to anchor healing in the body → `figure.wp-block-image.alignfull.size-full` → `U/2026/02/7d90fcb7bef2e3cc0b08a81a8c2a8586.jpg` 1199×902 (169 KB; B&W dancers on a pebble beach) id 4440. Then (still in the outer group, after the inner group) a separator. |
| 2 | Group `alignfull …` (same styles as 1) → inner group | h2 centred `Het Pad van Mary Magdalena` → p gist: in the Sainte-Baume, in the shadow of **`<strong>de heilige grot van Maria Magdalena</strong>`**, rituals bridge the land's wisdom and universal feminine wisdom; ceremonies + somatic alchemy; "Kom thuis bij de berg, eer je heilige vuur en belichaam de priesteres in jezelf." → separator → h2 centred `<strong>Geworteld in verlangen. Wild van geest. Jij bent de ontembare vrouw</strong>!` → separator → buttons `is-content-justification-center`: `Ja! Ik wil in de voetsporen treden van Maria Magdalena!` → **`https://swaanelauwaert.com/nl/maria-magdalena-retreat-zuid-frankrijk-2026/`** (`_blank`; the old `-2026` URL, see §0.1 finding 2) → `<h2 class="wp-block-heading"></h2>` (empty). |
| 3 | Group `alignfull is-style-section-1 has-global-padding is-style-section-1--5` (**grey band** #F1EEE9, `margin:0; padding-top/bottom: spacing-80`) → Columns `alignwide` | Column 1 `flex-basis:50%`: `figure.wp-block-image.alignleft.size-full` `style="margin-right:var(--wp--preset--spacing--80)"` → `U/2026/01/unnamed.jpg` 1200×891 (86 KB; Artemisia Gentileschi's *Mary Magdalene in Ecstasy*) id 4351; `figure.wp-block-image.alignright.size-full.is-resized` `style="margin-top:-50%"` → `U/2026/01/bd7ca64901bddc5947b049725270689a-2.jpg` 736×1308 (105 KB; tall portrait) id 4355 with `style="width:202px"`, lazy — intended as an overlapping collage (the second image pulled up over the first). **The render shows only the painting** (the lazy second image did not paint). Column 2 `flex-basis:50%` vertically centred, `padding-right:0;padding-left:0`: p `is-style-text-subtitle is-style-text-subtitle--6` `<em><strong>Mary Magdalene in Ecstasy</strong></em> is a painting by the female Italian baroque artist <a href="https://en.wikipedia.org/wiki/Artemisia_Gentileschi">Artemisia Gentileschi</a> (1620). ` and p `is-style-text-subtitle is-style-text-subtitle--7` `Artemisia’s Magdalene reminds us that holiness lies not in chastity, but in the raw, fleshly surrender to your own divine nature.` (both English; subtitle style = `font-size:clamp(1.5rem,…,1.75rem);line-height:1.2`). |
| 4 | Group `alignfull has-global-padding` (`margin:0; padding-top/bottom: spacing-50`) | `<h2 class="wp-block-heading alignwide">Mijn aanbod:</h2>` → Columns `alignwide` with three equal columns, each: `figure.wp-block-image.size-full` `style="margin-bottom:24px"` with `<img style="aspect-ratio:4/3;object-fit:cover" loading="lazy">` → h3 → p `has-medium-font-size`. (a) `U/2026/02/b264d97a335da7040c2173b983aa28bf.jpg` 683×1024 id 4474 / h3 `Rituelen` / `In rituelen landen we.`; (b) `U/2026/02/f2bf95b8eddfc091bb56604ab4d4d48d.jpg` 1200×1194 id 4475 / h3 `Ceremonies` / `In ceremonies transformeren we.`; (c) `U/2026/02/b40ec7271d9a610c1298162dd93302b2.jpg` 801×1200 id 4477 / h3 `Retraites` / `Tijdens retraites begeleiden we elkaar naar huis.` The three h3/p are plain text — **no links** to any offer. Images not painted in the render. |
| 5 | p | empty |

---

## 6. Kookboek — `/nl/kookboek/` (page 4914)

* File: `mirror/raw/swaanelauwaert.com/nl/kookboek/index.html`. h1 `Kookboek: The Taste of Her Journey`. Default template, no featured image. Nav: `Kookboek` (top level). Renders: `nl-kookboek--desktop.png` (1440×4025), `--mobile.png`.
* **Purchase mechanics:** four buttons, all to the same **Books2Read universal link** `https://books2read.com/u/4DwK0r` (`_blank`) — two labelled PAPERBACK, two HARDCOVER; no price on the page. Book facts: language English, ISBN 9798187568222 (paperback) / 9789090429786 (hardcover), 250 pages, 2026.

| # | Block | Details |
|---|---|---|
| 1 | **Cover** `alignfull is-light has-parallax has-accent-1-color has-text-color has-link-color` | `margin:0; padding-top:200px; padding-bottom:200px; padding-left/right: spacing-50; min-height:739px; aspect-ratio:unset`. Background `div.wp-block-cover__image-background.wp-image-5608.size-full.has-parallax` `background-image:url(U/2026/08/Screenshot-2026-08-25-001201.jpg)` (**only 496×674**, 104 KB — a close-up of a blue bowl of soup; it is stretched as a fixed background, visibly soft in the render), `background-position:50% 50%`. Overlay `has-background-dim-10` with `background-color:#9f847d` (10 % greige tint). Inner: `<h3 class="wp-block-heading has-text-align-center has-xx-large-font-size"><strong><em><strong><em>Een gedeelde droom, een gedekte tafel. Mijn debuut-kookboek is er! Ik kan niet wachten om je uit te nodigen in mijn keuken.</em></strong></em></strong></h3>` (white italic bold Floreal, centred) → empty p centred → buttons `is-content-justification-center`: `Koop de PAPERBACK hier!` (`is-style-fill`, classes `has-contrast-color has-accent-1-background-color has-text-color has-background has-link-color has-border-color has-accent-1-border-color` = **white pill, dark text**) and `Koop de HARDCOVER hier!` (same minus the border classes), both → `https://books2read.com/u/4DwK0r` (`_blank`). |
| 2 | p `has-text-align-center` | `Een zintuiglijke en poëtische reis langs de heilige landschappen van het Middellandse Zeegebied.` |
| 3 | p | `<em>The Taste of Her Journey</em> is veel meer dan een gewoon kookboek: …` gist: a sensory, historical and spiritual journey; 100 creative recipes and stories following Mary Magdalene from Galilee to the Sainte-Baume. |
| 4 | `blockquote.wp-block-quote` | p centred `“Een boek waarin koken weer een ritueel van verbinding wordt: met de seizoenen, wilde kruiden, oude legendes en vrouwelijke oerkracht.”` + an empty centred p; no cite. |
| 5 | p | empty |
| 6 | p ×4 | `<strong>Taal:</strong> Engels` / `<strong>ISBN:</strong> 9798187568222 (paperback) / 9789090429786 (hardcover)` / `<strong>Aantal pagina’s:</strong> 250 pages` / `<strong>Jaar van publicatie:</strong> 2026` |
| 7 | Separator → buttons centred `Koop de PAPERBACK hier!` (default dark pill) → separator → buttons centred `Koop de HARDCOVER hier!` → separator | both → `https://books2read.com/u/4DwK0r` (`_blank`) |
| 8 | **Jetpack Slideshow** `div.wp-block-jetpack-slideshow.aligncenter` `data-autoplay="true" data-delay="5" data-effect="slide"` | Swiper carousel (`.swiper`, `ul.swiper-wrapper`, `a.swiper-button-prev/next.swiper-button-white`, `a.wp-block-jetpack-slideshow_button-pause` `aria-label="Pause Slideshow"`, `div.swiper-pagination.swiper-pagination-white` bullets). Autoplays every 5 s. Slides (all `alt=""`): (1) `U/2026/08/MVIMG_20260817_163817_1-768x1024.jpg` 768×1024 id 5506 (`fetchpriority="high"`); (2) `U/2026/08/Photo-43-EDIT-768x1024.jpg` 768×1024 id 5507 (Swaane holding the book, blue dress); (3) `U/2026/08/Screenshot-2026-08-25-001028.jpg` 564×744 id 5606. `-scaled` originals of (1) and (2) are in `U/` and `mirror/media`. The render shows the carousel working: one ~768 px-wide slide centred, arrows left/right, pause icon top-right, three dots bottom-left. Assets: Jetpack slideshow CSS/JS + Swiper (`wp-content/plugins/jetpack/…`). |
| 9 | Separator | |
| 10 | h2 `Aan Tafel in het Land van Maria Magdalena` → p → buttons (left) → image | p gist: around the Sainte-Baume she cooks for retreat groups and creates ritual dinners from local fresh ingredients, tailored to your retreat or gathering. Button `www.lacuisineverte.com` → `https://www.lacuisineverte.com` (`_blank`). `figure.wp-block-image.size-large` → `U/2026/08/WhatsApp-Image-2026-08-14-at-17.04.05-1024x804.jpeg` 1024×804 (61 KB) id 5556, lazy (not painted in the render — blank area above the footer; full original in `U/`). |

---

## 7. Weekendretreat PLAY — `/nl/weekendretreat-27-28-29-november-2026-play/` (page 5441)

* File: `mirror/raw/swaanelauwaert.com/nl/weekendretreat-27-28-29-november-2026-play/index.html`. h1 `Weekendretreat 27-28-29 november 2026: PLAY`. Default template, no featured image, `menu_order` 13. Nav: `Werk met mij` › `Weekendretreat 27-28-29 november 2026: PLAY`. No EN/FR version. Renders: `nl-weekendretreat-27-28-29-november-2026-play--desktop.png` (1440×2921), `--mobile.png`.
* Dates: **27-28-29 november 2026**; location **Antwerpen** (only stated on the home page and in the flyer image: "PLAY – weekend retreat INNER FLOW 27-28-29 november 2026"). **No price on the page**; the programme (and presumably prices) are behind the Flodesk link; registration is by e-mail.

| # | Block | Details |
|---|---|---|
| 1 | Group `alignfull has-global-padding` (`margin:0; padding-top/bottom: spacing-50`) → Columns `alignwide` | Column 1 `flex-basis:56%`: `figure.wp-block-image.size-large` → `U/2026/08/PLAYbeeld-voor-op-flowdesk-1024x985.jpg` 1024×985 (289 KB; flyer: two women lying on stone with the word "Play" and the banner "PLAY - weekend retreat INNER FLOW / 27-28-29 november 2026") `style="aspect-ratio:1;object-fit:cover"` id 5612 (full original in `U/`). Column 2 (vertically centred): h2 `PLAY&#8230;` (`PLAY…`) → p gist: we forget how to simply play; in a world of control and "hard werken", **`<strong>PLAY</strong>`** invites you to let go ("de teugels te vieren") → p gist: the weekend is about playfulness, feminine energy and your life force — `<em>eros</em>`; softness, curiosity, pleasure; Swaane, Evi and Jessy hold a warm safe space; "Welkom in onze speeltuin!" → buttons (left, two pills side by side): `Bekijk het volledige programma ` (trailing space) → `https://swaanelauwaert.myflodesk.com/jgy17ky7ao` (`_blank`); `Schrijf je in` → **`mailto:info@swaanelauwaert.com`** (`_blank`) → empty p. |
| 2 | Group `alignfull has-global-padding` (`margin:0; padding-top/bottom: spacing-50`) → group `alignwide` `is-layout-grid` (`minmax(min(16rem,100%),1fr)`, gap spacing-50; same pattern as FoD block 4) | Cell 1: group `is-vertical` → `<h2 class="wp-block-heading has-x-large-font-size">Fall in love with life</h2>`. Cells 2–4: cover cards (image as `<img>` cover background, overlay `dim-0`, inner spacer spacing-20, default 430 px height) + centred caption: (a) `U/2026/08/54e9204e06d659f5c055fc625a80e0cb.jpg` 736×914 `size-full` id 5450, overlay `#833d3a`, caption `Moment` (poster "to do: live in the moment"); (b) `U/2026/08/752d1b97da310928b8c33c6367c0e03f-576x1024.jpg` 576×1024 `size-large` id 5451, overlay `#828282`, caption `Play` ("Hello this is life and I am begging you to come play"); (c) `U/2026/08/95067da75856898475877e5c4bd47736.jpg` 736×920 `size-full` id 5452, lazy, overlay `#d6bc98`, caption `Often` ("Play Often"). |
| 3 | h2 `Wie zijn wij?` | |
| 4 | p `<strong>Swaane Lauwaert</strong>` → p | Bio gist: somatic coach, body-oriented therapist and facilitator; embodiment, feminine energy, life force (`<em>eros</em>`); guides women (and men); Innerdance. |
| 5 | p `<strong>Evi Verstappen</strong>` → p | Bio gist: Hatha yoga teacher, integrative masseur, studying kinesiology; grounding, respecting boundaries, joy in movement. Ends with `&#8211;<a href="https://www.helder-zijn.be/" target="_blank" rel="noreferrer noopener">https://www.helder-zijn.be/</a>&#8211;` |
| 6 | p `Co-facilitator: <strong>Jessy Bettio</strong> ` → p | Bio gist: breath coach, process facilitator, space holder; breathwork, energetic work, shamanism; breathing circles. Ends with `&#8211; <a href="https://jessybettio.com/" target="_blank" rel="noreferrer noopener">https://jessybettio.com/</a>&#8211;` |

---

## 8. Maria Magdalena 'Wild&Rooted' Retreat 2027 — `/nl/maria-magdalena-retreat-zuid-frankrijk-2027/` (page 4728)

* Files: `mirror/raw/swaanelauwaert.com/nl/maria-magdalena-retreat-zuid-frankrijk-2027/index.html` and the identical alias `…-2026/index.html`. h1 `Maria Magdalena ‘Wild&amp;Rooted’ Retreat Zuid Frankrijk 5-10 april 2027`. Default template **with featured image**. Nav: `Werk met mij` › `Maria Magdalena Retreat Zuid Frankrijk 2027`. No EN/FR version. Renders: `nl-maria-magdalena-retreat-zuid-frankrijk-2027--desktop.png` (1440×12339 — very tall because of the galleries), `--mobile.png` (the `…-2026--*.png` renders are byte-identical).
* Dates: **Maandag 5 april (aankomst 14:00u) t/m zaterdag 10 april 2027 (vertrek 11:00u)**; location **‘Au Grand Chêne’, 83170 Rougiers (Var), Frankrijk**; 5 nights. **No price on the page** — "programma en de prijzen" are behind the Flodesk link `mariamagdalena2027`; booking = "stuur me een berichtje" via the same Flodesk form.

| # | Block | Details |
|---|---|---|
| 0 | Featured image `figure.wp-block-post-featured-image` (`margin-bottom: spacing-60`) | `U/2026/02/DSCF0973-1-scaled.jpg` **2560×1920** (990 KB; group of women in tall grass under trees), `alt=""`, `object-fit:cover`, `fetchpriority="high"`, srcset 300/768/1024/1536/2048/2560 w. Rendered 960 px wide, 4:3. |
| 1 | p | Gist: recharge, relax and reset in the Provence; a transformative **6-day** journey back into feminine essence, sensuality and primal power. |
| 2 | h3 `Voel jij het verlangen om te vertragen en thuis te komen in jezelf?` → p → p | p gist: life makes us lose our rhythm, voice and body; `<em>Wild &amp; Rooted</em>` invites you to let go of control in a safe nest of like-minded women. p gist: inspired by Mary Magdalene, five nights along a path from courage and vulnerability to radical self-love, freedom and joy. |
| 3 | h3 `Wat we samen gaan ervaren` → `ul.wp-block-list` (6 items, verbatim) | `<strong>Lichaamsbewustzijn &amp; beweging:</strong> Dagelijkse yogasessies (hart- en heupopeners, zachte vinyasa, Yin/Restorative met liefdevolle aanraking en diepe Yoga Nidra).` / `<strong>Innerdance &amp; Soundhealing:</strong> Een multi sensoriële beleving met speciale soundscapes` / `<strong>Systemisch werk:</strong> Familieopstellingen onder leiding van gasttherapeute Jaela Cole, gericht op relaties, kwetsbaarheid en zelfliefde.` / `<strong>Belichaamde eros &amp; sensualiteit:</strong> Zachte, krachtige oefeningen om te zakken in je bekken en jouw scheppingskracht voluit te voelen stromen.` / `<strong>Ademwerk &amp; Inner Child Healing:</strong> Ruimte maken in je systeem, oude ballast transformeren en je innerlijk kind omarmen.` / `<strong>Ceremonies &amp; Natuurrituelen:</strong> Een cacaoceremonie bij het vuur, een reinigend rivierritueel en een bezielde wandeling naar de grot van Maria Magdalena in het nabijgelegen Sainte-Baume massief.` |
| 4 | h3 `Het Domein: ‘Au Grand Chêne’` → p → p | p: `We verblijven op het idyllische domein <strong>Au Grand Chêne</strong> in Rougiers<sup></sup>. …` gist: pines, ancient oaks, wild thyme and rosemary — an oasis of rest. p gist: sun on the terrace by day, crickets at night; host **Ludivine** cooks organic local food with vegetarian options. (Note the empty `<sup></sup>` tags — leftovers of removed footnote markers; they also occur in `Jouw Begeleiding` and on the Sainte-Baume page.) |
| 5 | h3 `Jouw Begeleiding` → p `Drie vrouwen, elk met hun eigen unieke bedding en expertise, houden deze week liefdevol de ruimte voor jou<sup></sup>:` → `ul` (3 items, verbatim) | `<strong>Swaane Lauwaert:</strong> Lichaamsgericht therapeute, intimiteitscoach en Innerdance facilitator. Met zachtheid, zintuiglijkheid en een veilige aanwezigheid helpt ze je de controle los te laten en contact te maken met jouw eros: jouw ongefilterde levenslust en scheppingskracht.` / `<strong>Evi Verstappen:</strong> Gekwalificeerd Hatha yogadocent en integratief masseur. Met haar aardende energie nodigt Evi je uit om je grenzen te respecteren, diep in het hier en nu te landen en vreugde in beweging te herontdekken.` / `<strong>Jaela Cole:</strong> Seksuologisch hulpverlener, systemisch coach, auteur en co-facilitator. Jaela brengt een schat aan ervaring mee rond vrouwelijke seksualiteit, intimiteit en systemische familieopstellingen.` |
| 6 | h3 `Praktisch:` → `ul` (3 items, verbatim) | `<strong>Data:</strong> Maandag 5 april (aankomst 14:00u) t/m zaterdag 10 april 2027 (vertrek 11:00u)` / `<strong>Locatie:</strong> ‘Au Grand Chêne’, 83170 Rougiers (Var), Frankrijk` / `<strong>Inclusief:</strong> 5 nachten verblijf, beddengoed &amp; badhanddoeken, alle voedzame maaltijden, uitstappen, ceremonies, opstellingen en alle sessies.` |
| 7 | p `We hopen jou daar te mogen ontmoeten.` → buttons (left) | `Druk hier voor het programma en de prijzen` → `https://swaanelauwaert.myflodesk.com/mariamagdalena2027` (`_blank`) |
| 8 | Separator → p `Wil je mee op reis? Klik op de knop hieronder en stuur me een berichtje om je plek te reserveren.` → buttons (left) → separator | `Schrijf je in` → `https://swaanelauwaert.myflodesk.com/mariamagdalena2027` (`_blank`, `rel="noopener"`) |
| 9 | **Six galleries** in a row (`wp-block-gallery-5` … `-10`), `columns-default is-cropped`, 36 images, all `alt=""`, all under `U/2026/02/` unless noted. Images without `width/height`/`srcset` are un-resized phone originals (4000×3000 and larger, up to 8 MB — the rebuild must generate responsive variants). | **Gallery 5 (4):** `DSCF0973-1-1024x768.jpg` 1024×768 id 4743; `IMG_50241-1024x768.jpeg` id 4740; `U/2026/01/IMG_50461-768x1024.jpeg` 768×1024 id 4375 (lazy); `IMG_5461-1024x768.jpeg` id 4395 (lazy). **Gallery 6 (6, originals):** `DSCF0871.jpg` 4000×3000 7.9 MB id 4779; `20250408_095402.jpg` 4080×3060 id 4778; `20250409_123001.jpg` 4080×3060 id 4777; `DSCF0867.jpg` 4000×3000 id 4776; `DSCF0921.jpg` 4000×3000 id 4775; `20250408_153841.jpg` 4080×3060 id 4774. **Gallery 7 (7):** `20250408_182245.jpg` 4080×3060 id 4773; `20250411_084835.jpg` 4080×3060 id 4772; `IMG_5492.jpeg` 2160×3840 id 4771; `20250408_095452.jpg` 2576×1932 id 4770; `20250408_124919.jpg` 2576×1932 id 4769; `20250408_132844.jpg` 2576×1932 id 4768; `IMG_5365-1024x768.jpeg` id 4767 (lazy). **Gallery 8 (5, all lazy):** `WhatsApp-Image-2025-04-12-at-16.48.25_c02bedbb-768x1024.jpg` id 4764; `WhatsApp-Image-2025-04-12-at-19.46.35_d823a004-1024x768.jpg` id 4763; `IMG_5192-1024x768.jpeg` id 4762; `IMG_4827-768x1024.jpeg` id 4761; `IMG_4875-1024x768.jpeg` id 4760. **Gallery 9 (7, all lazy):** `IMG_4871-1024x768.jpeg` id 4759; `WhatsApp-Image-2025-04-12-at-17.12.51_9a544a06-1024x768.jpg` id 4758; `WhatsApp-Image-2025-04-12-at-15.32.09_ff18b69a-1024x768.jpg` id 4757; `WhatsApp-Image-2025-04-12-at-15.32.09_5881b57b-768x1024.jpg` id 4756; `WhatsApp-Image-2025-04-12-at-15.32.07_429cdf0d-768x1024.jpg` id 4755; `WhatsApp-Image-2025-04-12-at-15.32.06_75a9ae80-768x1024.jpg` id 4754; `WhatsApp-Image-2025-04-10-at-22.49.31_0b816f3d-768x1024.jpg` id 4753. **Gallery 10 (7):** `WhatsApp-Image-2025-04-09-at-10.59.56_6120b4ff-1024x472.jpg` 1024×472 id 4752 (lazy); `WhatsApp-Image-2025-04-09-at-07.53.48_b4b9c4b4-768x1024.jpg` id 4751 (lazy); `WhatsApp-Image-2025-04-09-at-07.53.36_ee84a043-768x1024.jpg` id 4750 (lazy); `20250407_155915.jpg` 4080×3060 id 4749 (original, not lazy); `IMG_5348-1-768x1024.jpg` id 4748 (lazy); `IMG_4894-768x1024.jpeg` id 4747 (lazy); `IMG_5169-768x1024.jpeg` id 4746 (lazy). All sized variants' originals are present in `U/` or `mirror/media` (checked). The render paints galleries 5–7 fully and only the non-lazy items further down. |

---

## 9. Over mij — `/nl/over-mij/` (page 4093)

* File: `mirror/raw/swaanelauwaert.com/nl/over-mij/index.html`. h1 `Over mij`. Default template **with featured image**. Nav: `Over mij`. Renders: `nl-over-mij--desktop.png` (1440×3009), `--mobile.png`.

| # | Block | Details |
|---|---|---|
| 0 | Featured image | `U/2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg.webp` 957×960 (16 KB WebP; the server (LiteSpeed) serves the `.jpeg.webp` variant — the plain `….jpeg` 24 KB and `-150x150`, `-300x300`, `-768x770` variants are also in `U/2018/01/`), `alt=""`, `object-fit:cover`; portrait of Swaane in a black T-shirt against a white wall; rendered 960 px wide, roughly square. |
| 1 | p ×5 | `SWAANE LAUWAERT (°1977 Belgium)` (plain, no bold) → p gist: she guides people through transformation; body therapist and Intimacy & Sex Coach; safe ground for integrating soul and body → p gist: LOVE is the heartbeat of being human; healing starts with the relation to your own body; a body that feels safe can love → p gist: lives in the shadow of the Sainte-Baume massif; leads retreats in Mary Magdalene's footsteps → p gist: as a writer she dances with words; as a professional chef the kitchen is a sensory ritual. |
| 2 | Buttons (left) | `Let’s meet!` → `https://calendly.com/swaanelauwaert/let-s-meet` (`_blank`) — Calendly. |
| 3 | Separator → h2 `Opleidingen:` → Separator | |
| 4 | p ×12 (verbatim, bold year prefixes) | `<strong>2025-2026</strong>: Layla Martin, Sex, Love and Relationship Coaching Certification` / `<strong>2025: </strong>Valley orgasm, online training` / `<strong>2024-2025</strong>: Rosie Chehade. Quantum School of Sacred Alchemy for Advanced Quantum Coach Certification. In combination with NLP and Matrix Therapies with Shereen Lister.` / `2025 : Breathwork 2-day deep dive (Jessy Bettio, Antwerp)` / `2024 : Soundhealing: workshop Marseille` / `2024 : Wim Hof: online training` / `2023 : Innerdance Facilitator Training (Antonia Hauterville & Katie Holland, Paris)` / `2022 : Innerdance Intensive (Pi Vilerazza)` / `2021 : Elliott Saxby Kundalini Online Bodycourse` / `2020 : Reiki Level 1 (Marie-Ange Aubert, Centre Alter Ego, La Seyne-sur-Mer)` / `2015 : Transcendental Meditation, Antwerp` / `2001: Family Sciences graduate, Brussels` (the exact `<strong>` placement/spacing varies per line — copy from `…/scratchpad/rest/4093-over-mij.html` or the REST JSON). |

---

## 10. Sainte-Baume Gids — `/nl/sainte-baume-gids/` (page 5541)

* File: `mirror/raw/swaanelauwaert.com/nl/sainte-baume-gids/index.html`. h1 `Sainte-Baume Gids`. Default template, no featured image. Nav: `Werk met mij` › `Sainte-Baume Gids`. EN sibling `/en/sainte-baume-guide/`, no FR. Renders: `nl-sainte-baume-gids--desktop.png` (1440×2162), `--mobile.png`.

| # | Block | Details |
|---|---|---|
| 1 | p ×4 | gist: the old forest and limestone of the Sainte-Baume are her second home; as a local guide she takes you over the old pilgrim paths → gist: not a standard hike but a sensory experience at your pace — hidden caves, ancient trees, views over the Provence; tailored to you → `Benieuwd naar de verschillende tochten of wil je samen iets op maat samenstellen<sup></sup>?` → `Bezoek mijn website:` |
| 2 | Buttons (left) | `www.saintebaumeguide.com` → `https://www.saintebaumeguide.com` (`_blank`) — external site (not in the mirror). |
| 3 | `figure.wp-block-image.aligncenter.size-large` | `U/2026/08/IMG_20260812_200654-768x1024.jpg` 768×1024 (173 KB; Swaane in a blue dress leaning on a stone wall above the Provence plain), `alt=""`, id 5588, `fetchpriority="high"`; `-scaled` original in `U/` and `mirror/media`. |

---

## 11. The Journal — `/nl/journal/` (page 78, posts page)

* File: `mirror/raw/swaanelauwaert.com/nl/journal/index.html`; paginated copies `index.html?query-1-page=N.html` (N = 1, 2, 3, 4, 5, 6, 8, 20, 21, 22, 23, 24) in the same folder. Body class `blog wp-embed-responsive wp-theme-twentytwentyfive` — rendered by the theme's **home** template (`twentytwentyfive//home`), not by the page content. Nav: `The Journal`. Renders: `nl-journal--desktop.png` (1440×2397), `--mobile.png`.
* **No `<main>` element** on this page; after the sticky header group comes `div.wp-block-group.ona-container.has-global-padding` (`margin:0`). The classes `ona-container`, `ona-post` and `hover-scale` have **no CSS** anywhere in the page (no effect; probably from an earlier "Ona" theme).

| # | Block | Details |
|---|---|---|
| 1 | Spacer `height:40px` | |
| 2 | `<h1 class="wp-block-heading has-text-align-center"></h1>` | empty |
| 3 | Buttons `is-content-justification-center` | `<div class="wp-block-button is-style-fill"><a class="wp-block-button__link wp-element-button">SUBSTACK</a></div>` — **no `href`**: renders as a dark pill that does nothing. (The Substack URL is in the quote below.) |
| 4 | `blockquote.wp-block-quote` (left border) | `<h1 class="wp-block-heading has-text-align-center">The Journal </h1>` (trailing space) → p `Ik schrijf over wat voor mij werkelijk van belang is: familie, mijn werk, de natuur, kunst, Maria Magdalena en het eenvoudige dagelijks leven!` → p `VOLG ME OP: <a href="https://substack.com/@swaanelauwaert1">https://substack.com/@swaanelauwaert1</a>` |
| 5 | Spacer `height:20px` | |
| 6 | **Query loop** `div.wp-block-query.alignwide` → `ul.columns-3.ona-post.is-style-default.wp-block-post-template` (`is-layout-grid`, `grid-template-columns:repeat(3,minmax(0,1fr))`, `gap: spacing-70`) | **9 posts per page**, newest first, all Dutch posts (`post` type). Each `li.wp-block-post.post-{id}.has-post-thumbnail…category-{slug}` → `article.wp-block-group`: (a) `figure.hover-scale.wp-block-post-featured-image > a[href=post][target=_self] > img.attachment-post-thumbnail.size-post-thumbnail.wp-post-image` with `style="aspect-ratio:4/3;width:100%;object-fit:cover;"`, `loading="lazy"`, **`alt` = post title**, full srcset; (b) `div.wp-block-group` `style="padding-right:10%;padding-left:10%"` > `h2.wp-block-post-title.has-text-align-center > a[href=post]`; (c) `div.wp-block-post-date.has-text-align-center > time[datetime]` in Dutch long format (`17 oktober 2018`). Page-1 items: `cent vingt deux.` (2018-10-17, `U/2018/10/44175512_10157880861444832_997186630404014080_o.jpg` 1707×2048), `cent vingt et un.` (2018-10-10, `U/2018/10/20181006_213843-D-scaled.jpg`), `cent vingt.` (2018-10-09, `U/2018/10/Instant_20181007_103126.jpeg`), `cent dix neuf.` (2018-10-08, `U/2018/10/IMG_20181006_175859-B-scaled.jpg`), `cent dix huit.` (2018-10-07, `U/2018/10/Ventemiglia-B.jpg`), `cent dix sept.` (2018-09-30, slug `cent-dix-sept-2`, `U/2018/09/20180930_1403500-B-scaled.jpg`), `cent seize.` (2018-09-11, slug `cent-dix-sept`, `U/2018/09/20180830_105528-B-scaled.jpg`), `cent quinze.` (2018-09-09, `U/2018/09/Instant_20180829_135205.jpeg`), `cent quatorze.` (2018-09-03, `U/2018/09/Scan-2-scaled.jpeg`). The Polaroid frames seen in the render are part of the photos themselves. |
| 7 | Spacer `height:20px` | |
| 8 | Pagination `nav.wp-block-query-pagination.is-content-justification-center` `aria-label="Paginering"` | `div.wp-block-query-pagination-numbers`: `<span aria-current="page" class="page-numbers current">1</span> <a class="page-numbers" href="?query-1-page=2">2</a> <a … href="?query-1-page=3">3</a> <span class="page-numbers dots">&hellip;</span> <a … href="?query-1-page=24">24</a>` then `<a href="/nl/journal/?query-1-page=2" class="wp-block-query-pagination-next">Volgende pagina<span class="wp-block-query-pagination-next-arrow is-arrow-arrow" aria-hidden="true">→</span></a>`. **24 pages × 9 = 216 slots for the 210 published posts** (`mirror/api/posts-p1..3.json`). No "previous" link on page 1; the inner pages presumably show `← Vorige pagina` (not verified — only some paginated copies were mirrored, see the list above). |
| 9 | Spacer `height:80px` | then the footer |

---

## 12. Password-protected module pages (REST only — content NOT recoverable)

| id | URL | title | parent | status | what the REST dump shows |
|---|---|---|---|---|---|
| 4990 | `/nl/flavours-of-desire-3/modules/` | `Flavours of Desire Modules Nederlands` | 4533 (child of the FoD page) | publish, `content.protected: true`, `content.rendered: ""`, `excerpt.rendered: ""`, `jetpack_seo_noindex: true`, `class_list` has `post-password-required`; modified 2026-04-22 | nothing else — no body, no featured image |
| 5236 | `/nl/the-eros-sanctuary-modules/` | `The Eros Sanctuary Modules (Nederlands)` | 0 | publish, `content.protected: true`, `content.rendered: ""`, `class_list` has `post-password-required`; modified 2026-08-31 | nothing else |

Neither URL was fetched by wget (no HTML in `mirror/raw`), no page in the mirror links to them, and `mirror/pages.json` has no entry for them. The visitor-facing version on the live site is WordPress's password form (`Deze inhoud is beveiligd met een wachtwoord…` + password field) — not captured. **Module titles, lesson titles, videos and any pricing/purchase mechanics for the two courses are therefore absent from this snapshot** and must be supplied by the site owner (export from WP admin, or the Flodesk product pages `flavoursofdesireprogramma` / `erosnl`).

---

## 13. Cross-page inventories

### 13.1 Every outbound / interactive link on the Dutch pages

| Target | Label (verbatim) | Page(s) | Type |
|---|---|---|---|
| `https://swaanelauwaert.myflodesk.com/g8dtc4po0h` | `Yes! I am ready to reclaim my most sacred desire!` / `Join us!` | home band A / samenwerken cover | Flodesk sign-up form |
| `https://swaanelauwaert.myflodesk.com/erosnl` | `Yes! Ignite my inner fire!` (×2) / `Schrijf je hier in voor THE EROS SANCTUARY ` | the-eros-sanctuary | Flodesk wait-list |
| `https://swaanelauwaert.myflodesk.com/flavoursofdesireprogramma` | `Koop FLAVOURS OF DESIRE hier` | flavours-of-desire-3 | Flodesk checkout (price unknown) |
| `https://swaanelauwaert.myflodesk.com/jgy17ky7ao` | `Bekijk het volledige programma ` | weekendretreat | Flodesk page (programme) |
| `https://swaanelauwaert.myflodesk.com/mariamagdalena2027` | `Druk hier voor het programma en de prijzen` / `Schrijf je in` | MM retreat 2027 | Flodesk page (programme + prices + booking) |
| `https://calendly.com/swaanelauwaert/let-s-meet` | `Let’s talk!` / `Let’s meet!` | samenwerken / over-mij | Calendly booking |
| `https://books2read.com/u/4DwK0r` | `[Ontdek het boek &amp; bestel jouw exemplaar →]` / `Koop de PAPERBACK hier!` ×2 / `Koop de HARDCOVER hier!` ×2 | home / kookboek | Books2Read universal buy link |
| `mailto:info@swaanelauwaert.com` | `Schrijf je in` | weekendretreat | e-mail registration |
| `https://www.saintebaumeguide.com` | `www.saintebaumeguide.com` | sainte-baume-gids | external site |
| `https://www.lacuisineverte.com` | `www.lacuisineverte.com` | kookboek | external site |
| `https://www.helder-zijn.be/`, `https://jessybettio.com/` | (URL as text) | weekendretreat | co-facilitator sites |
| `https://www.instagram.com/swaanelauwaert/` | `Instagram` | the-eros-sanctuary | social |
| `https://en.wikipedia.org/wiki/Artemisia_Gentileschi` | `Artemisia Gentileschi` | levende-rituelen | reference |
| `https://substack.com/@swaanelauwaert1` | (URL as text) | journal | Substack profile; the `SUBSTACK` button itself has no href |
| `https://swaanelauwaert.com/nl/#contact` | `Feel free to reach out.` / `Ja! Ik wil het allemaal voelen!` | samenwerken / flavours-of-desire-3 | anchor to the home contact form |
| `https://swaanelauwaert.com/nl/maria-magdalena-retreat-zuid-frankrijk-2026/` | `Ja! Ik wil in de voetsporen treden van Maria Magdalena!` | levende-rituelen | **stale URL** → needs redirect to `…-2027/` |
| `https://player.vimeo.com/video/1177988427?dnt=1&app_id=122963` | iframe `INTRO Flavours of Desire NL` | flavours-of-desire-3 | only embed/iframe on the Dutch pages |
| `#` | `Facebook`, `Instagram` social icons | samenwerken | dead links |

### 13.2 Prices and dates found

* `Eén sessie van 60 minuten: €75` (samenwerken) — the **only price** on the Dutch site.
* PLAY weekend: `27-28-29 november 2026`, Antwerpen (home: `Weekendretreat: PLAY (Antwerpen, 27-29 November 2026)`).
* Maria Magdalena retreat: `Maandag 5 april (aankomst 14:00u) t/m zaterdag 10 april 2027 (vertrek 11:00u)`, `‘Au Grand Chêne’, 83170 Rougiers (Var), Frankrijk`; home: `(Zuid-Frankrijk, 5–10 April 2027)`.
* Eros Sanctuary: `de deuren openen in 2027`; `6 weken live online programma` (title only).
* Cookbook: `Jaar van publicatie: 2026`, ISBNs above.
* Bio: `°1977 Belgium`; training list 2001–2026.

### 13.3 Forms / scripts needed

* Jetpack contact form (home only) — backend required (see chrome.md §3.4).
* Jetpack Slideshow / Swiper (kookboek) — the only JS component on an inner page; needs a carousel in the rebuild (autoplay 5 s, arrows, pause, bullets).
* Vimeo iframe (FoD).
* Parallax (`has-parallax` = `background-attachment:fixed`) on the home and kookboek covers (core disables it on mobile / reduced motion).
* Core navigation interactivity (mobile overlay, submenu toggles) — see chrome.md.

### 13.4 Content-quality notes for the rebuild (reproduce or fix — decide with the owner)

1. `the-eros-sanctuary`: leftover line `Hier is de vertaling in een vloeiende, krachtige Nederlandse spreektaal:`.
2. English strings on Dutch pages: `We don’t heal alone, we heal together.`, `Join us!`, `Got questions? Feel free to reach out.`, `Let’s talk!`, `Let’s meet!`, `Yes! Ignite my inner fire!`, `Yes! I am ready to reclaim my most sacred desire!`, `Are you ready to trade the numbness for the nectar?`, `Do you have a question? Feel free to reach out.`, `Fall in love with life`, `Moment / Play / Often`, the two Artemisia captions, the `Flavours of Desire: mini online course at your own pace` title, `The Journal`, `250 pages`.
3. Empty blocks that only add whitespace: samenwerken blocks 3–4 (empty grid group, empty h2, empty columns), levende-rituelen empty `<h2>` and trailing `<p>`, kookboek/eros/weekend/FoD empty `<p>`s, journal empty `<h1>`.
4. Dead/odd links: `SUBSTACK` button without href; `#` social icons on samenwerken; `-2026` retreat URL on levende-rituelen; `data-id="https://https://…"` typo on the samenwerken contact link (harmless).
5. Orphan page: `levende-rituelen` is unreachable from the NL menu.
6. Empty `<sup></sup>` tags (MM retreat ×4, sainte-baume ×1).
7. Nested `<blockquote>` on the-eros-sanctuary (double border); quadruple `<strong><em>` nesting in the kookboek h3.
8. Tiny source images used large: kookboek cover background 496×674; Eros `og:image` is a 150×150 thumbnail.
9. MM retreat galleries ship 13 un-resized originals (2–8 MB each, 4000 px wide).

### 13.5 Asset checklist (all verified present; `U/` = `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/`)

* Home: `U/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg`, `U/2026/08/MVIMG_20260817_163022_1-768x1024.jpg` (+`-scaled`), band gallery `U/2026/08/IMG-20260404-WA0004.jpg`, `U/2026/08/IMG_5348-768x1024.jpeg` (+`IMG_5348.jpeg`), `U/2026/08/MVIMG_20260817_163817_1-768x1024.jpg`.
* Samenwerken: `U/2026/08/DSC03534-1024x683.jpg` (+`-scaled`, `-1536x1024`, `-2048x1365`), `U/2026/10/Screenshot-2026-10-10-105756.png`.
* Eros: `U/2026/04/0e9a4aa194478ed4c418f7fa9463bea9.jpg`, `30e0d24c3b2ebaf63a21f5c7f874a14d.jpg`, `af472e9b5594e4b72110cae15f9792dc.jpg`, `4e2393ae5131da6865a0a5c17d2fdf83.jpg`, `8881d238fd5f3310b8212df33597bd3d-768x1024.jpg`, `31151a884fbb0603dff8df2a67b2bc02-822x1024.jpg`, `327d1cd8b43e66b8535f50d749193206.jpg`; `U/2026/02/59653540d6bf783e7fb741cc68cf58bb-819x1024.jpg`.
* FoD: `U/2026/02/a4a043d325ecfae0844bcce21546e339.jpg`; `U/2026/01/7e913d8245b765d0f1ef82803d7c2f7e.jpg`, `7c754abd9bc7f6a913a765577b33dea2.jpg`, `2211d321fe9f6f2c415cafa5ab80fcc2.jpg`, `bb3e19bbdc0e7db827b33c44fc650fdb-1.jpg`.
* Levende rituelen: `U/2026/02/5eaaabe9572dec3fc263928e634ab651-1024x968.jpg`, `7d90fcb7bef2e3cc0b08a81a8c2a8586.jpg`, `b264d97a335da7040c2173b983aa28bf.jpg`, `f2bf95b8eddfc091bb56604ab4d4d48d.jpg`, `b40ec7271d9a610c1298162dd93302b2.jpg`; `U/2026/01/unnamed.jpg`, `bd7ca64901bddc5947b049725270689a-2.jpg`.
* Kookboek: `U/2026/08/Screenshot-2026-08-25-001201.jpg`, `MVIMG_20260817_163817_1-768x1024.jpg`, `Photo-43-EDIT-768x1024.jpg` (+`-scaled`), `Screenshot-2026-08-25-001028.jpg`, `WhatsApp-Image-2026-08-14-at-17.04.05-1024x804.jpeg` (+ original).
* Weekend PLAY: `U/2026/08/PLAYbeeld-voor-op-flowdesk-1024x985.jpg` (+ original), `54e9204e06d659f5c055fc625a80e0cb.jpg`, `752d1b97da310928b8c33c6367c0e03f-576x1024.jpg` (+ original), `95067da75856898475877e5c4bd47736.jpg`.
* MM retreat: `U/2026/02/DSCF0973-1-scaled.jpg` + the 36 gallery files listed in §8 (one under `U/2026/01/`).
* Over mij: `U/2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg(.webp)`.
* Sainte-Baume: `U/2026/08/IMG_20260812_200654-768x1024.jpg` (+`-scaled`).
* Journal page 1: the nine 2018 featured images listed in §11 (`U/2018/09/`, `U/2018/10/`).

---

## 14. What could not be determined from the mirror

1. The content of the two password-protected module pages (4990, 5236): module/lesson titles, media, prices, purchase flow.
2. Prices of Flavours of Desire, the PLAY weekend and the Maria Magdalena retreat (all behind Flodesk pages that are not in the mirror), and the content of every Flodesk form/page.
3. Whether `/nl/maria-magdalena-retreat-zuid-frankrijk-2026/` is a 301 or a 200 alias on the live server.
4. Whether the Vimeo player URL (`…/video/1177988427?dnt=1&app_id=122963`, without the `b9332c6ba5` hash) actually plays for visitors.
5. The exact rendered height of the home cover (`80.4vh`) and parallax behaviour on real devices; the renders are static.
6. Appearance of the lazy-loaded images in context (home image #20, band gallery, Eros gallery 2, levende-rituelen collage second image and offer thumbnails, kookboek last image, most MM retreat galleries) — files exist but the headless renders left those areas blank.
7. The Jetpack contact-form recipient address and the `SUBSTACK` button's intended link.
8. Journal pages 7, 9–19 were not mirrored (only 1–6, 8, 20–24); the inner-page "previous" link markup is assumed from WordPress defaults.
