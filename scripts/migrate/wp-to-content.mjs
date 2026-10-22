// Converts the WordPress REST dumps (mirror/api) plus the raw HTML mirror into
// Astro content collections and copies the referenced media into public/media.
//
//   src/content/pages/<lang>/<slug>.md   frontmatter + the page's block HTML body
//   src/content/posts/nl/<date>-<slug>.md frontmatter + the post's HTML body
//   public/media/<yyyy>/<mm>/<file>       images (downscaled to max 2000px)
//
// Bodies stay HTML on purpose: the rebuilt site renders them with the theme's
// own block CSS, which keeps the original layout exactly. Re-run any time.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");
const API = path.join(ROOT, "mirror/api");
const RAW = path.join(ROOT, "mirror/raw/swaanelauwaert.com");
const MEDIA_SRC = path.join(ROOT, "mirror/media");
const OUT_POSTS = path.join(ROOT, "src/content/posts");
const OUT_PAGES = path.join(ROOT, "src/content/pages");
const OUT_MEDIA = path.join(ROOT, "public/media");
const SITE = "https://swaanelauwaert.com";
const LOCALES = ["en", "nl", "fr"];
const UPLOAD_PREFIX = "wp-content/uploads/sites/50/";
const MAX_PX = 1600;

const readJsonGlob = (prefix) => fs.readdirSync(API).filter((f) => f.startsWith(prefix) && f.endsWith(".json")).flatMap((f) => { try { const j = JSON.parse(fs.readFileSync(path.join(API, f), "utf8")); return Array.isArray(j) ? j : []; } catch { return []; } });
const dedupe = (arr) => { const m = new Map(); for (const x of arr) if (x && x.id != null && !m.has(x.id)) m.set(x.id, x); return [...m.values()]; };
const posts = dedupe(readJsonGlob("posts"));
const pages = dedupe(readJsonGlob("pages"));
const media = dedupe(readJsonGlob("media"));
const categories = dedupe(readJsonGlob("categories"));
const tags = dedupe(readJsonGlob("tags"));
const users = dedupe(readJsonGlob("users"));
const catById = new Map(categories.map((c) => [c.id, c]));
const tagById = new Map(tags.map((t) => [t.id, t]));
const userById = new Map(users.map((u) => [u.id, u]));
const mediaById = new Map(media.map((m) => [m.id, m]));

