# Assets audit — swaanelauwaert.com mirror

Audit date: 2026-10-22. Source of truth: the local mirror in this repo only (the live site is not reachable from the audit machine).

- Rendered HTML: `mirror/raw/swaanelauwaert.com/` — every page exists twice: `*.orig` (wget's untouched download, absolute URLs — used for this audit) and the link-converted copy (`en.html`, `<lang>/<slug>/index.html`).
- REST dumps: `mirror/api/pages-p1.json` (35 pages), `mirror/api/posts-p1..3.json` (210 posts), `mirror/api/media-p1.json` (99 most recent attachments only).
- Files: `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/` (999 files, 361 MB, exactly what wget downloaded — **untouched originals**) and `mirror/media/wp-content/uploads/sites/50/` (722 files, 292 MB, fetched by `scripts/mirror/fetch-list.sh` from `mirror/meta/fetch-list.txt`, then **downscaled in place to ≤ 2000 px / JPEG q85 by `scripts/mirror/shrink.mjs`** for every file over 600 KB). Where a file exists in both places, prefer the `mirror/raw` copy: 40 paths exist in both, 28 are byte-identical, 12 differ because the `mirror/media` copy was shrunk (e.g. `2026/02/IMG_4871.jpeg` raw 2048×1536 / 1.81 MB vs media 2000×1500 / 0.87 MB; `2026/08/PLAYbeeld-voor-op-flowdesk.jpg` raw 3.18 MB vs media 0.77 MB).
- Full-page renders of the mirrored HTML used to confirm how images are laid out: `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/local-shots/*--desktop.png` (1440 px) and `*--mobile.png` (390 px).
- Working data behind the tables (JSON, regenerable): `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/audit/` (`extract_assets.py` → `page-assets.json`, `blog_media.py` → `blog-refs.json` + `media-items.json`, `inventory.py` → `inventory.json`, `tables.py`, `assemble.py`).

Path shorthand used below: **`U/`** = `https://swaanelauwaert.com/wp-content/uploads/sites/50/`; **`raw:`** = `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/`; **`media:`** = `mirror/media/wp-content/uploads/sites/50/`.

## 0. Headline findings

1. **Every image the 29 crawled static pages reference exists in the mirror at the exact variant requested** — all `src` URLs and all 289 distinct `srcset` variant URLs resolve to a file under `mirror/raw`. 88 distinct source images are used by static pages. The only misses are three metadata images: the full-size site icon `U/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector.jpg` (512×512, used as `og:image` on the three Journal pages — only the 32/180/192 crops were mirrored), its 270×270 `msapplication-TileImage` crop, and five `-150x150` thumbnails listed as extra `og:image` tags on the two Eros Sanctuary pages (originals present).
2. **Six of the 35 REST pages have no mirrored HTML and no REST body**: five password-protected course pages (`/en/flavours-of-desire-modules-english/`, `/en/module-1/`, `/fr/flavours-of-desire-2/modules/`, `/nl/flavours-of-desire-3/modules/`, `/nl/the-eros-sanctuary-modules/`) and the empty published page `/en/werk-met-mij/`. Their assets can only be inferred from the media library's `post` attachment field (section 4).
3. **Static pages carry no `alt` text at all** except the nine post cards on `/nl/journal/` (alt = post title, e.g. `cent vingt deux.`). The media library has `alt_text` empty for all 99 recent attachments. The rebuild must write alt text from scratch.
4. **The site has no logo image.** The header and footer brand is the text `Swaane Lauwaert` (`wp-block-site-title`, Floreal, uppercase). Favicon/site icon is a pomegranate JPEG. Social icons (Instagram, Facebook) are inline SVGs from the core Social Links block; the Polylang language switcher flags are 16×11 PNG **data URIs** inlined in the HTML — no files to copy.
5. **Documents and audio**: 19 PDFs (workbooks, e-books, quiz, shopping list) and 9 MP3s (Flavours of Desire audio modules) live in `mirror/media/.../2026/03|05|06/`. None is linked from any crawled page or REST body — they belong to the password-protected module pages. One `.mov` promo film (`U/2018/01/Actually.mov`) is linked from the 2017 post `kickstarter` and returns 404 on the origin.
6. **Blog**: 210 Dutch posts reference 2,027 distinct upload URLs = 863 distinct originals (plus 4 Facebook-CDN hot-linked images and 2 YouTube iframes). 787 originals are present, 66 are present only as resized variants (`-WxH`/`-scaled`), 11 are missing on the origin too (404 in `mirror/meta/fetch-failed.txt`). 209/210 posts have a featured image.
7. **Oversized files**: 61 images > 1.5 MB (largest: `2026/02/DSCF0871.jpg` 4000×3000, 7.75 MB — a gallery image on the Maria Magdalena retreat page) plus 16 PDFs/MP3s > 1.5 MB. For every big 2026 photo WordPress already produced a `-scaled` 2560 px copy (0.4–1.5 MB) and 1024/768 variants; the big originals are never requested by the HTML except through `srcset` on the retreat gallery.
8. **Only two images are true full-bleed heroes**: the home-page parallax pomegranate (`U/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg`, 1280×577 — rendered ~1440×730 on desktop, so it is already upscaled; no larger source exists in the mirror) and the Work-with-me portrait (`U/2026/08/DSC03534.jpg`, 2560×1707) used on the EN/FR/NL coaching pages. Everything else that WordPress marks as a "cover" is an image card ≤ 736 px wide.

## 1. Image and file references per page

Scope: the 35 pages in `mirror/api/pages-p1.json` (3 of them are the language home pages: id 44 `/en/`, 74 `/nl/`, 76 `/fr/`). Sources merged per page: `<img src/srcset>` (with block context → role), inline `style="background-image:url()"`, `<a href>` to files, `<video>/<audio>/<iframe>` and `og:image`/icon `<link>` tags from the `.orig` HTML, plus the same extraction over `content.rendered` from the REST dump (identical results; the REST copy adds nothing that the HTML lacks and vice-versa — except the `featured_media` id, listed separately). Duplicate HTML/REST hits are collapsed.

Role vocabulary: **hero (full-width cover)** = `wp-block-cover.alignfull` with an image; **background-image (inline style)** = cover block rendered with `has-parallax` (image is a CSS background, not an `<img>`); **cover card** = `wp-block-cover` without `alignfull` (image card inside columns, ≤ 736 px); **inline** = `wp-block-image`; **inline (media-text)** = `wp-block-media-text`; **gallery** = `wp-block-gallery`; **featured** = `wp-block-post-featured-image` (page featured image or post card in a query loop); **inline (other)** = `<img>` without a recognised block wrapper (on `/nl/kookboek/` these are images placed directly in column blocks).

Shared on **every** page and not repeated in the per-page tables: the favicon set (section 3), the Floreal `@font-face` (`U/fonts/floreal.woff`, 31 KB, inlined in the global `<style>`), 2–5 language-flag PNG data URIs, the inline social-link SVGs, the Jetpack form file-upload icon SVG and the submenu chevron SVGs.

Pixel dimensions were read with Pillow from the local file in the "local path" column; "original" in the notes column is the full-size file the `-WxH` variant derives from.


#### /en/ — Swaane Lauwaert

Mirror HTML: `mirror/raw/swaanelauwaert.com/en.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | background-image (inline style) | `U/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | `raw:2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | yes | 1280x577 | 154 KB | "" |  |
| 2 | inline | `U/2026/08/MVIMG_20260817_163022_1-768x1024.jpg` | `raw:2026/08/MVIMG_20260817_163022_1-768x1024.jpg` | yes | 768x1024 | 185 KB | "" | srcset: 768w 225w 1152w 1536w 1920w; sizes=`(max-width: 768px) 100vw, 768px`; fetchpriority=high |
| 3 | inline | `U/2026/08/IMG-20260404-WA0004.jpg` | `raw:2026/08/IMG-20260404-WA0004.jpg` | yes | 539x719 | 105 KB | "" | srcset: 539w 225w; sizes=`(max-width: 539px) 100vw, 539px` |
| 4 | inline | `U/2026/08/IMG_5348-768x1024.jpeg` | `raw:2026/08/IMG_5348-768x1024.jpeg` | yes | 768x1024 | 115 KB | "" | srcset: 768w 225w 1152w 1536w; sizes=`(max-width: 768px) 100vw, 768px`; original `IMG_5348.jpeg` 1536x2048 721 KB |
| 5 | inline | `U/2026/08/MVIMG_20260817_163746-EDIT-893x1024.jpg` | `raw:2026/08/MVIMG_20260817_163746-EDIT-893x1024.jpg` | yes | 893x1024 | 131 KB | "" | srcset: 893w 262w 768w 1340w 1787w; sizes=`auto, (max-width: 893px) 100vw, 893px`; loading=lazy |

#### /en/about/ — About me

Mirror HTML: `mirror/raw/swaanelauwaert.com/en/about/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | featured | `U/2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg.webp` | `raw:2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg.webp` | yes | 957x960 | 16 KB | "" | srcset: 957w 150w 300w 768w; sizes=`(max-width: 957px) 100vw, 957px`; fetchpriority=high |

#### /en/cookbook/ — Cookbook: The Taste of Her Journey

Mirror HTML: `mirror/raw/swaanelauwaert.com/en/cookbook/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | background-image (inline style) | `U/2026/08/Screenshot-2026-08-23-201541.jpg` | `raw:2026/08/Screenshot-2026-08-23-201541.jpg` | yes | 342x507 | 71 KB | "" |  |
| 2 | inline | `U/2026/08/MVIMG_20260817_163817_1-768x1024.jpg` | `raw:2026/08/MVIMG_20260817_163817_1-768x1024.jpg` | yes | 768x1024 | 136 KB | "" | srcset: 768w 225w 1152w 1536w 1920w; sizes=`(max-width: 768px) 100vw, 768px`; fetchpriority=high |
| 3 | inline | `U/2026/08/Photo-43-EDIT-768x1024.jpg` | `raw:2026/08/Photo-43-EDIT-768x1024.jpg` | yes | 768x1024 | 176 KB | "" | srcset: 768w 225w 1152w 1536w 1920w; sizes=`(max-width: 768px) 100vw, 768px` |
| 4 | inline | `U/2026/08/Screenshot-2026-08-23-201541.jpg` | `raw:2026/08/Screenshot-2026-08-23-201541.jpg` | yes | 342x507 | 71 KB | "" | srcset: 342w 202w; sizes=`(max-width: 342px) 100vw, 342px` |

#### /en/flavours-of-desire/ — Flavours of Desire

Mirror HTML: `mirror/raw/swaanelauwaert.com/en/flavours-of-desire/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | inline (media-text) | `U/2026/02/a4a043d325ecfae0844bcce21546e339.jpg` | `raw:2026/02/a4a043d325ecfae0844bcce21546e339.jpg` | yes | 736x736 | 70 KB | "" | srcset: 736w 150w 300w; sizes=`(max-width: 736px) 100vw, 736px`; fetchpriority=high |
| 2 | inline | `U/2026/01/7e913d8245b765d0f1ef82803d7c2f7e.jpg` | `raw:2026/01/7e913d8245b765d0f1ef82803d7c2f7e.jpg` | yes | 577x866 | 107 KB | "" | srcset: 577w 200w; sizes=`(max-width: 577px) 100vw, 577px` |
| 3 | inline (media-text) | `U/2026/02/b69a7dfbf5eaad18b7b69648d56c9c49.jpg` | `raw:2026/02/b69a7dfbf5eaad18b7b69648d56c9c49.jpg` | yes | 800x800 | 62 KB | "" | srcset: 800w 150w 300w 768w; sizes=`(max-width: 800px) 100vw, 800px` |
| 4 | cover card (image card in cover block) | `U/2026/01/7c754abd9bc7f6a913a765577b33dea2.jpg` | `raw:2026/01/7c754abd9bc7f6a913a765577b33dea2.jpg` | yes | 736x863 | 123 KB | "" | srcset: 736w 256w; sizes=`auto, (max-width: 736px) 100vw, 736px`; loading=lazy |
| 5 | cover card (image card in cover block) | `U/2026/01/2211d321fe9f6f2c415cafa5ab80fcc2.jpg` | `raw:2026/01/2211d321fe9f6f2c415cafa5ab80fcc2.jpg` | yes | 736x975 | 95 KB | "" | srcset: 736w 226w; sizes=`auto, (max-width: 736px) 100vw, 736px`; loading=lazy |
| 6 | cover card (image card in cover block) | `U/2026/01/bb3e19bbdc0e7db827b33c44fc650fdb-1.jpg` | `raw:2026/01/bb3e19bbdc0e7db827b33c44fc650fdb-1.jpg` | yes | 700x875 | 66 KB | "" | srcset: 700w 240w; sizes=`auto, (max-width: 700px) 100vw, 700px`; loading=lazy |

#### /en/guide-sainte-baume/ — Guide Sainte-Baume

Mirror HTML: `mirror/raw/swaanelauwaert.com/en/guide-sainte-baume/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | inline | `U/2026/08/IMG_20260812_200654-768x1024.jpg` | `raw:2026/08/IMG_20260812_200654-768x1024.jpg` | yes | 768x1024 | 174 KB | "" | srcset: 768w 225w 1152w 1536w 1920w; sizes=`(max-width: 768px) 100vw, 768px`; fetchpriority=high |

#### /en/rooted-rituals/ — Rooted Rituals \| Ceremonies & Retreats

Mirror HTML: `mirror/raw/swaanelauwaert.com/en/rooted-rituals/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | inline | `U/2026/02/5eaaabe9572dec3fc263928e634ab651-1024x968.jpg` | `raw:2026/02/5eaaabe9572dec3fc263928e634ab651-1024x968.jpg` | yes | 1024x968 | 148 KB | "" | srcset: 1024w 300w 768w 1199w; sizes=`(max-width: 1024px) 100vw, 1024px`; fetchpriority=high; original `5eaaabe9572dec3fc263928e634ab651.jpg` 1199x1134 212 KB |
| 2 | inline | `U/2026/02/7d90fcb7bef2e3cc0b08a81a8c2a8586.jpg` | `raw:2026/02/7d90fcb7bef2e3cc0b08a81a8c2a8586.jpg` | yes | 1199x902 | 170 KB | "" | srcset: 1199w 300w 768w 1024w; sizes=`(max-width: 1199px) 100vw, 1199px` |
| 3 | inline | `U/2026/01/unnamed.jpg` | `raw:2026/01/unnamed.jpg` | yes | 1200x891 | 86 KB | "" | srcset: 1200w 300w 768w 1024w; sizes=`(max-width: 1200px) 100vw, 1200px` |
| 4 | inline | `U/2026/01/bd7ca64901bddc5947b049725270689a-2.jpg` | `raw:2026/01/bd7ca64901bddc5947b049725270689a-2.jpg` | yes | 736x1308 | 106 KB | "" | srcset: 736w 169w 576w; sizes=`auto, (max-width: 736px) 100vw, 736px`; loading=lazy |
| 5 | inline | `U/2026/02/b264d97a335da7040c2173b983aa28bf.jpg` | `raw:2026/02/b264d97a335da7040c2173b983aa28bf.jpg` | yes | 683x1024 | 96 KB | "" | srcset: 683w 200w; sizes=`auto, (max-width: 683px) 100vw, 683px`; loading=lazy |
| 6 | inline | `U/2026/02/f2bf95b8eddfc091bb56604ab4d4d48d.jpg` | `raw:2026/02/f2bf95b8eddfc091bb56604ab4d4d48d.jpg` | yes | 1200x1194 | 161 KB | "" | srcset: 1200w 150w 300w 768w 1024w; sizes=`auto, (max-width: 1200px) 100vw, 1200px`; loading=lazy |
| 7 | inline | `U/2026/02/b40ec7271d9a610c1298162dd93302b2.jpg` | `raw:2026/02/b40ec7271d9a610c1298162dd93302b2.jpg` | yes | 801x1200 | 81 KB | "" | srcset: 801w 200w 768w 684w; sizes=`auto, (max-width: 801px) 100vw, 801px`; loading=lazy |

#### /en/sainte-baume-guide/ — Sainte-Baume Guide

Mirror HTML: `mirror/raw/swaanelauwaert.com/en/sainte-baume-guide/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | inline | `U/2026/08/IMG_20260812_200654-768x1024.jpg` | `raw:2026/08/IMG_20260812_200654-768x1024.jpg` | yes | 768x1024 | 174 KB | "" | srcset: 768w 225w 1152w 1536w 1920w; sizes=`(max-width: 768px) 100vw, 768px`; fetchpriority=high |

#### /en/the-eros-sanctuary-2/ — The Eros Sanctuary

Mirror HTML: `mirror/raw/swaanelauwaert.com/en/the-eros-sanctuary-2/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | inline | `U/2026/04/0e9a4aa194478ed4c418f7fa9463bea9.jpg` | `raw:2026/04/0e9a4aa194478ed4c418f7fa9463bea9.jpg` | yes | 400x534 | 33 KB | "" | srcset: 400w 225w; sizes=`(max-width: 400px) 100vw, 400px`; fetchpriority=high |
| 2 | inline | `U/2026/04/30e0d24c3b2ebaf63a21f5c7f874a14d.jpg` | `raw:2026/04/30e0d24c3b2ebaf63a21f5c7f874a14d.jpg` | yes | 640x640 | 84 KB | "" | srcset: 640w 300w 150w; sizes=`(max-width: 640px) 100vw, 640px` |
| 3 | inline | `U/2026/04/af472e9b5594e4b72110cae15f9792dc.jpg` | `raw:2026/04/af472e9b5594e4b72110cae15f9792dc.jpg` | yes | 422x586 | 51 KB | "" | srcset: 422w 216w; sizes=`(max-width: 422px) 100vw, 422px` |
| 4 | inline | `U/2026/04/4e2393ae5131da6865a0a5c17d2fdf83.jpg` | `raw:2026/04/4e2393ae5131da6865a0a5c17d2fdf83.jpg` | yes | 720x900 | 27 KB | "" | srcset: 720w 240w; sizes=`auto, (max-width: 720px) 100vw, 720px`; loading=lazy |
| 5 | inline (media-text) | `U/2026/02/59653540d6bf783e7fb741cc68cf58bb-819x1024.jpg` | `raw:2026/02/59653540d6bf783e7fb741cc68cf58bb-819x1024.jpg` | yes | 819x1024 | 126 KB | "" | srcset: 819w 240w 768w 1200w; sizes=`auto, (max-width: 819px) 100vw, 819px`; loading=lazy; original `59653540d6bf783e7fb741cc68cf58bb.jpg` 1200x1500 217 KB |
| 6 | inline | `U/2026/04/8881d238fd5f3310b8212df33597bd3d-768x1024.jpg` | `raw:2026/04/8881d238fd5f3310b8212df33597bd3d-768x1024.jpg` | yes | 768x1024 | 44 KB | "" | srcset: 768w 225w 810w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy; original `8881d238fd5f3310b8212df33597bd3d.jpg` 810x1080 50 KB |
| 7 | inline | `U/2026/04/31151a884fbb0603dff8df2a67b2bc02-822x1024.jpg` | `raw:2026/04/31151a884fbb0603dff8df2a67b2bc02-822x1024.jpg` | yes | 822x1024 | 58 KB | "" | srcset: 822w 241w 768w 1080w; sizes=`auto, (max-width: 822px) 100vw, 822px`; loading=lazy; original `31151a884fbb0603dff8df2a67b2bc02.jpg` 1080x1346 84 KB |
| 8 | inline | `U/2026/04/327d1cd8b43e66b8535f50d749193206.jpg` | `raw:2026/04/327d1cd8b43e66b8535f50d749193206.jpg` | yes | 736x867 | 27 KB | "" | srcset: 736w 255w; sizes=`auto, (max-width: 736px) 100vw, 736px`; loading=lazy |

#### /en/the-journal/ — The Journal

Mirror HTML: `mirror/raw/swaanelauwaert.com/en/the-journal/index.html.orig`

_No images or file links in the main content (only the shared chrome: favicon set, Floreal @font-face, inline language-flag data-URIs, inline social SVGs)._


#### /en/work-with-me/ — Work With Me: 1:1 Somatic Coaching & Bodywork

Mirror HTML: `mirror/raw/swaanelauwaert.com/en/work-with-me/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | hero (full-width cover) | `U/2026/08/DSC03534-1024x683.jpg` | `raw:2026/08/DSC03534-1024x683.jpg` | yes | 1024x683 | 111 KB | "" | srcset: 1024w 300w 768w 1536w 2048w; sizes=`(max-width: 1024px) 100vw, 1024px`; fetchpriority=high |
| 2 | inline | `U/2026/10/Screenshot-2026-10-10-105756.png` | `raw:2026/10/Screenshot-2026-10-10-105756.png` | yes | 515x659 | 302 KB | "" | srcset: 515w 234w; sizes=`(max-width: 515px) 100vw, 515px` |

#### /fr/ — Swaane Lauwaert

Mirror HTML: `mirror/raw/swaanelauwaert.com/fr.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | background-image (inline style) | `U/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | `raw:2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | yes | 1280x577 | 154 KB | "" |  |
| 2 | inline | `U/2026/08/MVIMG_20260817_163022_1-768x1024.jpg` | `raw:2026/08/MVIMG_20260817_163022_1-768x1024.jpg` | yes | 768x1024 | 185 KB | "" | srcset: 768w 225w 1152w 1536w 1920w; sizes=`(max-width: 768px) 100vw, 768px`; fetchpriority=high |
| 3 | inline | `U/2026/08/IMG-20260404-WA0004.jpg` | `raw:2026/08/IMG-20260404-WA0004.jpg` | yes | 539x719 | 105 KB | "" | srcset: 539w 225w; sizes=`(max-width: 539px) 100vw, 539px` |
| 4 | inline | `U/2026/08/IMG_5348-768x1024.jpeg` | `raw:2026/08/IMG_5348-768x1024.jpeg` | yes | 768x1024 | 115 KB | "" | srcset: 768w 225w 1152w 1536w; sizes=`(max-width: 768px) 100vw, 768px`; original `IMG_5348.jpeg` 1536x2048 721 KB |
| 5 | inline | `U/2026/08/MVIMG_20260817_163746-EDIT-893x1024.jpg` | `raw:2026/08/MVIMG_20260817_163746-EDIT-893x1024.jpg` | yes | 893x1024 | 131 KB | "" | srcset: 893w 262w 768w 1340w 1787w; sizes=`auto, (max-width: 893px) 100vw, 893px`; loading=lazy |

#### /fr/a-propos/ — À propos

Mirror HTML: `mirror/raw/swaanelauwaert.com/fr/a-propos/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | featured | `U/2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` | `raw:2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` | yes | 957x960 | 24 KB | "" | srcset: 957w 150w 300w 768w; sizes=`(max-width: 957px) 100vw, 957px`; fetchpriority=high |

#### /fr/accompagnement/ — Accompagnement 1:1 — Coaching Somatique & Travail Corporel

Mirror HTML: `mirror/raw/swaanelauwaert.com/fr/accompagnement/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | hero (full-width cover) | `U/2026/08/DSC03534-1024x683.jpg` | `raw:2026/08/DSC03534-1024x683.jpg` | yes | 1024x683 | 111 KB | "" | srcset: 1024w 300w 768w 1536w 2048w; sizes=`(max-width: 1024px) 100vw, 1024px`; fetchpriority=high |
| 2 | inline | `U/2026/10/Screenshot-2026-10-10-105756.png` | `raw:2026/10/Screenshot-2026-10-10-105756.png` | yes | 515x659 | 302 KB | "" | srcset: 515w 234w; sizes=`(max-width: 515px) 100vw, 515px` |

#### /fr/flavours-of-desire-2/ — Flavours of Desire

Mirror HTML: `mirror/raw/swaanelauwaert.com/fr/flavours-of-desire-2/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | inline (media-text) | `U/2026/02/a4a043d325ecfae0844bcce21546e339.jpg` | `raw:2026/02/a4a043d325ecfae0844bcce21546e339.jpg` | yes | 736x736 | 70 KB | "" | srcset: 736w 150w 300w; sizes=`(max-width: 736px) 100vw, 736px`; fetchpriority=high |
| 2 | inline | `U/2026/01/7e913d8245b765d0f1ef82803d7c2f7e.jpg` | `raw:2026/01/7e913d8245b765d0f1ef82803d7c2f7e.jpg` | yes | 577x866 | 107 KB | "" | srcset: 577w 200w; sizes=`(max-width: 577px) 100vw, 577px` |
| 3 | inline (media-text) | `U/2026/02/b69a7dfbf5eaad18b7b69648d56c9c49.jpg` | `raw:2026/02/b69a7dfbf5eaad18b7b69648d56c9c49.jpg` | yes | 800x800 | 62 KB | "" | srcset: 800w 150w 300w 768w; sizes=`(max-width: 800px) 100vw, 800px` |
| 4 | cover card (image card in cover block) | `U/2026/01/7c754abd9bc7f6a913a765577b33dea2.jpg` | `raw:2026/01/7c754abd9bc7f6a913a765577b33dea2.jpg` | yes | 736x863 | 123 KB | "" | srcset: 736w 256w; sizes=`auto, (max-width: 736px) 100vw, 736px`; loading=lazy |
| 5 | cover card (image card in cover block) | `U/2026/01/2211d321fe9f6f2c415cafa5ab80fcc2.jpg` | `raw:2026/01/2211d321fe9f6f2c415cafa5ab80fcc2.jpg` | yes | 736x975 | 95 KB | "" | srcset: 736w 226w; sizes=`auto, (max-width: 736px) 100vw, 736px`; loading=lazy |
| 6 | cover card (image card in cover block) | `U/2026/01/bb3e19bbdc0e7db827b33c44fc650fdb-1.jpg` | `raw:2026/01/bb3e19bbdc0e7db827b33c44fc650fdb-1.jpg` | yes | 700x875 | 66 KB | "" | srcset: 700w 240w; sizes=`auto, (max-width: 700px) 100vw, 700px`; loading=lazy |

#### /fr/le-corps-libre/ — The Eros Sanctuary

Mirror HTML: `mirror/raw/swaanelauwaert.com/fr/le-corps-libre/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | inline | `U/2026/01/9d110192f5f3236a1cb2cf7d956f15b0.jpg` | `raw:2026/01/9d110192f5f3236a1cb2cf7d956f15b0.jpg` | yes | 736x1104 | 44 KB | "" | srcset: 736w 200w 683w; sizes=`(max-width: 736px) 100vw, 736px`; fetchpriority=high |
| 2 | inline (media-text) | `U/2026/02/59653540d6bf783e7fb741cc68cf58bb-819x1024.jpg` | `raw:2026/02/59653540d6bf783e7fb741cc68cf58bb-819x1024.jpg` | yes | 819x1024 | 126 KB | "" | srcset: 819w 240w 768w 1200w; sizes=`(max-width: 819px) 100vw, 819px`; original `59653540d6bf783e7fb741cc68cf58bb.jpg` 1200x1500 217 KB |

#### /fr/le-journal/ — Le Journal

Mirror HTML: `mirror/raw/swaanelauwaert.com/fr/le-journal/index.html.orig`

_No images or file links in the main content (only the shared chrome: favicon set, Floreal @font-face, inline language-flag data-URIs, inline social SVGs)._


#### /fr/livre-de-cuisine/ — Livre de Cuisine: The Taste of Her Journey

Mirror HTML: `mirror/raw/swaanelauwaert.com/fr/livre-de-cuisine/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | background-image (inline style) | `U/2026/08/Screenshot-2026-08-23-201541.jpg` | `raw:2026/08/Screenshot-2026-08-23-201541.jpg` | yes | 342x507 | 71 KB | "" |  |
| 2 | inline | `U/2026/08/MVIMG_20260817_163817_1-768x1024.jpg` | `raw:2026/08/MVIMG_20260817_163817_1-768x1024.jpg` | yes | 768x1024 | 136 KB | "" | srcset: 768w 225w 1152w 1536w 1920w; sizes=`(max-width: 768px) 100vw, 768px`; fetchpriority=high |
| 3 | inline | `U/2026/08/Photo-43-EDIT-768x1024.jpg` | `raw:2026/08/Photo-43-EDIT-768x1024.jpg` | yes | 768x1024 | 176 KB | "" | srcset: 768w 225w 1152w 1536w 1920w; sizes=`(max-width: 768px) 100vw, 768px` |
| 4 | inline | `U/2026/08/Screenshot-2026-08-23-201541.jpg` | `raw:2026/08/Screenshot-2026-08-23-201541.jpg` | yes | 342x507 | 71 KB | "" | srcset: 342w 202w; sizes=`(max-width: 342px) 100vw, 342px` |

#### /fr/rituels-dancrage/ — Retraites \| Cérémonies & Retraites

Mirror HTML: `mirror/raw/swaanelauwaert.com/fr/rituels-dancrage/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | inline | `U/2026/02/5eaaabe9572dec3fc263928e634ab651-1024x968.jpg` | `raw:2026/02/5eaaabe9572dec3fc263928e634ab651-1024x968.jpg` | yes | 1024x968 | 148 KB | "" | srcset: 1024w 300w 768w 1199w; sizes=`(max-width: 1024px) 100vw, 1024px`; fetchpriority=high; original `5eaaabe9572dec3fc263928e634ab651.jpg` 1199x1134 212 KB |
| 2 | inline | `U/2026/02/7d90fcb7bef2e3cc0b08a81a8c2a8586.jpg` | `raw:2026/02/7d90fcb7bef2e3cc0b08a81a8c2a8586.jpg` | yes | 1199x902 | 170 KB | "" | srcset: 1199w 300w 768w 1024w; sizes=`(max-width: 1199px) 100vw, 1199px` |
| 3 | inline | `U/2026/01/unnamed.jpg` | `raw:2026/01/unnamed.jpg` | yes | 1200x891 | 86 KB | "" | srcset: 1200w 300w 768w 1024w; sizes=`(max-width: 1200px) 100vw, 1200px` |
| 4 | inline | `U/2026/01/bd7ca64901bddc5947b049725270689a-2.jpg` | `raw:2026/01/bd7ca64901bddc5947b049725270689a-2.jpg` | yes | 736x1308 | 106 KB | "" | srcset: 736w 169w 576w; sizes=`auto, (max-width: 736px) 100vw, 736px`; loading=lazy |
| 5 | inline | `U/2026/02/b264d97a335da7040c2173b983aa28bf.jpg` | `raw:2026/02/b264d97a335da7040c2173b983aa28bf.jpg` | yes | 683x1024 | 96 KB | "" | srcset: 683w 200w; sizes=`auto, (max-width: 683px) 100vw, 683px`; loading=lazy |
| 6 | inline | `U/2026/02/f2bf95b8eddfc091bb56604ab4d4d48d.jpg` | `raw:2026/02/f2bf95b8eddfc091bb56604ab4d4d48d.jpg` | yes | 1200x1194 | 161 KB | "" | srcset: 1200w 150w 300w 768w 1024w; sizes=`auto, (max-width: 1200px) 100vw, 1200px`; loading=lazy |
| 7 | inline | `U/2026/02/b40ec7271d9a610c1298162dd93302b2.jpg` | `raw:2026/02/b40ec7271d9a610c1298162dd93302b2.jpg` | yes | 801x1200 | 81 KB | "" | srcset: 801w 200w 768w 684w; sizes=`auto, (max-width: 801px) 100vw, 801px`; loading=lazy |

#### /nl/ — Swaane Lauwaert

Mirror HTML: `mirror/raw/swaanelauwaert.com/nl.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | background-image (inline style) | `U/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | `raw:2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | yes | 1280x577 | 154 KB | "" |  |
| 2 | inline | `U/2026/08/MVIMG_20260817_163022_1-768x1024.jpg` | `raw:2026/08/MVIMG_20260817_163022_1-768x1024.jpg` | yes | 768x1024 | 185 KB | "" | srcset: 768w 225w 1152w 1536w 1920w; sizes=`(max-width: 768px) 100vw, 768px`; fetchpriority=high |
| 3 | inline | `U/2026/08/IMG-20260404-WA0004.jpg` | `raw:2026/08/IMG-20260404-WA0004.jpg` | yes | 539x719 | 105 KB | "" | srcset: 539w 225w; sizes=`(max-width: 539px) 100vw, 539px` |
| 4 | inline | `U/2026/08/IMG_5348-768x1024.jpeg` | `raw:2026/08/IMG_5348-768x1024.jpeg` | yes | 768x1024 | 115 KB | "" | srcset: 768w 225w 1152w 1536w; sizes=`(max-width: 768px) 100vw, 768px`; original `IMG_5348.jpeg` 1536x2048 721 KB |
| 5 | inline | `U/2026/08/MVIMG_20260817_163817_1-768x1024.jpg` | `raw:2026/08/MVIMG_20260817_163817_1-768x1024.jpg` | yes | 768x1024 | 136 KB | "" | srcset: 768w 225w 1152w 1536w 1920w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy |

#### /nl/flavours-of-desire-3/ — Flavours of Desire: mini online course at your own pace

Mirror HTML: `mirror/raw/swaanelauwaert.com/nl/flavours-of-desire-3/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | inline (media-text) | `U/2026/02/a4a043d325ecfae0844bcce21546e339.jpg` | `raw:2026/02/a4a043d325ecfae0844bcce21546e339.jpg` | yes | 736x736 | 70 KB | "" | srcset: 736w 150w 300w; sizes=`(max-width: 736px) 100vw, 736px`; fetchpriority=high |
| 2 | inline | `U/2026/01/7e913d8245b765d0f1ef82803d7c2f7e.jpg` | `raw:2026/01/7e913d8245b765d0f1ef82803d7c2f7e.jpg` | yes | 577x866 | 107 KB | "" | srcset: 577w 200w; sizes=`(max-width: 577px) 100vw, 577px` |
| 3 | cover card (image card in cover block) | `U/2026/01/7c754abd9bc7f6a913a765577b33dea2.jpg` | `raw:2026/01/7c754abd9bc7f6a913a765577b33dea2.jpg` | yes | 736x863 | 123 KB | "" | srcset: 736w 256w; sizes=`auto, (max-width: 736px) 100vw, 736px`; loading=lazy |
| 4 | cover card (image card in cover block) | `U/2026/01/2211d321fe9f6f2c415cafa5ab80fcc2.jpg` | `raw:2026/01/2211d321fe9f6f2c415cafa5ab80fcc2.jpg` | yes | 736x975 | 95 KB | "" | srcset: 736w 226w; sizes=`auto, (max-width: 736px) 100vw, 736px`; loading=lazy |
| 5 | cover card (image card in cover block) | `U/2026/01/bb3e19bbdc0e7db827b33c44fc650fdb-1.jpg` | `raw:2026/01/bb3e19bbdc0e7db827b33c44fc650fdb-1.jpg` | yes | 700x875 | 66 KB | "" | srcset: 700w 240w; sizes=`auto, (max-width: 700px) 100vw, 700px`; loading=lazy |
| 6 | iframe | `https://player.vimeo.com/video/1177988427?dnt=1&app_id=122963` | `` | external |  |  | 'INTRO Flavours of Desire NL' | external:player.vimeo.com |

#### /nl/journal/ — The Journal

Mirror HTML: `mirror/raw/swaanelauwaert.com/nl/journal/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | featured | `U/2018/10/44175512_10157880861444832_997186630404014080_o.jpg` | `raw:2018/10/44175512_10157880861444832_997186630404014080_o.jpg` | yes | 1707x2048 | 223 KB | 'cent vingt deux.' | srcset: 1707w 250w 768w 854w 1280w; sizes=`auto, (max-width: 1707px) 100vw, 1707px`; loading=lazy; linked to /nl/2018/10/17/cent-vingt-deux/ |
| 2 | featured | `U/2018/10/20181006_213843-D-scaled.jpg` | `raw:2018/10/20181006_213843-D-scaled.jpg` | yes | 1440x2560 | 372 KB | 'cent vingt et un.' | srcset: 1440w 169w 768w 576w 864w 1152w; sizes=`auto, (max-width: 1440px) 100vw, 1440px`; loading=lazy; linked to /nl/2018/10/10/cent-vingt-et-un/ |
| 3 | featured | `U/2018/10/Instant_20181007_103126.jpeg` | `raw:2018/10/Instant_20181007_103126.jpeg` | yes | 2000x2400 | 140 KB | 'cent vingt.' | srcset: 2000w 250w 768w 853w 1280w 1707w; sizes=`auto, (max-width: 2000px) 100vw, 2000px`; loading=lazy; linked to /nl/2018/10/09/cent-vingt/ |
| 4 | featured | `U/2018/10/IMG_20181006_175859-B-scaled.jpg` | `raw:2018/10/IMG_20181006_175859-B-scaled.jpg` | yes | 2560x1920 | 518 KB | 'cent dix neuf.' | srcset: 2560w 300w 768w 1024w 1536w 2048w; sizes=`auto, (max-width: 2560px) 100vw, 2560px`; loading=lazy; linked to /nl/2018/10/08/cent-dix-neuf/ |
| 5 | featured | `U/2018/10/Ventemiglia-B.jpg` | `raw:2018/10/Ventemiglia-B.jpg` | yes | 1896x1067 | 220 KB | 'cent dix huit.' | srcset: 1896w 300w 768w 1024w 1536w; sizes=`auto, (max-width: 1896px) 100vw, 1896px`; loading=lazy; linked to /nl/2018/10/07/cent-dix-huit/ |
| 6 | featured | `U/2018/09/20180930_1403500-B-scaled.jpg` | `raw:2018/09/20180930_1403500-B-scaled.jpg` | yes | 2560x1440 | 481 KB | 'cent dix sept.' | srcset: 2560w 300w 768w 1024w 1536w 2048w; sizes=`auto, (max-width: 2560px) 100vw, 2560px`; loading=lazy; linked to /nl/2018/09/30/cent-dix-sept-2/ |
| 7 | featured | `U/2018/09/20180830_105528-B-scaled.jpg` | `raw:2018/09/20180830_105528-B-scaled.jpg` | yes | 1440x2560 | 571 KB | 'cent seize.' | srcset: 1440w 169w 768w 576w 864w 1152w; sizes=`auto, (max-width: 1440px) 100vw, 1440px`; loading=lazy; linked to /nl/2018/09/11/cent-dix-sept/ |
| 8 | featured | `U/2018/09/Instant_20180829_135205.jpeg` | `raw:2018/09/Instant_20180829_135205.jpeg` | yes | 2000x2400 | 150 KB | 'cent quinze.' | srcset: 2000w 250w 768w 853w 1280w 1707w; sizes=`auto, (max-width: 2000px) 100vw, 2000px`; loading=lazy; linked to /nl/2018/09/09/cent-quinze/ |
| 9 | featured | `U/2018/09/Scan-2-scaled.jpeg` | `raw:2018/09/Scan-2-scaled.jpeg` | yes | 2060x2560 | 288 KB | 'cent quatorze.' | srcset: 2060w 241w 768w 824w 1236w 1648w; sizes=`auto, (max-width: 2060px) 100vw, 2060px`; loading=lazy; linked to /nl/2018/09/03/cent-quatorze/ |

#### /nl/kookboek/ — Kookboek: The Taste of Her Journey

Mirror HTML: `mirror/raw/swaanelauwaert.com/nl/kookboek/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | background-image (inline style) | `U/2026/08/Screenshot-2026-08-25-001201.jpg` | `raw:2026/08/Screenshot-2026-08-25-001201.jpg` | yes | 496x674 | 105 KB | "" |  |
| 2 | inline (other) | `U/2026/08/MVIMG_20260817_163817_1-768x1024.jpg` | `raw:2026/08/MVIMG_20260817_163817_1-768x1024.jpg` | yes | 768x1024 | 136 KB | "" | srcset: 768w 225w 1152w 1536w 1920w; sizes=`(max-width: 768px) 100vw, 768px`; fetchpriority=high |
| 3 | inline (other) | `U/2026/08/Photo-43-EDIT-768x1024.jpg` | `raw:2026/08/Photo-43-EDIT-768x1024.jpg` | yes | 768x1024 | 176 KB | "" | srcset: 768w 225w 1152w 1536w 1920w; sizes=`(max-width: 768px) 100vw, 768px` |
| 4 | inline (other) | `U/2026/08/Screenshot-2026-08-25-001028.jpg` | `raw:2026/08/Screenshot-2026-08-25-001028.jpg` | yes | 564x744 | 141 KB | "" | srcset: 564w 227w; sizes=`(max-width: 564px) 100vw, 564px` |
| 5 | inline | `U/2026/08/WhatsApp-Image-2026-08-14-at-17.04.05-1024x804.jpeg` | `raw:2026/08/WhatsApp-Image-2026-08-14-at-17.04.05-1024x804.jpeg` | yes | 1024x804 | 61 KB | "" | srcset: 1024w 300w 768w 1536w 2048w; sizes=`auto, (max-width: 1024px) 100vw, 1024px`; loading=lazy; original `WhatsApp-Image-2026-08-14-at-17.04.05.jpeg` 2048x1608 165 KB |

#### /nl/levende-rituelen/ — Levende Rituelen \| Ceremonies & Retraites

Mirror HTML: `mirror/raw/swaanelauwaert.com/nl/levende-rituelen/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | inline | `U/2026/02/5eaaabe9572dec3fc263928e634ab651-1024x968.jpg` | `raw:2026/02/5eaaabe9572dec3fc263928e634ab651-1024x968.jpg` | yes | 1024x968 | 148 KB | "" | srcset: 1024w 300w 768w 1199w; sizes=`(max-width: 1024px) 100vw, 1024px`; fetchpriority=high; original `5eaaabe9572dec3fc263928e634ab651.jpg` 1199x1134 212 KB |
| 2 | inline | `U/2026/02/7d90fcb7bef2e3cc0b08a81a8c2a8586.jpg` | `raw:2026/02/7d90fcb7bef2e3cc0b08a81a8c2a8586.jpg` | yes | 1199x902 | 170 KB | "" | srcset: 1199w 300w 768w 1024w; sizes=`(max-width: 1199px) 100vw, 1199px` |
| 3 | inline | `U/2026/01/unnamed.jpg` | `raw:2026/01/unnamed.jpg` | yes | 1200x891 | 86 KB | "" | srcset: 1200w 300w 768w 1024w; sizes=`(max-width: 1200px) 100vw, 1200px` |
| 4 | inline | `U/2026/01/bd7ca64901bddc5947b049725270689a-2.jpg` | `raw:2026/01/bd7ca64901bddc5947b049725270689a-2.jpg` | yes | 736x1308 | 106 KB | "" | srcset: 736w 169w 576w; sizes=`auto, (max-width: 736px) 100vw, 736px`; loading=lazy |
| 5 | inline | `U/2026/02/b264d97a335da7040c2173b983aa28bf.jpg` | `raw:2026/02/b264d97a335da7040c2173b983aa28bf.jpg` | yes | 683x1024 | 96 KB | "" | srcset: 683w 200w; sizes=`auto, (max-width: 683px) 100vw, 683px`; loading=lazy |
| 6 | inline | `U/2026/02/f2bf95b8eddfc091bb56604ab4d4d48d.jpg` | `raw:2026/02/f2bf95b8eddfc091bb56604ab4d4d48d.jpg` | yes | 1200x1194 | 161 KB | "" | srcset: 1200w 150w 300w 768w 1024w; sizes=`auto, (max-width: 1200px) 100vw, 1200px`; loading=lazy |
| 7 | inline | `U/2026/02/b40ec7271d9a610c1298162dd93302b2.jpg` | `raw:2026/02/b40ec7271d9a610c1298162dd93302b2.jpg` | yes | 801x1200 | 81 KB | "" | srcset: 801w 200w 768w 684w; sizes=`auto, (max-width: 801px) 100vw, 801px`; loading=lazy |

#### /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ — Maria Magdalena ‘Wild&Rooted’ Retreat Zuid Frankrijk 5-10 april 2027

Mirror HTML: `mirror/raw/swaanelauwaert.com/nl/maria-magdalena-retreat-zuid-frankrijk-2027/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | featured | `U/2026/02/DSCF0973-1-scaled.jpg` | `raw:2026/02/DSCF0973-1-scaled.jpg` | yes | 2560x1920 | 991 KB | "" | srcset: 2560w 300w 768w 1024w 1536w 2048w; sizes=`(max-width: 2560px) 100vw, 2560px`; fetchpriority=high |
| 2 | inline | `U/2026/02/DSCF0973-1-1024x768.jpg` | `raw:2026/02/DSCF0973-1-1024x768.jpg` | yes | 1024x768 | 244 KB | "" | srcset: 1024w 300w 768w 1536w 2048w; sizes=`(max-width: 1024px) 100vw, 1024px` |
| 3 | inline | `U/2026/02/IMG_50241-1024x768.jpeg` | `raw:2026/02/IMG_50241-1024x768.jpeg` | yes | 1024x768 | 265 KB | "" | srcset: 1024w 300w 768w 1536w 2048w; sizes=`(max-width: 1024px) 100vw, 1024px`; original `IMG_50241.jpeg` 2048x1536 1.31 MB |
| 4 | inline | `U/2026/01/IMG_50461-768x1024.jpeg` | `raw:2026/01/IMG_50461-768x1024.jpeg` | yes | 768x1024 | 200 KB | "" | srcset: 768w 225w 1152w 1536w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy; original `IMG_50461.jpeg` 1536x2048 1.16 MB |
| 5 | inline | `U/2026/02/IMG_5461-1024x768.jpeg` | `raw:2026/02/IMG_5461-1024x768.jpeg` | yes | 1024x768 | 178 KB | "" | srcset: 1024w 300w 768w 1536w 2048w; sizes=`auto, (max-width: 1024px) 100vw, 1024px`; loading=lazy; original `IMG_5461.jpeg` 2048x1536 1.13 MB |
| 6 | inline | `U/2026/02/DSCF0871.jpg` | `raw:2026/02/DSCF0871.jpg` | yes | 4000x3000 | 7.75 MB | "" |  |
| 7 | inline | `U/2026/02/20250408_095402.jpg` | `raw:2026/02/20250408_095402.jpg` | yes | 4080x3060 | 6.25 MB | "" |  |
| 8 | inline | `U/2026/02/20250409_123001.jpg` | `raw:2026/02/20250409_123001.jpg` | yes | 4080x3060 | 6.75 MB | "" |  |
| 9 | inline | `U/2026/02/DSCF0867.jpg` | `raw:2026/02/DSCF0867.jpg` | yes | 4000x3000 | 5.12 MB | "" |  |
| 10 | inline | `U/2026/02/DSCF0921.jpg` | `raw:2026/02/DSCF0921.jpg` | yes | 4000x3000 | 4.54 MB | "" |  |
| 11 | inline | `U/2026/02/20250408_153841.jpg` | `raw:2026/02/20250408_153841.jpg` | yes | 4080x3060 | 4.26 MB | "" |  |
| 12 | inline | `U/2026/02/20250408_182245.jpg` | `raw:2026/02/20250408_182245.jpg` | yes | 4080x3060 | 4.12 MB | "" |  |
| 13 | inline | `U/2026/02/20250411_084835.jpg` | `raw:2026/02/20250411_084835.jpg` | yes | 4080x3060 | 3.87 MB | "" |  |
| 14 | inline | `U/2026/02/IMG_5492.jpeg` | `raw:2026/02/IMG_5492.jpeg` | yes | 2160x3840 | 2.87 MB | "" |  |
| 15 | inline | `U/2026/02/20250408_095452.jpg` | `raw:2026/02/20250408_095452.jpg` | yes | 2576x1932 | 2.25 MB | "" |  |
| 16 | inline | `U/2026/02/20250408_124919.jpg` | `raw:2026/02/20250408_124919.jpg` | yes | 2576x1932 | 2.20 MB | "" |  |
| 17 | inline | `U/2026/02/20250408_132844.jpg` | `raw:2026/02/20250408_132844.jpg` | yes | 2576x1932 | 2.14 MB | "" |  |
| 18 | inline | `U/2026/02/IMG_5365-1024x768.jpeg` | `raw:2026/02/IMG_5365-1024x768.jpeg` | yes | 1024x768 | 210 KB | "" | srcset: 1024w 1536w 300w 768w 2048w; sizes=`auto, (max-width: 1024px) 100vw, 1024px`; loading=lazy; original `IMG_5365.jpeg` 2048x1536 1.20 MB |
| 19 | inline | `U/2026/02/WhatsApp-Image-2025-04-12-at-16.48.25_c02bedbb-768x1024.jpg` | `raw:2026/02/WhatsApp-Image-2025-04-12-at-16.48.25_c02bedbb-768x1024.jpg` | yes | 768x1024 | 135 KB | "" | srcset: 768w 1152w 225w 1536w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy; original `WhatsApp-Image-2025-04-12-at-16.48.25_c02bedbb.jpg` 1536x2048 473 KB |
| 20 | inline | `U/2026/02/WhatsApp-Image-2025-04-12-at-19.46.35_d823a004-1024x768.jpg` | `raw:2026/02/WhatsApp-Image-2025-04-12-at-19.46.35_d823a004-1024x768.jpg` | yes | 1024x768 | 127 KB | "" | srcset: 1024w 1536w 300w 768w 2048w; sizes=`auto, (max-width: 1024px) 100vw, 1024px`; loading=lazy; original `WhatsApp-Image-2025-04-12-at-19.46.35_d823a004.jpg` 2048x1536 418 KB |
| 21 | inline | `U/2026/02/IMG_5192-1024x768.jpeg` | `raw:2026/02/IMG_5192-1024x768.jpeg` | yes | 1024x768 | 231 KB | "" | srcset: 1024w 1536w 300w 768w 2048w; sizes=`auto, (max-width: 1024px) 100vw, 1024px`; loading=lazy; original `IMG_5192.jpeg` 2048x1536 1.41 MB |
| 22 | inline | `U/2026/02/IMG_4827-768x1024.jpeg` | `raw:2026/02/IMG_4827-768x1024.jpeg` | yes | 768x1024 | 215 KB | "" | srcset: 768w 1152w 225w 1536w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy; original `IMG_4827.jpeg` 1536x2048 1.23 MB |
| 23 | inline | `U/2026/02/IMG_4875-1024x768.jpeg` | `raw:2026/02/IMG_4875-1024x768.jpeg` | yes | 1024x768 | 204 KB | "" | srcset: 1024w 1536w 300w 768w 2048w; sizes=`auto, (max-width: 1024px) 100vw, 1024px`; loading=lazy; original `IMG_4875.jpeg` 2048x1536 1.27 MB |
| 24 | inline | `U/2026/02/IMG_4871-1024x768.jpeg` | `raw:2026/02/IMG_4871-1024x768.jpeg` | yes | 1024x768 | 271 KB | "" | srcset: 1024w 1536w 300w 768w 2048w; sizes=`auto, (max-width: 1024px) 100vw, 1024px`; loading=lazy; original `IMG_4871.jpeg` 2048x1536 1.81 MB |
| 25 | inline | `U/2026/02/WhatsApp-Image-2025-04-12-at-17.12.51_9a544a06-1024x768.jpg` | `raw:2026/02/WhatsApp-Image-2025-04-12-at-17.12.51_9a544a06-1024x768.jpg` | yes | 1024x768 | 270 KB | "" | srcset: 1024w 1536w 300w 768w 1600w; sizes=`auto, (max-width: 1024px) 100vw, 1024px`; loading=lazy; original `WhatsApp-Image-2025-04-12-at-17.12.51_9a544a06.jpg` 1600x1200 586 KB |
| 26 | inline | `U/2026/02/WhatsApp-Image-2025-04-12-at-15.32.09_ff18b69a-1024x768.jpg` | `raw:2026/02/WhatsApp-Image-2025-04-12-at-15.32.09_ff18b69a-1024x768.jpg` | yes | 1024x768 | 128 KB | "" | srcset: 1024w 1536w 300w 768w 2040w; sizes=`auto, (max-width: 1024px) 100vw, 1024px`; loading=lazy; original `WhatsApp-Image-2025-04-12-at-15.32.09_ff18b69a.jpg` 2040x1530 381 KB |
| 27 | inline | `U/2026/02/WhatsApp-Image-2025-04-12-at-15.32.09_5881b57b-768x1024.jpg` | `raw:2026/02/WhatsApp-Image-2025-04-12-at-15.32.09_5881b57b-768x1024.jpg` | yes | 768x1024 | 292 KB | "" | srcset: 768w 1152w 225w 1530w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy; original `WhatsApp-Image-2025-04-12-at-15.32.09_5881b57b.jpg` 1530x2040 1.03 MB |
| 28 | inline | `U/2026/02/WhatsApp-Image-2025-04-12-at-15.32.07_429cdf0d-768x1024.jpg` | `raw:2026/02/WhatsApp-Image-2025-04-12-at-15.32.07_429cdf0d-768x1024.jpg` | yes | 768x1024 | 191 KB | "" | srcset: 768w 1152w 225w 1530w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy; original `WhatsApp-Image-2025-04-12-at-15.32.07_429cdf0d.jpg` 1530x2040 605 KB |
| 29 | inline | `U/2026/02/WhatsApp-Image-2025-04-12-at-15.32.06_75a9ae80-768x1024.jpg` | `raw:2026/02/WhatsApp-Image-2025-04-12-at-15.32.06_75a9ae80-768x1024.jpg` | yes | 768x1024 | 182 KB | "" | srcset: 768w 1152w 225w 1200w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy; original `WhatsApp-Image-2025-04-12-at-15.32.06_75a9ae80.jpg` 1200x1600 368 KB |
| 30 | inline | `U/2026/02/WhatsApp-Image-2025-04-10-at-22.49.31_0b816f3d-768x1024.jpg` | `raw:2026/02/WhatsApp-Image-2025-04-10-at-22.49.31_0b816f3d-768x1024.jpg` | yes | 768x1024 | 117 KB | "" | srcset: 768w 1152w 225w 1200w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy; original `WhatsApp-Image-2025-04-10-at-22.49.31_0b816f3d.jpg` 1200x1600 233 KB |
| 31 | inline | `U/2026/02/WhatsApp-Image-2025-04-09-at-10.59.56_6120b4ff-1024x472.jpg` | `raw:2026/02/WhatsApp-Image-2025-04-09-at-10.59.56_6120b4ff-1024x472.jpg` | yes | 1024x472 | 75 KB | "" | srcset: 1024w 300w 768w 1536w 2016w; sizes=`auto, (max-width: 1024px) 100vw, 1024px`; loading=lazy; original `WhatsApp-Image-2025-04-09-at-10.59.56_6120b4ff.jpg` 2016x930 181 KB |
| 32 | inline | `U/2026/02/WhatsApp-Image-2025-04-09-at-07.53.48_b4b9c4b4-768x1024.jpg` | `raw:2026/02/WhatsApp-Image-2025-04-09-at-07.53.48_b4b9c4b4-768x1024.jpg` | yes | 768x1024 | 117 KB | "" | srcset: 768w 1152w 225w 1200w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy; original `WhatsApp-Image-2025-04-09-at-07.53.48_b4b9c4b4.jpg` 1200x1600 227 KB |
| 33 | inline | `U/2026/02/WhatsApp-Image-2025-04-09-at-07.53.36_ee84a043-768x1024.jpg` | `raw:2026/02/WhatsApp-Image-2025-04-09-at-07.53.36_ee84a043-768x1024.jpg` | yes | 768x1024 | 212 KB | "" | srcset: 768w 1152w 225w 1200w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy; original `WhatsApp-Image-2025-04-09-at-07.53.36_ee84a043.jpg` 1200x1600 455 KB |
| 34 | inline | `U/2026/02/20250407_155915.jpg` | `raw:2026/02/20250407_155915.jpg` | yes | 4080x3060 | 1.79 MB | "" |  |
| 35 | inline | `U/2026/02/IMG_5348-1-768x1024.jpg` | `raw:2026/02/IMG_5348-1-768x1024.jpg` | yes | 768x1024 | 115 KB | "" | srcset: 768w 225w 1152w 1536w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy; original `IMG_5348-1.jpg` 1536x2048 721 KB |
| 36 | inline | `U/2026/02/IMG_4894-768x1024.jpeg` | `raw:2026/02/IMG_4894-768x1024.jpeg` | yes | 768x1024 | 122 KB | "" | srcset: 768w 225w 1152w 1536w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy; original `IMG_4894.jpeg` 1536x2048 727 KB |
| 37 | inline | `U/2026/02/IMG_5169-768x1024.jpeg` | `raw:2026/02/IMG_5169-768x1024.jpeg` | yes | 768x1024 | 146 KB | "" | srcset: 768w 225w 1152w 1536w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy; original `IMG_5169.jpeg` 1536x2048 962 KB |

#### /nl/over-mij/ — Over mij

Mirror HTML: `mirror/raw/swaanelauwaert.com/nl/over-mij/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | featured | `U/2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg.webp` | `raw:2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg.webp` | yes | 957x960 | 16 KB | "" | srcset: 957w 150w 300w 768w; sizes=`(max-width: 957px) 100vw, 957px`; fetchpriority=high |

#### /nl/sainte-baume-gids/ — Sainte-Baume Gids

Mirror HTML: `mirror/raw/swaanelauwaert.com/nl/sainte-baume-gids/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | inline | `U/2026/08/IMG_20260812_200654-768x1024.jpg` | `raw:2026/08/IMG_20260812_200654-768x1024.jpg` | yes | 768x1024 | 174 KB | "" | srcset: 768w 225w 1152w 1536w 1920w; sizes=`(max-width: 768px) 100vw, 768px`; fetchpriority=high |

#### /nl/samenwerken/ — Samenwerken 1:1 Somatische Coaching & Lichaamswerk

Mirror HTML: `mirror/raw/swaanelauwaert.com/nl/samenwerken/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | hero (full-width cover) | `U/2026/08/DSC03534-1024x683.jpg` | `raw:2026/08/DSC03534-1024x683.jpg` | yes | 1024x683 | 111 KB | "" | srcset: 1024w 300w 768w 1536w 2048w; sizes=`(max-width: 1024px) 100vw, 1024px`; fetchpriority=high |
| 2 | inline | `U/2026/10/Screenshot-2026-10-10-105756.png` | `raw:2026/10/Screenshot-2026-10-10-105756.png` | yes | 515x659 | 302 KB | "" | srcset: 515w 234w; sizes=`(max-width: 515px) 100vw, 515px` |

#### /nl/the-eros-sanctuary/ — The Eros Sanctuary: 6 weken live online programma

Mirror HTML: `mirror/raw/swaanelauwaert.com/nl/the-eros-sanctuary/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | inline | `U/2026/04/0e9a4aa194478ed4c418f7fa9463bea9.jpg` | `raw:2026/04/0e9a4aa194478ed4c418f7fa9463bea9.jpg` | yes | 400x534 | 33 KB | "" | srcset: 400w 225w; sizes=`(max-width: 400px) 100vw, 400px`; fetchpriority=high |
| 2 | inline | `U/2026/04/30e0d24c3b2ebaf63a21f5c7f874a14d.jpg` | `raw:2026/04/30e0d24c3b2ebaf63a21f5c7f874a14d.jpg` | yes | 640x640 | 84 KB | "" | srcset: 640w 300w 150w; sizes=`(max-width: 640px) 100vw, 640px` |
| 3 | inline | `U/2026/04/af472e9b5594e4b72110cae15f9792dc.jpg` | `raw:2026/04/af472e9b5594e4b72110cae15f9792dc.jpg` | yes | 422x586 | 51 KB | "" | srcset: 422w 216w; sizes=`(max-width: 422px) 100vw, 422px` |
| 4 | inline | `U/2026/04/4e2393ae5131da6865a0a5c17d2fdf83.jpg` | `raw:2026/04/4e2393ae5131da6865a0a5c17d2fdf83.jpg` | yes | 720x900 | 27 KB | "" | srcset: 720w 240w; sizes=`auto, (max-width: 720px) 100vw, 720px`; loading=lazy |
| 5 | inline (media-text) | `U/2026/02/59653540d6bf783e7fb741cc68cf58bb-819x1024.jpg` | `raw:2026/02/59653540d6bf783e7fb741cc68cf58bb-819x1024.jpg` | yes | 819x1024 | 126 KB | "" | srcset: 819w 240w 768w 1200w; sizes=`auto, (max-width: 819px) 100vw, 819px`; loading=lazy; original `59653540d6bf783e7fb741cc68cf58bb.jpg` 1200x1500 217 KB |
| 6 | inline | `U/2026/04/8881d238fd5f3310b8212df33597bd3d-768x1024.jpg` | `raw:2026/04/8881d238fd5f3310b8212df33597bd3d-768x1024.jpg` | yes | 768x1024 | 44 KB | "" | srcset: 768w 225w 810w; sizes=`auto, (max-width: 768px) 100vw, 768px`; loading=lazy; original `8881d238fd5f3310b8212df33597bd3d.jpg` 810x1080 50 KB |
| 7 | inline | `U/2026/04/31151a884fbb0603dff8df2a67b2bc02-822x1024.jpg` | `raw:2026/04/31151a884fbb0603dff8df2a67b2bc02-822x1024.jpg` | yes | 822x1024 | 58 KB | "" | srcset: 822w 241w 768w 1080w; sizes=`auto, (max-width: 822px) 100vw, 822px`; loading=lazy; original `31151a884fbb0603dff8df2a67b2bc02.jpg` 1080x1346 84 KB |
| 8 | inline | `U/2026/04/327d1cd8b43e66b8535f50d749193206.jpg` | `raw:2026/04/327d1cd8b43e66b8535f50d749193206.jpg` | yes | 736x867 | 27 KB | "" | srcset: 736w 255w; sizes=`auto, (max-width: 736px) 100vw, 736px`; loading=lazy |

#### /nl/weekendretreat-27-28-29-november-2026-play/ — Weekendretreat 27-28-29 november 2026: PLAY

Mirror HTML: `mirror/raw/swaanelauwaert.com/nl/weekendretreat-27-28-29-november-2026-play/index.html.orig`

| # | role | remote URL (U/ = `/wp-content/uploads/sites/50/`) | local path | exists | px | size | alt | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | inline | `U/2026/08/PLAYbeeld-voor-op-flowdesk-1024x985.jpg` | `raw:2026/08/PLAYbeeld-voor-op-flowdesk-1024x985.jpg` | yes | 1024x985 | 289 KB | "" | srcset: 1024w 300w 768w 1536w 1884w; sizes=`(max-width: 1024px) 100vw, 1024px`; fetchpriority=high; original `PLAYbeeld-voor-op-flowdesk.jpg` 1884x1813 3.18 MB |
| 2 | cover card (image card in cover block) | `U/2026/08/54e9204e06d659f5c055fc625a80e0cb.jpg` | `raw:2026/08/54e9204e06d659f5c055fc625a80e0cb.jpg` | yes | 736x914 | 105 KB | "" | srcset: 736w 242w; sizes=`(max-width: 736px) 100vw, 736px` |
| 3 | cover card (image card in cover block) | `U/2026/08/752d1b97da310928b8c33c6367c0e03f-576x1024.jpg` | `raw:2026/08/752d1b97da310928b8c33c6367c0e03f-576x1024.jpg` | yes | 576x1024 | 93 KB | "" | srcset: 576w 169w 736w; sizes=`(max-width: 576px) 100vw, 576px`; original `752d1b97da310928b8c33c6367c0e03f.jpg` 736x1308 134 KB |
| 4 | cover card (image card in cover block) | `U/2026/08/95067da75856898475877e5c4bd47736.jpg` | `raw:2026/08/95067da75856898475877e5c4bd47736.jpg` | yes | 736x920 | 65 KB | "" | srcset: 736w 240w; sizes=`auto, (max-width: 736px) 100vw, 736px`; loading=lazy |


### 1.1 Alias URLs that were crawled but are not separate pages

- `mirror/raw/swaanelauwaert.com/en/body-untamed/index.html.orig` — old slug of page 66 `/en/the-eros-sanctuary-2/`; `<title>` and every asset identical to the current slug (canonical in the mirror points to itself). Keep as a redirect.
- `mirror/raw/swaanelauwaert.com/nl/maria-magdalena-retreat-zuid-frankrijk-2026/index.html.orig` — old slug of page 4728 `/nl/maria-magdalena-retreat-zuid-frankrijk-2027/`; identical content (39 `<img>`, same gallery). Keep as a redirect.
- `mirror/raw/swaanelauwaert.com/nl/index.html.orig` and `fr/index.html.orig` — the same documents as `nl.orig`/`fr.orig` (their canonical links point to `../nl.html` / `../fr.html`). `index.html` (root) = `en.orig`.

### 1.2 `og:image` / `twitter:image` per page (Jetpack Open Graph)

Jetpack emits one `og:image` per page (the page's featured image, else the first content image, else the site icon). On the two Eros Sanctuary pages it emits one `og:image` per content image (14 tags, the first six being `-150x150` thumbnails that were not mirrored) plus `og:image:secure_url` through the Photon CDN (`https://i0.wp.com/swaanelauwaert.com/...?ssl=1`). `twitter:image` is the same URL with `?w=640`. `og:image:alt` is always empty.

| page | og:image | og w×h | local (raw) | exists |
|---|---|---|---|---|
| /en/ | `U/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | 1280×577 | `raw:2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | yes |
| /en/about/ | `U/2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` | 957×960 | `raw:2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` | yes |
| /en/cookbook/ | `U/2026/08/MVIMG_20260817_163817_1-scaled.jpg` | 1920×2560 | `raw:2026/08/MVIMG_20260817_163817_1-scaled.jpg` | yes |
| /en/flavours-of-desire/ | `U/2026/02/b69a7dfbf5eaad18b7b69648d56c9c49.jpg` | 800×800 | `raw:2026/02/b69a7dfbf5eaad18b7b69648d56c9c49.jpg` | yes |
| /en/guide-sainte-baume/ | `U/2026/08/IMG_20260812_200654-scaled.jpg` | 1920×2560 | `raw:2026/08/IMG_20260812_200654-scaled.jpg` | yes |
| /en/rooted-rituals/ | `U/2026/02/b40ec7271d9a610c1298162dd93302b2.jpg` | 801×1200 | `raw:2026/02/b40ec7271d9a610c1298162dd93302b2.jpg` | yes |
| /en/sainte-baume-guide/ | `U/2026/08/IMG_20260812_200654-scaled.jpg` | 1920×2560 | `raw:2026/08/IMG_20260812_200654-scaled.jpg` | yes |
| /en/the-eros-sanctuary-2/ | `U/2026/04/8881d238fd5f3310b8212df33597bd3d-150x150.jpg` (+13 more og:image tags: every image on the page) | 810×1080 | `raw:2026/04/8881d238fd5f3310b8212df33597bd3d.jpg` | yes (resolved to 8881d238fd5f3310b8212df33597bd3d.jpg) |
| /en/the-journal/ | `U/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector.jpg` | 512×512 | `` | NO (missing) |
| /en/work-with-me/ | `U/2026/10/Screenshot-2026-10-10-105756.png` | 515×659 | `raw:2026/10/Screenshot-2026-10-10-105756.png` | yes |
| /fr/ | `U/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | 1280×577 | `raw:2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | yes |
| /fr/a-propos/ | `U/2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` | 957×960 | `raw:2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` | yes |
| /fr/accompagnement/ | `U/2026/10/Screenshot-2026-10-10-105756.png` | 515×659 | `raw:2026/10/Screenshot-2026-10-10-105756.png` | yes |
| /fr/flavours-of-desire-2/ | `U/2026/02/a4a043d325ecfae0844bcce21546e339.jpg` | 736×736 | `raw:2026/02/a4a043d325ecfae0844bcce21546e339.jpg` | yes |
| /fr/le-corps-libre/ | `U/2026/01/9d110192f5f3236a1cb2cf7d956f15b0.jpg` | 736×1104 | `raw:2026/01/9d110192f5f3236a1cb2cf7d956f15b0.jpg` | yes |
| /fr/le-journal/ | `U/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector.jpg` | 512×512 | `` | NO (missing) |
| /fr/livre-de-cuisine/ | `U/2026/08/MVIMG_20260817_163817_1-scaled.jpg` | 1920×2560 | `raw:2026/08/MVIMG_20260817_163817_1-scaled.jpg` | yes |
| /fr/rituels-dancrage/ | `U/2026/02/5eaaabe9572dec3fc263928e634ab651.jpg` | 1199×1134 | `raw:2026/02/5eaaabe9572dec3fc263928e634ab651.jpg` | yes |
| /nl/ | `U/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | 1280×577 | `raw:2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | yes |
| /nl/flavours-of-desire-3/ | `U/2026/02/a4a043d325ecfae0844bcce21546e339.jpg` | 736×736 | `raw:2026/02/a4a043d325ecfae0844bcce21546e339.jpg` | yes |
| /nl/journal/ | `U/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector.jpg` | 512×512 | `` | NO (missing) |
| /nl/kookboek/ | `U/2026/08/Screenshot-2026-08-25-001028.jpg` | 564×744 | `raw:2026/08/Screenshot-2026-08-25-001028.jpg` | yes |
| /nl/levende-rituelen/ | `U/2026/02/5eaaabe9572dec3fc263928e634ab651.jpg` | 1199×1134 | `raw:2026/02/5eaaabe9572dec3fc263928e634ab651.jpg` | yes |
| /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | `U/2026/02/DSCF0973-1-scaled.jpg` | 2560×1920 | `raw:2026/02/DSCF0973-1-scaled.jpg` | yes |
| /nl/over-mij/ | `U/2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` | 957×960 | `raw:2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` | yes |
| /nl/sainte-baume-gids/ | `U/2026/08/IMG_20260812_200654-scaled.jpg` | 1920×2560 | `raw:2026/08/IMG_20260812_200654-scaled.jpg` | yes |
| /nl/samenwerken/ | `U/2026/10/Screenshot-2026-10-10-105756.png` | 515×659 | `raw:2026/10/Screenshot-2026-10-10-105756.png` | yes |
| /nl/the-eros-sanctuary/ | `U/2026/04/8881d238fd5f3310b8212df33597bd3d-150x150.jpg` (+13 more og:image tags: every image on the page) | 810×1080 | `raw:2026/04/8881d238fd5f3310b8212df33597bd3d.jpg` | yes (resolved to 8881d238fd5f3310b8212df33597bd3d.jpg) |
| /nl/weekendretreat-27-28-29-november-2026-play/ | `U/2026/08/95067da75856898475877e5c4bd47736.jpg` | 736×920 | `raw:2026/08/95067da75856898475877e5c4bd47736.jpg` | yes |


### 1.3 Distinct source images used by static pages (88)

One row per full-size original; "variants present" are the `-WxH` renditions WordPress generated that also exist in the mirror.

| original file (under `wp-content/uploads/sites/50/`) | full-size px | size (raw copy) | variants present in mirror | used on | role(s) |
|---|---|---|---|---|---|
| `2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` | 957x960 | 24 KB | 150x150, 300x300, 768x770 (+webp) | /fr/a-propos/ | featured |
| `2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg.webp` | 957x960 | 16 KB |  (+webp) | /en/about/, /nl/over-mij/ | featured |
| `2018/09/20180830_105528-B-scaled.jpg` | 1440x2560 | 571 KB |  (+scaled) | /nl/journal/ | featured |
| `2018/09/20180930_1403500-B-scaled.jpg` | 2560x1440 | 481 KB |  (+scaled) | /nl/journal/ | featured |
| `2018/09/Instant_20180829_135205.jpeg` | 2000x2400 | 150 KB | 250x300, 768x922, 853x1024, 1280x1536, 1707x2048 | /nl/journal/ | featured |
| `2018/09/Scan-2-scaled.jpeg` | 2060x2560 | 288 KB |  (+scaled) | /nl/journal/ | featured |
| `2018/10/20181006_213843-D-scaled.jpg` | 1440x2560 | 372 KB |  (+scaled) | /nl/journal/ | featured |
| `2018/10/44175512_10157880861444832_997186630404014080_o.jpg` | 1707x2048 | 223 KB | 250x300, 768x921, 854x1024, 1280x1536 | /nl/journal/ | featured |
| `2018/10/IMG_20181006_175859-B-scaled.jpg` | 2560x1920 | 518 KB |  (+scaled) | /nl/journal/ | featured |
| `2018/10/Instant_20181007_103126.jpeg` | 2000x2400 | 140 KB | 250x300, 768x922, 853x1024, 1280x1536, 1707x2048 | /nl/journal/ | featured |
| `2018/10/Ventemiglia-B.jpg` | 1896x1067 | 220 KB | 300x169, 768x432, 1024x576, 1536x864 | /nl/journal/ | featured |
| `2026/01/2211d321fe9f6f2c415cafa5ab80fcc2.jpg` | 736x975 | 95 KB | 226x300 | /en/flavours-of-desire/, /fr/flavours-of-desire-2/, /nl/flavours-of-desire-3/ | cover card (image card in cover block) |
| `2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | 1280x577 | 154 KB |  | /en/, /fr/, /nl/ | background-image (inline style) |
| `2026/01/7c754abd9bc7f6a913a765577b33dea2.jpg` | 736x863 | 123 KB | 256x300 | /en/flavours-of-desire/, /fr/flavours-of-desire-2/, /nl/flavours-of-desire-3/ | cover card (image card in cover block) |
| `2026/01/7e913d8245b765d0f1ef82803d7c2f7e.jpg` | 577x866 | 107 KB | 200x300 | /en/flavours-of-desire/, /fr/flavours-of-desire-2/, /nl/flavours-of-desire-3/ | inline |
| `2026/01/9d110192f5f3236a1cb2cf7d956f15b0.jpg` | 736x1104 | 44 KB | 200x300, 683x1024 | /fr/le-corps-libre/ | inline |
| `2026/01/IMG_50461.jpeg` | 1536x2048 | 1.16 MB | 225x300, 768x1024, 1152x1536 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/01/bb3e19bbdc0e7db827b33c44fc650fdb-1.jpg` | 700x875 | 66 KB | 240x300 | /en/flavours-of-desire/, /fr/flavours-of-desire-2/, /nl/flavours-of-desire-3/ | cover card (image card in cover block) |
| `2026/01/bd7ca64901bddc5947b049725270689a-2.jpg` | 736x1308 | 106 KB | 169x300, 576x1024 | /en/rooted-rituals/, /fr/rituels-dancrage/, /nl/levende-rituelen/ | inline |
| `2026/01/unnamed.jpg` | 1200x891 | 86 KB | 300x223, 768x570, 1024x760 | /en/rooted-rituals/, /fr/rituels-dancrage/, /nl/levende-rituelen/ | inline |
| `2026/02/20250407_155915.jpg` | 4080x3060 | 1.79 MB |  (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/20250408_095402.jpg` | 4080x3060 | 6.25 MB |  (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/20250408_095452.jpg` | 2576x1932 | 2.25 MB |  (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/20250408_124919.jpg` | 2576x1932 | 2.20 MB |  (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/20250408_132844.jpg` | 2576x1932 | 2.14 MB |  (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/20250408_153841.jpg` | 4080x3060 | 4.26 MB |  (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/20250408_182245.jpg` | 4080x3060 | 4.12 MB |  (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/20250409_123001.jpg` | 4080x3060 | 6.75 MB |  (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/20250411_084835.jpg` | 4080x3060 | 3.87 MB |  (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/59653540d6bf783e7fb741cc68cf58bb.jpg` | 1200x1500 | 217 KB | 240x300, 768x960, 819x1024 | /en/the-eros-sanctuary-2/, /fr/le-corps-libre/, /nl/the-eros-sanctuary/ | inline (media-text) |
| `2026/02/5eaaabe9572dec3fc263928e634ab651.jpg` | 1199x1134 | 212 KB | 300x284, 768x726, 1024x968 | /en/rooted-rituals/, /fr/rituels-dancrage/, /nl/levende-rituelen/ | inline |
| `2026/02/7d90fcb7bef2e3cc0b08a81a8c2a8586.jpg` | 1199x902 | 170 KB | 300x226, 768x578, 1024x770 | /en/rooted-rituals/, /fr/rituels-dancrage/, /nl/levende-rituelen/ | inline |
| `2026/02/DSCF0867.jpg` | 4000x3000 | 5.12 MB |  (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/DSCF0871.jpg` | 4000x3000 | 7.75 MB |  (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/DSCF0921.jpg` | 4000x3000 | 4.54 MB |  (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/DSCF0973-1-scaled.jpg` | 2560x1920 | 991 KB |  (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | featured |
| `2026/02/DSCF0973-1.jpg` | 2560x1920 | 991 KB | 300x225, 768x576, 1024x768, 1536x1152, 2048x1536 (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/IMG_4827.jpeg` | 1536x2048 | 1.23 MB | 225x300, 768x1024, 1152x1536 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/IMG_4871.jpeg` | 2048x1536 | 1.81 MB | 300x225, 768x576, 1024x768, 1536x1152 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/IMG_4875.jpeg` | 2048x1536 | 1.27 MB | 300x225, 768x576, 1024x768, 1536x1152 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/IMG_4894.jpeg` | 1536x2048 | 727 KB | 225x300, 768x1024, 1152x1536 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/IMG_50241.jpeg` | 2048x1536 | 1.31 MB | 300x225, 768x576, 1024x768, 1536x1152 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/IMG_5169.jpeg` | 1536x2048 | 962 KB | 225x300, 768x1024, 1152x1536 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/IMG_5192.jpeg` | 2048x1536 | 1.41 MB | 300x225, 768x576, 1024x768, 1536x1152 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/IMG_5348-1.jpg` | 1536x2048 | 721 KB | 225x300, 768x1024, 1152x1536 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/IMG_5365.jpeg` | 2048x1536 | 1.20 MB | 300x225, 768x576, 1024x768, 1536x1152 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/IMG_5461.jpeg` | 2048x1536 | 1.13 MB | 300x225, 768x576, 1024x768, 1536x1152 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/IMG_5492.jpeg` | 2160x3840 | 2.87 MB |  (+scaled) | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/WhatsApp-Image-2025-04-09-at-07.53.36_ee84a043.jpg` | 1200x1600 | 455 KB | 225x300, 768x1024, 1152x1536 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/WhatsApp-Image-2025-04-09-at-07.53.48_b4b9c4b4.jpg` | 1200x1600 | 227 KB | 225x300, 768x1024, 1152x1536 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/WhatsApp-Image-2025-04-09-at-10.59.56_6120b4ff.jpg` | 2016x930 | 181 KB | 300x138, 768x354, 1024x472, 1536x709 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/WhatsApp-Image-2025-04-10-at-22.49.31_0b816f3d.jpg` | 1200x1600 | 233 KB | 225x300, 768x1024, 1152x1536 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/WhatsApp-Image-2025-04-12-at-15.32.06_75a9ae80.jpg` | 1200x1600 | 368 KB | 225x300, 768x1024, 1152x1536 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/WhatsApp-Image-2025-04-12-at-15.32.07_429cdf0d.jpg` | 1530x2040 | 605 KB | 225x300, 768x1024, 1152x1536 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/WhatsApp-Image-2025-04-12-at-15.32.09_5881b57b.jpg` | 1530x2040 | 1.03 MB | 225x300, 768x1024, 1152x1536 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/WhatsApp-Image-2025-04-12-at-15.32.09_ff18b69a.jpg` | 2040x1530 | 381 KB | 300x225, 768x576, 1024x768, 1536x1152 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/WhatsApp-Image-2025-04-12-at-16.48.25_c02bedbb.jpg` | 1536x2048 | 473 KB | 225x300, 768x1024, 1152x1536 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/WhatsApp-Image-2025-04-12-at-17.12.51_9a544a06.jpg` | 1600x1200 | 586 KB | 300x225, 768x576, 1024x768, 1536x1152 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/WhatsApp-Image-2025-04-12-at-19.46.35_d823a004.jpg` | 2048x1536 | 418 KB | 300x225, 768x576, 1024x768, 1536x1152 | /nl/maria-magdalena-retreat-zuid-frankrijk-2027/ | inline |
| `2026/02/a4a043d325ecfae0844bcce21546e339.jpg` | 736x736 | 70 KB | 150x150, 300x300 | /en/flavours-of-desire/, /fr/flavours-of-desire-2/, /nl/flavours-of-desire-3/ | inline (media-text) |
| `2026/02/b264d97a335da7040c2173b983aa28bf.jpg` | 683x1024 | 96 KB | 200x300 | /en/rooted-rituals/, /fr/rituels-dancrage/, /nl/levende-rituelen/ | inline |
| `2026/02/b40ec7271d9a610c1298162dd93302b2.jpg` | 801x1200 | 81 KB | 200x300, 684x1024, 768x1151 | /en/rooted-rituals/, /fr/rituels-dancrage/, /nl/levende-rituelen/ | inline |
| `2026/02/b69a7dfbf5eaad18b7b69648d56c9c49.jpg` | 800x800 | 62 KB | 150x150, 300x300, 768x768 | /en/flavours-of-desire/, /fr/flavours-of-desire-2/ | inline (media-text) |
| `2026/02/f2bf95b8eddfc091bb56604ab4d4d48d.jpg` | 1200x1194 | 161 KB | 150x150, 300x300, 768x764, 1024x1019 | /en/rooted-rituals/, /fr/rituels-dancrage/, /nl/levende-rituelen/ | inline |
| `2026/04/0e9a4aa194478ed4c418f7fa9463bea9.jpg` | 400x534 | 33 KB | 225x300 | /en/the-eros-sanctuary-2/, /nl/the-eros-sanctuary/ | inline |
| `2026/04/30e0d24c3b2ebaf63a21f5c7f874a14d.jpg` | 640x640 | 84 KB | 150x150, 300x300 | /en/the-eros-sanctuary-2/, /nl/the-eros-sanctuary/ | inline |
| `2026/04/31151a884fbb0603dff8df2a67b2bc02.jpg` | 1080x1346 | 84 KB | 241x300, 768x957, 822x1024 | /en/the-eros-sanctuary-2/, /nl/the-eros-sanctuary/ | inline |
| `2026/04/327d1cd8b43e66b8535f50d749193206.jpg` | 736x867 | 27 KB | 255x300 | /en/the-eros-sanctuary-2/, /nl/the-eros-sanctuary/ | inline |
| `2026/04/4e2393ae5131da6865a0a5c17d2fdf83.jpg` | 720x900 | 27 KB | 240x300 | /en/the-eros-sanctuary-2/, /nl/the-eros-sanctuary/ | inline |
| `2026/04/8881d238fd5f3310b8212df33597bd3d.jpg` | 810x1080 | 50 KB | 225x300, 768x1024 | /en/the-eros-sanctuary-2/, /nl/the-eros-sanctuary/ | inline |
| `2026/04/af472e9b5594e4b72110cae15f9792dc.jpg` | 422x586 | 51 KB | 216x300 | /en/the-eros-sanctuary-2/, /nl/the-eros-sanctuary/ | inline |
| `2026/08/54e9204e06d659f5c055fc625a80e0cb.jpg` | 736x914 | 105 KB | 242x300 | /nl/weekendretreat-27-28-29-november-2026-play/ | cover card (image card in cover block) |
| `2026/08/752d1b97da310928b8c33c6367c0e03f.jpg` | 736x1308 | 134 KB | 169x300, 576x1024 | /nl/weekendretreat-27-28-29-november-2026-play/ | cover card (image card in cover block) |
| `2026/08/95067da75856898475877e5c4bd47736.jpg` | 736x920 | 65 KB | 240x300 | /nl/weekendretreat-27-28-29-november-2026-play/ | cover card (image card in cover block) |
| `2026/08/DSC03534.jpg` | 2560x1707 | 401 KB | 300x200, 768x512, 1024x683, 1536x1024, 2048x1365 (+scaled) | /en/work-with-me/, /fr/accompagnement/, /nl/samenwerken/ | hero (full-width cover) |
| `2026/08/IMG-20260404-WA0004.jpg` | 539x719 | 105 KB | 225x300 | /en/, /fr/, /nl/ | inline |
| `2026/08/IMG_20260812_200654.jpg` | 1920x2560 | 643 KB | 225x300, 768x1024, 1152x1536, 1536x2048 (+scaled) | /en/guide-sainte-baume/, /en/sainte-baume-guide/, /nl/sainte-baume-gids/ | inline |
| `2026/08/IMG_5348.jpeg` | 1536x2048 | 721 KB | 225x300, 768x1024, 1152x1536 | /en/, /fr/, /nl/ | inline |
| `2026/08/MVIMG_20260817_163022_1.jpg` | 1920x2560 | 627 KB | 225x300, 768x1024, 1152x1536, 1536x2048 (+scaled) | /en/, /fr/, /nl/ | inline |
| `2026/08/MVIMG_20260817_163746-EDIT.jpg` | 2233x2560 | 590 KB | 262x300, 768x880, 893x1024, 1340x1536, 1787x2048 (+scaled) | /en/, /fr/ | inline |
| `2026/08/MVIMG_20260817_163817_1.jpg` | 1920x2560 | 448 KB | 225x300, 768x1024, 1152x1536, 1536x2048 (+scaled) | /en/cookbook/, /fr/livre-de-cuisine/, /nl/, /nl/kookboek/ | inline, inline (other) |
| `2026/08/PLAYbeeld-voor-op-flowdesk.jpg` | 1884x1813 | 3.18 MB | 300x289, 768x739, 1024x985, 1536x1478 | /nl/weekendretreat-27-28-29-november-2026-play/ | inline |
| `2026/08/Photo-43-EDIT.jpg` | 1920x2560 | 689 KB | 225x300, 768x1024, 1152x1536, 1536x2048 (+scaled) | /en/cookbook/, /fr/livre-de-cuisine/, /nl/kookboek/ | inline, inline (other) |
| `2026/08/Screenshot-2026-08-23-201541.jpg` | 342x507 | 71 KB | 202x300 | /en/cookbook/, /fr/livre-de-cuisine/ | background-image (inline style), inline |
| `2026/08/Screenshot-2026-08-25-001028.jpg` | 564x744 | 141 KB | 227x300 | /nl/kookboek/ | inline (other) |
| `2026/08/Screenshot-2026-08-25-001201.jpg` | 496x674 | 105 KB |  | /nl/kookboek/ | background-image (inline style) |
| `2026/08/WhatsApp-Image-2026-08-14-at-17.04.05.jpeg` | 2048x1608 | 165 KB | 300x236, 768x603, 1024x804, 1536x1206 | /nl/kookboek/ | inline |
| `2026/10/Screenshot-2026-10-10-105756.png` | 515x659 | 302 KB | 234x300 | /en/work-with-me/, /fr/accompagnement/, /nl/samenwerken/ | inline |


Observations on this set:

- Only `2026/*` uploads and the 2018 "About" portrait plus the nine 2018 post thumbnails on `/nl/journal/` are used by static pages; everything older belongs to the blog.
- The three language versions of a page share the same files (EN/FR/NL versions of Flavours of Desire, Rooted Rituals, Work with me, Cookbook, Sainte-Baume guide, Eros Sanctuary). The FR "À propos" page requests the JPEG portrait; EN/NL "About" request the `.jpeg.webp` sibling (LiteSpeed/Jetpack WebP rewriting — both files are mirrored).
- The home-page gallery and the Cookbook pages share `MVIMG_20260817_163817_1`; `/nl/` uses it in the gallery where `/en/` and `/fr/` use `MVIMG_20260817_163746-EDIT` instead (the NL home differs from EN/FR in that one image).
- `IMG_5348.jpeg` (2026/08, home gallery) and `IMG_5348-1.jpg` (2026/02, retreat gallery) are byte-identical re-uploads (section 6.3).
- The second gallery on the Eros Sanctuary pages (`8881d238…-768x1024.jpg`, `31151a88…-822x1024.jpg`, `327d1cd8….jpg`, placed after the testimonial quote) is in the HTML but is not visible in the local desktop render (`en-the-eros-sanctuary-2--desktop.png` shows an empty band there) — verify in the rebuild whether this gallery is meant to show.
- The three "A Living Prayer" columns on the Flavours of Desire pages (`Ignite` / `Devour` / `Surrender`) are colour-only cover blocks (`#828282`, `#833d3a`, `#d6bc98` with `has-background-dim-0`), no images.

## 2. Fonts

All three families are self-hosted. Twenty Twenty-Five ships Literata and Beiruti as theme fonts; Floreal is a custom upload declared through the WordPress Font Library (`wp_font_face` post type) and served from the uploads directory. The theme preloads nothing; `font-display: fallback` on every face.

| family | weight | style | file | size |
|---|---|---|---|---|
| Beiruti | 200–900 (variable wght) | normal | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/beiruti/Beiruti-VariableFont_wght.woff2` | 172 KB |
| Literata | 900 | normal | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-Black.woff2` | 104 KB |
| Literata | 900 | italic | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-BlackItalic.woff2` | 106 KB |
| Literata | 700 | normal | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-Bold.woff2` | 105 KB |
| Literata | 700 | italic | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-BoldItalic.woff2` | 108 KB |
| Literata | 800 | normal | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-ExtraBold.woff2` | 108 KB |
| Literata | 800 | italic | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-ExtraBoldItalic.woff2` | 108 KB |
| Literata | 200 | normal | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-ExtraLight.woff2` | 102 KB |
| Literata | 200 | italic | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-ExtraLightItalic.woff2` | 102 KB |
| Literata | 300 | normal | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-Light.woff2` | 106 KB |
| Literata | 300 | italic | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-LightItalic.woff2` | 103 KB |
| Literata | 500 | normal | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-Medium.woff2` | 104 KB |
| Literata | 500 | italic | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-MediumItalic.woff2` | 106 KB |
| Literata | 400 | normal | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-Regular.woff2` | 92 KB |
| Literata | 400 | italic | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-RegularItalic.woff2` | 93 KB |
| Literata | 600 | normal | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-SemiBold.woff2` | 105 KB |
| Literata | 600 | italic | `mirror/raw/swaanelauwaert.com/wp-content/themes/twentytwentyfive/assets/fonts/literata/Literata72pt-SemiBoldItalic.woff2` | 107 KB |
| Floreal | 400 | normal | `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/fonts/floreal.woff` | 31 KB |

Total: 18 files, 1.91 MB (1,906,348 B). Usage from the inlined global styles (`--wp--preset--font-family--literata: Literata, serif`, `--wp--preset--font-family--beiruti: Beiruti, sans-serif`, `--wp--preset--font-family--floreal: Floreal`): `body` = Literata, weight **300**, `letter-spacing -0.01em`, `line-height 1.6`; `h1`–`h6` = **Floreal** 400, `letter-spacing -0.02em`, `line-height 1.02`, colour `accent-3`; the site title (`.wp-block-site-title`) = Floreal 400 uppercase, `line-height 1.1`; buttons (`.wp-block-button__link`) and pullquotes (`.wp-block-pullquote`, weight 500) = **Beiruti**. Literata is declared in all 16 faces (200–900, normal + italic) but the pages only need Light 300 (body), Regular/Medium for emphasis, Bold 700 (`<strong>`) and the matching italics — the rebuild can drop the rest (verify against the design audit). No `<link rel="preload">` for fonts on the live site. The scaffold already copies all 18 files to `public/fonts/`.

## 3. Icons

Declared in `<head>` of every page (from `en.orig`; identical on all pages):

| rel / name | remote URL | local file | exists |
|---|---|---|---|
| `icon` sizes `32x32` | `U/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector-32x32.jpg` | `raw:2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector-32x32.jpg` (708 B, 32×32) | yes |
| `icon` sizes `192x192` | `U/2026/02/…-vector-192x192.jpg` | `raw:2026/02/…-vector-192x192.jpg` (3,071 B, 192×192) | yes |
| `apple-touch-icon` | `U/2026/02/…-vector-180x180.jpg` | `raw:2026/02/…-vector-180x180.jpg` (2,893 B, 180×180) | yes |
| `msapplication-TileImage` (meta) | `U/2026/02/…-vector-270x270.jpg` | — | **no** |
| site icon original (used as `og:image` on Journal pages) | `U/2026/02/cropped-red-pomegranate-icon-on-a-white-background-illustration-vector.jpg` (512×512 per `og:image:width/height`) | — | **no** |

The icon is a JPEG (red pomegranate illustration on white); the rebuild should regenerate a proper `favicon.ico`/`.svg`/PNG set from the 192×192 copy or ask the owner for the vector. `public/media/2026/02/` in the scaffold already contains the 192×192 copy.

Other icons:

- **Social links** (footer of every page): `wp-block-social-links` with `is-style-logos-only`; two links — Instagram `https://www.instagram.com/swaanelauwaert/` and Facebook `https://www.facebook.com/swaane.lauwaert` (`<li class="wp-social-link wp-social-link-instagram has-accent-3-color">`, colour `#2c261e`). The SVGs are inline in the HTML (core block markup, 24×24 `viewBox="0 0 24 24"`), no files. The Twenty Twenty-Five inline CSS also lists 47 other `wp-social-link-*` services — that is just the block stylesheet, not links on the site.
- **Language switcher**: Polylang flags as `<img src="data:image/png;base64,…">` (16×11) for English, Nederlands, Français — inline data, no files. Re-create with the same three flag PNGs or text labels.
- **Navigation submenu chevrons**, Jetpack form file-field icon (`field-file__icon`, 20×20) and the search/menu toggles: inline SVG, no files.
- **Substack**: the Journal pages contain a text link `VOLG ME OP: https://substack.com/@swaanelauwaert1`. A Substack logo `media:2026/10/substack-4b9801.svg` (269 B, media id 5930, uploaded 2026-10-19, unattached) exists in the media library but is not referenced by any crawled page — probably added to the live footer after the crawl; keep it available.

## 4. Documents, audio, video and other downloadable files

Found by extension across `mirror/raw` and `mirror/media`: 19 `.pdf`, 9 `.mp3`, 0 video files, 0 archives/office documents. All 28 come from `media-p1.json` (fetched via `fetch-list`), none from the wget crawl.

| file (`mirror/media/wp-content/uploads/sites/50/`) | type | size | media id | uploaded | attached to | linked from crawled HTML / REST content |
|---|---|---|---|---|---|---|
| `2026/03/De-Boodschappenlijst.pdf` | PDF | 2.30 MB | 5151 | 2026-03-29 | page 4990 | none found |
| `2026/03/De-Intieme-Quiz.pdf` | PDF | 956 KB | 5149 | 2026-03-29 | page 4990 | none found |
| `2026/03/Flavors-of-Desire-E-book-ENGLISH.pdf` | PDF | 966 KB | 5163 | 2026-03-29 | page 5113 | none found |
| `2026/03/Flavours-of-Desire-E-book-ENGLISH.pdf` | PDF | 979 KB | 5160 | 2026-03-29 | page 5113 | none found |
| `2026/03/Flavours-of-Desire-E-book-Nederlands.pdf` | PDF | 946 KB | 5147 | 2026-03-29 | page 4990 | none found |
| `2026/03/Flavours-of-Desire-INTRO-audio-ENGLISH.mp3` | MP3 | 220 KB | 5120 | 2026-03-29 | page 5113 | none found |
| `2026/03/Flavours-of-Desire-Module-1-audio-NL.mp3` | MP3 | 6.48 MB | 5057 | 2026-03-28 | unattached | none found |
| `2026/03/Flavours-of-Desire-Module-2-audio-NL.mp3` | MP3 | 3.29 MB | 5058 | 2026-03-28 | unattached | none found |
| `2026/03/Flavours-of-Desire-Module-3-audio-NL.mp3` | MP3 | 2.29 MB | 5056 | 2026-03-28 | unattached | none found |
| `2026/03/Flavours-of-Desire-Module-4a-audio-NL.mp3` | MP3 | 2.71 MB | 5059 | 2026-03-28 | unattached | none found |
| `2026/03/Flavours-of-Desire-Module-4b-RECEPT-1001-nachten-NL.mp3` | MP3 | 2.24 MB | 5060 | 2026-03-28 | unattached | none found |
| `2026/03/Flavours-of-Desire-Module-4c-audio-NL.mp3` | MP3 | 3.98 MB | 5061 | 2026-03-28 | unattached | none found |
| `2026/03/Flavours-of-Desire-Module-5-audio-NL.mp3` | MP3 | 1.96 MB | 5062 | 2026-03-28 | unattached | none found |
| `2026/03/INTRO-audio-NL.mp3` | MP3 | 243 KB | 5063 | 2026-03-28 | unattached | none found |
| `2026/03/Shopping-List.pdf` | PDF | 2.29 MB | 5153 | 2026-03-29 | page 5113 | none found |
| `2026/03/The-Intimacy-Quiz.pdf` | PDF | 3.43 MB | 5155 | 2026-03-29 | page 5113 | none found |
| `2026/05/Werboek-Module-2-NL.pdf` | PDF | 760 KB | 5287 | 2026-05-12 | unattached | none found |
| `2026/05/Workbook-Module-1-English-1-2.pdf` | PDF | 1.56 MB | 5267 | 2026-05-01 | unattached | none found |
| `2026/05/Workbook-Module-2.pdf` | PDF | 759 KB | 5291 | 2026-05-12 | unattached | none found |
| `2026/05/Workbook-module-1-Nederlands.pdf` | PDF | 1.56 MB | 5259 | 2026-05-01 | page 5236 | none found |
| `2026/05/Workbook-module-3-ENGLISH.pdf` | PDF | 2.00 MB | 5322 | 2026-05-20 | unattached | none found |
| `2026/05/Workbook-module-3-Nederlands.pdf` | PDF | 2.00 MB | 5323 | 2026-05-20 | unattached | none found |
| `2026/06/Workbook-Module-4-Nederlands.pdf` | PDF | 690 KB | 5361 | 2026-06-02 | unattached | none found |
| `2026/06/Workbook-module-3-Engels.pdf` | PDF | 686 KB | 5360 | 2026-06-02 | unattached | none found |
| `2026/06/Workbook-module-5-Engels.pdf` | PDF | 1.25 MB | 5379 | 2026-06-10 | unattached | none found |
| `2026/06/Workbook-module-5-Nederlands.pdf` | PDF | 1.25 MB | 5380 | 2026-06-10 | unattached | none found |
| `2026/06/Workbook-module-6-Engels.pdf` | PDF | 2.01 MB | 5386 | 2026-06-16 | unattached | none found |
| `2026/06/Workbook-module-6-Nederlands.pdf` | PDF | 2.01 MB | 5393 | 2026-06-16 | unattached | none found |

Nothing in the 184 crawled HTML pages or in the REST `content.rendered` of posts/pages links to any `.pdf` or `.mp3` (0 matches). They are the course material of the password-protected module pages (attached to page ids 5113, 4990, 5236, 5247) or unattached:

| page | id | REST status | media-library attachments (`post` field in media-p1.json) |
|---|---|---|---|
| /en/flavours-of-desire-modules-english/ | 5113 | password-protected (`content.protected=true`, rendered empty) | `2026/03/Flavors-of-Desire-E-book-ENGLISH.pdf` (application/pdf, 966 KB)<br>`2026/03/Flavours-of-Desire-E-book-ENGLISH.pdf` (application/pdf, 979 KB)<br>`2026/03/The-Intimacy-Quiz.pdf` (application/pdf, 3.43 MB)<br>`2026/03/Shopping-List.pdf` (application/pdf, 2.29 MB)<br>`2026/03/Flavours-of-Desire-INTRO-audio-ENGLISH.mp3` (audio/mpeg, 220 KB) |
| /en/module-1/ | 5247 | password-protected (`content.protected=true`, rendered empty) | `2026/05/neijing-tu-print-for-web-700mb-scaled-1.webp` (image/webp, 332 KB)<br>`2026/05/Microcosmic_orbite.png` (image/png, 19 KB) |
| /en/werk-met-mij/ | 5530 | published, `content.rendered` empty | — |
| /fr/flavours-of-desire-2/modules/ | 5101 | password-protected (`content.protected=true`, rendered empty) | — |
| /nl/flavours-of-desire-3/modules/ | 4990 | password-protected (`content.protected=true`, rendered empty) | `2026/03/De-Boodschappenlijst.pdf` (application/pdf, 2.30 MB)<br>`2026/03/De-Intieme-Quiz.pdf` (application/pdf, 956 KB)<br>`2026/03/Flavours-of-Desire-E-book-Nederlands.pdf` (application/pdf, 946 KB) |
| /nl/the-eros-sanctuary-modules/ | 5236 | password-protected (`content.protected=true`, rendered empty) | `2026/05/Workbook-module-1-Nederlands.pdf` (application/pdf, 1.56 MB) |

Unattached media-library items (no `post`):

- `2026/10/substack-4b9801.svg` (image/svg+xml, 0 KB, uploaded 2026-10-19)
- `2026/06/Workbook-module-6-Nederlands.pdf` (application/pdf, 2.01 MB, uploaded 2026-06-16)
- `2026/06/Workbook-module-6-Engels.pdf` (application/pdf, 2.01 MB, uploaded 2026-06-16)
- `2026/06/Workbook-module-5-Nederlands.pdf` (application/pdf, 1.25 MB, uploaded 2026-06-10)
- `2026/06/Workbook-module-5-Engels.pdf` (application/pdf, 1.25 MB, uploaded 2026-06-10)
- `2026/06/Workbook-Module-4-Nederlands.pdf` (application/pdf, 690 KB, uploaded 2026-06-02)
- `2026/06/Workbook-module-3-Engels.pdf` (application/pdf, 686 KB, uploaded 2026-06-02)
- `2026/05/Workbook-module-3-Nederlands.pdf` (application/pdf, 2.00 MB, uploaded 2026-05-20)
- `2026/05/Workbook-module-3-ENGLISH.pdf` (application/pdf, 2.00 MB, uploaded 2026-05-20)
- `2026/05/Workbook-Module-2.pdf` (application/pdf, 759 KB, uploaded 2026-05-12)
- `2026/05/Werboek-Module-2-NL.pdf` (application/pdf, 760 KB, uploaded 2026-05-12)
- `2026/05/Workbook-Module-1-English-1-2.pdf` (application/pdf, 1.56 MB, uploaded 2026-05-01)
- `2026/03/INTRO-audio-NL.mp3` (audio/mpeg, 243 KB, uploaded 2026-03-28)
- `2026/03/Flavours-of-Desire-Module-5-audio-NL.mp3` (audio/mpeg, 1.96 MB, uploaded 2026-03-28)
- `2026/03/Flavours-of-Desire-Module-4c-audio-NL.mp3` (audio/mpeg, 3.98 MB, uploaded 2026-03-28)
- `2026/03/Flavours-of-Desire-Module-4b-RECEPT-1001-nachten-NL.mp3` (audio/mpeg, 2.24 MB, uploaded 2026-03-28)
- `2026/03/Flavours-of-Desire-Module-4a-audio-NL.mp3` (audio/mpeg, 2.71 MB, uploaded 2026-03-28)
- `2026/03/Flavours-of-Desire-Module-2-audio-NL.mp3` (audio/mpeg, 3.29 MB, uploaded 2026-03-28)
- `2026/03/Flavours-of-Desire-Module-1-audio-NL.mp3` (audio/mpeg, 6.48 MB, uploaded 2026-03-28)
- `2026/03/Flavours-of-Desire-Module-3-audio-NL.mp3` (audio/mpeg, 2.29 MB, uploaded 2026-03-28)

Video / external media:

- `/nl/flavours-of-desire-3/` embeds a Vimeo player: `<iframe title="INTRO Flavours of Desire NL" src="https://player.vimeo.com/video/1177988427?dnt=1&app_id=122963" width="500" height="281">` (also in the REST content). No EN/FR counterpart is embedded on the EN/FR Flavours pages.
- Post `kickstarter` (id 2008, `/nl/2017/12/20/kickstarter/`) links `<a href="https://swaanelauwaert.com/wp-content/uploads/sites/50/2018/01/Actually.mov">Actually</a>` under "Watch our promofilm here:" — the file returns HTTP 404 on the origin (`mirror/meta/fetch-failed.txt`); not recoverable from the mirror.
- Posts contain 2 YouTube iframes (`www.youtube.com`) and 2 plain `youtube.com` links; no `<video>`/`<audio>` elements and no `[video]`/`[audio]` shortcodes anywhere.
- Posts hot-link 4 images from `static.xx.fbcdn.net` (Facebook CDN) — not mirrored, likely dead; identify them during content migration and drop or replace.

## 5. Blog images (210 posts, all Dutch)

Method: every `…/wp-content/uploads/sites/50/…` URL in `content.rendered` (img `src`, `srcset`, `<a href>`) plus `jetpack_featured_media_url`, from `mirror/api/posts-p1..3.json`. All referenced hosts are `swaanelauwaert.com` (no Photon/i0.wp.com URLs in post bodies).

| metric | value |
|---|---|
| distinct upload URLs referenced (any size variant) | **2,027** |
| …of which present locally at that exact variant | 1,135 |
| …resolved to the original (variant missing, original present) | 869 |
| …resolved to another variant | 12 |
| …missing entirely | 11 |
| distinct originals (size suffix stripped) | **863** (715 `.jpg`, 64 `.jpeg`, 80 `.png`, 2 `.gif`, 1 `.mov`, 1 extension-less `2012/04/IMG_2628`) |
| originals present as the original file | **787** |
| originals present only as `-WxH`/`-scaled` renditions | **66** (mostly 2012–2013 iPhone photos where the origin only serves up to `-2048x1530`; largest available variant is 2048 px) |
| originals missing (404 on origin) | **11**: `2012/04/IMG_25962.jpg`, `2012/04/IMG_2605.jpg`, `2012/04/IMG_2609.jpg`, `2012/04/IMG_2610.jpg`, `2012/04/IMG_2628` (no extension; `IMG_2628.jpg` exists and is probably the intended file), `2012/09/IMG_3390.jpg`, `2012/09/IMG_3398.jpg` (posts 4174 and 547), `2018/01/Actually.mov` (post 2008), `2020/05/IMG_0454-1.jpg`, `2020/05/IMG_3255-kopiëren-e1589139128265.jpg`, `2020/05/eea1bb7a72db978c00664312f83d2208.jpg` (post 1273) |
| posts with a featured image | 209 / 210 (missing: 1273 (`oproep`)) |
| posts with no upload reference at all | 0 |

Originals referenced by posts, by upload year: 2012: 202 · 2013: 11 · 2014: 35 · 2015: 84 · 2016: 18 · 2017: 32 · 2018: 282 · 2020: 199 (the 2020/05 and 2020/11 batches appear to be re-uploads made when the blog was moved onto this WordPress install — 2012–2015 posts reference them). Missing originals by year: 2012: 7 · 2018: 1 · 2020: 3.

`mirror/meta/fetch-list.txt` (633 originals the workflow fetches into `mirror/media`): 2012: 110 · 2013: 2 · 2014: 35 · 2015: 84 · 2016: 18 · 2017: 32 · 2018: 206 · 2020: 146. Local presence at audit time: 623 present, 10 absent (= the 10 lines in `fetch-failed.txt`, all HTTP 404: the 7 × 2012, `Actually.mov`, 3 × 2020 listed above). Note the fetched copies were downscaled by `shrink.mjs`: **for upload years 2014–2017 the repo holds only the ≤ 2000 px re-encoded copies, never the true originals** (those years exist only under `mirror/media`); 2012, 2013, 2018, 2020 and 2026 have untouched originals under `mirror/raw` for the files wget reached.

Local upload inventory (both trees): 1,721 files; 967 original-named files + 754 `-WxH` renditions; by year — 2012: 316 · 2013: 37 · 2014: 35 · 2015: 84 · 2016: 18 · 2017: 32 · 2018: 505 · 2020: 347 · 2026: 346 · fonts: 1. 170 `-scaled` files, for 126 of which the un-scaled original is also present.

`media-p1.json` (99 newest attachments, ids 4748–5930, all 2026): 66 JPEG, 3 PNG, 1 WebP, 1 SVG, 19 PDF, 9 MP3 — all 99 present locally (`mirror/media`, the 2026 JPEGs mostly also in `mirror/raw`). `alt_text` is empty on all 99; captions exist on 11 (two `Screenshot`, nine auto-generated MP3 captions). Older attachments' metadata (alt, caption, which post they belong to) is **not** in the mirror.

## 6. Recommendations for the rebuild

### 6.1 Hero-sized images that need responsive variants

| image | original | where / how rendered | recommendation |
|---|---|---|---|
| `U/2026/01/6e3a90a15445da501f34e5ad94b4684d-e1768508723726.jpg` | 1280×577, 154 KB (the `-e…` suffix means a crop made in the WP editor; the uncropped source is not in the mirror) | `/en/`, `/nl/`, `/fr/` home hero: `wp-block-cover.alignfull.has-parallax`, CSS `background-image`, `background-position:50% 50%`, min-height ≈ 730 px at 1440 wide (local render `en--desktop.png`), content "Swaane Lauwaert" bottom-left. On desktop it is upscaled ≈ 1.1× | Also the `og:image` of all three home pages. Generate 640 / 960 / 1280 AVIF+WebP; cannot go above 1280 without the source — ask the owner for the original photo. Replace the parallax (`background-attachment: fixed`) with a plain `object-fit: cover` `<img>`; fixed backgrounds do not work on iOS anyway. |
| `U/2026/08/DSC03534.jpg` (+ `-scaled.jpg` 2560×1707, `-2048x1365`, `-1536x1024`, `-1024x683`, `-768x512`, `-300x200`) | 2560×1707, 401 KB | `/en/work-with-me/`, `/fr/accompagnement/`, `/nl/samenwerken/`: `wp-block-cover.alignfull is-position-bottom-center`, `<img class="wp-block-cover__image-background" data-object-fit="cover">`, dim 10 %, ≈ 1440×840 on desktop, headline "We don't heal alone, we heal together." bottom-left | Keep the 2560 master; emit 640 / 1024 / 1536 / 2048 / 2560 (AVIF/WebP, JPEG fallback), `fetchpriority="high"`, `sizes="100vw"`. |
| `U/2026/02/DSCF0973-1-scaled.jpg` | 2560×1920, 991 KB | `/nl/maria-magdalena-retreat-zuid-frankrijk-2027/` page featured image (`wp-block-post-featured-image`, rendered as the page's lead image; also the page's `og:image`) | 768 / 1280 / 1920 / 2560 variants; this page also repeats the same photo in its gallery (`DSCF0973-1-1024x768.jpg`). |
| Journal post thumbnails (`2018/09/*`, `2018/10/*`, 2560 px `-scaled` and 2000×2400 originals, 140–585 KB each) | up to 2560 px | `/nl/journal/` query loop, 3 columns ≈ 430 px wide cards (`sizes="(max-width: 2560px) 100vw, 2560px"` — the browser picks a rendition at least as wide as the viewport, i.e. 1536–2560 px for a 430 px card) | Generate 480 / 768 / 1024 card variants and the same for every post-listing page (category/tag/author/the journal). This is the single biggest bandwidth saving on the site. |
| Retreat gallery, `/nl/maria-magdalena-retreat-zuid-frankrijk-2027/` (32 images, `columns-default is-cropped`, ≈ 3 per row ≈ 450 px wide) | 11 of them 2576–4080 px originals, 1.8–7.8 MB, requested through `srcset … 2048w` or directly (`DSCF0871.jpg` 4000×3000 / 7.75 MB is the `src` itself) | | Serve from the `-scaled` 2560 copies at most; emit 480 / 768 / 1024 / 1536; never ship the >2 MB originals. |

Everything else on static pages renders at ≤ 736 px (cover cards, media-text, galleries of 3, inline images) or ≤ 580 px (Flavours of Desire columns), so the existing 700–1200 px originals are sufficient; just emit 1× and 2× WebP/AVIF (e.g. 400 / 800) and keep the JPEG as fallback.

### 6.2 Oversized files (> 1.5 MB) — 77 files

Images here should be downscaled to ≤ 2048 px long edge (or 2560 for the two heroes) and re-encoded (mozjpeg q80–85 / AVIF). The 2026 gallery/retreat photos already have `-scaled` (2560 px) and smaller renditions that can simply be used instead. The 2012 iPhone photos (2592×1936) are referenced by old posts via `-1024x765`-style renditions; the originals only matter if a lightbox is planned. PDFs/MP3s are downloads — keep as is (consider `pdfcpu`/`gs` optimisation for the 2–3.6 MB PDFs).

| file (`wp-content/uploads/sites/50/`) | px | size | copy | smaller variants in mirror |
|---|---|---|---|---|
| `2026/02/DSCF0871.jpg` | 4000x3000 | 7.75 MB | raw | scaled |
| `2026/02/20250409_123001.jpg` | 4080x3060 | 6.75 MB | raw | scaled |
| `2026/03/Flavours-of-Desire-Module-1-audio-NL.mp3` | — | 6.48 MB | media | — |
| `2026/02/20250408_095402.jpg` | 4080x3060 | 6.25 MB | raw | scaled |
| `2026/02/DSCF0867.jpg` | 4000x3000 | 5.12 MB | raw | scaled |
| `2026/02/DSCF0921.jpg` | 4000x3000 | 4.54 MB | raw | scaled |
| `2026/02/20250408_153841.jpg` | 4080x3060 | 4.26 MB | raw | scaled |
| `2026/02/20250408_182245.jpg` | 4080x3060 | 4.12 MB | raw | scaled |
| `2026/03/Flavours-of-Desire-Module-4c-audio-NL.mp3` | — | 3.98 MB | media | — |
| `2026/02/20250411_084835.jpg` | 4080x3060 | 3.87 MB | raw | scaled |
| `2026/03/The-Intimacy-Quiz.pdf` | — | 3.43 MB | media | — |
| `2026/03/Flavours-of-Desire-Module-2-audio-NL.mp3` | — | 3.29 MB | media | — |
| `2018/07/20180613_134413.jpg` | 5312x2988 | 3.28 MB | raw | — |
| `2026/08/PLAYbeeld-voor-op-flowdesk.jpg` | 1884x1813 | 3.18 MB | media,raw | 300x289, 768x739, 1024x985, 1536x1478 |
| `2018/07/20180622_074029.jpg` | 5312x2988 | 2.97 MB | raw | — |
| `2018/07/20180718_162053-2.jpg` | 5312x2988 | 2.94 MB | raw | 300x169, 768x432, 1024x576, 1536x864, 2048x1152, scaled |
| `2012/09/IMG_0044.jpg` | 1936x2592 | 2.89 MB | raw | — |
| `2012/05/IMG_1856.jpg` | 2592x1936 | 2.87 MB | raw | — |
| `2026/02/IMG_5492.jpeg` | 2160x3840 | 2.87 MB | raw | scaled |
| `2012/09/IMG_3381.jpg` | 2592x1936 | 2.83 MB | raw | — |
| `2012/09/IMG_0040.jpg` | 1936x2592 | 2.71 MB | raw | — |
| `2026/03/Flavours-of-Desire-Module-4a-audio-NL.mp3` | — | 2.71 MB | media | — |
| `2012/07/IMG_2660.jpg` | 2592x1936 | 2.54 MB | raw | — |
| `2012/09/IMG_0019.jpg` | 1936x2592 | 2.53 MB | raw | — |
| `2012/06/IMG_2464.jpg` | 1936x2592 | 2.53 MB | raw | — |
| `2012/05/IMG_1878.jpg` | 2592x1936 | 2.48 MB | raw | — |
| `2012/06/IMG_2502.jpg` | 2592x1936 | 2.45 MB | raw | — |
| `2012/04/IMG_1705.jpg` | 1936x2592 | 2.44 MB | raw | — |
| `2012/09/IMG_0015.jpg` | 2592x1936 | 2.34 MB | raw | — |
| `2012/07/IMG_2752.jpg` | 2592x1936 | 2.34 MB | raw | — |
| `2012/05/IMG_1875.jpg` | 2592x1936 | 2.30 MB | raw | 300x224, 768x574, 1024x765, 1536x1147, 2048x1530, scaled |
| `2026/03/De-Boodschappenlijst.pdf` | — | 2.30 MB | media | — |
| `2026/03/Flavours-of-Desire-Module-3-audio-NL.mp3` | — | 2.29 MB | media | — |
| `2026/03/Shopping-List.pdf` | — | 2.29 MB | media | — |
| `2012/07/IMG_2703.jpg` | 1936x2592 | 2.26 MB | raw | — |
| `2026/02/20250408_095452.jpg` | 2576x1932 | 2.25 MB | raw | scaled |
| `2026/03/Flavours-of-Desire-Module-4b-RECEPT-1001-nachten-NL.mp3` | — | 2.24 MB | media | — |
| `2012/05/IMG_1849.jpg` | 2592x1936 | 2.22 MB | raw | — |
| `2026/02/20250408_124919.jpg` | 2576x1932 | 2.20 MB | raw | scaled |
| `2012/04/IMG_1690.jpg` | 2592x1936 | 2.17 MB | raw | — |
| `2012/06/IMG_25052.jpg` | 2592x1936 | 2.14 MB | raw | — |
| `2026/02/20250408_132844.jpg` | 2576x1932 | 2.14 MB | raw | scaled |
| `2012/06/IMG_2460.jpg` | 2592x1936 | 2.13 MB | raw | — |
| `2012/07/IMG_2705.jpg` | 2592x1936 | 2.10 MB | raw | — |
| `2012/06/IMG_24151.jpg` | 2592x1936 | 2.10 MB | raw | — |
| `2012/07/IMG_2710.jpg` | 1936x2592 | 2.07 MB | raw | — |
| `2012/07/IMG_2711.jpg` | 2592x1936 | 2.02 MB | raw | — |
| `2012/09/IMG_0036.jpg` | 1936x2592 | 2.02 MB | raw | — |
| `2026/06/Workbook-module-6-Engels.pdf` | — | 2.01 MB | media | — |
| `2026/06/Workbook-module-6-Nederlands.pdf` | — | 2.01 MB | media | — |
| `2026/05/Workbook-module-3-Nederlands.pdf` | — | 2.00 MB | media | — |
| `2026/05/Workbook-module-3-ENGLISH.pdf` | — | 2.00 MB | media | — |
| `2012/09/IMG_0054.jpg` | 2592x1936 | 1.99 MB | raw | — |
| `2026/03/Flavours-of-Desire-Module-5-audio-NL.mp3` | — | 1.96 MB | media | — |
| `2012/04/IMG_1708.jpg` | 2592x1936 | 1.92 MB | raw | — |
| `2012/07/IMG_2751.jpg` | 2592x1936 | 1.91 MB | raw | — |
| `2012/07/IMG_2757.jpg` | 2592x1936 | 1.91 MB | raw | — |
| `2012/05/IMG_1826.jpg` | 2592x1936 | 1.90 MB | raw | — |
| `2012/07/IMG_2720.jpg` | 1936x2592 | 1.87 MB | raw | 224x300, 765x1024, 768x1028, 1147x1536, 1530x2048, scaled |
| `2026/02/IMG_4871.jpeg` | 2048x1536 | 1.81 MB | media,raw | 300x225, 768x576, 1024x768, 1536x1152 |
| `2012/09/IMG_0033.jpg` | 1936x2592 | 1.81 MB | raw | — |
| `2012/06/IMG_2450.jpg` | 2592x1936 | 1.80 MB | raw | — |
| `2026/02/20250407_155915.jpg` | 4080x3060 | 1.79 MB | raw | scaled |
| `2012/09/IMG_0027.jpg` | 2592x1936 | 1.79 MB | raw | — |
| `2018/05/Instant_20180523_150717.jpeg` | 2400x2000 | 1.78 MB | raw | 300x250, 768x640, 1024x853, 1536x1280, 2048x1707 |
| `2018/09/20180830_105528-B.jpg` | 2988x5312 | 1.74 MB | raw | 169x300, 576x1024, 768x1365, 864x1536, 1152x2048, scaled |
| `2012/07/IMG_2700.jpg` | 1936x2592 | 1.71 MB | raw | — |
| `2012/04/IMG_1698.jpg` | 2592x1936 | 1.70 MB | raw | 300x224, 768x574, 1024x765, 1536x1147, 2048x1530, scaled |
| `2012/04/IMG_1712.jpg` | 2592x1936 | 1.62 MB | raw | — |
| `2012/06/IMG_25791.jpg` | 2592x1936 | 1.62 MB | raw | — |
| `2012/07/IMG_2699.jpg` | 1936x2592 | 1.61 MB | raw | — |
| `2026/05/Workbook-module-1-Nederlands.pdf` | — | 1.56 MB | media | — |
| `2026/05/Workbook-Module-1-English-1-2.pdf` | — | 1.56 MB | media | — |
| `2012/07/IMG_2637.jpg` | 2592x1936 | 1.56 MB | raw | — |
| `2012/07/IMG_26332.jpg` | 2592x1936 | 1.51 MB | raw | — |
| `2018/05/Instant_20180526_173911.jpeg` | 2000x2400 | 1.45 MB | raw | 250x300, 768x922, 853x1024, 1280x1536, 1707x2048 |
| `2018/03/DSCF3419-copy.jpg` | 4000x3000 | 1.44 MB | raw | — |

### 6.3 Duplicates

Byte-identical files under different names/paths (MD5 match across `mirror/raw` + `mirror/media`):

| identical files (same MD5) | px | size |
|---|---|---|
| `2012/05/IMG_2871.jpg` = `2015/04/IMG_2871.jpg` | 800x600 | 65 KB |
| `2012/06/DSCF9917.jpg` = `2018/02/DSCF9917.jpg` | 480x640 | 95 KB |
| `2018/02/DSCF3436-copy-scaled.jpg` = `2018/03/DSCF3436-copy-scaled.jpg` | 2560x1920 | 117 KB |
| `2018/07/36575602_10157570573334832_6948954268258795520_o-1-167x300.jpg` = `2018/07/36575602_10157570573334832_6948954268258795520_o-167x300.jpg` | 167x300 | 6 KB |
| `2018/07/36575602_10157570573334832_6948954268258795520_o-1-569x1024.jpg` = `2018/07/36575602_10157570573334832_6948954268258795520_o-569x1024.jpg` | 569x1024 | 22 KB |
| `2018/07/36575602_10157570573334832_6948954268258795520_o-1-768x1382.jpg` = `2018/07/36575602_10157570573334832_6948954268258795520_o-768x1382.jpg` | 768x1382 | 32 KB |
| `2018/07/36575602_10157570573334832_6948954268258795520_o-1.jpg` = `2018/07/36575602_10157570573334832_6948954268258795520_o.jpg` | 800x1440 | 27 KB |
| `2018/07/36728162_10157572469799832_6091809500421947392_o-1-1280x1536.jpg` = `2018/07/36728162_10157572469799832_6091809500421947392_o-1280x1536.jpg` | 1280x1536 | 202 KB |
| `2018/07/36728162_10157572469799832_6091809500421947392_o-1-250x300.jpg` = `2018/07/36728162_10157572469799832_6091809500421947392_o-250x300.jpg` | 250x300 | 14 KB |
| `2018/07/36728162_10157572469799832_6091809500421947392_o-1-768x922.jpg` = `2018/07/36728162_10157572469799832_6091809500421947392_o-768x922.jpg` | 768x922 | 83 KB |
| `2018/07/36728162_10157572469799832_6091809500421947392_o-1-853x1024.jpg` = `2018/07/36728162_10157572469799832_6091809500421947392_o-853x1024.jpg` | 853x1024 | 100 KB |
| `2018/07/36728162_10157572469799832_6091809500421947392_o-1.jpg` = `2018/07/36728162_10157572469799832_6091809500421947392_o.jpg` | 1679x2015 | 267 KB |
| `2026/02/IMG_5348-1-1152x1536.jpg` = `2026/08/IMG_5348-1152x1536.jpeg` | 1152x1536 | 211 KB |
| `2026/02/IMG_5348-1-225x300.jpg` = `2026/08/IMG_5348-225x300.jpeg` | 225x300 | 28 KB |
| `2026/02/IMG_5348-1-768x1024.jpg` = `2026/08/IMG_5348-768x1024.jpeg` | 768x1024 | 115 KB |
| `2026/02/IMG_5348-1.jpg` = `2026/08/IMG_5348.jpeg` | 1536x2048 | 721 KB |
| `2026/02/IMG_5348-1.jpg` = `2026/08/IMG_5348.jpeg` | 1500x2000 | 311 KB |
| `2026/04/4e2393ae5131da6865a0a5c17d2fdf83-1.jpg` = `2026/04/4e2393ae5131da6865a0a5c17d2fdf83.jpg` | 720x900 | 27 KB |

Same picture re-uploaded or re-saved (same stem and pixel size, different bytes):

- `2018/01/15380554_10155567238744832_6438037801427922619_n.jpeg` (24 KB) and `….jpeg.webp` (16 KB) — the About portrait in JPEG and WebP; keep one master, let the build emit WebP.
- `2026/03/Flavours-of-Desire-E-book-ENGLISH.pdf` (1,002,312 B) vs `2026/03/Flavors-of-Desire-E-book-ENGLISH.pdf` (988,934 B) — two uploads of the English e-book, different spelling, different bytes; ask which is current.
- `2026/05/Workbook-module-3-ENGLISH.pdf` (2.10 MB) vs `2026/06/Workbook-module-3-Engels.pdf` (702 KB) and `2026/05/Workbook-module-3-Nederlands.pdf` (2.10 MB) vs `2026/06/Workbook-Module-4-Nederlands.pdf` (706 KB) — module 3/4 workbooks uploaded twice in May and June; the June files are probably revisions.
- 61 `name-scaled.jpg` / `name.jpg` pairs with identical pixel size (e.g. `2018/03/DSCF3232-scaled.jpg` = `DSCF3232.jpg` at 2000×1500) — artefacts of the `shrink.mjs` step in `mirror/media`, not real duplicates on the origin; after shrinking, the "original" and the "-scaled" copy converge. Keep only one per pair in the rebuild.
- `2020/05/IMG_1082.jpg?fit=900,672&quality=95&ssl=1` under `mirror/raw` is a Photon-style query-string URL that wget saved as a separate file (895 KB, 2592×1936); it is the same photo as `2020/05/IMG_1082.jpg`.

### 6.4 Proposed `public/media/` layout

The scaffold already has `public/media/<YYYY>/<MM>/<file>` (901 files, 212 MB, including 74 `-WxH` renditions copied verbatim) and `public/fonts/`. Suggested refinement:

```
public/
  favicon.ico, favicon.svg (vectorised pomegranate), apple-touch-icon.png (180), icon-192.png, icon-512.png
  fonts/                      Literata (only the weights used), Beiruti-VariableFont_wght.woff2, floreal.woff
  media/
    blog/<YYYY>/<MM>/<original-name>.<ext>     one master per image (the untouched raw copy where it exists,
                                               else the largest rendition); no -WxH files — let Astro
                                               (`astro:assets` / sharp) emit 480/768/1024/1536 AVIF+WebP
    site/                     the 88 static-page images with semantic names, e.g.
      home/hero-pomegranate.jpg (6e3a90…-e1768508723726.jpg)
      home/portrait-garden.jpg (MVIMG_20260817_163022_1.jpg)
      home/gallery-kitchen.jpg, gallery-field.jpg, gallery-cooking.jpg
      coaching/hero-desk.jpg (DSC03534.jpg), coaching/portrait-bw.png (Screenshot-2026-10-10-105756.png)
      flavours/… (7 files), eros/… (10), rituals/… (7), cookbook/… (6), retreat/… (34), play/… (4), sainte-baume/… (1), about/portrait.jpg, journal/thumbs via blog/
    docs/                     19 PDFs (keep original file names — they are the download names users see)
    audio/                    9 MP3s
```

Keep a `redirects` map from every original `wp-content/uploads/sites/50/<YYYY>/<MM>/<file>` (and `-WxH` variant) to the new path so that inbound links and the 2,027 URLs inside old post bodies keep working, or keep the blog masters at the WordPress path (`/wp-content/uploads/sites/50/...` is also an acceptable public path for a static host). Gate `docs/` and `audio/` behind the planned portal (they are password-protected on the live site).

### 6.5 Other rebuild notes

- `-eNNNNNNNNNNNNN` suffixes (e.g. `-e1768508723726`) mark images edited in the WP editor (crop/rotate); the un-edited source is not in the mirror unless listed separately.
- `-scaled` files are what WordPress serves as "full size" when the upload exceeded 2560 px; the file without the suffix is the untouched upload.
- All static-page `<img>` tags have empty `alt`; the only alt text in the mirror are post titles on post cards. Media-library `alt_text` is empty for everything the API returned.
- `sizes` attributes on the live site are mostly `auto, (max-width: Npx) 100vw, Npx` with N = intrinsic width — they do not reflect the real rendered width (e.g. 2560 px thumbnails in 430 px cards), so do not copy them.
- Jetpack Photon (`i0.wp.com`) is only used in `og:image:secure_url`; `wp-content/uploads` URLs are served directly — no CDN rewriting to replicate.

## 7. Gaps — what the mirror cannot tell

1. Assets of the five password-protected module pages and of `/en/werk-met-mij/` (no HTML, empty REST body). Only the media-library attachment list (section 4) hints at them: PDFs, MP3s, `2026/05/neijing-tu-print-for-web-700mb-scaled-1.webp`, `2026/05/Microcosmic_orbite.png`, and the Vimeo intro. Media id 5431 `2026/07/the-taste-of-her-journey.jpg` (519×699) is attached to post id 5430, which is not among the 210 published posts or 35 pages (a draft or private post, not retrievable).
2. The full-size site icon (512×512) and the 270×270 tile image are not in the mirror; only 32/180/192 crops are.
3. `U/2018/01/Actually.mov` and the 10 blog originals in `fetch-failed.txt` return 404 on the origin — they are gone unless the owner has them.
4. For 2014–2017 uploads (169 files) the repo only holds the ≤ 2000 px re-encoded copies produced by `shrink.mjs`; the true originals were never stored. For the 12 paths that exist in both trees with different bytes (listed in the preamble) the `mirror/raw` copy is the original and the `mirror/media` copy is the shrunk one — always take `mirror/raw`.
5. The home hero is a 1280×577 editor crop; the uncropped photo is unknown.
6. The second Eros Sanctuary gallery is in the HTML but not visible in the local render — whether it shows on the live site could not be verified.
7. `media-p1.json` covers only the 99 newest attachments, so captions/alt text/attachment relations for 2012–2020 images are unknown; posts' `media_details` for featured images (exact rendition list) are not in the dump either.
8. Whether the live site serves WebP/AVIF conversions for all images (LiteSpeed Cache image optimisation) could not be confirmed — only the About portrait shows a `.jpeg.webp` sibling being requested.
9. The Substack SVG (uploaded 2026-10-19, after the crawl) is unattached; where it appears on the live site is unknown.
