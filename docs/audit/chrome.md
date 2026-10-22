# Site chrome audit — swaanelauwaert.com

Scope: everything that is **shared across pages** (header, navigation, language switcher, footer, "Site by" bar) plus the bands that recur on the three language home pages (newsletter pullquote + button + photo gallery, `#contact` Jetpack form, liability block) and the `<head>` conventions.

Sources used (all local, the live site is unreachable from this machine):

| What | Path (repo-relative) |
|---|---|
| EN home (rendered, links rewritten by wget) | `mirror/raw/swaanelauwaert.com/en.html` (byte-identical to `index.html`) |
| EN home, original un-rewritten HTML | `mirror/raw/swaanelauwaert.com/en.orig` |
| NL / FR home | `mirror/raw/swaanelauwaert.com/nl.html`, `nl.orig`, `fr.html`, `fr.orig` |
| Inner pages checked | `en/about/index.html(.orig)`, `nl/over-mij/index.html(.orig)`, `fr/a-propos/index.html(.orig)`, `en/the-journal/index.html`, `nl/2018/08/10/cent-cinq/index.html(.orig)` (post), `nl/tag/groen-leven/index.html` (tag archive) |
| Navigation block CSS | `mirror/raw/swaanelauwaert.com/wp-includes/blocks/navigation/style.min.css?ver=7.1.3.css` |
| REST | `mirror/api/root.json` (site name/icon), `mirror/api/pages-p1.json` |
| HTTP headers | `mirror/meta/headers.txt` |
| Local full-page renders (1440 px / 390 px) | `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/local-shots/*.png`; header/footer crops made for this audit are in `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/crops/` |

Every URL quoted below is the **original absolute URL from the `.orig` files** (the `.html` copies were rewritten by `wget -k` to relative `…/index.html` paths). Labels, aria-labels and texts are verbatim.

---

## 0. Global page frame (identical on every page)

```html
<html lang="en-GB">            <!-- nl.html: lang="nl-BE"   fr.html: lang="fr-FR" -->
<body class="home wp-singular page-template page-template-page-no-title page page-id-44 wp-embed-responsive wp-theme-twentytwentyfive">
<a class="skip-link screen-reader-text" id="wp-skip-link" href="#wp--skip-link--target">Skip to content</a>
<div class="wp-site-blocks">
  <div class="wp-block-group … wp-container-4 is-position-sticky" style="box-shadow:var(--wp--preset--shadow--natural)"><header class="wp-block-template-part">…</header></div>
  <main id="wp--skip-link--target" …>…</main>
  <footer class="wp-block-template-part">…</footer>
</div>
<!-- scripts -->
<div id="network-info" …>Site by …</div>   <!-- outside .wp-site-blocks, see §2.6 -->
</body>
```

* Body classes: home pages `home wp-singular page-template page-template-page-no-title page page-id-44|74|76 wp-embed-responsive wp-theme-twentytwentyfive` (EN page id 44, NL 74, FR 76). Static pages: `wp-singular page-template-default page page-id-NNNN …`. Posts: `wp-singular post-template-default single single-post postid-NNNN single-format-standard …`.
* Skip link text: EN `Skip to content`, NL `Spring naar de inhoud`, FR `Aller au contenu`. Target is `<main id="wp--skip-link--target">`.
* On home pages `<main>` has `class="wp-block-group is-layout-flow" style="margin-top:0"` and wraps `<div class="entry-content wp-block-post-content has-global-padding is-layout-constrained">`; on inner pages `<main class="wp-block-group has-global-padding is-layout-constrained" style="margin-top:var(--wp--preset--spacing--60)">`.
* `:where(.wp-site-blocks) > * { margin-block-start: 1.2rem; margin-block-end: 0; }` and `--wp--style--block-gap: 1.2rem` (theme block gap).
* Root `https://swaanelauwaert.com/` answers **HTTP 302 → `/en/`** (`x-redirect-by: Polylang`, see `mirror/meta/headers.txt`). English is the default language.
* Every page sets the Polylang cookie (inline script `pll_cookie_script-js-after`): `document.cookie = "pll_language=en; expires=<+1 year>; path=/; domain=swaanelauwaert.com; secure; SameSite=Lax"` (value `nl` / `fr` on the other languages).
* No cookie-consent banner is rendered in the body (only a one-line script that would hide `div.wp-block-jetpack-cookie-consent` if the `eucookielaw` cookie existed).

---

## 1. Header

### 1.1 Structure, stickiness, background, spacing

```
div.wp-block-group.wp-container-4.is-position-sticky  [style="box-shadow:var(--wp--preset--shadow--natural)"]
└─ header.wp-block-template-part
   └─ div.wp-block-group.alignfull.is-style-default.has-base-background-color.has-background.has-global-padding.is-layout-constrained
      └─ div.wp-block-group.alignwide.is-content-justification-space-between.is-nowrap.is-layout-flex  [style="padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"]
         ├─ div.wp-block-group.is-layout-flex (gap:5px)   → p.wp-block-site-title.has-x-large-font-size > a
         └─ div.wp-block-group.is-content-justification-right.is-nowrap.is-layout-flex → nav.wp-block-navigation
```

| Property | Value (from inlined CSS) |
|---|---|
| Sticky | **Yes.** `.wp-container-4{top:calc(0px + var(--wp-admin--admin-bar--position-offset, 0px));position:sticky;z-index:10;}` — the whole header sticks to the top on every page. |
| Shadow | `box-shadow: var(--wp--preset--shadow--natural)` = `0px 3px 6px 0 rgba(0, 0, 0, 0.2)` (visible as a soft drop shadow under the bar in the renders). |
| Background | `has-base-background-color` → `--wp--preset--color--base: #fff7e6` (cream). |
| Horizontal padding | `has-global-padding` → `--wp--style--root--padding-left/right: var(--wp--preset--spacing--50)` = `clamp(30px, 5vw, 50px)`. |
| Vertical padding | `padding-top/bottom: var(--wp--preset--spacing--30)` = `20px`. |
| Inner width | `.alignwide` → `max-width: var(--wp--style--global--wide-size)` = `1340px`, centred. |
| Row layout | `.wp-container-core-group-is-layout-ec1e7a1e{flex-wrap:nowrap;justify-content:space-between;}` — title left, nav right. |
| Right group | `.wp-container-core-group-is-layout-061990c5{flex-wrap:nowrap;justify-content:flex-end;align-items:center;}` |
| Nav alignment | `.wp-container-core-navigation-is-layout-6e943505{justify-content:flex-end;}` + classes `items-justified-right is-content-justification-right`. |
| Rendered height | ≈ 80 px at 1440 px (title ≈ 35 px cap height), ≈ 75 px at 390 px (see crops `en--desktop--header.png`, `en--mobile--header.png`). |

### 1.2 Site title

```html
<p class="wp-block-site-title has-x-large-font-size"><a href="https://swaanelauwaert.com/en" target="_self" rel="home" aria-current="page">Swaane Lauwaert</a></p>
```

* Text `Swaane Lauwaert` (site name in `mirror/api/root.json` → `"name":"Swaane Lauwaert"`, `"description":""`, i.e. **no tagline**).
* Link target per language: `https://swaanelauwaert.com/en`, `https://swaanelauwaert.com/nl`, `https://swaanelauwaert.com/fr` (no trailing slash; the server redirects to the trailing-slash form). `aria-current="page"` is present **only on the home page**; on inner pages the attribute is absent.
* Style: `:root :where(.wp-block-site-title){font-family: var(--wp--preset--font-family--floreal);font-style: normal;font-weight: 400;letter-spacing: 0px;line-height: 1.1;text-transform: uppercase;}` → renders as **SWAANE LAUWAERT** in the "Floreal" display serif; `has-x-large-font-size` → `clamp(1.8em, 1.8rem + ((1vw - 0.2em) * 0.627), 2.2rem)`. Link colour `--wp--preset--color--contrast: #191919`, no underline, underline on hover.
* There is **no logo image** anywhere in the chrome (`site_logo: 0` in root.json).

### 1.3 Navigation tree (verbatim labels → original URLs)

The `<nav>` element (identical attributes in all languages except `aria-label`):

```html
<nav class="is-responsive items-justified-right wp-block-navigation is-content-justification-right is-layout-flex wp-container-core-navigation-is-layout-6e943505 wp-block-navigation-is-layout-flex" aria-label="Menu EN"
     data-wp-interactive="core/navigation"
     data-wp-context='{"overlayOpenedBy":{"click":false,"hover":false,"focus":false},"type":"overlay","roleAttribute":"","ariaLabel":"Menu"}'>
```

`aria-label`: EN `Menu EN`, NL `Menu NL`, FR `Menu FR`.

Nav typography: `:root :where(.wp-block-navigation){font-size: var(--wp--preset--font-size--medium);}` (= `clamp(1rem, 1rem + ((1vw - 0.2rem) * 0.314), 1.2rem)`), body font Literata 300, link colour `#191919`, `text-decoration:none`, underline on hover. Submenu items get `margin-bottom:3px` (theme CSS).

#### EN (`en.orig`, nav items in order)

| # | Label | Target | Notes |
|---|---|---|---|
| 1 | `Work with me` | `https://swaanelauwaert.com/en/work-with-me/` | has submenu, `open-on-hover-click`, toggle `aria-label="Work with me submenu"` |
| 1.1 | `Retreats` | `https://swaanelauwaert.com/en/rooted-rituals/` | |
| 1.2 | `The Eros Sanctuary` | `https://swaanelauwaert.com/en/the-eros-sanctuary-2/` | wget saved this as `en/body-untamed/` — both URLs serve the identical page (canonical `…/en/the-eros-sanctuary-2/`, page id 66) |
| 1.3 | `Flavours of Desire` | `https://swaanelauwaert.com/en/flavours-of-desire/` | |
| 1.4 | `Sainte-Baume Guide` | `https://swaanelauwaert.com/en/sainte-baume-guide/` | page id 5629 (distinct from `guide-sainte-baume`, id 5633, used in FR nav) |
| 2 | `Cookbook` | `https://swaanelauwaert.com/en/cookbook/` | |
| 3 | `About me` | `https://swaanelauwaert.com/en/about/` | |
| 4 | `The Journal` | `https://swaanelauwaert.com/en/the-journal/` | |
| 5 | `Contact` | `/en/#contact` (relative, as authored) | anchor on the home page |
| 6 | 🇬🇧 `English` | `https://swaanelauwaert.com/en/` | Polylang language switcher (see §1.5) |

