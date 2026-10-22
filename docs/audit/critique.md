# Completeness critique of the audit set — swaanelauwaert.com

Reviewer scope: the nine files in `docs/audit/` (`design-system.md`, `global-styles.css`, `chrome.md`, `pages-en.md`, `pages-nl.md`, `pages-fr.md`, `blog.md`, `integrations.md`, `assets.md`) were read in full and then spot-checked **independently** against the mirror (`mirror/raw/swaanelauwaert.com/**/*.orig`, `mirror/api/*.json`, `mirror/meta/*`, `mirror/pages-index.json`) and the local renders in `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/local-shots/`. The live site was not reachable; nothing below relies on it.

Verdict in one paragraph: the audits are thorough and, for the large majority of facts, correct — every nav label, every one of the 35 button hrefs I re-extracted, all design tokens, the blog counts and the page inventory check out. Three things are wrong enough to mislead the rebuild and must be fixed: **(1)** `pages-en.md` reverses the current/old slug of the Eros Sanctuary page (it is `/en/the-eros-sanctuary-2/`, not `/en/body-untamed/`), **(2)** `chrome.md` claims the language switcher always links to the language home, when it actually links to the translated counterpart of the current page (and hides languages without a translation), and **(3)** `chrome.md` says the French second band's button is empty while it carries the label "Oui ! Je suis prête à réclamer mon désir le plus sacré !". A handful of smaller factual slips and a short list of omissions follow.

---

## 0. What was spot-checked (so the reader knows the coverage)

| Check | Method | Result |
|---|---|---|
| Nav tree, 3 languages | parsed `<nav>` of `en.orig`, `nl.orig`, `fr.orig` (labels, hrefs, submenu toggles, nested `<a>`) | matches `chrome.md` §1.3 item-for-item, including NL parent `href="#"`, FR nested anchor to `/en/body-untamed/`, FR "Guide Sainte-Baume" → `/en/guide-sainte-baume/`. **EN submenu "The Eros Sanctuary" → `https://swaanelauwaert.com/en/the-eros-sanctuary-2/`** (relevant to error A1). |
| Page coverage of `mirror/api/pages-p1.json` (35 ids) | listed ids by language prefix; compared with the three inventories | all 35 covered: EN 13 (`pages-en.md` §1), NL 13 (`pages-nl.md` §0.1), FR 9 (`pages-fr.md` §1). No page missing. |
| 8 pages, section lists vs HTML | top-level block dump of `entry-content` for `/en/`, `/nl/`, `/fr/`, `nl/samenwerken`, `nl/the-eros-sanctuary`, `nl/weekendretreat-…-play`, `nl/maria-magdalena-…-2027`, `fr/accompagnement`, `en/cookbook`, `nl/kookboek`, `nl/flavours-of-desire-3`, `fr/le-corps-libre` | block order, headings, images, hrefs match the audits' lists. The only textual slip found is C7 below. |
| 35 button/link hrefs + labels | regex over `.orig` files (count + inner text) | all present with the quoted labels and counts (e.g. `erosnl` ×3, `books2read` ×4 on each cookbook page, `mariamagdalena2027` ×2 on the NL retreat + ×1 on `en/rooted-rituals`, `mailto:info@swaanelauwaert.com` on PLAY, `SUBSTACK` buttons without `href` on all three journals, empty Otter button on `en/cookbook`). |
| 26 image/font paths | `stat` + Pillow on `mirror/raw/…/uploads/sites/50/` | 24 exist with the stated pixel sizes; the 2 misses (`2026/04/8881d238…-150x150.jpg`, 512 px site icon) are the ones the audits already flag as missing. |
| Fonts / colours / sizes / spacing / widths / shadow | grep of `--wp--preset--*`, `@font-face`, `body{…}`, `h1…h6{…}`, button and link rules in `en.html` | byte-for-byte agreement with `design-system.md` §1–§4 and `chrome.md` §6 (base `#fff7e6`, contrast `#191919`, accent-1…6, Literata 300 body, Floreal 400 headings lh 1.02, Beiruti buttons/pullquote, 960/1340 px, spacing 20…80, `natural` shadow). |
| Blog counts | `jq` over `posts-p1..3.json`, `categories-p1.json`, `tags-p1.json` + `find` over `nl/20*` | 210 posts (100+100+10), all `publish`, all `/nl/`, years 2012:22 2013:11 2014:18 2015:15 2016:7 2017:13 2018:124; 76 mirrored post pages (22+6+48); 17 tagged posts; 23 double-categorised; 2 YouTube iframes; 1 closed-comments post; `date==modified` on all; guid hosts 158/52 — all as `blog.md` states. One slip: B1 below. |
| Local renders | viewed `en--mobile.png`, `nl-samenwerken--desktop.png`, `nl-weekendretreat-…--desktop.png`, `fr-accompagnement--desktop.png` | consistent with the audits' render notes (red `#c60000` card, cream "Let's talk!"/"Contactez-moi!" pills, PLAY three cover cards + captions "Moment / Play / Often", ~600 px of empty space on samenwerken). |

