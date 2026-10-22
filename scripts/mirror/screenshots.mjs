// Paced visual + structural capture of the mirrored site. Visits a curated
// list of URLs (home pages, every static page, archive samples, a spread of
// blog posts), waits DELAY_MS between page loads, retries on HTTP 429 and on
// pages whose images failed to load, and writes:
//   mirror/pages.json        full extraction (text, html, links, images, styles)
//   mirror/pages-index.json  the same without the bulky fields
//   mirror/screenshots/*.png desktop (1440) and mobile (390) full-page shots
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const SITE = (process.env.SITE || "https://swaanelauwaert.com").replace(/\/$/, "");
const MAX_SHOTS = parseInt(process.env.MAX_SCREENSHOTS || "80", 10);
const MAX_POSTS = parseInt(process.env.MAX_POSTS || "16", 10);
const DELAY_MS = parseInt(process.env.DELAY_MS || "5000", 10);
const BACKOFF_MS = parseInt(process.env.BACKOFF_MS || "40000", 10);
const ROOT = path.resolve(process.cwd(), "..", "..");
const OUT = path.join(ROOT, "mirror");
const SHOTS = path.join(OUT, "screenshots");
fs.rmSync(SHOTS, { recursive: true, force: true });
fs.mkdirSync(SHOTS, { recursive: true });

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
let all = read(path.join(OUT, "meta", "urls.txt")).split("\n").map((s) => s.trim()).filter(Boolean);
const isPost = (u) => /\/\d{4}\/\d{2}\/\d{2}\//.test(u);
const isArchive = (u) => /\/(tag|category|author|page)\/|\/\d{4}\/(\d{2}\/)?$/.test(u);
const homes = [SITE + "/", SITE + "/en/", SITE + "/nl/", SITE + "/fr/"];
const pages = all.filter((u) => !isPost(u) && !isArchive(u) && !homes.includes(u)).sort();
const posts = all.filter(isPost).sort((a, b) => b.localeCompare(a));
const step = Math.max(1, Math.floor(posts.length / Math.max(1, MAX_POSTS - 4)));
const samplePosts = [...new Set([...posts.slice(0, 4), ...posts.filter((_, i) => i % step === 0)])].slice(0, MAX_POSTS);
const archives = [SITE + "/nl/2025/06/", SITE + "/nl/tag/bouwen-in-stro-en-leem/", ...all.filter(isArchive).slice(0, 2)];
const urls = [...new Set([...homes, ...pages, ...archives, ...samplePosts])];
console.log(`capturing ${urls.length} urls (${pages.length} pages, ${samplePosts.length} posts, delay ${DELAY_MS}ms)`);

const slug = (u) => u.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 120) || "home";
const lazyScroll = (page) => page.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
const brokenImages = (page) => page.evaluate(() => Array.from(document.images).filter((i) => i.complete && i.naturalWidth === 0 && i.src && !i.src.startsWith("data:")).length);

async function loadWithRetry(page, url) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    let resp = null;
    try { resp = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }); } catch { resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => null); }
    const status = resp ? resp.status() : 0;
    const title = await page.title().catch(() => "");
    await lazyScroll(page).catch(() => {});
    await page.waitForTimeout(800);
    const broken = await brokenImages(page).catch(() => 0);
    const limited = status === 429 || /HTTP 429|Slow down/i.test(title);
    if (!limited && (broken <= 1 || attempt >= 3)) return { status, broken, title };
    const wait = BACKOFF_MS * attempt;
    console.log(`  retry ${attempt}: status=${status} broken=${broken} "${title.slice(0, 40)}" waiting ${wait}ms`);
    await page.waitForTimeout(wait);
  }
  return { status: 429, broken: -1, title: "rate-limited" };
}