#### NL (`nl.orig`)

| # | Label | Target | Notes |
|---|---|---|---|
| 1 | `Werk met mij` | `#` | **non-navigating parent** (`href="#"`); has submenu, toggle `aria-label="Werk met mij submenu"` |
| 1.1 | `Samenwerken` | `https://swaanelauwaert.com/nl/samenwerken/` | |
| 1.2 | `Weekendretreat 27-28-29 november 2026: PLAY` | `https://swaanelauwaert.com/nl/weekendretreat-27-28-29-november-2026-play/` | |
| 1.3 | `Maria Magdalena Retreat Zuid Frankrijk 2027` | `https://swaanelauwaert.com/nl/maria-magdalena-retreat-zuid-frankrijk-2027/` | wget stored the page under both `…-2026/` and `…-2027/` (identical HTML, canonical `…-2027/`, page id 4728); the `-2026` URL is an alias/redirect of unknown type |
| 1.4 | `Flavours of Desire \| Voeding, Verlangen &amp; Zelfliefde` | `https://swaanelauwaert.com/nl/flavours-of-desire-3/` | label contains a literal `\|` |
| 1.5 | `The Eros Sanctuary \| Somatic Coaching &amp; Sacred Sexuality` | `https://swaanelauwaert.com/nl/the-eros-sanctuary/` | |
| 1.6 | `Sainte-Baume Gids` | `https://swaanelauwaert.com/nl/sainte-baume-gids/` | |
| 2 | `Kookboek` | `https://swaanelauwaert.com/nl/kookboek/` | |
| 3 | `Over mij` | `https://swaanelauwaert.com/nl/over-mij/` | |
| 4 | `The Journal` | `https://swaanelauwaert.com/nl/journal/` | label left in English |
| 5 | `Contact` | `/nl/#contact` | |
| 6 | 🇧🇪 `Nederlands` | `https://swaanelauwaert.com/nl/` | language switcher |

#### FR (`fr.orig`)

| # | Label | Target | Notes |
|---|---|---|---|
| 1 | `Accompagnement` | `https://swaanelauwaert.com/fr/accompagnement/` | has submenu, toggle `aria-label="Sous-menu Accompagnement"` |
| 1.1 | `Retraites` | `https://swaanelauwaert.com/fr/rituels-dancrage/` | |
| 1.2 | `The Eros Sanctuary` | `https://swaanelauwaert.com/fr/le-corps-libre/` | **authoring bug**: the label span itself contains a nested link `<a href="https://swaanelauwaert.com/en/body-untamed/">The Eros Sanctuary</a>`, i.e. `<a href="…/fr/le-corps-libre/"><span class="wp-block-navigation-item__label"><a href="…/en/body-untamed/">The Eros Sanctuary</a></span></a>`. Browsers close the outer anchor, so clicking the text goes to the **English** page. |
| 1.3 | `Guide Sainte-Baume` | `https://swaanelauwaert.com/en/guide-sainte-baume/` | points to an **EN-prefixed** page (id 5633, title "Guide Sainte-Baume"); there is no `/fr/` guide page |
| 2 | `Livre de Cuisine` | `https://swaanelauwaert.com/fr/livre-de-cuisine/` | |
| 3 | `À propos de moi` | `https://swaanelauwaert.com/fr/a-propos/` | (page `<title>` is "À propos") |
| 4 | `Le Journal` | `https://swaanelauwaert.com/fr/le-journal/` | |
| 5 | `Contact` | `/fr/#contact` | |
| 6 | 🇫🇷 `Français` | `https://swaanelauwaert.com/fr/` | language switcher |

### 1.4 Submenu markup (toggle, container, behaviour)

Parent item (EN example, attributes verbatim):

```html
<li data-wp-context="{ &quot;submenuOpenedBy&quot;: { &quot;click&quot;: false, &quot;hover&quot;: false, &quot;focus&quot;: false }, &quot;type&quot;: &quot;submenu&quot;, &quot;modal&quot;: null, &quot;previousFocus&quot;: null }"
    data-wp-interactive="core/navigation" data-wp-on--focusout="actions.handleMenuFocusout" data-wp-on--keydown="actions.handleMenuKeydown"
    data-wp-on--pointerenter="actions.openMenuOnHover" data-wp-on--pointerleave="actions.closeMenuOnHover" data-wp-watch="callbacks.initMenu" tabindex="-1"
    class="wp-block-navigation-item has-child open-on-hover-click wp-block-navigation-submenu">
  <a class="wp-block-navigation-item__content" href="https://swaanelauwaert.com/en/work-with-me/"><span class="wp-block-navigation-item__label">Work with me</span></a>
  <button data-wp-bind--aria-expanded="state.isSubmenuOpen" data-wp-on--click="actions.toggleMenuOnClick" aria-label="Work with me submenu"
          class="wp-block-navigation__submenu-icon wp-block-navigation-submenu__toggle">
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M1.50002 4L6.00002 8L10.5 4" stroke-width="1.5"></path></svg>
  </button>
  <ul data-wp-on--focus="actions.openMenuOnFocus" class="wp-block-navigation__submenu-container has-text-color has-contrast-color has-background has-base-background-color wp-block-navigation-submenu">
    <li class="wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content" href="…"><span class="wp-block-navigation-item__label">Retreats</span></a></li>
    …
  </ul>
</li>
```

* Chevron: 12 × 12 stroked `path d="M1.50002 4L6.00002 8L10.5 4"`, `.wp-block-navigation__submenu-icon{height:.6em;width:.6em;margin-left:.25em}`.
* Behaviour (`open-on-hover-click`): desktop submenu opens on pointer hover of the `<li>`, on click of the chevron button (`aria-expanded` toggles) and on focus; closes on pointer leave / focusout / Escape (`handleMenuKeydown`).
* Dropdown panel: `.wp-block-navigation .has-child .wp-block-navigation__submenu-container{position:absolute;left:-1px;top:100%;display:flex;flex-direction:column;opacity:0;visibility:hidden;height:0;width:0;z-index:2;transition:opacity .1s linear}` → shown when open; background `base` `#fff7e6`, text `contrast` `#191919` (explicit classes on the `<ul>`). Inside the mobile overlay the panel is static (`left:0`).

### 1.5 Polylang language switcher

Always the **last** nav item; a `has-child open-on-hover-click` submenu item whose parent link is the current language.

| Language | Flag | Label | Link | `hreflang`/`lang` | Polylang classes |
|---|---|---|---|---|---|
| Dutch | Belgium flag | `Nederlands` | `https://swaanelauwaert.com/nl/` | `nl-BE` | `lang-item lang-item-5 lang-item-nl lang-item-first` |
| English | United Kingdom flag | `English` | `https://swaanelauwaert.com/en/` | `en-GB` | `lang-item lang-item-8 lang-item-en` |
| French | France flag | `Français` | `https://swaanelauwaert.com/fr/` | `fr-FR` | `lang-item lang-item-12 lang-item-fr` |

* Submenu order is always **Nederlands, English, Français** (`lang-item-first` = nl); the current language is repeated inside the submenu with class `current-lang`. The parent shows flag + current label (`English`, `Nederlands`, `Français`).
* Toggle button `aria-label`: EN `Languages submenu`, NL `Talen submenu`, FR `Sous-menu Langues`.
* The links always point to the **language home**, never to the translated counterpart of the current page (the `wp-block-polylang-navigation-language-switcher` block is in "home" mode). Translations are only exposed via `<link rel="alternate" hreflang>` in the head (§4).
* **Two different flag markups were captured** (same Polylang block, probably different page-cache generations):
  * EN and NL pages: `<img decoding="async" src="data:image/png;base64,…" alt="" width="16" height="11" style="width: 16px; height: 11px;" /> English` — 16 × 11 PNG flag inlined as base64, followed by a space and the label as plain text; `<li>` classes `wp-block-navigation-item has-child open-on-hover-click lang-item lang-item-8 lang-item-en current-lang wp-block-polylang-navigation-language-switcher wp-block-navigation-submenu`.
  * FR page: newer Polylang markup with SVG flags: `<span class="pll-switcher-flag" style="display:inline-block;flex-shrink:0;width:var(--pll-flag-width,18px);overflow:hidden;border-radius:calc(var(--pll-flag-border-radius,0)*.5*1%);aspect-ratio:3/2;--pll-flag-border-radius:0;--pll-flag-width:18px"><img decoding="async" src="data:image/svg+xml,…" alt="" width="18" height="12" style="display:block;object-fit:cover;object-position:center;width:100%;height:100%" /></span><span class="pll-switcher-label" style="margin-inline-start:var(--pll-flag-label-spacing,0.3em);writing-mode:horizontal-tb;--pll-flag-label-spacing:0.3em">Français</span>`; extra classes `polylang-item … pll-aspect-ratio-32`. SVG flag colours: BE `#ef3340`/`#fdda25`/black, UK `#012169`/`#fff`/`#C8102E`, FR `#CE1126`/`#fff`/`#002654`.
  * For the rebuild either is fine; recommend the SVG variant (18 × 12, 3:2) — the base64 PNGs are only 16 × 11.

### 1.6 Mobile navigation (overlay) — markup and behaviour

Markup (EN; NL uses `id="modal-1"`, FR `id="modal-3"`):

```html
<button aria-haspopup="dialog" aria-label="Open menu" class="wp-block-navigation__responsive-container-open"
        data-wp-on--click="actions.openMenuOnClick" data-wp-on--keydown="actions.handleMenuKeydown">
  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 5v1.5h14V5H5z"></path><path d="M5 12.8h14v-1.5H5v1.5z"></path><path d="M5 19h14v-1.5H5V19z"></path></svg>
</button>
<div class="wp-block-navigation__responsive-container has-text-color has-contrast-color has-background has-base-background-color" id="modal-2"
     data-wp-class--has-modal-open="state.isMenuOpen" data-wp-class--is-menu-open="state.isMenuOpen"
     data-wp-watch="callbacks.initMenu" data-wp-on--keydown="actions.handleMenuKeydown" data-wp-on--focusout="actions.handleMenuFocusout" tabindex="-1">
  <div class="wp-block-navigation__responsive-close" tabindex="-1">
    <div class="wp-block-navigation__responsive-dialog" data-wp-bind--aria-modal="state.ariaModal" data-wp-bind--aria-label="state.ariaLabel" data-wp-bind--role="state.roleAttribute">
      <button aria-label="Close menu" class="wp-block-navigation__responsive-container-close" data-wp-on--click="actions.closeMenuOnClick">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="m13.06 12 6.47-6.47-1.06-1.06L12 10.94 5.53 4.47 4.47 5.53 10.94 12l-6.47 6.47 1.06 1.06L12 13.06l6.47 6.47 1.06-1.06L13.06 12Z"></path></svg>
      </button>
      <div class="wp-block-navigation__responsive-container-content" data-wp-watch="callbacks.focusFirstElement" id="modal-2-content">
        <ul class="wp-block-navigation__container is-responsive items-justified-right wp-block-navigation"> …menu items… </ul>
      </div>
    </div>
  </div>
</div>
```

