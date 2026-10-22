# Blog ("The Journal") audit — swaanelauwaert.com

Scope: everything the rebuild needs to recreate the blog (listing pages, archives, single posts, URL scheme, content model, assets). Sources are only the local mirror in this repo — the live site was not reachable. Companion documents: `docs/audit/chrome.md` (header/footer/head tags shared by every page) and `docs/audit/design-system.md` (fonts, colours, block CSS; sections 5.9–5.13 cover the blog components). This document does not repeat those; it references them.

| Source | Path (repo-relative) | Used for |
|---|---|---|
| REST posts dump (all 210 published posts, `_embed`ded author/featured media/terms) | `mirror/api/posts-p1.json`, `posts-p2.json`, `posts-p3.json` (100 + 100 + 10). `posts-nl-*`, `posts-en-*`, `posts-fr-*` are byte-identical copies (same md5) — the `lang` filter did nothing. | content model, content HTML, featured images |
| Taxonomies / users | `mirror/api/categories-p1.json`, `tags-p1.json`, `users-p1.json`, `taxonomies.json`, `types.json`, `root.json` | joins, plugins, timezone |
| Pages dump | `mirror/api/pages-p1.json` (the three journal pages are ids 78 nl, 48 en, 80 fr) | listing-page record |
| Rendered HTML | `mirror/raw/swaanelauwaert.com/nl/journal/…`, `en/the-journal/…`, `fr/le-journal/…`, `nl/category/*`, `nl/tag/*`, `nl/author/*`, 76 post pages under `nl/YYYY/MM/DD/<slug>/`. Every HTML file has an untouched twin with the original absolute URLs: `index.html.orig` / `nl.orig` etc. — quote from the `.orig` files. | templates, labels, pagination |
| Sitemaps / crawl metadata | `mirror/meta/child-wp-sitemap-posts-post-1.xml` (210 post URLs), `child-wp-sitemap-taxonomies-category-1.xml`, `…post_tag-1.xml`, `…users-1.xml`, `fetch-failed.txt` (10 × HTTP 404), `headers.txt` | URL inventory, broken assets |
| Local renders | `/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/local-shots/nl-journal--desktop.png`, `nl-journal--mobile.png`, `en-the-journal--desktop.png`, `nl-author-swaanelauwaert--desktop.png`, `nl-2018-10-17-cent-vingt-deux--desktop.png`, `nl-2012-05-10-de-joskes--desktop.png` (plus `nl-category-*`, `nl-tag-emigreren-frankrijk-*`, `nl-2018-08-10-cent-cinq-*`, `nl-2018-07-05-het-lang-verwachte-verhaal-*`, `nl-2013-01-17-de-troostende-berg-2-*`) | look & feel |

`mirror/pages.json`, `mirror/pages-index.json` and `mirror/screenshots/` were not used (rate-limited run).

---

## 1. Content model (from the REST dump)

### 1.1 Headline numbers

| Fact | Value |
|---|---|
| Posts | **210**, all `status: publish`, `type: post`, `format: standard`, `sticky: false`, `template: ""`, `jetpack_sharing_enabled: true` |
| Language | **all 210 are Dutch**: every `link` starts with `https://swaanelauwaert.com/nl/`. No EN or FR posts exist (the EN/FR journal pages render a "no results" block, see §2.2). |
| Date range | first `2012-04-22T05:25:00` (`test-post-1`, title "Pasta met tomatensaus"), last `2018-10-17T14:39:14` (`cent-vingt-deux`). Nothing after October 2018. |
| `modified` | identical to `date` for all 210 posts (no edits recorded after publication; `date == date_gmt` for all 210 — see §1.9 on time zone). |
| Author | all 210 by user **1342 `swaanelauwaert`** (display name `swaanelauwaert`, slug `swaanelauwaert`, empty `description`/`url`, Gravatar `f25c00cc…` with `d=mm`). The second user in `users-p1.json`, **1340 `saintebaumeguide`**, has no posts. REST author link is the language-less `https://swaanelauwaert.com/author/swaanelauwaert/`; the rendered archive URL is `/nl/author/swaanelauwaert/`. |
| Comments | `comment_status: open` on 209, `closed` on 1 (id 1396 `petit-petit-loiseau-fait-son-nid`, 2014-06-11). `ping_status` same split. Comment *counts* are not in the dump; see §3.6 for the 177 comments visible in the 76 mirrored pages. |
| Featured image | **209 of 210** have `featured_media != 0` and a `jetpack_featured_media_url`. The only post without one: **`charlie-de-week-van-swaane`** (2015-01-07, id 2087; its `class_list` lacks `has-post-thumbnail`). All 209 featured files are present locally (70 under `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/…`, 139 under `mirror/media/wp-content/uploads/sites/50/…`). |
| Categories used | 8 of the 19 defined (see §1.3) |
| Tags used | 6 of the 7 defined; only **17 posts** (all 2012, category "On est parti!") carry tags (see §1.4) |
| Origin | `guid.rendered` hosts: `swaanelauwaert.be/?p=N` (158 posts) and `onestparti.be/?p=N` (52 posts) — the content was imported from two earlier WordPress blogs. Old URL structures are unknown (gap). |

**Posts per year**: 2012 **22** · 2013 **11** · 2014 **18** · 2015 **15** · 2016 **7** · 2017 **13** · 2018 **124**.
Busiest months: 2018-03 (25), 2018-05 (24), 2018-02 (17), 2018-07 (16), 2018-04 (16), 2018-08 (11) — the "une par jour" photo series (§1.6).

### 1.2 Field list of a post object

Top level: `id`, `date`, `date_gmt`, `guid{rendered}`, `modified`, `modified_gmt`, `slug`, `status`, `type`, `link`, `title{rendered}`, `content{rendered, protected}`, `excerpt{rendered, protected}`, `author`, `featured_media`, `comment_status`, `ping_status`, `sticky`, `template`, `format`, `meta{…}`, `categories[]`, `tags[]`, `class_list[]`, `jetpack_publicize_connections[]`, `jetpack_sharing_enabled`, `jetpack_featured_media_url`, `_links{…}`, `_embedded{author[], wp:featuredmedia[], wp:term[[categories],[tags]]}`.

`meta` keys (same on every post): `advanced_seo_description` (always `""`), `jetpack_seo_html_title` (`""`), `jetpack_seo_noindex` (`false` on all 210), `jetpack_seo_schema_type` (`""`), `_themeisle_gutenberg_block_has_review`, `_jetpack_feature_clip_id`, `_jetpack_memberships_contains_paid_content` (false), `footnotes` (`""`), `jetpack_publicize_message` (`""`), `jetpack_publicize_feature_enabled`, `jetpack_social_post_already_shared`, `jetpack_social_options`. Nothing in `meta` is needed for the rebuild.

`_embedded["wp:featuredmedia"][0]` carries for every featured image: `id`, `slug`, `title`, `alt_text` (non-empty on **1** of 209), `caption` (non-empty on **2**), `mime_type` (189 jpeg, 19 png, 1 gif), `source_url`, `media_details{width,height,file,filesize,sizes{thumbnail,medium,medium_large,large,1536x1536,2048x2048,full}}`. Orientation: 132 landscape, 77 portrait. 113 of the 209 `source_url`s end in `-scaled.jpg` (WordPress big-image threshold: original > 2560 px). Upload folders of featured images: 2012 (19), 2013 (2), 2014 (5), 2015 (12), 2016 (3), 2017 (5), **2018 (145)**, 2020 (18). This embedded block is the only complete media inventory — `mirror/api/media-p1.json` holds just the 99 most recent attachments.

`class_list` (useful for CSS parity): `post-N post type-post status-publish format-standard has-post-thumbnail hentry category-<slug> [tag-<slug>…]`.

`excerpt.rendered` is the WordPress auto-excerpt (first ~55 words + `[&hellip;]`); for the one-line 2018 posts it equals the full text. Jetpack uses it for `meta description` / `og:description` (e.g. `It&#8217;s all about my kingz. (Aubagne).`).

### 1.3 Categories (`categories-p1.json`, joined with posts)

| id | slug | name (verbatim) | posts | archive URL |
|---|---|---|---|---|
| 40 | `une-par-jour` | `une par jour` | **120** | `/nl/category/une-par-jour/` |
| 32 | `on-est-parti` | `On est parti!` | **70** | `/nl/category/on-est-parti/` |
| 24 | `charlie-rubriek` | `Charlie Rubriek` | 19 | `/nl/category/charlie-rubriek/` |
| 34 | `poezie` | `Poëzie` | 7 | `/nl/category/poezie/` |
| 28 | `kortverhaal` | `Kortverhalen` | 6 | `/nl/category/kortverhaal/` |
| 30 | `non-fictie` | `Non-fictie` | 6 | `/nl/category/non-fictie/` |
| 26 | `interviews` | `Interviews` | 3 | `/nl/category/interviews/` |
| 20 | `actually-magazine` | `Actually, Magazine` | 2 | `/nl/category/actually-magazine/` |

Sum = 233 > 210 because **23 posts have two categories**: 4 "une par jour" posts also in "On est parti!" (`cent-dix-neuf`, `cent-dix-huit`, `cent-cinq`, `quatre-vingt-dix-huit`) and all 19 "Charlie Rubriek" posts are also in "On est parti!". No post has zero categories. All categories are flat (`parent: 0`), `description` empty, `count` in the API equals the joined count.

Empty categories that exist in WordPress but have **0 posts** (not in the sitemap; the live site presumably serves empty archives for them): nl `geen-categorie` (1, "Geen categorie"), `auparleur-be` (22, "AuParleur.be"), `polaroid-love` (36, "polaroidLOVE."), `de-binnenruimte` (94, "De Binnenruimte"), `leven` (109, "Leven"); en `uncategorized` (10), `inner-room` (99, "Inner Room"), `life` (107, "Life"); fr `non-categorise` (14, "Non-catégorisé"), `lespace-interieur` (97, "L'Espace Intérieur"), `la-vie` (111, "La vie"). The en/fr/nl triplets ("Inner Room"/"De Binnenruimte"/"L'Espace Intérieur", "Life"/"Leven"/"La vie") look like Polylang translations prepared for a future multilingual blog that was never filled.

### 1.4 Tags (`tags-p1.json`)

| id | slug | name (verbatim) | posts | archive URL |
|---|---|---|---|---|
| 44 | `emigreren-frankrijk` | `emigreren frankrijk` | 16 | `/nl/tag/emigreren-frankrijk/` |
| 50 | `groen-leven` | `groen leven` | 9 | `/nl/tag/groen-leven/` |
| 52 | `moestuin-2` | `moestuin` | 5 | `/nl/tag/moestuin-2/` |
| 42 | `bouwen-in-stro-en-leem` | `bouwen in stro en leem` | 2 | `/nl/tag/bouwen-in-stro-en-leem/` |
| 46 | `emigreren-naar-frankrijk` | `emigreren naar Frankrijk` | 1 | `/nl/tag/emigreren-naar-frankrijk/` |
| 48 | `food` | `food` | 1 | `/nl/tag/food/` |
| 54 | `pasta-met-tomatensaus` | `Pasta met tomatensaus` | 0 | `/nl/tag/pasta-met-tomatensaus/` |

Tagged posts (17, all 2012-04-22 → 2012-09-04, category "On est parti!"): `test-post-1`, `het-mysterie-van-de-halve-brug`, `lome-dagen`, `de-storm-en-de-mierenhoop` (+groen leven), `de-joskes`, `a-tribute-to-youpie`, `modder-en-rio-de-janeiro`, `home-sweet-home` (+groen leven), `la-vie-en-rose` (+groen leven), `huizenjacht` (+bouwen in stro en leem, groen leven), `het-leven-zoals-het-is-on-the-road-2` (+groen leven, moestuin), `eitjes-met-choco-en-vliegende-herten`, `the-promised-land` (bouwen in stro en leem, emigreren naar Frankrijk, groen leven, moestuin — the only post *without* `emigreren frankrijk`), `stoemp-met-erwten-en-salie` (+groen leven, moestuin), `thuis`, `slaatje-van-courgette-met-thijm-en-citroen` (+food, groen leven, moestuin), `de-overbevolkte-berg-en-een-week-hart` (+groen leven, moestuin). The exact per-post tag list is in Appendix A.

### 1.5 Content statistics (`content.rendered`, 210 posts)

