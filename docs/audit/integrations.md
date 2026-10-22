# Integrations & technical audit — swaanelauwaert.com

Scope: everything on the original WordPress site that is **not plain content**: plugins and the user-facing features they power, forms and where their submissions go, newsletter / booking / payment hand-offs, social and external links, media embeds, analytics and third-party scripts, SEO plumbing, redirects and URL quirks, hosting facts — and finally the checklist of what the static Astro rebuild must replace or re-implement.

Everything below was derived from the local mirror only (the live site is unreachable from this machine). Where the mirror cannot answer a question this is said explicitly in the text and collected again in §12.

Sources used (all paths repo-relative):

| What | Path |
|---|---|
| REST root (namespaces + 566 routes) | `mirror/api/root.json` |
| Post types / taxonomies / users / statuses | `mirror/api/types.json`, `taxonomies.json`, `users-p1.json`, `statuses.json`, `settings.json` (401) |
| All 35 pages (en/nl/fr) | `mirror/api/pages-p1.json` (`pages-en/nl/fr-p1.json` are byte-identical copies) |
| All 210 posts (all Dutch) | `mirror/api/posts-p1.json` … `posts-p3.json` |
| 99 most recent attachments | `mirror/api/media-p1.json`; `jp_pay_product-p1.json` (`[]`) |
| Rendered HTML, wget link-rewritten | `mirror/raw/swaanelauwaert.com/**/*.html` (116 unique pages + pagination variants) |
| Rendered HTML, original absolute URLs | the sibling `*.orig` files (wget `-K` backups) — used for every absolute URL quoted here |
| HTTP headers, robots, sitemaps | `mirror/meta/headers.txt`, `headers_en_.txt`, `headers_nl_.txt`, `robots.txt`, `sitemap.xml` (= `wp-sitemap.xml`), `child-wp-sitemap-*.xml`, `fetch-failed.txt` |
| Playwright extraction (rate-limited; only used for the 2 pages wget did not fetch) | `mirror/pages.json`, `mirror/pages-index.json` |
| Local full-page renders | `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/local-shots/*--desktop.png|--mobile.png` (87 files) |

---

## 0. At a glance

| Topic | Finding |
|---|---|
| Platform | WordPress **7.1.3** multisite (uploads under `wp-content/uploads/sites/50/`), block theme **Twenty Twenty-Five**, served by LiteSpeed (`server: o2switch-PowerBoost-v3`) with **LiteSpeed Cache 7.9.1 → 7.9.2** |
| Plugins with front-end footprint | **Jetpack 16.3.1** (forms, stats, sharing, likes, Open Graph, slideshow, button block), **Polylang 3.9.1** (en/nl/fr), **Akismet**, **Otter Blocks** (content slider + button group on the EN/FR cookbook pages), **LiteSpeed Cache** |
| Plugins with REST routes only (no front-end trace) | **Redirection**, Jetpack sub-products (Boost, Blaze, Search, VideoPress, WAF, CRM, AI, Subscriptions/Newsletter, Memberships/Payments, Publicize) |
| Forms | 1 Jetpack contact form per language home page (`#contact`), the WordPress comment form on every post (open on 209/210 posts), a WordPress password form on 5 protected "module" pages |
| Newsletter / sign-up / checkout | **Flodesk** hosted pages (`https://swaanelauwaert.myflodesk.com/<id>`, 14 distinct ids on 21 pages). No Kit/ConvertKit/Mailchimp/Substack embeds; Substack is a plain profile link |
| Booking | **Calendly** plain links `https://calendly.com/swaanelauwaert/let-s-meet` (8 pages) |
| Payments | None on-site. Jetpack payment post types exist but are empty; purchases go to Flodesk checkouts, the book to **books2read** `https://books2read.com/u/4DwK0r`; one retreat sign-up is a `mailto:` |
| Analytics / scripts | Only **Jetpack Stats** (`https://stats.wp.com/e-2026NN.js`, blog id `251803763`). No GA/GTM/pixels, no cookie banner, no Google Fonts |
| SEO | Jetpack Open Graph tags, Polylang hreflang on translated pages only, no structured data (0 `ld+json`), no robots meta, core `wp-sitemap.xml` |
| Redirects | `/` → `/en/` **302** by Polylang; `en/body-untamed` and `nl/…-2026` are old slugs that 301 to the current slug; `en/guide-sainte-baume` vs `en/sainte-baume-guide` are two distinct published pages |

---

## 1. Plugins in use and what each provides

### 1.1 Evidence base

REST namespaces in `mirror/api/root.json` (`jq -r '.namespaces[]'`):

```
oembed/1.0, akismet/v1, jetpack/v4, litespeed/v1, litespeed/v3, redirection/v1, pll/v1,
wpcom/v2, jetpack/v4/stats-app, jetpack/v4/blaze-app, jetpack/v4/blaze, otter/v1,
jetpack/v4/import, jetpack-boost/v1, my-jetpack/v1, jetpack/v4/explat, wpcom/v3,
wp/v2, wp-site-health/v1, wp-block-editor/v1, wp-abilities/v1
```

Non-core post types in `mirror/api/types.json`: `feedback` ("Form Responses", Jetpack Forms), `jetpack_form` ("Forms"), `jp_act_log_event` ("Activity Log Events"), `jp_pay_order` ("Order"), `jp_pay_product` ("Product"). Plugin asset directories actually requested by pages (present in the mirror): `mirror/raw/swaanelauwaert.com/wp-content/plugins/{akismet,jetpack,otter-blocks,polylang}/`; theme: `wp-content/themes/twentytwentyfive/`.

### 1.2 Plugin table

