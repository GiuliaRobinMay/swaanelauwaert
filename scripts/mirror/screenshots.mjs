// Visits every candidate URL of the mirrored site, extracts structured page
// data (text, nav, fonts, colors, images, forms, embeds) into
// mirror/pages.json and takes desktop + mobile full-page screenshots for the
// first MAX_SCREENSHOTS pages (non-blog pages first, newest posts next).
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const SITE = (process.env.SITE || "https://swaanelauwaert.com").replace(/\/$/, "");
const MAX_SHOTS = parseInt(process.env.MAX_SCREENSHOTS || "60", 10);
const ROOT = path.resolve(process.cwd(), "..", "..");
const OUT = path.join(ROOT, "mirror");
const SHOTS = path.join(OUT, "screenshots");
fs.mkdirSync(SHOTS, { recursive: true });

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const urlsFile = path.join(OUT, "meta", "urls.txt");
let urls = read(urlsFile).split("\n").map((s) => s.trim()).filter(Boolean);
if (!urls.length) urls = [SITE + "/"];

// Classify: blog post = dated permalink or /tag/ /category/ pages
const isPost = (u) => /\/\d{4}\/\d{2}\/\d{2}\//.test(u);
const isArchive = (u) => /\/(tag|category|author|page)\//.test(u);
const rank = (u) => (isArchive(u) ? 2 : isPost(u) ? 1 : 0);
urls = [...new Set(urls)].sort((a, b) => rank(a) - rank(b) || (isPost(a) && isPost(b) ? b.localeCompare(a) : a.localeCompare(b)));

const slug = (u) =>
  u.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 120) || "home";

const browser = await chromium.launch();
const pages = [];
let shots = 0;
const MAX_EXTRACT = 400;

