// Production exports from the approved g. typography and palette.
// Usage: node scripts/build-brand-assets.mjs /path/to/node_modules
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const sharp = require(`${process.argv[2]}/sharp`);
const { GlobalFonts, convertSVGTextToPath } = require(`${process.argv[2]}/@napi-rs/canvas`);
if (!GlobalFonts.registerFromPath('img/fonts/sora.woff2', 'GB Sora')) throw new Error('Could not load brand font.');
const dir = 'img/brand';
await mkdir(dir, { recursive: true });
function outline(fragment) {
  const svg = convertSVGTextToPath(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="512">${fragment}</svg>`).toString();
  return svg.slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>'));
}
// Portal: rounded blue tile, chamfered corner and open lower loop.
// A single continuous outline joins both loops without overlapping strokes.
// Geometry is native SVG so every export has the same silhouette.
function symbolBody(ink, accent, background = '#4667FF') {
  return `<path fill="${background}" d="M80 16H432Q496 16 496 80V394Q496 410 484 422L422 484Q410 496 394 496H80Q16 496 16 432V80Q16 16 80 16Z"/><path fill="${ink}" fill-rule="evenodd" d="M206 64C141 64 90 113 90 178C90 211 103 238 125 258C91 276 72 303 72 338C72 408 130 454 204 454C289 454 360 398 360 329V294H304V329C304 366 262 398 204 398C158 398 128 374 128 338C128 309 160 290 206 290C281 290 334 238 334 170V64H286V86C264 71 238 64 206 64ZM206 118C173 118 148 144 148 177C148 210 174 236 206 236C239 236 266 210 266 177C266 144 239 118 206 118Z"/><rect x="366" y="228" width="58" height="58" rx="5" fill="${accent}"/>`;
}
function signature(ink, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400"><g transform="translate(12 22) scale(.70)">${symbolBody('#EEF0E8', '#D4FC68')}</g>${outline(`<text x="405" y="155" fill="${ink}" font-family="GB Sora" font-size="112" font-weight="500" letter-spacing="-4" stroke="${ink}" stroke-width="1.5">glauber</text><text x="405" y="280" fill="${ink}" font-family="GB Sora" font-size="112" font-weight="500" letter-spacing="-4" stroke="${ink}" stroke-width="1.5">barcelos</text>`)}</svg>`;
}
function mark(ink, accent, background) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${symbolBody(ink, accent, background)}</svg>`;
}
for (const [name, source, size] of [
  ['signature', signature('#EEF0E8', '#D4FC68'), {width:2400,height:800}],
  ['signature-dark', signature('#101114', '#4667FF'), {width:2400,height:800}],
  ['symbol', mark('#EEF0E8', '#D4FC68'), {width:2048,height:2048}],
  ['symbol-cyan', mark('#101114', '#D4FC68', '#EEF0E8'), {width:2048,height:2048}]
]) {
  // Convert every glyph to outlines: SVGs have no font dependency and no raster artifacts.
  const vector = Buffer.from(source);
  await writeFile(`${dir}/glauber-${name}.svg`, vector);
  const master = await sharp(vector, { density: 288 }).resize(size).png().toBuffer();
  await writeFile(`${dir}/glauber-${name}.png`, master);
  await sharp(master).webp({ lossless: true }).toFile(`${dir}/glauber-${name}.webp`);
}
async function tile(size) {
  // Render the full mark directly; retain its margins and chamfered silhouette.
  return sharp(Buffer.from(mark('#EEF0E8', '#D4FC68')), { density: 288 }).resize(size, size).png().toBuffer();
}
for (const size of [16, 32, 48, 180, 192, 512]) {
  await writeFile(`${dir}/icon-${size}.png`, await tile(size));
}
await writeFile(`${dir}/avatar-blue.png`, await tile(512));
// ICO container uses PNG frames for high-quality alpha and broad browser support.
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map(size => tile(size)));
const header = Buffer.alloc(6 + 16 * frames.length);
header.writeUInt16LE(1, 2); header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach((frame, i) => {
  const start = 6 + i * 16;
  header[start] = sizes[i]; header[start + 1] = sizes[i];
  header.writeUInt16LE(1, start + 4); header.writeUInt16LE(32, start + 6);
  header.writeUInt32LE(frame.length, start + 8); header.writeUInt32LE(offset, start + 12);
  offset += frame.length;
});
await writeFile('favicon.ico', Buffer.concat([header, ...frames]));
await writeFile('img/favicon-32.png', frames[1]);
console.log('Exported transparent signature, symbol, avatar and six icon sizes; updated favicon.ico.');