| Plugin (version) | Evidence | User-facing features **on this site** | Not used / routes only |
|---|---|---|---|
| **Jetpack 16.3.1** (`?ver=16.3.1` on its assets; `"j":"1:16.3.1"` in the stats payload) | `jetpack/v4`, `wpcom/v2`, `my-jetpack/v1` namespaces; blog id `251803763` | **Forms** (3 contact forms, §2.1; responses stored as `feedback` posts). **Stats** (`stats.wp.com` script + `_stq` on all 116 pages, §7). **Sharing buttons block** (`wp-block-jetpack-sharing-buttons`, 57 of 76 mirrored posts; 7 services, §5.4). **Likes** (`widgets.wp.com/likes` iframe on the same 57 posts). **Open Graph / Twitter cards** (`<!-- Jetpack Open Graph Tags -->` on all pages, §8). **Slideshow block** (`wp-block-jetpack-slideshow` + swiper on `nl/kookboek`). **Jetpack Button block** (`wp-block-jetpack-button`, the form submit buttons). **Cookie-consent probe script** (inline on every page, but no cookie-consent block exists anywhere). Akismet-style honeypot on forms is Akismet's. | Payments (`jp_pay_product`/`jp_pay_order` registered; `mirror/api/jp_pay_product-p1.json` is `[]`; `wpcom/v2/memberships/*` routes) — **no products**. Subscriptions/Newsletter (`wpcom/v2/subscribers/*`, `newsletter-categories`) — **no subscribe block/widget on any page**. Publicize (`jetpack_publicize_connections` is `[]` on all 210 posts). Related posts (`wpcom/v2/related-posts` route; no `jp-relatedposts` markup). Blaze, Boost (`jetpack-boost/v1`), Search, VideoPress, WAF, Backup/Rewind, CRM, AI, Mailchimp block (`wpcom/v2/mailchimp`), Instagram gallery, Podcast player, Google Photos — routes only. |
| **Polylang 3.9.1** (`polylang/css/build/navigation-language-switcher.min.css?ver=3.9.1`) | `pll/v1`; `x-redirect-by: Polylang` on `/`; `pll_cookie_script-js-after` inline script | Three languages en (`en_GB`, `/en/`), nl (`nl_BE`, `/nl/`), fr (`fr_FR`, `/fr/`). Language switcher inside the navigation block (`wp-block-polylang-navigation-language-switcher`, flags as inline base64 PNG, labels "English" / "Nederlands" / "Français", `hreflang`/`lang` attributes on each `<a>`). `<link rel="alternate" hreflang>` in `<head>` for translated pages, `x-default` on the home pages. `og:locale:alternate`. Sets cookie `pll_language=<lang>` (1 year, `domain=swaanelauwaert.com; secure; SameSite=Lax`) on every page view. Root `/` 302 → `/en/`. Separate feeds and sitemaps per language. | — |
| **LiteSpeed Cache 7.9.1 / 7.9.2** | `litespeed/v1`, `litespeed/v3`; `<!-- Page cached by LiteSpeed Cache 7.9.1 on 2026-10-19 … -->` (83 pages) / `7.9.2 on 2026-10-22 …` (101 pages); header `x-lsadc-cache: hit` | Full-page cache only. No CSS/JS minification or image-optimisation traces (block CSS is served as WP's own inline styles; images untouched). | QUIC.cloud CDN (`/litespeed/v3/cdn_status` exists; no CDN host appears in any URL). |
| **Redirection** | `redirection/v1` namespace only | Cannot be seen from the front end. The two old-slug redirects found (§9) could be WordPress core's own `wp_old_slug_redirect` or Redirection rules — **the mirror cannot tell which**, nor whether other rules exist (`/redirection/v1/redirect` needs auth). | — |
| **Otter Blocks** (ThemeIsle) | `otter/v1`; `otter-content-slider.js`, `wp-block-themeisle-blocks-content-slider`, `wp-block-themeisle-blocks-button-group` | Image **content slider** and **button group** on `en/cookbook` and `fr/livre-de-cuisine` only (inline i18n `{"goToSlide":"Go to slide %d"}`). | Otter forms (`/otter/v1/form/*`), Otter Stripe (`/otter/v1/stripe/*`), OpenAI — routes only. |
| **Akismet** | `akismet/v1`; `wp-content/plugins/akismet/_inc/akismet-frontend.js` on all 76 mirrored posts | Spam protection: honeypot `<textarea name="ak_hp_textarea">` + `<input name="ak_js">` on the comment form **and** on the Jetpack contact forms; `akismet_comment_nonce` hidden field; privacy line under every comment form: "Bekijk hoe je reactie gegevens worden verwerkt." → `https://akismet.com/privacy/`. | — |
| WordPress core | `wp/v2`, `oembed/1.0`, `wp-site-health/v1`, `wp-block-editor/v1`, `wp-abilities/v1` | Comments (§2.2), oEmbed discovery links, emoji script (`s.w.org`), Interactivity API (`@wordpress/interactivity` importmap; navigation + Jetpack form modules), Query Loop pagination (§9.6), `wp-sitemap.xml`, RSS feeds, application-password auth endpoint (`/wp-admin/authorize-application.php`). | — |

**Absent** (verified by grep over all HTML): any SEO plugin (Yoast/RankMath — meta description and OG come from Jetpack), any consent-management plugin (`cmplz`, `cookiebot`, `cookieyes`, `borlabs`, `cookie-notice` → 0 hits), Google Analytics / Tag Manager / Meta Pixel, Google Fonts, Elementor/other page builders, WooCommerce.

---

## 2. Forms

Files containing `<form`: the three language home pages (`en.html`/`index.html`, `nl.html`/`nl/index.html`, `fr.html`/`fr/index.html`) and every one of the 76 mirrored blog posts. **No other page has a form** (no search form, no newsletter form, no footer form).

### 2.1 Jetpack contact form — one per language home page (section `id="contact"`)

Location: the last content band of each home page, a `wp-block-group` with `id="contact"` (the "Contact" navigation item links to `/en/#contact`, `/nl/#contact`, `/fr/#contact`; CTA buttons on inner pages also link to these anchors, see §3.3). Immediately above the form sits a pull-quote + newsletter button band (§3.1) and the heading text:

| Lang | Heading above form (verbatim) | Submit | Visually-hidden submitting label | Success message | Back link |
|---|---|---|---|---|---|
| en (`mirror/raw/swaanelauwaert.com/en.orig`) | "Do you have a question?" / "Feel free to reach out." | **Send** | "Submitting form" | **"Uw bericht is verzonden"** (Dutch, on the EN page) | "← Back" |
| nl (`nl.orig`) | "Do you have a question?" / "Feel free to reach out." (English text on the NL page) | **Verzenden** | "Formulier insturen" | "Uw bericht is verzonden" | "← Terug" |
| fr (`fr.orig`) | "Une question ?" / "N'hésitez pas." | **Envoyer** | "Envoi du formulaire" | "Uw bericht is verzonden" (Dutch, on the FR page) | "← Retour" |

Form element (identical structure in all three; values per language):

| Attribute / field | en | nl | fr |
|---|---|---|---|
| `action` | `https://swaanelauwaert.com/en/` | `https://swaanelauwaert.com/nl/` | `https://swaanelauwaert.com/fr/` |
| `method` | `post` | `post` | `post` |
| `id` | `jp-form-11ce59a1dcbd2f3644924ffa8239b06474a3ea1a` | `jp-form-b5cd5d664c98003415ad6439fb410e6b31f38570` | `jp-form-017bf96efc52775e829737ebc68f849013d59184` |
| `class` | `contact-form commentsblock jetpack-contact-form__form has-no-jetpack-form-layout` (same) | | |
| `aria-label` | `Swaane Lauwaert` (same) | | |
| `novalidate`, Interactivity directives | `data-wp-on--submit="actions.onFormSubmit"`, `data-wp-on--reset`, `data-wp-class--submission-success`, `data-wp-class--is-ajax-form="context.useAjax"` (same) | | |
| hidden `jetpack_contact_form_jwt` | HS256 JWT carrying the **encrypted block attributes** (recipient e-mail, subject, etc.) — opaque | same | same |
| hidden `jetpack_form_fill_duration` | `""` (filled by JS, anti-bot timing) | same | same |
| hidden `contact-form-id` | `44` (= page id of `/en/`) | `74` (page id of `/nl/`) | `76` (page id of `/fr/`) |
| hidden `action` | `grunion-contact-form` | same | same |
| hidden `contact-form-hash` | `11ce59a1dcbd2f3644924ffa8239b06474a3ea1a` | `b5cd5d664c98003415ad6439fb410e6b31f38570` | `017bf96efc52775e829737ebc68f849013d59184` |
| Akismet honeypot | `<label>Δ<textarea name="ak_hp_textarea" cols="45" rows="8" maxlength="100">` + `<input type="hidden" id="ak_js_1" name="ak_js" value="107">` | `ak_js` value `204` | `ak_js` value `171` |
| Field 1 | `<input type="text" name="g44-name" id="g44-name" required aria-required="true">` label **"Name"** + "(required)" | `name="g74-naam"` label **"Naam"** + "(verplicht)" | `name="g76-nom"` label **"Nom"** + "(obligatoire)" |
| Field 2 | `<input type="email" name="g44-email" required>` label **"Email"** + "(required)" | `name="g74-email"` label **"E-mail"** + "(verplicht)" | `name="g76-email"` label **"E-mail"** + "(obligatoire)" |
| Field 3 | `<textarea name="g44-message" id="contact-form-comment-g44-message" rows="20">` label **"Message"** (optional) | `name="g74-bericht"` label **"Bericht"** (optional) | `name="g76-message"` label **"Message"** (optional) |
| Style | block style `is-style-outlined`, "notched" floating labels (`notched-label__label`), `has-small-font-size`, inputs `style="border-style:solid"` | | |
| Submit button | `wp-block-jetpack-button is-style-outline` → `<button type="submit" class="wp-block-button__link is-style-outline">` with spinner span | | |

No placeholders, no reCAPTCHA, no WP nonce (`_wpnonce`) — Jetpack relies on the JWT + hash + Akismet honeypot + fill-duration.

**Where submissions go.** Jetpack Forms (`grunion-contact-form`): the JS module `wp-content/plugins/jetpack/jetpack_vendor/automattic/jetpack-forms/dist/modules/form/view.js?ver=16.3.1` posts the form (it references `admin-ajax.php` and `contact-form-sent`), the entry is stored as a `feedback` post (visible under *Feedback → Form Responses* in wp-admin, REST `wp/v2/feedback`), checked by Akismet, and e-mailed to the recipient configured in the block (the address is inside the encrypted JWT; the public contact address on the site is `info@swaanelauwaert.com`, see §3.4 — **whether that is the form recipient cannot be determined from the mirror**). On success the page swaps to the "Uw bericht is verzonden" panel in place.

**Static rebuild requirement:** a form backend/endpoint that accepts a POST of `{name, email, message}` from the three localised forms, performs spam filtering (at minimum a honeypot + time-to-fill, optionally a captcha), e-mails the submission to the owner, and returns a success state that the page renders in-place in the right language (and an error state — the Jetpack markup has `contact-form__error` / `contact-form__error-message` containers whose text is not rendered server-side, so the exact error copy cannot be recovered). Keep the `#contact` anchor on the three home pages because the navigation and five inner-page CTAs rely on it.

### 2.2 WordPress comment form — every blog post

Present on all 76 mirrored posts; the API shows `comment_status: open` on 209 of 210 posts (closed only on `https://swaanelauwaert.com/nl/2014/06/11/petit-petit-loiseau-fait-son-nid/`). Example file: `mirror/raw/swaanelauwaert.com/nl/2012/04/25/het-mysterie-van-de-halve-brug/index.html.orig`.

| Item | Value (verbatim) |
|---|---|
| Section heading | `<h2 class="wp-block-heading has-x-large-font-size">Reacties</h2>`; comments title `<h3 id="comments" class="wp-block-comments-title">N reacties op “<post title>”</h3>` (only when comments exist) |
| Form | `<form action="https://swaanelauwaert.com/wp-comments-post.php" method="post" id="commentform" class="comment-form">` |
| Reply title | `<h3 id="reply-title">Een reactie achterlaten</h3>` |
| Notes | "Je e-mailadres zal niet getoond worden." · "Vereiste velden zijn gemarkeerd met *" |
| Fields | `comment` textarea (`cols=45 rows=8 maxlength=65525 required`) label "Reactie *"; `author` text (`maxlength=245 autocomplete=name required`) label "Naam *"; `email` email (`maxlength=100 required aria-describedby=email-notes`) label "E-mail *"; `url` url (`maxlength=200`) label "Website" (optional) |
| Cookie consent | `<input id="wp-comment-cookies-consent" name="wp-comment-cookies-consent" type="checkbox" value="yes">` label "Mijn naam, e-mailadres en website opslaan in deze browser voor de volgende keer wanneer ik een reactie plaats." |
| Submit | `<input name="submit" type="submit" id="submit" class="wp-block-button__link wp-element-button" value="Reactie plaatsen">` |
| Hidden | `comment_post_ID` (post id), `comment_parent` (`0`), `akismet_comment_nonce` (e.g. `20c307e560`), Akismet honeypot `ak_hp_textarea` + `ak_js` |
| Privacy line | "Bekijk hoe je reactie gegevens worden verwerkt." → `https://akismet.com/privacy/` |
| Threading | `comment-reply.min.js?ver=7.1.3`; per-comment reply link text **"Antwoord"** → `<post url>?replytocom=<id>#respond` (177 such links in the mirror); `aria-label="Antwoord op <name>"` |
| Existing comments | 29 of the 76 mirrored posts carry comments, 177 `<li id="comment-…">` in total; rendered with `wp-block-comment-template`, `wp-block-avatar` (Gravatar), `wp-block-comment-date`, `wp-block-comment-author-name` (author URLs rendered as `<a rel="external nofollow ugc">`, see §5.5) |

**No comments API dump exists in `mirror/api/`** (`/wp/v2/comments` is registered but was not fetched), so comments on the 134 non-mirrored posts are unknown (gap, §12).

**Static rebuild requirement:** decide between (a) freezing comments — render the existing comment threads as static HTML and remove the form (closing comments), or (b) a hosted comment service. Either way the `wp-comments-post.php` endpoint, `?replytocom=` URLs, Akismet nonce and the cookie-consent checkbox disappear.

### 2.3 Password form — the five protected "module" pages

`mirror/api/pages-p1.json` marks five published pages as `content.protected: true` with empty rendered content: `en/flavours-of-desire-modules-english/` (id 5113), `en/module-1/` (5247, title "The Eros Sanctuary Modules (English version):"), `nl/flavours-of-desire-3/modules/` (4990, parent 4533), `nl/the-eros-sanctuary-modules/` (5236), `fr/flavours-of-desire-2/modules/` (5101, parent 4537). wget did not fetch them; the Playwright run got one (`mirror/pages.json`, url `https://swaanelauwaert.com/fr/flavours-of-desire-2/modules/`, status 200), which records:

- H1 **"Protégé : Flavours of Desire Modules"**, `<title>Flavours of Desire Modules – Swaane Lauwaert</title>`
- `<form action="https://swaanelauwaert.com/wp-login.php?action=postpass" method="post" class="post-password-form">` with fields `redirect_to` (hidden), `post_password` (password), `Submit` (submit). The label/button copy was not captured.
- hreflang alternates nl ↔ fr for the "modules" pair (the EN modules page is not linked as a translation).

These pages are the delivery area of the paid courses: the 19 PDF workbooks and 9 MP3 audio files in `mirror/api/media-p1.json` are attached to them (parent ids 4990, 5113, 5236) — full list in §6.4. None of the module pages is linked from any public page (verified over all `.orig` files), so students reach them via the Flodesk purchase flow / e-mail.

**Static rebuild requirement:** an access-gating mechanism for the module pages and their PDF/MP3 files (the WordPress single-password gate has no static equivalent; the page content itself is not in the mirror — gap).

---

## 3. Newsletter, "keep me posted" and subscribe mechanics

### 3.1 Flodesk is the only sign-up/checkout system

Every "keep me posted" / "join" / "stay tuned" / "buy" / "sign up" button is a plain `<a>` to a hosted **Flodesk** page (`swaanelauwaert.myflodesk.com`); nothing is embedded (no Flodesk inline form script, no popup). 37 links on 21 pages, 14 distinct Flodesk ids:

| Flodesk URL | Page(s) (repo path under `mirror/raw/swaanelauwaert.com/`) | Button / link text (verbatim) |
|---|---|---|
| `https://swaanelauwaert.myflodesk.com/v3jg55lt2s` | `en.orig` (home, band "Are you ready to trade the numbness for the nectar?"), `fr.orig` (same English band), `en/work-with-me/index.html.orig` | **"Yes! Keep me posted please!"** (en + fr home); **"Join us!"** (en/work-with-me) |
| `…/g8dtc4po0h` | `nl.orig` (home band), `nl/samenwerken/`, `fr/accompagnement/` | **"Yes! I am ready to reclaim my most sacred desire!"** (nl home); **"Join us!"** (nl/samenwerken, fr/accompagnement) |
| `…/zny46m6oyn` | `fr.orig` (second band "Es-tu prête à quitter la torpeur pour goûter au nectar de la vie ?"), `fr/rituels-dancrage/` | **"Oui ! Je suis prête à réclamer mon désir le plus sacré !"**; **"Oui ! Je veux marcher dans les pas de Marie-Madeleine !"** |
| `…/e5hyhsn3of` | `en.orig` (retreat-2027 teaser), `fr.orig` | "[Stay tuned →]"; "[Restez connectés ! →]" |
| `…/theerossanctuaryeng` | `en/the-eros-sanctuary-2/` (and its old-slug copy `en/body-untamed/`) | "Stay tuned THE EROS SANCTUARY"; "Yes! Ignite my inner fire!" |
| `…/erosnl` | `nl/the-eros-sanctuary/` | "Schrijf je hier in voor THE EROS SANCTUARY"; "Yes! Ignite my inner fire!" |
| `…/vwrugoqvdt` | `fr/le-corps-libre/` | "Joignez The Eros Sanctuary" |
| `…/flavoursofdesireminicourse` | `en/flavours-of-desire/` | **"BUY Flavours of Desire HERE"** |
| `…/flavoursofdesireprogramma` | `nl/flavours-of-desire-3/` | **"Koop FLAVOURS OF DESIRE hier"** |
| `…/sin7ymkqj9` | `fr/flavours-of-desire-2/` | "Keep me updated on Flavours of Desire" |
| `…/tpf30n5jns` | `en/flavours-of-desire/` | "Stay tuned for my cookbook…" |
| `…/pd9vrqtv1x` | `fr/flavours-of-desire-2/` | "Tenez-moi au courant de la sortie du livre !" |
| `…/mariamagdalena2027` | `en/rooted-rituals/`, `nl/maria-magdalena-retreat-zuid-frankrijk-2027/` (and old-slug copy `…-2026/`) | "Yes! I want to step in the footsteps of Mary Magdalene!"; **"Druk hier voor het programma en de prijzen"**; **"Schrijf je in"** |
| `…/jgy17ky7ao` | `nl/weekendretreat-27-28-29-november-2026-play/` | "Bekijk het volledige programma" |

Whether a given Flodesk id is a *newsletter form*, a *waitlist* or a *checkout* cannot be seen from the mirror; the button copy ("BUY", "Koop", "prijzen") indicates the course and retreat ones are Flodesk checkouts/sales pages.

### 3.2 Substack

`https://substack.com/@swaanelauwaert1` — plain text link "FOLLOW ME ON: https://substack.com/@swaanelauwaert1" inside the pull-quote on the three journal pages (`en/the-journal/`, `nl/journal/`, `fr/le-journal/`). Directly above it each journal page has a button **"SUBSTACK"** (`<a class="wp-block-button__link wp-element-button">SUBSTACK</a>`) **with no `href`** — a dead button on the original site. The 2026-10 upload `wp-content/uploads/sites/50/2026/10/substack-4b9801.svg` (in `mirror/media/…`) is not referenced by any mirrored page. No Substack embed/iframe.

### 3.3 CTAs that point back at the home-page contact form

| Page | Button text | href |
|---|---|---|
| `en/flavours-of-desire/` | "Yes! I want to feel it all!" | `https://swaanelauwaert.com/en/#contact` |
| `nl/flavours-of-desire-3/` | "Ja! Ik wil het allemaal voelen!" | `https://swaanelauwaert.com/nl/#contact` |
| `fr/flavours-of-desire-2/` | "Oui ! Je veux tout vivre pleinement !" | `https://swaanelauwaert.com/fr/#contact` |
| `fr/le-corps-libre/` | "Oui! Je veux travailler ensemble!" | `https://swaanelauwaert.com/fr/#contact` |
| nav item "Contact" (all pages) | "Contact" | `/en/#contact`, `/nl/#contact`, `/fr/#contact` |

### 3.4 E-mail

`info@swaanelauwaert.com` appears as plain text in the liability/address paragraph of the three home pages ("Swaane Lauwaert, 511 Boulevard des Musiciens, 83860 Nans-les-Pins. France. Email: info@swaanelauwaert.com Téléphone:+33 789 06 32 01") and as `mailto:info@swaanelauwaert.com` behind the button **"Schrijf je in"** on `nl/weekendretreat-27-28-29-november-2026-play/`. One 2012 post links `mailto:petris@alsatis.net`.

### 3.5 Not present

Kit/ConvertKit, Mailchimp, Substack embeds, Jetpack Subscriptions block/widget, any `newsletter`/`nieuwsbrief` wording — 0 hits across all HTML and API content.

---

## 4. Booking and payments

### 4.1 Calendly

Plain links (no Calendly widget script, no inline embed) to **`https://calendly.com/swaanelauwaert/let-s-meet`** on 8 pages:

| Page | Button text |
|---|---|
| `en/about/` | "Let's meet!" |
| `en/work-with-me/` | "Let's meet!" |
| `nl/over-mij/` | "Let's meet!" |
| `nl/samenwerken/` | "Let's talk!" |
| `fr/a-propos/` | "Au plaisir de nous rencontrer !" |
| `fr/accompagnement/` | "Contactez-moi!" |
| `fr.orig` / `fr/index.html` (home, "Coaching" band) | "[Séances individuelles →]" |

### 4.2 Prices mentioned on-site

| Page | Text (verbatim) |
|---|---|
| `en/work-with-me/` | "One 60-minute session: €75" |
| `nl/samenwerken/` | "Eén sessie van 60 minuten: €75" |
| `fr/accompagnement/` | "Une séance de 60 minutes : 75 €" |

No other `€`/price text exists on any mirrored page; retreat and course prices live on the Flodesk pages ("Druk hier voor het programma en de prijzen").

### 4.3 Payment infrastructure

- Jetpack/WordPress.com payments: post types `jp_pay_product` and `jp_pay_order` are registered, but `mirror/api/jp_pay_product-p1.json` is `[]` and no `wp-block-jetpack-recurring-payments` / `simple-payments` markup exists → **no products, nothing to migrate**.
- Stripe / PayPal: 0 hits in HTML (Otter's `/otter/v1/stripe/*` routes are unused).
- Purchases/sign-ups therefore happen off-site: Flodesk checkouts (§3.1), **books2read** for the cookbook, and e-mail for the PLAY weekend.

### 4.4 "Buy" / "book" CTAs and targets

| Target | Page | Text |
|---|---|---|
| `https://books2read.com/u/4DwK0r` (universal book link, same URL for both formats) | `en/cookbook/` (buttons appear twice: once in the Otter slider band, once below) | "Buy the PAPERBACK here!", "Buy the HARDCOVER here!" |
| same | `nl/kookboek/` | "Koop de PAPERBACK hier!", "Koop de HARDCOVER hier!" |
| same | `fr/livre-de-cuisine/` | "Commandez le livre BROCHÉ ici !", "Commandez le livre RELIÉ ici !" |
| same | `en.orig` home | "Discover the book & order your copy →" |
| same | `nl.orig` home | "[Ontdek het boek & bestel jouw exemplaar →]" |
| same | `fr.orig` home | "[Découvrez le livre & commandez votre exemplaire →]" |
| Flodesk `flavoursofdesireminicourse` / `flavoursofdesireprogramma` | `en/flavours-of-desire/`, `nl/flavours-of-desire-3/` | "BUY Flavours of Desire HERE" / "Koop FLAVOURS OF DESIRE hier" |
| Flodesk `mariamagdalena2027` | `nl/maria-magdalena-retreat-zuid-frankrijk-2027/`, `en/rooted-rituals/` | "Schrijf je in", "Druk hier voor het programma en de prijzen", "Yes! I want to step in the footsteps of Mary Magdalene!" |
| Flodesk `jgy17ky7ao` + `mailto:info@swaanelauwaert.com` | `nl/weekendretreat-27-28-29-november-2026-play/` | "Bekijk het volledige programma", "Schrijf je in" |
| `https://www.lacuisineverte.com` | `nl/kookboek/` | "www.lacuisineverte.com" |

**Static rebuild requirement:** none beyond keeping these exact external URLs and button labels per language.

---

## 5. Social & external domains

### 5.1 Site chrome (on all 116 pages)

| Domain | URL | Where | Text |
|---|---|---|---|
| instagram.com | `https://www.instagram.com/swaanelauwaert/` | footer `wp-block-social-links` (`wp-block-social-link-anchor`, SVG icon + visually-hidden label) | "Instagram" |
| facebook.com | `https://www.facebook.com/swaane.lauwaert` | footer social links | "Facebook" |
| phareo.eu | `https://phareo.eu` (`target="_blank" rel="noopener"`) | injected bar after the footer: `<div id="network-info" class="network-info" style="padding:10px;background:#171717;color:#939393;font-size:14px;text-align:center"> Site by <a style="color:#ccc;font-size:14px" …>Pharéo</a> \| Hosted on <a …>The Permanently Moving Network</a> </div>` | "Pharéo" (preceded by "Site by") |
| status301.net | `https://status301.net/` | same bar | "The Permanently Moving Network" (preceded by "Hosted on") |

Footer text otherwise: "Swaane Lauwaert", "All Rights Reserved", "© Swaane Lauwaert", "Photography", "Pinterest, Unsplash" (FR: "Tous Droits Réservés … Photographie … Pinterest, Unsplash") — "Pinterest" here is a photo credit, **not** a Pinterest profile link (no pinterest.com profile anywhere).

### 5.2 Static pages

| Domain | Pages | Text | Notes |
|---|---|---|---|
| swaanelauwaert.myflodesk.com | 21 pages | see §3.1 | sign-up / checkout |
| calendly.com | 8 pages | see §4.1 | booking |
| books2read.com | `en/cookbook`, `nl/kookboek`, `fr/livre-de-cuisine`, 3 home pages | see §4.4 | book sales |
| substack.com | `en/the-journal`, `nl/journal`, `fr/le-journal` | "https://substack.com/@swaanelauwaert1" | profile link; "SUBSTACK" button has no href |
| saintebaumeguide.com | `en/guide-sainte-baume/` → `https://saintebaumeguide.com/fr/`; `en/sainte-baume-guide/` → `https://saintebaumeguide.com/en/`; `nl/sainte-baume-gids/` → `https://www.saintebaumeguide.com` | "www.saintebaumeguide.com" | sister site (user `saintebaumeguide`, id 1340, exists on this WP) |
| instagram.com (plain text link) | `en/the-eros-sanctuary-2/` (+ `en/body-untamed/` copy), `nl/the-eros-sanctuary/` | "Instagram" | in-content link |
| en.wikipedia.org | `en/rooted-rituals/`, `fr/rituels-dancrage/`, `nl/levende-rituelen/` | "Artemisia Gentileschi" → `https://en.wikipedia.org/wiki/Artemisia_Gentileschi` | |
| lacuisineverte.com | `nl/kookboek/` | "www.lacuisineverte.com" → `https://www.lacuisineverte.com` | |
| jessybettio.com, helder-zijn.be | `nl/weekendretreat-27-28-29-november-2026-play/` | "https://jessybettio.com/", "https://www.helder-zijn.be/" | co-facilitators |
| player.vimeo.com / vimeo.com | `nl/flavours-of-desire-3/` | iframe + bare URL | §6.1 |

### 5.3 Blog post content (all 210 posts, from `content.rendered` in `mirror/api/posts-p*.json`)

| Domain | Links | Posts / text |
|---|---|---|
| charliemag.be / www.charliemag.be | 25 | 21 posts of the "Charlie Rubriek" / "On est parti!" series link their Charlie Magazine republication, text "Charlie", "Charlie Magazine", "CHARLIE MAGAZINE", "Vrouwen die Vertrokken" (e.g. `nl/2014/03/25/het-prille-begin-van-een-spannend-vervolgverhaal/` → `https://www.charliemag.be/mensen/on-est-parti-deel-1/`) |
| www.facebook.com | 5 | `nl/2014/10/27/de-revival-van-laura-…/` ("Freecycle Facebook", "geefwinkels en –pleinen"), `nl/2015/02/03/helden-van-iran-shahla-sherkat/` ("‘My Stealthy Freedom’" ×2), `nl/2015/08/22/wij-gaan-naar-calais-en-nemen-mee/` ("Peter Terryn") |
| www.dewitteraaf.be | 2 | `nl/2013/08/18/het-wordt-nooit-meer-zoals-vroeger-…-dirk-lauwaert/`, `nl/2016/08/10/het-wordt-nooit-meer-zoals-vroeger-charlie-16/` |
| www.youtube.com | 2 (+2 iframes) | §6.2 |
| one each | | zananemrooz.com, www.velt.be, www.pinterest.com (`/search/?q=DIY`, "DIY"), www.noveltymag.co.uk ("NOVELTY MAGAZINE", post `letting-go`), www.metronieuws.nl, www.malala-yousafzai.com, www.cobra.be, www.biscuiterielesrabarines.com, www.actuallymagazine.be (post `open-call`), thepioneerwoman.com, nl.wikipedia.org, madamezsazsa.blogspot.fr, en.wikipedia.org (Laura Ingalls Wilder), drijfhout.be (`/tag/swaane-lauwaert/`, post `leon-spilliaert`), deknorendebie.blogspot.fr, afterhours-dvl.tumblr.com ("Davy Van Laere") |

### 5.4 Jetpack sharing services (57 of 76 mirrored posts; `jetpack_sharing_enabled: true` on all 210 posts)

`<ul class="wp-block-jetpack-sharing-buttons has-normal-icon-size jetpack-sharing-buttons__services-list">` with links `<post url>?share=<service>&nb=1` (`target="_blank" rel="nofollow noopener noreferrer"`), each with a visually-hidden label "Delen op <Service> (Wordt in een nieuw venster geopend)": **Bluesky, Facebook, LinkedIn, Mastodon, WhatsApp, Pinterest, X**. The `?share=` URLs are server-side redirects handled by Jetpack (none mirrored). The 19 posts *without* sharing/likes blocks are: `test-post-1`, `lome-dagen`, `de-storm-en-de-mierenhoop`, `thuis`, `sneeuwpret-en-psychedelische-paddenstoelen`, `de-timmerman-en-de-godfather`, `home-is-wherever-im-with-you`, `soixante-dixneuf`, `het-lang-verwachte-verhaal`, `quatre-vingt-onze`, `quatre-vingt-douze`, `quatre-vingt-quatorze`, `quatre-vingt-quinze`, `quatre-vingt-dix-neuf`, `cent-trois`, `cent-six`, `cent-neuf`, `cent-dix-sept`, `cent-vingt` (reason not determinable from the mirror — possibly cached before the block was added to the template).

### 5.5 Comment-author websites (user-generated, `rel="external nofollow ugc"`, 20 links in the 76 mirrored posts)

www.ysabje.wordpress.com ×5, onestparti.be ×4 (the author's former blog, text "Swaane"), afterhours-dvl.tumblr.com ×2 ("DvL"), www.peregringo.eu / peregringo.eu ("Peter Goossens", "Peter"), www.joshuadhondt.be ("Joshua"), www.christinegruwez.info, sijberswheaten.wordpress.com ("Grietje"), onsparijsavontuur.wordpress.com ("Kathleen"), plus three malformed hrefs typed by commenters: `http://janvanlook`, `http://deknorendebie@blogspot.fr`, `http://Agoodsenseofhumus`. These are *not* editorial links; keep only if comments are reproduced.

### 5.6 Other third-party hosts touched by the browser

`secure.gravatar.com` (author-archive og:image and comment avatars), `s.w.org` (emoji images via `wp-emoji-settings`), `stats.wp.com`, `widgets.wp.com`, `player.vimeo.com`, `www.youtube.com` (embeds in 2 posts). No CDN host for assets.

---

## 6. Media embeds

### 6.1 Iframes

| Page | `src` | Details |
|---|---|---|
| `nl/flavours-of-desire-3/index.html` | `https://player.vimeo.com/video/1177988427?dnt=1&app_id=122963` | `<figure class="wp-block-embed is-type-video is-provider-vimeo wp-block-embed-vimeo wp-embed-aspect-16-9 wp-has-aspect-ratio">`, `title="INTRO Flavours of Desire NL"`, 500×281, `allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"`. The page also prints the bare share URL `https://vimeo.com/1177988427/b9332c6ba5?share=copy&fl=sv&fe=ci` as text right after "Koop FLAVOURS OF DESIRE hier". Only on the NL page — the EN/FR Flavours pages have no video. |
| 57 posts | `https://widgets.wp.com/likes/master.html?ver=2026102N#ver=…&lang=nl-be` (hidden `id="likes-master"`) + per-post `data-src="https://widgets.wp.com/likes/index.html?ver=16.3.1#blog_id=251803763&post_id=<id>&origin=swaanelauwaert.com&obj_id=…&block=1"` | Jetpack Likes (`wp-block-jetpack-like`, `data-title='Like of reblog'`, loading text "Bezig met laden…") |
| `nl/2015/02/03/helden-van-iran-shahla-sherkat/` (API only, not mirrored) | `https://www.youtube.com/embed/RYnLRf-SNxY?feature=oembed` | `title="Happy We are from Tehran"`, 500×281, oEmbed |
| `nl/2015/01/07/charlie-de-week-van-swaane/` (API only) | `https://www.youtube.com/embed/K6TBpl8UEFw?feature=oembed` | `title="Jerusalem S.O.S."`; the same post also links `https://www.youtube.com/watch?v=1-hBjJdwCME` |

### 6.2 Plain video links (no embed)

`nl/2012/04/22/test-post-1/` → `http://youtu.be/BGEOYmMe-aI`; `nl/2012/10/05/tegelkachels-en-droogtoiletten/` → `https://www.youtube.com/watch?v=lDcVrVA4bSQ`; `nl/2014/08/24/beproevingen/` → `https://www.youtube.com/watch?v=WQ__sxXQDmk&feature=youtu.be`.

### 6.3 `<audio>` / `<video>` / PDF on public pages

None. 0 `<audio>`, 0 `<video>`, 0 links to `.pdf/.mp3/.mp4` on any mirrored page or in any post's `content.rendered`. (`wp-block-audio` / `wp-block-video` strings only occur inside the theme's inline CSS.) `wp-content/uploads/sites/50/2018/01/Actually.mov` is referenced somewhere in the fetch list but returns 404 on the live site (`mirror/meta/fetch-failed.txt`).

### 6.4 Course media attached to the protected module pages (not linked publicly; all files present under `mirror/media/wp-content/uploads/sites/50/…`)

| Parent page | Files |
|---|---|
| `nl/flavours-of-desire-3/modules/` (4990) | `2026/03/De-Boodschappenlijst.pdf`, `2026/03/De-Intieme-Quiz.pdf`, `2026/03/Flavours-of-Desire-E-book-Nederlands.pdf` |
| `en/flavours-of-desire-modules-english/` (5113) | `2026/03/Flavors-of-Desire-E-book-ENGLISH.pdf`, `2026/03/Flavours-of-Desire-E-book-ENGLISH.pdf`, `2026/03/Flavours-of-Desire-INTRO-audio-ENGLISH.mp3`, `2026/03/Shopping-List.pdf`, `2026/03/The-Intimacy-Quiz.pdf` |
| `nl/the-eros-sanctuary-modules/` (5236) | `2026/05/Workbook-module-1-Nederlands.pdf` |
| unattached (`post: null`) | MP3: `2026/03/INTRO-audio-NL.mp3`, `Flavours-of-Desire-Module-1-audio-NL.mp3`, `…-Module-2-audio-NL.mp3`, `…-Module-3-audio-NL.mp3`, `…-Module-4a-audio-NL.mp3`, `…-Module-4b-RECEPT-1001-nachten-NL.mp3`, `…-Module-4c-audio-NL.mp3`, `…-Module-5-audio-NL.mp3`; PDF: `2026/05/Werboek-Module-2-NL.pdf`, `Workbook-Module-1-English-1-2.pdf`, `Workbook-Module-2.pdf`, `Workbook-module-3-ENGLISH.pdf`, `Workbook-module-3-Nederlands.pdf`, `2026/06/Workbook-Module-4-Nederlands.pdf`, `Workbook-module-3-Engels.pdf`, `Workbook-module-5-Engels.pdf`, `Workbook-module-5-Nederlands.pdf`, `Workbook-module-6-Engels.pdf`, `Workbook-module-6-Nederlands.pdf` |

`media-p1.json` only holds the 99 newest attachments (2026-02-18 → 2026-10-19); older media is only known through the HTML.

### 6.5 Image carousels / galleries (JavaScript-driven on the original)

- Jetpack **Slideshow** (`wp-block-jetpack-slideshow`, swiper.js, `jetpack-block-slideshow-css`) — `nl/kookboek/index.html` only.
- Otter **Content Slider** (`wp-block-themeisle-blocks-content-slider`, `otter-content-slider.js`) — `en/cookbook/index.html`, `fr/livre-de-cuisine/index.html` (the three cookbook pages use two different slider implementations).
- Core `wp-block-gallery` on 15 mirrored pages (9 posts per the API) — CSS-only, no JS.

---

## 7. Analytics, scripts, consent, fonts

### 7.1 External script hosts

Exactly one: **`https://stats.wp.com/e-202642.js`** (15 pages, cached week 42) / **`e-202643.js`** (101 pages, week 43) — Jetpack Stats, loaded `defer fetchpriority="low"`. Inline config (`<script id="jetpack-stats-js-before">`):

```js
_stq = window._stq || [];
_stq.push([ "view", {"v":"ext","blog":"251803763","post":"44","tz":"2","srv":"swaanelauwaert.com","j":"1:16.3.1"} ]);
_stq.push([ "clickTrackerInit", "251803763", "44" ]);
```

plus `<style id="jetpack-stats-inline-css">img#wpstats{display:none}</style>`. No Google Analytics, Tag Manager, Meta/Facebook Pixel, Hotjar, Plausible, Matomo (0 hits).

### 7.2 Scripts by page type (all first-party unless noted)

| Page type | Scripts |
|---|---|
| every page | `wp-includes/js/dist/script-modules/block-library/navigation/view.min.js` (module), importmap `{"@wordpress/interactivity": "…/wp-includes/js/dist/script-modules/interactivity/index.min.js?ver=efaa5193bbad9c60ffd1"}` + `modulepreload`, `wp-emoji-settings` inline (`wp-emoji-release.min.js?ver=7.1.3` loaded conditionally, emoji from `https://s.w.org/images/core/emoji/17.0.2/`), `pll_cookie_script-js-after` inline, `jetpack-stats-js(-before)`, Jetpack cookie-consent probe `document.cookie.includes("eucookielaw")&&…` (hides `div.wp-block-jetpack-cookie-consent`, which never exists) |
| home pages (en/nl/fr ×2 files) | `wp-polyfill.min.js?ver=3.15.0`, `hooks.min.js`, `i18n.min.js` (+ locale data inline), `jetpack-forms/dist/blocks/view.js`, `jetpack-forms/dist/modules/form/view.js?ver=16.3.1` (module, Interactivity API `jetpack/form`), `wp-script-module-data-@wordpress/interactivity` |
| posts (76) | `comment-reply.min.js?ver=7.1.3`, `akismet/_inc/akismet-frontend.js`; on 57 of them also `wp-dom-ready.min.js`, `jetpack/_inc/build/likes/queuehandler.min.js?ver=16.3.1`, `jetpack/_inc/blocks/sharing-buttons/view.js`, `jetpack/_inc/blocks/sharing-button/view.js` (×2 variants), inline `var Jetpack_Block_Assets_Base_Url="https://swaanelauwaert.com/wp-content/plugins/jetpack/_inc/blocks/"` |
| `nl/kookboek` | `jetpack/_inc/blocks/swiper.js?ver=16.3.1`, `jetpack/_inc/blocks/slideshow/view.js`, `escape-html.min.js`, `wp-dom-ready` |
| `en/cookbook`, `fr/livre-de-cuisine` | `otter-blocks/build/blocks/content-slider.js` + inline `var themeisleGutenbergContentSlider = {"goToSlide":"Go to slide %d"};` |

### 7.3 Cookies & consent

- **No consent banner** on the original site.
- Polylang sets `pll_language=<en|nl|fr>` for 1 year (`path=/; domain=swaanelauwaert.com; secure; SameSite=Lax`) on every page — a functional cookie used for the `/` → language redirect.
- Jetpack Stats sets its own cookies from `stats.wp.com`; Jetpack Likes iframe is third-party (`widgets.wp.com`).
- Comment form has the WordPress "save my name/email" consent checkbox (§2.2).
- The `wp-comment-cookies-consent` checkbox and the Jetpack cookie-consent probe are the only consent-related markup.

### 7.4 Fonts (all self-hosted; no fonts.googleapis/gstatic/bunny/typekit)

`@font-face` rules inlined in `global-styles-inline-css`:

| Family | Files (repo paths under `mirror/raw/swaanelauwaert.com/`) |
|---|---|
| Literata | `wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-{Regular,RegularItalic,Light,LightItalic,ExtraLight,ExtraLightItalic,Medium,MediumItalic,SemiBold,SemiBoldItalic,Bold,BoldItalic,ExtraBold,ExtraBoldItalic,Black,BlackItalic}.woff2` |
| Beiruti | `wp-content/themes/twentytwentyfive/assets/fonts/beiruti/Beiruti-VariableFont_wght.woff2` |
| **Floreal** (custom upload, used for display headings) | `wp-content/uploads/sites/50/fonts/floreal.woff` |

---

## 8. SEO

### 8.1 Title pattern

`<title>` = `{Page or post title} – Swaane Lauwaert` (the dash is `&#8211;`); the home pages are just `Swaane Lauwaert`; archives `{term} – Swaane Lauwaert` (e.g. "une par jour – Swaane Lauwaert", "groen leven – Swaane Lauwaert"); author `swaanelauwaert – Swaane Lauwaert`; protected page `Flavours of Desire Modules – Swaane Lauwaert` (the "Protégé :" prefix only appears in the H1). Site `description` in REST is empty.

### 8.2 Meta description (generated by Jetpack from the excerpt/first paragraph)

Present on 112/116 unique pages. Missing on `en/the-journal/`, `fr/le-journal/`, `nl/journal/` (query-loop pages without own text) and on the post `nl/2018/05/26/soixante-seize/`. Archive pattern: "Berichten over {term} geschreven door swaanelauwaert" (categories/tags), "Lees alle berichten van swaanelauwaert op Swaane Lauwaert" (author). Home pages use the first content paragraph truncated with "&hellip;".

### 8.3 Open Graph / Twitter (Jetpack, between `<!-- Jetpack Open Graph Tags -->` markers on all 116 pages)

`og:type` (`website` for home/journal/archives, `article` for pages and posts, `profile` for the author page), `og:title`, `og:url`, `og:description` (pages/posts only), `og:image` + `og:image:width/height` (featured image, or the 512 px site icon `wp-content/uploads/sites/50/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector.jpg` as fallback on journal/category/tag pages, Gravatar on the author page), `og:locale` + `og:locale:alternate` (only on pages that have translations), `og:site_name`, `article:published_time` / `article:modified_time`, `twitter:card=summary_large_image` (107 pages) and `twitter:image` (`…?w=640`). og:image per page and its presence in the mirror:

| Page | og:image (under `wp-content/uploads/sites/50/`) | In mirror |
|---|---|---|
| en, nl, fr home | `2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | yes |
| en/about, nl/over-mij, fr/a-propos | `2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` | yes |
| en/work-with-me, nl/samenwerken, fr/accompagnement | `2026/10/Screenshot-2026-10-10-105756.png` | yes |
| en/cookbook, fr/livre-de-cuisine | `2026/08/MVIMG_20260817_163817_1-scaled.jpg` | yes |
| nl/kookboek | `2026/08/Screenshot-2026-08-25-001028.jpg` | yes |
| en/flavours-of-desire | `2026/02/b69a7dfbf5eaad18b7b69648d56c9c49.jpg` | yes |
| nl/flavours-of-desire-3, fr/flavours-of-desire-2 | `2026/02/a4a043d325ecfae0844bcce21546e339.jpg` | yes |
| en/the-eros-sanctuary-2 (+body-untamed), nl/the-eros-sanctuary | `2026/04/8881d238fd5f3310b8212df33597bd3d-150x150.jpg` | the 150×150 crop is **not** mirrored; the original `…3d.jpg` and `-225x300`/`-768x1024` are |
| fr/le-corps-libre | `2026/01/9d110192f5f3236a1cb2cf7d956f15b0.jpg` | yes |
| en/rooted-rituals | `2026/02/b40ec7271d9a610c1298162dd93302b2.jpg` | yes |
| nl/levende-rituelen, fr/rituels-dancrage | `2026/02/5eaaabe9572dec3fc263928e634ab651.jpg` | yes |
| nl/maria-magdalena-retreat-…-2027 (+2026) | `2026/02/DSCF0973-1-scaled.jpg` | yes |
| nl/weekendretreat-…-play | `2026/08/95067da75856898475877e5c4bd47736.jpg` | yes |
| en/guide-sainte-baume, en/sainte-baume-guide, nl/sainte-baume-gids | `2026/08/IMG_20260812_200654-scaled.jpg` | yes |
| journals, categories, tags | `2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector.jpg` (512 px) | **no** (only the 32/180/192 px crops are mirrored) |

### 8.4 Canonical

`<link rel="canonical">` on 107/116 pages. Absent on the archives: `en/the-journal/`, `fr/le-journal/`, `nl/journal/`, `nl/category/*`, `nl/tag/*`, `nl/author/swaanelauwaert/`. On old-slug URLs the canonical points at the current slug (§9.2).

### 8.5 hreflang (Polylang)

`<link rel="alternate" href="…" hreflang="nl|en|fr">` in `<head>` on **30/116** pages (the 10 translated page groups); `hreflang="x-default"` → `https://swaanelauwaert.com/` only on the 3 home pages (6 files). **No head hreflang** on: all 76 posts, `en/guide-sainte-baume/`, `nl/maria-magdalena-retreat-zuid-frankrijk-2027/` (+2026), `nl/weekendretreat-27-28-29-november-2026-play/`, categories, tags, author (NL-only content). The nav language switcher additionally carries `hreflang`/`lang` attributes on its `<a>`s on every page.

### 8.6 robots.txt (`mirror/meta/robots.txt`)

```
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php

Sitemap: https://swaanelauwaert.com/wp-sitemap.xml
```

No `<meta name="robots">` on any page (0/116).

### 8.7 Sitemaps (core `wp-sitemap`, split per language by Polylang)

Index `https://swaanelauwaert.com/wp-sitemap.xml` (`mirror/meta/sitemap.xml` = `wp-sitemap.xml`) lists 9 children:

| Child sitemap | Mirrored as | URLs |
|---|---|---|
| `nl/wp-sitemap-posts-post-1.xml` | `mirror/meta/child-wp-sitemap-posts-post-1.xml` | 210 posts |
| `nl/wp-sitemap-posts-page-1.xml` | `child-wp-sitemap-posts-page-1.xml` | 13 NL pages (incl. the 2 protected module pages) |
| `en/wp-sitemap-posts-page-1.xml` | **not mirrored** | (API: 13 EN pages) |
| `fr/wp-sitemap-posts-page-1.xml` | **not mirrored** | (API: 9 FR pages) |
| `nl/wp-sitemap-taxonomies-category-1.xml` | `child-wp-sitemap-taxonomies-category-1.xml` | 8 categories |
| `nl/wp-sitemap-taxonomies-post_tag-1.xml` | `child-wp-sitemap-taxonomies-post_tag-1.xml` | 6 tags |
| `nl/wp-sitemap-users-1.xml` | `child-wp-sitemap-users-1.xml` | 1 (`nl/author/swaanelauwaert/`) |
| `en/wp-sitemap-users-1.xml`, `fr/wp-sitemap-users-1.xml` | not mirrored | — |

`mirror/meta/sitemap-urls.txt` holds the 238 mirrored sitemap URLs; `urls.txt` (261) adds the EN/FR pages discovered from the API.

### 8.8 RSS / discovery links in `<head>`

Per language: `https://swaanelauwaert.com/nl/feed/` ("Swaane Lauwaert » feed"), `nl/comments/feed/` ("… » reactiesfeed"), `en/feed/` ("… » Feed"), `en/comments/feed/`, `fr/feed/` ("… » Flux"), `fr/comments/feed/`; per archive `nl/category/<slug>/feed/` ("… categoriefeed"), `nl/tag/<slug>/feed/` ("… tagfeed"), `nl/author/swaanelauwaert/feed/`; per post/page `<url>/feed/` (comments feed, "… reactiesfeed"). Also oEmbed discovery (`/wp-json/oembed/1.0/embed?url=…&lang=xx`, JSON + XML), `<link rel="https://api.w.org/" href="https://swaanelauwaert.com/wp-json/">`, `<link rel="alternate" type="application/json" href="…/wp-json/wp/v2/pages/<id>">`, `<link rel="EditURI" href="https://swaanelauwaert.com/xmlrpc.php?rsd">`, and a `link: <https://swaanelauwaert.com/>; rel=shortlink` HTTP header.

### 8.9 Structured data

**None.** 0 `application/ld+json` blocks on all 116 pages; no microdata beyond the theme's `hentry` class.

### 8.10 Icons & generator

`<link rel="icon" sizes="32x32">` → `wp-content/uploads/sites/50/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector-32x32.jpg`, `sizes="192x192"` → `…-192x192.jpg`, `apple-touch-icon` → `…-180x180.jpg` (all three mirrored). `<meta name="generator" content="WordPress 7.1.3">` on every page.

---

## 9. Redirects & URL quirks

### 9.1 Root redirect

`mirror/meta/headers.txt`: `GET /` → `HTTP/2 302`, `location: https://swaanelauwaert.com/en/`, `x-redirect-by: Polylang`, `cache-control: no-cache, no-store, must-revalidate, max-age=0`. This is Polylang's home redirect; it is a **302** (not 301) and `x-default` hreflang points at `/`, which is consistent with browser-language detection — but whether a Dutch or French browser is sent to `/nl/` or `/fr/` cannot be verified from the mirror (the mirror was fetched once, from one client). `/en/` and `/nl/` answer 200 with `x-lsadc-cache: hit`.

### 9.2 Duplicate-slug pairs

| Pair | Verdict | Evidence |
|---|---|---|
| `en/body-untamed/` vs `en/the-eros-sanctuary-2/` | **Redirect** (old slug → current). `body-untamed` is not in the pages API; the fetched HTML is page id 66, `<title>The Eros Sanctuary – Swaane Lauwaert</title>`, canonical and `og:url` both `https://swaanelauwaert.com/en/the-eros-sanctuary-2/`, identical `article:modified_time`, same H1 "The Eros Sanctuary", identical first 300 chars of `<main>`; the two files differ by 8 lines (cache timestamp / relative paths). | `mirror/raw/swaanelauwaert.com/en/body-untamed/index.html.orig`, `en/the-eros-sanctuary-2/index.html.orig` |
| `nl/maria-magdalena-retreat-zuid-frankrijk-2026/` vs `…-2027/` | **Redirect** (old slug → current). Only `…-2027` (id 4728) exists in the API; both files are page 4728, canonical and `og:url` = `…-2027/`, same title "Maria Magdalena ‘Wild&Rooted’ Retreat Zuid Frankrijk 5-10 april 2027 – Swaane Lauwaert", 6 differing lines. **The old slug is still linked**: button "Ja! Ik wil in de voetsporen treden van Maria Magdalena!" on `nl/levende-rituelen/` → `https://swaanelauwaert.com/nl/maria-magdalena-retreat-zuid-frankrijk-2026/`. | `nl/maria-magdalena-retreat-zuid-frankrijk-2026/index.html.orig`, `…-2027/index.html.orig`, `nl/levende-rituelen/index.html.orig` |
| `en/guide-sainte-baume/` vs `en/sainte-baume-guide/` | **Two different published pages** (duplicates by content). Ids 5633 ("Guide Sainte-Baume", modified 2026-09-13 12:41) and 5629 ("Sainte-Baume Guide", modified 12:31); both language EN; each has its own canonical/og:url; same body text ("The ancient primeval forest and limestone cliffs of the Sainte-Baume massif feel like a second home to me…"); differences: title/H1, the button target (`https://saintebaumeguide.com/fr/` vs `/en/`), and only `sainte-baume-guide` is linked as the translation of `nl/sainte-baume-gids/` (hreflang). The **FR navigation** links "Guide Sainte-Baume" → `/en/guide-sainte-baume/`, the **EN navigation** links "Sainte-Baume Guide" → `/en/sainte-baume-guide/`; the NL nav links `nl/sainte-baume-gids/`. 37 differing lines. | `en/guide-sainte-baume/index.html.orig`, `en/sainte-baume-guide/index.html.orig`, `fr.orig`, `en.orig` |
| `en/werk-met-mij/` vs `en/work-with-me/` | **Different pages; `werk-met-mij` is an empty orphan.** Page 5530 "Werk met mij" (EN language, created 2026-08-24) returns 200 with H1 "Werk met mij" and no content (`content.rendered` empty in the API, `mirror/pages.json` shows only the H1 + footer); nothing links to it. `work-with-me` (4242) is the real page. Not in the wget mirror. | `mirror/api/pages-p1.json`, `mirror/pages.json` |

Whether the two old-slug redirects are WordPress core (`wp_old_slug_redirect`, 301) or Redirection-plugin rules, and whether other redirect rules exist (e.g. from the pre-2026 site structure, `onestparti.be` era URLs), **cannot be determined from the mirror**.

### 9.3 Links to old/odd URLs inside the content (must keep working after the rebuild)

- Every FR page's navigation item "The Eros Sanctuary" is malformed: `<a class="wp-block-navigation-item__content" href="https://swaanelauwaert.com/fr/le-corps-libre/"><span class="wp-block-navigation-item__label"><a href="https://swaanelauwaert.com/en/body-untamed/">The Eros Sanctuary</a></span></a>` — a nested anchor pointing at the **English old slug** (`fr.orig` and all `fr/*/index.html.orig`).
- `nl/levende-rituelen/` button → `…-2026/` old slug (above).
- NL navigation parent "Werk met mij" has `href="#"` (submenu parent: Samenwerken, Weekendretreat 27-28-29 november 2026: PLAY, Maria Magdalena Retreat Zuid Frankrijk 2027, Flavours of Desire | Voeding, Verlangen & Zelfliefde, The Eros Sanctuary | Somatic Coaching & Sacred Sexuality, Sainte-Baume Gids).
- "SUBSTACK" buttons with no `href` (§3.2).

### 9.4 www vs apex

All absolute URLs in HTML, headers, sitemaps and the API use the apex `https://swaanelauwaert.com`; `www.swaanelauwaert.com` occurs nowhere (0 hits). Whether `www.` redirects to the apex was not probed (gap).

### 9.5 404 page

No 404 response was captured (the only 404s in `mirror/meta/fetch-failed.txt` are 10 missing upload files, listed in §10). The theme's "404" block template would render it, but its text/markup on this site **cannot be determined from the mirror**. The closest known "empty state" copy is the query-loop fallback on `en/the-journal/`: "Sorry, nothing found yet." (English-only; the FR journal has an empty `wp-block-query-no-results` block).

### 9.6 Query-string URL variants (do not reproduce)

- Query Loop pagination: `?query-1-page=N` on `nl/journal/` (24 pages × 9 posts; labels "Volgende pagina→" / "←Vorige pagina", numbered `page-numbers` links), `nl/author/swaanelauwaert/`, `nl/category/*`, `nl/tag/*`.
- `?cst` / `&cst`: variants such as `nl/journal/index.html?cst.html` are byte-identical pages apart from the propagated parameter in pagination links and the LiteSpeed cache timestamp; the parameter's origin is not in any `.orig` file (probably a cache-buster from the mirroring tool) — ignore.
- `?replytocom=<id>#respond` (177 links), `?share=<service>&nb=1` (Jetpack), `/feed/`, `?lang=xx` on oEmbed URLs, `/wp-json/…`, `/xmlrpc.php?rsd` — all server-side WordPress endpoints.
- Mirror artefacts: `index.html` ≡ `en.html` (byte-identical, incl. `.orig`), `fr/index.html` ≡ `fr.html` and `nl/index.html` ≡ `nl.html` (same page; the two copies differ only in wget's relative-path rewriting).

### 9.7 Archive URLs that exist but were not mirrored

Categories `nl/category/{actually-magazine,charlie-rubriek,interviews,non-fictie,poezie}/` and tags `nl/tag/{bouwen-in-stro-en-leem,emigreren-naar-frankrijk,food,moestuin-2}/` (listed in the sitemaps; counts in `mirror/api/categories-p1.json` / `tags-p1.json`). Categories with 0 posts (`geen-categorie`, `uncategorized`, `life`, `leven`, `la-vie`, `non-categorise`, `auparleur-be`, `polaroid-love`, `de-binnenruimte`, `lespace-interieur`, `inner-room`) and tag `pasta-met-tomatensaus` are not public.

---

## 10. Hosting facts

| Fact | Value / evidence |
|---|---|
| Server | `server: o2switch-PowerBoost-v3` (o2switch shared hosting, LiteSpeed-based), HTTP/2, `vary: Accept-Encoding` — `mirror/meta/headers*.txt` |
| Edge cache | `x-lsadc-cache: hit` (LiteSpeed ADC) on `/en/` and `/nl/`; `etag: "45709-1792365845;;;"` style; redirect response `cache-control: no-cache, no-store, must-revalidate, max-age=0` |
| Page cache | LiteSpeed Cache plugin: `<!-- Page cached by LiteSpeed Cache 7.9.1 on 2026-10-19 20:09:57 -->` (83 files) and `7.9.2 on 2026-10-22 18:02:58` (101 files) — the snapshot straddles a plugin update |
| `link` headers | `<https://swaanelauwaert.com/wp-json/>; rel="https://api.w.org/"`, `<…/wp-json/wp/v2/pages/44>; rel="alternate"; title="JSON"` (`pages/74` for `/nl/`), `<https://swaanelauwaert.com/>; rel=shortlink` |
| WordPress | 7.1.3, **multisite**: uploads live under `wp-content/uploads/sites/50/` (site id 50 of a network — matches the "Hosted on The Permanently Moving Network" / status301.net credit bar; Pharéo built the site). Jetpack/WordPress.com blog id `251803763`. Home page = page 44 (`page-no-title` template); NL home 74, FR home 76 |
| Time zone | `timezone_string: Europe/Paris`, `gmt_offset: 2` (`root.json`) |
| Users | `swaanelauwaert` (id 1342, author of all 210 posts, archive `nl/author/swaanelauwaert/`), `saintebaumeguide` (id 1340, no public posts) |
| Auth | Application passwords enabled (`/wp-admin/authorize-application.php`); `/wp/v2/settings` → 401 |
| Missing on the live site (404 at mirror time, `mirror/meta/fetch-failed.txt`) | `uploads/sites/50/2012/04/IMG_25962.jpg`, `2012/04/IMG_2605.jpg`, `2012/04/IMG_2609.jpg`, `2012/04/IMG_2610.jpg`, `2012/09/IMG_3390.jpg`, `2012/09/IMG_3398.jpg`, `2018/01/Actually.mov`, `2020/05/IMG_0454-1.jpg`, `2020/05/IMG_3255-kopiëren-e1589139128265.jpg`, `2020/05/eea1bb7a72db978c00664312f83d2208.jpg` — these are already broken on the original |
| Image handling | WordPress-generated sizes (`-scaled`, `-NNNxNNN`, `-eNNNNNNNNNN` edited originals), `srcset`/`sizes` on `<img>`, `decoding="async"`, `loading="lazy"`, `fetchpriority` — core only, no CDN rewriting |
| Media in mirror | `mirror/media/wp-content/uploads/sites/50/…`: 559 jpg, 83 png, 49 jpeg, 19 pdf, 9 mp3, 1 webp, 1 svg, 1 gif |

---

## 11. Checklist — what the static rebuild must replace or re-implement

| # | Item | Pages affected | What the original did | Static replacement needed |
|---|---|---|---|---|
| 1 | **Contact form** | `/en/#contact`, `/nl/#contact`, `/fr/#contact` (home pages) | Jetpack Forms → `feedback` CPT + e-mail, Akismet, in-place success "Uw bericht is verzonden" + "← Back/Terug/Retour" | A form backend accepting `name`/`email`/`message` with spam protection and e-mail notification; localised labels ("Name/Email/Message · Send", "Naam/E-mail/Bericht · Verzenden", "Nom/E-mail/Message · Envoyer"), required markers "(required)/(verplicht)/(obligatoire)", success/back copy; keep the `id="contact"` anchor |
| 2 | **Blog comments** | all 210 posts (`/nl/YYYY/MM/DD/slug/`), 209 open | `wp-comments-post.php`, Akismet, threaded replies "Antwoord", comment-reply.js, Gravatar avatars | Either static rendering of existing threads + comments closed, or a comment service; dump `/wp/v2/comments` first (not in the mirror) |
| 3 | **Password-protected module pages + course files** | `en/flavours-of-desire-modules-english/`, `en/module-1/`, `nl/flavours-of-desire-3/modules/`, `nl/the-eros-sanctuary-modules/`, `fr/flavours-of-desire-2/modules/` + 19 PDF / 9 MP3 | `wp-login.php?action=postpass` single-password gate | A gated-area mechanism (auth + protected file delivery); the page content itself must be obtained from the owner (not in mirror) |
| 4 | **Language routing** | `/` | Polylang 302 → `/en/` (+ `pll_language` cookie, possibly browser-language detection) | Host-level redirect `/` → `/en/` (or language detection) and the `x-default` hreflang; drop the cookie script |
| 5 | **Old-slug redirects** | `/en/body-untamed/` → `/en/the-eros-sanctuary-2/`; `/nl/maria-magdalena-retreat-zuid-frankrijk-2026/` → `…-2027/` | WP/Redirection 301 | Explicit 301 rules (both old URLs are still linked from FR navigation and `nl/levende-rituelen/`) — or fix those links and still keep the redirects for external referrers |
| 6 | **Duplicate / orphan pages decision** | `en/guide-sainte-baume/` vs `en/sainte-baume-guide/`; `en/werk-met-mij/` | both 200 | Keep one Sainte-Baume page per language and 301 the other (FR nav currently uses `guide-sainte-baume`, EN nav `sainte-baume-guide`); drop or 301 the empty `werk-met-mij` |
| 7 | **Dead "SUBSTACK" buttons** | `en/the-journal/`, `nl/journal/`, `fr/le-journal/` | `<a>` without `href` | Point them at `https://substack.com/@swaanelauwaert1` |
| 8 | **Nested-anchor nav bug** | every FR page, nav item "The Eros Sanctuary" | `<a href="/fr/le-corps-libre/"><span><a href="/en/body-untamed/">…` | Single link to `/fr/le-corps-libre/` |
| 9 | **Jetpack Stats** | all pages | `stats.wp.com` + `_stq` (blog 251803763) | Choose an analytics solution (or none); nothing else to port |
| 10 | **Sharing buttons & Likes** | 57+ posts | `?share=bluesky|facebook|linkedin|mastodon|whatsapp|pinterest|x` server redirects; `widgets.wp.com` likes iframes | Static share links (intent URLs) with the same 7 services and Dutch labels "Delen op …", or drop; Likes have no static equivalent (drop) |
| 11 | **Open Graph / Twitter / hreflang / canonical / feeds / sitemap** | all pages | Jetpack OG tags, Polylang hreflang (translated pages only), core canonical (not on archives), per-language RSS, `wp-sitemap.xml` | Generate equivalents at build time (titles `… – Swaane Lauwaert`, descriptions, og:image per page from §8.3, locales `en_GB/nl_BE/fr_FR`); decide whether to keep RSS feeds (`/nl/feed/` etc.) and comment feeds; regenerate sitemap(s); add `robots.txt` |
| 12 | **Query-loop archives & pagination** | `nl/journal/` (24 pages), `nl/author/swaanelauwaert/`, `nl/category/{8}`, `nl/tag/{6}` | `?query-1-page=N` | Pre-rendered paginated archives with "Volgende pagina→ / ←Vorige pagina"; map `?query-1-page=N` to static paths or redirect |
| 13 | **Carousels** | `nl/kookboek/` (Jetpack Slideshow/swiper), `en/cookbook/`, `fr/livre-de-cuisine/` (Otter content slider + button group) | plugin JS | A single slider component (or static gallery) for all three |
| 14 | **Vimeo & YouTube embeds** | `nl/flavours-of-desire-3/` (Vimeo 1177988427, `dnt=1`), posts `helden-van-iran-shahla-sherkat` (RYnLRf-SNxY) and `charlie-de-week-van-swaane` (K6TBpl8UEFw) | oEmbed figures | Plain responsive iframes with the same `src`/titles |
| 15 | **Comment-reply / Akismet / emoji / polyfill / interactivity scripts** | all | WP runtime | Not needed; navigation submenus (language switcher, NL "Werk met mij") need their own minimal JS/CSS |
| 16 | **External hand-offs (keep verbatim)** | 21 pages Flodesk, 8 Calendly, 9 books2read, 3 Substack, 3 saintebaumeguide.com, `mailto:info@swaanelauwaert.com`, lacuisineverte.com, jessybettio.com, helder-zijn.be, Wikipedia | plain links | Keep every URL and label from §3–§5 |
| 17 | **Fonts** | all | self-hosted Literata, Beiruti, Floreal (`uploads/sites/50/fonts/floreal.woff`) | Copy the font files into the static site |
| 18 | **Favicons / og fallback image** | all | 32/192/180 px pomegranate crops; 512 px original used as og:image fallback | Copy the crops; recreate the 512 px original (not mirrored) |
| 19 | **Site credit bar** | all | injected `div#network-info` "Site by Pharéo \| Hosted on The Permanently Moving Network" (network-level, not theme) | Decide whether to keep; it is not part of the page template |
| 20 | **Broken uploads** | 10 files in §10 | already 404 on the original | Fix or remove the referencing `<img>`/links in the affected 2012/2018/2020 posts |

---

## 12. What could not be determined from the mirror

1. The **recipient e-mail / subject** of the three Jetpack contact forms (encrypted inside `jetpack_contact_form_jwt`) and the exact client-side **error messages** (rendered only by JS).
2. The **content and password** of the five protected module pages (REST returns empty `content.rendered`; wget did not fetch them; the Playwright run got only the password form of the FR one).
3. **Comments on the 134 posts that were not mirrored** — no `/wp/v2/comments` dump exists.
4. Whether the old-slug redirects are **core or Redirection-plugin** rules, and whether **other redirect rules** (e.g. legacy URLs) exist.
5. Whether **`www.swaanelauwaert.com`** redirects to the apex, and what the **404 template** looks like.
6. Whether the `/` → `/en/` 302 depends on **browser language** (Polylang setting) — only the English result was observed.
7. The purpose of each **Flodesk id** (newsletter form vs waitlist vs checkout) and the **prices** of retreats/courses (all hosted on Flodesk).
8. The **EN and FR page sitemaps** and **EN/FR user sitemaps** (listed in the index, not fetched).
9. The **full media library** (only the 99 newest attachments are in `media-p1.json`; older images are known only from HTML), the un-mirrored **512 px site icon** and the **150×150 Eros Sanctuary og:image crop**.
10. The reason **19 posts lack the sharing/likes blocks** while 57 have them (all 210 posts report `jetpack_sharing_enabled: true`).
11. The origin of the **`?cst` query parameter** in the mirrored pagination variants (absent from the original HTML).
12. The **Jetpack module list** actually enabled (`/jetpack/v4/module/all` requires auth) — only front-end evidence was used above.
