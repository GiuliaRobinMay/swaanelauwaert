# Member portal for online courses — architecture plan

Status: proposal (phase 2, after the public site is live). Nothing here is built yet.

## What exists today (from the site audit)

| Offer | Where it lives now | Sales / sign-up mechanics |
| --- | --- | --- |
| 1:1 sessions (coaching, bodywork, intimacy) — €75 / 60 min | `/nl/samenwerken/`, `/en/work-with-me/`, `/fr/accompagnement/` | Calendly `calendly.com/swaanelauwaert/let-s-meet` + contact form |
| **The Eros Sanctuary** — 6-week live online programme (next edition 2027) | sales pages per language; course material on password-protected pages `/nl/the-eros-sanctuary-modules/` and `/en/module-1/` | Flodesk wait-list (`erosnl`, `theerossanctuaryeng`) |
| **Flavours of Desire** — mini online course at your own pace | sales pages per language; modules on password-protected pages `/nl/flavours-of-desire-3/modules/`, `/en/flavours-of-desire-modules-english/`, `/fr/flavours-of-desire-2/modules/` | Flodesk checkout (`flavoursofdesireprogramma`, `flavoursofdesireminicourse`), password handed out after purchase |
| PLAY weekend retreat — 27–29 Nov 2026, Antwerp | `/nl/weekendretreat-27-28-29-november-2026-play/` | Flodesk programme page (`jgy17ky7ao`) |
| Maria Magdalena "Wild & Rooted" retreat — 5–10 April 2027, Rougiers (Var) | `/nl/maria-magdalena-retreat-zuid-frankrijk-2026/`, EN/FR retreat pages | Flodesk programme + booking (`mariamagdalena2027`) |
| Cookbook *The Taste of Her Journey* | `/en/cookbook/`, `/nl/kookboek/`, `/fr/livre-de-cuisine/` | Books2Read `books2read.com/u/4DwK0r` |
| Sainte-Baume guide | `/en/sainte-baume-guide/`, `/nl/sainte-baume-gids/` | external site saintebaumeguide.com |

The two online courses are the portal's first content. Their module pages are password-protected in
WordPress, so the public API returns them empty: the text, videos and downloads have to be exported
from the WordPress admin (or the passwords shared) before they can be moved into the portal.

## Goal

Let Swaane sell and deliver online courses from her own domain: a member logs in,
sees the courses they own, watches lessons (video + text + downloads), tracks progress,
and can buy new courses or a membership. Swaane manages courses and members without code.

## Recommended stack (fits the static site and both hosting targets)

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Same Astro project, `output: "static"` for the public site + on-demand rendered routes under `/portal/` (`export const prerender = false`) | One codebase, one deploy, shared design system. Astro supports hybrid rendering on both Vercel (`@astrojs/vercel`) and Cloudflare (`@astrojs/cloudflare`). |
| Auth + database | Supabase (Postgres + Auth, magic-link / email+password, row-level security) | Hosted in the EU (Frankfurt), generous free tier, the account is already connected to this workspace. Alternatives: Clerk, Auth.js. |
| Payments | Stripe Checkout + Customer Portal, webhooks grant access | Works for one-off courses and recurring memberships, handles EU VAT via Stripe Tax. |
| Video | Vimeo (private, domain-restricted embeds) or Mux | Keeps large files off the site host; both block hot-linking. Vimeo Pro is the cheapest for a few courses. |
| Email | Flodesk (used today for the newsletter and sign-ups) for marketing + Resend/Supabase for transactional mail | Add buyers to the right Flodesk segment from the Stripe webhook (Flodesk API). |
| Downloads (PDF workbooks, audio) | Supabase Storage with signed URLs | Only logged-in members with access can download. |

## Data model (Supabase)

- `profiles` — one per auth user: display name, locale (nl/en), marketing consent.
- `courses` — slug, title (nl/en), description, cover image, price id(s), status (draft/published), sort order.
- `modules` — belongs to course, title, order.
- `lessons` — belongs to module, title, type (video/text/audio/download), video id, body (markdown), attachments, order, free preview flag.
- `enrollments` — user × course, source (stripe/manual/gift), granted_at, expires_at (null = lifetime).
- `progress` — user × lesson, completed_at, last position (seconds).
- `orders` — Stripe session/subscription ids, amount, status, for support and refunds.

Row-level security: members read only their own enrollments/progress and the lessons of
courses they are enrolled in (or marked free preview). Swaane's account has an `admin` claim.

## Pages (all under `/portal/`, available in nl and en)

- `/portal/` — dashboard: my courses, continue where I left off, announcements.
- `/portal/login/`, `/portal/signup/`, `/portal/reset/` — Supabase auth UI with the site's styling.
- `/portal/courses/<slug>/` — course overview with module/lesson list and progress.
- `/portal/courses/<slug>/<lesson>/` — lesson player (video, text, downloads, mark complete, next/prev).
- `/portal/account/` — profile, language, billing (Stripe Customer Portal link), delete account.
- `/portal/admin/` — minimal admin: create/edit courses, modules, lessons; grant/revoke access; see members. (Or use Supabase Studio + a Notion/Markdown content pipeline if an admin UI is overkill.)
- Public sales pages for each course live in the normal site (`/en/courses/<slug>/`) with a "Buy" button that creates a Stripe Checkout session.

## Flows

1. **Purchase**: sales page → Stripe Checkout (prefilled email) → webhook `checkout.session.completed` → upsert user by email → insert `enrollments` → send magic-link welcome email → tag in Kit.
2. **Login**: magic link or password → session cookie (httpOnly) → middleware protects `/portal/*`.
3. **Watch**: lesson page fetches a signed Vimeo/Mux embed, saves progress every 15 s and on "mark complete".
4. **Cancel/refund**: Stripe Customer Portal; webhook `customer.subscription.deleted` sets `expires_at`.
5. **Existing buyers**: import the current Flavours of Desire / Eros Sanctuary participants (from Flodesk) as enrollments so nobody loses access when the password pages are retired.

## Hosting notes

- Vercel: add `@astrojs/vercel` adapter, set env vars (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`). Static pages stay static; only `/portal/*` and `/api/*` run as functions.
- Cloudflare: add `@astrojs/cloudflare` adapter instead; same env vars as Worker secrets. Use `nodejs_compat` flag for the Stripe SDK.
- The public site must remain fully static so it stays fast and free to host.

## Phasing

1. Public site live on the new host (this phase).
2. Auth + one course delivered manually (enrollments inserted by hand), no payments.
3. Stripe Checkout + webhooks.
4. Admin UI, progress tracking polish, certificates/completion emails.

## Open questions for Swaane

- Export of the five password-protected module pages (or their passwords) — what do the modules contain
  (video platform, PDFs, audio)?
- Prices and licence model per course (one-off purchase vs subscription; Flavours of Desire is sold via
  Flodesk today, price not shown on the site).
- Keep Flodesk as the newsletter/checkout tool, or move checkout to Stripe inside the portal and keep
  Flodesk only for e-mail?
- Does she want community features (comments, Q&A) or just content delivery?
- Languages of the portal UI: NL and EN (FR sales pages exist, module pages exist in FR too).
