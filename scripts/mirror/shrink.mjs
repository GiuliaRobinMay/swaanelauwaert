// Downscales oversized images in place (max MAX_PX on the long edge, re-encoded
// JPEG q85 / PNG) so the repository stays a reasonable size. Originals stay on
// the WordPress host. Usage: node shrink.mjs <dir> [maxPx]
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
const dir = path.resolve(process.argv[2] || "../../mirror/media");
const MAX_PX = parseInt(process.argv[3] || "2000", 10);
const MIN_BYTES = 600 * 1024;
let n = 0, saved = 0;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
for (const f of walk(dir)) {
  if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
  const before = fs.statSync(f).size;
  if (before < MIN_BYTES) continue;
  try {
    const img = sharp(f, { failOn: "none" }).rotate();
    const meta = await img.metadata();
    const w = meta.width || 0, h = meta.height || 0;
    if (Math.max(w, h) <= MAX_PX && before < 2 * 1024 * 1024) continue;
    const resized = img.resize({ width: MAX_PX, height: MAX_PX, fit: "inside", withoutEnlargement: true });
    const buf = /\.png$/i.test(f) ? await resized.png({ compressionLevel: 9 }).toBuffer() : await resized.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
    if (buf.length < before) { fs.writeFileSync(f, buf); n++; saved += before - buf.length; }
  } catch (e) { console.log("skip", f, String(e).slice(0, 80)); }
}
console.log(`shrink: ${n} files rewritten, ${(saved / 1e6).toFixed(1)} MB saved`);
