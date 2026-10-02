// Export generated campaign artwork to exact publication dimensions.
// Usage: node scripts/export-social-banners.mjs /path/to/node_modules
import { createRequire } from 'node:module';
import { readFile, mkdir, copyFile, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const sharp = require(`${process.argv[2]}/sharp`);
const dir = 'output/redes-sociais/portal-20261002';
const manifest = JSON.parse(await readFile(`${dir}/prompts.json`, 'utf8'));
await mkdir(`${dir}/originais`, { recursive: true });
const report = [];
for (const item of manifest.outputs) {
  await copyFile(item.source, `${dir}/originais/${item.id}.png`);
  const [width, height] = item.size;
  // Generated canvases already match the requested aspect ratios; this only
  // normalizes export dimensions, with at most subpixel rounding at the edges.
  const artwork = sharp(item.source).resize(width, height, { fit: 'cover', position: 'centre', kernel: 'lanczos3' });
  await artwork.clone().png({ compressionLevel: 9 }).toFile(`${dir}/${item.id}.png`);
  await artwork.clone().jpeg({ quality: 95, chromaSubsampling: '4:4:4', mozjpeg: true }).toFile(`${dir}/${item.id}.jpg`);
  const meta = await sharp(`${dir}/${item.id}.png`).metadata();
  if (meta.width !== width || meta.height !== height) throw new Error(`Invalid canvas: ${item.id}`);
  report.push({ name: item.id, width, height, original: await sharp(item.source).metadata().then(m => [m.width,m.height]) });
}
await writeFile(`${dir}/validacao.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
