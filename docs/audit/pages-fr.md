# French pages audit (`/fr/`) — swaanelauwaert.com

Source of truth for this audit: the wget mirror in `mirror/raw/swaanelauwaert.com/` (rendered HTML as served on 2026-10-22), cross-checked against the REST dump `mirror/api/pages-p1.json`, and the local full-page renders in
`/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/local-shots/fr-*--desktop.png` / `--mobile.png`.
All file paths below are relative to the repo root unless stated otherwise. Texts, labels and button captions are quoted verbatim (including typos and the Dutch/English fragments that were left in the French copy).

Conventions used for block descriptions:

- `sp20/30/40/50/60/70/80` = the theme spacing presets `--wp--preset--spacing--N` (10px, 20px, 30px, clamp(30px,5vw,50px), clamp(30px,7vw,70px), clamp(50px,7vw,90px), clamp(70px,10vw,140px)).
- Colour tokens (from the inlined global styles): `base` #fff7e6 (page background), `contrast` #191919, `accent-1` #FFFFFF, `accent-2` #c60000, `accent-3` #000000, `accent-4` #5F5F5F (body text), `accent-5` #F1EEE9, `accent-6` #19191933.
- Fonts: body Literata (serif, 300, `medium` size clamp(1rem…1.2rem), line-height 1.6, letter-spacing -0.01em); headings Floreal (400, line-height 1.02, colour accent-3); buttons & pullquotes Beiruti. Buttons: contrast background, accent-1 text, pill radius 9999px, padding 0.6rem 1.6rem, `natural` shadow (0 3px 6px rgba(0,0,0,.2)). `is-style-outline` buttons: 2px solid currentColor border, transparent background.
- "section-1" = block style `is-style-section-1` → background accent-5 (#F1EEE9), text contrast; separators inside at 25 % currentColor. "section-5" = `is-style-section-5` → background contrast (#191919), text base; headings inside become `base`; buttons inside invert to base background / contrast text.
- Unless noted, every `<img>` has an empty `alt=""`, carries a `srcset` and a `sizes` attribute, and has `decoding="async"`. "lazy" = `loading="lazy"` present.

---

## 1. Inventory of the French pages

| # | URL (live) | Mirror file | WP id | slug | `title.rendered` | template | menu_order | status | modified | nav item that points to it |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `https://swaanelauwaert.com/fr/` | `mirror/raw/swaanelauwaert.com/fr.html` (identical copy at `fr/index.html`, only relative paths differ) | 76 | `the-untamed-woman-3` | `Swaane Lauwaert` | `page-no-title` | 0 | publish | 2026-10-09 14:55 | Site title (header & footer), language switcher "Français", "Contact" (→ `#contact`) |
| 2 | `/fr/a-propos/` | `mirror/raw/swaanelauwaert.com/fr/a-propos/index.html` | 4100 | `a-propos` | `À propos` | default | 0 | publish | 2026-03-09 | top-level "À propos de moi" |
| 3 | `/fr/accompagnement/` | `mirror/raw/swaanelauwaert.com/fr/accompagnement/index.html` | 4502 | `accompagnement` | `Accompagnement 1:1 — Coaching Somatique &amp; Travail Corporel` | default | 0 | publish | 2026-10-10 | top-level "Accompagnement" (parent of the submenu) |
| 4 | `/fr/flavours-of-desire-2/` | `mirror/raw/swaanelauwaert.com/fr/flavours-of-desire-2/index.html` | 4537 | `flavours-of-desire-2` | `Flavours of Desire` | default | 20 | publish (body has `page-parent`) | 2026-08-24 | submenu "Accompagnement › Flavours of Desire" |
| 5 | `/fr/flavours-of-desire-2/modules/` | **not in mirror** | 5101 | `modules` (parent 4537) | `Flavours of Desire Modules` | default | 0 | publish, **password-protected** (`content.protected: true`, `content.rendered` empty, `jetpack_seo_noindex: true`, class `post-password-required`) | 2026-03-29 | not linked from any FR page |
| 6 | `/fr/le-corps-libre/` | `mirror/raw/swaanelauwaert.com/fr/le-corps-libre/index.html` | 4531 | `le-corps-libre` | `The Eros Sanctuary` | default | 0 | publish | 2026-08-24 | submenu "Accompagnement › The Eros Sanctuary" |
| 7 | `/fr/le-journal/` | `mirror/raw/swaanelauwaert.com/fr/le-journal/index.html` | 80 | `le-journal` | `Le Journal` | rendered by the theme **blog/home template** (body class `blog`, no `<main>`); page `excerpt` is an admin note "Bewerk template hier: https://swaanelauwaert.com/wp-admin/site-editor.php?p=%2Fwp_template%2Ftwentytwentyfive%2F%2Fhome&canvas=edit" | 90 | publish | 2026-03-09 | top-level "Le Journal" |
| 8 | `/fr/livre-de-cuisine/` | `mirror/raw/swaanelauwaert.com/fr/livre-de-cuisine/index.html` | 4918 | `livre-de-cuisine` | `Livre de Cuisine: The Taste of Her Journey` | default | 0 | publish | 2026-09-18 | top-level "Livre de Cuisine" |
| 9 | `/fr/rituels-dancrage/` | `mirror/raw/swaanelauwaert.com/fr/rituels-dancrage/index.html` | 4550 | `rituels-dancrage` | `Retraites \| Cérémonies &amp; Retraites` | default | 30 | publish | 2026-03-28 | submenu "Accompagnement › Retraites" |

`find mirror/raw/swaanelauwaert.com/fr -name index.html` returns exactly the 8 files above (home + 7 subpages); the `modules` child page was never fetched (password form, noindex). The `.orig` files next to each HTML are wget's pre-link-conversion copies (same content, absolute URLs).

All FR pages: `<html lang="fr-FR">`, `og:locale fr_FR`, `og:locale:alternate nl_BE, en_GB`, `og:site_name Swaane Lauwaert`, `twitter:card summary_large_image`, no `meta robots`. Meta descriptions are auto-generated by Jetpack from the first ~300 characters of the content (so they contain the untranslated fragments — see §5). The home page has `og:type website`, `og:url https://swaanelauwaert.com/` (not `/fr/`), `og:image` = cover image (1280×577), `twitter:description "Voir l'article pour en savoir plus."`. Every other page has `og:type article` and `og:image` = first content image (sizes listed per page below). `/fr/le-journal/` has `og:type website`, `og:title "Swaane Lauwaert"` and `og:image https://swaanelauwaert.com/wp-content/uploads/sites/50/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector.jpg` 512×512 (site icon; only the 32/180/192 px variants exist in the mirror under `wp-content/uploads/sites/50/2026/02/`).

Per-page `hreflang` alternates (this is the authoritative Polylang translation mapping):

| FR | EN | NL |
|---|---|---|
| `/fr/` | `/en/` (`en.html`) | `/nl/` (`nl.html`) |
| `/fr/a-propos/` | `/en/about/` | `/nl/over-mij/` |
| `/fr/accompagnement/` | `/en/work-with-me/` | `/nl/samenwerken/` |
| `/fr/flavours-of-desire-2/` | `/en/flavours-of-desire/` | `/nl/flavours-of-desire-3/` |
| `/fr/le-corps-libre/` | `/en/body-untamed/` (old URL; mirror shows it is the same page as `/en/the-eros-sanctuary-2/`, id 66 — identical `<main>`, canonical to itself) | `/nl/the-eros-sanctuary/` |
| `/fr/le-journal/` | `/en/the-journal/` | `/nl/journal/` |
| `/fr/livre-de-cuisine/` | `/en/cookbook/` | `/nl/kookboek/` |
| `/fr/rituels-dancrage/` | `/en/rooted-rituals/` | `/nl/levende-rituelen/` |
| `/fr/flavours-of-desire-2/modules/` (5101) | `/en/flavours-of-desire-modules-english/` (5113, protected) | `/nl/flavours-of-desire-3/modules/` (4990, protected) — mapping inferred from titles/parents, not from hreflang |

The home page `<head>` also carries `<link rel="alternate" hreflang="x-default" href="/">` (root redirect → English).

---

## 2. Chrome shared by every French page

### 2.1 Skip link, header, navigation ("Menu FR")

- Skip link: `<a class="skip-link screen-reader-text" href="#wp--skip-link--target">Aller au contenu</a>`.
- Sticky header: outer group `is-position-sticky` (top 0, z-index 10) with `box-shadow: var(--wp--preset--shadow--natural)`; inner group `alignfull`, background `base`, global padding; row `alignwide`, space-between, nowrap, `padding-top/bottom: sp30`.
- Left: site title `<p class="wp-block-site-title has-x-large-font-size"><a href="/fr/" rel="home">Swaane Lauwaert</a></p>` (rendered in Floreal, uppercase look comes from the font, not CSS).
- Right: `<nav aria-label="Menu FR">`, responsive overlay menu (`data-wp-interactive="core/navigation"`), hamburger button `aria-label="Ouvrir le menu"` (24px three-bar SVG), close button `aria-label="Fermer le menu"`, overlay container `has-contrast-color has-base-background-color`. On mobile (390px) only the site title + hamburger are visible (confirmed in `fr--mobile.png`).
- Menu items, in order (labels verbatim, href as served):
  1. **Accompagnement** → `/fr/accompagnement/` — has submenu (open on hover/click, toggle button `aria-label="Sous-menu Accompagnement"`, 12px chevron SVG):
     1. **Retraites** → `/fr/rituels-dancrage/`
     2. **Flavours of Desire** → `/fr/flavours-of-desire-2/`
     3. **The Eros Sanctuary** → `/fr/le-corps-libre/` — ⚠ the label `<span>` wraps a *nested* `<a href="/en/body-untamed/">The Eros Sanctuary</a>` (invalid nested anchor; the inner link to the English page wins in most browsers). Rebuild: single link to `/fr/le-corps-libre/`.
     4. **Guide Sainte-Baume** → `/en/guide-sainte-baume/` — ⚠ points to an **English** page; there is no French Sainte-Baume page (EN has `/en/sainte-baume-guide/` + `/en/guide-sainte-baume/`, NL has `/nl/sainte-baume-gids/`).
  2. **Livre de Cuisine** → `/fr/livre-de-cuisine/`
  3. **À propos de moi** → `/fr/a-propos/`
  4. **Le Journal** → `/fr/le-journal/`
  5. **Contact** → `/fr/#contact` (anchor on the home page; on the home itself `fr.html#contact`)
  6. Language switcher (Polylang block, `aria-label="Sous-menu Langues"`): current item flag 🇫🇷 (inline SVG data-URI, 18×12, aspect 3/2) + label **Français**; submenu: 🇧🇪 **Nederlands**, 🇬🇧 **English**, 🇫🇷 **Français**. On subpages the switcher links to the *translated* page (e.g. on `/fr/a-propos/` → `/nl/over-mij/`, `/en/about/`), on the home to `/nl/`, `/en/`, `/fr/`. `hreflang`/`lang` attributes `nl-BE`, `en-GB`, `fr-FR`.
- Header and footer markup are identical on all 8 FR pages (only `aria-current="page"` on the home link and the auto-numbered `is-style-wide--N` class differ).

For comparison, EN menu: Work with me ▾ (Retreats, The Eros Sanctuary, Flavours of Desire, Sainte-Baume Guide), Cookbook, About me, The Journal, Contact, 🇬🇧 English ▾. NL menu: Werk met mij ▾ (Samenwerken, Weekendretreat 27-28-29 november 2026: PLAY, Maria Magdalena Retreat Zuid Frankrijk 2027, Flavours of Desire | Voeding, Verlangen & Zelfliefde, The Eros Sanctuary | Somatic Coaching & Sacred Sexuality, Sainte-Baume Gids), Kookboek, Over mij, The Journal, Contact, 🇧🇪 Nederlands ▾. The FR submenu order (Retraites, Flavours, Eros, Guide) differs from EN (Retreats, Eros, Flavours, Guide).

### 2.2 Page wrapper (default template, pages 2–4, 6, 8, 9)

`<main id="wp--skip-link--target" class="wp-block-group has-global-padding is-layout-constrained" style="margin-top:sp60">` → `<div class="wp-block-group alignfull" style="padding-top:sp60;padding-bottom:sp60">` → [optional `wp-block-post-featured-image` with `margin-bottom:sp60`, `object-fit:cover`, only when the page has a featured image — only **À propos** does] → `<h1 class="wp-block-post-title">` (page title, Floreal) → `<div class="entry-content wp-block-post-content alignfull has-global-padding is-layout-constrained">` (content width ~ the theme's content size, wide blocks use `alignwide`, `alignfull` blocks bleed to the viewport edge). The home uses `page-no-title` (`<main style="margin-top:0">`, no h1 from the template; the h1 lives inside the cover block).

### 2.3 Footer (`<footer class="wp-block-template-part">`)

Group with `padding-top/bottom: sp70`, inner `alignwide`:
1. `<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide" style="margin-bottom:36px">`
2. Spacer 20px
3. Row `alignfull`, space-between, align-items flex-start:
   - `<h2 class="wp-block-site-title"><a href="/fr/" rel="home">Swaane Lauwaert</a></h2>` (vertical group)
   - Social links `wp-block-social-links has-huge-icon-size has-icon-color is-style-logos-only`, both `style="color:#2c261e"` / `has-accent-3-color`: **Instagram** → `https://www.instagram.com/swaanelauwaert/` (new tab, `rel="noopener nofollow"`), **Facebook** → `https://www.facebook.com/swaane.lauwaert` (screen-reader labels "Instagram", "Facebook"; inline SVG icons 24×24).
   - Small-font (`has-small-font-size`, `font-style:italic; font-weight:400`) vertical group of two space-between rows: row 1: **"Tous Droits Réservés"** | **"© Swaane Lauwaert"**; row 2: **"Photographie"** | **"Pinterest, Unsplash"**.
4. After `</footer>` (outside the WP site blocks, injected by the host): `<div id="network-info" style="padding:10px;background:#171717;color:#939393;font-size:14px;text-align:center">Site by <a href="https://phareo.eu">Pharéo</a> | Hosted on <a href="https://status301.net/">The Permanently Moving Network</a></div>` (links `#ccc`, hidden by script when in an iframe). Visible as the dark bottom bar in every render. Decide whether to keep it.

### 2.4 Scripts / third parties present on FR pages

No `<iframe>`, `<video>`, `<audio>` or embeds on any FR page. External script: Jetpack stats `https://stats.wp.com/e-202643.js` (+ `_stq.push([...])` view beacon). Inline: WP Interactivity API (navigation, Jetpack form), speculation-rules prefetch JSON, emoji loader, Polylang cookie `pll_language=fr`, Otter content-slider (`otter-blocks/build/blocks/content-slider.js`, only on Livre de Cuisine), Jetpack form config with French error strings ("Veuillez saisir une adresse e-mail valide", "Champ obligatoire.", "Le formulaire que vous tentez de valider est vide.", "Veuillez remplir le formulaire correctement.", "Problème de connexion lors de l'envoi du formulaire. …", `unchecked_label "Non"`). Animate.css keyframes are inlined (unused by FR content).

External destinations used in FR content (all `target="_blank" rel="noreferrer noopener"` unless noted):
`https://calendly.com/swaanelauwaert/let-s-meet` (home, À propos, Accompagnement); Flodesk forms `https://swaanelauwaert.myflodesk.com/{zny46m6oyn, v3jg55lt2s, e5hyhsn3of, g8dtc4po0h, sin7ymkqj9, pd9vrqtv1x, vwrugoqvdt}`; `https://books2read.com/u/4DwK0r` (book); `https://substack.com/@swaanelauwaert1` (same tab); `https://www.instagram.com/swaanelauwaert/`; `https://en.wikipedia.org/wiki/Artemisia_Gentileschi` (same tab).

---

## 3. Page-by-page block inventory

### 3.1 Home — `/fr/` (id 76, `fr.html`)

- `<title>Swaane Lauwaert</title>`, canonical `/fr/`, body classes `home page-template-page-no-title page-id-76`.
- `featured_media` 4155 = the cover image (not rendered separately). Render: `local-shots/fr--desktop.png` (1440×6258) and `fr--mobile.png` (390×6680).
- Layout: `<main style="margin-top:0">` → `entry-content … is-layout-constrained` (all blocks constrained to content width unless `alignfull`).

Ordered blocks:

1. **Cover** `alignfull has-parallax has-custom-content-position is-position-bottom-center has-accent-1-color has-link-color` — `margin:0; padding: sp50 all sides; min-height: 80.4vh; aspect-ratio: unset`. Overlay `<span class="wp-block-cover__background has-contrast-background-color has-background-dim-0">` (0 % dim = no overlay). Background `<div class="wp-block-cover__image-background wp-image-4155 has-parallax" style="background-position:50% 50%; background-image:url(…/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg)">` → file `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` (1280×577 JPEG, 154 KB; pomegranates on black; only this size exists in the mirror). Parallax = `background-attachment: fixed`. Inner (`is-layout-constrained`): `<h1 class="wp-block-post-title has-accent-1-color has-xx-large-font-size" style="font-style:normal;font-weight:700">Swaane Lauwaert</h1>` bottom-left in white. Links inside coloured accent-1 (`.wp-elements-1 a`).
2. **Spacer** `sp50`.
3. **Cover — exact duplicate of block 1** (`wp-elements-3`, same image, same styles, same h1 "Swaane Lauwaert"). ⚠ Authoring mistake unique to FR (EN and NL homes have one cover). In the local desktop render the duplicate shows as a blank cream band with a faint white title because the fixed background is not repainted in the screenshot; in a browser it repeats the hero. Recommend dropping it in the rebuild.
4. **Spacer** `sp50`.
5. **Heading h2** `<strong>1. Coaching, travail corporel &amp; intimité:</strong>`.
6. **Paragraph** — "Parfois, le rythme effréné du quotidien, les vieux automatismes ou les tensions accumulées dans le système nerveux nous coupent de notre ancrage et de nous-mêmes. Lors de mes séances individuelles, j'associe le coaching corporel, le travail somatique et la régulation du système nerveux." (gist: 1:1 sessions blend body coaching, somatic work and nervous-system regulation).
7. **Paragraph** — "Un espace sécurisant et sans jugement pour revenir pleinement dans son corps et écouter ce qui est là. Si j'ai une spécialisation autour du désir, de l'intimité et de la féminité, ce n'est en rien un prérequis : votre besoin du moment — qu'il s'agisse de retrouver de l'apaisement, de traverser une transition ou simplement d'habiter votre corps — reste toujours le point de départ." (gist: safe non-judgemental space; specialisation in desire/intimacy is not a prerequisite).
8. **Paragraph (text link CTA)** — `[ <a href="https://calendly.com/swaanelauwaert/let-s-meet"><em>Séances individuelles</em> →</a>]` → displayed "[ Séances individuelles →]" (link text italic; brackets are plain text, the opening bracket + space is outside the link). Same-tab link.
9. **Heading h2 — empty** (`<h2 class="wp-block-heading"></h2>`, leftover).
10. **Separator** `wp-block-separator has-alpha-channel-opacity` (default style, content width).
11. **Heading h2** `<strong>2. Retraite Marie-Madeleine dans le Sud de la France 2027</strong> :` → "2. Retraite Marie-Madeleine dans le Sud de la France 2027 :".
12. **Paragraph** — "Une vraie parenthèse sous le soleil du Sud, pour enfin souffler et vous retrouver. Même si tout est encore en train de se caler, cette retraite tournera autour de la forêt magique de la Sainte-Baume et de la force de Marie-Madeleine. L'idée ? Ralentir, s'adoucir, et réhabiter pleinement son corps." (gist: 2027 retreat around the Sainte-Baume forest and Mary Magdalene; details still being finalised).
13. **Paragraph** — "Au programme : du bodywork somatique, du vrai repos pour relâcher la pression, de grandes tablées chaleureuses et de belles marches au calme dans la nature. Pas de planning blindé, pas d'injonctions : juste un endroit chaleureux et bienveillant où l'on pose ses valises, sans forcer les choses." (gist: programme = somatic bodywork, rest, shared meals, nature walks, no packed schedule).
14. **Paragraph (text link CTA)** — "[ <a href="https://swaanelauwaert.myflodesk.com/e5hyhsn3of"><strong>Restez connectés !</strong> →</a>]" → "[ Restez connectés ! →]" (bold link text).
15. **Separator**.
16. **Heading h2** `<strong>3. Livre de cuisine &amp; Marie-Madeleine</strong> : <strong>The Taste of HER Journey</strong> :` → "3. Livre de cuisine & Marie-Madeleine : The Taste of HER Journey :".
17. **Paragraph** — "Ce livre s'adresse aux cuisiniers intuitifs, à ceux qui cherchent du sens, et aux amoureux des belles histoires. À tous ceux qui savent qu'un repas, c'est tellement plus que du simple carburant. C'est une histoire de souvenirs, de rituels et de lien avec la terre. Mais par-dessus tout, c'est une histoire d'amour : la magie toute simple de manger ensemble, d'accueillir du monde autour de sa table et de savourer la vie côte à côte. Dans mon tout premier livre, *The Taste of Her Journey*, je vous ouvre les portes de ma cuisine et vous emmène dans les lieux qui me touchent droit au cœur — notamment cette terre sacrée et ancestrale de Marie-Madeleine. Le résultat ? Un recueil d'histoires et de recettes qui réchauffent l'âme et créent du lien." (book title in `<em>`).
18. **Paragraph (text link CTA)** — "[<a href="https://books2read.com/u/4DwK0r">Découvrez le livre &amp; commandez votre exemplaire</a> →]" → "[Découvrez le livre & commandez votre exemplaire →]" (here the arrow and brackets are outside the link; same-tab).
19. **Separator**.
20. **Image** `figure.wp-block-image.is-resized` — `<img fetchpriority="high" width="768" height="1024" style="aspect-ratio:0.75;width:768px;height:auto" class="wp-image-5565">` src `wp-content/uploads/sites/50/2026/08/MVIMG_20260817_163022_1-768x1024.jpg` (768×1024 JPEG, 185 KB; Swaane in a blue top holding the book). srcset: `-225x300.jpg`, `-768x1024.jpg`, `-1152x1536.jpg`, `-1536x2048.jpg`, `-scaled.jpg` (1920w) — all present in `…/uploads/sites/50/2026/08/`. Displayed 768 px wide (portrait 3:4), left-aligned in the content column. ⚠ Missing from the desktop render (blank area) but visible in `fr--mobile.png`; screenshot artefact, not a broken image.
21. **Heading h4 — empty** (`<h4 class="wp-block-heading"></h4>`).
22. **Separator**.
23. **Group** `alignfull is-style-section-1` (bg accent-5 #F1EEE9, text contrast; `margin:0; padding-top/bottom:0`):
    1. Spacer `sp50`.
    2. **Pullquote** `figure.wp-block-pullquote` → `<blockquote><p>Are you ready to trade the numbness for the nectar?</p></blockquote>` — **English, untranslated** (Beiruti, xx-large, weight 500, centred, no cite).
    3. **Buttons** (`is-content-justification-center`): one button `<a class="wp-block-button__link has-text-align-left wp-element-button" href="https://swaanelauwaert.myflodesk.com/v3jg55lt2s" target="_blank">Yes! Keep me posted please!</a>` — **English, untranslated** (EN home uses the same text/URL; NL home uses a different Flodesk id).
    4. Spacer `sp50`.
    5. **Gallery** `wp-block-gallery has-nested-images columns-default is-cropped` (3 images → 3 equal columns on desktop, cropped to equal height, 2-up then 1 on mobile; no captions, no lightbox):
       - `…/2026/08/IMG-20260404-WA0004.jpg` 539×719 (`data-id="5572"`, srcset 225w/539w) — woman in blue dress, outdoors.
       - `…/2026/08/IMG_5348-768x1024.jpeg` 768×1024 (`data-id="5573"`, srcset 225/768/1152/1536w; full `IMG_5348.jpeg` present) — woman in pink dress with pomegranate.
       - `…/2026/08/MVIMG_20260817_163746-EDIT-893x1024.jpg` 893×1024 (`data-id="5574"`, lazy, srcset 262/768/893/1340/1787w) — woman in flowery dress holding the book.
       (⚠ not painted in the desktop render; visible in the mobile render.)
24. **Spacer** `sp40`.
25. **Paragraph — empty**; 26. **Paragraph — empty**.
27. **Separator**.
28. **Group** `alignfull is-style-section-1` (`padding 0`):
    1. Spacer `sp50`.
    2. **Pullquote** "Es-tu prête à quitter la torpeur pour goûter au nectar de la vie ?" (French counterpart of the English pullquote above — FR home therefore shows *both*).
    3. **Buttons** centred: `<a … href="https://swaanelauwaert.myflodesk.com/zny46m6oyn" target="_blank"><strong>Oui ! Je suis prête à réclamer mon désir le plus sacré !</strong></a>` (bold label).
    4. Spacer `sp50`.
29. **Group** `alignfull is-style-section-1` **`id="contact"`** (`padding-top/bottom: sp70`) — the target of every "Contact" nav item and of the in-page CTAs `#contact`:
    1. **Heading h2** `has-text-align-left is-style-default`: "Une question ? N'hésitez pas."
    2. **Jetpack contact form** `#contact-form-76` (`form#jp-form-017bf96…`, `action="/fr/"` POST, `aria-label="Swaane Lauwaert"`, style `is-style-outlined` with notched/floating labels, inputs `has-small-font-size`, `border-style:solid`):
       - Text input `name="g76-nom"` id `g76-nom`, required — label **"Nom (obligatoire)"**.
       - Email input `name="g76-email"`, required — label **"E-mail (obligatoire)"**.
       - Textarea `name="g76-message"` id `contact-form-comment-g76-message` — label **"Message"**.
       - Error list container `aria-label="Erreurs de formulaire"`.
       - Submit: `wp-block-jetpack-button is-style-outline` → `<button type="submit" class="wp-block-button__link is-style-outline">Envoyer</button>` with hidden spinner + sr-text "Envoi du formulaire".
       - Hidden: `jetpack_contact_form_jwt` (signed form definition), `jetpack_form_fill_duration`, `contact-form-id=76`, `action=grunion-contact-form`, `contact-form-hash=017bf96efc52775e829737ebc68f849013d59184`, Akismet honeypot `<p class="akismet-fields-container" style="display:none!important">Δ</p>`.
       - Success panel (hidden until AJAX success): "← Retour" (link to `/fr/`) and heading **"Uw bericht is verzonden"** — ⚠ Dutch on the FR (and EN) page.
       - Static rebuild needs a replacement backend (Netlify/Vercel form, Formspree, etc.); keep field labels and the `#contact` anchor.
30. **Spacer** `sp40`.
31. **Group** `is-style-default has-small-font-size` **`id="liability"`**:
    1. Paragraph `<strong>Clause de non-responsabilité</strong>`.
    2. Paragraph "Swaane Lauwaert n'est ni un professionnel de la santé mentale ni un professionnel de la santé médicale. Les services proposés ne se substituent en aucun cas à une prise en charge psychologique ou médicale professionnelle. Ils ne sont pas destinés à diagnostiquer, traiter ou guérir des pathologies mentales ou médicales."
    3. Paragraph "Swaane Lauwaert 511 Boulevard des Musiciens, 83860 Nans-les-Pins. France. Email: info@swaanelauwaert.com Téléphone:+33 789 06 32 01" (plain text, no mailto/tel links).
32. **Spacer** `sp40`.

Render check (`fr--desktop.png`): sticky cream header; hero with white title bottom-left; cream content column; two light-grey (#F1EEE9) full-bleed bands (English pullquote + button, then French pullquote + button); contact form with outlined fields and outline "Envoyer" pill; liability block; footer; dark credit bar. Mobile render confirms the stacked order and shows all images.

### 3.2 À propos — `/fr/a-propos/` (id 4100)

- `<title>À propos – Swaane Lauwaert</title>`; og:image = featured image 957×960. Render `fr-a-propos--desktop.png` (1440×3121).
- `featured_media` 2030 → template renders `<figure class="wp-block-post-featured-image" style="margin-bottom:sp60"><img class="attachment-post-thumbnail size-post-thumbnail wp-post-image" style="object-fit:cover" width="957" height="960" src="…/2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg">` → `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` (957×960 JPEG, 23 KB; portrait of Swaane, dark top, white wall). Variants present: `-150x150`, `-300x300`, `-768x770` (+ `.webp` for each; EN/NL pages reference the `.jpeg.webp`). Displayed at content width (~615 px), square.
- `comment_status: open` in the API but no comments block is rendered.

Blocks (inside `entry-content alignfull`):

1. **h1** (template) "À propos".
2. **Paragraph** "SWAANE LAUWAERT (°1977 Belgium)".
3. **Paragraph** "Dans mon accompagnement en tant que Thérapeute Corporelle et Coach en Intimité & Sexualité, je crée un espace sacré dédié à l'harmonie profonde **tussen** l'âme et le corps." — ⚠ Dutch "tussen" (= "entre").
4. **Paragraph** "Je suis convaincue que l'AMOUR est le souffle de notre humanité, ce fil invisible qui nous relie les uns aux autres. Mon travail est porté par la certitude que la guérison du monde commence par la réconciliation avec notre propre corps. En revenant à l'écoute de nos sens avec bienveillance, nous bâtissons un monde plus compatissant ; car un corps qui se sent en sécurité est un corps capable d'aimer pleinement."
5. **Paragraph** "Je vis au pied des montagnes sacrées de la Sainte-Baume, dans le Sud de la France. Sur les traces de la légende de Marie-Madeleine, j'anime des retraites et chemine aux côtés de celles et ceux qui sont prêts à restaurer leur puissance souveraine."
6. **Paragraph** "À travers l'écriture, je danse avec les mots pour exprimer l'indicible. En tant que chef professionnelle, je perçois l'alchimie culinaire comme un rituel sensoriel — une source infinie de créativité et de nourriture pour l'esprit."
7. **Paragraph** "Dans chacune de mes actions, ma mission reste la même : vous aider à vous libérer des armures de la honte et de la survie, pour vous guider vers le sanctuaire de votre propre corps. Ensemble, nous quittons les figements du passé pour embrasser le feu de votre moi le plus authentique, sensuel et sauvage."
8. **Buttons** (left): "Au plaisir de nous rencontrer !" → `https://calendly.com/swaanelauwaert/let-s-meet` (new tab).
9. **Separator**.
10. **h2** "Formations:".
11. **Separator**.
12–23. **Twelve paragraphs** (year in `<strong>`), verbatim:
    - "**2025-2026** : Layla Martin, Sex, Love and Relationship Coaching Certification"
    - "**2025:** Valley orgasm, online training"
    - "**2024-2025** : Rosie Chehade. Quantum School of Sacred Alchemy for Advanced Quantum Coach Certification. In combination with NLP and Matrix Therapies with Shereen Lister."
    - "**2025** : Breathwork 2-day deep dive (Jessy Bettio, Antwerp)"
    - "**2024** : Soundhealing: workshop Marseille"
    - "**2024** : Wim Hof: online training"
    - "**2023** : Innerdance Facilitator Training (Antonia Hauterville & Katie Holland, Paris)"
    - "**2022** : Innerdance Intensive (Pi Vilerazza)"
    - "**2021** : Elliott Saxby Kundalini Online Bodycourse"
    - "**2020** : Reiki Level 1 (Marie-Ange Aubert, Centre Alter Ego, La Seyne-sur-Mer)"
    - "**2015** : Transcendental Meditation, Antwerp"
    - "**2001:** Family Sciences graduate, Brussels"
    (training list is in English on all three languages.)

vs EN `/en/about/`: same structure; EN adds the sentence "I am a Facilitator of Transformation ." as a separate paragraph (absent in FR), uses a `<ul class="wp-block-list">` for the trainings (FR/NL use paragraphs), heading "Trainings:", button "Let's meet!". vs NL `/nl/over-mij/`: NL has one paragraph fewer (no "mission" paragraph), heading "Opleidingen:", button "Let's meet!".

### 3.3 Accompagnement — `/fr/accompagnement/` (id 4502)

- `<title>Accompagnement 1:1 — Coaching Somatique &amp; Travail Corporel – Swaane Lauwaert</title>`; og:image `…/2026/10/Screenshot-2026-10-10-105756.png` 515×659. Render `fr-accompagnement--desktop.png` (1440×2741).

Blocks:

1. **h1** "Accompagnement 1:1 — Coaching Somatique & Travail Corporel".
2. **Cover** `alignfull has-custom-content-position is-position-bottom-center` — `margin:0; padding: sp50; min-height: 840px`; overlay `has-background-dim-10` (10 % black); background **`<img class="wp-block-cover__image-background size-large" width="1024" height="683">`** `…/2026/08/DSC03534-1024x683.jpg` → `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/2026/08/DSC03534-1024x683.jpg` (1024×683 JPEG, 110 KB; Swaane in a blue blouse at a table with pink flowers; variants `-300x200`, `-768x512`, `-1536x1024`, `-2048x1365` present). Rendered full-bleed, 840 px tall, image object-fit cover (not parallax). Inner: group `alignwide` left-justified:
   - **h2** `has-text-align-left has-xx-large-font-size` "We don't heal alone, we heal together." — ⚠ **English** (same on EN and NL pages).
   - empty paragraph.
   - **Buttons**: "Join us!" → `https://swaanelauwaert.myflodesk.com/g8dtc4po0h` (new tab) — ⚠ English; the FR link uses the NL Flodesk id (EN uses `v3jg55lt2s`).
   Text is white in the render (cover default light text on dark overlay).
3. **Group** `alignfull is-style-section-5 has-base-background-color` (`margin:0; padding-top/bottom: sp50`) — the section style sets text colour `base` and heading colour `base`, but the explicit `has-base-background-color` makes the group background cream; the red comes from the columns:
   1. **Columns** `alignwide has-accent-2-background-color` (solid **#c60000** card, cream text):
      - Column 50 % (vertically centred): **h2** "Quand les mots apportent la clarté et que le corps prend la parole." (cream, Floreal); **paragraph** `has-medium-font-size` "Une séance de 60 minutes : 75 €"; paragraphs: "Lors de mes séances individuelles, on échange, on dénoue les fils et on pose les choses pour faire le point sur ce qui se passe dans votre vie. Cette parole est précieuse, indispensable pour mettre de la conscience et installer un cadre sécurisant." / "En même temps, on sait souvent très bien ce qui coince — notre tête comprend généralement l'histoire. Mais le véritable déclic opère dès lors qu'on laisse le corps s'exprimer." / "Au fil de la séance, on quitte le mental pour descendre dans les sensations physiques. À travers le travail somatique, le souffle, une présence douce et le travail corporel, on se met à l'écoute de ce que votre système nerveux, vos muscles et votre respiration cherchent à raconter. On offre ainsi au corps l'espace nécessaire pour relâcher les vieilles tensions et redevenir un véritable refuge : un lieu sûr, vibrant et habité." / "Voyons ensemble ce dont vous avez besoin. Chaque accompagnement individuel est entièrement sur mesure. Tout commence par un premier échange offert, simplement pour sentir où vous en êtes et voir si le courant passe entre nous."; **paragraph** `has-medium-font-size` `<em>(Photos : Louise van Gent)</em>`.
      - Column 50 % (vertically centred): **Image** `size-full` `<img style="aspect-ratio:1;object-fit:cover" width="515" height="659">` `…/2026/10/Screenshot-2026-10-10-105756.png` → `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/2026/10/Screenshot-2026-10-10-105756.png` (515×659 PNG, 302 KB; black-and-white portrait, hand on chin; variant `-234x300.png`). Displayed as a **square** crop (~376 px) inside the red card.
   2. **Buttons** (left, outside the columns but inside section-5): "Contactez-moi!" → `https://calendly.com/swaanelauwaert/let-s-meet` (new tab). Because of the section-5 rule it renders **inverted**: base (cream/white) background, contrast text.
4. **Group** `alignfull` (`margin:0`) → group `alignwide` (`padding-top/bottom: sp50`) → empty vertical group. Renders as ~100 px of empty space.
5. **Group** `alignfull` (`margin:0`) — empty.

vs EN `/en/work-with-me/`: identical structure and images; EN columns additionally carry `has-accent-3-color`; EN has an empty medium paragraph before the price, price "One 60-minute session: €75", button "Let's meet!", and a trailing empty paragraph. vs NL `/nl/samenwerken/`: NL adds, after the empty groups, a section "Got questions? Feel free to reach out." (link to `#contact`) with centred Facebook/Instagram social icons (hrefs `#`), button "Let's talk!". FR has none of that.

### 3.4 Flavours of Desire — `/fr/flavours-of-desire-2/` (id 4537)

- `<title>Flavours of Desire – Swaane Lauwaert</title>`; og:image `…/2026/02/a4a043d325ecfae0844bcce21546e339.jpg` 736×736. Render `fr-flavours-of-desire-2--desktop.png` (1440×3634), mobile 390×2946.
- Child page: `/fr/flavours-of-desire-2/modules/` (id 5101, password-protected, see §6) — **not linked** from this page.

Blocks:

1. **h1** "Flavours of Desire".
2. **Separator**.
3. **Media & Text** `is-stacked-on-mobile` (media left, 50/50): image `size-full` `…/2026/02/a4a043d325ecfae0844bcce21546e339.jpg` (736×736 JPEG, 69 KB; peach half on pink fabric; variants `-150x150`, `-300x300`). Content: **paragraph** "Programme: FLAVOURS OF DESIRE"; **paragraph** "The sensual kitchen date night (coming soon)" — ⚠ English; **Buttons**: "Keep me updated on Flavours of Desire" → `https://swaanelauwaert.myflodesk.com/sin7ymkqj9` (new tab) — ⚠ English; empty paragraph.
   ⚠ Content is outdated relative to EN/NL, which announce the programme as released ("FLAVOURS OF DESIRE is OUT!!!!!!" / "FLAVOURS OF DESIRE is nu te koop!!!!") with a BUY button (`…/flavoursofdesireminicourse`, `…/flavoursofdesireprogramma`).
4. **Group** `alignfull` (`margin:0; padding-top/bottom: sp50`) → **Columns** `alignwide`:
   - Column `flex-basis:56%`: **Image** `size-full` `<img style="aspect-ratio:1;object-fit:cover" width="577" height="866">` `…/2026/01/7e913d8245b765d0f1ef82803d7c2f7e.jpg` (577×866 JPEG, 106 KB; red grapefruit/pomegranate macro; variant `-200x300`). Displayed as a square crop (~545 px).
   - Column (auto, vertically centred): **h2** "Réclamer l'Érotisme du Quotidien."; paragraphs: "Quand le monde devient trop lourd ou que le vide intérieur semble immense, nous utilisons la nourriture **voor** apaiser la douleur. Mais ce soulagement est un piège. Il enclenche un cercle vicieux d'auto-punition et réveille un critique intérieur acéré qui traite ton corps comme un problème à résoudre, plutôt que comme un temple à chérir." (⚠ Dutch "voor" = "pour") / "En te retournant contre toi-même, tu coupes le lien avec ton propre cœur. Cette guerre intérieure crée un monde où tu ne peux plus aimer la femme que tu vois dans le miroir. Tu te retrouves figée — prisonnière d'un corps qui ressemble à une cage de honte et de désirs inavoués." / "Mon approche n'est pas un régime ; c'est une révolution sensorielle. Nous troquons l'épuisement du contrôle et de la volonté contre la sagesse de ton instinct. Je t'apprends à ne plus voir tes « cravings » comme des échecs, mais comme une carte sacrée — un guide qui nous mène directement aux faims émotionnelles, relationnelles et nutritionnelles ignorées depuis trop longtemps." / "Une étape essentielle de ce voyage est de se libérer du lourd fardeau de la honte. D'après mon expérience, la honte est bien plus toxique pour ton système que n'importe quel aliment ne le sera jamais. À travers des pratiques somatiques spécialisées, nous commençons à nous lier d'amitié avec le corps que tu as aujourd'hui, en honorant sa résilience et en embrassant chaque centimètre de ce temple qui t'a portée jusqu'ici." / "Ensemble, nous apprendrons à décoder les murmures de ton corps, pour distinguer le rugissement de la faim biologique du silence douloureux d'un vide émotionnel ou d'une aspiration profonde. Nous ne réparons pas seulement ta relation avec la nourriture ; nous libérons ta capacité à ressentir, à goûter et à désirer à nouveau."; empty paragraph; **Buttons**: "Oui ! Je veux tout vivre pleinement !" → `/fr/#contact` (same tab).
5. **Media & Text** `is-stacked-on-mobile` (media left): image `size-full` `…/2026/02/b69a7dfbf5eaad18b7b69648d56c9c49.jpg` (800×800 JPEG, 61 KB; heart-shaped pomegranate on black; variants `-150x150`, `-300x300`, `-768x768`). Content: **paragraph** `<em>Un rêve partagé, une table dressée. Mon tout premier livre de cuisine arrive bientôt. J'ai tellement hâte de t'inviter dans ma cuisine.</em>`; **Buttons**: "Tenez-moi au courant de la sortie du livre !" → `https://swaanelauwaert.myflodesk.com/pd9vrqtv1x` (new tab). ⚠ Outdated: the book is out (see 3.7) — EN/NL keep the same teaser though.
6. **Group** `alignfull` (`margin:0; padding-top/bottom: sp50`) → **Group** `alignwide is-layout-grid` (`grid-template-columns: repeat(auto-fill, minmax(min(16rem,100%),1fr)); gap: sp50`) with four cells:
   1. vertical group: **h2** `has-x-large-font-size` "Une prière charnelle:".
   2. vertical group (stretch): **Cover** (no overlay dim: `has-background-dim-0`, `background-color:#833d3a`) with `<img class="wp-block-cover__image-background size-full" loading="lazy" width="736" height="863">` `…/2026/01/7c754abd9bc7f6a913a765577b33dea2.jpg` (736×863 JPEG, 123 KB; variant `-256x300`); inner only a spacer `sp20` (so the cover is just the image at its natural ratio); then **paragraph** `has-text-align-center` "Embraser."
   3. vertical group: **Cover** `is-light` (`#828282`, dim 0) image `…/2026/01/2211d321fe9f6f2c415cafa5ab80fcc2.jpg` (736×975, 95 KB, lazy; variant `-226x300`) + spacer; **paragraph** centred "Dévorer."
   4. vertical group: **Cover** (`#d6bc98`, dim 0) image `…/2026/01/bb3e19bbdc0e7db827b33c44fc650fdb-1.jpg` (700×875, 65 KB, lazy; variant `-1-240x300`) + spacer; **paragraph** centred "Lâcher-prise."
   Rendered as the heading in the first grid cell and three image+caption cells (desktop 4 columns ≥ 64rem, wrapping on narrower screens; on mobile each is full width). The three cover images are lazy-loaded and therefore blank in both local renders; files are present.

vs EN: identical structure; EN captions "Ingnite" (sic) / "Devour" / "Surrender", heading "A Living Prayer:", button "Yes! I want to feel it all!" → `/en/#contact`, cookbook button "Stay tuned for my cookbook…" → `…/tpf30n5jns`. vs NL: NL adds a Vimeo embed (`https://player.vimeo.com/video/1177988427`, "INTRO Flavours of Desire NL") under the macro image, column split 33/67, captions "Ontvlam." / "Verslind." / "Versmelt.", heading "Een tastbaar gebed:", and no second media-text cookbook teaser; NL title "Flavours of Desire: mini online course at your own pace".

### 3.5 The Eros Sanctuary — `/fr/le-corps-libre/` (id 4531)

- `<title>The Eros Sanctuary – Swaane Lauwaert</title>` (English title kept); og:image `…/2026/01/9d110192f5f3236a1cb2cf7d956f15b0.jpg` 736×1104. Render `fr-le-corps-libre--desktop.png` (1440×2388).

Blocks:

1. **h1** "The Eros Sanctuary".
2. **Cover** `alignfull is-light has-contrast-color has-link-color` **without an image**: overlay `<span class="wp-block-cover__background has-base-background-color has-background-dim-100">` → a solid `base`-coloured full-bleed band (`margin:0; padding-top/bottom: sp60; padding-left/right: sp50`), contrast text. Inner → **Columns** `alignwide`:
   - Column `flex-basis:65%` → vertical group (stretch): **paragraph** "<strong>Ici, on ne se contente pas de parler de guérison, on va l'incarner. La ressentir.</strong> Dans mes séances individuelles, on laisse de côté le brouhaha du mental pour plonger directement dans l'intelligence de ton système nerveux et la sagesse de ton corps. On explore ces vieux bagages et ces conditionnements sociaux qui s'y sont cristallisés. Et dès que cette armure tombe, ton essence profonde reprend vie. Tu ne réagis plus à partir de tes anciennes blessures, mais depuis la beauté de l'instant présent." / **paragraph** "Je t'accompagne en créant le calme et l'espace nécessaires pour libérer ces énergies bloquées. On vient adoucir les tensions autour du bassin, laisser fondre les couches de protection autour du cœur et redonner de l'espace à la puissance de ta voix. C'est ainsi que tu retrouves le chemin vers qui tu es vraiment." / **paragraph** "La guérison n'a **niet** pas toujours besoin d'être lourde ou intense. Elle peut aussi être légère, joyeuse et érotique. Dans ma pratique, nous faisons place à la « Sexualité Sacrée ». Il s'agit de libérer ton intimité de l'ombre de la honte, de la performance **of** de l'objectification. On la ramène vers ton ressenti et ta propre souveraineté. Au lieu de voir ton corps comme quelque chose à améliorer ou à contrôler, je le vois comme un lieu sacré. La sexualité devient alors une forme de recueillement — un moment de présence profonde, où tu es pleinement en contact avec tes sens et tout ce que tu ressens. Ce n'est pas une simple décharge ; c'est un réveil sensuel." (⚠ Dutch "niet" and "of") / empty paragraph; then **Buttons**: "Oui! Je veux travailler ensemble!" → `/fr/#contact`.
   - Column `flex-basis:35%` → vertical group: **Image** `size-full` `<img style="aspect-ratio:3/4;object-fit:cover" width="736" height="1104">` `…/2026/01/9d110192f5f3236a1cb2cf7d956f15b0.jpg` (736×1104 JPEG, 43 KB; close-up of a neck/throat; variants `-200x300`, `-683x1024`), displayed 3:4 (~352×470); **paragraph** `has-text-align-right has-x-large-font-size` `style="line-height:1.2"`: link "Instagram" → `https://www.instagram.com/swaanelauwaert/` (same tab, underlined).
3. **Columns** (66.66 % / 33.33 %): left: **Quote** `wp-block-quote` → `<p><strong>C'est la fin de l'engourdissement. Tu en ressortiras en sentant le flux délicieux et vibrant de ta propre force vitale couler dans tes veines. Ton corps ne sera plus seulement un foyer, mais un sanctuaire de délice, une source de joie et un terrain de jeu pour tous tes sens.</strong></p>` (rendered italic with a left border, no cite); right column empty.
4. **Media & Text** `is-stacked-on-mobile` (media left): image `size-full` `…/2026/02/59653540d6bf783e7fb741cc68cf58bb-819x1024.jpg` (819×1024 JPEG, 126 KB; collarbone with the words "Dear body, I trust you."; variants `-240x300`, `-768x960`, full `59653540….jpg`). Content: **paragraph** "Programme: The Eros Sanctuary (coming soon)"; **Buttons**: "Joignez The Eros Sanctuary" → `https://swaanelauwaert.myflodesk.com/vwrugoqvdt` (new tab).

vs EN `/en/the-eros-sanctuary-2/` (= `/en/body-untamed/`): the FR page is a **much shorter, older version**. EN has: intro paragraph + button "Yes! Ignite my inner fire!" (`…/theerossanctuaryeng`), "An ORGASTIC LIFE…" paragraphs, a 5-item list, a 3-image gallery (`2026/04/0e9a4aa…jpg`, `30e0d24…jpg`, `af472e9…jpg`), a full-width repeat button, a different side image (`2026/04/4e2393ae….jpg` 720×900), three closing paragraphs, the quote, media-text "Are you ready to play?" / "Stay tuned THE EROS SANCTUARY", a testimonial quote ("I didn't know I could feel this much…"), and a final 3-image gallery (`2026/04/8881d238…`, `31151a88…`, `327d1cd8…`). NL mirrors EN (title "The Eros Sanctuary: 6 weken live online programma", registration for 2027). None of that exists in FR; the FR body copy (the three paragraphs) is unique to FR and has no EN equivalent.

### 3.6 Le Journal — `/fr/le-journal/` (id 80)

- `<title>Le Journal – Swaane Lauwaert</title>`; body class `blog` (theme "home" template, not the page's own content; the page record itself is empty apart from the admin-note excerpt). Render `fr-le-journal--desktop.png` (1440×970).
- No `<main>`; after the header: `<div class="wp-block-group ona-container has-global-padding is-layout-constrained" style="margin-top:0;margin-bottom:0">`:
  1. Spacer 40px.
  2. **Buttons** centred: `<div class="wp-block-button is-style-fill"><a class="wp-block-button__link wp-element-button">SUBSTACK</a></div>` — ⚠ **no `href`** (dead button). Intended target is clearly `https://substack.com/@swaanelauwaert1`.
  3. **Quote** block containing two paragraphs: "J'écris sur ce qui compte vraiment pour moi : la famille, mon travail, la nature, l'art, Marie-Madeleine et la vie quotidienne toute simple !" and "SUIVEZ MOI SUR : <a href="https://substack.com/@swaanelauwaert1">https://substack.com/@swaanelauwaert1</a>" (same tab).
  4. Spacer 20px.
  5. **Query Loop** `alignwide` (posts in the current language) → `wp-block-query-no-results` → paragraph "Désolé, rien n'a été trouve." (sic — missing accent; WordPress core string would be "trouvé"). All 210 posts are Dutch, so FR (and EN) show no posts.
  6. Spacer 20px; spacer 80px.
- vs EN/NL journal: EN and NL additionally render an empty centred `<h1>` before the button and an `<h1 class="wp-block-heading has-text-align-center">The Journal</h1>` inside the quote; FR has **no visible page title at all**. NL shows the actual post grid (`columns-3`, featured image with `hover-scale`, centred post title, date "17 oktober 2018" …) — for the rebuild, decide whether the FR journal should list the Dutch posts, link to Substack only, or be dropped.

### 3.7 Livre de Cuisine — `/fr/livre-de-cuisine/` (id 4918)

- `<title>Livre de Cuisine: The Taste of Her Journey – Swaane Lauwaert</title>`; og:image `…/2026/08/MVIMG_20260817_163817_1-scaled.jpg` 1920×2560 (the slider's first image; `-scaled.jpg` is present). Render `fr-livre-de-cuisine--desktop.png` (1440×3328), mobile 390×5127.

Blocks:

1. **h1** "Livre de Cuisine: The Taste of Her Journey".
2. **Cover** `alignfull is-light has-parallax has-accent-1-color has-link-color` — `margin:0; padding-top/bottom: 200px; padding-left/right: sp50; min-height: 739px`; overlay `has-background-dim-10` with `background-color:#a0a192`; background `<div class="wp-block-cover__image-background wp-image-5508 size-full has-parallax" style="background-position:50% 50%; background-image:url(…/2026/08/Screenshot-2026-08-23-201541.jpg)">` → `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/2026/08/Screenshot-2026-08-23-201541.jpg` (**342×507** JPEG, 70 KB — a small book-cover screenshot stretched as a fixed full-bleed background; aubergine/feta dish; variant `-202x300`). ⚠ Low-resolution hero; consider a larger source. Inner (constrained): **h3** `has-text-align-center has-xx-large-font-size` `<em>Un rêve partagé, une table dressée. Mon tout premier livre de cuisine est enfin là ! J'ai tellement hâte de vous accueillir dans ma cuisine.</em>` (white italic Floreal); empty centred paragraph; **Buttons** centred, two `is-style-fill` buttons with `has-contrast-color has-accent-1-background-color` (white pills, dark text; first also `has-accent-1-border-color`): "Commandez le livre BROCHÉ ici !" and "Commandez le livre RELIÉ ici !" → both `https://books2read.com/u/4DwK0r` (new tab).
3. **Paragraph** `has-text-align-center` "Une traversée sensorielle et poétique à travers les paysages sacrés de la Méditerranée."
4. **Paragraph** "<em>The Taste of Her Journey</em> est bien plus qu'un simple livre de cuisine : c'est une véritable exploration sensorielle, historique et spirituelle. À travers 100 recettes créatives et des récits immersifs, Swaane Lauwaert retrace le chemin légendaire de Marie-Madeleine—des rivages ensoleillés de Galilée jusqu'au silence paisible du massif de la Sainte-Baume en Provence."
5. **Quote** "« Ce livre célèbre la cuisine comme un rituel sacré de reconnexion : au rythme des saisons, aux herbes sauvages, aux mémoires ancestrales et à la force du féminin. »" (left border, no cite).
6. **Paragraph — empty**.
7. **Paragraph** "<strong>Langue :</strong> Anglais".
8. **Paragraph** "<strong>ISBN :</strong> 9798187568222 (livre broché) / 9789090429786 (livre relié)".
9. **Paragraph** "<strong>Nombre de pages :</strong> 250 pages".
10. **Paragraph** "<strong>Année de parution :</strong> 2026".
11. **Otter button group** `#wp-block-themeisle-blocks-button-group-d96a39fd` containing **one empty button** `#wp-block-themeisle-blocks-button-193c95a7` (`<a target="_self" class="wp-block-button__link"><span></span></a>`, no href, no text) — ⚠ renders as a small black pill (visible in both renders). Drop in the rebuild. (EN has the same artefact; NL doesn't.)
12. **Separator**.
13. **Buttons** centred: "Commandez le livre BROCHÉ ici !" → books2read (new tab).
14. **Separator**.
15. **Buttons** centred: "Commandez le livre RELIÉ ici !" → books2read (new tab).
16. **Separator**.
17. **Otter Content Slider** `#wp-block-themeisle-blocks-content-slider-9fac4092` (`role="region" aria-label="Content slider"`, `--o-per-view:1; --o-gap:0px; --o-height:auto`, `data-autoplay="false" data-delay="5" data-loop="true"`; scroll-snap track, prev/next round buttons `aria-label="Previous slide"/"Next slide"` (40 px, white chevron on rgba(0,0,0,.5)), dot pagination generated by JS, i18n "Go to slide %d"). Three slides, each a group with a centred image and an empty centred paragraph:
    1. `figure.wp-block-image.aligncenter.size-large` → `…/2026/08/MVIMG_20260817_163817_1-768x1024.jpg` (768×1024, 136 KB; Swaane in blue holding the book in front of a wooden shutter; srcset 225/768/1152/1536/scaled 1920w).
    2. `…/2026/08/Photo-43-EDIT-768x1024.jpg` (768×1024, 175 KB; srcset 225/768/1152/1536/scaled).
    3. `figure … size-full` → `…/2026/08/Screenshot-2026-08-23-201541.jpg` (342×507 — the book cover).
    Render shows slide 1 on mobile; the desktop render shows the arrows and three dots but a blank track (image not painted). All three files are present.
18. **Paragraph — empty** (centred); 19. **Paragraph — empty**; 20. **Paragraph — empty** (centred); 21. **Paragraph — empty**.

vs EN `/en/cookbook/`: same structure, same images, same empty Otter button, buttons "Buy the PAPERBACK here!" / "Buy the HARDCOVER here!", metadata "Language: English", "Page Count: 250 pages", "Publication Year: 2026". vs NL `/nl/kookboek/`: different hero image (`…/2026/08/Screenshot-2026-08-25-001201.jpg`), Jetpack Slideshow instead of the Otter slider (3rd slide `Screenshot-2026-08-25-001028.jpg` 564×744), no empty Otter button, plus an extra closing section "Aan Tafel in het Land van Maria Magdalena" (paragraph about cooking for retreats, button "www.lacuisineverte.com" → `https://www.lacuisineverte.com`, image `…/2026/08/WhatsApp-Image-2026-08-14-at-17.04.05-1024x804.jpeg`). FR has no equivalent of that section.

### 3.8 Retraites — `/fr/rituels-dancrage/` (id 4550)

- `<title>Retraites | Cérémonies &amp; Retraites – Swaane Lauwaert</title>`; og:image `…/2026/02/5eaaabe9572dec3fc263928e634ab651.jpg` 1199×1134 (full-size file present). Render `fr-rituels-dancrage--desktop.png` (1440×5360), mobile 390×5627.

Blocks:

1. **h1** "Retraites | Cérémonies & Retraites".
2. **Group** `alignfull` (`min-height:0vh; margin:0; padding-top/bottom: sp70; padding-left/right: sp40`) → inner **Group** (constrained):
   1. **h2** `has-text-align-center` "La Force des Rituels & des Cérémonies".
   2. **Paragraph** `has-text-align-left` "Pour moi, **een ritueel of een ceremonie** n'est jamais un simple geste. C'est un point d'ancrage qui vient inscrire le rythme de la nature et les changements inévitables de la vie directement dans notre système nerveux." (⚠ Dutch fragment = "un rituel ou une cérémonie").
   3. **Paragraph** "Dans notre monde moderne, nous avons perdu l'art de marquer les transitions. Nous passons d'une étape de vie à une autre — du deuil à la renaissance, de la jeune fille à la mère, du silence à la parole — sans jamais vraiment s'arrêter sur le seuil que nous franchissons. Sans ces pauses, nous avançons tête baissée, souvent déconnectés de nous-mêmes, alors que le tumulte du quotidien prend le dessus et que la profondeur de l'instant présent nous échappe."
   4. **Paragraph** "Je crois que les rituels et les cérémonies sont essentiels pour notre âme collective ; ils sont indispensables à notre sentiment d'appartenance. Ils nous rappellent que nous n'avons pas à porter seuls les grands changements de la vie, mais **dat we deel uitmaken** d'une expérience humaine partagée. Et ils sont aussi profondément personnels. Ce sont des repères uniques qui t'aident à renouer **met ton eigen** rythme **en** à retrouver une terre ferme à l'intérieur de toi." (⚠ Dutch fragments).
   5. **Paragraph** "Je tisse ces pratiques sacrées dans chaque dimension de mon travail, que ce soit dans l'intimité d'une séance individuelle, lors de mes programmes en ligne **of wanneer we samenkomen voor mijn retraites**." (⚠ Dutch tail = "ou lorsque nous nous réunissons pour mes retraites").
   6. **Image** `size-large` `…/2026/02/5eaaabe9572dec3fc263928e634ab651-1024x968.jpg` (1024×968 JPEG, 147 KB; B&W overhead of hands arranging a spiral of flowers/stones; variants `-300x284`, `-768x726`, full 1199×1134) — displayed at content width.
   7. **Separator**.
   8. **h2** centred "Retraites".
   9. **Paragraph** "Mes retraites **zijn** bien plus qu'une simple évasion ; ce sont des initiations sacrées. Que nous soyons dans le silence mystique de la Provence ou dans des sanctuaires cachés à travers le monde, ces immersions **zijn** conçues pour sortir ta guérison du mental **en** l'ancrer profondément dans ton corps." (⚠ Dutch "zijn", "en").
   10. **Image** `alignfull size-full` `…/2026/02/7d90fcb7bef2e3cc0b08a81a8c2a8586.jpg` (1199×902 JPEG, 169 KB; B&W of four women dancing on a pebble beach; variants `-300x226`, `-768x578`, `-1024x770`). `alignfull` inside a constrained group → bleeds to the group's padding edge (renders ~ wide width in the screenshot).
   Then, still inside the outer group but after the inner group: **Separator**.
3. **Group** `alignfull` (same padding as 2) → inner group:
   1. **h2** centred "Le Chemin de Marie-Madeleine".
   2. **Paragraph** "Au cœur du Sud de la France, je t'accompagne sur les sentiers sinueux et millénaires de la Sainte-Baume. Ici, à l'ombre de la grotte sacrée de Marie-Madeleine, nous pratiquons des rituels qui font le pont entre la sagesse ancienne de la terre et la sagesse féminine universelle que nous portons toutes en nous. À travers la cérémonie et l'alchimie somatique, nous tressons le « féminin divin » **met** la puissance brute de ton propre corps. Il est temps d'écouter tes reins et ta chair. Reviens chez toi, au pied de la montagne, honore ton feu sacré et incarne la Prêtresse en toi." (⚠ Dutch "met").
   3. **Separator**.
   4. **h2** centred "Enracinée dans le désir. Insoumise d'esprit. Tu es la Femme Sauvage !"
   5. **Separator**.
   6. **Buttons** centred: "Oui ! Je veux marcher dans les pas de Marie-Madeleine !" → `https://swaanelauwaert.myflodesk.com/zny46m6oyn` (new tab). (EN → `…/mariamagdalena2027`; NL → `/nl/maria-magdalena-retreat-zuid-frankrijk-2026/`.)
4. **Group** `alignfull is-style-section-1` (accent-5 band; `margin:0; padding-top/bottom: sp80`) → **Columns** `alignwide`:
   - Column 50 %: **Image** `alignleft size-full` `style="margin-right:sp80"` `…/2026/01/unnamed.jpg` (1200×891 JPEG, 86 KB; Artemisia Gentileschi, *Mary Magdalene in Ecstasy*; variants `-300x223`, `-768x570`, `-1024x760`) floated left; **Image** `alignright size-full is-resized` `style="margin-top:-50%"` `<img style="width:202px" width="736" height="1308" loading="lazy">` `…/2026/01/bd7ca64901bddc5947b049725270689a-2.jpg` (736×1308, 105 KB; variants `-2-169x300`, `-2-576x1024`) — a 202 px-wide tall image pulled up by -50 % to overlap the painting (collage). Both are not painted in the desktop render (blank grey area); the painting is visible in the mobile render.
   - Column 50 % (vertically centred, `padding-left/right:0`): **Paragraph** `is-style-text-subtitle` (font-size clamp(1.5rem…1.75rem), line-height 1.2) "<strong>Mary Magdalene in Ecstasy</strong> is a painting by the female Italian baroque artist <a href="https://en.wikipedia.org/wiki/Artemisia_Gentileschi">Artemisia Gentileschi</a> (1620)." — ⚠ English (identical in EN and NL); **Paragraph** `is-style-text-subtitle` "Artemisia's Magdalene reminds us that holiness lies not in chastity, but in the raw, fleshly surrender to your own divine nature." — ⚠ English.
5. **Group** `alignfull` (`margin:0; padding-top/bottom: sp50`):
   1. **h2** `alignwide` "Mes Services:".
   2. **Columns** `alignwide`, three equal columns, each: **Image** `size-full` `style="margin-bottom:24px"` `<img style="aspect-ratio:4/3;object-fit:cover" loading="lazy">` + **h3** + **paragraph** `has-medium-font-size` in `<em>`:
      - `…/2026/02/b264d97a335da7040c2173b983aa28bf.jpg` (683×1024, 96 KB; variant `-200x300`) — h3 "<strong>Rituels</strong>" — "Dans les rituels, nous nous déposons."
      - `…/2026/02/f2bf95b8eddfc091bb56604ab4d4d48d.jpg` (1200×1194, 160 KB; variants `-150x150`, `-300x300`, `-768x764`, `-1024x1019`) — h3 "<strong>Cérémonies</strong>" — "Dans les cérémonies, nous nous transformons."
      - `…/2026/02/b40ec7271d9a610c1298162dd93302b2.jpg` (801×1200, 81 KB; variants `-200x300`, `-684x1024`, `-768x1151`) — h3 "<strong>Retraites</strong>" — "Pendant les retraites, nous nous raccompagnons à la maison."
      All three displayed as 4:3 crops (lazy; blank in the desktop render, headings/captions visible).

vs EN `/en/rooted-rituals/`: identical structure and images; EN has a trailing empty paragraph; headings "The Power of Rituals & Ceremonies", "Retreats", "The Magdalene Path", "Rooted in desire. Wild in spirit. You are the Untamed Woman.", "My Services:" / "Rituals", "Ceremonies", "Retreats" with captions "In rituals we anchor." etc. vs NL `/nl/levende-rituelen/`: same structure, NL adds an empty h2 after the button and links the CTA to the NL retreat page. Note the FR page title/nav label "Retraites | Cérémonies & Retraites" repeats "Retraites" where EN/NL say "Rooted Rituals | …" / "Levende Rituelen | …" — the slug `rituels-dancrage` ("rituels d'ancrage") suggests the intended title was "Rituels d'ancrage | Cérémonies & Retraites".

---

## 4. Content mapping FR ↔ EN ↔ NL (by content, not only by hreflang)

| Content | FR | EN | NL | Structural parity |
|---|---|---|---|---|
| Home / landing | `/fr/` (76) | `/en/` (44) | `/nl/` (74) | Same skeleton (hero cover, numbered offer list, portrait, grey pullquote band + gallery, contact form, liability). FR: duplicated hero; keeps the English pullquote **and** adds a French one; 3 offers (EN 3, NL 4 — NL adds the PLAY weekend). FR offer 1 links to Calendly (EN/NL link to the NL `samenwerken` page). NL uses `aligncenter` for the portrait. |
| About | `/fr/a-propos/` (4100) | `/en/about/` (4170) | `/nl/over-mij/` (4093) | Same. EN has an extra one-liner and a real list. |
| 1:1 coaching | `/fr/accompagnement/` (4502) | `/en/work-with-me/` (4242) | `/nl/samenwerken/` (4505) | Same hero + red card; NL adds a "Got questions?" + socials section. |
| Flavours of Desire | `/fr/flavours-of-desire-2/` (4537) | `/en/flavours-of-desire/` (68) | `/nl/flavours-of-desire-3/` (4533) | Same; FR/EN say "coming soon" (FR) vs "is OUT" (EN/NL); NL has a Vimeo intro video. |
| Flavours modules (protected) | `/fr/flavours-of-desire-2/modules/` (5101) | `/en/flavours-of-desire-modules-english/` (5113) | `/nl/flavours-of-desire-3/modules/` (4990) | All password-protected, none mirrored. |
| The Eros Sanctuary | `/fr/le-corps-libre/` (4531) | `/en/the-eros-sanctuary-2/` (66) (alias `/en/body-untamed/`) | `/nl/the-eros-sanctuary/` (4525) | **FR is a short, earlier version** (3 paragraphs + quote + teaser). EN/NL are ~3× longer with galleries, list, testimonial. Eros modules pages (EN 5247 `/en/module-1/`, NL 5236) have no FR counterpart. |
| Journal | `/fr/le-journal/` (80) | `/en/the-journal/` (48) | `/nl/journal/` (78) | Blog template; FR lacks the h1 "The Journal"; only NL lists posts. |
| Cookbook | `/fr/livre-de-cuisine/` (4918) | `/en/cookbook/` (4892) | `/nl/kookboek/` (4914) | FR = EN; NL differs (slideshow, extra "Aan Tafel" section). |
| Rituals / retreats | `/fr/rituels-dancrage/` (4550) | `/en/rooted-rituals/` (70) | `/nl/levende-rituelen/` (4541) | Same. |
| Sainte-Baume guide | — (FR menu links to `/en/guide-sainte-baume/`) | `/en/guide-sainte-baume/` (5633), `/en/sainte-baume-guide/` (5629) | `/nl/sainte-baume-gids/` (5541) | **No FR page.** |
| Retreat landing pages | — | — | `/nl/maria-magdalena-retreat-zuid-frankrijk-2027/` (4728, also served at `…-2026/`), `/nl/weekendretreat-27-28-29-november-2026-play/` (5441) | NL only. |
| Stray EN page | — | `/en/werk-met-mij/` (5530, Dutch title under /en/) | — | not relevant to FR. |

---

## 5. Untranslated / mixed-language text left in the French pages (verbatim)

English left in FR:
- Home: pullquote "Are you ready to trade the numbness for the nectar?" and button "Yes! Keep me posted please!" (a French pullquote + button follow, so this section is a leftover duplicate).
- Home contact-form success heading "Uw bericht is verzonden" (Dutch).
- Accompagnement: hero heading "We don't heal alone, we heal together." and button "Join us!".
- Flavours of Desire: "The sensual kitchen date night (coming soon)", button "Keep me updated on Flavours of Desire", "Programme: FLAVOURS OF DESIRE".
- Le corps libre: page title "The Eros Sanctuary", "Programme: The Eros Sanctuary (coming soon)", button "Joignez The Eros Sanctuary" (half French), link text "Instagram".
- Livre de cuisine: title suffix "The Taste of Her Journey" (book title — intentional).
- Rituels: both Artemisia paragraphs ("Mary Magdalene in Ecstasy is a painting by … (1620)." / "Artemisia's Magdalene reminds us that holiness lies not in chastity, but in the raw, fleshly surrender to your own divine nature.").
- À propos: "SWAANE LAUWAERT (°1977 Belgium)" and the whole training list (English in all languages).
- Le Journal: button "SUBSTACK" (brand, fine).

Dutch words left in FR sentences (machine-translation leftovers):
- À propos: "l'harmonie profonde **tussen** l'âme et le corps".
- Flavours: "nous utilisons la nourriture **voor** apaiser la douleur".
- Le corps libre: "La guérison n'a **niet** pas toujours besoin…", "de la performance **of** de l'objectification".
- Rituels: "**een ritueel of een ceremonie**", "mais **dat we deel uitmaken** d'une expérience", "renouer **met ton eigen** rythme **en** à retrouver", "en ligne **of wanneer we samenkomen voor mijn retraites**", "Mes retraites **zijn** bien plus", "ces immersions **zijn** conçues … du mental **en** l'ancrer".
- Journal: "Désolé, rien n'a été trouve." (accent typo, French).

These fragments are also baked into the auto-generated `meta description` / `og:description` of each page.

---

## 6. Defects and decisions for the rebuild

1. **Duplicate hero cover** on `/fr/` (block 3) — drop.
2. **Nested `<a>`** in the nav label "The Eros Sanctuary" (links to `/en/body-untamed/`) — make it a single link to `/fr/le-corps-libre/`.
3. **"Guide Sainte-Baume" menu item points to an English page**; no FR page exists — either keep the cross-language link, create a FR page, or hide the item.
4. **Journal "SUBSTACK" button has no href**; FR journal has no h1; query loop is empty for FR — decide the FR journal's purpose (link-out page vs. Dutch post list).
5. **Empty Otter button** (black pill) on Livre de Cuisine — drop. **Low-res hero** (342×507) on the same page.
6. Empty leftover blocks to drop: home (empty h2 after block 8, empty h4, two empty paragraphs), accompagnement (two empty groups), flavours (empty paragraphs), livre-de-cuisine (empty paragraphs), le-corps-libre (empty paragraph, empty column).
7. Outdated copy: Flavours "(coming soon)" (EN/NL say the programme is out), "Mon tout premier livre de cuisine arrive bientôt" (book is out per the cookbook page), Eros "(coming soon)" (EN/NL take registrations for 2027).
8. Mixed-language sentences (§5) — fix in the FR copy.
9. Contact form (Jetpack/Akismet) needs a static-site replacement; preserve anchor `#contact` and `#liability`.
10. Flodesk ids differ per language for the same CTA (e.g. "Join us!" FR → `g8dtc4po0h` = NL id; EN → `v3jg55lt2s`); keep as served unless the owner consolidates them.
11. All content images have empty `alt` — the rebuild should add alt text (the mirror gives none to copy).
12. Password-protected `modules` child page cannot be rebuilt from the mirror (see §7).

---

## 7. Gaps — things not determinable from the mirror

- Content, layout and password of `/fr/flavours-of-desire-2/modules/` (id 5101) — REST returns `content.rendered: ""`, `protected: true`; no HTML was fetched. Same for its EN/NL siblings and the Eros Sanctuary modules pages.
- Whether the duplicated hero on `/fr/` is intentional (it is not present in EN/NL).
- The 512×512 site icon `cropped-red-pomegranate-icon-on-a-white-background-illustration-vector.jpg` referenced by `/fr/le-journal/` og:image — only the 32/180/192 px crops are in the mirror.
- Alt texts for images (all empty on the live site) and any image captions (none set).
- How the live site renders the three `has-parallax` covers (fixed backgrounds) on iOS, and the lazy-loaded images that the local desktop screenshots did not paint (home portrait and gallery, Flavours "prière charnelle" covers, Rituels collage and service images, cookbook slider) — files exist, only the renders are incomplete.
- Hover/focus styles of the Otter slider dots/arrows beyond the inlined CSS, and the exact Jetpack form success flow (AJAX) on the live site.
- Whether the Dutch/English fragments are to be preserved verbatim (fidelity) or corrected — flagged, not decided here.

---

## 8. Asset checklist for the French pages (all under `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/`)

| File (as referenced) | Pixel size | Used on | Notes |
|---|---|---|---|
| `2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | 1280×577 | Home hero (×2), og:image | only size available |
| `2026/08/MVIMG_20260817_163022_1-768x1024.jpg` | 768×1024 | Home portrait | also `-225x300`, `-1152x1536`, `-1536x2048`, `-scaled` (1920×2560) |
| `2026/08/IMG-20260404-WA0004.jpg` | 539×719 | Home gallery 1 | `-225x300` |
| `2026/08/IMG_5348-768x1024.jpeg` | 768×1024 | Home gallery 2 | `IMG_5348.jpeg` 1536w, `-225x300`, `-1152x1536` (+ `IMG_5348-1*.jpg` duplicates) |
| `2026/08/MVIMG_20260817_163746-EDIT-893x1024.jpg` | 893×1024 | Home gallery 3 | `-262x300`, `-768x880`, `-1340x1536`, `-1787x2048` |
| `2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` | 957×960 | À propos featured image, og:image | `-150x150`, `-300x300`, `-768x770` + `.webp` versions |
| `2026/08/DSC03534-1024x683.jpg` | 1024×683 | Accompagnement hero | `-300x200`, `-768x512`, `-1536x1024`, `-2048x1365` |
| `2026/10/Screenshot-2026-10-10-105756.png` | 515×659 | Accompagnement card (square crop), og:image | `-234x300` |
| `2026/02/a4a043d325ecfae0844bcce21546e339.jpg` | 736×736 | Flavours media-text 1, og:image | `-150x150`, `-300x300` |
| `2026/01/7e913d8245b765d0f1ef82803d7c2f7e.jpg` | 577×866 | Flavours column image (square crop) | `-200x300` |
| `2026/02/b69a7dfbf5eaad18b7b69648d56c9c49.jpg` | 800×800 | Flavours media-text 2 | `-150x150`, `-300x300`, `-768x768` |
| `2026/01/7c754abd9bc7f6a913a765577b33dea2.jpg` | 736×863 | Flavours "Embraser." | `-256x300` |
| `2026/01/2211d321fe9f6f2c415cafa5ab80fcc2.jpg` | 736×975 | Flavours "Dévorer." | `-226x300` |
| `2026/01/bb3e19bbdc0e7db827b33c44fc650fdb-1.jpg` | 700×875 | Flavours "Lâcher-prise." | `-1-240x300` |
| `2026/01/9d110192f5f3236a1cb2cf7d956f15b0.jpg` | 736×1104 | Eros side image (3:4), og:image | `-200x300`, `-683x1024` |
| `2026/02/59653540d6bf783e7fb741cc68cf58bb-819x1024.jpg` | 819×1024 | Eros media-text | full `59653540….jpg`, `-240x300`, `-768x960` |
| `2026/08/Screenshot-2026-08-23-201541.jpg` | 342×507 | Cookbook hero background + slide 3 | `-202x300` |
| `2026/08/MVIMG_20260817_163817_1-768x1024.jpg` | 768×1024 | Cookbook slide 1; og:image uses `-scaled.jpg` 1920×2560 | `-225x300`, `-1152x1536`, `-1536x2048`, `-scaled` |
| `2026/08/Photo-43-EDIT-768x1024.jpg` | 768×1024 | Cookbook slide 2 | `-225x300`, `-1152x1536`, `-1536x2048`, `-scaled` |
| `2026/02/5eaaabe9572dec3fc263928e634ab651-1024x968.jpg` | 1024×968 | Rituels image 1; og:image uses full 1199×1134 | `-300x284`, `-768x726`, full |
| `2026/02/7d90fcb7bef2e3cc0b08a81a8c2a8586.jpg` | 1199×902 | Rituels full-width image | `-300x226`, `-768x578`, `-1024x770` |
| `2026/01/unnamed.jpg` | 1200×891 | Rituels Artemisia painting | `-300x223`, `-768x570`, `-1024x760` |
| `2026/01/bd7ca64901bddc5947b049725270689a-2.jpg` | 736×1308 | Rituels overlapping tall image (202 px wide) | `-2-169x300`, `-2-576x1024` |
| `2026/02/b264d97a335da7040c2173b983aa28bf.jpg` | 683×1024 | Rituels service "Rituels" | `-200x300` |
| `2026/02/f2bf95b8eddfc091bb56604ab4d4d48d.jpg` | 1200×1194 | Rituels service "Cérémonies" | `-150x150`, `-300x300`, `-768x764`, `-1024x1019` |
| `2026/02/b40ec7271d9a610c1298162dd93302b2.jpg` | 801×1200 | Rituels service "Retraites" | `-200x300`, `-684x1024`, `-768x1151` |
| flags (nl/en/fr) | inline SVG data URIs, 18×12 | language switcher | no files |
| Instagram / Facebook icons | inline SVG 24×24 | footer | no files |