aria-labels: open button EN `Open menu` / NL `Menu openen` / FR `Ouvrir le menu`; close button EN `Close menu` / NL `Menu sluiten` / FR `Fermer le menu`. The dialog's `aria-label` becomes `Menu` (from `data-wp-context.ariaLabel`) in all languages.

Behaviour (WordPress core navigation block, Interactivity API module `wp-includes/js/dist/script-modules/block-library/navigation/view.min.js`, loaded `type="module" fetchpriority="low"`):

* Breakpoint **600 px** (`@media (min-width:600px){.wp-block-navigation__responsive-container-open:not(.always-shown){display:none}}` and `.wp-block-navigation__responsive-container:not(.hidden-by-default):not(.is-menu-open){display:block;position:relative;width:100%}`) → at ≥ 600 px the menu is inline (horizontal, right-aligned); below 600 px only the hamburger (3 bars, 24 × 24, `currentColor`) is visible at the right of the title (see `en--mobile--header.png`).
* Closed state below 600 px: `.wp-block-navigation__responsive-container{bottom:0;display:none;left:0;position:fixed;right:0;top:0}`.
* Open state: `.is-menu-open{display:flex;flex-direction:column;overflow:auto;z-index:100000;background-color:inherit;animation:overlay-menu__fade-in-animation .1s ease-out}` → **full-screen fixed overlay** in the base colour `#fff7e6`, text `#191919`; items stack vertically (`.is-menu-open .wp-block-navigation__container{flex-direction:column}`, items left-aligned, padding from `--wp--style--root--padding-*`), the dialog content starts after `margin-top:46px` / `32px` (admin-bar aware); close button is absolutely positioned top-right (`right/top: clamp(1rem, var(--wp--style--root--padding-left), 20rem)`).
* JS: `openMenuOnClick` adds `has-modal-open` + `is-menu-open` to the container, sets `role="dialog"`, `aria-modal="true"`, `aria-label="Menu"`, locks body scroll and moves focus to the first element (`callbacks.focusFirstElement`); `closeMenuOnClick`, Escape (`handleMenuKeydown`) and focus leaving the overlay (`handleMenuFocusout`) close it and restore focus. Inside the overlay, submenus are collapsed and open via the chevron buttons (`toggleMenuOnClick`, `aria-expanded`); the submenu `<ul>` is rendered statically (`left:0`). The language switcher appears as the last item of the stacked list.
* The local renders only show the closed state; the open overlay was not captured (cannot be verified visually from the mirror).

### 1.7 Header buttons

None. The header contains only the site title, the navigation (with language switcher) and the hamburger/close buttons of the responsive navigation. No search, no CTA button, no social icons in the header.

### 1.8 Header on inner pages

Diff of the header block between home and inner pages (EN about, NL post) after normalising link rewriting: **only `aria-current="page"` moves** — it is on the site-title link on the home page, and on the matching nav item (e.g. `About me`) on static pages; posts/archives carry no `aria-current`. The NL post and tag pages use the same `Menu NL` navigation. Modal ids (`modal-1/2/3`) are per-language render artefacts and can be anything.

---

## 2. Footer

### 2.1 Structure and layout (identical in all three languages apart from the text lines)

```
footer.wp-block-template-part
└─ div.wp-block-group.has-global-padding.is-layout-constrained   [style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)"]   (= clamp(50px, 7vw, 90px))
   └─ div.wp-block-group.alignwide.is-layout-flow                   (max-width 1340px)
      ├─ hr.wp-block-separator.has-alpha-channel-opacity.is-style-wide.is-style-wide--8   [style="margin-bottom:36px"]   (FR: is-style-wide--9, same rule)
      ├─ div.wp-block-spacer [style="height:20px"]
      └─ div.wp-block-group.alignfull.is-content-justification-space-between.is-layout-flex   (.cf54d0a6: justify-content:space-between; align-items:flex-start)
         ├─ COLUMN 1  div.wp-block-group.is-vertical (.f0b6b26e: gap:0; column; align-items:flex-start)
         │     └─ h2.wp-block-site-title > a[href="https://swaanelauwaert.com/en" target="_self" rel="home"]  "Swaane Lauwaert"
         ├─ COLUMN 2  ul.wp-block-social-links.has-huge-icon-size.has-icon-color.is-style-logos-only.is-layout-flex
         │     ├─ li.wp-social-link.wp-social-link-instagram.has-accent-3-color [style="color:#2c261e"] > a[href="https://www.instagram.com/swaanelauwaert/" rel="noopener nofollow" target="_blank"] > svg + span.screen-reader-text "Instagram"
         │     └─ li.wp-social-link.wp-social-link-facebook.has-accent-3-color  [style="color:#2c261e"] > a[href="https://www.facebook.com/swaane.lauwaert" rel="noopener nofollow" target="_blank"] > svg + span.screen-reader-text "Facebook"
         └─ COLUMN 3  div.wp-block-group.has-small-font-size.is-vertical.is-content-justification-stretch [style="font-style:italic;font-weight:400"]   (.d8dce8eb: column; align-items:stretch)
               ├─ row div.wp-block-group.is-content-justification-space-between.is-nowrap (.788841da)
               │     ├─ div.is-vertical (.b61a1d7d) > p "All Rights Reserved"
               │     └─ p "© Swaane Lauwaert"
               └─ row div.wp-block-group.is-content-justification-space-between.is-nowrap (.788841da)
                     ├─ div.is-vertical (.831b2db5) > p "Photography"
                     └─ p "Pinterest, Unsplash"
```

Rendered (crops `en--desktop--footer.png`, `en--mobile--footer.png`): a thin full-width rule, then three columns on desktop — uppercase title left, two black social glyphs centred, the italic small-print block right-aligned as two rows (`All Rights Reserved … © Swaane Lauwaert` / `Photography … Pinterest, Unsplash`). On mobile the three columns stack (title, icons, text rows); each text row keeps its two-cell `space-between` layout.

### 2.2 Footer text lines per language (verbatim)

| Slot | EN | NL | FR |
|---|---|---|---|
| Footer site title | `Swaane Lauwaert` → `https://swaanelauwaert.com/en` | `Swaane Lauwaert` → `https://swaanelauwaert.com/nl` | `Swaane Lauwaert` → `https://swaanelauwaert.com/fr` |
| Row 1 left | `All Rights Reserved` | `Alle Rechten Voorbehouden` | `Tous Droits Réservés` |
| Row 1 right | `© Swaane Lauwaert` | `© Swaane Lauwaert` | `© Swaane Lauwaert` |
| Row 2 left | `Photography` | `Fotografie` | `Photographie` |
| Row 2 right | `Pinterest, Unsplash` | `Pinterest, Unsplash` | `Pinterest, Unsplash` |

There is **no year**, no address, no e-mail and no phone number in the footer template part itself. The liability statement with address/e-mail/phone is a block inside the home page content (§3.5) and the "Site by" line is a separate injected bar (§2.6).

### 2.3 Social links

| Platform | URL | Icon | Label (screen-reader only) |
|---|---|---|---|
| Instagram | `https://www.instagram.com/swaanelauwaert/` | core Instagram glyph (24 × 24 path) | `Instagram` |
| Facebook | `https://www.facebook.com/swaane.lauwaert` | core Facebook glyph | `Facebook` |

Attributes: `rel="noopener nofollow" target="_blank"`. Styling: `has-huge-icon-size` (`font-size:48px`), `is-style-logos-only` (no background, `svg{height:1.25em;width:1.25em}`), colour `has-accent-3-color` → `#000000 !important` (the inline `style="color:#2c261e"` is overridden); `.wp-block-social-link:hover{transform:scale(1.1)}`.

### 2.4 Separators and backgrounds

* Footer background: none of its own → the body background `--wp--preset--color--base: #fff7e6`.
* Footer text colour: body `--wp--preset--color--accent-4: #5F5F5F` (small print), headings/site title `#000` (Floreal, uppercase, `h2` size `x-large`).
* Separator: `:root :where(.wp-block-separator){border-color: currentColor;border-width: 0 0 1px 0;border-style: solid;color: var(--wp--preset--color--accent-6);}` with `--wp--preset--color--accent-6: #19191933` (20 % black) → a **1 px light line**; `is-style-wide--8` → `max-width: var(--wp--style--global--wide-size) !important` (1340 px); `style="margin-bottom:36px"` plus a 20 px spacer before the columns.
* Small print: `has-small-font-size` → `--wp--preset--font-size--small: 0.9rem`, `font-style:italic;font-weight:400`.

### 2.5 Footer on inner pages

Byte-identical to the home footer except `aria-current="page"` on the footer site-title link (home only). Confirmed on `en/about`, `nl/over-mij`, `fr/a-propos`, the NL post and the NL tag page.

### 2.6 "Site by …" bar (not part of the theme footer)

Injected at the very end of `<body>`, **after** all scripts and outside `.wp-site-blocks`, on every page in every language (English text, never translated):

```html
<div id="network-info" class="network-info" style="padding:10px;background:#171717;color:#939393;font-size:14px;text-align:center">
	Site by <a style="color:#ccc;font-size:14px" href="https://phareo.eu" target="_blank" rel="noopener">Pharéo</a> | Hosted on <a style="color:#ccc;font-size:14px" href="https://status301.net/" target="_blank" rel="noopener">The Permanently Moving Network</a>
</div><script>function inIframe(){try{return window.self!==window.top;}catch(Exception){return true}}if(inIframe()){document.getElementById("network-info").style.display="none"}</script>
```

Dark `#171717` strip, grey `#939393` 14 px text, links `#ccc` underlined; hidden when the page is embedded in an iframe. Its origin (a host/network mu-plugin, not the theme) cannot be determined from the mirror; whether it must be kept in the rebuild is a business decision.

---

## 3. Shared sections on the home pages

