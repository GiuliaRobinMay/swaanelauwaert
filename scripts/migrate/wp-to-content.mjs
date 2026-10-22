// Converts the WordPress REST dumps in mirror/api into Astro content
// collections (src/content/posts, src/content/pages) and copies the referenced
// media into public/media. Idempotent: re-run after re-mirroring.
import fs from "node:fs";
import path from "node:path";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");
const API = path.join(ROOT, "mirror", "api");
const MEDIA_SRC = path.join(ROOT, "mirror", "media");
const RAW_SRC = path.join(ROOT, "mirror", "raw");
const OUT_POSTS = path.join(ROOT, "src", "content", "posts");
const OUT_PAGES = path.join(ROOT, "src", "content", "pages");
const OUT_MEDIA = path.join(ROOT, "public", "media");
const SITE = (fs.existsSync(path.join(ROOT, "mirror/meta/site.txt")) ? fs.readFileSync(path.join(ROOT, "mirror/meta/site.txt"), "utf8").trim() : "https://swaanelauwaert.com").replace(/\/$/, "");
const HOST = SITE.replace(/^https?:\/\//, "");
const LOCALES = ["en", "nl", "fr"];

const readJsonGlob = (prefix) =>
  fs.existsSync(API)
    ? fs.readdirSync(API).filter((f) => f.startsWith(prefix) && f.endsWith(".json")).flatMap((f) => { try { const j = JSON.parse(fs.readFileSync(path.join(API, f), "utf8")); return Array.isArray(j) ? j : []; } catch { return []; } })
    : [];
const dedupe = (arr) => { const m = new Map(); for (const x of arr) if (x && x.id != null && !m.has(x.id)) m.set(x.id, x); return [...m.values()]; };

const posts = dedupe(readJsonGlob("posts"));
const pages = dedupe(readJsonGlob("pages"));
const media = dedupe(readJsonGlob("media"));
const categories = dedupe(readJsonGlob("categories"));
const tags = dedupe(readJsonGlob("tags"));
const catById = new Map(categories.map((c) => [c.id, c]));
const tagById = new Map(tags.map((t) => [t.id, t]));
const mediaById = new Map(media.map((m) => [m.id, m]));

const decode = (s = "") => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#8217;|&rsquo;/g, "\u2019").replace(/&#8216;|&lsquo;/g, "\u2018").replace(/&#8220;|&ldquo;/g, "\u201c").replace(/&#8221;|&rdquo;/g, "\u201d").replace(/&#8211;|&ndash;/g, "\u2013").replace(/&#8212;|&mdash;/g, "\u2014").replace(/&hellip;/g, "\u2026").replace(/&nbsp;/g, " ");
const stripTags = (s = "") => decode(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
const langOf = (item) => {
  if (item.lang && LOCALES.includes(item.lang)) return item.lang;
  const m = (item.link || "").match(new RegExp(`^https?://[^/]+/(${LOCALES.join("|")})(/|$)`));
  if (m) return m[1];
  return "nl"; // site default when unprefixed
};

// ---- media handling -------------------------------------------------------
const copied = new Map(); // remote url -> local public path
const unresolved = new Set();
function localMediaPath(url) {
  if (!url) return null;
  if (copied.has(url)) return copied.get(url);
  let u = url.replace(/^https?:\/\/i[0-3]\.wp\.com\//, "https://").replace(/\?.*$/, "");
  const m = u.match(/^https?:\/\/(?:www\.)?([^/]+)\/(.+)$/);
  if (!m) return url;
  const [, host, rel] = m;
  if (host !== HOST.replace(/^www\./, "")) return url; // external asset, keep
  const candidates = [path.join(MEDIA_SRC, rel), path.join(RAW_SRC, host, rel), path.join(RAW_SRC, "www." + host, rel)];
  // sized variant -> original
  const orig = rel.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, "$1");
  if (orig !== rel) candidates.push(path.join(MEDIA_SRC, orig), path.join(RAW_SRC, host, orig));
  const found = candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
  if (!found) { unresolved.add(url); return url; }
  const targetRel = found.startsWith(MEDIA_SRC) ? path.relative(MEDIA_SRC, found) : found.includes(path.sep + host + path.sep) ? found.split(path.sep + host + path.sep)[1] : rel;
  const dest = path.join(OUT_MEDIA, targetRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!fs.existsSync(dest)) fs.copyFileSync(found, dest);
  const pub = "/media/" + targetRel.split(path.sep).join("/");
  copied.set(url, pub);
  return pub;
}
function rewriteMediaUrls(html) {
  return html.replace(/(src|href|data-src|data-large_image|data-orig-file|data-medium-file|data-large-file|poster)=("|')([^"']+)\2/g, (all, attr, q, val) => {
    const isMedia = /\/wp-content\/uploads\//.test(val) || /i[0-3]\.wp\.com/.test(val);
    return isMedia ? `${attr}=${q}${localMediaPath(val)}${q}` : all;
  }).replace(/srcset=("|')([^"']+)\1/g, (all, q, val) => {
    const parts = val.split(",").map((p) => p.trim()).filter(Boolean).map((p) => { const [u, d] = p.split(/\s+/); return `${localMediaPath(u)}${d ? " " + d : ""}`; });
    return `srcset=${q}${parts.join(", ")}${q}`;
  });
}
function rewriteInternalLinks(html) {
  // old absolute links to this site -> relative, keep lang prefix
  return html.replace(new RegExp(`https?://(www\\.)?${HOST.replace(/^www\\./, "").replace(/\./g, "\\.")}/`, "g"), "/");
}

// ---- html -> markdown -------------------------------------------------------
const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-", emDelimiter: "*" });
td.use(gfm);
td.keep(["figure", "figcaption", "iframe", "video", "audio", "source", "picture", "table", "div", "span", "blockquote"]);
td.remove(["script", "style", "noscript"]);
// Keep WordPress block wrappers that carry layout (galleries, columns, embeds) as raw HTML
td.addRule("wp-blocks", {
  filter: (node) => node.nodeName === "DIV" && /wp-block-|gallery|wp-caption|embed/.test(node.getAttribute("class") || ""),
  replacement: (content, node) => `\n\n${node.outerHTML}\n\n`,
});
function toMarkdown(html) {
  const cleaned = html.replace(/<!--[\s\S]*?-->/g, "").replace(/\r/g, "");
  const md = td.turndown(cleaned);
  return md.replace(/\n{3,}/g, "\n\n").trim();
}

const yamlStr = (s) => JSON.stringify(s ?? "");
const frontmatter = (obj) => "---\n" + Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && !(Array.isArray(v) && !v.length)).map(([k, v]) => Array.isArray(v) ? `${k}:\n${v.map((x) => `  - ${yamlStr(x)}`).join("\n")}` : typeof v === "object" ? `${k}: ${JSON.stringify(v)}` : `${k}: ${typeof v === "string" ? yamlStr(v) : v}`).join("\n") + "\n---\n";

function featured(item) {
  const emb = item._embedded?.["wp:featuredmedia"]?.[0];
  const m = emb && emb.source_url ? emb : mediaById.get(item.featured_media);
  if (!m || !m.source_url) return {};
  return { image: localMediaPath(m.source_url), imageAlt: stripTags(m.alt_text || m.title?.rendered || ""), imageWidth: m.media_details?.width, imageHeight: m.media_details?.height };
}
const translationsOf = (item) => item.translations && typeof item.translations === "object" ? item.translations : undefined;

fs.rmSync(OUT_POSTS, { recursive: true, force: true });
fs.rmSync(OUT_PAGES, { recursive: true, force: true });
const stats = { posts: {}, pages: {} };

for (const p of posts) {
  if (p.status && p.status !== "publish") continue;
  const lang = langOf(p);
  const date = (p.date_gmt || p.date).slice(0, 10);
  const fm = {
    title: stripTags(p.title?.rendered),
    slug: p.slug,
    lang,
    date: p.date_gmt ? p.date_gmt + "Z" : p.date,
    modified: p.modified_gmt ? p.modified_gmt + "Z" : undefined,
    excerpt: stripTags(p.excerpt?.rendered).replace(/\s*(Lees verder|Read more|Continue reading).*$/i, "").trim() || undefined,
    categories: (p.categories || []).map((id) => catById.get(id)?.name).filter(Boolean).map(decode),
    tags: (p.tags || []).map((id) => tagById.get(id)?.name).filter(Boolean).map(decode),
    ...featured(p),
    wpId: p.id,
    originalUrl: p.link,
    translations: translationsOf(p),
    sticky: p.sticky || undefined,
    format: p.format && p.format !== "standard" ? p.format : undefined,
  };
  const body = toMarkdown(rewriteInternalLinks(rewriteMediaUrls(p.content?.rendered || "")));
  const dir = path.join(OUT_POSTS, lang);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${date}-${p.slug}.md`), frontmatter(fm) + "\n" + body + "\n");
  stats.posts[lang] = (stats.posts[lang] || 0) + 1;
}

for (const p of pages) {
  if (p.status && p.status !== "publish") continue;
  const lang = langOf(p);
  const fm = {
    title: stripTags(p.title?.rendered),
    slug: p.slug,
    lang,
    date: p.date_gmt ? p.date_gmt + "Z" : p.date,
    modified: p.modified_gmt ? p.modified_gmt + "Z" : undefined,
    excerpt: stripTags(p.excerpt?.rendered) || undefined,
    parent: p.parent || undefined,
    menuOrder: p.menu_order || undefined,
    template: p.template || undefined,
    ...featured(p),
    wpId: p.id,
    originalUrl: p.link,
    translations: translationsOf(p),
  };
  const rawHtml = rewriteInternalLinks(rewriteMediaUrls(p.content?.rendered || ""));
  const dir = path.join(OUT_PAGES, lang);
  fs.mkdirSync(dir, { recursive: true });
  // Pages keep their HTML verbatim (page builders rely on markup); posts get Markdown.
  fs.writeFileSync(path.join(dir, `${p.slug}.md`), frontmatter(fm) + "\n" + rawHtml.trim() + "\n");
  stats.pages[lang] = (stats.pages[lang] || 0) + 1;
}

const report = { stats, mediaCopied: copied.size, unresolvedMedia: [...unresolved].slice(0, 200), unresolvedCount: unresolved.size };
fs.mkdirSync(path.join(ROOT, "docs"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "docs", "migration-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ stats, mediaCopied: copied.size, unresolvedCount: unresolved.size }, null, 2));