---

## A. Concrete errors (file → what it says → what is true)

### A1. `pages-en.md` — current vs old slug of The Eros Sanctuary is reversed (high impact)

* **Says** (§1 inventory row for id 66, §1 hreflang table, §7 intro, §13 item 1): "The HTML served at `/en/the-eros-sanctuary-2/` declares canonical = `https://swaanelauwaert.com/en/body-untamed/`, and the nav links to `/en/body-untamed/`, so `body-untamed` is the current slug … Rebuild: publish at `/en/body-untamed/` and 301 `/en/the-eros-sanctuary-2/` → `/en/body-untamed/`."
* **True**: in the untouched downloads both `mirror/raw/swaanelauwaert.com/en/body-untamed/index.html.orig` and `…/en/the-eros-sanctuary-2/index.html.orig` (byte-identical, md5 `727b33f1…`) carry `<link rel="canonical" href="https://swaanelauwaert.com/en/the-eros-sanctuary-2/">` and `og:url` = the same; the EN nav item in `en.orig` is `href="https://swaanelauwaert.com/en/the-eros-sanctuary-2/"`; the `hreflang="en"` alternates on `nl/the-eros-sanctuary/index.html.orig` and `fr/le-corps-libre/index.html.orig` point to `/en/the-eros-sanctuary-2/`; the REST `link` is `/en/the-eros-sanctuary-2/`. **`body-untamed` is the old slug** (it is only reachable through the malformed nested `<a>` in the FR nav). `chrome.md` §1.3 and `integrations.md` §9.2 have this right; `pages-en.md` contradicts them.
* **Why the audit went wrong**: it read the wget-rewritten `.html` copies. `wget --convert-links` rewrote the URL `/en/the-eros-sanctuary-2/` to the local file `en/body-untamed/index.html` (visible in `en.html`: `href="en/body-untamed/index.html"`). The same artefact affects the retreat pair — `nl.html` rewrites the nav link `…-2027/` to `nl/maria-magdalena-retreat-zuid-frankrijk-2026/index.html` — and there `pages-nl.md` correctly trusted the canonical. Always quote from `.orig`.
* **Fix for the rebuild**: canonical URL `/en/the-eros-sanctuary-2/`; 301 `/en/body-untamed/` → `/en/the-eros-sanctuary-2/`. (See open question Q1 for the residual doubt about what the live server actually does.)

### A2. `pages-fr.md` §1 hreflang table — wrong EN alternate for `/fr/le-corps-libre/`

* **Says**: `/fr/le-corps-libre/` → EN `/en/body-untamed/` "(old URL; mirror shows it is the same page as `/en/the-eros-sanctuary-2/`…)".
* **True**: `fr/le-corps-libre/index.html.orig` has `<link rel="alternate" href="https://swaanelauwaert.com/en/the-eros-sanctuary-2/" hreflang="en">`. Same root cause as A1.

