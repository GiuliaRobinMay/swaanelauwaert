# Site audit and rebuild decisions

Summary of what the snapshot revealed and how the rebuild handles it. The detailed audits written during
the migration are in `docs/audit/` (chrome, design system, pages per language, blog, integrations, assets,
critique).

## The original site

- WordPress 7.1.3 multisite subsite (`uploads/sites/50`), Twenty Twenty-Five block theme, hosted on
  o2switch (LiteSpeed cache, "Site by Pharéo | Hosted on The Permanently Moving Network" bar injected by
  the host).
- Polylang with three languages: `/en/` (default, `/` redirects there), `/nl/`, `/fr/`.
- Plugins seen: Jetpack (contact forms, likes, sharing, subscriptions, stats, payments), Polylang,
  LiteSpeed Cache, Redirection, Otter blocks, Akismet.
- Fonts: Floreal (custom webfont, site title and headings), Literata (body), Beiruti (buttons,
  pull-quotes). Colours: base `#fff7e6`, contrast `#191919`, accents `#c60000`, `#5f5f5f`, `#f1eee9`.
  Content width 960 px, wide 1340 px.
- Content: 3 home pages, 35 pages, 210 posts (all Dutch, 2012–2026, 24 journal pages of 9),
  6 categories, tags, comments on many older posts.

## What the rebuild reproduces exactly

Every page's block HTML is rendered with the theme's own CSS and fonts, so layout, typography and
spacing are the original's. The pixel comparison in `docs/fidelity-report.md` shows 0.0 % difference
for the static pages and about 1 % for the home pages (the remaining difference is the hero height
rounding). `docs/text-check.md` shows no missing words on any page; the missing words on old posts
are reader comments (see below). `docs/link-check.json` shows every internal reference resolving.

## Deliberate differences

| Topic | Original | Rebuild | Why |
| --- | --- | --- | --- |
| Contact form | Jetpack form posting to WordPress | Same markup; posts JSON to `PUBLIC_CONTACT_FORM_ENDPOINT`, or opens the mail client when unset | No server on a static host |
| Comments | Comment form + Akismet | Existing comments shown read-only (once imported); no form | Cannot accept submissions statically; a comments service can be added later |
| "Like and share" | Jetpack Like widget + share buttons | Share buttons with plain share links; no Like widget | WordPress.com-only feature |
| "Ontdek meer van Swaane Lauwaert" | Jetpack e-mail subscription form | Heading, text and a button to Substack | Jetpack subscriptions need WordPress.com |
| Journal pagination URLs | `?query-1-page=2` | `/nl/journal/page/2/` | Static hosts cannot vary on query strings |
| Category / tag archives | Showed the latest posts regardless of the term (theme template bug) | Show the posts that actually carry the term | Bug in the original |
| `/en/the-eros-sanctuary-2/` | Served the same page as `/en/body-untamed/` | 301 to `/en/body-untamed/` (the canonical and the one the menu uses) | One URL per page |
| `/nl/maria-magdalena-retreat-zuid-frankrijk-2027/` | Same page as `…-2026/` | 301 to `…-2026/` (canonical, used by the menu) | One URL per page |
| `/en/werk-met-mij/` | Empty page with a Dutch title | 301 to `/en/work-with-me/` | Empty |
| Language-less paths (`/about/` …) | Resolved by Polylang | 301 to the English page | Links inside old content use them |
| Attachment pages (`/post-slug/img_1234/`) | WordPress attachment pages | Image links point at the image file | Attachment pages do not exist statically |
| SUBSTACK button on The Journal | No `href` | Links to the Substack profile | Obvious intent |
| RSS | `/en/feed/`, `/nl/feed/` … | `/nl/feed.xml` (plus a redirect from `/nl/feed/`) | Only the Dutch posts exist |
| Password-protected course pages | WordPress password prompt | Title plus a notice; content not available | The public API withholds protected content (see open questions) |
| Media | Originals up to 8 MB | Downscaled to max 1600 px / JPEG 85 | Repository and page weight |
| Jetpack stats, speculation rules, emoji script | Present | Removed | Not needed |

Ten image files referenced by old posts return 404 on the live site as well; they are left as they
were (listed in `docs/migration-report.json`).

## Open questions for Swaane

1. **Course content.** The pages `/en/module-1/`, `/nl/the-eros-sanctuary-modules/`,
   `/en/flavours-of-desire-modules-english/`, `/fr/flavours-of-desire-2/modules/` and
   `/nl/flavours-of-desire-3/modules/` are password-protected; their text, videos and downloads must be
   exported from WordPress (or the passwords shared) to move them into the member portal.
2. **Contact form backend.** Which service should receive the form (Formspree, Web3Forms, or a small
   function sending to `info@swaanelauwaert.com`)?
3. **Comments.** Keep the old comments read-only, or add a comments service to posts?
4. **Newsletter.** All sign-up buttons link to Flodesk forms; Jetpack's subscription box is replaced by
   a Substack button. Fine, or should the Flodesk form be embedded?
5. **Hosting credit bar.** The "Site by Pharéo | Hosted on The Permanently Moving Network" bar came from
   the host; keep it, change it, or drop it?
6. **Small content fixes spotted during the audit** (left as-is to stay faithful): the English home's
   "[Discover 1-op-1 coaching →]" links to the Dutch `/nl/samenwerken/`; the French home has an empty
   button under the second pull-quote; the NL/FR homes keep the English contact heading and pull-quote;
   the cookbook page has an empty button; the FR menu item "Guide Sainte-Baume" points at the English
   page; "Ingnite" typo on the English Eros Sanctuary page.

## Verification tooling

- `scripts/fidelity-check.mjs` — screenshots the rebuilt pages and compares them with full-page renders of
  the mirrored originals (desktop 1440 px, `WIDTH=390` for mobile). Reports in `docs/fidelity-report*.md`.
- `scripts/check-text.mjs` — compares the visible words of each original page with the rebuilt page.
- `scripts/check-links.mjs` — every `href`, `src`, `url()` in `dist/` must exist.