All of the following exist **only on the three home pages** (`/en/`, `/nl/`, `/fr/`): `id="contact"` is found in no other mirrored file. The `Contact` nav item therefore always jumps to the home page anchor. Inner pages end with their content and go straight to the footer.

Layout order at the bottom of each home `<main>`:

1. `<hr class="wp-block-separator has-alpha-channel-opacity" />` (end of the content sections)
2. **Band A** — grey section group with pullquote + button + gallery
3. (FR only) spacer, two empty paragraphs, `<hr>`, **Band B** — second pullquote (French) + empty button
4. **Contact section** `#contact` (grey)
5. spacer (30 px) — **Liability block** `#liability` (cream) — spacer (30 px)

Bands and the contact section all use `is-style-section-1` → `:root :where(.wp-block-group.is-style-section-1--N){background-color: var(--wp--preset--color--accent-5);color: var(--wp--preset--color--contrast);}` = **`#F1EEE9` background, `#191919` text**, `alignfull` (edge to edge) with `has-global-padding`; inside, content is constrained to 960 px. Visually one continuous grey band runs from the pullquote down to the form's submit button (crop `en--desktop--band.png`).

### 3.1 Band A — "keep me posted" pullquote + button

Wrapper (all languages): `<div class="wp-block-group alignfull is-style-section-1 has-global-padding is-layout-constrained wp-block-group-is-layout-constrained is-style-section-1--5" style="margin-top:0;margin-bottom:0;padding-top:0;padding-bottom:0">`, first child a spacer `style="height:var(--wp--preset--spacing--50)"` (= `clamp(30px, 5vw, 50px)`).

| | EN | NL | FR |
|---|---|---|---|
| Pullquote text | `Are you ready to trade the numbness for the nectar?` | `Are you ready to trade the numbness for the nectar?` (left in English) | `Are you ready to trade the numbness for the nectar?` (left in English; a French one follows in Band B) |
| Button label | `Yes! Keep me posted please!` | `Yes! I am ready to reclaim my most sacred desire!` | `Yes! Keep me posted please!` |
| Button href | `https://swaanelauwaert.myflodesk.com/v3jg55lt2s` | `https://swaanelauwaert.myflodesk.com/g8dtc4po0h` | `https://swaanelauwaert.myflodesk.com/v3jg55lt2s` |
| Spacer between button and gallery | spacing-50 | none | spacing-50 |
| After gallery | — | spacer `height:50px` | spacer spacing-40 + two empty `<p class="wp-block-paragraph"></p>` |

Markup (EN):

```html
<figure class="wp-block-pullquote"><blockquote><p>Are you ready to trade the numbness for the nectar?</p></blockquote></figure>
<div class="wp-block-buttons is-content-justification-center is-layout-flex wp-container-core-buttons-is-layout-3189c7ba wp-block-buttons-is-layout-flex">
<div class="wp-block-button"><a class="wp-block-button__link has-text-align-left wp-element-button" href="https://swaanelauwaert.myflodesk.com/v3jg55lt2s" target="_blank" rel="noreferrer noopener">Yes! Keep me posted please!</a></div>
</div>
```

* Pullquote style: `:root :where(.wp-block-pullquote){color: var(--wp--preset--color--accent-3);font-family: var(--wp--preset--font-family--beiruti);font-size: var(--wp--preset--font-size--xx-large);font-weight: 500;line-height: 1;padding-top: var(--wp--preset--spacing--30);padding-bottom: var(--wp--preset--spacing--30);}` + core `text-align:center` → black Beiruti sans, `clamp(2rem, 2rem + ((1vw - 0.2rem) * 1.255), 2.8rem)`, centred, no quotation marks or cite.
* Button style: `.wp-block-button__link` → background `contrast #191919`, text `accent-1 #FFFFFF`, Beiruti, `font-size medium`, padding `0.6rem 1.6rem`, `border-radius:9999px` (pill), `box-shadow: var(--wp--preset--shadow--natural)`; hover: `background-color: color-mix(in srgb, #191919 85%, transparent); color: #fff7e6`; focus outline `accent-4`. Buttons container `justify-content:center`.
* The buttons link to external **Flodesk** sign-up forms (newsletter); their content is not in the mirror.

### 3.2 Gallery under the band

`<figure class="wp-block-gallery has-nested-images columns-default is-cropped wp-block-gallery-6 is-layout-flex wp-block-gallery-is-layout-flex">` with **three** `figure.wp-block-image.size-large` children (gap `0.5em`, `is-cropped` → equal-height columns, default columns = 3). Images (all present in the mirror):

| # | EN & FR | NL |
|---|---|---|
| 1 | `wp-content/uploads/sites/50/2026/08/IMG-20260404-WA0004.jpg` 539 × 719 (id 5572; also `-225x300`) — woman arranging a bowl of food in a stone kitchen | same |
| 2 | `wp-content/uploads/sites/50/2026/08/IMG_5348-768x1024.jpeg` 768 × 1024 (id 5573; sizes `-225x300`, `-1152x1536`, full `IMG_5348.jpeg` 1536 w) — woman in red dress in a meadow | same |
| 3 | `wp-content/uploads/sites/50/2026/08/MVIMG_20260817_163746-EDIT-893x1024.jpg` 893 × 1024 (id 5574; sizes `-262x300`, `-768x880`, `-1340x1536`, `-1787x2048`) | `wp-content/uploads/sites/50/2026/08/MVIMG_20260817_163817_1-768x1024.jpg` 768 × 1024 (id 5506; sizes `-225x300`, `-1152x1536`, `-1536x2048`, `-scaled`) |

All files live under `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/2026/08/`; the two originals also under `mirror/media/wp-content/uploads/sites/50/2026/08/`. `alt=""` on all three. The third image is `loading="lazy"`; **the local renders show only two photos** (the lazy third image never loaded during the headless full-page capture — crop `en--desktop--band.png` shows two 307 px tiles and an empty third column). The HTML clearly intends three columns; what the live site shows could not be verified.

### 3.3 Band B (FR only)

After Band A, `fr.orig` has `<hr class="wp-block-separator has-alpha-channel-opacity" />` and a second group `is-style-section-1--7` (same grey) with spacer-50, pullquote `Es-tu prête à quitter la torpeur pour goûter au nectar de la vie ?`, a centred buttons block whose button is **empty**: `<a class="wp-block-button__link has-text-align-left wp-element-button" href="https://swaanelauwaert.myflodesk.com/zny46m6oyn" target="_blank" rel="noreferrer noopener"></a>` (renders as an empty dark pill), then spacer-50. The same Flodesk form is labelled `Oui ! Je veux marcher dans les pas de Marie-Madeleine !` elsewhere on the FR retreat page, which is presumably the intended label.

### 3.4 Contact section (`#contact`) — Jetpack form

Wrapper: `<div class="wp-block-group alignfull is-style-section-1 has-global-padding is-layout-constrained wp-block-group-is-layout-constrained is-style-section-1--7" id="contact" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)">` (NL `--7`, FR `--8`; grey `#F1EEE9`, padding `clamp(50px, 7vw, 90px)`).

Heading `<h2 class="wp-block-heading has-text-align-left is-style-default">`:

| EN | NL | FR |
|---|---|---|
| `Do you have a question?<br>Feel free to reach out.` | `Do you have a question?<br>Feel free to reach out.` (**not translated**) | `Une question&nbsp;?<br>N&rsquo;hésitez pas.` |

Heading style: Floreal 400, `h2` → `x-large`, colour `#000`, left aligned (crop `en--mobile--band.png`).

Form container (EN; NL formId 74 / FR 76, each with its own hash):

```html
<div data-test='contact-form' id='contact-form-44' class='jetpack-contact-form-container ' data-wp-interactive='jetpack/form'
     data-wp-context='{"formId":"44","formHash":"11ce59a1dcbd2f3644924ffa8239b06474a3ea1a","showErrors":false,"errors":[],"fields":[],"isMultiStep":false,"useAjax":true,"submissionData":null,"formattedSubmissionData":[],"submissionSuccess":false,"submissionError":null,"elementId":"jp-form-11ce59a1dcbd2f3644924ffa8239b06474a3ea1a","isSingleInputForm":false,"isForcedHorizontal":false,"conditionalLogic":[]}'
     data-wp-on--focusin="actions.trackFirstInteraction" data-wp-watch--scroll-to-wrapper="callbacks.scrollToWrapper">
  <!-- success panel (hidden until submitted) -->
  <div class="contact-form-submission contact-form-ajax-submission" data-wp-bind--aria-hidden="state.isSuccessMessageAriaHidden" data-wp-class--submission-success="context.submissionSuccess"
       id="contact-form-success-11ce59a1dcbd2f3644924ffa8239b06474a3ea1a" tabindex="-1" aria-labelledby="contact-form-success-header-11ce59a1dcbd2f3644924ffa8239b06474a3ea1a">
    <p class="go-back-message"><a class="link" role="button" tabindex="0" data-wp-on--click="actions.goBack" href="/en/">← Back</a></p>
    <h4 data-wp-bind--aria-hidden="state.isSuccessMessageAriaHidden" id="contact-form-success-header-…">Uw bericht is verzonden</h4>
    <template data-wp-each--submission="context.formattedSubmissionData"> …summary of submitted fields… </template>
  </div>
  <form action='https://swaanelauwaert.com/en/' id='jp-form-11ce59a1dcbd2f3644924ffa8239b06474a3ea1a' method='post'
        class='contact-form commentsblock jetpack-contact-form__form has-no-jetpack-form-layout' aria-label="Swaane Lauwaert"
        data-wp-on--submit="actions.onFormSubmit" data-wp-on--reset="actions.onFormReset" data-wp-class--submission-success="context.submissionSuccess"
        data-wp-class--is-first-step="state.isFirstStep" data-wp-class--is-last-step="state.isLastStep" data-wp-class--is-ajax-form="context.useAjax" novalidate>
    <input type='hidden' name='jetpack_contact_form_jwt' value='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.…' />   <!-- per-render JWT, server generated -->
    <input type='hidden' name='jetpack_form_fill_duration' value='' />
    <div class="wp-block-jetpack-contact-form is-style-outlined is-layout-flex wp-container-jetpack-contact-form-is-layout-18d78099 wp-block-jetpack-contact-form-is-layout-flex">
      …fields (below)…
      <div class="contact-form__error" data-wp-class--show-errors="state.showFormErrors">…<ul aria-label="Form errors">…</ul></div>
      <div class="contact-form__error" data-wp-class--show-errors="state.showSubmissionError" data-wp-text="context.submissionError" …></div>
      <div class="wp-block-jetpack-button is-style-outline wp-block-button" style="">
        <button data-wp-bind--disabled="state.isAriaDisabled" class="wp-block-button__link is-style-outline" style="" data-id-attr="placeholder" type="submit"
                data-wp-class--is-submitting="state.isSubmitting" data-wp-bind--aria-disabled="state.isAriaDisabled">Send<span class="spinner" aria-hidden="true"><svg …/></span></button>
      </div>
    </div>
    <input type='hidden' name='contact-form-id' value='44' />
    <input type='hidden' name='action' value='grunion-contact-form' />
    <input type='hidden' name='contact-form-hash' value='11ce59a1dcbd2f3644924ffa8239b06474a3ea1a' />
    <p style="display: none !important;" class="akismet-fields-container" data-prefix="ak_"><label>&#916;<textarea name="ak_hp_textarea" cols="45" rows="8" maxlength="100"></textarea></label><input type="hidden" id="ak_js_1" name="ak_js" value="107"/><script>document.getElementById( "ak_js_1" ).setAttribute( "value", ( new Date() ).getTime() );</script></p>
  </form>
</div>
```