| Measure | Result |
|---|---|
| `<img>` tags | **717** total (713 on `swaanelauwaert.com/wp-content/uploads/sites/50/…`, 4 external Facebook emoji PNGs `https://static.xx.fbcdn.net/images/emoji.php/v9/f6c/1/16/2764.png` in `cent-cinq` ×3 and `cent-dix-neuf` ×1). |
| Images per post | 0 → 12 posts · 1 → **121** · 2 → 7 · 3 → 7 · 4 → 11 · 5 → 7 · 6 → 6 · 7 → 5 · 8 → 8 · 9 → 2 · 10 → 2 · 11 → 6 · 12 → 3 · 13 → 1 · 14 → 4 · 15 → 3 · 17 → 1 · 18 → 2 · 19 → 1 · 21 → 1. Most images: `de-grote-stad-en-het-peperkoekenhuisje` (21, 2014), `la-vie-en-rose` (19, 2012), `tijd-die-door-je-handen-glijdt-en-een-wereld-die-davert` (18, 2015), `ondraaglijke-schoonheid-en-marsmeloenen` (18, 2013). |
| Posts with **no** inline image (12) | `kickstarter`, `withdrawal-sucks`, `part-2`, `limerence`, `elle-se-livrait-a-la-nuit`, `leon-spilliaert`, `open-call`, `chagrin`, `racines`, `zinloos`, `promesse-de-gascon`, `charlie-de-week-van-swaane` (all 2015–2017 poems/announcements; all but the last still have a featured image). |
| Featured image also the first inline image | 52 posts (44 of them 2018 "une par jour") — the 2018 one-photo posts repeat their featured photo in the body. The single template does **not** render the featured image (§3.1), so there is no visible duplication on the live site. |
| `srcset`/`sizes` | present on 434 images (106 posts); `loading="lazy"` on 711, `decoding="async"` on 717; `fetchpriority="high"` is added to the first image only in the rendered page, not in the REST HTML. |
| Size suffix in `src` | none/full-size file **561**; `-1024x765` 61; `-1024x768` 40; `-765x1024` 26; `-1024x678` 8; `-768x1024` 8; `-1024x683` 3; `-664x1024` 3; `-150x150` 1; single occurrences of `-1024x575`, `-1024x685`, `-766x1024`, `-686x1024`, `-689x1024`, `-1024x681`. The sized variants all belong to the 23 block-edited posts (§1.7). |
| Image classes | `wp-image-N` 708, `size-full` 520, `aligncenter` 516 (175 posts), `size-thumbnail` 1, `alignleft` 1 (`helden-van-iran-shahla-sherkat`), `alignnone` 1 (`de-revival-van-laura-en-het-kleine-huis-op-de-prairie`), no `alignright`/`alignwide`/`alignfull`. Block images (`<figure class="wp-block-image">`, 123 figures in 16 posts) carry no alignment/size class at all. |
| Galleries | **10 gallery blocks in 9 posts** (`<ul class="wp-block-gallery columns-3 is-cropped wp-block-gallery-N is-layout-flex …">` ×9, `columns-2` ×1), legacy Gutenberg-v1 gallery markup with 62 `<li class="blocks-gallery-item"><figure><img … data-id data-link>` items; `data-link` points to root-level attachment pages (`https://swaanelauwaert.com/img_8048-2/`). Posts: `goede-voornemens` (2014-01-04), `ondraaglijke-schoonheid-en-marsmeloenen`, `het-wordt-nooit-meer-zoals-vroeger-maar-dat-geeft-vleugels-aan-de-herinnering-dirk-lauwaert`, `de-eeuwige-jachtvelden`, `mensen-zijn-gemaakt-van-dun-papier`, `lente-bedrijvigheid-en-pergolesi` (2 galleries), `verjaardagdramas-en-katten-braakballen`, `de-timmerman-en-de-godfather`, `op-de-barricades-en-tomatenzaadjes` (all 2013 plus one 2014). No `[gallery]` shortcodes, no Jetpack tiled galleries. |
| Embeds | **2 `<iframe>`**, both `www.youtube.com`: `helden-van-iran-shahla-sherkat` (2015-02-03) and `charlie-de-week-van-swaane` (2015-01-07). No `wp-block-embed`, no Instagram/Facebook/Vimeo embeds, no `<video>`/`<audio>`. `kickstarter` links to `wp-content/uploads/sites/50/2018/01/Actually.mov` (HTTP 404 on the live site per `fetch-failed.txt`). |
| Captions | `<figcaption>` **1** (`helden-van-iran-shahla-sherkat`: `<figure id="attachment_2096" … class="wp-caption alignleft"><img class="wp-image-2096 size-thumbnail" src="…/2015/02/Shahla-Sherkat-150x150.jpg"><figcaption class="wp-caption-text">Shahla Sherhat via Radio Zamaneh</figcaption></figure>`); classic `wp-caption` markup in 2 posts (that one and `vrouwen-die-vertrokken-agnieszka-uit-polen`). 190 `<figure>` elements in total (galleries + block images + 2 captions). |
| Headings inside content | 4 posts: `helden-van-iran-shahla-sherkat` (`<h1 class="title">Shahla Sherkat weigert zichzelf monddood te laten maken.</h1>`), `leon-spilliaert` (h1), `vrouwen-die-vertrokken-agnieszka-uit-polen` (h1), `letting-go` (h2 ×2, h3, h6, plus the only `<hr>`). Totals: h1 3, h2 2, h3 1, h6 1. |
| Blockquotes | **0** |
| Lists / tables | `<ul>` only inside the 9 gallery posts (gallery markup); no `<ol>`, no `<table>`, no `<pre>`. |
| Inline styling | `style="…"` in 4 posts (`kickstarter`, `helden-van-iran-shahla-sherkat`, `charlie-de-week-van-swaane`, `goede-voornemens`): `text-align: center` (10 ×, e.g. `<p style="text-align: center"><em>‘A prayer for the wild at heart, kept in cages.’</em></p>`), `width: 150px` on the caption figure. `<em>` 121 (29 posts), `<strong>` 15 (8 posts), `&nbsp;` 324 (44 posts, often `<p>&nbsp;</p>` spacers), `<br />` 111 (26 posts). |
| Shortcode remnants | `<span class="su-dropcap su-dropcap-style-default">E</span>` (Shortcodes Ultimate drop caps) in 11 posts: `vrouwen-die-vertrokken-marij-verliet-nederland`, `vrouwen-die-vertrokken-agnieszka-uit-polen`, Charlie 2, 3, 4, 5, 8, 9, 10, 14, 16. The plugin is no longer active (not in `root.json`), so the span renders unstyled; the rebuild can style it as a drop cap or strip it. 4 WordPress emoji `<img>` (`wp-smiley`/`emoji`) in 2 posts. |
| External links (top hosts) | `www.charliemag.be` 21 + `charliemag.be` 4 (the "Zoals verschenen in Charlie" credits), `www.facebook.com` 5, `www.dewitteraaf.be` 2, `www.youtube.com` 2, then single links to `www.noveltymag.co.uk`, `drijfhout.be`, `www.actuallymagazine.be`, `www.biscuiterielesrabarines.com`, `www.metronieuws.nl`, `www.malala-yousafzai.com`, `nl.wikipedia.org`, `zananemrooz.com`, `en.wikipedia.org`, `www.pinterest.com`, `www.velt.be`, `madamezsazsa.blogspot.fr`, `thepioneerwoman.com`, `afterhours-dvl.tumblr.com`, `deknorendebie.blogspot.fr`, `www.cobra.be`. No links to the old domains `swaanelauwaert.be`/`onestparti.be` inside content. |
| Internal links | **164 `<a rel="attachment wp-att-N" href="https://swaanelauwaert.com/<post-slug>/<attachment-slug>/">` wrappers** around images in the 2012 posts (e.g. `https://swaanelauwaert.com/de-joskes/img_1891-2/`) + 62 gallery `data-link`s (`https://swaanelauwaert.com/img_4946/`) + 6 links straight to upload files. Attachment pages are **not** in the mirror; the rebuild must either unwrap these links or redirect them (§4.4). |
| Word count (tags stripped) | min 0 (`quatre-vingt-cinq`), median 12, mean 317, max 2089 (`de-wetten-van-de-jungle`). Median per year: 2012 695 · 2013 696 · 2014 756 · 2015 727 · 2016 27 · 2017 639 · **2018 5**. |

### 1.6 Series and what they are

* **"une par jour" (category 40, 120 posts)** — *one (photo) a day*. Starts 2018-02-11 with `un.` and counts up in French words through `cent vingt deux.` on 2018-10-17. Every post = one photo (featured and inline) + a one-line caption, title is the French number followed by a period (`deux.`, `trente neuf.`, `cent vingt et un.`). Numbering quirks to preserve verbatim: `quarant trois.` (typo, slug `quarant-trois`), `quarante  sept.` (double space), `septante.` (Belgian French for 70, slug `septante`), `soixante-et-onze` and `soixante douze` lack the final period, `soixante dixsept.`/`soixante dixneuf.` (no 78), 86 is skipped (`quatre vingt cinq.` → `quatre vingt sept.`), 65–66 are skipped (`soixante quatre.` → `soixante sept.`), slug `quatre-vingt-sept-2` is titled `quatre vingt dix sept.`, slug `quatre-vingt-dix-neuf-2` is titled `cent et un.`, `cent quatre.` appears twice (slugs `cent-quatre` 2018-08-02 and `cent-quatre-2` 2018-08-04) while `cent trois.` sits between them, slug `cent-dix-sept` is titled `cent seize.` and slug `cent-dix-sept-2` is `cent dix sept.`. One older post is also filed here: `het-relaas-van-een-gebroken-hart` (2013-08-24, "Het relaas van een gebroken hart."). Four of the 2018 posts are double-filed with "On est parti!". The full ordered list is in Appendix A (filter on the category column).
* **"On est parti!" (category 32, 70 posts)** — *we're off!* The emigration diary (Belgium → the Ardèche, France), imported from the former blog `onestparti.be` (52 guids) — 2012 (22), 2013 (10), 2014 (17), 2015 (10), 2016 (3), 2017 (3), 2018 (5, incl. `het-lang-verwachte-verhaal`, the move from the Ardèche to a holiday park near Aubagne). The 2012 posts are the long, many-photo entries with comments and tags.
* **"Charlie Rubriek" (category 24, 19 posts, all also in "On est parti!")** — a column written for the Belgian online magazine *Charlie* (charliemag.be), republished here. Titles end in a bracketed episode number: `Het prille begin van een spannend vervolgverhaal (charlie 1)` (2014-03-25) … `Le Funky Falafel (Charlie 19)` (2017-09-12); episodes 17 (`verliefd-op-een-huis-dat-nog-niet-af-is`), 18 (slug `1889-2`, title `Het einde van mijn schrijvershol… (Charlie 18)`) and 19 have slugs without the number. Each ends with a credit line such as `<p>Zoals verschenen in <a href="https://www.charliemag.be/mensen/on-est-parti-deel-5/">Charlie</a> 2014.</p>`.
* **"Non-fictie" (6)** — longer journalism, also mostly first published in Charlie Magazine (`de-wetten-van-de-jungle`, `helden-van-iran-shahla-sherkat`, `wij-gaan-naar-calais-en-nemen-mee`, `vlees-het-kan-ook-anders`, `de-revival-van-laura-en-het-kleine-huis-op-de-prairie`, `charlie-de-week-van-swaane`).
* **"Interviews" (3, 2017)** — `vrouwen-die-vertrokken-agnieszka-uit-polen`, `ik-wow-van-jouw`, `vrouwen-die-vertrokken-marij-verliet-nederland`.
* **"Poëzie" (7, 2016–2017)** — short English/French poems with no inline image: `promesse de gascon.`, `zinloos.`, `racines.`, `chagrin.`, `Limerence.`, `part 2.`, `Withdrawal sucks.`
* **"Kortverhalen" (6)** — short stories: `Elle se livrait à la nuit` / `Ze gaf zich over aan de nacht` (2017-02-01, FR + NL versions published as two posts), `Letting go…`, `HOME IS WHEREVER I’M WITH YOU`, `l’ours.`, `Laisser aller…` (2018).
* **"Actually, Magazine" (2)** — `Open call!` (2017-01-01) and `Kickstarter!` (2017-12-20) for the art magazine ACTUALLY.

### 1.7 HTML structure of the content — block vs classic

* **187 posts are classic-editor HTML**: bare `<p>` paragraphs, images as `<p><img class="aligncenter size-full wp-image-N" src="…full file…" alt="" width height srcset sizes></p>` (several `<img>` may sit in one `<p>`, separated by a space), `<p>&nbsp;</p>` spacers, `<br />`. All 124 posts of 2018, all of 2015–2017, and 11 of 2014, 17 of 2012.
* **23 posts contain block markup** (2012: 5, 2013: 11, 2014: 7): `<figure class="wp-block-image"><img width="1024" height="683" src="…-1024x683.jpg" class="wp-image-N" srcset sizes></figure>` (123 figures, 16 posts) and the 10 legacy gallery blocks. Their images live under `wp-content/uploads/sites/50/2020/05/` — these old posts were re-edited and their photos re-uploaded in May 2020. Texts in these posts are still plain `<p>` (no `wp-block-paragraph` class).
* 2012 classic posts wrap every image in an attachment-page link (`<a href="https://swaanelauwaert.com/<post-slug>/<img-slug>/" rel="attachment wp-att-N">`) and carry a `title="IMG_1891"` attribute.

Five samples across the years (first lines of `content.rendered`, srcset shortened):

1. **2012-05-10 `de-joskes`** (classic, "On est parti!", tag emigreren frankrijk, 14 images, 2 comments):
   `<p>En dan breekt de dag aan waar we allemaal zo naar hebben uitgekeken.</p>` … `<p><a href="https://swaanelauwaert.com/de-joskes/img_1891-2/" rel="attachment wp-att-171"><img fetchpriority="high" decoding="async" class="aligncenter size-full wp-image-171" title="IMG_1891" src="https://swaanelauwaert.com/wp-content/uploads/sites/50/2012/05/IMG_18911.jpg" alt="" width="2592" height="1936"></a></p>` … ends with `<p>&nbsp;</p>`. Full-size originals (2592×1936, 1936×2592, 800×600), no size suffix.
2. **2013-04-18 `lente-bedrijvigheid-en-pergolesi`** (block-edited, 2 galleries, 5 comments): eight `<p>` paragraphs, then `<ul class="wp-block-gallery columns-3 is-cropped wp-block-gallery-6 is-layout-flex wp-block-gallery-is-layout-flex"><li class="blocks-gallery-item"><figure><img loading="lazy" decoding="async" width="640" height="480" src="…/2020/05/IMG_8048.jpg" alt="" data-id="3369" data-link="https://swaanelauwaert.com/img_8048-2/" class="wp-image-3369" srcset="…" sizes="…" /></figure></li>…</ul>`; second gallery uses `-1024x765` variants.
3. **2014-09-04 `swaane-ontdekt-de-hippie-in-zichzelf-charlie-5`** (classic, Charlie 5): opens with `<p><span class="su-dropcap su-dropcap-style-default">E</span>r ontrolt zich …`, five paragraphs, then one `<p>` holding three `aligncenter size-full` `.jpeg` images from `2018/02/` (1280×957), closing credit `<p>Zoals verschenen in <a href="https://www.charliemag.be/mensen/on-est-parti-deel-5/">Charlie</a> 2014.</p>`.
4. **2015-02-03 `helden-van-iran-shahla-sherkat`** (classic, Non-fictie): credit line, `<h1 class="title">…</h1>`, italic quote with `<i>` and `<br />`, the one captioned thumbnail (`wp-caption alignleft`, 150×150), external links with `target="_blank" rel="noopener"`, a YouTube `<iframe>`, `<p>&nbsp;</p>` spacers.
5. **2018-08-10 `cent-cinq`** (classic, "une par jour" + "On est parti!"): one long paragraph (with three Facebook emoji `<img>`), then `<p><img loading="lazy" decoding="async" class="aligncenter size-full wp-image-2832" src="…/2018/08/IMG_0307.jpg" alt="" width="1500" height="1000" srcset="…" sizes="…" /></p>`. The typical 2018 post is even shorter: `cent-vingt-deux` = `<p><img …IMG…_o.jpg width="1707" height="2048"></p><p>It&#8217;s all about my kingz.</p><p>(Aubagne).</p>`; `chagrin` (2016 poem) = seven one-line `<p>`s ending `<p>-2017-</p>`.

The REST `content.rendered` and the HTML inside `<div class="entry-content …">` of the rendered pages are the same apart from `loading="lazy"` → `fetchpriority="high"` on the first image and `sizes="auto, …"` → `sizes="…"` — the REST dump is a reliable source for all 210 posts.

### 1.8 Excerpts, SEO fields

No manual excerpts can be detected (every `excerpt.rendered` is the auto-excerpt of the content). `meta description`, `og:description` and `twitter` tags on single posts are generated by Jetpack from that excerpt (§3.7). No post is `noindex`.

### 1.9 Dates and locale

* `root.json`: `timezone_string: "Europe/Paris"`, `gmt_offset: 2`. Rendered `<time datetime="2018-10-17T14:39:14+02:00">`. In the dump `date == date_gmt` for all 210 posts (import artefact), so treat `date` as **site-local time (Europe/Paris)** and ignore `date_gmt`.
* Visible format everywhere (cards, byline, related list, comments): `17 oktober 2018` = PHP `j F Y` in `nl_BE` (month names lower-case: januari, februari, maart, april, mei, juni, juli, augustus, september, oktober, november, december). Example in the mirror: `10 mei 2012`, `3 september 2018`.

---

## 2. Listing / archive design

### 2.1 The Journal page — `nl/journal/` (`mirror/raw/swaanelauwaert.com/nl/journal/index.html.orig`)

* WordPress record: page id **78**, slug `journal`, title `The Journal` (title left in English on the NL site; nav label also `The Journal`), `template: ""`. It is the Polylang **posts page** → `<body class="blog wp-embed-responsive wp-theme-twentytwentyfive">`, `<html lang="nl-BE">`, `<title>The Journal &#8211; Swaane Lauwaert</title>`. The page's own `content.rendered` is only an editor note (`<p class="wp-block-paragraph">Bewerk template hier: <a href="https://swaanelauwaert.com/wp-admin/site-editor.php?p=%2Fwp_template%2Ftwentytwentyfive%2F%2Fhome&amp;canvas=edit">…</a></p>`) — everything visible comes from the site-editor **`home` template**.
* `<head>` extras: `hreflang` alternates `nl` → `/nl/journal/`, `en` → `/en/the-journal/`, `fr` → `/fr/le-journal/` (no `x-default`); RSS alternates `Swaane Lauwaert &raquo; feed` → `/nl/feed/` and `Swaane Lauwaert &raquo; reactiesfeed` → `/nl/comments/feed/`; no `canonical` on the posts page in the mirror.
* Header/footer are the global chrome (`docs/audit/chrome.md`); nav item `The Journal` → `https://swaanelauwaert.com/nl/journal/`.
* **Content region (verbatim structure, after `</header>`):**

