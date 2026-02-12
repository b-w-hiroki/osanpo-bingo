/* PWA用アイコン生成（sharp）
 *
 * 使い方:
 *   node tools/generate-pwa-icons.js
 *
 * 出力:
 *   - osanpo bingo/icon-192.png, icon-512.png（既存アイコンから）
 *   - nomisuke bingo/icon-192.png, icon-512.png（SVGから生成）
 *   - bingo-platform/icon-192.png, icon-512.png（SVGから生成）
 */

const path = require('path');
const sharp = require('sharp');

const ROOT_OSANPO = path.resolve(__dirname, '..');
const ROOT_NOMISUKE = path.resolve(ROOT_OSANPO, '..', 'nomisuke bingo');
const ROOT_PLATFORM = path.resolve(ROOT_OSANPO, '..', 'bingo-platform');

const SRC_OSANPO = path.resolve(ROOT_OSANPO, 'assets', 'icons', 'icon-hana.png');

const svgNomisuke = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e8c9a0"/>
      <stop offset="1" stop-color="#d4a574"/>
    </linearGradient>
  </defs>
  <rect x="32" y="32" width="448" height="448" rx="96" fill="url(#bg)"/>

  <!-- Beer mug -->
  <rect x="160" y="150" width="170" height="240" rx="30" fill="#fff7e9" stroke="#b8845a" stroke-width="18"/>
  <rect x="172" y="206" width="146" height="172" rx="18" fill="#ffd87a"/>
  <path d="M330 195c44 0 80 36 80 80s-36 80-80 80" fill="none" stroke="#b8845a" stroke-width="26" stroke-linecap="round"/>
  <path d="M330 235c22 0 40 18 40 40s-18 40-40 40" fill="none" stroke="#fff7e9" stroke-width="18" stroke-linecap="round"/>

  <!-- Foam -->
  <path d="M160 170c22-30 58-48 96-48s74 18 96 48v28H160v-28z" fill="#ffffff"/>
  <circle cx="216" cy="176" r="10" fill="#fff7e9"/>
  <circle cx="256" cy="160" r="12" fill="#fff7e9"/>
  <circle cx="296" cy="176" r="10" fill="#fff7e9"/>

  <!-- Table line -->
  <path d="M152 416h208" stroke="#b8845a" stroke-width="18" stroke-linecap="round" opacity="0.6"/>

  <!-- Red lantern accent -->
  <path d="M98 336c26 0 44 18 44 44 0 40-40 68-40 68s-40-28-40-68c0-26 18-44 36-44z" fill="#ff6b6b"/>
  <path d="M102 352c-10 0-18 8-18 18 0 14 18 34 18 34s18-20 18-34c0-10-8-18-18-18z" fill="#ffd1d1" opacity="0.45"/>
</svg>
`.trim();

const svgPlatform = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="pbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7B88CF"/>
      <stop offset="1" stop-color="#4A5AA0"/>
    </linearGradient>
  </defs>
  <rect x="32" y="32" width="448" height="448" rx="96" fill="url(#pbg)"/>
  <circle cx="256" cy="256" r="150" fill="none" stroke="#ffffff" stroke-width="24" opacity="0.92"/>
  <circle cx="256" cy="256" r="96" fill="none" stroke="#FFB347" stroke-width="26"/>
  <circle cx="256" cy="256" r="44" fill="#ffffff"/>
  <path d="M256 110v44M256 358v44M110 256h44M358 256h44" stroke="#ffffff" stroke-width="20" stroke-linecap="round" opacity="0.75"/>
</svg>
`.trim();

async function writeIconsFromPng(src, outDir) {
  await sharp(src)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, 'icon-512.png'));

  await sharp(src)
    .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, 'icon-192.png'));
}

async function writeIconsFromSvg(svg, outDir) {
  const buf = Buffer.from(svg);
  await sharp(buf).resize(512, 512).png().toFile(path.join(outDir, 'icon-512.png'));
  await sharp(buf).resize(192, 192).png().toFile(path.join(outDir, 'icon-192.png'));
}

(async () => {
  await writeIconsFromPng(SRC_OSANPO, ROOT_OSANPO);
  await writeIconsFromSvg(svgNomisuke, ROOT_NOMISUKE);
  await writeIconsFromSvg(svgPlatform, ROOT_PLATFORM);
  console.log('✅ PWAアイコンを生成しました');
  console.log('- osanpo bingo: icon-192.png, icon-512.png');
  console.log('- nomisuke bingo: icon-192.png, icon-512.png');
  console.log('- bingo-platform: icon-192.png, icon-512.png');
})().catch((e) => {
  console.error('❌ アイコン生成に失敗しました:', e);
  process.exit(1);
});