**Form action / hidden fields per language**

| | EN | NL | FR |
|---|---|---|---|
| `form action` | `https://swaanelauwaert.com/en/` | `https://swaanelauwaert.com/nl/` | `https://swaanelauwaert.com/fr/` |
| `contact-form-id` | `44` | `74` | `76` |
| `contact-form-hash` / formHash | `11ce59a1dcbd2f3644924ffa8239b06474a3ea1a` | `b5cd5d664c98003415ad6439fb410e6b31f38570` | `017bf96efc52775e829737ebc68f849013d59184` |
| `action` | `grunion-contact-form` | same | same |
| AJAX endpoint (JS config) | `https://swaanelauwaert.com/wp-admin/admin-ajax.php` | same | same |
| Back link | `← Back` → `/en/` | `← Terug` → `/nl/` | `← Retour` → `/fr/` |
| Success heading `<h4>` | `Uw bericht is verzonden` (**Dutch on all three**) | `Uw bericht is verzonden` | `Uw bericht is verzonden` |

**Fields** (`is-style-outlined`: each field is a white box with a 1 px solid border and the label rendered *inside* the box via the "notched label" markup `div.notched-label > .notched-label__leading / .notched-label__notch > label / .notched-label__filler / .notched-label__trailing`; inputs have `class="… wp-block-jetpack-input has-small-font-size grunion-field" style="border-style:solid"`):

| Field id (EN / NL / FR) | Type | Label EN | Label NL | Label FR | Required | Required marker text |
|---|---|---|---|---|---|---|
| `g44-name` / `g74-naam` / `g76-nom` | `input type="text"` | `Name` | `Naam` | `Nom` | yes (`required='true' aria-required='true'`, context `"fieldIsRequired":"1"`) | EN `(required)` · NL `(verplicht)` · FR `(obligatoire)` — `<span class="grunion-label-required" aria-hidden="true">` |
| `g44-email` / `g74-email` / `g76-email` | `input type="email"` | `Email` | `E-mail` | `E-mail` | yes | same |
| `g44-message` / `g74-bericht` / `g76-message` (textarea id `contact-form-comment-g44-message`) | `textarea rows='20'` | `Message` | `Bericht` | `Message` | no | — |

Each field has an error container `<div id="g44-name-text-error" class="contact-form__input-error" …><span class="contact-form__warning-icon">…svg…</span><span data-wp-text="state.errorMessage" id="g44-name-text-error-message"></span></div>` (ids `g44-email-email-error`, `g44-message-textarea-error`). Placeholders are empty; the label doubles as placeholder until the field has a value (`data-wp-class--has-value`).

**Submit button**: EN `Send`, NL `Verzenden`, FR `Envoyer`; `is-style-outline` → transparent background, `border:2px solid` currentColor, pill radius, natural shadow, Beiruti, left-aligned (form container `justify-content:flex-start`). A spinner SVG is shown while `state.isSubmitting`.

**Validation / error strings** (from the inline JSON `wp-script-module-data-@wordpress/interactivity`, key `config["jetpack/form"].error_types`):

| key | EN | NL | FR |
|---|---|---|---|
| `invalid_email` | Please enter a valid email address | Voer een geldig e-mailadres in | Veuillez saisir une adresse e-mail valide |
| `is_required` | This field is required. | Dit veld is vereist. | Champ obligatoire. |
| `invalid_form_empty` | The form you are trying to submit is empty. | Het formulier dat je probeert in te dienen is leeg. | Le formulaire que vous tentez de valider est vide. |
| `invalid_form` | Please fill out the form correctly. | Vul het formulier correct in. | Veuillez remplir le formulaire correctement. |
| `network_error` | Connection issue while submitting the form. Check that you are connected to the Internet and try again. | Verbindingsprobleem bij het indienen van het formulier. Zorg ervoor dat je een internetverbinding hebt en probeer het opnieuw. | Problème de connexion lors de l’envoi du formulaire. Vérifiez que vous êtes connecté à Internet et réessayez. |
| `unchecked_label` | No | Nee | Non |

Form assets: `wp-content/plugins/jetpack/jetpack_vendor/automattic/jetpack-forms/dist/contact-form/css/grunion.css?ver=16.3.1.css`, `…/jetpack-forms-layout.css?ver=16.3.1.css`, script `…/jetpack-forms/dist/blocks/view.js?minify=false&ver=807945612566f31ac62b` (all present under `mirror/raw/swaanelauwaert.com/`). **The submission backend (admin-ajax + JWT, recipient e-mail address) cannot be reproduced statically** and the recipient is not visible in the markup.

### 3.5 Liability / address block (`#liability`)

Directly after the contact section, in the cream body colour, wrapped by two spacers `height:var(--wp--preset--spacing--40)` (30 px): `<div id="liability" class="wp-block-group is-style-default has-small-font-size has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">` (0.9 rem, colour `#5F5F5F`, 960 px wide).

EN:
```html
<p class="wp-block-paragraph"><strong><strong>Liability Statement:</strong></strong></p>
<p class="wp-block-paragraph">Swaane Lauwaert is not a professional mental health provider or medical professional. The services offered are not a substitute for professional mental health care or medical care and are not intended to diagnose, treat, or cure mental or medical conditions.</p>
<p class="wp-block-paragraph">Swaane Lauwaert, 511 Boulevard des Musiciens, 83860 Nans-les-Pins. France.  Email: info@swaanelauwaert.com Téléphone:+33 789 06 32 01</p>
```
NL:
```html
<p class="wp-block-paragraph"><strong><strong><strong>Disclaimer</strong></strong></strong>:</p>
<p class="wp-block-paragraph"> Swaane Lauwaert is geen GGZ-professional of medisch specialist. De aangeboden diensten zijn geen vervanging voor professionele geestelijke gezondheidszorg of medische zorg en zijn niet bedoeld om mentale of medische aandoeningen te diagnosticeren, behandelen of genezen.</p>
<p class="wp-block-paragraph">Swaane Lauwaert, 511 Boulevard des Musiciens, 83860 Nans-les-Pins. France. <strong> </strong> Email: info@swaanelauwaert.com  Téléphone:+33 789 06 32 01</p>
```
FR:
```html
<p class="wp-block-paragraph"><strong><strong><strong>Clause de non-responsabilité</strong> </strong></strong></p>
<p class="wp-block-paragraph">Swaane Lauwaert n&rsquo;est ni un professionnel de la santé mentale ni un professionnel de la santé médicale. Les services proposés ne se substituent en aucun cas à une prise en charge psychologique ou médicale professionnelle. Ils ne sont pas destinés à diagnostiquer, traiter ou guérir des pathologies mentales ou médicales.</p>
<p class="wp-block-paragraph">Swaane Lauwaert 511 Boulevard des Musiciens, 83860 Nans-les-Pins. France. <strong> </strong> Email: info@swaanelauwaert.com  Téléphone:+33 789 06 32 01</p>
```

Address `511 Boulevard des Musiciens, 83860 Nans-les-Pins, France`; e-mail `info@swaanelauwaert.com`; phone `+33 789 06 32 01` — **plain text, not `mailto:`/`tel:` links**.

### 3.6 Anchor ids used in the chrome / shared sections

`#wp--skip-link--target` (main), `#contact` (contact section; nav target `/{lang}/#contact`), `#liability`, `#contact-form-{id}`, `#contact-form-success-{hash}`, `#contact-form-success-header-{hash}`, `#jp-form-{hash}`, field ids `g{id}-name|email|message` (+ `-text-error`, `-email-error`, `-textarea-error`, `…-message`), `#ak_js_1`, `#network-info`, `#modal-N` / `#modal-N-content`, `#wp-skip-link`.

### 3.7 Other Flodesk / newsletter CTAs found in the mirror (for completeness, not chrome)

`v3jg55lt2s` ("Yes! Keep me posted please!", "Join us!"), `g8dtc4po0h` ("Yes! I am ready to reclaim my most sacred desire!", "Join us!"), `e5hyhsn3of` ("[Stay tuned →]", "[Restez connectés ! →]"), `erosnl`, `theerossanctuaryeng`, `vwrugoqvdt`, `flavoursofdesireminicourse`, `flavoursofdesireprogramma`, `sin7ymkqj9`, `jgy17ky7ao`, `mariamagdalena2027`, `zny46m6oyn`, `pd9vrqtv1x`, `tpf30n5jns` — see `grep -l myflodesk` over `mirror/raw/swaanelauwaert.com/**/index.html`. There is **no inline newsletter form** anywhere; all sign-ups are outbound links.

---

## 4. `<head>`

### 4.1 Title format

| Page type | `<title>` |
|---|---|
| Language home | `Swaane Lauwaert` (all three) |
| Static page | `{Page title} &#8211; Swaane Lauwaert` → "About me – Swaane Lauwaert", "Over mij – Swaane Lauwaert", "À propos – Swaane Lauwaert", "The Journal – Swaane Lauwaert" |
| Post | `{Post title} &#8211; Swaane Lauwaert` → "cent cinq. – Swaane Lauwaert" |
| Tag archive | `{tag} &#8211; Swaane Lauwaert` → "groen leven – Swaane Lauwaert" |

Separator is an en dash (`&#8211;`) with spaces.