```html
<div class="wp-block-group ona-container has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="margin-top:0;margin-bottom:0">
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<h1 class="wp-block-heading has-text-align-center"></h1>                      <!-- empty h1 -->
<div class="wp-block-buttons is-content-justification-center is-layout-flex …">
<div class="wp-block-button is-style-fill"><a class="wp-block-button__link wp-element-button">SUBSTACK</a></div>   <!-- NO href -->
</div>
<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<h1 class="wp-block-heading has-text-align-center">The Journal </h1>
<p class="wp-block-paragraph">Ik schrijf over wat voor mij werkelijk van belang is: familie, mijn werk, de natuur, kunst, Maria Magdalena en het eenvoudige dagelijks leven!</p>
<p class="wp-block-paragraph">VOLG ME OP: <a href="https://substack.com/@swaanelauwaert1">https://substack.com/@swaanelauwaert1</a></p>
</blockquote>
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<div class="wp-block-query alignwide is-layout-flow wp-block-query-is-layout-flow">
  <ul class="columns-3 ona-post is-style-default wp-block-post-template is-layout-grid wp-container-core-post-template-is-layout-3c9dd3fb wp-block-post-template-is-layout-grid">
    <li class="wp-block-post post-2899 post type-post status-publish format-standard has-post-thumbnail hentry category-une-par-jour">
      <article class="wp-block-group is-layout-flow wp-block-group-is-layout-flow">
        <figure class="hover-scale wp-block-post-featured-image"><a href="https://swaanelauwaert.com/nl/2018/10/17/cent-vingt-deux/" target="_self"><img width="1707" height="2048" src="…/2018/10/44175512_…_o.jpg" class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="cent vingt deux." style="aspect-ratio:4/3;width:100%;object-fit:cover;" decoding="async" loading="lazy" srcset="…" sizes="…"></a></figure>
        <div class="wp-block-group is-layout-flow wp-block-group-is-layout-flow" style="padding-right:10%;padding-left:10%"><h2 class="wp-block-post-title has-text-align-center"><a href="…/cent-vingt-deux/" target="_self">cent vingt deux.</a></h2></div>
        <div class="wp-block-post-date has-text-align-center"><time datetime="2018-10-17T14:39:14+02:00">17 oktober 2018</time></div>
      </article>
    </li> … ×9 …
  </ul>
  <div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
  <nav class="wp-block-query-pagination is-content-justification-center is-layout-flex wp-container-core-query-pagination-is-layout-b29d4327 wp-block-query-pagination-is-layout-flex" aria-label="Paginering">
    <div class="wp-block-query-pagination-numbers"><span aria-current="page" class="page-numbers current">1</span>
    <a class="page-numbers" href="?query-1-page=2">2</a>
    <a class="page-numbers" href="?query-1-page=3">3</a>
    <span class="page-numbers dots">&hellip;</span>
    <a class="page-numbers" href="?query-1-page=24">24</a></div>
    <a href="/nl/journal/?query-1-page=2" class="wp-block-query-pagination-next">Volgende pagina<span class='wp-block-query-pagination-next-arrow is-arrow-arrow' aria-hidden='true'>→</span></a>
  </nav>
  <div style="height:80px" aria-hidden="true" class="wp-block-spacer"></div>
</div>
</div>
```

* **What a card shows**: featured image (cropped to 4:3 via inline `aspect-ratio:4/3;width:100%;object-fit:cover`, `alt` = post title, linked to the post), post title as `<h2>` centred (Floreal display font, colour accent-3 `#000000`, link without underline, underline on hover), date centred (`small` size, accent-4 `#5F5F5F`). **No excerpt, no read-more, no categories/tags, no author** on cards. Classes `ona-container`, `ona-post`, `hover-scale` carry **no CSS** anywhere in the mirror (0 rules; they are leftovers of a copied "Ona" theme pattern) — there is no hover zoom to reproduce.
* **Grid**: `.wp-container-core-post-template-is-layout-3c9dd3fb{grid-template-columns:repeat(3, minmax(0, 1fr));gap:var(--wp--preset--spacing--70);}` → 3 columns, 1 column below 600 px (core `@media (max-width:600px)` rule), `alignwide` = `--wp--style--global--wide-size: 1340px`. Pagination container `justify-content:center`; buttons container `justify-content:center`.
* **Query**: all posts (Dutch), newest first, **9 per page**, **24 pages** (210 ÷ 9 → page 24 holds 3 posts: `lome-dagen`, `het-mysterie-van-de-halve-brug`, `test-post-1`). Order is strictly by `date` descending; the listing on page 1 is `cent-vingt-deux`, `cent-vingt-et-un`, `cent-vingt`, `cent-dix-neuf`, `cent-dix-huit`, `cent-dix-sept-2`, `cent-dix-sept`, `cent-quinze`, `cent-quatorze`.
* **Pagination markup/labels** (verbatim): `aria-label="Paginering"`; numbers block shows `1 2 3 … 24` on page 1, `1 2 3 4 … 24` on page 2 (current page as `<span aria-current="page" class="page-numbers current">`), `1 … 22 23 24` on the last page; previous link `<a href="/nl/journal/?query-1-page=1" class="wp-block-query-pagination-previous"><span class='wp-block-query-pagination-previous-arrow is-arrow-arrow' aria-hidden='true'>←</span>Vorige pagina</a>`; next link text `Volgende pagina` + `→`. URLs are **query-string pagination of the Query Loop block**: `/nl/journal/?query-1-page=N` (there is no `/page/N/` URL anywhere in the mirror). Mirror files for pages 1–6, 8, 20–24 exist as `nl/journal/index.html?query-1-page=N.orig`. Some fetched variants carry an extra `&cst` / `?cst` parameter (`href="?cst"`, `?query-1-page=3&#038;cst`) — a cache-busting artefact of the crawl/LiteSpeed, not a site feature; ignore it.
* **Look (local render `nl-journal--desktop.png`, 1440 px)**: cream page (`base` colour), sticky header, 40 px gap, a black pill button "SUBSTACK" centred, then the quote block with a thin vertical rule on the left (`wp-block-quote` left border), "The Journal" in the light serif display face, two grey paragraphs, then a 3 × 3 photo grid with generous gutters (`spacing--70`), serif titles with trailing periods, small grey dates, centred pagination "1 2 3 … 24  Volgende pagina →", then the footer. Mobile render (`nl-journal--mobile.png`, 390 px): one column, same order; the lower cards appear without images only because `loading="lazy"` images were not fetched by the headless screenshot.

### 2.2 `en/the-journal/` and `fr/le-journal/` — same template, no posts

| | EN (`en/the-journal/index.html.orig`) | FR (`fr/le-journal/index.html.orig`) |
|---|---|---|
| WP page | id 48, slug `the-journal`, title `The Journal` | id 80, slug `le-journal`, title `Le Journal` |
| `<html lang>` / `<title>` | `en-GB` / `The Journal &#8211; Swaane Lauwaert` | `fr-FR` / `Le Journal &#8211; Swaane Lauwaert` |
| Body class | `blog …` (posts page) | `blog …` |
| Intro | empty `<h1>`, button `SUBSTACK` (no href), quote with `<h1 class="wp-block-heading has-text-align-center">The Journal</h1>`, `I write about what truly matters to me: family, my work, nature, art, Mary Magdalene, and the simple everyday life!`, `FOLLOW ME ON: https://substack.com/@swaanelauwaert1` | **no `<h1>` at all** (neither the empty one nor one in the quote), button `SUBSTACK`, quote with `J’écris sur ce qui compte vraiment pour moi : la famille, mon travail, la nature, l’art, Marie-Madeleine et la vie quotidienne toute simple !`, `SUIVEZ MOI SUR : https://substack.com/@swaanelauwaert1` |
| Query result | `<div class="wp-block-query-no-results"><p class="wp-block-paragraph">Sorry, nothing found yet.</p></div>` | `<div class="wp-block-query-no-results"><p class="wp-block-paragraph">Désolé, rien n&rsquo;a été trouve.</p></div>` (sic — "trouve" without accent in the source) |
| Pagination | none (no posts) | none |
| Feeds in head | `/en/feed/`, `/en/comments/feed/` | `/fr/feed/`, `/fr/comments/feed/` |

So **no, the EN and FR journal pages do not list the Dutch posts** — Polylang filters the query by language and there are no EN/FR posts. The renders `en-the-journal--desktop.png` / `fr-le-journal--desktop.png` show just the intro block and the one-line message. The rebuild must decide whether to keep this behaviour (empty EN/FR journals) or to list the Dutch posts there; the live site shows the empty state.

### 2.3 Tag, category and author archives (all NL, same template)

Files: `nl/tag/emigreren-frankrijk/index.html.orig` (+ `?query-1-page=2`, `3`, `24`), `nl/tag/groen-leven/index.html.orig`, `nl/author/swaanelauwaert/index.html.orig` (+ pages), `nl/category/kortverhaal/`, `nl/category/on-est-parti/` (+ pages), `nl/category/une-par-jour/` (+ pages). **The tag archive `nl/tag/bouwen-in-stro-en-leem/` is not in the mirror** (only the two tags above were crawled); the other 4 tags and 5 categories exist on the live site per the sitemap but were not fetched. No month/year archive page is in the mirror and nothing links to one.

* Body classes: `archive tag tag-emigreren-frankrijk tag-44 …`, `archive category category-kortverhaal category-28 …`, `archive author author-swaanelauwaert author-1342 …`.
* `<title>`: `{term name} &#8211; Swaane Lauwaert` (`emigreren frankrijk – Swaane Lauwaert`, `Kortverhalen – Swaane Lauwaert`, `une par jour – Swaane Lauwaert`, `swaanelauwaert – Swaane Lauwaert`). `meta description` on the tag page: `Berichten over groen leven geschreven door swaanelauwaert` (see chrome.md §4.2). No hreflang. Head feeds: `/nl/feed/`, `/nl/comments/feed/`, plus the archive's own feed with titles `Swaane Lauwaert &raquo; emigreren frankrijk tagfeed` → `/nl/tag/emigreren-frankrijk/feed/`, `Swaane Lauwaert &raquo; Kortverhalen categoriefeed` → `/nl/category/kortverhaal/feed/`, `Swaane Lauwaert &raquo; berichten in swaanelauwaert feed` → `/nl/author/swaanelauwaert/feed/`; JSON alternate `/wp-json/wp/v2/tags/44`, `/categories/28`, `/users/1342`.
* Content region: `<main id="wp--skip-link--target" class="wp-block-group has-global-padding is-layout-constrained …" style="margin-top:var(--wp--preset--spacing--60)">` → `<h1 class="wp-block-query-title">Tag: <span>emigreren frankrijk</span></h1>` / `Categorie: <span>Kortverhalen</span>` / `Auteur: <span>swaanelauwaert</span>` (colour accent-3) → the same `wp-block-query alignwide` + `columns-3 ona-post …` grid + same pagination as the journal (prev/next hrefs are `/nl/tag/emigreren-frankrijk/?query-1-page=2` etc.). There is **no intro, button, quote, term description or spacer** above the grid; no spacer after pagination beyond the main padding.
* **Important live-site defect**: the archive template's Query Loop does **not inherit** the archive query. Every tag, category and author page lists the **same global 210 posts** (page 1 = `cent-vingt-deux` … `cent-quatorze`, 24 pages) — verified on both tags, the author page and all three categories (the "Kortverhalen" archive shows "une par jour" posts). The rebuild should filter archives by term (the expected behaviour) and may keep the same card grid; document this as an intentional fix.
* Look (`nl-author-swaanelauwaert--desktop.png`, `nl-category-*--desktop.png`, `nl-tag-emigreren-frankrijk--desktop.png`): heading "Auteur: swaanelauwaert" in the display serif at the top-left of the content column, then the identical 3 × 3 grid and pagination.

### 2.4 Elements the listing pages do **not** have

No search box, no sidebar/widgets, no category or tag navigation, no archive-by-month list, no "latest posts" block, no RSS link in the body, no excerpt/read-more, no sticky post treatment, no breadcrumbs.

---

## 3. Single post template (`single` template of Twenty Twenty-Five, customised)

Checked on `nl/2018/10/17/cent-vingt-deux/index.html.orig` (newest, no tags, no comments), `nl/2012/05/10/de-joskes/index.html.orig` (tags, 2 comments), `nl/2012/04/22/test-post-1/index.html.orig` (oldest, 17 comments), `nl/2012/07/06/the-promised-land/` (23 comments, nested), `nl/2013/04/18/lente-bedrijvigheid-en-pergolesi/` (galleries). Body: `wp-singular post-template-default single single-post postid-2899 single-format-standard wp-embed-responsive wp-theme-twentytwentyfive`; `<html lang="nl-BE">`; `<title>cent vingt deux. &#8211; Swaane Lauwaert</title>`.

### 3.1 Order of elements inside `<main id="wp--skip-link--target" class="wp-block-group has-global-padding is-layout-constrained …" style="margin-top:var(--wp--preset--spacing--60)">`

1. **Title + byline group** — `<div class="wp-block-group alignfull has-global-padding is-layout-constrained …" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">`
   * `<h1 class="wp-block-post-title">cent vingt deux.</h1>` (colour accent-3; Floreal; left-aligned; no link).
   * Byline row `<div class="wp-block-group has-link-color has-accent-4-color has-text-color has-small-font-size is-layout-flex wp-container-core-group-is-layout-fd1a9a6d …" style="margin-bottom:var(--wp--preset--spacing--60)">` (flex, `gap:0.2em`, small grey): `<p class="wp-block-paragraph">Geschreven door </p>` · `<div class="wp-block-post-author-name"><a href="https://swaanelauwaert.com/nl/author/swaanelauwaert/" target="_self" class="wp-block-post-author-name__link">swaanelauwaert</a></div>` · `<p class="wp-block-paragraph">in</p>` · `<div style="font-weight:300" class="taxonomy-category wp-block-post-terms"><a href="https://swaanelauwaert.com/nl/category/une-par-jour/" rel="tag">une par jour</a></div>` (multiple categories are comma-separated: `On est parti!, une par jour`) · `<p class="wp-block-paragraph">op</p>` · `<div class="wp-block-post-date"><time datetime="2018-10-17T14:39:14+02:00">17 oktober 2018</time></div>`. Rendered: "Geschreven door swaanelauwaert in une par jour op 17 oktober 2018".
   * **No featured image is rendered anywhere in the single template** (0 occurrences of `wp-block-post-featured-image` in all 76 post pages). The featured photo appears only through the card grids and `og:image`.
