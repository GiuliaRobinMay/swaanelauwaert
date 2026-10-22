// Screenshots the rebuilt site (served from dist/ or a dev server) at the same
// viewports used for the mirror, so pages can be compared side by side with
// mirror/screenshots/. Usage: node scripts/compare-screenshots.mjs http://localhost:4321 [path ...]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = (process.argv[2] || "http://localhost:4321").replace(/\/$/, "");
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ["/en/", "/nl/"];
const OUT = path.resolve("docs/screenshots");
fs.mkdirSync(OUT, { recursive: true });
const slug = (u) => u.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "") || "home";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM || undefined;
const browser = await chromium.launch({ executablePath });
for (const p of paths) {
  for (const [name, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
    const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
    const page = await ctx.newPage();
    await page.goto(base + p, { waitUntil: "networkidle", timeout: 60000 });
    await page.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(300);
    const file = path.join(OUT, `${slug(p)}--${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
    await ctx.close();
  }
}
await browser.close();