### 4.2 Meta tags (EN home; other languages/pages differ only as noted)

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name='robots' content='max-image-preview:large' />
<meta name="generator" content="WordPress 7.1.3" />
<meta name="description" content="1. Coaching, Bodywork &amp; Intimacy: Sometimes, daily rush, old patterns, or accumulated tension in the nervous system disconnect us from our own foundation and inner center. In my 1:1 sessions, I blend body-oriented coaching, somatic bodywork, and nervous system regulation. A safe, non-judgmental space to truly land back in your body and feel what is&hellip;" />
```

* `meta description` = Jetpack auto-excerpt of the page content (NL: "1. Coaching, Lichaamswerk &amp; Intimiteit: Soms raak je …", FR: "1. Coaching, travail corporel &amp; intimité: Parfois, le rythme …"; tag archive: "Berichten over groen leven geschreven door swaanelauwaert"). Pages without content excerpt (e.g. `en/the-journal`) have **no** description.
* Open Graph (Jetpack): `og:type` `website` on home/archives, `article` on pages/posts; `og:title` (home: `Swaane Lauwaert`; page: page title; tag: `groen leven &#8211; Swaane Lauwaert`); `og:url` — **on all three home pages it is `https://swaanelauwaert.com/`** (not the language URL); pages/posts use their own URL; `og:description` only on articles; `og:site_name` `Swaane Lauwaert`; `og:image` home = `https://swaanelauwaert.com/wp-content/uploads/sites/50/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` (1280 × 577, present at `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg`), About pages = `…/2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` (957 × 960), pages without featured image = the site icon (512 × 512); `og:image:width/height`, `og:image:alt=""`; `og:locale` `en_GB` / `nl_BE` / `fr_FR` + `og:locale:alternate` for the other two (only when translations exist).
* Twitter: `twitter:text:title`, `twitter:image` (`?w=640`), `twitter:card summary_large_image`; `twitter:description` only on home (`Visit the post for more.` / `Bezoek het bericht voor meer.` / `Voir l&rsquo;article pour en savoir plus.`).

### 4.3 Link tags

```html
<link rel="alternate" href="https://swaanelauwaert.com/nl/" hreflang="nl" />
<link rel="alternate" href="https://swaanelauwaert.com/en/" hreflang="en" />
<link rel="alternate" href="https://swaanelauwaert.com/fr/" hreflang="fr" />
<link rel="alternate" href="https://swaanelauwaert.com/" hreflang="x-default" />          <!-- home pages only -->
<link rel="alternate" type="application/rss+xml" title="Swaane Lauwaert &raquo; Feed" href="https://swaanelauwaert.com/en/feed/" />
<link rel="alternate" type="application/rss+xml" title="Swaane Lauwaert &raquo; Comments Feed" href="https://swaanelauwaert.com/en/comments/feed/" />
<link rel="alternate" title="oEmbed (JSON)" type="application/json+oembed" href="https://swaanelauwaert.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fswaanelauwaert.com%2Fen%2F&#038;lang=en" />
<link rel="alternate" title="oEmbed (XML)" type="text/xml+oembed" href="…&#038;format=xml&#038;lang=en" />
<link rel="https://api.w.org/" href="https://swaanelauwaert.com/wp-json/" />
<link rel="alternate" title="JSON" type="application/json" href="https://swaanelauwaert.com/wp-json/wp/v2/pages/44" />
<link rel="EditURI" type="application/rsd+xml" title="RSD" href="https://swaanelauwaert.com/xmlrpc.php?rsd" />
<link rel="canonical" href="https://swaanelauwaert.com/en/" />
<link rel='shortlink' href='https://swaanelauwaert.com/' />                                <!-- pages: https://swaanelauwaert.com/?p=4170 -->
<link rel="modulepreload" href="…/wp-includes/js/dist/script-modules/interactivity/index.min.js?ver=efaa5193bbad9c60ffd1" id="@wordpress/interactivity-js-modulepreload" data-wp-fetchpriority="low">
<link rel="icon" href="https://swaanelauwaert.com/wp-content/uploads/sites/50/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector-32x32.jpg" sizes="32x32" />
<link rel="icon" href="…/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector-192x192.jpg" sizes="192x192" />
<link rel="apple-touch-icon" href="…/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector-180x180.jpg" />
<meta name="msapplication-TileImage" content="https://swaanelauwaert.com/wp-content/uploads/sites/50/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector-270x270.jpg" />
```

* **hreflang**: home pages list nl/en/fr + `x-default` (root); translated static pages list the three translations (e.g. about → `/nl/over-mij/`, `/en/about/`, `/fr/a-propos/`) **without** x-default; NL-only posts, tag and author archives have **no** hreflang links at all.
* **RSS** titles are localised: NL `Swaane Lauwaert &raquo; feed` / `&raquo; reactiesfeed`, FR `&raquo; Flux` / `&raquo; Flux des commentaires`; every singular page adds its own comments feed (`&raquo; About me Comments Feed` → `/en/about/feed/`), tag pages a tag feed (`&raquo; groen leven tagfeed`).
* **Canonical** = the page's own URL (home: `/en/`, `/nl/`, `/fr/`).
* **Site icon**: a red pomegranate illustration (site_icon id 4556, original `…/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector.jpg` 512 × 512). In the mirror only three sizes exist: `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector-{32x32,180x180,192x192}.jpg`. The **270 × 270 tile and the 512 × 512 original are missing** from the mirror (use the 192 px file as source, or regenerate).

### 4.4 Stylesheets, fonts, scripts present in every page

* External CSS: `wp-includes/blocks/navigation/style.min.css`, `wp-includes/blocks/cover/style.min.css`, `wp-includes/blocks/gallery/style.min.css`, Jetpack `grunion.css`, `jetpack-forms-layout.css` (all `?ver=…` files are in the mirror).
* Inline `<style id>` blocks: `wp-emoji-styles`, `wp-block-library`, `wp-block-site-title`, `wp-block-group`, `wp-block-navigation-link`, `wp-block-spacer`, `wp-block-pullquote`, `wp-block-buttons`, `wp-block-button`, `wp-block-image`, `wp-block-heading`, `wp-block-paragraph`, `wp-block-separator`, `wp-block-social-links`, `wp-block-post-title`, `wp-block-post-content`, `wp-block-template-skip-link`, `jetpack-block-button`, `jetpack-stats`, `wp-img-auto-sizes-contain`, `twentytwentyfive-style`, **`global-styles-inline-css`** (theme.json output: all `--wp--preset--*` tokens, element styles), `block-style-variation-styles`, `core-block-supports-inline-css` (the `.wp-container-*` layout rules quoted above).
* Fonts (`@font-face`, `font-display:fallback`): **Beiruti** variable 200–900 `wp-content/themes/twentytwentyfive/assets/fonts/beiruti/Beiruti-VariableFont_wght.woff2`; **Literata** 72pt in 8 weights × {normal, italic} `wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-*.woff2` (16 files); **Floreal** 400 `wp-content/uploads/sites/50/fonts/floreal.woff` (31 KB, custom-uploaded display font used for the site title and all headings). All present under `mirror/raw/swaanelauwaert.com/`.
* Scripts: importmap + `@wordpress/interactivity` module; navigation `view.min.js` module; `wp-polyfill`, `hooks`, `i18n` (+ `setLocaleData` ltr); Jetpack forms `view.js` (defer); `pll_cookie_script`; Jetpack stats (`_stq` with `blog 251803763`, post id, `https://stats.wp.com/e-202642.js`); emoji loader (`wp-emoji-release.min.js?ver=7.1.3`); `<script type="speculationrules">` conservative prefetch of same-origin links (excluding `/wp-*`, uploads, `?` URLs, `rel=nofollow`, `.no-prefetch`); the `network-info` iframe check.

---

## 5. Differences between languages (chrome only)

| Item | EN | NL | FR |
|---|---|---|---|
| `html lang` | `en-GB` | `nl-BE` | `fr-FR` |
| Skip link | Skip to content | Spring naar de inhoud | Aller au contenu |
| Nav `aria-label` | Menu EN | Menu NL | Menu FR |
| Top-level items | Work with me ▾, Cookbook, About me, The Journal, Contact, 🇬🇧 English ▾ | Werk met mij ▾, Kookboek, Over mij, The Journal, Contact, 🇧🇪 Nederlands ▾ | Accompagnement ▾, Livre de Cuisine, À propos de moi, Le Journal, Contact, 🇫🇷 Français ▾ |
| Parent of submenu | real link (`/en/work-with-me/`) | **`href="#"`** (no landing page) | real link (`/fr/accompagnement/`) |
| Submenu count | 4 | **6** (adds PLAY weekend 2026 + Maria Magdalena retreat 2027; long labels with `\|`) | 4 |
| Cross-language links in nav | none | none | `Guide Sainte-Baume` → `/en/guide-sainte-baume/`; nested `<a>` to `/en/body-untamed/` inside "The Eros Sanctuary" |
| Hamburger / close labels | Open menu / Close menu | Menu openen / Menu sluiten | Ouvrir le menu / Fermer le menu |
| Submenu toggle labels | Work with me submenu / Languages submenu | Werk met mij submenu / Talen submenu | Sous-menu Accompagnement / Sous-menu Langues |
| Flag markup captured | base64 PNG 16 × 11 | base64 PNG 16 × 11 | SVG 18 × 12 (`pll-switcher-flag`) |
| Footer line 1 / 2 | All Rights Reserved / Photography | Alle Rechten Voorbehouden / Fotografie | Tous Droits Réservés / Photographie |
| Band A button | Yes! Keep me posted please! → `v3jg55lt2s` | Yes! I am ready to reclaim my most sacred desire! → `g8dtc4po0h` | Yes! Keep me posted please! → `v3jg55lt2s` |
| Band B | — | — | second pullquote (French) + **empty** button → `zny46m6oyn` |
| Gallery 3rd image | MVIMG_20260817_163746-EDIT | MVIMG_20260817_163817_1 | MVIMG_20260817_163746-EDIT |
| Contact heading | Do you have a question? / Feel free to reach out. | **same English text** | Une question ? / N’hésitez pas. |
| Form labels | Name, Email, Message, (required), Send | Naam, E-mail, Bericht, (verplicht), Verzenden | Nom, E-mail, Message, (obligatoire), Envoyer |
| Form ids | 44 / `g44-*` | 74 / `g74-naam|email|bericht` | 76 / `g76-nom|email|message` |
| Success heading | Uw bericht is verzonden | Uw bericht is verzonden | Uw bericht is verzonden |
| Back link | ← Back → `/en/` | ← Terug → `/nl/` | ← Retour → `/fr/` |
| Liability heading | Liability Statement: | Disclaimer: | Clause de non-responsabilité |
| RSS titles | » Feed / » Comments Feed | » feed / » reactiesfeed | » Flux / » Flux des commentaires |
| twitter:description (home) | Visit the post for more. | Bezoek het bericht voor meer. | Voir l’article pour en savoir plus. |
| "Site by" bar | identical English text on all three | | |

