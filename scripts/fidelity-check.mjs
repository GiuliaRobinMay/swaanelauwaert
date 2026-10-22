// Compares the rebuilt site against full-page renders of the mirrored
// original. For every page in the render list it screenshots the rebuilt page
// (served at BASE) at 1440px, then compares page height and a coarse grayscale
// pixel difference with the original render. Writes docs/fidelity-report.md.
//
//   node scripts/fidelity-check.mjs [BASE] [renderDir] [renderList]
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const BASE = (process.argv[2] || "http://127.0.0.1:4321").replace(/\/$/, "");
const SCRATCH = "/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad";
const RENDERS = process.argv[3] || path.join(SCRATCH, "local-shots");
const LIST = process.argv[4] || path.join(SCRATCH, "render-list.txt");
const OUT_DIR = path.resolve("docs/fidelity");
fs.mkdirSync(OUT_DIR, { recursive: true });
const executablePath = process.env.PLAYWRIGHT_CHROMIUM || undefined;

const files = fs.readFileSync(LIST, "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
const nameOf = (f) => { let n = f.replace(/^mirror\/raw\/swaanelauwaert\.com\//, "").replace(/\/index\.html$/, "").replace(/\.html$/, "").replace(/[^a-zA-Z0-9]+/g, "-"); return n || "root"; };
const urlOf = (f) => { let p = f.replace(/^mirror\/raw\/swaanelauwaert\.com\//, "").replace(/\/index\.html$/, "/").replace(/^index\.html$/, "/").replace(/^(en|nl|fr)\.html$/, "$1/"); return "/" + p.replace(/^\/+/, ""); };

async function gray(buf, width) {
  const img = sharp(buf).resize({ width, withoutEnlargement: true }).grayscale();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}
async function compare(aBuf, bBuf) {
  const a = await gray(aBuf, 240), b = await gray(bBuf, 240);
  const w = Math.min(a.w, b.w), h = Math.min(a.h, b.h);
  let diff = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (Math.abs(a.data[y * a.w + x] - b.data[y * b.w + x]) > 40) diff++;
  return { pixelDiff: diff / (w * h), rowsCompared: h, aH: a.h, bH: b.h };
}

const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const rows = [];
for (const f of files) {
  const name = nameOf(f), url = urlOf(f);
  if (url === "/") continue; // root is a redirect on the rebuilt site
  const orig = path.join(RENDERS, `${name}--desktop.png`);
  if (!fs.existsSync(orig)) { rows.push({ url, name, note: "no original render" }); continue; }
  try {
    const resp = await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 60000 });
    await page.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(400);
    const shot = await page.screenshot({ fullPage: true });
    fs.writeFileSync(path.join(OUT_DIR, `${name}--new.png`), shot);
    const origBuf = fs.readFileSync(orig);
    const oMeta = await sharp(origBuf).metadata(), nMeta = await sharp(shot).metadata();
    const c = await compare(origBuf, shot);
    rows.push({ url, name, status: resp?.status(), hOrig: oMeta.height, hNew: nMeta.height, heightDiff: (nMeta.height - oMeta.height) / oMeta.height, pixelDiff: c.pixelDiff });
    console.log(`${url} ${resp?.status()} h ${oMeta.height}->${nMeta.height} diff ${(c.pixelDiff * 100).toFixed(1)}%`);
  } catch (e) { rows.push({ url, name, note: String(e).slice(0, 120) }); console.log(`${url} ERROR ${e}`); }
}
await browser.close();
rows.sort((a, b) => (b.pixelDiff ?? 1) - (a.pixelDiff ?? 1));
const md = ["# Fidelity report", "", `Base: ${BASE} — original renders: ${RENDERS}`, "", "| Page | Status | Height orig → new | Height Δ | Pixel diff | Note |", "| --- | --- | --- | --- | --- | --- |", ...rows.map((r) => `| ${r.url} | ${r.status ?? ""} | ${r.hOrig ?? ""} → ${r.hNew ?? ""} | ${r.heightDiff != null ? (r.heightDiff * 100).toFixed(1) + "%" : ""} | ${r.pixelDiff != null ? (r.pixelDiff * 100).toFixed(1) + "%" : ""} | ${r.note ?? ""} |`)].join("\n");
fs.writeFileSync("docs/fidelity-report.md", md + "\n");
console.log("wrote docs/fidelity-report.md");
