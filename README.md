# swaanelauwaert.com — site recreation

Work in progress: a faithful rebuild of https://swaanelauwaert.com as a static site that
can be deployed to Vercel or Cloudflare Pages, with a member portal for online courses to follow.

## Layout

- `scripts/mirror/` — tooling that snapshots the live site (run by the "Mirror source site" GitHub Action).
- `mirror/` — the captured snapshot: REST dumps, raw HTML/CSS/JS, media library, screenshots, extracted page data.