Untranslated strings to decide on in the rebuild: NL/FR pullquote and NL contact heading (English), NL "The Journal" label, Dutch success message on EN/FR, French "Téléphone:" in the EN/NL address line.

---

## 6. Design tokens that drive the chrome (from `global-styles-inline-css`)

```css
--wp--preset--color--base: #fff7e6;        /* page + header + footer background (cream) */
--wp--preset--color--contrast: #191919;    /* links, nav text, buttons bg, section text */
--wp--preset--color--accent-1: #FFFFFF;    /* button text */
--wp--preset--color--accent-2: #c60000;    /* (red, not used in chrome) */
--wp--preset--color--accent-3: #000000;    /* headings, site title, pullquote, social icons */
--wp--preset--color--accent-4: #5F5F5F;    /* body text */
--wp--preset--color--accent-5: #F1EEE9;    /* grey bands (band A/B, #contact) */
--wp--preset--color--accent-6: #19191933;  /* separators */
--wp--preset--font-family--literata: Literata, serif;   /* body, nav, footer small print */
--wp--preset--font-family--floreal: Floreal;            /* site title, h1–h6 (uppercase title) */
--wp--preset--font-family--beiruti: Beiruti, sans-serif;/* pullquote, buttons */
--wp--preset--font-size--small: 0.9rem;
--wp--preset--font-size--medium: clamp(1rem, 1rem + ((1vw - 0.2rem) * 0.314), 1.2rem);
--wp--preset--font-size--large: clamp(1.6rem, 1.6rem + ((1vw - 0.2rem) * 0.314), 1.8rem);
--wp--preset--font-size--x-large: clamp(1.8em, 1.8rem + ((1vw - 0.2em) * 0.627), 2.2rem);
--wp--preset--font-size--xx-large: clamp(2rem, 2rem + ((1vw - 0.2rem) * 1.255), 2.8rem);
--wp--preset--spacing--20: 10px;  --30: 20px;  --40: 30px;
--wp--preset--spacing--50: clamp(30px, 5vw, 50px);
--wp--preset--spacing--60: clamp(30px, 7vw, 70px);
--wp--preset--spacing--70: clamp(50px, 7vw, 90px);
--wp--preset--spacing--80: clamp(70px, 10vw, 140px);
--wp--preset--shadow--natural: 0px 3px 6px 0 rgba(0, 0, 0, 0.2);
--wp--style--global--content-size: 960px;
--wp--style--global--wide-size: 1340px;
--wp--style--root--padding-left/right: var(--wp--preset--spacing--50);
--wp--style--block-gap: 1.2rem;
body{background-color:var(--wp--preset--color--base);color:var(--wp--preset--color--accent-4);font-family:var(--wp--preset--font-family--literata);font-size:var(--wp--preset--font-size--medium);font-weight:300;letter-spacing:-0.01em;line-height:1.6}
a:where(:not(.wp-element-button)){color:var(--wp--preset--color--contrast)}   /* theme: text-decoration-thickness:1px; text-underline-offset:.1em */
h1,h2,h3,h4,h5,h6{color:var(--wp--preset--color--accent-3);font-family:var(--wp--preset--font-family--floreal);font-weight:400;letter-spacing:-0.02em;line-height:1.02}
h1{font-size:var(--wp--preset--font-size--xx-large)}  h2{font-size:var(--wp--preset--font-size--x-large)}
```

---

## 7. Asset checklist for the chrome (repo-relative)

| Asset | Path | In mirror? |
|---|---|---|
| Floreal font | `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/fonts/floreal.woff` | yes |
| Beiruti font | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/beiruti/Beiruti-VariableFont_wght.woff2` | yes |
| Literata fonts (16) | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-*.woff2` | yes |
| Favicon 32 / 192 / 180 | `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector-{32x32,192x192,180x180}.jpg` | yes |
| Favicon 270 tile / 512 original | same folder, `-270x270.jpg` and unsuffixed | **no** |
| OG image (home) | `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | yes |
| Gallery photos | `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/2026/08/{IMG-20260404-WA0004.jpg, IMG_5348-768x1024.jpeg, IMG_5348.jpeg, MVIMG_20260817_163746-EDIT-893x1024.jpg, MVIMG_20260817_163817_1-768x1024.jpg}` | yes |
| Flags | inline data URIs (PNG in en/nl, SVG in fr) — no files | n/a |
| Social / hamburger / close / chevron icons | inline SVG (core block icons) — no files | n/a |
| Navigation block CSS | `mirror/raw/swaanelauwaert.com/wp-includes/blocks/navigation/style.min.css?ver=7.1.3.css` | yes |
| Jetpack form CSS/JS | `mirror/raw/swaanelauwaert.com/wp-content/plugins/jetpack/jetpack_vendor/automattic/jetpack-forms/dist/contact-form/css/{grunion.css,jetpack-forms-layout.css}?ver=16.3.1.css`, `…/dist/blocks/view.js?minify=false&ver=…` | yes |

---

## 8. What could not be determined from the mirror

1. Visual state of the **open mobile overlay** and of **open desktop submenus** (no screenshots; derived from core CSS/JS only).
2. Whether the live site shows **three** gallery photos (HTML) or two (local lazy-load artefact).
3. The **Jetpack form backend**: recipient e-mail, server-side success page (the `Uw bericht is verzonden` panel is the AJAX success view), JWT generation; cannot be replicated statically.
4. The **origin of the `#network-info` "Site by Pharéo | Hosted on The Permanently Moving Network" bar** (host mu-plugin, not in the theme) and whether it is contractually required.
5. **Redirect semantics** for duplicate URLs referenced by the nav: `/nl/maria-magdalena-retreat-zuid-frankrijk-2026/` ↔ `…-2027/` (identical page, canonical 2027) and `/en/body-untamed/` ↔ `/en/the-eros-sanctuary-2/` (identical page, canonical the-eros-sanctuary-2). Headers for those requests were not captured.
6. The 270 × 270 and 512 × 512 **site-icon files** are absent.
7. `mirror/api/settings.json` is all `null` (needs auth) — tagline/timezone confirmed only via `root.json` (`description: ""`, `timezone_string: Europe/Paris`).
8. The exact rendered **gap between desktop nav items** (core default `gap` of the navigation block; not overridden in the captured CSS) — measure from `en--desktop--header.png` (~20 px at 1440 px).
9. Content of the external **Flodesk** sign-up pages.

---

## Appendix A — `en.html` header, verbatim (`mirror/raw/swaanelauwaert.com/en.orig` lines 211–258; base64 flag PNGs and long SVG paths trimmed)