### A3. `chrome.md` §1.5 and §1.8 — the Polylang language switcher does **not** always link to the language home (high impact for the rebuild's i18n switcher)

* **Says** (§1.5): "The links always point to the **language home**, never to the translated counterpart of the current page (the block is in 'home' mode). Translations are only exposed via `<link rel="alternate" hreflang>`." And (§1.8): between home and inner pages "only `aria-current="page"` moves".
* **True** (from the `.orig` files): on `en/about/index.html.orig` the switcher items are `/nl/over-mij/`, `/en/about/` (current), `/fr/a-propos/`; on `en/the-eros-sanctuary-2/` they are `/nl/the-eros-sanctuary/`, `/en/the-eros-sanctuary-2/`, `/fr/le-corps-libre/`; on `fr/livre-de-cuisine/` → `/nl/kookboek/`, `/en/cookbook/`, `/fr/livre-de-cuisine/`; on `nl/journal/` → `/nl/journal/`, `/en/the-journal/`, `/fr/le-journal/`. **Pages without translations list only the current language**: `en/guide-sainte-baume/`, `nl/weekendretreat-…-play/`, every blog post (e.g. `nl/2018/10/17/cent-vingt-deux/`), every tag/category/author archive show a single item (`current-lang`). Only on the three home pages do the links go to `/nl/`, `/en/`, `/fr/`. `pages-en.md` §1 ("it only lists languages that have a translation; on `guide-sainte-baume` it shows English only") and `pages-fr.md` §2.1 ("on subpages the switcher links to the translated page") describe this correctly; `chrome.md` is the one the chrome component will be built from, so it must be corrected.
* **Consequence**: the header component needs per-page translation data (from the hreflang mapping tables in `pages-*.md`) and must collapse the dropdown to a single item on NL-only pages, posts and archives.

### A4. `chrome.md` §3.3 and §5 — the FR "Band B" button is not empty

* **Says** (§3.3): "a centred buttons block whose button is **empty**: `<a … href="https://swaanelauwaert.myflodesk.com/zny46m6oyn" …></a>` (renders as an empty dark pill) … the intended label is presumably 'Oui ! Je veux marcher dans les pas de Marie-Madeleine !'". §5 table repeats "**empty** button → `zny46m6oyn`".
* **True**: `fr.orig` (and `fr.html`) contain `<a class="wp-block-button__link has-text-align-left wp-element-button" href="https://swaanelauwaert.myflodesk.com/zny46m6oyn" target="_blank" rel="noreferrer noopener"><strong>Oui ! Je suis prête à réclamer mon désir le plus sacré !</strong></a>` — a bold label. `pages-fr.md` §3.1 block 28 has it right.

### A5. `chrome.md` §1.5 / §5 and `design-system.md` §7.2 — flag markup is not split by language

* **Says**: "EN and NL pages: base64 PNG 16×11 flags … FR page: newer Polylang markup with SVG flags"; design-system §7.2 "inline base64 PNG on en/nl pages (switcher CSS v3.9.1) and inline SVG on fr pages (CSS v3.9.0)".
* **True**: of the 116 unique `.orig` pages, 61 carry the SVG `pll-switcher-flag` markup and 55 the PNG one, across all three languages — e.g. `en/the-journal`, `en/rooted-rituals`, `nl/sainte-baume-gids`, `nl/category/kortverhaal`, 20+ NL posts use SVG; `en.orig`, `nl.orig`, `en/about` use PNG. It correlates with the page-cache generation (all 41 pages cached by LiteSpeed 7.9.2 on 2026-10-22 have SVG; the 7.9.1 pages are mixed 55 PNG / 20 SVG), not with the language. The recommendation (use the SVG variant) stands; the explanation should be corrected so nobody builds a per-language switcher.