for (const [i, url] of urls.slice(0, MAX_EXTRACT).entries()) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "en-US", deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const rec = { url, index: i };
  try {
    const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }));
    rec.status = resp ? resp.status() : null;
    // trigger lazy loading
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);
    Object.assign(rec, await page.evaluate(() => {
      const q = (s, r = document) => Array.from(r.querySelectorAll(s));
      const txt = (el) => (el ? el.innerText.replace(/\s+\n/g, "\n").trim() : "");
      const cs = (el) => (el ? getComputedStyle(el) : null);
      const meta = {};
      q("meta").forEach((m) => { const k = m.getAttribute("name") || m.getAttribute("property"); if (k) meta[k] = m.getAttribute("content"); });
      const rootVars = {};
      for (const sheet of Array.from(document.styleSheets)) {
        let rules = []; try { rules = Array.from(sheet.cssRules || []); } catch { continue; }
        for (const r of rules) if (r.selectorText === ":root" || r.selectorText === "html") for (const p of Array.from(r.style)) if (p.startsWith("--")) rootVars[p] = r.style.getPropertyValue(p).trim();
      }
      const fontOf = (sel) => { const el = document.querySelector(sel); const s = cs(el); return s ? { fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, textTransform: s.textTransform, color: s.color } : null; };
      const colorOf = (sel) => { const el = document.querySelector(sel); const s = cs(el); return s ? { color: s.color, background: s.backgroundColor, backgroundImage: s.backgroundImage.slice(0, 200) } : null; };
      const header = document.querySelector("header, .site-header, #masthead, [role=banner]");
      const footer = document.querySelector("footer, .site-footer, #colophon, [role=contentinfo]");
      const main = document.querySelector("main, #main, #content, .site-content, article") || document.body;
      return {
        title: document.title,
        lang: document.documentElement.lang,
        bodyClass: document.body.className,
        generator: meta.generator || null,
        meta,
        canonical: document.querySelector("link[rel=canonical]")?.href || null,
        alternates: q("link[rel=alternate]").map((l) => ({ hreflang: l.hreflang, href: l.href, type: l.type })).filter((a) => a.hreflang || a.type),
        icons: q("link[rel~=icon], link[rel=apple-touch-icon]").map((l) => ({ rel: l.rel, href: l.href, sizes: l.sizes?.value })),
        stylesheets: q("link[rel=stylesheet]").map((l) => l.href),
        scripts: q("script[src]").map((s) => s.src),
        fontFaces: Array.from(document.fonts).map((f) => `${f.family} ${f.weight} ${f.style}`).filter((v, i, a) => a.indexOf(v) === i),
        rootVars,
        fonts: { body: fontOf("body"), h1: fontOf("h1"), h2: fontOf("h2"), h3: fontOf("h3"), p: fontOf("p"), a: fontOf("a"), button: fontOf("button, .button, .btn, a.wp-block-button__link, .elementor-button"), nav: fontOf("nav a, header a") },
        colors: { body: colorOf("body"), header: colorOf("header, .site-header, #masthead"), footer: colorOf("footer, .site-footer, #colophon"), button: colorOf("button, .button, .btn, a.wp-block-button__link, .elementor-button"), link: colorOf("a") },
        headerText: txt(header),
        headerLinks: header ? q("a", header).map((a) => ({ text: a.innerText.trim(), href: a.href })).filter((a) => a.text) : [],
        navLinks: q("nav a, .menu a, .elementor-nav-menu a").map((a) => ({ text: a.innerText.trim(), href: a.href })).filter((a) => a.text),
        footerText: txt(footer),
        footerLinks: footer ? q("a", footer).map((a) => ({ text: a.innerText.trim(), href: a.href })).filter((a) => a.text || a.href) : [],
        headings: q("h1,h2,h3,h4").map((h) => ({ tag: h.tagName, text: h.innerText.trim() })).filter((h) => h.text),
        mainText: txt(main).slice(0, 60000),
        mainHtml: main.innerHTML.slice(0, 400000),
        images: q("img").map((im) => ({ src: im.currentSrc || im.src, srcset: im.srcset || null, alt: im.alt, w: im.naturalWidth, h: im.naturalHeight, cls: im.className })),
        bgImages: q("*").map((el) => getComputedStyle(el).backgroundImage).filter((b) => b && b !== "none" && b.includes("url(")).filter((v, i, a) => a.indexOf(v) === i).slice(0, 50),
        buttons: q("a.button, a.btn, button, .wp-block-button__link, .elementor-button, [class*=button]").map((b) => ({ text: b.innerText.trim(), href: b.href || null, cls: b.className })).filter((b) => b.text).slice(0, 60),
        forms: q("form").map((f) => ({ action: f.action, method: f.method, cls: f.className, fields: q("input,select,textarea", f).map((i) => ({ type: i.type, name: i.name, placeholder: i.placeholder })) })),
        iframes: q("iframe").map((f) => f.src),
        videos: q("video, video source").map((v) => v.src || v.currentSrc).filter(Boolean),
        links: q("a[href]").map((a) => a.href).filter((v, i, a) => a.indexOf(v) === i),
      };
    }));
    if (shots < MAX_SHOTS) {
      await page.screenshot({ path: path.join(SHOTS, `${slug(url)}--desktop.png`), fullPage: true });
      const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      const mp = await mctx.newPage();
      await mp.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
      await mp.waitForTimeout(500);
      await mp.screenshot({ path: path.join(SHOTS, `${slug(url)}--mobile.png`), fullPage: true });
      await mctx.close();
      rec.screenshots = [`${slug(url)}--desktop.png`, `${slug(url)}--mobile.png`];
      shots++;
    }
    console.log(`[${i + 1}/${urls.length}] ${rec.status} ${url} (${rec.title})`);
  } catch (e) {
    rec.error = String(e);
    console.log(`[${i + 1}/${urls.length}] ERROR ${url}: ${e}`);
  } finally {
    pages.push(rec);
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync(path.join(OUT, "pages.json"), JSON.stringify(pages, null, 2));
// lighter index without big html/text fields
fs.writeFileSync(path.join(OUT, "pages-index.json"), JSON.stringify(pages.map(({ mainHtml, mainText, links, images, ...r }) => ({ ...r, imageCount: images?.length ?? 0 })), null, 2));
console.log(`done: ${pages.length} pages extracted, ${shots} screenshotted`);
