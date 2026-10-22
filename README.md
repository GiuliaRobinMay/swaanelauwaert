# swaanelauwaert.com — static rebuild

A faithful, static recreation of [swaanelauwaert.com](https://swaanelauwaert.com) (WordPress 7.1,
Twenty Twenty-Five block theme, Polylang in English, Dutch and French), built with Astro so it can be
hosted on Vercel or Cloudflare and extended with a member portal for the online courses.

What is reproduced: the three home pages, all 35 static pages (EN 12, NL 13, FR 9), the 210 Dutch
journal posts with their images, The Journal listing with pagination, category/tag/author/month/year
archives, the RSS feed, the header with dropdown + mobile overlay + language switcher, the footer, the
hosting credit bar, the liability section, the contact form, share buttons, redirects for the old slugs,
the favicon, Open Graph tags and hreflang links. See `docs/site-audit.md` for what differs and why.

## Layout

| Path | Purpose |
| --- | --- |
| `src/content/pages/<lang>/*.md` | One file per WordPress page: front matter + the page's rendered block HTML (kept verbatim for fidelity). |
| `src/content/posts/nl/*.md` | One file per journal post (front matter + HTML). |
| `src/data/` | Taxonomies, comments, redirects, site icons — all generated. |
| `src/styles/wp-theme.css` | The original theme's CSS (block library + global styles + fonts), extracted from the mirror. Generated. |
| `src/styles/wp-layouts.css` | WordPress' per-page layout rules, unioned. Generated. |
| `src/styles/global.css` | Imports the above plus Tailwind utilities (no preflight) and a few small additions. |
| `src/layouts/`, `src/components/`, `src/pages/` | Astro templates: Base layout, Header, Footer, journal grid, pagination, post page, archives, 404, feed. |
| `src/lib/site.ts` | Navigation trees, UI strings per language, date formatting, URL helpers. |
| `public/media/` | Images (downscaled to max 1600 px) and `public/fonts/` (Floreal, Literata, Beiruti). Generated. |
| `mirror/` | The snapshot of the live site: REST API dumps (`api/`), raw HTML/CSS/JS (`raw/`), media, screenshots, extracted page data. |
| `scripts/mirror/` | The crawler used by the "Mirror source site" GitHub Action. |
| `scripts/migrate/` | `extract-theme-css.mjs` and `wp-to-content.mjs`: turn the mirror into content, media and CSS. |
| `scripts/check-links.mjs`, `scripts/check-text.mjs`, `scripts/fidelity-check.mjs` | Verification: broken references, missing text versus the original, pixel comparison with the original renders. |
| `docs/` | Audit documents, migration report, verification reports, member-portal plan. |

## Commands

```bash
npm install
npm run dev        # local preview at http://localhost:4321/en/
npm run build      # static output in dist/
npm run preview    # serve dist/
npm run migrate    # regenerate CSS, content, media and redirects from mirror/
node scripts/check-links.mjs   # after a build: every internal reference must resolve
node scripts/check-text.mjs    # after a build: visible text versus the original pages
```

Node 22.23 or newer is required (see `.nvmrc`).

## Deploying

The output is plain static files, so either host works without server code.

**Vercel** — import the GitHub repository; the framework is detected as Astro (`vercel.json` pins the
build command, output directory, trailing slashes, cache headers and the 301 redirects). Add the custom
domain `swaanelauwaert.com` and point DNS at Vercel.

**Cloudflare** — either *Pages* (build command `npm run build`, output directory `dist`, Node version
`22.23.4` via `NODE_VERSION`) or *Workers static assets* with `npx wrangler deploy` (`wrangler.jsonc`).
`public/_redirects` and `public/_headers` carry the redirects and headers.

Environment variables (both optional, see `.env.example`):

- `PUBLIC_CONTACT_FORM_ENDPOINT` — a form backend that accepts a JSON POST (Formspree, Web3Forms,
  Basin, or your own function). Without it the contact form opens the visitor's mail client addressed
  to `info@swaanelauwaert.com`.
- `PUBLIC_CONTACT_EMAIL` — overrides that address.

## Updating content

Pages and posts are HTML inside Markdown files with front matter; edit them directly. New posts go in
`src/content/posts/nl/YYYY-MM-DD-slug.md` with at least `title`, `wpSlug`, `path`, `lang`, `date`
and `wpId` (any unique number). Images go in `public/media/`.

To re-import from the live WordPress site, run the "Mirror source site" action (Actions tab) and then
`npm run migrate`. The crawler paces its requests because the host rate-limits bursts (HTTP 429).

## Member portal

The online courses (The Eros Sanctuary, Flavours of Desire) currently live on password-protected
WordPress pages whose content the public API does not expose. `docs/member-portal-plan.md` describes the
proposed portal (Supabase auth, Stripe, video hosting) that will replace them.