### A6. `blog.md` §1.1 and §1.5 — wrong post named as "the only post without a featured image"

* **Says**: "209 of 210 have `featured_media != 0` … The only post without one: `charlie-de-week-van-swaane` (2015-01-07, id 2087; its `class_list` lacks `has-post-thumbnail`)"; §1.5 "all but the last [charlie-de-week-van-swaane] still have a featured image".
* **True** (`jq 'select(.featured_media==0)'`): the post without a featured image is **`oproep`** ("Oproep! Appel!", id 1273, 2014-01-12, category "On est parti!") — `featured_media: 0`, empty `jetpack_featured_media_url`, no `has-post-thumbnail`. `charlie-de-week-van-swaane` has `featured_media: 2089` → `…/2015/01/10898193_10152703115663843_8732448317403600042_n.jpg` and does carry `has-post-thumbnail`. The 209/210 count is right; the name is wrong (it matters for the journal card grid: `oproep` is the card that needs a placeholder).

### A7. `chrome.md` §1.3 note on EN item 1.2

* **Says**: "wget saved this as `en/body-untamed/`".
* **True**: wget saved both `en/the-eros-sanctuary-2/index.html` and `en/body-untamed/index.html` (identical). Minor, but it feeds the confusion in A1.

### A8. `integrations.md` §4.1 — "Calendly … on 8 pages"

* The table lists 7 pages; `grep -l calendly.com` over `.orig` files gives 8 **files** because `fr.orig` and `fr/index.html.orig` are the same page. 7 pages is correct.

### A9. `integrations.md` §9.2 — "the two files differ by 8 lines (cache timestamp / relative paths)" (Eros pair) and "6 differing lines" (retreat pair)

* The `.orig` files of each pair are byte-identical (same md5, same LiteSpeed timestamp `2026-10-19 04:51:30` / `12:20:51`). Only the wget-rewritten `.html` copies differ (relative paths). Not wrong per se, but the sentence should say the differences are wget artefacts, since it is used as evidence for the redirect verdict.

### A10. `pages-fr.md` §3.1 block 11 — punctuation of the second FR heading

* **Says**: `<strong>2. Retraite Marie-Madeleine dans le Sud de la France 2027</strong> :` → "… 2027 :".
* **True** (`fr.orig`): `<h2 class="wp-block-heading"><strong>2. Retraite Marie-Madeleine dans le Sud de la France 2027</strong>:</h2>` — no space before the colon. Cosmetic, but the audits promised verbatim text.

### A11. `assets.md` §0 item 4 and `chrome.md` §1.5 — "flags are 16×11 PNG data URIs" stated as the only form

* Same as A5: roughly half the pages ship 18×12 SVG data URIs (`<span class="pll-switcher-flag" …><img src="data:image/svg+xml,…">`). Nothing to copy either way, but the sentence is incomplete.

---

## B. Omissions (things the mirror contains that no audit records)

### B1. Media-library attachments that no page uses (`mirror/api/media-p1.json`)

`assets.md` lists the unattached PDFs/MP3s, the Substack SVG and media 5431 (attached to the unknown post 5430), but not the **ordinary images that are attached to public pages yet never referenced** by any `.orig` HTML or any REST `content.rendered`:

| media id | attached to | file (`wp-content/uploads/sites/50/`) |
|---|---|---|
| 5704 | 4505 `nl/samenwerken` | `2026/10/Screenshot-2026-10-09-142737.png` |
| 5576 | 4505 `nl/samenwerken` | `2026/08/WhatsApp-Image-2026-07-22-at-18.45.05.jpeg` |
| 5568 | 74 `/nl/` home | `2026/08/WhatsApp-Image-2026-07-22-at-18.54.25.jpeg` |
| 5518 | 4914 `nl/kookboek` | `2026/08/Screenshot-2026-08-23-202300.jpg` |
| 5496 | 5441 PLAY weekend | `2026/08/decobeeld-voor-op-flowdesk-A-01-01.jpg` |
| 4909 | 4892 `en/cookbook` | `2026/03/b98f34dc0218cb3883ebc95c779e6366-1.jpg` |
| 5182, 5183, 5184, 5188, 5191, 5192, 5193 | 4525 `nl/the-eros-sanctuary` | `2026/04/4e2393ae5131da6865a0a5c17d2fdf83-1.jpg`, `17a28cfaf8cfed7bcacb1b060d4a89d7.jpg`, `7e37b2e492d51e8c015080bc4a95ee46.jpg`, `21f8dcc996060cf1dc5597bccab1c94a.jpg`, `55ad14b81ae117e2c00af73409c2f380.jpg`, `713e954b5668441a7b3de857e75487be.jpg`, `8624ee650dcf03ed0b587960c6dd7aa9.jpg` |

They are in `mirror/media/wp-content/uploads/sites/50/…` (fetched by `fetch-list.sh`). They are either editing leftovers or images that were removed from the pages after upload. The seven Eros images (uploaded in the same batch as the ones on the page) are the most likely to be content the owner still wants somewhere (possibly on the protected module page). The rebuild should not copy them into `public/` blindly, but the owner should be asked (see Q6).

### B2. Password-form markup of the protected pages is only half documented

`integrations.md` §2.3 quotes the FR password form from `mirror/pages.json` but says "the label/button copy was not captured". That is the only source; fine. What no audit states explicitly is the **`<title>` / H1 pattern** the rebuild must reproduce for the gate page: `<title>Flavours of Desire Modules – Swaane Lauwaert</title>` and H1 `Protégé : Flavours of Desire Modules` (FR); the NL/EN prefixes ("Beschermd:", "Protected:") are not in the mirror. Worth one line in the chrome/head conventions.

### B3. The `mirror/screenshots/` files larger than 300 KB were never examined

`blog.md` §0 says the screenshots "were not used". I looked at the two large desktop ones (`swaanelauwaert-com--desktop.png`, `swaanelauwaert-com-nl-flavours-of-desire-3--desktop.png`): the CSS and fonts did load (Floreal title, cream background, grey band, outlined form), but **every content image is broken** and the NL one shows the mobile overlay menu open on a desktop viewport. So they add nothing about lazy images or the Vimeo embed; the audits' decision to ignore them is justified, but it should be stated as a checked fact rather than left implicit — and the six mobile screenshots (> 400 KB, posts + retreat pages) could still be used for layout comparison of the single-post template. Low priority.

### B4. The EN/FR journal pages have `og:type website` and no `meta description` — stated, but the **NL journal's `<title>` for paginated pages** is not

`?query-1-page=N` copies carry the same `<title>The Journal – Swaane Lauwaert</title>` (no "Page N"). The rebuild's paginated routes should keep that (or deliberately add a page number). Not recorded anywhere.

### B5. Alt text on the journal cards is the post title *as rendered*, including trailing periods

`assets.md` §0.3 notes `alt="cent vingt deux."`; `blog.md` §2.1 too. Fine — but nobody notes that this is the **only alt text on the entire site**, which means the rebuild inherits zero alt text for all 88 static-page images and 713 post images. (`pages-en.md` and `pages-fr.md` say it per language; a site-wide statement belongs in `assets.md` §0 — it is there as item 3, so this is merely a cross-reference gap.)

### B6. Flodesk ids reused across languages are listed, but no audit gives the **mapping CTA → Flodesk id → language** as one table

`integrations.md` §3.1 is the closest (by id). For the rebuild's i18n content model a reverse table (per page per language) is in `pages-nl.md` §13.1 and `pages-en.md` §14 but not for FR (FR ids are only in `pages-fr.md` §2.4 as a bare list). Minor.