2. **Content** — `<div class="entry-content alignfull wp-block-post-content has-global-padding is-layout-constrained wp-block-post-content-is-layout-constrained">` … post HTML (§1.7) … `</div>`. Width = `--wp--style--global--content-size: 960px` (constrained layout; images are `max-width:100%; height:auto`, so the full-size 2592 px photos scale to 960 px). Body text Literata 300, `--wp--preset--font-size--medium` (`clamp(1rem, …, 1.2rem)`), colour accent-4; see design-system.md §1–3.
3. **Tags aside** — `<aside class="wp-block-group has-global-padding is-layout-constrained …" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">`. Empty on untagged posts; on tagged posts it holds `<div class="taxonomy-post_tag is-style-post-terms-1 is-style-post-terms-1--5 wp-block-post-terms"><a href="https://swaanelauwaert.com/nl/tag/emigreren-frankrijk/" rel="tag">emigreren frankrijk</a></div>` rendered as pills (`border-radius:20px; border:0.8px solid accent-6; font-weight:400; line-height:2.8; padding:5px 10px; no underline; underline on hover`). No "Tags:" label.
4. **Like and share aside** — `<aside class="wp-block-group has-global-padding is-layout-constrained …">` → `<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide is-style-wide--6" style="margin-bottom:36px"/>` → `<p class="wp-block-paragraph"><strong>Like and share</strong></p>` → flex row (`space-between nowrap`): left the **Jetpack Likes** widget `<div class="wp-block-jetpack-like"><div class='sharedaddy sd-block sd-like jetpack-likes-widget-wrapper jetpack-likes-widget-unloaded' … data-src='https://widgets.wp.com/likes/index.html?ver=16.3.1#blog_id=251803763&amp;post_id=2899&amp;origin=swaanelauwaert.com…' data-title='Like of reblog'><div class='likes-widget-placeholder post-likes-widget-placeholder' style='height: 55px;'><span class='loading'>Bezig met laden&#8230;</span></div>…` (an iframe loaded from wp.com; in the render it stays "Bezig met laden…"), right the **Jetpack sharing buttons** `<ul class="wp-block-jetpack-sharing-buttons has-normal-icon-size jetpack-sharing-buttons__services-list is-layout-flex …" id="jetpack-sharing-serivces-list">` with 8 round coloured icon buttons (`class="jetpack-sharing-button__button style-icon share-<service>"`, `target="_blank" rel="nofollow noopener noreferrer"`, href `https://swaanelauwaert.com/nl/2018/10/17/cent-vingt-deux/?share=<service>&nb=1`): hidden a11y labels `Delen op Bluesky (Wordt in een nieuw venster geopend)`, `Delen op Facebook (…)`, `Delen op LinkedIn (…)`, `Delen op Mastodon (…)`, `Delen op WhatsApp (…)`, `Delen op Pinterest (…)`, `Delen op X (…)`, and the native-share button `Delen met ingebouwde tools` with tooltip `Gekopieerd naar het klembord`; visible (aria-hidden) labels `Bluesky`, `Facebook`, `LinkedIn`, `Mastodon`, `WhatsApp`, `Pinterest`, `X`, `Share`. Order: Bluesky, Facebook, LinkedIn, Mastodon, WhatsApp, Pinterest, X, Share.
5. **Subscribe aside** — `<aside … style="margin-top:48px;margin-bottom:48px;padding-top:5px;padding-bottom:5px">` → wide separator (`is-style-wide--7`, `margin-bottom:36px`) → `<h3 class="wp-block-heading has-text-align-center">Ontdek meer van Swaane Lauwaert</h3>` → `<h3 class="wp-block-heading has-text-align-center">Découvrez plus de Swaane Lauwaert</h3>` → `<p class="has-text-align-center has-small-font-size wp-block-paragraph" style="margin-top:4px;margin-bottom:0">Abonneer je om de nieuwste berichten in je e-mail te ontvangen.</p>` → `<div class="wp-block-group has-global-padding is-layout-constrained wp-container-core-group-is-layout-f2b6297b …"></div>` — **empty**: the Jetpack subscription form did not render in the mirror. Whether an email form existed on the live site cannot be determined (gap); the rebuild can place a newsletter CTA here (the site's other sign-ups are Flodesk links, chrome.md §3.7).
6. **Previous / next navigation** — `<aside class="wp-block-group alignwide is-layout-flow …" style="margin-top:var(--wp--preset--spacing--60);margin-bottom:var(--wp--preset--spacing--60)"><nav class="wp-block-group alignwide is-content-justification-space-between is-nowrap is-layout-flex wp-container-core-group-is-layout-878fe601 …" aria-label="Bericht navigatie" style="border-top-color:var(--wp--preset--color--accent-6);border-top-width:1px;padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40)">` → `<div class="post-navigation-link-previous wp-block-post-navigation-link"><span class="wp-block-post-navigation-link__arrow-previous is-arrow-arrow" aria-hidden="true">←</span><a href="https://swaanelauwaert.com/nl/2018/10/10/cent-vingt-et-un/" rel="prev">cent vingt et un.</a></div>` and `<div class="post-navigation-link-next wp-block-post-navigation-link"><a href="…" rel="next">A tribute to Youpie</a><span class="wp-block-post-navigation-link__arrow-next is-arrow-arrow" aria-hidden="true">→</span></div>`. Labels are the **adjacent post titles** (there is no "Vorige"/"Volgende" word) with `←`/`→` arrows; on the newest post the next div is empty, on the oldest (`test-post-1`) the previous div is empty. "Previous" = older post, chronological across all categories.
7. **Comments** — `<aside class="wp-block-comments wp-block-comments-query-loop" style="margin-top:var(--wp--preset--spacing--70);margin-bottom:var(--wp--preset--spacing--70)">` (§3.6).
8. **"Meer berichten" section** (after `</main>`'s inner div, still inside `<main>`): `<section class="wp-block-group alignwide has-global-padding is-layout-constrained …" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">` → `<h2 class="wp-block-heading alignwide has-small-font-size" style="font-style:normal;font-weight:700;letter-spacing:1.4px;text-transform:uppercase">Meer berichten</h2>` → a Query Loop list of **the 4 newest posts site-wide** (not related, not excluding the current post: on `cent-vingt-deux` the first row is the post itself; on `de-joskes` the list is still `cent-vingt-deux`, `cent-vingt-et-un`, `cent-vingt`, `cent-dix-neuf`). Markup per row: `<li class="wp-block-post …"><div class="wp-block-group alignfull is-content-justification-space-between is-nowrap is-layout-flex wp-container-core-group-is-layout-cba70755 …" style="border-bottom-color:var(--wp--preset--color--accent-6);border-bottom-width:1px;padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><h3 class="wp-block-post-title has-large-font-size"><a href="…" target="_self">cent vingt deux.</a></h3><div class="wp-block-post-date has-text-align-right"><a href="…"><time datetime="…">17 oktober 2018</time></a></div></div></li>`; list has zero block gap (`wp-container-core-post-template-is-layout-b4d04ffe`).

Then the global footer (chrome.md §2). There is **no author box/bio**, **no Jetpack related-posts** (`jp-relatedposts` absent), **no breadcrumbs**, **no reading time**, **no table of contents**, **no "back to journal" link**.

### 3.2 Look (render `nl-2018-10-17-cent-vingt-deux--desktop.png`)

Left-aligned title in the display serif, a tiny grey byline under it, the photo at content width (960 px) with the 2018 Polaroid-style frames baked into the photos, two short lines of body text, thin rule, "Like and share" with the greyed likes placeholder on the left and 8 coloured round icons on the right, thin rule, two centred "Ontdek meer…/Découvrez plus…" headings with the small subscribe line, full-width rule with "← cent vingt et un." on the left, "Reacties" heading, "Een reactie achterlaten" form (textarea + three inputs + checkbox + black pill button "Reactie plaatsen"), Akismet note, then the uppercase "MEER BERICHTEN" label and four title/date rows separated by hairlines, then the footer.

### 3.3 `<head>` of a post (differences from the global head)

`<link rel="canonical" href="https://swaanelauwaert.com/nl/2018/10/17/cent-vingt-deux/">`; RSS alternates `/nl/feed/`, `/nl/comments/feed/`, and the per-post comments feed titled `Swaane Lauwaert &raquo; cent vingt deux. reactiesfeed` → `/nl/2018/10/17/cent-vingt-deux/feed/`; oEmbed JSON/XML links (`/wp-json/oembed/1.0/embed?url=…&lang=nl`); JSON alternate `/wp-json/wp/v2/posts/2899`; **no hreflang** (posts are NL-only). Jetpack OG: `og:type article`, `og:title` = post title, `og:url` = permalink, `og:description` = excerpt, `og:site_name Swaane Lauwaert`, `og:image` = featured image source URL with `og:image:width/height` and empty `og:image:alt`, `og:locale nl_BE`; `meta name="description"` = excerpt; `twitter:text:title`, `twitter:image` (`…jpg?w=640`), `twitter:card summary_large_image`. Scripts specific to posts: `wp-includes/js/comment-reply.min.js`, Jetpack `sharing-button/view.js`, `sharing-buttons/view.js`, `likes/queuehandler.min.js`, Akismet `akismet-frontend.js`, `stats.wp.com/e-YYYYWW.js`; inline styles `wp-block-comments-inline-css`, `wp-block-post-comments-form-inline-css`, `wp-block-post-navigation-link-inline-css`, `wp-block-post-terms-inline-css`, `wp-block-post-author-name-inline-css`, `jetpack_likes-inline-css`, `jetpack-sharing-buttons-style-inline-css`.

### 3.4 Static labels on the single template (verbatim, NL)

`Geschreven door` · `in` · `op` · `Like and share` · `Like of reblog` · `Bezig met laden…` · `Delen op Bluesky (Wordt in een nieuw venster geopend)` (and Facebook, LinkedIn, Mastodon, WhatsApp, Pinterest, X) · `Delen met ingebouwde tools` · `Gekopieerd naar het klembord` · `Ontdek meer van Swaane Lauwaert` · `Découvrez plus de Swaane Lauwaert` · `Abonneer je om de nieuwste berichten in je e-mail te ontvangen.` · `Bericht navigatie` (aria-label) · `←` / `→` · `Reacties` · `Één reactie op “{title}”` / `{n} reacties op “{title}”` · `Antwoord` · `Antwoord op {name}` (aria-label/data-replyto) · `Een reactie achterlaten` · `Reactie annuleren` · `Je e-mailadres zal niet getoond worden.` · `Vereiste velden zijn gemarkeerd met *` · `Reactie *` · `Naam *` · `E-mail *` · `Website` · `Mijn naam, e-mailadres en website opslaan in deze browser voor de volgende keer wanneer ik een reactie plaats.` · `Reactie plaatsen` · `Deze website gebruikt Akismet om spam te verminderen.` + link `Bekijk hoe je reactie gegevens worden verwerkt.` (→ `https://akismet.com/privacy/`) · `Meer berichten`.

### 3.5 Date format on posts

Byline, navigation, related list and comment dates all use `j F Y` nl_BE (`17 oktober 2018`, `10 mei 2012`); `<time datetime>` carries the `+02:00` offset.

### 3.6 Comments (markup and data)

* **Data**: 177 comments on 29 of the 76 mirrored post pages (all 2012–2013 posts have comments; of the 2018 pages only `quatre-vingt-neuf` (1) and `cent-dix-sept` (2) do). Top: `the-promised-land` 23, `test-post-1` 17, `tegelkachels-en-droogtoiletten` 11, `een-dik-wolkenpak-in-mijn-hoofd` 11, `sneeuwpret-en-psychedelische-paddenstoelen` 9, `a-tribute-to-youpie` 8, `de-overbevolkte-berg-en-een-week-hart` 8, `alles-komt-op-sinen-tijd` 8. Per-post counts are in Appendix A ("?" = page not mirrored; the REST dump has no comments endpoint, so counts for the 134 unmirrored posts are unknown). Threads go to **depth 3** max (`depth-2` replies in 14 posts, `depth-3` in 4); author replies carry `class="comment byuser comment-author-swaanelauwaert bypostauthor … depth-2"`. No comment pagination (`wp-block-comments-pagination` absent).
* **List markup**: `<h2 class="wp-block-heading has-x-large-font-size">Reacties</h2>` → `<h3 id="comments" class="wp-block-comments-title has-large-font-size">2 reacties op &#8220;De Joskes!&#8221;</h3>` (singular: `Één reactie op &#8220;Thuis&#8221;`) → `<ol class="wp-block-comment-template"><li id="comment-68" class="comment even thread-even depth-1"><div class="wp-block-group …" style="margin-top:0;margin-bottom:var(--wp--preset--spacing--50)"><div class="wp-block-group is-nowrap is-layout-flex wp-container-core-group-is-layout-40af6500 …"> <div class="wp-block-avatar"><img alt='Jef en Magda Hendrickx avatar' src='https://secure.gravatar.com/avatar/<hash>?s=50&d=mm&r=g' srcset='…?s=100… 2x' class='avatar avatar-50 photo wp-block-avatar__image' …></div> <div class="wp-block-group is-layout-flow"><div class="wp-block-comment-date"><time datetime="2012-05-10T17:32:25+02:00"><a href="https://swaanelauwaert.com/nl/2012/05/10/de-joskes/#comment-68">10 mei 2012</a></time></div> <div class="wp-block-comment-author-name">Jef en Magda Hendrickx</div> <div class="wp-block-comment-content"><p>Wat zal Gust zijn Nina missen. Hoe die twee kunnen knuffelen &#8230;</p></div> <div class="wp-block-group is-nowrap is-layout-flex wp-container-core-group-is-layout-3a88641f …"><div class="wp-block-comment-reply-link"><a rel="nofollow" class="comment-reply-link" href="https://swaanelauwaert.com/nl/2012/05/10/de-joskes/?replytocom=68#respond" data-commentid="68" data-postid="157" data-belowelement="comment-68" data-respondelement="respond" data-replyto="Antwoord op Jef en Magda Hendrickx" aria-label="Antwoord op Jef en Magda Hendrickx">Antwoord</a></div></div></div></div></div></li>…</ol>`. Order: oldest first; avatar 50 px (Gravatar `d=mm` default silhouette), date above author name, no edit link. Nested replies are rendered as `<li … depth-2>` items (no `<ol class="children">` wrapper was found — flat list with depth classes).
* **Form** (`<div id="respond" class="comment-respond wp-block-post-comments-form">`): `<h3 id="reply-title" class="comment-reply-title">Een reactie achterlaten <small><a rel="nofollow" id="cancel-comment-reply-link" href="/nl/…/#respond" style="display:none;">Reactie annuleren</a></small></h3>` → `<form action="https://swaanelauwaert.com/wp-comments-post.php" method="post" id="commentform" class="comment-form">` → `<p class="comment-notes"><span id="email-notes">Je e-mailadres zal niet getoond worden.</span> <span class="required-field-message">Vereiste velden zijn gemarkeerd met <span class="required">*</span></span></p>` → `comment-form-comment`: `<label for="comment">Reactie <span class="required">*</span></label> <textarea id="comment" name="comment" cols="45" rows="8" maxlength="65525" required>` → `comment-form-author`: `Naam *` `<input id="author" name="author" type="text" size="30" maxlength="245" autocomplete="name" required>` → `comment-form-email`: `E-mail *` `<input id="email" type="email" maxlength="100" aria-describedby="email-notes" autocomplete="email" required>` → `comment-form-url`: `Website` `<input id="url" type="url" maxlength="200" autocomplete="url">` → `comment-form-cookies-consent`: checkbox `wp-comment-cookies-consent` value `yes` + label → `<p class="form-submit wp-block-button"><input name="submit" type="submit" id="submit" class="wp-block-button__link wp-element-button" value="Reactie plaatsen"> <input type='hidden' name='comment_post_ID' value='2899'> <input type='hidden' name='comment_parent' value='0'></p>` → Akismet hidden fields (`akismet_comment_nonce`, `ak_hp_textarea` honeypot, `ak_js`) → `</form>` → `<p class="akismet_comment_form_privacy_notice">Deze website gebruikt Akismet om spam te verminderen. <a href="https://akismet.com/privacy/" target="_blank" rel="nofollow noopener">Bekijk hoe je reactie gegevens worden verwerkt.</a></p>`. The form appears on all mirrored posts including the one with `comment_status: closed`? — not verifiable: `petit-petit-loiseau-fait-son-nid` (2014) is not in the mirror (gap). A static rebuild has no comment backend: keep the 177 existing comments as static content (they are only recoverable from the 76 mirrored pages) and either drop the form or wire it to a third-party service.

### 3.7 Jetpack and plugin additions summarised

Jetpack Likes (iframe widget), Jetpack Sharing buttons (8 services), Jetpack subscribe block (rendered empty), Jetpack Stats script, Jetpack SEO/OG tags, Akismet on the comment form, Polylang (`lang` attributes, language switcher in the header pointing to `/en/the-journal/` and `/fr/le-journal/` from any NL blog page), LiteSpeed cache (`x-lsadc-cache` header), Redirection plugin (rules not retrievable — gap), Otter Blocks (`otter/v1` namespace; no Otter blocks found in post content).

---

## 4. URL scheme and redirects

### 4.1 Patterns observed

| Thing | Pattern (live) | Evidence |
|---|---|---|
| Post permalink | `https://swaanelauwaert.com/nl/YYYY/MM/DD/<slug>/` | all 210 `link`s match `^/nl/\d{4}/\d{2}/\d{2}/[^/]+/$`; 210 identical URLs in `child-wp-sitemap-posts-post-1.xml` |
| Posts page (journal) | `/nl/journal/`, `/en/the-journal/`, `/fr/le-journal/` | pages 78/48/80 |
| Listing pagination | `/nl/journal/?query-1-page=N` (N = 1…24); same `?query-1-page=N` on every archive | pagination hrefs in `.orig` files; **no `/page/N/`** |
| Category archive | `/nl/category/<slug>/` (en: `/en/category/<slug>/`, fr: `/fr/category/<slug>/` for the empty translated categories) | `categories-p1.json` `link`, taxonomy sitemap (8 nl URLs) |
| Tag archive | `/nl/tag/<slug>/` | `tags-p1.json`, sitemap (6 URLs) |
| Author archive | `/nl/author/swaanelauwaert/` (REST/users sitemap also expose `/author/swaanelauwaert/` without language prefix) | `users-p1.json`, `child-wp-sitemap-users-1.xml` |
| Date archives | `/nl/YYYY/`, `/nl/YYYY/MM/` are implied by the permalink structure but **no date-archive page or link exists in the mirror** | grep over all `.orig` files: 0 hrefs to `/nl/2018/10/`-style URLs |
| Feeds | `/nl/feed/`, `/nl/comments/feed/`, `/en/feed/`, `/en/comments/feed/`, `/fr/feed/`, `/fr/comments/feed/`, `/nl/category/<slug>/feed/`, `/nl/tag/<slug>/feed/`, `/nl/author/swaanelauwaert/feed/`, `/nl/YYYY/MM/DD/<slug>/feed/` (per-post comment feed), even `/nl/over-mij/feed/` on a page | `<link rel="alternate" type="application/rss+xml">` tags; no feed body was mirrored |
| Attachment pages | `https://swaanelauwaert.com/<post-slug>/<attachment-slug>/` (164 links in 2012 posts) and `https://swaanelauwaert.com/<attachment-slug>/` (62 gallery `data-link`s, featured-media `link` e.g. `/44175512_…_o/`) | post content, `_embedded` |
| Upload files | `https://swaanelauwaert.com/wp-content/uploads/sites/50/YYYY/MM/<file>[-WxH|-scaled].<ext>` | all image `src` |
| Comment reply | `<permalink>?replytocom=<id>#respond`; comment anchors `#comment-<id>` | comment markup |
| Sharing | `<permalink>?share=<service>&nb=1` | sharing buttons |
| Root | `https://swaanelauwaert.com/` → **302** `https://swaanelauwaert.com/en/` (`x-redirect-by: Polylang`) | `mirror/meta/headers.txt` |
| Sitemap | `/wp-sitemap.xml` + `wp-sitemap-posts-post-1.xml`, `-posts-page-1.xml`, `-taxonomies-category-1.xml`, `-taxonomies-post_tag-1.xml`, `-users-1.xml` | `mirror/meta/` |
| REST / oEmbed | `/wp-json/wp/v2/posts/<id>`, `/wp-json/oembed/1.0/embed?url=…&lang=nl` | head links |
| Shortlink | `rel=shortlink` only observed for `/` (`<https://swaanelauwaert.com/>`), none on posts | headers |

### 4.2 Must keep (same URL in the rebuild)

* All 210 `/nl/YYYY/MM/DD/<slug>/` permalinks (Appendix A) — the sitemap-vs-REST diff is empty, so this list is complete.
* `/nl/journal/`, `/en/the-journal/`, `/fr/le-journal/`.
* The 8 populated category URLs and 6 populated tag URLs, `/nl/author/swaanelauwaert/`.

### 4.3 Should redirect (301)

* `/` → `/en/` (keep Polylang's behaviour, or make the root the English home).
* `/nl/journal/?query-1-page=N` and `/nl/{category|tag|author}/…/?query-1-page=N` → whatever pagination URL the rebuild uses (e.g. `/nl/journal/2/`); `?cst` variants can be ignored.
* `/author/swaanelauwaert/` → `/nl/author/swaanelauwaert/` (or the journal).
* `/nl/YYYY/`, `/nl/YYYY/MM/` → `/nl/journal/` (not linked anywhere; harmless catch-all).
* `/nl/feed/`, `/nl/comments/feed/`, `/en/feed/`, `/fr/feed/`, `/nl/<archive>/feed/`, `<permalink>/feed/` → a generated RSS feed for the journal (there is currently no feed body to copy; the rebuild should emit at least `/nl/feed/` as RSS 2.0 with the 210 posts) or 410.
* Attachment pages (`/<post-slug>/<img-slug>/`, `/<img-slug>/`) → the parent post permalink; in the content, unwrap the `<a rel="attachment">` links (or point them at the image file).
* `<permalink>?replytocom=N` and `?share=x` → the permalink (strip query).
* `/wp-sitemap.xml` and children → the new sitemap.
* Empty category/tag archives (`/nl/category/geen-categorie/`, `/en/category/uncategorized/`, `/nl/tag/pasta-met-tomatensaus/`, etc., full list in §1.3/§1.4) → the journal of that language.
* Old domains `swaanelauwaert.be` / `onestparti.be` (`?p=<id>` guids) — their public URL structure is not in the mirror; if DNS still points at the site, map `?p=<id>` to the post with that `id` (ids are preserved in the guid).

### 4.4 Image URLs

Keep `/wp-content/uploads/sites/50/YYYY/MM/<file>` paths if possible (6 posts link straight to upload files, `og:image` URLs are shared on social media). Where only `-scaled` or `-WxH` variants exist locally (§5.3), serve the largest variant at the original filename or rewrite the `src`.

---

## 5. Inventory: what is in the raw mirror vs REST only, and missing images

### 5.1 Raw counts

| | Count |
|---|---|
| Posts in REST dump | 210 |
| Posts with a rendered HTML page in `mirror/raw/swaanelauwaert.com/nl/YYYY/…/index.html(.orig)` | **76** — 2012: 22 (all), 2013: 6 (`de-troostende-berg-2`, `de-ark-van-noach`, `op-de-barricades-en-tomatenzaadjes`, `de-timmerman-en-de-godfather`, `verjaardagdramas-en-katten-braakballen`, `lente-bedrijvigheid-en-pergolesi`), 2018: 48 (`soixante-douze` 2018-05-22 → `cent-vingt-deux` 2018-10-17, i.e. the 48 newest posts, which is pages 1–6 of the journal, minus nothing) |
| Posts only in the REST dump (no HTML) | **134** — 2013: 5, 2014: 18, 2015: 15, 2016: 7, 2017: 13, 2018: 76 (`un` … `soixante-et-onze`) |
| Listing/archive HTML pages | `nl/journal/` ×1 + 12 paginated variants; `en/the-journal/`, `fr/le-journal/`; categories `kortverhaal` (1), `on-est-parti` (1 + 10 variants), `une-par-jour` (1 + 10); tags `emigreren-frankrijk` (1 + 3), `groen-leven` (1); author (1 + 10). Missing: 5 categories, 4 tags (`bouwen-in-stro-en-leem`, `emigreren-naar-frankrijk`, `food`, `moestuin-2`), all date archives, all feeds, all attachment pages. |
| Comments recoverable | 177 (from the 76 pages); unknown for 134 posts |
| Upload files on disk | 999 under `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/` (years 2012, 2013, 2018, 2020, 2026 + `fonts`) and 722 under `mirror/media/wp-content/uploads/sites/50/` (2012–2020, 2026). Together they cover 673 of the 693 distinct image files referenced by post content and all 209 featured images (70 in `raw`, 139 in `media`). |

Which post has HTML is marked in Appendix A (column "HTML in mirror").

### 5.2 Posts referencing images that are missing locally

Method: every `<img src>` under `wp-content/uploads/sites/50/` in `content.rendered` (713 refs), size suffix `-WxH` stripped, then looked up in both upload roots; "variants-only" means the exact/base file is absent but a `-scaled` or `-WxH` rendition of the same photo is on disk.

**20 references in 14 posts** fail the exact/base check:

| Post (date, slug) | Missing file (`…/sites/50/`) | Status |
|---|---|---|
| 2012-04-22 `test-post-1` | `2012/04/IMG_25962.jpg`, `2012/04/IMG_2605.jpg`, `2012/04/IMG_2609.jpg`, `2012/04/IMG_2610.jpg` | **ABSENT** — all four are HTTP 404 on the live site (`mirror/meta/fetch-failed.txt`) |
| 2012-04-22 `test-post-1` | `2012/04/IMG_2628` (src has **no extension**, `alt="Super-oma!!!"`) | variants-only: `…/2012/04/IMG_2628.jpg` and `IMG_2628-225x300.jpg` exist → fix the src |
| 2012-05-02 `lome-dagen` | `2012/05/IMG_1780.jpg` | variants-only (`-1024x768`, `-768x576`) |
| 2012-05-10 `de-joskes` | `2012/05/IMG_19391.jpg` | variants-only (`-scaled`, `-1530x2048`, `-1147x1536`, `-224x300`) |
| 2012-06-10 `huizenjacht` | `2012/06/IMG_2060.jpg` | variants-only (`-scaled`, `-2048x1530`, `-1536x1147`, `-1024x765`) |
| 2012-06-22 `het-leven-zoals-het-is-on-the-road-2` | `2012/06/IMG_2537.jpg` | variants-only (`-scaled`, `-1530x2048`, …) |
| 2012-07-06 `the-promised-land` | `2012/07/IMG_2859.jpg` | variants-only (`-2048x1530`, `-1536x1147`, `-1024x765`, `-768x574`) |
| 2012-07-28 `stoemp-met-erwten-en-salie` | `2012/07/IMG_2986.jpg` | variants-only |
| 2012-08-15 `slaatje-van-courgette-met-thijm-en-citroen` | `2012/08/IMG_3118.jpg` | variants-only (`-scaled`, …) |
| 2012-09-04 `de-overbevolkte-berg-en-een-week-hart` | `2012/09/IMG_3390.jpg`, `2012/09/IMG_3398.jpg` | **ABSENT** — 404 on live |
| 2012-09-04 `de-overbevolkte-berg-en-een-week-hart` | `2012/09/IMG_0011.jpg` | variants-only (`-2048x1530`, …) |
| 2012-11-02 `sneeuwpret-en-psychedelische-paddenstoelen` | `2020/05/IMG_0454-1-1024x765.jpg` | **ABSENT** — 404 on live |
| 2013-04-18 `lente-bedrijvigheid-en-pergolesi` | `2020/05/IMG_3255-kopiëren-e1589139128265-1024x765.jpg` | **ABSENT** — 404 on live (its featured image `2020/05/IMG_3255-kopieren-e1589139128265-scaled.jpg` *is* present) |
| 2014-01-12 `oproep` | `2020/05/eea1bb7a72db978c00664312f83d2208.jpg` | **ABSENT** — 404 on live |
| 2018-05-23 `soixante-treize` | `2018/05/20180523_131649_001-B.jpg` | variants-only (`-scaled`, `-2048x1152`, `-1536x864`, `-1024x576`, `-768x432`) |
| 2018-05-27 `soixante-dixsept` | `2018/05/20161208_173343.jpg` | variants-only (`-2048x1152`, `-1536x864`, `-1024x576`, `-300x169`) |

So: **9 image references in 6 posts are genuinely broken on the live site** (they will stay broken unless the owner supplies the files), **11 references in 10 posts are recoverable** from `-scaled`/`-WxH` renditions, and the other 693 references plus all 209 featured images are present. Also 404 on live: the video link `2018/01/Actually.mov` in `kickstarter`. 2 posts have `srcset` candidates whose exact size file is absent while the base file exists (harmless). All 4 external `static.xx.fbcdn.net` emoji images and the 2 YouTube iframes are external and were not mirrored.

### 5.3 Where the files are

Local path for a URL `https://swaanelauwaert.com/wp-content/uploads/sites/50/<rest>` is `mirror/raw/swaanelauwaert.com/wp-content/uploads/sites/50/<rest>` (years 2012, 2013, 2018, 2020, 2026) or `mirror/media/wp-content/uploads/sites/50/<rest>` (2012, 2013, 2014, 2015, 2016, 2017, 2018, 2020, 2026). Both roots must be merged for the rebuild; where both hold a file they are the same upload.

---

## 6. Rebuild checklist (blog only)

1. Content collection of 210 posts from the REST dump: `id`, `slug`, `date` (Europe/Paris), `title.rendered` (keep trailing periods and HTML entities such as `&#8217;`/`&#8230;`), `content.rendered` (unwrap `rel="attachment"` links, fix the extension-less `IMG_2628` src, map `-scaled`/sized variants, decide on `su-dropcap` spans and Facebook emoji images, keep the two YouTube iframes), `excerpt.rendered` (for meta description/og), `categories`, `tags`, featured image from `_embedded["wp:featuredmedia"][0]` (`source_url`, width/height, 4:3 crop for cards).
2. Journal listing at `/nl/journal/` (and `/en/the-journal/`, `/fr/le-journal/` with the language-specific intro texts and either the empty state or the Dutch posts): intro block (button `SUBSTACK` — supply the missing href `https://substack.com/@swaanelauwaert1`, quote with H1 + two paragraphs), 3-column grid, 9 per page, pagination `← Vorige pagina` / numbers with `…` / `Volgende pagina →`, `aria-label="Paginering"`.
3. Archives: `Categorie: <name>`, `Tag: <name>`, `Auteur: swaanelauwaert` headings; **filter by term** (live site does not — known defect); same grid and pagination.
4. Single post: title, byline `Geschreven door … in … op …`, content at 960 px, tag pills, "Like and share" row (sharing links can be plain intent URLs; Jetpack Likes cannot be rebuilt statically), subscribe aside (two headings + line; empty form slot), prev/next by date with `←`/`→` and post titles, comments (177 static comments from the mirrored pages; form optional), `Meer berichten` list of the 4 newest posts.
5. Head: `<title>{title} – Swaane Lauwaert</title>`, canonical, OG/Twitter from excerpt + featured image, `og:locale nl_BE`, no hreflang on posts.
6. Redirects per §4.3; RSS feed at `/nl/feed/`; sitemap.

---

## 7. What could not be determined from the mirror

* Comment counts/content for the 134 posts without a mirrored HTML page (no comments REST dump); whether the comment form is hidden on the one `comment_status: closed` post.
* Whether the Jetpack subscription form (empty `div` in the subscribe aside) renders on the live site and what its fields/labels are; the real appearance of the Jetpack Likes widget (iframe from widgets.wp.com).
* The `SUBSTACK` button's intended `href` (none in the mirror; the quote links to `https://substack.com/@swaanelauwaert1`).
* The body of any RSS feed, any date archive (`/nl/2018/`), any attachment page, the 5 unmirrored category archives and 4 unmirrored tag archives (assumed identical to the mirrored ones).
* Public URL structures of the former domains `swaanelauwaert.be` and `onestparti.be`; rules of the active Redirection plugin.
* The 9 image files that are 404 on the live site (§5.2) and `Actually.mov`.
* Whether `date_gmt == date` means the stored times are local or UTC (treated as local; rendered offset is `+02:00`).
* Any CSS for `ona-post`, `ona-container`, `hover-scale` (none found; assumed inert).
* Language of the listing's `<title>` on NL ("The Journal") is as served, not an error.

---

## Appendix A — All 210 posts (chronological)

Columns: `Imgs` = `<img>` tags in content; `Words` = text words; `Markup` = `blocks` if `wp-block-*` markup is present; `HTML in mirror` = a rendered page exists under `mirror/raw/swaanelauwaert.com/nl/YYYY/MM/DD/<slug>/`; `Comments` = comments visible on that page (`?` = page not mirrored). Permalink = `https://swaanelauwaert.com/nl/YYYY/MM/DD/<slug>/`.

| Date | ID | Slug | Title (verbatim) | Categories | Tags | Featured image (`wp-content/uploads/sites/50/…`) | Imgs | Words | Markup | HTML in mirror | Comments |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 2012-04-22 | 4174 | `test-post-1` | Pasta met tomatensaus | On est parti! | emigreren frankrijk | `2012/04/IMG_2628.jpg` | 5 | 915 | classic | yes | 17 |
| 2012-04-25 | 124 | `het-mysterie-van-de-halve-brug` | Het Mysterie van de halve brug… | On est parti! | emigreren frankrijk | `2012/04/IMG_1698-scaled.jpg` | 5 | 576 | classic | yes | 0 |
| 2012-05-02 | 136 | `lome-dagen` | Lome Dagen… | On est parti! | emigreren frankrijk | `2012/05/IMG_1789.jpg` | 8 | 387 | classic | yes | 4 |
| 2012-05-06 | 149 | `de-storm-en-de-mierenhoop` | De storm en de mierenhoop | On est parti! | emigreren frankrijk, groen leven | `2012/05/IMG_1875-scaled.jpg` | 5 | 472 | classic | yes | 6 |
| 2012-05-10 | 157 | `de-joskes` | De Joskes! | On est parti! | emigreren frankrijk | `2012/05/IMG_19391-scaled.jpg` | 12 | 351 | classic | yes | 2 |
| 2012-05-12 | 182 | `a-tribute-to-youpie` | A tribute to Youpie | On est parti! | emigreren frankrijk | `2012/05/IMG_2902.jpg` | 14 | 1273 | classic | yes | 8 |
| 2012-05-22 | 230 | `modder-en-rio-de-janeiro` | Modder en Rio de Janeiro | On est parti! | emigreren frankrijk | `2012/05/IMG_1669-scaled.jpg` | 4 | 956 | classic | yes | 6 |
| 2012-05-29 | 257 | `home-sweet-home` | Home sweet Home! | On est parti! | emigreren frankrijk, groen leven | `2012/05/IMG_2931-1.jpg` | 15 | 462 | classic | yes | 4 |
| 2012-06-03 | 276 | `la-vie-en-rose` | La vie en Rose | On est parti! | emigreren frankrijk, groen leven | `2012/06/IMG_2961.jpg` | 19 | 741 | classic | yes | 4 |
| 2012-06-10 | 315 | `huizenjacht` | Huizenjacht | On est parti! | bouwen in stro en leem, emigreren frankrijk, groen leven | `2012/06/IMG_2060-scaled.jpg` | 7 | 988 | classic | yes | 3 |
| 2012-06-22 | 336 | `het-leven-zoals-het-is-on-the-road-2` | Het leven zoals het is, on the road. | On est parti! | emigreren frankrijk, groen leven, moestuin | `2012/06/IMG_2537-scaled.jpg` | 17 | 661 | classic | yes | 4 |
| 2012-07-02 | 397 | `eitjes-met-choco-en-vliegende-herten` | Eitjes met choco en vliegende herten! | On est parti! | emigreren frankrijk | `2012/07/IMG_2720-scaled.jpg` | 14 | 718 | classic | yes | 5 |
| 2012-07-06 | 426 | `the-promised-land` | THE PROMISED LAND!!! | On est parti! | bouwen in stro en leem, emigreren naar Frankrijk, groen leven, moestuin | `2012/07/IMG_2859-scaled.jpg` | 14 | 723 | classic | yes | 23 |
| 2012-07-28 | 492 | `stoemp-met-erwten-en-salie` | Stoemp met erwten en salie | On est parti! | emigreren frankrijk, groen leven, moestuin | `2012/07/IMG_2986-scaled.jpg` | 2 | 179 | classic | yes | 5 |
| 2012-08-11 | 520 | `thuis` | Thuis | On est parti! | emigreren frankrijk | `2012/08/IMG_2942-2-scaled.jpg` | 15 | 315 | classic | yes | 1 |
| 2012-08-15 | 539 | `slaatje-van-courgette-met-thijm-en-citroen` | Slaatje van courgette met thijm en citroen | On est parti! | emigreren frankrijk, food, groen leven, moestuin | `2012/08/IMG_3118-scaled.jpg` | 2 | 124 | classic | yes | 1 |
| 2012-09-04 | 547 | `de-overbevolkte-berg-en-een-week-hart` | De overbevolkte berg en een week hart | On est parti! | emigreren frankrijk, groen leven, moestuin | `2012/09/IMG_0011-scaled.jpg` | 12 | 1036 | classic | yes | 8 |
| 2012-09-26 | 565 | `losgelopen-geitjes-en-ball-folk` | Loslopende geitjes en Ball Folk | On est parti! | — | `2012/09/IMG_0268-1-scaled.jpg` | 10 | 943 | blocks | yes | 3 |
| 2012-10-05 | 595 | `tegelkachels-en-droogtoiletten` | Tegelkachels en droogtoiletten | On est parti! | — | `2012/10/papiers-peints-carl-larsson-quand-les-enfants-sont-couches.jpg.jpg` | 5 | 672 | blocks | yes | 11 |
| 2012-11-02 | 616 | `sneeuwpret-en-psychedelische-paddenstoelen` | Sneeuwpret en psychedelische paddenstoelen | On est parti! | — | `2020/05/IMG_0711-e1589124355455-scaled.jpg` | 8 | 960 | blocks | yes | 9 |
| 2012-11-27 | 661 | `een-dik-wolkenpak-in-mijn-hoofd` | Een dik pak wolken in mijn hoofd | On est parti! | — | `2020/05/IMG_0808-scaled.jpg` | 4 | 518 | blocks | yes | 11 |
| 2012-12-20 | 681 | `alles-komt-op-sinen-tijd` | Alles komt op sinen tijd! | On est parti! | — | `2020/05/IMG_1011-scaled.jpg` | 3 | 996 | blocks | yes | 8 |
| 2013-01-17 | 803 | `de-troostende-berg-2` | De troostende berg | On est parti! | — | `2020/05/IMG_1319-scaled.jpg` | 12 | 528 | blocks | yes | 5 |
| 2013-02-09 | 807 | `de-ark-van-noach` | De Ark van Noach | On est parti! | — | `2013/02/IMG_1405-scaled.jpg` | 7 | 556 | blocks | yes | 6 |
| 2013-02-28 | 808 | `op-de-barricades-en-tomatenzaadjes` | Op de barricades en tomatenzaadjes | On est parti! | — | `2020/05/Photo-on-11-03-13-at-15.00-4.jpg` | 4 | 936 | blocks | yes | 6 |
| 2013-03-17 | 880 | `de-timmerman-en-de-godfather` | De Timmerman en de Godfather | On est parti! | — | `2020/05/1-44-scaled.jpg` | 4 | 763 | blocks | yes | 6 |
| 2013-04-05 | 901 | `verjaardagdramas-en-katten-braakballen` | Verjaardagdrama’s en katten braakballen | On est parti! | — | `2020/05/IMG_2609-e1589138651111-scaled.jpg` | 7 | 885 | blocks | yes | 3 |
| 2013-04-18 | 1024 | `lente-bedrijvigheid-en-pergolesi` | Lente bedrijvigheid en Pergolesi | On est parti! | — | `2020/05/IMG_3255-kopieren-e1589139128265-scaled.jpg` | 10 | 547 | blocks | yes | 5 |
| 2013-05-20 | 1078 | `mensen-zijn-gemaakt-van-dun-papier` | Mensen zijn gemaakt van dun papier | On est parti! | — | `2020/05/unnamed-file-1.jpg` | 3 | 746 | blocks | no | ? |
| 2013-06-27 | 1091 | `de-eeuwige-jachtvelden` | De eeuwige jachtvelden | On est parti! | — | `2020/05/IMG_8117-e1589141790983.jpg` | 8 | 539 | blocks | no | ? |
| 2013-08-18 | 1125 | `het-wordt-nooit-meer-zoals-vroeger-maar-dat-geeft-vleugels-aan-de-herinnering-dirk-lauwaert` | ‘Het wordt nooit meer zoals vroeger. Maar dat geeft vleugels aan het herinneren’ (Dirk Lauwaert) | On est parti! | — | `2020/05/IMG_0471.jpeg` | 3 | 441 | blocks | no | ? |
| 2013-08-24 | 1134 | `het-relaas-van-een-gebroken-hart` | Het relaas van een gebroken hart. | une par jour | — | `2013/08/foto-copy-3.jpg` | 1 | 696 | blocks | no | ? |
| 2013-11-02 | 1158 | `ondraaglijke-schoonheid-en-marsmeloenen` | Ondraaglijke schoonheid en Marsmeloenen | On est parti! | — | `2020/05/IMG_3974-scaled.jpg` | 18 | 952 | blocks | no | ? |
| 2014-01-04 | 1215 | `goede-voornemens` | Goede voornemens | On est parti! | — | `2020/05/IMG_4946-scaled.jpg` | 7 | 597 | blocks | no | ? |
| 2014-01-12 | 1273 | `oproep` | Oproep! Appel! | On est parti! | — | — | 1 | 419 | blocks | no | ? |
| 2014-02-07 | 1285 | `feestvarken-en-boudins` | Feestvarkens en boudins | On est parti! | — | `2020/11/IMG_5496-scaled.jpg` | 11 | 754 | blocks | no | ? |
| 2014-03-17 | 1325 | `de-grote-stad-en-het-peperkoekenhuisje` | De grote stad en het peperkoekenhuisje | On est parti! | — | `2020/11/IMG_5842-scaled.jpg` | 21 | 780 | blocks | no | ? |
| 2014-03-25 | 2162 | `het-prille-begin-van-een-spannend-vervolgverhaal` | Het prille begin van een spannend vervolgverhaal (charlie 1) | Charlie Rubriek, On est parti! | — | `2018/02/Screen-Shot-2018-02-05-at-16.00.31.png` | 4 | 476 | classic | no | ? |
| 2014-04-02 | 2174 | `swaane-komt-de-liefde-van-haar-leven-terug-tegen-charlie-2` | Swaane komt de liefde van haar leven terug tegen (Charlie 2) | Charlie Rubriek, On est parti! | — | `2018/02/21072010484.jpeg` | 3 | 757 | classic | no | ? |
| 2014-04-12 | 1358 | `eeuwenoude-breuklijnen-en-lijmende-koekjes` | Eeuwenoude breuklijnen en lijmende koekjes | On est parti! | — | `2020/11/DSC_2480-scaled.jpg` | 11 | 819 | blocks | no | ? |
| 2014-04-26 | 2179 | `het-begin-van-swaanes-hectische-leven-in-antwerpen-charlie-3` | Het begin van Swaane’s hectische leven in Antwerpen (Charlie 3) | Charlie Rubriek, On est parti! | — | `2018/02/KICX5964.jpg` | 4 | 1071 | classic | no | ? |
| 2014-05-19 | 2188 | `vlak-voor-hun-vertrek-naar-frankrijk-krijgt-swaane-slecht-nieuws-charlie-4` | Vlak voor hun vertrek naar Frankrijk krijgt Swaane slecht nieuws (Charlie 4) | Charlie Rubriek, On est parti! | — | `2018/02/swaane_0027_def2.jpeg` | 3 | 706 | classic | no | ? |
| 2014-06-11 | 1396 | `petit-petit-loiseau-fait-son-nid` | Petit à petit l’oiseau fait son nid | On est parti! | — | `2020/11/IMG_5847-scaled.jpg` | 15 | 452 | blocks | no | ? |
| 2014-08-24 | 1441 | `beproevingen` | Beproevingen… | On est parti! | — | `2020/11/IMG_6869-scaled.jpg` | 14 | 692 | blocks | no | ? |
| 2014-09-04 | 2194 | `swaane-ontdekt-de-hippie-in-zichzelf-charlie-5` | Swaane ontdekt de hippie in zichzelf (Charlie 5) | Charlie Rubriek, On est parti! | — | `2018/02/IMG_1788.jpeg` | 11 | 438 | classic | no | ? |
| 2014-09-17 | 2211 | `swaane-snakt-naar-een-beetje-comfort-charlie-6` | Swaane snakt naar een beetje comfort (Charlie 6) | Charlie Rubriek, On est parti! | — | `2014/09/IMG_2986.jpeg` | 9 | 711 | classic | no | ? |
| 2014-10-07 | 1606 | `indian-summer-en-nomaden` | Indian Summer en nomaden | On est parti! | — | `2014/10/0666749-copy.jpg` | 8 | 950 | classic | no | ? |
| 2014-10-15 | 2224 | `een-belangrijke-afspraak-bij-de-burgemeester-charlie-7` | Een belangrijke afspraak bij de burgemeester (Charlie 7) | Charlie Rubriek, On est parti! | — | `2018/02/IMG_2928-1-e1517856195757-scaled.jpg` | 6 | 772 | classic | no | ? |
| 2014-10-27 | 1985 | `de-revival-van-laura-en-het-kleine-huis-op-de-prairie` | De revival van ‘Laura en het kleine huis op de prairie’ | Non-fictie | — | `2018/01/Screen-Shot-2018-01-29-at-14.20.46.png` | 2 | 1030 | classic | no | ? |
| 2014-12-10 | 1654 | `wander-lost` | Not all those who wander are lost… | On est parti! | — | `2014/12/2014-12-25-18.10.55-copy.jpg` | 8 | 854 | classic | no | ? |
| 2014-12-17 | 2234 | `swaane-koopt-een-stuk-grond-of-toch-niet-charlie-8` | Swaane koopt een stuk grond. Of toch niet? (Charlie 8) | Charlie Rubriek, On est parti! | — | `2014/12/IMG_0809-scaled.jpg` | 8 | 983 | classic | no | ? |
| 2015-01-07 | 2087 | `charlie-de-week-van-swaane` | Charlie: De week van Swaane | Non-fictie | — | `2015/01/10898193_10152703115663843_8732448317403600042_n.jpg` | 0 | 512 | classic | no | ? |
| 2015-01-20 | 2255 | `een-ontmoeting-met-een-vreemde-vogel-charlie-9` | Een ontmoeting met een vreemde vogel (Charlie 9) | Charlie Rubriek, On est parti! | — | `2014/12/IMG_8048.jpg` | 3 | 727 | classic | no | ? |
| 2015-02-03 | 2091 | `helden-van-iran-shahla-sherkat` | Helden van Iran: Shahla Sherkat | Non-fictie | — | `2015/02/Eftekhari.jpg` | 4 | 1091 | classic | no | ? |
| 2015-02-13 | 2259 | `op-zoek-naar-een-echt-huis-charlie-10` | Op zoek naar een echt huis (Charlie 10) | Charlie Rubriek, On est parti! | — | `2018/02/IMG_0101-1-e1517861223443.jpeg` | 5 | 574 | classic | no | ? |
| 2015-03-01 | 1695 | `winter-blues` | Winter blues | On est parti! | — | `2015/03/DSCF3951-copy-e1518551649272-scaled.jpg` | 8 | 1370 | classic | no | ? |
| 2015-03-20 | 1739 | `een-gewone-werkdag` | Een gewone werkdag | On est parti! | — | `2015/03/IMG_20150319_153355.jpg` | 6 | 499 | classic | no | ? |
| 2015-03-25 | 2267 | `swaane-krijgt-slecht-nieuws-van-het-thuisfront-charlie-11` | Swaane krijgt slecht nieuws van het thuisfront (Charlie 11) | Charlie Rubriek, On est parti! | — | `2018/02/DSCF9917.jpg` | 5 | 459 | classic | no | ? |
| 2015-04-19 | 1758 | `de-rondborstige-migrante-met-rode-huid-en-accent` | De rondborstige migrante met rode huid en accent | On est parti! | — | `2015/04/DSCF5140-copy-scaled.jpg` | 2 | 682 | classic | no | ? |
| 2015-04-22 | 2278 | `voor-de-eerste-keer-naar-een-franse-school-charlie-12` | Voor de eerste keer naar een Franse school (Charlie 12) | Charlie Rubriek, On est parti! | — | `2015/04/IMG_0011-1-scaled.jpg` | 6 | 925 | classic | no | ? |
| 2015-06-03 | 2289 | `nozieres-waar-creches-en-babysits-niet-blijken-te-bestaan-charlie-13` | Nozières: waar crèches en babysits niet blijken te bestaan (Charlie 13) | Charlie Rubriek, On est parti! | — | `2015/06/Screen-Shot-2018-02-07-at-10.10.20.png` | 6 | 856 | classic | no | ? |
| 2015-08-12 | 2336 | `een-les-in-nederigheid-charlie-14` | Een les in nederigheid (Charlie 14) | Charlie Rubriek, On est parti! | — | `2015/08/Screen-Shot-2018-02-13-at-15.18.01.png` | 7 | 780 | classic | no | ? |
| 2015-08-22 | 1764 | `wij-gaan-naar-calais-en-nemen-mee` | Wij gaan naar Calais en nemen mee… | Non-fictie | — | `2015/08/Screen-Shot-2018-02-05-at-15.15.24.png` | 4 | 594 | classic | no | ? |
| 2015-10-13 | 2328 | `vlees-het-kan-ook-anders` | Vlees, het kan ook anders | Non-fictie | — | `2015/10/DSCF4196-e1518530569488-scaled.jpg` | 3 | 1568 | classic | no | ? |
| 2015-11-21 | 1788 | `de-wetten-van-de-jungle` | De wetten van de Jungle | Non-fictie | — | `2015/11/Screen-Shot-2018-02-05-at-15.29.08.png` | 13 | 2089 | classic | no | ? |
| 2015-11-21 | 1795 | `tijd-die-door-je-handen-glijdt-en-een-wereld-die-davert` | Tijd die door je handen glijdt en een wereld die davert | On est parti! | — | `2015/11/12002553_10154295988854832_853701122067097437_o-copy.jpg` | 18 | 524 | classic | no | ? |
| 2016-01-04 | 2347 | `hoe-het-dorp-werd-gered-met-zoete-koekjes-charlie-15` | Hoe het dorp werd gered met zoete koekjes (Charlie 15) | Charlie Rubriek, On est parti! | — | `2016/01/Screen-Shot-2018-02-13-at-15.26.21.png` | 9 | 1256 | classic | no | ? |
| 2016-05-01 | 1997 | `promesse-de-gascon` | promesse de gascon. | Poëzie | — | `2018/01/Screen-Shot-2018-01-29-at-14.44.52.png` | 0 | 24 | classic | no | ? |
| 2016-06-28 | 1816 | `soms-is-het-leven-gewoon-kt` | Soms is het leven gewoon k*t! | On est parti! | — | `2016/06/14717073_10207813770967660_7000959619128932127_n-copy-2.jpg` | 6 | 1200 | classic | no | ? |
| 2016-06-29 | 1993 | `zinloos` | zinloos. | Poëzie | — | `2018/01/Screen-Shot-2018-01-29-at-14.36.56.png` | 0 | 11 | classic | no | ? |
| 2016-08-10 | 2360 | `het-wordt-nooit-meer-zoals-vroeger-charlie-16` | Het wordt nooit meer zoals vroeger (Charlie 16) | Charlie Rubriek, On est parti! | — | `2016/08/920547_4993210712644_422552052_o-copy.jpeg` | 2 | 1111 | classic | no | ? |
| 2016-08-29 | 1990 | `racines` | racines. | Poëzie | — | `2018/01/Screen-Shot-2018-01-29-at-14.49.22.png` | 0 | 27 | classic | no | ? |
| 2016-09-29 | 1963 | `chagrin` | chagrin. | Poëzie | — | `2018/01/Screen-Shot-2018-01-29-at-13.48.20.png` | 0 | 27 | classic | no | ? |
| 2017-01-01 | 1967 | `open-call` | Open call! | Actually, Magazine | — | `2018/01/Screen-Shot-2017-12-19-at-19.50.21.png` | 0 | 392 | classic | no | ? |
| 2017-01-06 | 1844 | `verliefd-op-een-huis-dat-nog-niet-af-is` | Verliefd op een huis dat nog niet af is. (Charlie 17) | Charlie Rubriek, On est parti! | — | `2017/01/Screen-Shot-2018-01-15-at-13.34.43.png` | 8 | 724 | classic | no | ? |
| 2017-02-01 | 1959 | `leon-spilliaert` | Ze gaf zich over aan de nacht | Kortverhalen | — | `2018/01/Screen-Shot-2018-01-29-at-13.40.21.png` | 0 | 1056 | classic | no | ? |
| 2017-02-01 | 2031 | `elle-se-livrait-a-la-nuit` | Elle se livrait à la nuit | Kortverhalen | — | `2018/01/Screen-Shot-2018-01-29-at-15.56.37.png` | 0 | 1062 | classic | no | ? |
| 2017-02-15 | 1971 | `vrouwen-die-vertrokken-agnieszka-uit-polen` | Vrouwen die vertrokken: Agnieszka uit Polen | Interviews | — | `2018/01/Screen-Shot-2018-01-29-at-14.06.30.png` | 6 | 1610 | classic | no | ? |
| 2017-03-01 | 2110 | `ik-wow-van-jouw` | Ik WOW van jouw! | Interviews | — | `2017/03/Screen-Shot-2018-02-05-at-14.52.10.png` | 2 | 7 | classic | no | ? |
| 2017-03-06 | 2077 | `vrouwen-die-vertrokken-marij-verliet-nederland` | Vrouwen die vertrokken: Marij verliet Nederland | Interviews | — | `2018/01/Screen-Shot-2018-01-30-at-12.52.57.png` | 4 | 1311 | classic | no | ? |
| 2017-03-15 | 2299 | `limerence` | Limerence. | Poëzie | — | `2018/02/tumblr_o63dqlxLfP1s4zvvyo1_500.jpg` | 0 | 42 | classic | no | ? |
| 2017-03-15 | 2302 | `part-2` | part 2. | Poëzie | — | `2018/02/tumblr_o2iw6phtdg1rd4tsfo1_500.jpg` | 0 | 32 | classic | no | ? |
| 2017-05-12 | 1889 | `1889-2` | Het einde van mijn schrijvershol… (Charlie 18) | Charlie Rubriek, On est parti! | — | `2017/05/Screen-Shot-2018-01-11-at-14.45.38.png` | 11 | 639 | classic | no | ? |
| 2017-05-15 | 2656 | `withdrawal-sucks` | Withdrawal sucks. | Poëzie | — | `2018/05/tumblr_oz6cluGQw31wa84xco1_r1_500.gif` | 0 | 27 | classic | no | ? |
| 2017-09-12 | 1916 | `le-funky-falafel` | Le Funky Falafel (Charlie 19) | Charlie Rubriek, On est parti! | — | `2017/09/20133707_1030688430401029_645107463_o.jpg` | 4 | 675 | classic | no | ? |
| 2017-12-20 | 2008 | `kickstarter` | Kickstarter! | Actually, Magazine | — | `2017/12/16195442_1784385101887793_8199533501322025174_n.jpg` | 0 | 390 | classic | no | ? |
| 2018-02-11 | 2306 | `un` | un. | une par jour | — | `2018/02/DSCF3203-e1518337044227-scaled.jpg` | 1 | 2 | classic | no | ? |
| 2018-02-12 | 2312 | `deux` | deux. | une par jour | — | `2018/02/DSCF3221-scaled.jpg` | 1 | 4 | classic | no | ? |
| 2018-02-13 | 2318 | `trois` | trois. | une par jour | — | `2018/02/DSCF3238-e1518507877657-scaled.jpg` | 1 | 3 | classic | no | ? |
| 2018-02-14 | 2414 | `quatre` | quatre. | une par jour | — | `2018/02/IMG_20180212_134756-bw-scaled.jpg` | 1 | 4 | classic | no | ? |
| 2018-02-15 | 2418 | `cinq` | cinq. | une par jour | — | `2018/02/DSCF3255-B-scaled.jpg` | 1 | 2 | classic | no | ? |
| 2018-02-16 | 2421 | `six` | six. | une par jour | — | `2018/02/DSCF3304-B-scaled.jpg` | 1 | 3 | classic | no | ? |
| 2018-02-17 | 2424 | `sept` | sept. | une par jour | — | `2018/02/DSCF3364-copy-B-scaled.jpg` | 1 | 8 | classic | no | ? |
| 2018-02-18 | 2427 | `huit` | huit. | une par jour | — | `2018/02/12742711_10154615956139832_8144592281023486796_n.jpg` | 1 | 17 | classic | no | ? |
| 2018-02-19 | 2430 | `neuf` | neuf. | une par jour | — | `2018/02/DSCF3419-A-scaled.jpg` | 1 | 5 | classic | no | ? |
| 2018-02-20 | 2433 | `dix` | dix. | une par jour | — | `2018/02/DSCF3406-A-scaled.jpg` | 1 | 1 | classic | no | ? |
| 2018-02-21 | 2436 | `onze` | onze. | une par jour | — | `2018/02/DSCF3290-scaled.jpg` | 1 | 3 | classic | no | ? |
| 2018-02-22 | 2441 | `douze` | douze. | une par jour | — | `2018/02/DSCF3520-B-scaled.jpg` | 1 | 4 | classic | no | ? |
| 2018-02-23 | 2444 | `treize` | treize. | une par jour | — | `2018/02/DSCF3436-copy-scaled.jpg` | 1 | 3 | classic | no | ? |
| 2018-02-24 | 2447 | `quatorze` | quatorze. | une par jour | — | `2018/02/DSCF3562-B-scaled.jpg` | 1 | 2 | classic | no | ? |
| 2018-02-26 | 2450 | `quinze` | quinze. | une par jour | — | `2018/02/28336834_10157177184369832_2111892334100209819_o.jpg` | 1 | 6 | classic | no | ? |
| 2018-02-27 | 2455 | `seize` | seize. | une par jour | — | `2018/02/IMG_20180227_125027-B-scaled.jpg` | 1 | 10 | classic | no | ? |
| 2018-02-28 | 2458 | `dix-sept` | dix-sept. | une par jour | — | `2018/02/IMG_20180228_163043-scaled.jpg` | 1 | 5 | classic | no | ? |
| 2018-03-01 | 2463 | `dix-huit` | dix-huit. | une par jour | — | `2018/03/DSCF3232-scaled.jpg` | 1 | 7 | classic | no | ? |
| 2018-03-03 | 2466 | `dix-neuf` | dix-neuf. | une par jour | — | `2018/03/DSCF3673-scaled.jpg` | 1 | 41 | classic | no | ? |
| 2018-03-04 | 2470 | `vingt` | vingt. | une par jour | — | `2018/03/DSCF3827-scaled.jpg` | 1 | 1 | classic | no | ? |
| 2018-03-05 | 2474 | `vingt-et-un` | vingt-et-un. | une par jour | — | `2018/03/DSCF3668-scaled.jpg` | 1 | 3 | classic | no | ? |
| 2018-03-06 | 2477 | `vingt-et-deux` | vingt deux. | une par jour | — | `2018/03/DSCF3839-scaled.jpg` | 1 | 1 | classic | no | ? |
| 2018-03-07 | 2481 | `vingt-trois` | vingt trois. | une par jour | — | `2018/03/DSCF3730-scaled.jpg` | 1 | 5 | classic | no | ? |
| 2018-03-08 | 2485 | `vingt-quatre` | vingt quatre. | une par jour | — | `2018/03/DSCF3874-scaled.jpg` | 1 | 4 | classic | no | ? |
| 2018-03-12 | 2489 | `vingt-cinq` | vingt cinq. | une par jour | — | `2018/03/DSCF3674-scaled.jpg` | 1 | 2 | classic | no | ? |
| 2018-03-13 | 2493 | `vingt-six` | vingt six. | une par jour | — | `2018/03/DSCF4001-B-scaled.jpg` | 1 | 7 | classic | no | ? |
| 2018-03-14 | 2496 | `vingt-sept` | vingt sept. | une par jour | — | `2018/03/DSCF4003-scaled.jpg` | 1 | 4 | classic | no | ? |
| 2018-03-15 | 2500 | `vingt-huit` | vingt huit. | une par jour | — | `2018/03/IMG_20180315_200058.jpg` | 1 | 12 | classic | no | ? |
| 2018-03-16 | 2503 | `vingt-neuf` | vingt neuf. | une par jour | — | `2018/03/DSCF4011-scaled.jpg` | 1 | 9 | classic | no | ? |
| 2018-03-17 | 2506 | `trente` | trente. | une par jour | — | `2018/03/DSCF4049-scaled.jpg` | 1 | 8 | classic | no | ? |
| 2018-03-18 | 2509 | `trente-et-un` | trente-et-un. | une par jour | — | `2018/03/DSCF4054-scaled.jpg` | 1 | 4 | classic | no | ? |
| 2018-03-19 | 2512 | `trente-deux` | trente deux. | une par jour | — | `2018/03/DSCF4074-scaled.jpg` | 1 | 7 | classic | no | ? |
| 2018-03-20 | 2516 | `trente-trois` | trente trois. | une par jour | — | `2018/03/IMG_20180320_172359-B-scaled.jpg` | 1 | 7 | classic | no | ? |
| 2018-03-21 | 2520 | `trente-quatre` | trente quatre. | une par jour | — | `2018/03/IMG_20180321_090027-C-scaled.jpg` | 1 | 6 | classic | no | ? |
| 2018-03-22 | 2523 | `letting-go` | Letting go… | Kortverhalen | — | `2018/03/DSCF3440-copy-scaled.jpg` | 11 | 378 | classic | no | ? |
| 2018-03-23 | 2536 | `trente-cinq` | trente cinq. | une par jour | — | `2018/03/DSCF4112-scaled.jpg` | 1 | 6 | classic | no | ? |
| 2018-03-24 | 2539 | `trente-six` | trente six. | une par jour | — | `2018/03/DSCF4182-scaled.jpg` | 1 | 5 | classic | no | ? |
| 2018-03-25 | 2543 | `trente-sept` | trente sept. | une par jour | — | `2018/03/DSCF4271-B-scaled.jpg` | 1 | 4 | classic | no | ? |
| 2018-03-26 | 2547 | `trente-huit` | trente huit. | une par jour | — | `2018/03/DSCF4121-B-scaled.jpg` | 1 | 6 | classic | no | ? |
| 2018-03-27 | 2551 | `trente-neuf` | trente neuf. | une par jour | — | `2018/03/DSCF4289-B-scaled.jpg` | 1 | 14 | classic | no | ? |
| 2018-03-28 | 2557 | `quarante` | quarante. | une par jour | — | `2018/03/DSCF4234-scaled.jpg` | 1 | 11 | classic | no | ? |
| 2018-03-29 | 2560 | `quarante-et-un` | quarante-et-un. | une par jour | — | `2018/03/DSCF4140-scaled.jpg` | 1 | 4 | classic | no | ? |
| 2018-04-02 | 2564 | `quarante-deux` | quarante deux. | une par jour | — | `2018/04/DSCF4544-B-scaled.jpg` | 1 | 2 | classic | no | ? |
| 2018-04-05 | 2569 | `quarant-trois` | quarant trois. | une par jour | — | `2018/04/DSCF4228-scaled.jpg` | 1 | 4 | classic | no | ? |
| 2018-04-09 | 2572 | `quarante-quatre` | quarante quatre. | une par jour | — | `2018/04/DSCF4608-scaled.jpg` | 1 | 8 | classic | no | ? |
| 2018-04-10 | 2577 | `quarante-cinq` | quarante cinq. | une par jour | — | `2018/04/DSCF4625-B-scaled.jpg` | 1 | 5 | classic | no | ? |
| 2018-04-11 | 2580 | `quarante-six` | quarante six. | une par jour | — | `2018/04/DSCF4671-B-scaled.jpg` | 1 | 6 | classic | no | ? |
| 2018-04-13 | 2584 | `quarante-sept` | quarante  sept. | une par jour | — | `2018/04/DSCF4259-scaled.jpg` | 1 | 3 | classic | no | ? |
| 2018-04-15 | 2587 | `quarante-huit` | quarante huit. | une par jour | — | `2018/04/DSCF4646-scaled.jpg` | 1 | 6 | classic | no | ? |
| 2018-04-22 | 2593 | `quarante-neuf` | quarante neuf. | une par jour | — | `2018/04/DSCF4753-scaled.jpg` | 1 | 4 | classic | no | ? |
| 2018-04-23 | 2597 | `cinquante` | cinquante. | une par jour | — | `2018/04/DSCF4810-scaled.jpg` | 1 | 5 | classic | no | ? |
| 2018-04-24 | 2600 | `cinquante-et-un` | cinquante-et-un. | une par jour | — | `2018/04/DSCF4777-scaled.jpg` | 1 | 10 | classic | no | ? |
| 2018-04-25 | 2604 | `cinquante-deux` | cinquante deux. | une par jour | — | `2018/04/DSCF4862-scaled.jpg` | 1 | 16 | classic | no | ? |
| 2018-04-26 | 2607 | `cinquante-trois` | cinquante trois. | une par jour | — | `2018/04/DSCF4832-scaled.jpg` | 1 | 3 | classic | no | ? |
| 2018-04-27 | 2610 | `cinquante-quatre` | cinquante quatre. | une par jour | — | `2018/04/DSCF4818-scaled.jpg` | 1 | 2 | classic | no | ? |
| 2018-04-28 | 2614 | `cinquante-cinq` | cinquante cinq. | une par jour | — | `2018/04/DSCF4836-scaled.jpg` | 1 | 2 | classic | no | ? |
| 2018-04-29 | 2619 | `cinquante-six` | cinquante six. | une par jour | — | `2018/04/DSCF4821-scaled.jpg` | 1 | 3 | classic | no | ? |
| 2018-04-30 | 2623 | `cinquante-sept` | cinquante sept. | une par jour | — | `2018/04/DSCF4856-scaled.jpg` | 1 | 2 | classic | no | ? |
| 2018-05-02 | 2626 | `cinquante-huit` | cinquante huit. | une par jour | — | `2018/05/IMG_20180502_174441452.jpg` | 1 | 6 | classic | no | ? |
| 2018-05-03 | 2629 | `cinquante-neuf` | cinquante neuf. | une par jour | — | `2018/05/DSCF4863-B-scaled.jpg` | 1 | 4 | classic | no | ? |
| 2018-05-04 | 2632 | `soixante` | soixante. | une par jour | — | `2018/05/DSCF4880-scaled.jpg` | 1 | 11 | classic | no | ? |
| 2018-05-05 | 2636 | `soixante-et-un` | soixante-et-un. | une par jour | — | `2018/05/DSCF4895-B-scaled.jpg` | 1 | 3 | classic | no | ? |
| 2018-05-06 | 2640 | `soixante-deux` | soixante deux. | une par jour | — | `2018/05/IMG_20180506_153255060.jpg` | 1 | 4 | classic | no | ? |
| 2018-05-08 | 2643 | `soixante-trois` | soixante trois. | une par jour | — | `2018/05/IMG_20180508_160457-B-scaled.jpg` | 1 | 3 | classic | no | ? |
| 2018-05-09 | 2646 | `soixante-quatre` | soixante quatre. | une par jour | — | `2018/05/DSCF4911-B-scaled.jpg` | 1 | 5 | classic | no | ? |
| 2018-05-10 | 2649 | `soixante-sept` | soixante sept. | une par jour | — | `2018/05/DSCF4903-C-scaled.jpg` | 1 | 3 | classic | no | ? |
| 2018-05-12 | 2652 | `soixante-huit` | soixante huit. | une par jour | — | `2018/05/IMG_20180512_141523366-B-scaled.jpg` | 1 | 13 | classic | no | ? |
| 2018-05-19 | 2659 | `soixante-neuf` | soixante neuf. | une par jour | — | `2018/05/33020200_10157435521824832_1794208491821334528_o.jpg` | 1 | 4 | classic | no | ? |
| 2018-05-20 | 2663 | `septante` | septante. | une par jour | — | `2018/05/33078801_10157438977179832_1229814128013475840_o.jpg` | 1 | 1 | classic | no | ? |
| 2018-05-21 | 2666 | `soixante-et-onze` | soixante-et-onze | une par jour | — | `2018/05/Instant_20180520_211206.jpeg` | 1 | 3 | classic | no | ? |
| 2018-05-22 | 2671 | `soixante-douze` | soixante douze | une par jour | — | `2018/05/Instant_20180520_210518.jpeg` | 1 | 6 | classic | yes | 0 |
| 2018-05-23 | 2675 | `soixante-treize` | soixante treize. | une par jour | — | `2018/05/20180523_131649_001-B-scaled.jpg` | 1 | 3 | classic | yes | 0 |
| 2018-05-24 | 2678 | `soixante-quatorze` | soixante quatorze. | une par jour | — | `2018/05/Instant_20180523_150717.jpeg` | 1 | 7 | classic | yes | 0 |
| 2018-05-25 | 2681 | `home-is-wherever-im-with-you` | HOME IS WHEREVER I’M WITH YOU | Kortverhalen | — | `2018/05/26962178_10211561935189423_2680400283009230520_o.jpg` | 1 | 1603 | classic | yes | 0 |
| 2018-05-25 | 2687 | `soixante-quinze` | soixante quinze. | une par jour | — | `2018/05/Instant_20180523_150459.jpeg` | 1 | 1 | classic | yes | 0 |
| 2018-05-26 | 2690 | `lours` | l’ours. | Kortverhalen | — | `2018/05/26962178_10211561935189423_2680400283009230520_o.jpg` | 1 | 1601 | classic | yes | 0 |
| 2018-05-26 | 2693 | `soixante-seize` | soixante seize. | une par jour | — | `2018/05/Instant_20180526_173911.jpeg` | 1 | 0 | classic | yes | 0 |
| 2018-05-27 | 2697 | `soixante-dixsept` | soixante dixsept. | une par jour | — | `2018/05/20161208_173343-scaled.jpg` | 1 | 70 | classic | yes | 0 |
| 2018-05-28 | 2705 | `soixante-dixneuf` | soixante dixneuf. | une par jour | — | `2018/05/Instant_20180528_043247.jpeg` | 1 | 4 | classic | yes | 0 |
| 2018-05-29 | 2708 | `quatre-vingt` | quatre vingt. | une par jour | — | `2018/05/Instant_20180529_173655.jpeg` | 1 | 7 | classic | no | ? |
| 2018-05-30 | 2711 | `quatre-vingt-et-un` | quatre vingt-et-un. | une par jour | — | `2018/05/Instant_20180529_173323.jpg` | 1 | 4 | classic | no | ? |
| 2018-05-31 | 2715 | `quatre-vingt-deux` | quatre vingt deux. | une par jour | — | `2018/05/977661_10151968498009832_1544398539_o.jpg` | 1 | 7 | classic | no | ? |
| 2018-06-08 | 2718 | `quatre-vingt-trois` | quatre vingt trois. | une par jour | — | `2018/06/20180607_192646-B-scaled.jpg` | 1 | 4 | classic | no | ? |
| 2018-06-10 | 2723 | `quatre-vingt-quatre` | quatre vingt quatre. | une par jour | — | `2018/06/Instant_20180607_193229.jpeg` | 1 | 6 | classic | no | ? |
| 2018-06-11 | 2730 | `quatre-vingt-cinq` | quatre vingt cinq. | une par jour | — | `2018/06/Instant_20180611_173331.jpg` | 1 | 0 | classic | no | ? |
| 2018-06-23 | 2734 | `quatre-vingt-sept` | quatre vingt sept. | une par jour | — | `2018/06/Instant_20180620_114634.jpeg` | 1 | 1 | classic | yes | 0 |
| 2018-06-25 | 2738 | `quatre-vingt-huit` | quatre vingt huit. | une par jour | — | `2018/06/Instant_20180620_132827.jpeg` | 1 | 6 | classic | yes | 0 |
| 2018-07-04 | 2742 | `quatre-vingt-neuf` | quatre vingt neuf. | une par jour | — | `2018/07/36575602_10157570573334832_6948954268258795520_o.jpg` | 1 | 5 | classic | yes | 1 |
| 2018-07-05 | 2745 | `quatre-vingt-dix` | quatre vingt dix. | une par jour | — | `2018/07/36728162_10157572469799832_6091809500421947392_o.jpg` | 1 | 12 | classic | yes | 0 |
| 2018-07-05 | 2748 | `het-lang-verwachte-verhaal` | Het lang verwachte verhaal. | On est parti! | — | `2018/07/Instant_20180626_193821.jpeg` | 5 | 648 | classic | yes | 0 |
| 2018-07-08 | 2773 | `quatre-vingt-onze` | quatre vingt onze. | une par jour | — | `2018/07/36796745_10212121914823580_2636540102137872384_n-scaled.jpg` | 1 | 5 | classic | yes | 0 |
| 2018-07-09 | 2777 | `quatre-vingt-douze` | quatre vingt douze. | une par jour | — | `2018/07/Instant_20180708_221310.jpeg` | 1 | 4 | classic | yes | 0 |
| 2018-07-11 | 2780 | `quatre-vingt-treize` | quatre vingt treize. | une par jour | — | `2018/07/36901609_10157591836624832_5694025559500128256_o.jpg` | 1 | 5 | classic | yes | 0 |
| 2018-07-12 | 2786 | `quatre-vingt-quatorze` | quatre vingt quatorze. | une par jour | — | `2018/07/Instant_20180711_141022.jpeg` | 1 | 9 | classic | yes | 0 |
| 2018-07-13 | 2790 | `quatre-vingt-quinze` | quatre vingt quinze. | une par jour | — | `2018/07/Instant_20180711_141719.jpeg` | 1 | 2 | classic | yes | 0 |
| 2018-07-13 | 2793 | `laisser-aller` | Laisser aller… | Kortverhalen | — | `2018/03/DSCF3436-copy-scaled.jpg` | 11 | 406 | classic | yes | 0 |
| 2018-07-14 | 2795 | `quatre-vingt-seize` | quatre vingt seize. | une par jour | — | `2018/07/Instant_20180711_140312.jpeg` | 1 | 2 | classic | yes | 0 |
| 2018-07-15 | 2798 | `quatre-vingt-sept-2` | quatre vingt dix sept. | une par jour | — | `2018/07/Instant_20180711_140718.jpeg` | 1 | 5 | classic | yes | 0 |
| 2018-07-18 | 2802 | `quatre-vingt-dix-huit` | quatre vingt dix huit. | On est parti!, une par jour | — | `2018/07/20180718_162053-2-scaled.jpg` | 1 | 163 | classic | yes | 0 |
| 2018-07-19 | 2805 | `quatre-vingt-dix-neuf` | quatre vingt dix neuf. | une par jour | — | `2018/07/Instant_20180718_133803.jpeg` | 1 | 1 | classic | yes | 0 |
| 2018-07-23 | 2811 | `cent` | cent. | une par jour | — | `2018/07/Instant_20180722_140135.jpeg` | 1 | 8 | classic | yes | 0 |
| 2018-07-26 | 2810 | `quatre-vingt-dix-neuf-2` | cent et un. | une par jour | — | `2018/07/37798928_10157635147339832_5718415235665100800_o.jpg` | 1 | 3 | classic | yes | 0 |
| 2018-07-30 | 2817 | `cent-deux` | cent deux. | une par jour | — | `2018/07/20180729_174856-scaled.jpg` | 1 | 8 | classic | yes | 0 |
| 2018-08-02 | 2824 | `cent-quatre` | cent quatre. | une par jour | — | `2018/08/38412133_10157659357864832_4750111774995382272_o.jpg` | 1 | 5 | classic | yes | 0 |
| 2018-08-03 | 2821 | `cent-trois` | cent trois. | une par jour | — | `2018/08/Instant_20180801_145848.jpeg` | 1 | 4 | classic | yes | 0 |
| 2018-08-04 | 2827 | `cent-quatre-2` | cent quatre. | une par jour | — | `2018/08/38130132_10157652761254832_7353676093192142848_n.jpg` | 1 | 4 | classic | yes | 0 |
| 2018-08-10 | 2831 | `cent-cinq` | cent cinq. | On est parti!, une par jour | — | `2018/08/IMG_0307.jpg` | 4 | 86 | classic | yes | 0 |
| 2018-08-16 | 2835 | `cent-six` | cent six. | une par jour | — | `2018/08/106-scaled.jpeg` | 1 | 36 | classic | yes | 0 |
| 2018-08-17 | 2838 | `cent-sept` | cent sept. | une par jour | — | `2018/08/107-scaled.jpeg` | 1 | 14 | classic | yes | 0 |
| 2018-08-19 | 2842 | `cent-huit` | cent huit. | une par jour | — | `2018/08/108-scaled.jpeg` | 1 | 69 | classic | yes | 0 |
| 2018-08-26 | 2845 | `cent-neuf` | cent neuf. | une par jour | — | `2018/08/40112701_10157728329044832_2864473544090189824_o.jpg` | 1 | 13 | classic | yes | 0 |
| 2018-08-27 | 2849 | `cent-dix` | cent dix. | une par jour | — | `2018/08/20180826_104645-scaled.jpg` | 1 | 7 | classic | yes | 0 |
| 2018-08-28 | 2852 | `cent-onze` | cent onze. | une par jour | — | `2018/08/Badnols.jpg` | 1 | 3 | classic | yes | 0 |
| 2018-08-30 | 2858 | `cent-douze` | cent douze. | une par jour | — | `2018/08/40374128_10157740662669832_476457008661266432_o.jpg` | 1 | 25 | classic | yes | 0 |
| 2018-09-01 | 2863 | `cent-treize` | cent treize. | une par jour | — | `2018/09/20180829_151245-e1535785764673-scaled.jpg` | 1 | 6 | classic | yes | 0 |
| 2018-09-03 | 2866 | `cent-quatorze` | cent quatorze. | une par jour | — | `2018/09/Scan-2-scaled.jpeg` | 1 | 5 | classic | yes | 0 |
| 2018-09-09 | 2870 | `cent-quinze` | cent quinze. | une par jour | — | `2018/09/Instant_20180829_135205.jpeg` | 1 | 2 | classic | yes | 0 |
| 2018-09-11 | 2873 | `cent-dix-sept` | cent seize. | une par jour | — | `2018/09/20180830_105528-B-scaled.jpg` | 1 | 4 | classic | yes | 2 |
| 2018-09-30 | 2876 | `cent-dix-sept-2` | cent dix sept. | une par jour | — | `2018/09/20180930_1403500-B-scaled.jpg` | 1 | 3 | classic | yes | 0 |
| 2018-10-07 | 2882 | `cent-dix-huit` | cent dix huit. | On est parti!, une par jour | — | `2018/10/Ventemiglia-B.jpg` | 1 | 57 | classic | yes | 0 |
| 2018-10-08 | 2886 | `cent-dix-neuf` | cent dix neuf. | On est parti!, une par jour | — | `2018/10/IMG_20181006_175859-B-scaled.jpg` | 2 | 56 | classic | yes | 0 |
| 2018-10-09 | 2891 | `cent-vingt` | cent vingt. | une par jour | — | `2018/10/Instant_20181007_103126.jpeg` | 1 | 3 | classic | yes | 0 |
| 2018-10-10 | 2894 | `cent-vingt-et-un` | cent vingt et un. | une par jour | — | `2018/10/20181006_213843-D-scaled.jpg` | 1 | 1 | classic | yes | 0 |
| 2018-10-17 | 2899 | `cent-vingt-deux` | cent vingt deux. | une par jour | — | `2018/10/44175512_10157880861444832_997186630404014080_o.jpg` | 1 | 6 | classic | yes | 0 |
