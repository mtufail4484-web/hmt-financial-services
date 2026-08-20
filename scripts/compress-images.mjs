// One-off lossless-ish image compression for oversized public/ assets.
// Usage: node scripts/compress-images.mjs
// - JPEGs: mozjpeg quality 80, downscaled to <=1920px wide
// - PNGs:  palette quantisation (great for photos/rendered graphics)
// Never enlarges; skips files that would grow (keeps the original).
import sharp from "sharp";
import { readdir, stat, rename, unlink } from "node:fs/promises";
import path from "node:path";

const DIR = "public";
const MAX_W = 1920;

async function processFile(file) {
  const full = path.join(DIR, file);
  const before = (await stat(full)).size;
  const tmp = full + ".tmp";
  try {
    const img = sharp(full, { failOn: "none" });
    const meta = await img.metadata();
    if (meta.width > MAX_W) {
      img.resize({ width: MAX_W, withoutEnlargement: true });
    }
    if (/\.jpe?g$/i.test(file)) {
      await img.jpeg({ quality: 80, mozjpeg: true }).toFile(tmp);
    } else if (/\.png$/i.test(file)) {
      await img.png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(tmp);
    } else {
      return { file, skipped: true };
    }
    const after = (await stat(tmp)).size;
    if (after < before) {
      await rename(tmp, full);
      return { file, before, after };
    }
    await unlink(tmp);
    return { file, skipped: true, before, after };
  } catch (err) {
    console.error(`FAILED ${file}: ${err.message}`);
    return { file, error: true };
  }
}

const files = (await readdir(DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f));
let saved = 0;
for (const f of files) {
  const r = await processFile(f);
  if (r.before) {
    saved += r.before - r.after;
    console.log(`${f}: ${(r.before / 1e6).toFixed(2)}MB -> ${(r.after / 1e6).toFixed(2)}MB`);
  } else if (r.skipped) {
    console.log(`${f}: skipped (already optimal)`);
  }
}
console.log(`\nTotal saved: ${(saved / 1e6).toFixed(2)}MB`);