### B7. `mirror/api/settings.json` (401), `statuses.json`, `taxonomies.json`, `types.json`

Mentioned in `integrations.md`; `types.json` shows `wp_font_face`/`wp_font_family` (the Floreal upload) and `wp_navigation` (the three menus) — the audits derive this from HTML anyway. No gap of substance.

### B8. No audit records the **exact list of 116 unique mirrored HTML pages** (184 files incl. `?query-1-page` variants) as a single checklist

Each audit has its own slice (EN 11 files, FR 8, NL 16 static, 76 posts, 6 archives + variants). A one-page union would make it easier to prove nothing is forgotten. I verified the union against `find`: EN 10 + `en.html`, FR 8, NL 16 (incl. the `-2026` alias and `nl/index.html`), 76 posts, 3 categories, 2 tags, 1 author, `index.html` root = everything is covered by some audit.

---

## C. Minor slips / wording (no rebuild impact, listed for completeness)

1. `pages-en.md` §7 says the two Eros files "differ only in 8 rewritten lines" — true for the `.html` copies, not for `.orig` (identical). Same for `integrations.md` (A9).
2. `chrome.md` §5 table "Cross-language links in nav: EN none" — correct; but the row "Band B: second pullquote (French) + **empty** button" must be corrected (A4).
3. `design-system.md` §1.3 "`font-style:normal;font-weight:700` … 8 (en/nl/fr homes + root + .orig duplicates)" — the count is of files, and FR contributes two h1s per file (duplicate cover); harmless.
4. `blog.md` §2.1 "Mirror files for pages 1–6, 8, 20–24 exist" — confirmed (`index.html?query-1-page={1,2,3,4,5,6,8,20,21,22,23,24}` incl. `&cst` variants). OK.
5. `pages-nl.md` §0.1 row 4728 says the `-2026` alias is "linked from `nl/levende-rituelen`" — confirmed (`href="https://swaanelauwaert.com/nl/maria-magdalena-retreat-zuid-frankrijk-2026/"`). OK.
6. `integrations.md` §8.3 lists the Eros `og:image` as the 150×150 crop "not mirrored" — confirmed missing (`2026/04/8881d238…-150x150.jpg` absent; `-768x1024.jpg` and the 810×1080 original present).
7. `pages-fr.md` A10 colon spacing.
8. `chrome.md` §1.3 NL row 1.3 says "the `-2026` URL is an alias/redirect of unknown type" — fine, but note the `.orig` pair is byte-identical including the cache timestamp, which (as for the Eros pair) suggests one URL was served from the other's cache entry, i.e. a redirect was followed. See Q1.

---

## D. Open questions only the site owner can answer

