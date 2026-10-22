// Text-completeness check: for every mirrored page that has a rebuilt
// counterpart, compare the visible words of the original (header/footer
// excluded) with the rebuilt page in dist/ and report what is missing.
import fs from "node:fs";
import path from "node:path";
const RAW = "mirror/raw/swaanelauwaert.com";
const DIST = "dist";
const decode = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&(amp|lt|gt|quot|nbsp|hellip|rsquo|lsquo|ldquo|rdquo|ndash|mdash|raquo|laquo);/g, (m, k) => ({ amp: "&", lt: "<", gt: ">", quot: '"', nbsp: " ", hellip: "…", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", ndash: "–", mdash: "—", raquo: "»", laquo: "«" })[k]);
const text = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<template[\s\S]*?<\/template>|<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const mainOf = (html) => { const a = html.indexOf("</header>"); const b = html.lastIndexOf("<footer"); return a > 0 && b > a ? html.slice(a, b) : html; };
const words = (t) => t.toLowerCase().match(/[\p{L}\p{N}’'-]{2,}/gu) ?? [];
// Strings that are deliberately not reproduced (WordPress comment form, Jetpack widgets, admin hints)
const IGNORE = new Set(words("Een reactie achterlaten Reactie annuleren Je e-mailadres zal niet getoond worden Vereiste velden zijn gemarkeerd met Reactie Naam E-mail Website Mijn naam e-mailadres en website opslaan in deze browser voor de volgende keer wanneer ik een reactie plaats Reactie plaatsen Deze website gebruikt Akismet om spam te verminderen Bekijk hoe je reactie gegevens worden verwerkt Bezig met laden Like of reblog Bewerk template hier wp-admin site-editor.php canvas edit Bluesky Facebook LinkedIn Mastodon WhatsApp Pinterest Delen op Wordt in een nieuw venster geopend Antwoord Antwoord op").concat(["x", "share", "nb", "replytocom"]));
const list = fs.readFileSync(process.argv[2] || "/tmp/claude-0/-home-user-swaanelauwaert/4cc4afd7-8621-569a-bb42-409f65eac157/scratchpad/render-list.txt", "utf8").split("\n").filter(Boolean);
const files = [...list, ...fs.readdirSync(path.join(RAW, "nl"), { recursive: true }).filter((f) => /^\d{4}\/\d{2}\/\d{2}\/[^/]+\/index\.html$/.test(f)).map((f) => path.join(RAW, "nl", f))];
const rows = [];
for (const f of new Set(files)) {
  let url = f.replace(RAW + "/", "").replace(/\/index\.html$/, "/").replace(/^index\.html$/, "/").replace(/^(en|nl|fr)\.html$/, "$1/");
  url = "/" + url.replace(/^\/+/, "");
  if (url === "/") continue;
  let distFile = path.join(DIST, url, "index.html");
  // follow our own redirect pages
  if (fs.existsSync(distFile)) { const m = fs.readFileSync(distFile, "utf8").match(/http-equiv="refresh" content="\d+;\s*url=([^"]+)"/i); if (m) distFile = path.join(DIST, m[1], "index.html"); }
  if (!fs.existsSync(distFile)) { rows.push({ url, note: "no rebuilt page" }); continue; }
  const orig = words(text(mainOf(fs.readFileSync(f, "utf8"))));
  const mine = new Set(words(text(fs.readFileSync(distFile, "utf8"))));
  const counts = new Map();
  for (const w of orig) if (!mine.has(w) && !IGNORE.has(w)) counts.set(w, (counts.get(w) || 0) + 1);
  const missing = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  rows.push({ url, origWords: orig.length, missing: missing.length, sample: missing.slice(0, 15).map(([w, n]) => (n > 1 ? `${w}×${n}` : w)).join(" ") });
}
rows.sort((a, b) => (b.missing ?? 999) - (a.missing ?? 999));
const md = ["# Text completeness report", "", "| Page | Words in original | Missing words | Sample of missing words | Note |", "| --- | --- | --- | --- | --- |", ...rows.map((r) => `| ${r.url} | ${r.origWords ?? ""} | ${r.missing ?? ""} | ${r.sample ?? ""} | ${r.note ?? ""} |`)].join("\n");
fs.writeFileSync("docs/text-check.md", md + "\n");
console.log(`pages compared: ${rows.length}; with missing words: ${rows.filter((r) => r.missing > 0).length}; no counterpart: ${rows.filter((r) => r.note).length}`);
console.log(rows.slice(0, 25).map((r) => `${r.url} missing=${r.missing ?? "-"} ${r.sample ?? r.note}`).join("\n"));
