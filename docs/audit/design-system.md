# Design-system audit — swaanelauwaert.com

Source of truth: the wget mirror under `mirror/raw/swaanelauwaert.com/` (184 rendered HTML pages, WordPress 7.1.3, block theme **Twenty Twenty-Five** with a customised `theme.json`, plugins Polylang 3.9.x, Jetpack 16.3.1, Otter Blocks, Akismet). Everything below was read from the inlined `<style>` blocks and the linked block CSS in the mirror; the live site was not reachable. Where a value could not be derived from the mirror this is stated explicitly.

Companion file: **`docs/audit/global-styles.css`** — verbatim copies of the `wp-fonts-local`, `global-styles-inline-css`, `block-style-variation-styles-inline-css`, `core-block-supports-inline-css` and `twentytwentyfive-style-inline-css` blocks from `mirror/raw/swaanelauwaert.com/en.html` (sections 1–5), plus an addendum (section 6) with the per-block rules WordPress only inlines on pages that use those blocks (posts, archives, quotes, columns, lists, comments).

Pages used for cross-checking: `en.html`, `nl.html`, `fr.html`, `en/about/index.html`, `nl/over-mij/index.html`, `en/work-with-me/index.html`, `en/cookbook/index.html`, `en/rooted-rituals/index.html`, `nl/journal/index.html`, `nl/2018/08/03/cent-trois/index.html`, `nl/2018/07/04/quatre-vingt-neuf/index.html`. The preset/root part of the global-styles block is byte-identical on all 184 pages; pages differ only in the per-block rules appended after it (12 distinct hashes, all accounted for in the addendum).

Local renders referenced: `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/local-shots/en--desktop.png` (1440px) and `en--mobile.png` (390px), plus `nl-journal--desktop.png`, `nl-2018-08-10-cent-cinq--desktop.png`, `en-work-with-me--desktop.png` (87 PNGs in that folder in total).

---

## 1. Fonts

### 1.1 `@font-face` declarations (from `<style class="wp-fonts-local">`, identical on every page)

| Family | Style / weight | File (relative to `mirror/raw/swaanelauwaert.com/`) | Size |
|---|---|---|---|
| **Beiruti** | normal, variable `200 900` | `wp-content/themes/twentytwentyfive/assets/fonts/beiruti/Beiruti-VariableFont_wght.woff2` | 176,048 B |
| **Literata** | normal 200 | `wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-ExtraLight.woff2` | 16 files, 1.7 MB total |
| Literata | italic 200 | `…/literata/Literata72pt-ExtraLightItalic.woff2` | |
| Literata | normal 300 | `…/literata/Literata72pt-Light.woff2` | |
| Literata | italic 300 | `…/literata/Literata72pt-LightItalic.woff2` | |
| Literata | normal 400 | `…/literata/Literata72pt-Regular.woff2` | |
| Literata | italic 400 | `…/literata/Literata72pt-RegularItalic.woff2` | |
| Literata | normal 500 | `…/literata/Literata72pt-Medium.woff2` | |
| Literata | italic 500 | `…/literata/Literata72pt-MediumItalic.woff2` | |
| Literata | normal 600 | `…/literata/Literata72pt-SemiBold.woff2` | |
| Literata | italic 600 | `…/literata/Literata72pt-SemiBoldItalic.woff2` | |
| Literata | normal 700 | `…/literata/Literata72pt-Bold.woff2` | |
| Literata | italic 700 | `…/literata/Literata72pt-BoldItalic.woff2` | |
| Literata | normal 800 | `…/literata/Literata72pt-ExtraBold.woff2` | |
| Literata | italic 800 | `…/literata/Literata72pt-ExtraBoldItalic.woff2` | |
| Literata | normal 900 | `…/literata/Literata72pt-Black.woff2` | |
| Literata | italic 900 | `…/literata/Literata72pt-BlackItalic.woff2` | |
| **Floreal** | normal 400 only | `wp-content/uploads/sites/50/fonts/floreal.woff` (WOFF 1.0 wrapping TrueType) | 31,344 B |

All faces use `font-display:fallback`. Only one Floreal face exists (regular 400, no italic, no bold) — browsers synthesise bold/italic when `<strong>`/`<em>` sit inside headings (e.g. the home-page `<h2><strong>1. Coaching, Bodywork &amp; Intimacy:</strong></h2>` renders as faux-bold Floreal).

Preset variables:

```css
--wp--preset--font-family--beiruti: Beiruti, sans-serif;
--wp--preset--font-family--literata: Literata, serif;
--wp--preset--font-family--floreal: Floreal;          /* no fallback family declared */
```

The utility classes `.has-beiruti-font-family`, `.has-literata-font-family`, `.has-floreal-font-family` are generated but **never used** in any page markup (0 occurrences across 184 pages). Font choice is entirely driven by element rules below.

### 1.2 Which font where (element rules from `global-styles-inline-css`)

