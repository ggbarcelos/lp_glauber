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
// Original geometric lowercase g: chamfered bowl, open return and directional point.
// The symbol is drawn directly as paths; only the wordmark uses the Sora font.
function symbolBody(ink, accent) {
  return `<path fill="${ink}" fill-rule="evenodd" d="M146 56H278L346 124V338C346 404 310 438 250 438H116L78 400L116 366H250C269 366 278 357 278 338V302H146C88 302 54 268 54 210V148C54 90 88 56 146 56ZM148 128C133 128 126 135 126 150V208C126 223 133 230 148 230H256C271 230 278 223 278 208V150C278 135 271 128 256 128Z"/><path fill="${accent}" d="M370 230H418L446 258V302H398L370 274Z"/>`;
}
function signature(ink, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400"><g transform="translate(20 -34) scale(.82)">${symbolBody(ink, accent)}</g>${outline(`<text x="405" y="155" fill="${ink}" font-family="GB Sora" font-size="112" font-weight="500" letter-spacing="-4" stroke="${ink}" stroke-width="1.5">glauber</text><text x="405" y="280" fill="${ink}" font-family="GB Sora" font-size="112" font-weight="500" letter-spacing="-4" stroke="${ink}" stroke-width="1.5">barcelos</text>`)}</svg>`;
}
function mark(ink, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${symbolBody(ink, accent)}</svg>`;
}
for (const [name, source, size] of [
  ['signature', signature('#EEF0E8', '#D4FC68'), {width:1200,height:400}],
  ['signature-dark', signature('#101114', '#4667FF'), {width:1200,height:400}],
  ['symbol', mark('#EEF0E8', '#D4FC68'), {width:512,height:512}],
  ['symbol-cyan', mark('#55E6FF', '#9272FF'), {width:512,height:512}]
]) {
  // Convert every glyph to outlines: SVGs have no font dependency and no raster artifacts.
  const vector = Buffer.from(source);
  await writeFile(`${dir}/glauber-${name}.svg`, vector);
  const trimmed = await sharp(vector).trim({ background: '#00000000', threshold: 8 }).toBuffer();
  const master = await sharp(trimmed).resize({ ...size, fit: 'contain', background: '#00000000' }).png().toBuffer();
  await writeFile(`${dir}/glauber-${name}.png`, master);
  await sharp(master).webp({ lossless: true }).toFile(`${dir}/glauber-${name}.webp`);
}
const symbol = `${dir}/glauber-symbol.png`;
const iconBackground = '#4667ff';
async function tile(size, background) {
  const inset = Math.round(size * .11);
  const logo = await sharp(symbol).trim({ background: '#00000000', threshold: 8 })
    .resize(size - inset * 2, size - inset * 2, { fit: 'contain', background: '#00000000' }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: logo, gravity: 'centre' }]).png().toBuffer();
}
for (const size of [16, 32, 48, 180, 192, 512]) {
  await writeFile(`${dir}/icon-${size}.png`, await tile(size, iconBackground));
}
await writeFile(`${dir}/avatar-blue.png`, await tile(512, iconBackground));
// ICO container uses PNG frames for high-quality alpha and broad browser support.
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map(size => tile(size, iconBackground)));
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
