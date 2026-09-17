/**
 * Turns full-size photos in images/source/ into the web-sized files the page uses.
 *
 *   npm run images
 *
 * Drop a photo straight off a phone into images/source/, name it in the SLOTS
 * list below, and this writes an optimised .webp (and a .jpg fallback) into
 * images/ at the size the slot actually renders. Re-run it any time.
 */
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'images/source';
const OUT = 'images';

// slot name -> { from: source filename, width: widest the slot ever renders, ratio }
const SLOTS = [
  { name: 'hero-item', from: 'solitaire-imperial-ring.jpg', width: 1100, ratio: 4 / 3 },
  { name: 'service-gold', from: 'sovereign-fluted-cuff.jpg', width: 800, ratio: 3 / 2 },
  { name: 'service-coins', from: 'aeterna-pave-band.jpg', width: 800, ratio: 3 / 2 },
  { name: 'service-silver', from: 'eclipse-solaire-collar.jpg', width: 800, ratio: 3 / 2 },
  { name: 'service-result', from: 'showcase-bangle.jpg', width: 800, ratio: 3 / 2 },
];

const kb = n => `${(n / 1024).toFixed(0)} kB`;

await mkdir(OUT, { recursive: true });
const available = await readdir(SRC);

for (const slot of SLOTS) {
  if (!available.includes(slot.from)) {
    console.warn(`skip ${slot.name}: ${SRC}/${slot.from} not found`);
    continue;
  }
  const src = path.join(SRC, slot.from);
  const height = Math.round(slot.width / slot.ratio);
  const before = (await stat(src)).size;

  const pipeline = () => sharp(src).resize(slot.width, height, { fit: 'cover', position: 'centre' });

  const webp = path.join(OUT, `${slot.name}.webp`);
  const jpg = path.join(OUT, `${slot.name}.jpg`);
  await pipeline().webp({ quality: 80 }).toFile(webp);
  await pipeline().jpeg({ quality: 82, mozjpeg: true }).toFile(jpg);

  const [w, j] = [(await stat(webp)).size, (await stat(jpg)).size];
  console.log(`${slot.name}  ${slot.width}x${height}  webp ${kb(w)} · jpg ${kb(j)}  (source ${kb(before)})`);
}