```html
<a class="skip-link screen-reader-text" id="wp-skip-link" href="#wp--skip-link--target">Skip to content</a><div class="wp-site-blocks">
<div class="wp-block-group is-layout-flow wp-block-group-is-layout-flow wp-container-4 is-position-sticky" style="box-shadow:var(--wp--preset--shadow--natural)"><header class="wp-block-template-part">
<div class="wp-block-group alignfull is-style-default has-base-background-color has-background has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
<div class="wp-block-group alignwide is-content-justification-space-between is-nowrap is-layout-flex wp-container-core-group-is-layout-ec1e7a1e wp-block-group-is-layout-flex" style="padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)">
<div class="wp-block-group is-layout-flex wp-container-core-group-is-layout-4f9efd84 wp-block-group-is-layout-flex"><p class="wp-block-site-title has-x-large-font-size"><a href="https://swaanelauwaert.com/en" target="_self" rel="home" aria-current="page">Swaane Lauwaert</a></p>

</div>



<div class="wp-block-group is-content-justification-right is-nowrap is-layout-flex wp-container-core-group-is-layout-061990c5 wp-block-group-is-layout-flex">

<nav class="is-responsive items-justified-right wp-block-navigation is-content-justification-right is-layout-flex wp-container-core-navigation-is-layout-6e943505 wp-block-navigation-is-layout-flex" aria-label="Menu EN" 
		 data-wp-interactive="core/navigation" data-wp-context='{"overlayOpenedBy":{"click":false,"hover":false,"focus":false},"type":"overlay","roleAttribute":"","ariaLabel":"Menu"}'><button aria-haspopup="dialog" aria-label="Open menu" class="wp-block-navigation__responsive-container-open" 
				data-wp-on--click="actions.openMenuOnClick"
				data-wp-on--keydown="actions.handleMenuKeydown"
			><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 5v1.5h14V5H5z"></path><path d="M5 12.8h14v-1.5H5v1.5z"></path><path d="M5 19h14v-1.5H5V19z"></path></svg></button>
				<div class="wp-block-navigation__responsive-container has-text-color has-contrast-color has-background has-base-background-color"  id="modal-2" 
				data-wp-class--has-modal-open="state.isMenuOpen"
				data-wp-class--is-menu-open="state.isMenuOpen"
				data-wp-watch="callbacks.initMenu"
				data-wp-on--keydown="actions.handleMenuKeydown"
				data-wp-on--focusout="actions.handleMenuFocusout"
				tabindex="-1"
			>
					<div class="wp-block-navigation__responsive-close" tabindex="-1">
						<div class="wp-block-navigation__responsive-dialog" 
				data-wp-bind--aria-modal="state.ariaModal"
				data-wp-bind--aria-label="state.ariaLabel"
				data-wp-bind--role="state.roleAttribute"
			>
							<button aria-label="Close menu" class="wp-block-navigation__responsive-container-close" 
				data-wp-on--click="actions.closeMenuOnClick"
			><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="m13.06 12 6.47-6.47-1.06-1.06L12 10.94 5.53 4.47 4.47 5.53 10.94 12l-6.47 6.47 1…(trimmed)…"></path></svg></button>
							<div class="wp-block-navigation__responsive-container-content" 
				data-wp-watch="callbacks.focusFirstElement"
			 id="modal-2-content">
								<ul class="wp-block-navigation__container is-responsive items-justified-right wp-block-navigation"><li data-wp-context="{ &quot;submenuOpenedBy&quot;: { &quot;click&quot;: false, &quot;hover&quot;: false, &quot;focus&quot;: false }, &quot;type&quot;: &quot;submenu&quot;, &quot;modal&quot;: null, &quot;previousFocus&quot;: null }" data-wp-interactive="core/navigation" data-wp-on--focusout="actions.handleMenuFocusout" data-wp-on--keydown="actions.handleMenuKeydown" data-wp-on--pointerenter="actions.openMenuOnHover" data-wp-on--pointerleave="actions.closeMenuOnHover" data-wp-watch="callbacks.initMenu" tabindex="-1" class="wp-block-navigation-item has-child open-on-hover-click wp-block-navigation-submenu"><a class="wp-block-navigation-item__content" href="https://swaanelauwaert.com/en/work-with-me/"><span class="wp-block-navigation-item__label">Work with me</span></a><button data-wp-bind--aria-expanded="state.isSubmenuOpen" data-wp-on--click="actions.toggleMenuOnClick" aria-label="Work with me submenu" class="wp-block-navigation__submenu-icon wp-block-navigation-submenu__toggle" ><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M1.50002 4L6.00002 8L10.5 4" stroke-width="1.5"></path></svg></button><ul data-wp-on--focus="actions.openMenuOnFocus" class="wp-block-navigation__submenu-container has-text-color has-contrast-color has-background has-base-background-color wp-block-navigation-submenu"><li class="wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="https://swaanelauwaert.com/en/rooted-rituals/"><span class="wp-block-navigation-item__label">Retreats</span></a></li><li class="wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="https://swaanelauwaert.com/en/the-eros-sanctuary-2/"><span class="wp-block-navigation-item__label">The Eros Sanctuary</span></a></li><li class="wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="https://swaanelauwaert.com/en/flavours-of-desire/"><span class="wp-block-navigation-item__label">Flavours of Desire</span></a></li><li class="wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="https://swaanelauwaert.com/en/sainte-baume-guide/"><span class="wp-block-navigation-item__label">Sainte-Baume Guide</span></a></li></ul></li><li class="wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="https://swaanelauwaert.com/en/cookbook/"><span class="wp-block-navigation-item__label">Cookbook</span></a></li><li class="wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="https://swaanelauwaert.com/en/about/"><span class="wp-block-navigation-item__label">About me</span></a></li><li class="wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="https://swaanelauwaert.com/en/the-journal/"><span class="wp-block-navigation-item__label">The Journal</span></a></li><li class="wp-block-navigation-item wp-block-navigation-link"><a class="wp-block-navigation-item__content"  href="/en/#contact"><span class="wp-block-navigation-item__label">Contact</span></a></li><li data-wp-context="{ &quot;submenuOpenedBy&quot;: { &quot;click&quot;: false, &quot;hover&quot;: false, &quot;focus&quot;: false }, &quot;type&quot;: &quot;submenu&quot;, &quot;modal&quot;: null, &quot;previousFocus&quot;: null }" data-wp-interactive="core/navigation" data-wp-on--focusout="actions.handleMenuFocusout" data-wp-on--keydown="actions.handleMenuKeydown" data-wp-on--pointerenter="actions.openMenuOnHover" data-wp-on--pointerleave="actions.closeMenuOnHover" data-wp-watch="callbacks.initMenu" tabindex="-1" class="wp-block-navigation-item has-child open-on-hover-click lang-item lang-item-8 lang-item-en current-lang wp-block-polylang-navigation-language-switcher wp-block-navigation-submenu"><a hreflang="en-GB" lang="en-GB" class="wp-block-navigation-item__content" href="https://swaanelauwaert.com/en/"><span class="wp-block-navigation-item__label"><img decoding="async" src="data:image/png;base64,…(16x11 flag PNG, trimmed)…" alt="" width="16" height="11" style="width: 16px; height: 11px;" /> English</span></a><button data-wp-bind--aria-expanded="state.isSubmenuOpen" data-wp-on--click="actions.toggleMenuOnClick" aria-label="Languages submenu" class="wp-block-navigation__submenu-icon wp-block-navigation-submenu__toggle" ><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M1.50002 4L6.00002 8L10.5 4" stroke-width="1.5"></path></svg></button><ul data-wp-on--focus="actions.openMenuOnFocus" class="wp-block-navigation__submenu-container has-text-color has-contrast-color has-background has-base-background-color lang-item lang-item-8 lang-item-en current-lang wp-block-polylang-navigation-language-switcher wp-block-navigation-submenu"><li class="wp-block-navigation-item lang-item lang-item-5 lang-item-nl lang-item-first wp-block-navigation-link"><a hreflang="nl-BE" lang="nl-BE" class="wp-block-navigation-item__content"  href="https://swaanelauwaert.com/nl/"><span class="wp-block-navigation-item__label"><img decoding="async" src="data:image/png;base64,…(16x11 flag PNG, trimmed)…" alt="" width="16" height="11" style="width: 16px; height: 11px;" /> Nederlands</span></a></li><li class="wp-block-navigation-item lang-item lang-item-8 lang-item-en current-lang wp-block-navigation-link"><a hreflang="en-GB" lang="en-GB" class="wp-block-navigation-item__content"  href="https://swaanelauwaert.com/en/"><span class="wp-block-navigation-item__label"><img decoding="async" src="data:image/png;base64,…(16x11 flag PNG, trimmed)…" alt="" width="16" height="11" style="width: 16px; height: 11px;" /> English</span></a></li><li class="wp-block-navigation-item lang-item lang-item-12 lang-item-fr wp-block-navigation-link"><a hreflang="fr-FR" lang="fr-FR" class="wp-block-navigation-item__content"  href="https://swaanelauwaert.com/fr/"><span class="wp-block-navigation-item__label"><img decoding="async" src="data:image/png;base64,…(16x11 flag PNG, trimmed)…" alt="" width="16" height="11" style="width: 16px; height: 11px;" /> Français</span></a></li></ul></li></ul>
								
							</div>
						</div>
					</div>
				</div></nav>

</div>
</div>
</div>
</header></div>
```

## Appendix B — `en.html` footer, verbatim (`mirror/raw/swaanelauwaert.com/en.orig` lines 612–672; SVG icon paths trimmed)

```html
<footer class="wp-block-template-part">
<div class="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)">
<div class="wp-block-group alignwide is-layout-flow wp-block-group-is-layout-flow">
<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide is-style-wide--8" style="margin-bottom:36px"/>



<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>





<div class="wp-block-group alignfull is-content-justification-space-between is-layout-flex wp-container-core-group-is-layout-cf54d0a6 wp-block-group-is-layout-flex">
<div class="wp-block-group is-vertical is-layout-flex wp-container-core-group-is-layout-f0b6b26e wp-block-group-is-layout-flex"><h2 class="wp-block-site-title"><a href="https://swaanelauwaert.com/en" target="_self" rel="home" aria-current="page">Swaane Lauwaert</a></h2>

</div>



<ul class="wp-block-social-links has-huge-icon-size has-icon-color is-style-logos-only is-layout-flex wp-block-social-links-is-layout-flex"><li style="color:#2c261e" class="wp-social-link wp-social-link-instagram has-accent-3-color wp-block-social-link"><a rel="noopener nofollow" target="_blank" href="https://www.instagram.com/swaanelauwaert/" class="wp-block-social-link-anchor"><svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42…(trimmed)…"></path></svg><span class="wp-block-social-link-label screen-reader-text">Instagram</span></a></li>

<li style="color:#2c261e" class="wp-social-link wp-social-link-facebook has-accent-3-color wp-block-social-link"><a rel="noopener nofollow" target="_blank" href="https://www.facebook.com/swaane.lauwaert" class="wp-block-social-link-anchor"><svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3…(trimmed)…"></path></svg><span class="wp-block-social-link-label screen-reader-text">Facebook</span></a></li></ul>



<div class="wp-block-group has-small-font-size is-vertical is-content-justification-stretch is-layout-flex wp-container-core-group-is-layout-d8dce8eb wp-block-group-is-layout-flex" style="font-style:italic;font-weight:400">
<div class="wp-block-group is-content-justification-space-between is-nowrap is-layout-flex wp-container-core-group-is-layout-788841da wp-block-group-is-layout-flex">
<div class="wp-block-group is-vertical is-content-justification-left is-layout-flex wp-container-core-group-is-layout-b61a1d7d wp-block-group-is-layout-flex">
<p class="wp-block-paragraph">All Rights Reserved</p>




</div>



<p class="wp-block-paragraph">© Swaane Lauwaert</p>
</div>



<div class="wp-block-group is-content-justification-space-between is-nowrap is-layout-flex wp-container-core-group-is-layout-788841da wp-block-group-is-layout-flex">
<div class="wp-block-group is-vertical is-layout-flex wp-container-core-group-is-layout-831b2db5 wp-block-group-is-layout-flex">
<p class="wp-block-paragraph">Photography</p>




</div>



<p class="wp-block-paragraph">Pinterest, Unsplash</p>
</div>
</div>
</div>
</div>
</div>
</footer></div>
```

## Appendix C — injected "Site by" bar, verbatim (end of `<body>` on every page)

```html
<div id="network-info" class="network-info" style="padding:10px;background:#171717;color:#939393;font-size:14px;text-align:center">
	Site by <a style="color:#ccc;font-size:14px" href="https://phareo.eu" target="_blank" rel="noopener">Pharéo</a> | Hosted on <a style="color:#ccc;font-size:14px" href="https://status301.net/" target="_blank" rel="noopener">The Permanently Moving Network</a>
<script>function inIframe(){try{return window.self!==window.top;}catch(Exception){return true}}if(inIframe()){document.getElementById("network-info").style.display="none"}</script>
```

## Appendix D — screenshot crops used for this audit

Generated from the local full-page renders with Pillow; absolute paths:

- `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/crops/en--desktop--band.png`
- `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/crops/en--desktop--footer.png`
- `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/crops/en--desktop--header.png`
- `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/crops/en--mobile--band.png`
- `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/crops/en--mobile--footer.png`
- `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/crops/en--mobile--header.png`
- `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/crops/en-about--desktop--footer.png`
- `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/crops/en-about--desktop--header.png`
- `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/crops/fr--desktop--footer.png`
- `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/crops/fr--desktop--header.png`
- `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/crops/nl--desktop--footer.png`
- `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/crops/nl--desktop--header.png`
- `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/crops/nl-2018-08-10-cent-cinq--desktop--footer.png`

Full-page sources: `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/local-shots/{en,nl,fr}--desktop.png`, `en--mobile.png`, `en-about--desktop.png`, `nl-2018-08-10-cent-cinq--desktop.png`.