const extract = () => {
  const q = (s, r = document) => Array.from(r.querySelectorAll(s));
  const txt = (el) => (el ? el.innerText.replace(/\s+\n/g, "\n").trim() : "");
  const cs = (el) => (el ? getComputedStyle(el) : null);
  const meta = {};
  q("meta").forEach((m) => { const k = m.getAttribute("name") || m.getAttribute("property"); if (k) meta[k] = m.getAttribute("content"); });
  const rootVars = {};
  for (const sheet of Array.from(document.styleSheets)) { let rules = []; try { rules = Array.from(sheet.cssRules || []); } catch { continue; } for (const r of rules) if (r.selectorText === ":root" || r.selectorText === "html" || r.selectorText === "body") for (const p of Array.from(r.style)) if (p.startsWith("--")) rootVars[p] = r.style.getPropertyValue(p).trim(); }
  const styleOf = (sel) => { const el = document.querySelector(sel); const s = cs(el); return s ? { fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, textTransform: s.textTransform, color: s.color, background: s.backgroundColor, borderRadius: s.borderRadius, padding: s.padding, maxWidth: s.maxWidth, fontStyle: s.fontStyle } : null; };
  const header = document.querySelector("header, .site-header, [role=banner], .wp-block-template-part header");
  const footer = document.querySelector("footer, .site-footer, [role=contentinfo]");
  const main = document.querySelector("main, #main, #content, .site-content, article") || document.body;
  return {
    title: document.title, lang: document.documentElement.lang, bodyClass: document.body.className, generator: meta.generator || null, meta,
    canonical: document.querySelector("link[rel=canonical]")?.href || null,
    alternates: q("link[rel=alternate]").map((l) => ({ hreflang: l.hreflang, href: l.href, type: l.type })).filter((a) => a.hreflang || a.type),
    icons: q("link[rel~=icon], link[rel=apple-touch-icon]").map((l) => ({ rel: l.rel, href: l.href, sizes: l.sizes?.value })),
    stylesheets: q("link[rel=stylesheet]").map((l) => l.href), scripts: q("script[src]").map((s) => s.src),
    fontFaces: Array.from(document.fonts).map((f) => `${f.family} ${f.weight} ${f.style}`).filter((v, i, a) => a.indexOf(v) === i),
    rootVars,
    styles: { body: styleOf("body"), h1: styleOf("h1"), h2: styleOf("h2"), h3: styleOf("h3"), h4: styleOf("h4"), p: styleOf("main p, .entry-content p, p"), a: styleOf("main a, .entry-content a, a"), button: styleOf(".wp-block-button__link, .wp-element-button, button, .button"), navLink: styleOf("nav a, header a"), logo: styleOf(".wp-block-site-title a, .site-title a, header h1 a"), header: styleOf("header, .wp-block-template-part header"), footer: styleOf("footer"), main: styleOf("main"), group: styleOf("main .wp-block-group"), quote: styleOf("blockquote"), input: styleOf("input[type=text], input[type=email]"), postTitle: styleOf(".wp-block-post-title, .entry-title"), postMeta: styleOf(".wp-block-post-date, .entry-meta") },
    headerText: txt(header), headerHtml: header ? header.outerHTML.slice(0, 60000) : "",
    headerLinks: header ? q("a", header).map((a) => ({ text: a.innerText.trim(), href: a.href })).filter((a) => a.text) : [],
    navLinks: q("nav a, .menu a, .wp-block-navigation a").map((a) => ({ text: a.innerText.trim(), href: a.href })).filter((a) => a.text),
    footerText: txt(footer), footerHtml: footer ? footer.outerHTML.slice(0, 60000) : "",
    footerLinks: footer ? q("a", footer).map((a) => ({ text: a.innerText.trim(), href: a.href })).filter((a) => a.text || a.href) : [],
    headings: q("h1,h2,h3,h4").map((h) => ({ tag: h.tagName, text: h.innerText.trim() })).filter((h) => h.text),
    mainText: txt(main).slice(0, 60000), mainHtml: main.innerHTML.slice(0, 400000),
    images: q("img").map((im) => ({ src: im.currentSrc || im.src, srcset: im.srcset || null, alt: im.alt, w: im.naturalWidth, h: im.naturalHeight, cls: im.className, loaded: im.complete && im.naturalWidth > 0 })),
    bgImages: q("*").map((el) => getComputedStyle(el).backgroundImage).filter((b) => b && b !== "none" && b.includes("url(")).filter((v, i, a) => a.indexOf(v) === i).slice(0, 50),
    buttons: q("a.wp-block-button__link, .wp-element-button, a.button, a.btn, button, [class*=button]").map((b) => ({ text: b.innerText.trim(), href: b.href || null, cls: b.className })).filter((b) => b.text).slice(0, 60),
    forms: q("form").map((f) => ({ action: f.action, method: f.method, cls: f.className, fields: q("input,select,textarea", f).map((i) => ({ type: i.type, name: i.name, placeholder: i.placeholder, label: i.labels?.[0]?.innerText?.trim() })) })),
    iframes: q("iframe").map((f) => f.src), videos: q("video, video source").map((v) => v.src || v.currentSrc).filter(Boolean),
    links: q("a[href]").map((a) => a.href).filter((v, i, a) => a.indexOf(v) === i),
  };
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "en-US", deviceScaleFactor: 1 });
const page = await ctx.newPage();
const results = [];
let shots = 0;
for (const [i, url] of urls.entries()) {
  const rec = { url, index: i };
  try {
    const r = await loadWithRetry(page, url);
    Object.assign(rec, r);
    if (r.status !== 429) {
      Object.assign(rec, await page.evaluate(extract));
      // keep the complete rendered HTML too (per-page inline CSS lives there)
      fs.mkdirSync(path.join(OUT, "html"), { recursive: true });
      fs.writeFileSync(path.join(OUT, "html", `${slug(url)}.html`), await page.content());
      if (shots < MAX_SHOTS) {
        await page.screenshot({ path: path.join(SHOTS, `${slug(url)}--desktop.png`), fullPage: true });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.waitForTimeout(700);
        await lazyScroll(page).catch(() => {});
        await page.screenshot({ path: path.join(SHOTS, `${slug(url)}--mobile.png`), fullPage: true });
        await page.setViewportSize({ width: 1440, height: 900 });
        rec.screenshots = [`${slug(url)}--desktop.png`, `${slug(url)}--mobile.png`];
        shots++;
      }
    }
    console.log(`[${i + 1}/${urls.length}] ${r.status} broken=${r.broken} ${url} (${rec.title})`);
  } catch (e) {
    rec.error = String(e);
    console.log(`[${i + 1}/${urls.length}] ERROR ${url}: ${e}`);
  }
  results.push(rec);
  await page.waitForTimeout(DELAY_MS);
}
await browser.close();
fs.writeFileSync(path.join(OUT, "pages.json"), JSON.stringify(results, null, 2));
fs.writeFileSync(path.join(OUT, "pages-index.json"), JSON.stringify(results.map(({ mainHtml, mainText, links, images, headerHtml, footerHtml, ...r }) => ({ ...r, imageCount: images?.length ?? 0, imagesLoaded: images?.filter((x) => x.loaded).length ?? 0 })), null, 2));
console.log(`done: ${results.length} pages, ${shots} screenshotted, ${results.filter((r) => r.status === 429).length} rate-limited`);
