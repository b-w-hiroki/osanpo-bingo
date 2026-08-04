#!/usr/bin/env node
/**
 * お題アイコンPNGを配信用に最適化する。
 *
 *   npm run optimize-icons           … assets/icons 以下を上書き最適化
 *   npm run optimize-icons -- --dry-run  … 変更せず削減量だけ表示
 *
 * ボードは1枚あたり25個のアイコンを読み込むため、1枚のサイズがそのまま
 * 初回表示の通信量になる。表示は最大でもお題モーダルの512pxなので、
 * 512pxを超える画像は縮小し、PNGはパレット化して軽量にする。
 *
 * 元より大きくなる場合はスキップするので、繰り返し実行しても劣化しない。
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ICON_DIRS = [
  path.join(__dirname, '..', 'assets', 'icons'),
  path.join(__dirname, '..', 'assets', 'icons', 'landmark'),
];

// お題モーダルの表示上限（styles.css の .cell-modal-icon .cell-icon-img）
const MAX_SIZE = 512;
const PNG_OPTIONS = { palette: true, quality: 82, effort: 10 };

const dryRun = process.argv.includes('--dry-run');

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(0)}KB`;
}

async function optimizeFile(filePath) {
  const before = fs.statSync(filePath).size;

  const buffer = await sharp(filePath)
    .resize(MAX_SIZE, MAX_SIZE, { fit: 'inside', withoutEnlargement: true })
    .png(PNG_OPTIONS)
    .toBuffer();

  // 最適化で増えてしまう画像はそのまま残す（再実行時の劣化・肥大を防ぐ）
  if (buffer.length >= before) return { before, after: before, skipped: true };

  if (!dryRun) fs.writeFileSync(filePath, buffer);
  return { before, after: buffer.length, skipped: false };
}

async function main() {
  let totalBefore = 0;
  let totalAfter = 0;
  let optimized = 0;
  let skipped = 0;

  for (const dir of ICON_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith('.png'))
      .map((f) => path.join(dir, f))
      .filter((f) => fs.statSync(f).isFile());

    for (const file of files) {
      const { before, after, skipped: wasSkipped } = await optimizeFile(file);
      totalBefore += before;
      totalAfter += after;
      if (wasSkipped) {
        skipped++;
      } else {
        optimized++;
        if (before - after > 300 * 1024) {
          console.log(`  ${formatKB(before).padStart(7)} → ${formatKB(after).padStart(6)}  ${path.basename(file)}`);
        }
      }
    }
  }

  const reduction = totalBefore > 0 ? (100 - (totalAfter / totalBefore) * 100).toFixed(1) : '0';
  console.log('');
  console.log(`${dryRun ? '[dry-run] ' : ''}最適化 ${optimized}枚 / スキップ ${skipped}枚`);
  console.log(`合計 ${(totalBefore / 1048576).toFixed(1)}MB → ${(totalAfter / 1048576).toFixed(1)}MB（${reduction}%削減）`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