1. **Which URL does the live server actually answer for the Eros Sanctuary and the Maria Magdalena retreat?** All in-page evidence (canonical, og:url, REST, hreflang, nav) says `/en/the-eros-sanctuary-2/` and `/nl/…-2027/` are current and `/en/body-untamed/`, `/nl/…-2026/` are old slugs. But wget rewrote links *from* the current slugs *to* the old-slug files for both pairs, which is what wget does after following a redirect — i.e. the server may currently 301 `the-eros-sanctuary-2 → body-untamed` and `-2027 → -2026` via the **Redirection** plugin (its rules are not readable without auth). The safe rebuild serves the canonical slugs and redirects the other two, but the owner should confirm there is no deliberate redirect in the other direction and export the Redirection rules.
2. **Content of the five password-protected module pages** (ids 4990, 5101, 5113, 5236, 5247): lesson structure, which of the 19 PDFs / 9 MP3s / 2 images (`2026/05/neijing-tu-…webp`, `Microcosmic_orbite.png`) belong where, the Vimeo/other videos, and how buyers receive the password. Not recoverable from the mirror.
3. **What are the Flodesk pages behind the 14 ids** (newsletter form vs wait-list vs checkout) and the **prices** of Flavours of Desire, The Eros Sanctuary, the PLAY weekend and the Maria Magdalena retreat (only "€75 / 60 min" is on-site).
4. **Contact-form recipient** (`info@swaanelauwaert.com`?) and whether the Dutch success message "Uw bericht is verzonden" on the EN/FR pages should be translated.
5. **Intended targets for dead/odd links**: the `SUBSTACK` buttons (no `href`), the `#` Facebook/Instagram icons on `nl/samenwerken`, the home-page "[Discover 1-op-1 coaching →]" that sends English visitors to `/nl/samenwerken/`, the FR nav "Guide Sainte-Baume" that goes to an English page, and which of the two near-identical EN Sainte-Baume pages (5629 vs 5633) survives.
6. **Unused uploads** (B1): are the seven unreferenced Eros images, the two WhatsApp images, `decobeeld-voor-op-flowdesk…`, the `Screenshot-2026-10-09-142737.png` portrait and media 5431 `the-taste-of-her-journey.jpg` (attached to a post/page not in the public API — draft?) meant to appear anywhere, or can they be dropped?
7. **Untranslated / machine-translation fragments** (Dutch words inside French sentences, English pullquote and contact heading on NL/FR, "Hier is de vertaling in een vloeiende, krachtige Nederlandse spreektaal:" on the NL Eros page, "Ingnite" typo, duplicated FR hero cover): reproduce verbatim or fix?
8. **Stale copy**: FR Flavours/Eros/cookbook still say "coming soon / arrive bientôt"; EN Flavours says the cookbook "is almost here"; keep or update?
9. **Floreal font licence/provenance** and whether a bold/italic cut exists (the site fakes bold on `<strong>` inside Floreal headings).
10. **Site credit bar** "Site by Pharéo | Hosted on The Permanently Moving Network": contractual to keep?
11. **Comments**: keep the 177 recovered comments as static content (only 76 of 210 posts were mirrored; comments on the other 134 are unknown and need a `/wp/v2/comments` export), and should the comment form be dropped or re-wired?
12. **Analytics**: Jetpack Stats (blog 251803763) has no static equivalent — replace with what, and is a consent banner required (none exists today)?
13. **EN/FR journal behaviour**: today they show "Sorry, nothing found yet." / "Désolé, rien n'a été trouve." because all posts are Dutch — keep the empty state, list the Dutch posts, or drop the pages?
14. **Archive filtering**: the live tag/category/author archives list all 210 posts (template bug). Fix it in the rebuild (recommended) or reproduce?
15. **Original (uncropped) hero photo** for the 1280×577 home cover and a larger source for the 342×507 / 496×674 cookbook heroes.

---

## E. Suggested edits, by file

| File | Edit |
|---|---|
| `pages-en.md` | §1 row 66, hreflang table, §7 intro, §13.1: canonical/current = `/en/the-eros-sanctuary-2/`, old = `/en/body-untamed/`; nav → `the-eros-sanctuary-2`; redirect direction reversed. Add a note that `.html` copies are wget-rewritten and must not be used for URL evidence. |
| `pages-fr.md` | §1 hreflang table: EN alternate of `le-corps-libre` = `/en/the-eros-sanctuary-2/`. §3.1 block 11 colon. |
| `chrome.md` | §1.5: switcher links to the translated page; single item on untranslated pages/posts/archives; flag markup varies by cache generation, not language. §1.8: header differs per page in the switcher too. §3.3 and §5: FR band-B button label `Oui ! Je suis prête à réclamer mon désir le plus sacré !`. §1.3 note "wget saved both". |
| `design-system.md` | §7.2 flag markup sentence (A5). |
| `blog.md` | §1.1/§1.5: post without featured image = `oproep` (1273). |
| `integrations.md` | §4.1 "7 pages"; §9.2 wording about identical `.orig` files; add Q1 caveat. |
| `assets.md` | add the unreferenced attachments table (B1); mention SVG flag variant. |
