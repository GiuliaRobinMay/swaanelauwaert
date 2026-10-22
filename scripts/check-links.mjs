// Static integrity check of dist/: every internal link, image, script, font
// and stylesheet referenced by the built pages must exist in dist/.
// Also reports external hosts linked and pages with empty <main>.
import fs from "node:fs";
import path from "node:path";
const DIST = path.resolve("dist");
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(DIST);
const html = files.filter((f) => f.endsWith(".html"));
const exists = new Set(files.map((f) => "/" + path.relative(DIST, f).split(path.sep).join("/")));
const resolves = (u) => {
  let p = u.split("#")[0].split("?")[0];
  try { p = decodeURIComponent(p); } catch {}
  if (!p) return true;
  if (exists.has(p)) return true;
  if (p.endsWith("/") && exists.has(p + "index.html")) return true;
  if (!p.endsWith("/") && exists.has(p + "/index.html")) return true;
  return false;
};
const broken = [], external = new Map(), empty = [], deadOnOrigin = new Set();
let checked = 0;
for (const f of html) {
  const h = fs.readFileSync(f, "utf8");
  const page = "/" + path.relative(DIST, f).split(path.sep).join("/");
  if (!/<main|wp-block-group ona-container/.test(h)) empty.push(page);
  const refs = [...h.matchAll(/(?:href|src|poster)=["']([^"']+)["']/g)].map((m) => m[1]).concat([...h.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => m[1]));
  for (const r of refs) {
    checked++;
    if (/^(mailto:|tel:|data:|javascript:|#)/.test(r) || /^context\./.test(r)) continue;
    if (/^\/wp-content\/uploads\//.test(r)) { deadOnOrigin.add(r); continue; }
    if (/^https?:\/\//.test(r)) {
      const host = new URL(r).host;
      if (host === "swaanelauwaert.com" || host === "www.swaanelauwaert.com") { const p = new URL(r).pathname; if (!resolves(p)) broken.push({ page, ref: r }); continue; }
      external.set(host, (external.get(host) || 0) + 1);
      continue;
    }
    if (r.startsWith("//")) { external.set(r.split("/")[2], (external.get(r.split("/")[2]) || 0) + 1); continue; }
    const abs = r.startsWith("/") ? r : path.posix.join(path.posix.dirname(page), r);
    if (!resolves(abs)) broken.push({ page, ref: r });
  }
}
const uniq = [...new Map(broken.map((b) => [b.ref, b])).values()];
console.log(`pages: ${html.length}, refs checked: ${checked}, broken unique refs: ${uniq.length}, dead on origin (kept as-is): ${deadOnOrigin.size}, pages without main: ${empty.length}`);
for (const b of uniq.slice(0, 60)) console.log("  BROKEN", b.ref, "  on", b.page);
if (empty.length) console.log("  EMPTY:", empty.slice(0, 20).join(", "));
console.log("external hosts:", [...external.entries()].sort((a, b) => b[1] - a[1]).map(([h, n]) => `${h}(${n})`).join(", "));
fs.writeFileSync("docs/link-check.json", JSON.stringify({ pages: html.length, checked, broken: uniq, deadOnOrigin: [...deadOnOrigin], empty, external: Object.fromEntries(external) }, null, 2));
process.exit(uniq.length ? 1 : 0);