| Element | Family | Weight | Size | Line-height | Letter-spacing / transform | Colour |
|---|---|---|---|---|---|---|
| `body` | Literata | **300** | `--wp--preset--font-size--medium` | 1.6 | `-0.01em` | `accent-4` #5F5F5F |
| `h1`–`h6` | **Floreal** | 400 | see §3 | **1.02** | `-0.02em` | `accent-3` #000000 |
| `h4` | Floreal | 400 | medium | 1.02 | `text-transform:uppercase` | |
| `h5` | Floreal | 400 | medium | 1.02 | `letter-spacing:0px` | |
| `h6` | Floreal | **700** | small | 1.02 | `letter-spacing:1.4px; text-transform:uppercase` | |
| `.wp-block-site-title` (header `<p>` and footer `<h2>`) | Floreal | 400 | header: `has-x-large-font-size`; footer: h2 default (x-large) | **1.1** | `letter-spacing:0px; text-transform:uppercase` | inherits (#5F5F5F body colour in header; renders as grey-black "SWAANE LAUWAERT") |
| `.wp-block-post-title` | inherits heading (Floreal) | | h1/h2/h3 as rendered | | | `accent-3` #000 |
| Buttons `.wp-element-button, .wp-block-button__link` | `font-family:inherit` → overridden for core buttons by `.wp-block-button .wp-block-button__link { font-family: Beiruti }` | `font-weight:inherit` (→ 300 from body) | medium | inherit | inherit | text `accent-1` #fff on `contrast` #191919 |
| Navigation `.wp-block-navigation` | inherits body → Literata 300 | | medium | | no underline | `contrast` for links |
| Captions `.wp-element-caption`, `figcaption` of image/gallery/embed/audio/video/table | Literata | | small | **1.4** | | |
| Pullquote `.wp-block-pullquote` | **Beiruti** | **500** | xx-large | **1** | | `accent-3` #000 |
| Pullquote `cite` | | | small | | `font-style:normal` | |
| Quote `.wp-block-quote` | Literata | 300 | medium | | | 2px left border currentColor |
| Quote `cite` | | 300 | small | | normal | `cite sub` 0.65em |
| Post date `.wp-block-post-date` | | | small | | | `accent-4` #5F5F5F |
| Post terms `.wp-block-post-terms` | | 300 | small | | `a { white-space:nowrap }` | |
| Query pagination | | 300 | medium | | | |
| Post navigation link | | | medium | | | |
| Comments form | | | medium; labels small | | | |
| Comment author name | | | small | | | `accent-4` |
| Comment date / reply link | | | small | | | `contrast` |
| Comment content | | | medium | | | |
| List `.wp-block-list` | | | | **1.3**, `li { margin-top:.5rem }` | | |
| `p.is-style-text-subtitle` (block style, 3 pages) | inherits Literata | | `clamp(1.5rem, 1.5rem + ((1vw - 0.2rem) * 0.392), 1.75rem)` | 1.2 | | |
| `p.is-style-text-display` (1 page: `nl/samenwerken`) | inherits Literata | | `clamp(2.2rem, 2.2rem + ((1vw - 0.2rem) * 1.333), 3.5rem)` | 1.2 | | |

Theme `style.min.css` additions: `blockquote,caption,figcaption,h1,h2,h3,h4,h5,h6,p { text-wrap:pretty }`, `.more-link{display:block}`, `:where(pre){overflow-x:auto}`.

### 1.3 Inline typographic overrides found in page markup (`style="…"`, counts across 184 pages)

| Inline style | Where | Count |
|---|---|---|
| `font-style:italic;font-weight:400` | footer small-text group ("All Rights Reserved / © Swaane Lauwaert / Photography / Pinterest, Unsplash") | 184 (every page) |
| `font-style:normal;font-weight:700;letter-spacing:1.4px;text-transform:uppercase` | `<h2 class="wp-block-heading alignwide has-small-font-size">Meer berichten</h2>` on single posts (an h6-look applied to an h2) | 76 |
| `font-weight:300` | `.taxonomy-category.wp-block-post-terms` in the post byline | 76 |
| `font-style:normal;font-weight:700` | home-page cover `<h1 … wp-block-post-title has-xx-large-font-size>Swaane Lauwaert</h1>` | 8 (en/nl/fr homes + root index + .orig duplicates) |
| `line-height:1.2` | paragraphs/headings on 61 pages (e.g. `en/body-untamed`, `nl/2018/08/17/cent-sept`) | 4 unique occurrences |
| `font-style:normal;font-weight:400` | one heading | 1 |

---

## 2. Colour palette

### 2.1 Theme palette (`--wp--preset--color-*`) and where each is used

| Slug | Value | Used for |
|---|---|---|
| `base` | **#fff7e6** (warm cream) | `body { background-color }`; header group `has-base-background-color`; navigation overlay and dropdown containers (`has-base-background-color`); `section-5` text colour; button **hover** text colour; cover overlay on `en/body-untamed` / `en/the-eros-sanctuary-2` / `fr/le-corps-libre` / `nl/the-eros-sanctuary` (`has-base-background-color has-background-dim-100`, i.e. the image is fully hidden behind cream); work-with-me trio overrides the dark `section-5` band back to cream with `has-base-background-color` |
| `contrast` | **#191919** | links `a:not(.wp-element-button)`; button background; nav overlay/dropdown text (`has-contrast-color`, 564 occurrences); `section-1` band text; home cover background span (`has-contrast-background-color`, hidden by `dim-0`); default `section-5` background; comment date & reply link; `.wp-elements-1 a` on 4 pages |
| `accent-1` | **#FFFFFF** | button text; cover text/link colour on the three home pages and the cookbook trio (`has-accent-1-color has-link-color`, `.wp-elements-1 a`, `.wp-elements-2 a`); headings inside the cookbook cover (`.wp-elements-1 h1…h6`); cookbook CTA button background + border (`has-accent-1-background-color has-accent-1-border-color`, 3 pages) |
| `accent-2` | **#c60000** (red) | link **hover** colour site-wide; background of the two-column block on `en/work-with-me`, `fr/accompagnement`, `nl/samenwerken` (`has-accent-2-background-color`, red panel in `en-work-with-me--desktop.png`) |
| `accent-3` | **#000000** | all headings; post titles; pullquote text; query title; footer social icons (`has-accent-3-color`, 369 occ.); 2-column block text on work-with-me |
| `accent-4` | **#5F5F5F** | body text; post date; single-post byline group (`has-accent-4-color`, 76); comment author; button focus outline |
| `accent-5` | **#F1EEE9** (warm light grey) | background of `.wp-block-group.is-style-section-1` — **the grey band** (home pullquote/CTA/gallery/contact band, `rooted-rituals` columns band). 17 occurrences on 9 + 6 + 2 pages |
| `accent-6` | **#19191933** (black at 20 %) | separators (`.wp-block-separator { color: accent-6; border-bottom 1px }`); post-list row `border-bottom-color` (304); post-navigation `border-top-color` (76); post-terms pill border; comment-form field borders |

WordPress default palette slugs (`black`, `cyan-bluish-gray`, `white`, `pale-pink`, `vivid-red`, `luminous-vivid-orange`, `luminous-vivid-amber`, `light-green-cyan`, `vivid-green-cyan`, `pale-cyan-blue`, `vivid-cyan-blue`, `vivid-purple`) and all 12 gradients are declared but **never referenced** by any `has-*-color/background/gradient` class in the markup (0 occurrences). Likewise `.has-very-light-gray-*`/`.has-very-dark-gray-*` from `wp-block-library` are unused.

Shadows: `--wp--preset--shadow--natural: 0px 3px 6px 0 rgba(0,0,0,0.2)` is used on the sticky header (`style="box-shadow:var(--wp--preset--shadow--natural)"`, 184 pages) and on every core button. `deep`, `sharp`, `outlined`, `crisp` are unused.

### 2.2 Inline hex colours in page HTML (`grep style="…color"`)

| Value | Context | Pages |
|---|---|---|
| `color:#2c261e` | `<li style="color:#2c261e" class="wp-social-link … has-accent-3-color">` on both footer social icons. The `has-accent-3-color` class carries `!important`, so the rendered icon colour is **#000**, not #2c261e | 184 (368 occ.) |
| `padding:10px;background:#171717;color:#939393;font-size:14px;text-align:center` | `<div id="network-info">` host bar below the footer: `Site by <a>Pharéo</a> \| Hosted on <a>The Permanently Moving Network</a>` (links `https://phareo.eu`, `https://status301.net/`); hidden by script when in an iframe | 184 |
| `color:#ccc;font-size:14px` | the two links inside that bar | 184 (368 occ.) |
| `background-color:#833d3a`, `#828282`, `#d6bc98` | `<span class="wp-block-cover__background has-background-dim-0 …">` on cover blocks — overlay colours set but at **0 opacity** (invisible) | `en/flavours-of-desire`, `fr/flavours-of-desire-2`, `nl/flavours-of-desire-3`, `nl/weekendretreat-27-28-29-november-2026-play` |
| `background-color:#a0a192` | cookbook cover overlay at `has-background-dim-10` (10 % greige tint over the parallax image) | `en/cookbook`, `fr/livre-de-cuisine` |
| `background-color:#9f847d` | same on the Dutch cookbook | `nl/kookboek` |

No `rgb()`/`rgba()` inline colours occur in the markup. Core CSS colours that do show: `.wp-block-post-comments-form input { border:1px solid #949494 }` (overridden by theme to `accent-6`), nav dropdown fallback `#fff / rgba(0,0,0,.15)` (not hit, because the dropdown has an explicit base background), skip-link `#eee/#444`, Jetpack form vars (`--jetpack--contact-form--border-color:#8c8f94`, error `#b32d2e`), Jetpack sharing brand colours, Otter slider arrows `#fff` on `rgba(0,0,0,.5)`.

Favicon: red pomegranate icon JPGs at `wp-content/uploads/sites/50/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector-{32x32,192x192,180x180}.jpg` (the 270×270 `msapplication-TileImage` is referenced but **not in the mirror**).

---

## 3. Type scale

### 3.1 Font-size presets

```css
--wp--preset--font-size--small:    0.9rem;
--wp--preset--font-size--medium:   clamp(1rem, 1rem + ((1vw - 0.2rem) * 0.314), 1.2rem);
--wp--preset--font-size--large:    clamp(1.6rem, 1.6rem + ((1vw - 0.2rem) * 0.314), 1.8rem);
--wp--preset--font-size--x-large:  clamp(1.8em, 1.8rem + ((1vw - 0.2em) * 0.627), 2.2rem);   /* note the em/rem mix is in the source */
--wp--preset--font-size--xx-large: clamp(2rem, 2rem + ((1vw - 0.2rem) * 1.255), 2.8rem);
```

Legacy sizes from `wp-block-library` also exist (`--wp--preset--font-size--normal:16px`, `--huge:42px`, `.has-regular-font-size`, `.has-larger-font-size:2.625em`) — unused.

Computed at 16 px root: small 14.4 px; medium 16 → 19.2 px (reaches max at ≈1340 px viewport); large 25.6 → 28.8 px; x-large 28.8 → 35.2 px; xx-large 32 → 44.8 px (max at ≈1340 px).

### 3.2 Heading mapping

| | size preset | other |
|---|---|---|
| h1 | xx-large | Floreal 400, lh 1.02, ls −0.02em |
| h2 | x-large | |
| h3 | large | |
| h4 | medium | uppercase |
| h5 | medium | ls 0 |
| h6 | small | 700, ls 1.4px, uppercase |

### 3.3 Size-class usage in markup (occurrences across 184 pages)

| Class | Occurrences | Typical use |
|---|---|---|
| `has-small-font-size` | 418 | footer meta group (184), post byline, "Liability Statement" group on home, "Meer berichten" heading, subscribe blurb, contact-form inputs (`has-small-font-size` on `.wp-block-jetpack-input`) |
| `has-large-font-size` | 333 | `<h3 class="wp-block-post-title has-large-font-size">` rows in the "Meer berichten" related list (4 per post page), some page headings |
| `has-x-large-font-size` | 269 | header site title `<p>` (184), `<h2 class="wp-block-heading has-x-large-font-size">Reacties</h2>` (76) |
| `has-medium-font-size` | 15 | paragraphs inside columns/cards on `rooted-rituals`, `work-with-me` trios |
| `has-xx-large-font-size` | 14 | home cover h1 (all langs), `<h2 … has-xx-large-font-size>` in the work-with-me hero cover, cookbook cover `<h3 class="wp-block-heading has-text-align-center has-xx-large-font-size">` |

Alignment classes: `has-text-align-center` 1565, `has-text-align-right` 308 (post dates in lists), `has-text-align-left` 21. Drop caps (`has-drop-cap`), `is-small-text`/`is-large-text` etc.: 0.

---

## 4. Spacing & layout

### 4.1 Widths and root padding

```css
:root { --wp--style--global--content-size: 960px; --wp--style--global--wide-size: 1340px; }
body  { --wp--style--root--padding-top: 0px;
        --wp--style--root--padding-right: var(--wp--preset--spacing--50);   /* clamp(30px,5vw,50px) */
        --wp--style--root--padding-bottom: 0px;
        --wp--style--root--padding-left:  var(--wp--preset--spacing--50); }
```

`.is-layout-constrained > *` is capped at 960 px and centred; `.alignwide` at 1340 px; `.alignfull` breaks out by negative margins equal to the root padding (`.has-global-padding > .alignfull`). `.has-global-padding` appears 1228×, `is-layout-constrained` 1228×, `is-layout-flow` 2361×, `is-layout-flex` 3394×, `is-layout-grid` 82×. `alignfull` 1014×, `alignwide` 857×, `aligncenter` 238×, `alignleft` 3×, `alignright` 3× (both only on the `rooted-rituals` trio).

### 4.2 Spacing presets

```css
--wp--preset--spacing--20: 10px;
--wp--preset--spacing--30: 20px;
--wp--preset--spacing--40: 30px;
--wp--preset--spacing--50: clamp(30px, 5vw, 50px);
--wp--preset--spacing--60: clamp(30px, 7vw, 70px);
--wp--preset--spacing--70: clamp(50px, 7vw, 90px);
--wp--preset--spacing--80: clamp(70px, 10vw, 140px);
```

### 4.3 Block gap

`--wp--style--block-gap: 1.2rem`. Flow/constrained children get `margin-block-start:1.2rem` (first child 0); flex and grid layouts `gap:1.2rem`. Overrides: `.wp-block-buttons` children 16px; `.wp-block-columns` gap `spacing--50` (flow children inside columns also `spacing--50`); `.wp-block-quote` inner gap `spacing--30`; header title group `gap:5px`; byline group `gap:0.2em`; "Meer berichten" post-template `margin-block 0` (rows touch, separated by borders); journal post-template grid `gap: var(--wp--preset--spacing--70)`; card grids on work-with-me `gap: spacing--50`; column variants `gap: spacing--60 spacing--80` (work-with-me red columns), `spacing--50 spacing--50`.

### 4.4 Section paddings / margins seen in `style="…"` (count = occurrences)

| Inline style | Element | Count |
|---|---|---|
| `padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)` | header inner `alignwide` flex group | 184 |
| `padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)` | footer outer group | 184 |
| `margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)` | home `#contact` band (`is-style-section-1--7`) | 6 |
| `margin-top:0;margin-bottom:0;padding-top:0;padding-bottom:0` | home grey band holding pullquote/CTA/gallery (`is-style-section-1--5`) | 8 |
| `margin-top:0` | home `<main>` | 6 |
| `margin-top:var(--wp--preset--spacing--60)` | `<main>` on every page/post other than home | 152 |
| `padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)` | page/post title group (`alignfull … has-global-padding`), related-posts section, post "share" aside | 253 |
| `margin-top:0;margin-bottom:var(--wp--preset--spacing--50)` | | 177 |
| `margin-bottom:var(--wp--preset--spacing--60)` | post byline group, about-page featured image | 81 |
| `margin-top:var(--wp--preset--spacing--60);margin-bottom:var(--wp--preset--spacing--60)` | post-navigation aside | 76 |
| `margin-top:var(--wp--preset--spacing--70);margin-bottom:var(--wp--preset--spacing--70)` | comments aside | 76 |
| `margin-top:48px;margin-bottom:48px;padding-top:5px;padding-bottom:5px` | "Ontdek meer van Swaane Lauwaert" subscribe aside | 76 |
| `border-top-color:var(--wp--preset--color--accent-6);border-top-width:1px;padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40)` | post prev/next `<nav>` | 76 |
| `border-bottom-color:var(--wp--preset--color--accent-6);border-bottom-width:1px;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)` | related-post rows (title + date) | 304 |
| `padding-right:10%;padding-left:10%` | text group under each journal-card thumbnail | 621 |
| `margin-top:4px;margin-bottom:0` | subscribe blurb paragraph | 76 |
| `margin-bottom:36px` | footer/aside `is-style-wide` separators | 336 |
| `margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)` | grey band on `rooted-rituals` trio | 4 |
| `margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50)` | `section-5` band on work-with-me trio, other bands | 14 |
| `min-height:0vh;margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--40)` | intro group on `rooted-rituals` trio | 6 |
| `margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--50)` | cover on `body-untamed` trio | 4 |
| `margin-right:var(--wp--preset--spacing--80)` | `alignleft` image in `rooted-rituals` columns | 3 |
| `margin-top:-50%` + `width:202px` | overlapping `alignright is-resized` image in `rooted-rituals` columns | 3 |
| `padding-right:0;padding-left:0;flex-basis:50%` | column | 3 |

Spacer heights: `20px` (287 — footer, under journal intro), `80px` (77 — bottom of archive pages), `40px` (26 — top of journal), `spacing--50` (22), `spacing--40` (15), `spacing--20` (12), `50px` (2).

### 4.5 Header

`<div class="wp-block-group is-layout-flow wp-container-4 is-position-sticky" style="box-shadow:var(--wp--preset--shadow--natural)">` → `.wp-container-4{top:calc(0px + var(--wp-admin--admin-bar--position-offset,0px));position:sticky;z-index:10}`. Inside: `alignfull has-base-background-color has-global-padding` group → `alignwide` flex, `justify-content:space-between; flex-wrap:nowrap`, padding `spacing--30` top/bottom. Left: `<p class="wp-block-site-title has-x-large-font-size">Swaane Lauwaert</p>`; right: `<nav class="is-responsive items-justified-right wp-block-navigation" aria-label="Menu EN|NL|FR">`.

### 4.6 Footer (identical structure on all pages)

`alignwide` group → `<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide is-style-wide--8" style="margin-bottom:36px"/>` → 20px spacer → `alignfull` flex `space-between / align-items:flex-start` with three children: (1) `<h2 class="wp-block-site-title">Swaane Lauwaert</h2>` in a vertical group (gap 0); (2) `<ul class="wp-block-social-links has-huge-icon-size has-icon-color is-style-logos-only">` Instagram `https://www.instagram.com/swaanelauwaert/` + Facebook `https://www.facebook.com/swaane.lauwaert`; (3) `has-small-font-size is-vertical is-content-justification-stretch` group with `style="font-style:italic;font-weight:400"` containing two `space-between is-nowrap` rows: "All Rights Reserved" / "© Swaane Lauwaert" and "Photography" / "Pinterest, Unsplash" (NL: "Alle Rechten Voorbehouden", "Fotografie"; FR: "Tous Droits Réservés", "Photographie"). Below the footer, outside `.wp-site-blocks`: the `#network-info` bar (see §2.2).

---

## 5. Component styling

### 5.1 Buttons (`.wp-block-button`, 133 pages)

Theme element rule:
```css
:root :where(.wp-element-button, .wp-block-button__link){
  background-color: var(--wp--preset--color--contrast);  /* #191919 */
  border-width: 0; color: var(--wp--preset--color--accent-1);  /* #fff */
  font-family: inherit; font-size: var(--wp--preset--font-size--medium);
  font-style/weight/letter-spacing/line-height/text-transform: inherit;
  padding: 1rem 2.25rem; text-decoration: none; }
:root :where(.wp-element-button:hover, .wp-block-button__link:hover){
  background-color: color-mix(in srgb, var(--wp--preset--color--contrast) 85%, transparent);
  border-color: transparent; color: var(--wp--preset--color--base); }
:root :where(.wp-element-button:focus, .wp-block-button__link:focus){ outline-color: var(--wp--preset--color--accent-4); outline-offset: 2px; }
/* core-button specific, wins over the above for padding/font */
:root :where(.wp-block-button .wp-block-button__link){
  border-color: var(--wp--preset--color--contrast); font-family: var(--wp--preset--font-family--beiruti);
  padding: 0.6rem 1.6rem; box-shadow: var(--wp--preset--shadow--natural); }
```
Core adds `border-radius:9999px` (pill), `display:inline-block; text-align:center; cursor:pointer`, and `.wp-block-buttons .wp-block-button__link{width:100%}` inside a buttons wrapper. Rendered: black pill, white Beiruti 300 text, soft drop shadow (`en--desktop.png` "Yes! Keep me posted please!", `nl-journal--desktop.png` "SUBSTACK").

- Styles used: `is-style-fill` 32 (explicit, same as default), `is-style-outline` 12 — **all 12 belong to the Jetpack "Send" button** (`<div class="wp-block-jetpack-button is-style-outline wp-block-button"><button class="wp-block-button__link is-style-outline">Send</button>`), which Jetpack styles as `background-color:#0000; border:1px solid; color:currentColor` (thin-bordered cream pill). Core `is-style-outline` on a regular button is never used.
- Width classes: `wp-block-button__width-100` 4 occurrences (`has-custom-width`), 25/50/75 never used.
- Colour overrides: cookbook trio CTA `has-contrast-color has-accent-1-background-color has-border-color has-accent-1-border-color` (white pill, black text). Inside `.is-style-section-5` groups buttons invert: background `base`, text `contrast`, hover `color-mix(base 85%)` + `contrast` text ("Let's meet!" on work-with-me).
- Justification wrappers seen: `is-content-justification-center` (122), default left.
- Otter button group (`.wp-block-themeisle-blocks-button-group`, cookbook en/fr): flex, gap 20px, `--padding:15px 30px`; its single `.wp-block-themeisle-blocks-button a.wp-block-button__link` has **no href** in the mirror.
- Comment form submit `<input type="submit" class="wp-block-button__link wp-element-button" value="Reactie plaatsen">` → same black pill.

### 5.2 Separators (`.wp-block-separator`, 184 pages, 399 `has-alpha-channel-opacity`)

Core: `border:none; border-top:2px solid`. Theme overrides to a hairline:
```css
:root :where(.wp-block-separator){ border-color:currentColor; border-width:0 0 1px 0; border-style:solid; color:var(--wp--preset--color--accent-6); }
```
→ 1 px line at 20 % black. Default width = content (960 px) e.g. the three `<hr class="wp-block-separator has-alpha-channel-opacity" />` between the numbered home sections. `is-style-wide` (336 occ., with numbered variants `is-style-wide--5…--11` that all resolve to `max-width: var(--wp--style--global--wide-size) !important` when not `alignfull`) is used in the footer and post asides, always with `style="margin-bottom:36px"`. Inside `section-1`/`section-5` groups separators are `color-mix(in srgb, currentColor 25%, transparent)`. `is-style-dots` unused.

### 5.3 Quotes

- **Pullquote** (12 pages, home band "Are you ready to trade the numbness for the nectar?"): Beiruti 500, xx-large, lh 1, colour accent-3, padding `spacing--30` top/bottom (core `padding:4em 0` overridden), `text-align:center`, `margin:0 0 1em`, `p:last-of-type{margin-bottom:spacing--30}`, `cite` small normal, links currentColor.
- **Quote** (33 pages — journal intros, body-untamed, …): `border-width:0 0 0 2px; border-style:solid; border-color:currentColor`, medium 300, `margin:0`, padding `spacing--30 spacing--40`, children gap `spacing--30`; `.has-text-align-right` → border on the right, `.has-text-align-center` → no border, no inline padding. Core `is-style-large`/`is-large` unused.

### 5.4 Images

- No `border-radius` anywhere: no inline `border-radius`, `is-style-rounded`/`is-style-circle-mask` 0 occurrences, lightbox (`wp-lightbox-container`) 0 occurrences. Only avatars are rounded (`.wp-block-avatar img{border-radius:100px}`; comment avatars `.comment-author .avatar{border-radius:1.5em; 2.5em}`).
- Size classes: `size-full` 286, `size-large` 120, `is-resized` 7, `aligncenter` on legacy `<img class="aligncenter size-full wp-image-N">` in old posts.
- Inline aspect ratios: `aspect-ratio:4/3;width:100%;object-fit:cover;` (620 — every archive card thumbnail, `.hover-scale.wp-block-post-featured-image` — **note `.hover-scale` has no CSS rule anywhere in the mirror**, it is a dead class), `aspect-ratio:4/3;object-fit:cover` (9), `aspect-ratio:1;object-fit:cover` (7), `aspect-ratio:3/4;object-fit:cover` (4), `aspect-ratio:0.75;width:768px;height:auto` (home portrait `MVIMG_20260817_163022_1-768x1024.jpg`, 4), `display:block;object-fit:cover;object-position:center;width:100%;height:100%` (307 — featured images inside grids), `object-fit:cover;` (5 — about/over-mij featured image).
- Featured image on pages (`en/about`, `fr/a-propos`, `nl/over-mij`): `<figure style="margin-bottom:var(--wp--preset--spacing--60)" class="wp-block-post-featured-image"><img … style="object-fit:cover;">`, full content width above the h1.
- Core: `.wp-block-image img{max-width:100%;height:auto}`, `figure{margin:0 0 1em}` (`:where`), figcaption `margin:.5em 0 1em`.
- Aspect-ratio presets declared: square, 4-3, 3-4, 3-2, 2-3, 16-9, 9-16 (only used via inline styles above).

### 5.5 Cover blocks (20 pages, 22 `has-parallax`)

Core base: `display:flex; align-items:center; justify-content:center; min-height:430px; padding:1em; position:relative; overflow:clip; background-position:50%`; overlay `.wp-block-cover__background` `opacity:.5` default, `has-background-dim-N` → opacity N/100; text `color:#fff` unless `has-text-color`; `.is-light` → `#000`; `has-parallax` → `background-attachment:fixed; background-size:cover` (falls back to `scroll` on iOS `@supports (-webkit-touch-callout:inherit)` and under `prefers-reduced-motion`).

Instances:
| Page(s) | Markup | Notes |
|---|---|---|
| Homes (en/nl/fr) | `alignfull has-parallax has-custom-content-position is-position-bottom-center has-accent-1-color has-text-color has-link-color wp-elements-1`, `style="margin-top:0;margin-bottom:0;padding:var(--wp--preset--spacing--50) all sides;min-height:80.4vh;aspect-ratio:unset;"`; overlay `has-contrast-background-color has-background-dim-0`; `<div class="wp-block-cover__image-background wp-image-4155 has-parallax" style="background-position:50% 50%;background-image:url(wp-content/uploads/sites/50/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg)">` (1280×577, also the og:image) | h1 site name bottom-left in white, xx-large, `font-weight:700` inline |
| work-with-me trio | `alignfull has-custom-content-position is-position-bottom-center`, `min-height:840px`, padding spacing--50; `<img class="wp-block-cover__image-background wp-image-5578 size-large">` (`2026/08/DSC03534-1024x683.jpg`) + `has-background-dim-10`; inner `alignwide` group left-justified with `<h2 … has-xx-large-font-size>` + button | white text via core default |
| cookbook trio | `alignfull is-light has-parallax has-accent-1-color has-text-color has-link-color wp-elements-1`, `padding-top/bottom:200px`, `min-height:739px`, bg `2026/08/Screenshot-2026-08-23-201541.jpg` (en/fr), overlay `has-background-dim-10` with `background-color:#a0a192` / `#9f847d`; `.wp-elements-1 h1–h6 { accent-1 }` | centred h3 xx-large + paragraph + white CTA |
| flavours-of-desire trio + weekendretreat | overlays `dim-0` with `#833d3a`, `#828282`, `#d6bc98` (invisible) | |
| body-untamed / eros-sanctuary / le-corps-libre / the-eros-sanctuary | `alignfull is-light has-contrast-color has-text-color has-link-color`, padding `spacing--60`/`spacing--50`; overlay `has-base-background-color has-background-dim-100` → image completely hidden, i.e. a cream padded section | `.wp-elements-1 a { contrast }` |

Inner container: `.wp-block-cover__inner-container has-global-padding is-layout-constrained` with `> .alignfull` negative margins of `spacing--50` (or `spacing--40`).

### 5.6 Galleries (`.wp-block-gallery`, 15 pages, 29 instances, all `has-nested-images is-cropped`)

24 × `columns-default`, 5 × explicit `columns-3`. Gap `--wp--style--unstable-gallery-gap` → `var(--wp--style--block-gap)` = **1.2 rem**. Layout rules: base (mobile) each figure `calc(50% - gap/2)`; ≥600 px `columns-default` → `calc(33.33% - gap*.66667)`, exactly 2 items → 50 %, 1 item → 100 %; `is-cropped` → `img{flex:1 0 0%;height:100%;object-fit:cover}` (equal-height row). Figcaptions centred, `flex-basis:100%`. Home gallery `wp-block-gallery-6`: three portrait JPGs `2026/08/IMG-20260404-WA0004.jpg`, `2026/08/IMG_5348-768x1024.jpeg`, `2026/08/MVIMG_20260817_163746-EDIT-893x1024.jpg`. Old posts (`nl/2013/03/17/…`) also use galleries.

### 5.7 Columns (14 pages) and media-text (7 pages)

`.wp-block-columns{display:flex;flex-wrap:wrap}`; ≥782 px `flex-wrap:nowrap`, columns `flex-basis:0;flex-grow:1` unless inline `flex-basis`; ≤781 px every column `flex-basis:100%` (stack) unless `is-not-stacked-on-mobile` (not used). `:where(.wp-block-columns){margin-bottom:1.75em}`. Inline bases used: `50%` (9), `33.33%` (5), `66.66%` (4), `65%`/`35%` (4 each, body-untamed trio), `56%` (3). `is-vertically-aligned-center` on text columns. Gap variants see §4.3.
Media-text: `grid-template-columns:50% 1fr` (or `1fr 50%` with `has-media-on-the-right`), content `padding:0 8%`, `is-stacked-on-mobile` → single column ≤600 px; `is-image-fill` min-height 250 px.

### 5.8 Spacers

`<div style="height:…" aria-hidden="true" class="wp-block-spacer">`; `.wp-block-spacer{clear:both}`. Heights listed in §4.4.

### 5.9 Post-template / query grids

- Archive cards (journal, category, tag, author — 75 pages): `<ul class="columns-3 ona-post is-style-default wp-block-post-template is-layout-grid wp-container-core-post-template-is-layout-3c9dd3fb">` → `grid-template-columns:repeat(3,minmax(0,1fr)); gap:var(--wp--preset--spacing--70)`; `@media (max-width:600px)` → `grid-template-columns:1fr`. Card: `<article class="wp-block-group is-layout-flow">` → `<figure class="hover-scale wp-block-post-featured-image">` (4/3 cropped, links to post) → group `padding-right:10%;padding-left:10%` with `<h2 class="wp-block-post-title has-text-align-center">` (Floreal x-large) and `<div class="wp-block-post-date has-text-align-center">` (small grey). `ona-container`/`ona-post` custom classes carry no CSS.
- Related list on single posts ("Meer berichten", 4 items): `<ul class="alignfull wp-block-post-template is-layout-flow wp-container-core-post-template-is-layout-b4d04ffe">` with zero block gap; each row an `alignfull` flex `space-between nowrap align-items:center` with `border-bottom accent-6 1px`, `<h3 class="wp-block-post-title has-large-font-size">` + `<div class="wp-block-post-date has-text-align-right">`.
- Journal intro: 40px spacer, centred `is-style-fill` button "SUBSTACK" (NL: no `href` in the mirror), `<h1 class="wp-block-heading has-text-align-center">The Journal</h1>`, left-bordered quote (NL text "Ik schrijf over wat voor mij werkelijk van belang is: familie, mijn werk, de natuur, kunst, Maria Magdalena en het eenvoudige dagelijks leven!" + "VOLG ME OP: https://substack.com/@swaanelauwaert1"), 20px spacer. EN/FR journals contain a `wp-block-query-no-results` block (no EN/FR posts exist).
- Query title (`<h1 class="wp-block-query-title">`) on category/tag/author pages: colour accent-3.

### 5.10 Pagination (`.wp-block-query-pagination`, 75 pages)

`is-content-justification-center`, medium 300, `aria-label="Paginering"` (NL). Children: `.wp-block-query-pagination-previous` "← Vorige pagina", `.wp-block-query-pagination-numbers` (`<span class="page-numbers current">1</span> <a class="page-numbers">2</a> … <span class="page-numbers dots">…</span> <a>24</a>`), `.wp-block-query-pagination-next` "Volgende pagina →" (arrow spans `is-arrow-arrow`, `margin: 1ch`). Links styled as body links (underlined, hover red).

### 5.11 Social icons

Footer `<ul class="wp-block-social-links has-huge-icon-size has-icon-color is-style-logos-only is-layout-flex">` → `font-size:48px`, `is-style-logos-only` → no background, `svg{height:1.25em;width:1.25em}`, `a{padding:0}`; `.wp-block-social-link{border-radius:9999px; transition:transform .1s ease}` + `:hover{transform:scale(1.1)}`; gap 1.2 rem; colour `has-accent-3-color` (#000). Labels are screen-reader-only ("Instagram", "Facebook"). One page also has `has-normal-icon-size` (57 occ. — Jetpack sharing lists use `has-normal-icon-size`). Single posts additionally carry Jetpack **sharing buttons** (`style-icon`: round 1.5 em coloured brand icons for Bluesky, Facebook, LinkedIn, Mastodon, WhatsApp, Pinterest, X, Share — `.jetpack-sharing-button__button.style-icon{border-radius:50%;padding:7px;color:#fff}`) under a `<p><strong>Like and share</strong></p>` label, and the Jetpack Likes widget (iframe; shows "Bezig met laden…" placeholder in the render).

### 5.12 Post terms

Two styles coexist: (a) byline `<div style="font-weight:300" class="taxonomy-category wp-block-post-terms">` — plain small links in the sentence "Geschreven door **swaanelauwaert** in **On est parti!, une par jour** op **3 augustus 2018**" (gap 0.2em flex row, small, accent-4); (b) block style `is-style-post-terms-1` (17 occ., numbered `--5/--6/--7`) → pills: `border-radius:20px; border:0.8px solid var(--wp--preset--color--accent-6); font-weight:400; line-height:2.8; padding:5px 10px; text-decoration:none; hover underline`.

### 5.13 Post navigation, comments, subscribe

- Prev/next: `<nav class="wp-block-group alignwide … is-content-justification-space-between is-nowrap" aria-label="Bericht navigatie">` with top border accent-6; `.post-navigation-link-previous` "← cent quatre." / `.post-navigation-link-next` "cent six. →" (links underlined, medium).
- Comments (`<aside class="wp-block-comments wp-block-comments-query-loop">`): `<h2 class="wp-block-heading has-x-large-font-size">Reacties</h2>`; comment list uses `wp-block-comment-template` (29 pages with comments), avatars 100px radius, author small accent-4, date/reply small contrast, content medium with `spacing--30` margins. Form `.wp-block-post-comments-form`: medium, padding `spacing--40`; `<h3 class="comment-reply-title">Een reactie achterlaten</h3>`; note "Je e-mailadres zal niet getoond worden. Vereiste velden zijn gemarkeerd met *"; fields `textarea, input:not([type=submit]) { border-radius:.25rem; border-color: accent-6 !important }` over core `border:1px solid #949494; padding:calc(.667em + 2px); width:100%`; labels small, block, `margin-bottom:.25em` ("Reactie *", "Naam *", "E-mail *", "Website"); cookies checkbox "Mijn naam, e-mailadres en website opslaan in deze browser voor de volgende keer wanneer ik een reactie plaats."; submit "Reactie plaatsen"; Akismet notice "Deze website gebruikt Akismet om spam te verminderen. Bekijk hoe je reactie gegevens worden verwerkt."
- Subscribe aside: wide separator, `<h3 class="wp-block-heading has-text-align-center">Ontdek meer van Swaane Lauwaert</h3>` + a second h3 "Découvrez plus de Swaane Lauwaert", small centred paragraph "Abonneer je om de nieuwste berichten in je e-mail te ontvangen.", followed by an **empty** constrained group (`max-width:480px`) — the Jetpack subscription form did not render into the mirror.

### 5.14 Contact form (Jetpack Forms, home pages only — 6 files)

`<div class="wp-block-jetpack-contact-form is-style-outlined is-layout-flex …">` with `justify-content:flex-start; align-items:flex-start`. Fields: Name (required), Email (required), Message (textarea `rows='20'`), labels rendered as Material-style **notched outlines** (`.notched-label__leading/notch/filler/trailing`, `border-style:solid`), inputs `border:1px solid #8c8f94; border-radius:0; padding:16px; font:inherit; background: field` with `has-small-font-size`; ≥600 px text inputs are 50 % wide by core rule but the outlined layout stretches them full width in the render. Required marker "(required)" in `.grunion-label-required` (85 %, weight 400). Error colour `#b32d2e`. Submit `<button class="wp-block-button__link is-style-outline">Send</button>` (outline pill; full width on the 390 px render). Success heading text is Dutch on every language: "Uw bericht is verzonden"; "← Back" link. Section heading `<h2 class="wp-block-heading has-text-align-left is-style-default">Do you have a question?<br>Feel free to reach out.</h2>` inside `#contact` grey band (`is-style-section-1--7`, padding `spacing--70`).

### 5.15 Other components

- **Otter content slider** (`en/cookbook`, `fr/livre-de-cuisine`): `.o-content-slider` with `--o-per-view:1;--o-gap:0px;--o-height:auto`; scroll-snap track; arrows 40 px circles (`#fff` on `rgba(0,0,0,.5)`, left/right 10px, vertically centred); dots 10 px (`rgba(0,0,0,.3)`, active `#000`), `margin-top:12px`, `transition:background-color .15s`. Slides are centred `wp-block-image` figures (`2026/08/MVIMG_20260817_163817_1-768x1024.jpg`, `2026/08/Photo-43-EDIT-768x1024.jpg`, `2026/08/Screenshot-2026-08-23-201541.jpg`). `nl/kookboek` uses a **Jetpack Slideshow** (Swiper) instead.
- **Otter animations** stylesheet (animate.css subset: `.animated`, `.pulse`, `.zoomIn`, `.delay-1s`, `.delay-500ms`, `.fast`) is inlined on every page (`<style type="text/css" media="all">` after the body) but no element carries `animated` (0 occurrences).
- **Lists**: `ul.is-style-checkmark-list` style defined (`list-style-type:"\2713"`) — usage not found; `.wp-block-list` on 5 pages.
- **Embed**: 1 instance (`nl/flavours-of-desire-3`), responsive 16:9 wrapper.
- **Skip link** "Skip to content" / standard `.screen-reader-text` rules.

---

## 6. Links, hover and transitions

```css
a:where(:not(.wp-element-button)){ color: var(--wp--preset--color--contrast); }          /* #191919, browser underline */
:root :where(a:where(:not(.wp-element-button)):hover){ color: var(--wp--preset--color--accent-2); text-decoration: none; }  /* #c60000, underline removed */
a{ text-decoration-thickness:1px!important; text-underline-offset:.1em }                 /* theme style.min.css */
```
Exceptions: `.wp-block-post-title a`, `.wp-block-site-title a`, `.wp-block-navigation a`, `.wp-block-post-date a`, `.wp-block-post-terms` pills — no underline, **hover underline** (post-date links accent-4; site/post title `currentColor`). `.wp-block-pullquote a`, `.is-style-section-5 a`, `.is-style-section-1 .wp-block-post-terms a` → `currentColor`. `has-link-color` (106 occ.) with `.wp-elements-N a` sets link colour to `accent-1` (white) inside covers (9 + 6 + 2 + 2 pages) or `contrast`/`accent-3` on a few. Body links in content are rendered bold+underlined on the home page because they are wrapped in `<strong>` ("[Discover 1-op-1 coaching →]", "[Stay tuned →]", "Discover the book & order your copy →]").

Transitions / motion present in CSS: social icon `transform .1s ease` (+ `scale(1.1)` on hover); nav submenu `opacity .1s linear`; overlay menu `overlay-menu__fade-in-animation .1s ease-out` (opacity 0 → 1, `translateY(.5em)` → 0); Otter dots `.15s`; Jetpack notch border `.15s linear`; lightbox `.2–.4s` (unused); `html { scroll-behavior:smooth }` (custom CSS in global styles); parallax via `background-attachment:fixed`. Buttons and links have **no transition** (instant colour change). All animations are wrapped in `@media not (prefers-reduced-motion)` by core; Otter honours `prefers-reduced-motion:reduce`.

Focus: `:where(.wp-site-blocks :focus){outline-style:solid;outline-width:2px}`; nav items `outline-offset:4px`; buttons outline `accent-4` offset 2px.

Custom CSS appended to global styles (from the site's "Additional CSS"): `html { scroll-behavior: smooth }` and `header ul.pll-switcher { list-style:none; padding:0; display:flex; gap:inherit; }` (targets the legacy Polylang switcher, not the block switcher actually in the markup).

---

## 7. Responsive behaviour

### 7.1 Breakpoints found in the CSS

| Breakpoint | Effect |
|---|---|
| `≥600px` | navigation: hamburger `.wp-block-navigation__responsive-container-open:not(.always-shown){display:none}` and the responsive container becomes static inline (`display:block;position:relative`); post-template grid otherwise `1fr` below 600; gallery `columns-*` widths apply (below: 2-up); media-text stacks below 600 (`is-stacked-on-mobile`); Jetpack text inputs 50 % width above 600; sticky-header admin-bar offset 0 below 600; Otter button-group mobile rules |
| `≤781px / ≥782px` | columns stack / nowrap; nested nav submenus fly out to the right only ≥782 |
| `≤960px` | Otter button-group tablet rules; lightbox nav |
| fluid | all preset sizes/spacings use `clamp()` on `vw`; `min-height:80.4vh` hero |

### 7.2 Mobile navigation (overlay) class names and behaviour

Markup (every page): `<nav class="is-responsive items-justified-right wp-block-navigation … " data-wp-interactive="core/navigation">` → `<button aria-label="Open menu" class="wp-block-navigation__responsive-container-open">` (24×24 three-bar SVG) → `<div class="wp-block-navigation__responsive-container has-text-color has-contrast-color has-background has-base-background-color" id="modal-2">` (Interactivity API toggles `has-modal-open` and `is-menu-open`) → `.wp-block-navigation__responsive-close` → `.wp-block-navigation__responsive-dialog` → `<button aria-label="Close menu" class="wp-block-navigation__responsive-container-close">` (X SVG, `position:absolute;right:0;top:0`) → `.wp-block-navigation__responsive-container-content` → `<ul class="wp-block-navigation__container">`.

Open state (`.is-menu-open`): `position:fixed; inset:0; z-index:100000; display:flex; flex-direction:column; overflow:auto;` background `base` cream, text `contrast`; padding `clamp(1rem, var(--wp--style--root--padding-*), 20rem)`; content `padding-top:calc(2rem + 24px)`; items in a column, `justify-content:flex-start`; submenu toggles hidden (`__submenu-icon{display:none}`) and submenus expanded inline with `padding-left/right:2rem`, `padding-top: var(--wp--style--block-gap)`; `.has-modal-open .wp-block-navigation__responsive-close{max-width: wide-size; margin: auto}`.

Desktop dropdown: `<li class="wp-block-navigation-item has-child open-on-hover-click wp-block-navigation-submenu">` with a 12×12 chevron `<button class="wp-block-navigation__submenu-icon wp-block-navigation-submenu__toggle">` (`stroke-width:1.5`, `.6em`, rotates 180° when `aria-expanded=true`); `<ul class="wp-block-navigation__submenu-container has-text-color has-contrast-color has-background has-base-background-color">` absolutely positioned `top:100%`, `left:auto; right:0` (right-justified nav), `min-width:200px`, `opacity:0 → 1 .1s`, opens on hover (`@media (hover:hover)`) or click/focus; items get `padding:.5em 1em` only when the nav has a background (here the `ul` has it, the `nav` does not — rendering of the open dropdown is not captured in any screenshot).

Menu contents (verbatim labels):
- EN (`aria-label="Menu EN"`): **Work with me** ▾ [Retreats, The Eros Sanctuary, Flavours of Desire, Sainte-Baume Guide] · Cookbook · About me · The Journal · Contact (`en.html#contact`) · 🇬🇧 English ▾ [Nederlands, English, Français]
- NL (`Menu NL`): **Werk met mij** ▾ (`href="nl.html#"`) [Samenwerken, Weekendretreat 27-28-29 november 2026: PLAY, Maria Magdalena Retreat Zuid Frankrijk 2027, Flavours of Desire \| Voeding, Verlangen &amp; Zelfliefde, The Eros Sanctuary \| Somatic Coaching &amp; Sacred Sexuality, Sainte-Baume Gids] · Kookboek · Over mij · The Journal · Contact · 🇧🇪 Nederlands ▾
- FR (`Menu FR`): **Accompagnement** ▾ [Retraites, Flavours of Desire, (empty label wrapping a nested `<a href="en/body-untamed/index.html">The Eros Sanctuary</a>`), Guide Sainte-Baume (`en/guide-sainte-baume/`)] · Livre de Cuisine · À propos de moi · Le Journal · Contact · 🇫🇷 Français ▾

Language switcher = Polylang navigation block (`wp-block-polylang-navigation-language-switcher`, `lang-item-5` nl-BE, `lang-item-8` en-GB, `lang-item-12` fr-FR). Flags are inline `data:image/png;base64` 16×11 `<img>` on en/nl pages (switcher CSS v3.9.1) and inline SVG inside `<span class="pll-switcher-flag" style="…width:var(--pll-flag-width,18px)…aspect-ratio:3/2">` on fr pages (CSS v3.9.0) — the mirror captured two plugin versions. CSS: `.wp-block-polylang-navigation-language-switcher :is(a,…){display:inline-flex;align-items:center}`, flag + label inline-flex.

### 7.3 Home page: desktop (1440 px) vs mobile (390 px) render comparison

| Area | `en--desktop.png` | `en--mobile.png` |
|---|---|---|
| Header | 50 px side padding; "SWAANE LAUWAERT" Floreal x-large left; inline nav right (Literata, medium) with chevrons; flag + "English" | 30 px padding; title shrinks (clamp); nav replaced by a single hamburger icon at the right; language switcher only inside the overlay |
| Hero cover | 80.4 vh (≈ 800 px) parallax pomegranate photo, white "Swaane Lauwaert" bottom-left, xx-large | still 80.4 vh of a 844-ish viewport → tall portrait crop; title wraps to ~2 rem |
| Sections 1–3 | 960 px column, Floreal h2 ≈ 35 px, Literata 19 px/1.6 | full-width minus 30 px gutters; h2 ≈ 29 px wraps to 2–3 lines; body 16 px |
| Portrait image | 768 px wide, centred-left in the column | `width:768px` is clamped by `max-width:100%` (image did not paint in the local mobile render — lazy-load artefact, not a CSS rule) |
| Grey band (`accent-5`) | pullquote (Beiruti 500 ≈ 45 px) centred, pill button, 3-up cropped gallery (only 2 images painted in the local render) | pullquote ≈ 32 px, button, gallery falls to 2-up (base rule `calc(50% - gap/2)`) — images did not paint |
| Contact | heading left, inputs full width, "Send" outline pill left-aligned | identical stack, "Send" stretches to full width |
| Liability | small text in 960 px column | full width |
| Footer | one row: title left, icons centre, two italic text columns right | stacked: title, icons, then the two `space-between nowrap` text rows, each still two columns |
| Host bar | centred 14 px grey text, dark `#171717` | wraps to two lines |

---

## 8. Checklist of values the rebuild must reproduce

- Fonts: Floreal (headings, site title, post titles), Literata 300 (body, nav, captions, quotes, meta), Beiruti (buttons 300, pullquotes 500). Copy the three font families from the paths in §1.1.
- Colours: base #fff7e6, contrast #191919, accent-1 #FFFFFF, accent-2 #c60000, accent-3 #000000, accent-4 #5F5F5F, accent-5 #F1EEE9, accent-6 #19191933; plus #171717/#939393/#ccc host bar and the cover tints #a0a192, #9f847d.
- Scale: small .9rem; medium/large/x-large/xx-large clamps in §3.1; h1–h6 mapping; line-height 1.6 body / 1.02 headings / 1.1 site title / 1 pullquote / 1.4 captions / 1.3 lists.
- Layout: 960/1340 px, root padding clamp(30px,5vw,50px), block gap 1.2rem, spacing 10/20/30/clamp(30,5vw,50)/clamp(30,7vw,70)/clamp(50,7vw,90)/clamp(70,10vw,140) px.
- Header sticky with `0 3px 6px rgba(0,0,0,.2)` shadow; hamburger < 600 px; cream overlay menu.
- Components as in §5: pill buttons with shadow, hairline separators at 20 % black, grey band sections, cover with parallax and dim levels, 3-up cropped galleries (2-up < 600 px), 3-column journal grid (gap clamp(50px,7vw,90px), 1 col < 600 px), 4/3 cropped cards with 10 % side padding, pill post-terms, bordered related-post rows, outlined Jetpack form, round sharing icons, 48 px logos-only social icons.

---

## 9. Things that could not be determined from the mirror

- The original `theme.json` is not in the mirror; all values are reverse-engineered from the inlined CSS (e.g. whether `is-style-text-subtitle` sets a font family in the source — the inlined rule only carries size/line-height).
- Floreal: provenance/licence, and whether bold/italic faces exist on the live site (only `floreal.woff` 400 is served).
- Hover, focus, open-dropdown and open-overlay states exist only as CSS; no screenshot shows them.
- The Jetpack subscription form inside "Ontdek meer van Swaane Lauwaert", the Jetpack Likes iframe and the Jetpack Slideshow (nl/kookboek) did not render into the static HTML; their final appearance is unknown.
- `.hover-scale`, `.ona-container`, `.ona-post` have no CSS anywhere in the mirror — if the live site has an effect (e.g. image zoom on hover) it comes from CSS that was not captured.
- The 270×270 tile icon and some lazy-loaded images are absent from the mirror/local renders (third home gallery image, mobile portrait); this is a capture artefact, not a style rule.
- Two Polylang switcher versions (3.9.0 SVG flags vs 3.9.1 PNG flags) were captured; which one is current on the live site is unknown.
- Exact rendered pixel sizes at intermediate viewports were computed from the `clamp()` formulas, not measured.