const decode = (s = "") => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&rsquo;/g, "’").replace(/&lsquo;/g, "‘").replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”").replace(/&ndash;/g, "–").replace(/&mdash;/g, "—").replace(/&hellip;/g, "…").replace(/&nbsp;/g, " ");
const stripTags = (s = "") => decode(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
const langOf = (item) => { const m = (item.link || "").match(new RegExp(`^https?://[^/]+/(${LOCALES.join("|")})(/|$)`)); return m ? m[1] : "nl"; };
const pathOf = (link) => link.replace(/^https?:\/\/[^/]+/, "");

// ---------------------------------------------------------------- media ----
const copied = new Map();
const unresolved = new Set();
const pending = [];
function findLocal(rel) {
  // Prefer the original file; fall back to the largest resized variant on disk.
  const orig = rel.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, "$1");
  const o = [path.join(MEDIA_SRC, orig), path.join(RAW, orig)].find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
  if (o) return { file: o, rel: orig };
  const direct = [path.join(MEDIA_SRC, rel), path.join(RAW, rel)].find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
  if (direct && rel === orig) return { file: direct, rel };
  // any sized variant of the original
  const ext = path.extname(orig), base = path.basename(orig, ext), dirRel = path.dirname(orig);
  for (const root of [MEDIA_SRC, RAW]) {
    const dir = path.join(root, dirRel);
    if (!fs.existsSync(dir)) continue;
    const variants = fs.readdirSync(dir).filter((f) => f.startsWith(base + "-") && /-\d+x\d+/.test(f) && f.endsWith(ext)).map((f) => ({ f, w: parseInt(f.match(/-(\d+)x\d+/)[1], 10) })).sort((a, b) => b.w - a.w);
    if (variants.length) return { file: path.join(dir, variants[0].f), rel: path.posix.join(dirRel, variants[0].f) };
  }
  return null;
}
function localMediaPath(url) {
  if (!url) return url;
  const clean = url.replace(/^https?:\/\/i[0-3]\.wp\.com\//, "https://").replace(/\?.*$/, "").replace(/&amp;/g, "&");
  if (copied.has(clean)) return copied.get(clean);
  const m = clean.match(/^https?:\/\/(?:www\.)?swaanelauwaert\.com\/(.+)$/);
  if (!m) return url; // external, keep
  const rel = decodeURIComponent(m[1]);
  if (!rel.startsWith("wp-content/uploads/")) return url;
  const found = findLocal(rel);
  if (!found) { unresolved.add(clean); return url; }
  const target = found.rel.replace(UPLOAD_PREFIX, "").replace(/^wp-content\/uploads\//, "");
  const dest = path.join(OUT_MEDIA, target);
  const pub = "/media/" + target.split(path.sep).join("/");
  copied.set(clean, pub);
  if (!fs.existsSync(dest)) pending.push({ src: found.file, dest });
  return pub;
}
async function flushMedia() {
  let n = 0, shrunk = 0;
  for (const { src, dest } of pending) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const size = fs.statSync(src).size;
    if (/\.(jpe?g|png)$/i.test(src) && size > 300 * 1024) {
      try {
        const img = sharp(src, { failOn: "none" }).rotate();
        const meta = await img.metadata();
        if (Math.max(meta.width || 0, meta.height || 0) > MAX_PX || size > 1.5 * 1024 * 1024) {
          const r = img.resize({ width: MAX_PX, height: MAX_PX, fit: "inside", withoutEnlargement: true });
          const buf = /\.png$/i.test(src) ? await r.png({ compressionLevel: 9 }).toBuffer() : await r.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
          if (buf.length < size) { fs.writeFileSync(dest, buf); shrunk++; n++; continue; }
        }
      } catch (e) { console.warn("sharp failed, copying as-is:", src, String(e).slice(0, 60)); }
    }
    fs.copyFileSync(src, dest); n++;
  }
  return { n, shrunk };
}
const MEDIA_ATTR = /(src|href|data-src|data-large_image|data-orig-file|data-medium-file|data-large-file|data-full-url|data-link|poster)=("|')([^"']+)\2/g;
function rewriteMedia(html) {
  return html
    .replace(MEDIA_ATTR, (all, attr, q, val) => (/wp-content\/uploads\//.test(val) || /i[0-3]\.wp\.com/.test(val) ? `${attr}=${q}${localMediaPath(val)}${q}` : all))
    .replace(/\s(srcset|sizes)=("|')[^"']*\2/g, "")
    // CSS background images in style attributes (parallax covers)
    .replace(/url\((['"]?)(https?:\/\/[^)'"]+)\1\)/g, (all, q, u) => (/wp-content\/uploads\//.test(u) || /i[0-3]\.wp\.com/.test(u) ? `url(${q}${localMediaPath(u)}${q})` : all));
}
const rewriteLinks = (html) => html.replace(/https?:\/\/(www\.)?swaanelauwaert\.com\//g, "/");
// wget --convert-links rewrote same-site URLs in the raw HTML to relative file
// paths (../../wp-content/x.jpg, ../index.html, en.html#contact). Resolve them
// against the page's own location back to absolute site URLs.
function fixRelative(html, rawFile) {
  if (!rawFile || !html || rawFile.startsWith(HTML2)) return html;
  const dir = path.posix.dirname(path.relative(RAW, rawFile).split(path.sep).join("/")); // e.g. "en/about" or "."
  const resolve = (val) => {
    let abs = path.posix.normalize(path.posix.join(dir === "." ? "" : dir, val));
    abs = abs.replace(/\.html%3F[^"']*/i, "").replace(/%3F.*$/i, "");
    // "en.html" / "index.html" are language homes written by wget
    abs = abs.replace(/^(en|nl|fr)\.html(#.*)?$/, "$1/$2").replace(/^index\.html(#.*)?$/, "en/$1");
    abs = abs.replace(/\/index\.html(#.*)?$/, "/$1");
    if (/\.(html?)$/.test(abs)) abs = abs.replace(/\.html?$/, "/");
    return `${SITE}/${abs}`;
  };
  const skip = (val) => /^(#|data:|mailto:|tel:|\/)/.test(val) || /^[a-z]+:/i.test(val) || /^context\./.test(val);
  return html
    .replace(/(href|src|poster|data-[a-z_-]+)=("|')([^"':]+?)\2/g, (all, attr, q, val) => (skip(val) ? all : `${attr}=${q}${resolve(val)}${q}`))
    .replace(/url\((['"]?)([^)'"]+?)\1\)/g, (all, q, val) => (skip(val) ? all : `url(${q}${resolve(val)}${q})`));
}

// ----------------------------------------------------------- raw html ----
const HTML2 = path.join(ROOT, "mirror/html");
const rawFile_isCapture = (f) => !!f && f.startsWith(HTML2);
const redirects = {};
// Manual decisions about odd pages in the WordPress export (see docs/site-audit.md).
const PAGE_OVERRIDES = {
  5530: { skip: true, redirectTo: "/en/work-with-me/" }, // empty page with a Dutch title in the English language set
};
const captureFile = (link) => { const s = link.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 120); const f = path.join(HTML2, `${s}.html`); return fs.existsSync(f) ? f : null; };
function rawFileFor(lang, slug, isHome, link) {
  const c = isHome ? [path.join(RAW, `${lang}.html`), path.join(RAW, lang, "index.html")] : [path.join(RAW, pathOf(link).replace(/^\/|\/$/g, ""), "index.html"), path.join(RAW, lang, slug, "index.html")];
  return c.find((f) => fs.existsSync(f)) || captureFile(link);
}
function rawPostFile(link) {
  const p = pathOf(link).replace(/^\/|\/$/g, "");
  const f = path.join(RAW, p, "index.html");
  return fs.existsSync(f) ? f : captureFile(link);
}
// Returns the inner HTML of the first element whose opening tag matches `re`,
// using a tag-depth counter so nested <div>s are handled.
function innerOf(html, re) {
  const m = re.exec(html);
  if (!m) return null;
  const tagName = m[0].match(/^<([a-z0-9]+)/i)[1].toLowerCase();
  let i = m.index + m[0].length, depth = 1;
  const tok = new RegExp(`<\\/?${tagName}\\b[^>]*>`, "gi");
  tok.lastIndex = i;
  let t;
  while ((t = tok.exec(html))) {
    if (t[0][1] === "/") depth--; else if (!/\/>$/.test(t[0])) depth++;
    if (depth === 0) return html.slice(i, t.index);
  }
  return null;
}
function fromRaw(file) {
  if (!file) return {};
  const html = fs.readFileSync(file, "utf8");
  const entry = innerOf(html, /<div class="entry-content[^"]*"[^>]*>/);
  const showsFeatured = /<figure[^>]*class="wp-block-post-featured-image"[^>]*>\s*<(img|a)/.test(html);
  const showsTitle = /<h1 class="wp-block-post-title">[^<]+<\/h1>/.test(html);
  const css = [];
  for (const id of ["core-block-supports-inline-css", "block-style-variation-styles-inline-css"]) {
    const m = html.match(new RegExp(`<style id="${id}">([\\s\\S]*?)</style>`));
    if (m && m[1].trim()) css.push(m[1].trim());
  }
  const translations = {};
  for (const m of html.matchAll(/<link rel="alternate" href="([^"]+)" hreflang="([a-z-]+)"/g)) {
    const [, href, hl] = m;
    if (hl === "x-default") continue;
    let p = href.replace(/^https?:\/\/[^/]+/, "").replace(/\.\.\//g, "").replace(/^\/+/, "");
    p = p.replace(/\/?index\.html$/, "").replace(/\.html$/, "");
    translations[hl] = p ? "/" + p.replace(/\/$/, "") + "/" : `/${hl}/`;
  }
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const ogImage = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1];
  const bodyClass = html.match(/<body class="([^"]+)"/)?.[1] || "";
  const titleTag = html.match(/<title>([^<]*)<\/title>/)?.[1];
  let canonical;
  const can = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (can && !rawFile_isCapture(file)) {
    const dir = path.posix.dirname(path.relative(RAW, file).split(path.sep).join("/"));
    let abs = path.posix.normalize(path.posix.join(dir === "." ? "" : dir, can)).replace(/\/?index\.html$/, "").replace(/^(en|nl|fr)\.html$/, "$1");
    canonical = "/" + (abs ? abs.replace(/\/$/, "") + "/" : "");
    if (canonical === "/") canonical = "/en/";
  }
  return { inlineCss: css.join("\n"), translations, description: desc ? decode(desc) : undefined, ogImage: ogImage ? localMediaPath(ogImage) : undefined, bodyClass, titleTag: titleTag ? decode(titleTag) : undefined, renderedBody: entry, showsFeatured, showsTitle, canonical };
}

// ------------------------------------------------------------- output ----
const yamlStr = (s) => JSON.stringify(s ?? "");
const frontmatter = (obj) => "---\n" + Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && !v.length) && !(typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length)).map(([k, v]) => Array.isArray(v) ? `${k}:\n${v.map((x) => `  - ${yamlStr(x)}`).join("\n")}` : typeof v === "object" ? `${k}:\n${Object.entries(v).map(([a, b]) => `  ${a}: ${yamlStr(b)}`).join("\n")}` : `${k}: ${typeof v === "string" ? yamlStr(v) : v}`).join("\n") + "\n---\n";
function featured(item) {
  const emb = item._embedded?.["wp:featuredmedia"]?.[0];
  const m = emb && emb.source_url ? emb : mediaById.get(item.featured_media);
  const url = m?.source_url || item.jetpack_featured_media_url;
  if (!url) return {};
  return { image: localMediaPath(url), imageAlt: stripTags(m?.alt_text || m?.title?.rendered || ""), imageWidth: m?.media_details?.width, imageHeight: m?.media_details?.height };
}

fs.rmSync(OUT_POSTS, { recursive: true, force: true });
fs.rmSync(OUT_PAGES, { recursive: true, force: true });
const stats = { posts: {}, pages: {}, rawHtmlPages: 0, rawHtmlPosts: 0 };

for (const p of pages) {
  if (p.status && p.status !== "publish") continue;
  const lang = langOf(p);
  const override = PAGE_OVERRIDES[p.id];
  if (override?.skip) { if (override.redirectTo) redirects[pathOf(p.link)] = override.redirectTo; continue; }
  const isHome = pathOf(p.link) === `/${lang}/`;
  const raw = rawFileFor(lang, p.slug, isHome, p.link);
  if (raw) stats.rawHtmlPages++;
  const extra = fromRaw(raw);
  const restPath = pathOf(p.link);
  const pagePath = extra.canonical && extra.canonical !== restPath && !isHome ? extra.canonical : restPath;
  if (pagePath !== restPath) redirects[restPath] = pagePath;
  const fm = {
    title: stripTags(p.title?.rendered),
    wpSlug: isHome ? "index" : p.slug,
    path: pagePath,
    lang,
    isHome: isHome || undefined,
    date: p.date_gmt ? p.date_gmt + "Z" : p.date,
    modified: p.modified_gmt ? p.modified_gmt + "Z" : undefined,
    excerpt: stripTags(p.excerpt?.rendered) || undefined,
    description: extra.description,
    parent: p.parent || undefined,
    menuOrder: p.menu_order || undefined,
    template: p.template || undefined,
    bodyClass: extra.bodyClass || undefined,
    ...featured(p),
    ogImage: extra.ogImage,
    translations: extra.translations,
    wpId: p.id,
    originalUrl: p.link,
    hasRawHtml: !!raw,
    bodySource: extra.renderedBody ? "rendered" : "rest",
    protected: p.content?.protected ? true : undefined,
    showTitle: raw ? extra.showsTitle : !isHome && p.template !== "page-no-title",
    showFeatured: raw ? extra.showsFeatured : !isHome && !!p.featured_media,
    inlineCss: extra.inlineCss || undefined,
  };
  const body = rewriteLinks(rewriteMedia(fixRelative(extra.renderedBody ?? p.content?.rendered ?? "", raw))).trim();
  const dir = path.join(OUT_PAGES, lang);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${fm.wpSlug}.md`), frontmatter(fm) + "\n" + body + "\n");
  stats.pages[lang] = (stats.pages[lang] || 0) + 1;
}

for (const p of posts) {
  if (p.status && p.status !== "publish") continue;
  const lang = langOf(p);
  const raw = rawPostFile(p.link);
  if (raw) stats.rawHtmlPosts++;
  const extra = fromRaw(raw);
  const date = (p.date_gmt || p.date).slice(0, 10);
  const fm = {
    title: stripTags(p.title?.rendered),
    wpSlug: p.slug,
    path: pathOf(p.link),
    lang,
    date: p.date_gmt ? p.date_gmt + "Z" : p.date,
    modified: p.modified_gmt ? p.modified_gmt + "Z" : undefined,
    author: userById.get(p.author)?.name || undefined,
    excerpt: stripTags(p.excerpt?.rendered).replace(/\s*(Lees verder|Read more|Continue reading).*$/i, "").trim() || undefined,
    categories: (p.categories || []).map((id) => catById.get(id)?.name).filter(Boolean).map(decode),
    categorySlugs: (p.categories || []).map((id) => catById.get(id)?.slug).filter(Boolean),
    tags: (p.tags || []).map((id) => tagById.get(id)?.name).filter(Boolean).map(decode),
    tagSlugs: (p.tags || []).map((id) => tagById.get(id)?.slug).filter(Boolean),
    ...featured(p),
    wpId: p.id,
    originalUrl: p.link,
    sticky: p.sticky || undefined,
    format: p.format && p.format !== "standard" ? p.format : undefined,
    commentStatus: p.comment_status,
    hasRawHtml: !!raw,
    bodySource: extra.renderedBody ? "rendered" : "rest",
    inlineCss: extra.inlineCss || undefined,
  };
  const body = rewriteLinks(rewriteMedia(fixRelative(extra.renderedBody ?? p.content?.rendered ?? "", raw))).trim();
  const dir = path.join(OUT_POSTS, lang);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${date}-${p.slug}.md`), frontmatter(fm) + "\n" + body + "\n");
  stats.posts[lang] = (stats.posts[lang] || 0) + 1;
}

// comments (read-only) when the REST dump exists
const comments = dedupe(readJsonGlob("comments")).filter((c) => c.status === "approved" || c.status === undefined).map((c) => ({ id: c.id, post: c.post, parent: c.parent, author_name: decode(c.author_name || ""), date: c.date_gmt ? c.date_gmt + "Z" : c.date, content: rewriteLinks(rewriteMedia(c.content?.rendered || "")).trim(), avatar: c.author_avatar_urls?.["48"] }));
fs.mkdirSync(path.join(ROOT, "src/data"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "src/data/comments.json"), JSON.stringify(comments, null, 1));
// redirects: old WordPress paths that served a canonical page under another slug, plus Polylang's root redirect
redirects["/"] = "/en/";
redirects["/nl/feed/"] = "/nl/feed.xml";
fs.writeFileSync(path.join(ROOT, "src/data/redirects.json"), JSON.stringify(redirects, null, 2));
// taxonomies as data for archive pages
fs.mkdirSync(path.join(ROOT, "src/data"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "src/data/taxonomies.json"), JSON.stringify({
  categories: categories.map((c) => ({ id: c.id, slug: c.slug, name: decode(c.name), description: stripTags(c.description), count: c.count, parent: c.parent })),
  tags: tags.map((t) => ({ id: t.id, slug: t.slug, name: decode(t.name), count: t.count })),
  users: users.map((u) => ({ id: u.id, slug: u.slug, name: u.name, description: u.description, link: pathOf(u.link || "") })),
}, null, 2));

const mediaResult = await flushMedia();
const report = { stats, mediaCopied: copied.size, mediaWritten: mediaResult, unresolvedCount: unresolved.size, unresolved: [...unresolved].sort() };
fs.mkdirSync(path.join(ROOT, "docs"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "docs/migration-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ stats, mediaCopied: copied.size, mediaWritten: mediaResult, unresolvedCount: unresolved.size }, null, 2));
