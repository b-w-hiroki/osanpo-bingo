/**
 * ビンゴアイコン一括リサイズスクリプト
 * 
 * 全アイコンを ICON_SPEC の規格（512×512px）に統一します。
 * 元ファイルは assets/icons/backup/ に退避します。
 * 
 * 使い方: npm install && npm run resize-icons
 * 確認のみ: npm run resize-icons:dry
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '../assets/icons');
const BACKUP_DIR = path.join(ICONS_DIR, 'backup');
const TARGET_SIZE = 512;
const DRY_RUN = process.argv.includes('--dry-run');

// sharp が無い場合は案内して終了
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('sharp がインストールされていません。以下のコマンドを実行してください：');
  console.log('  npm install');
  console.log('');
  process.exit(1);
}

async function getPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf[0] !== 137 || buf[1] !== 80 || buf[2] !== 78) return null;
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20)
  };
}

async function resizeIcons() {
  const files = fs.readdirSync(ICONS_DIR).filter(f => f.startsWith('icon-') && f.endsWith('.png'));
  
  if (files.length === 0) {
    console.log('リサイズ対象のアイコンファイルがありません。');
    return;
  }

  // バックアップディレクトリ作成
  if (!DRY_RUN && !fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('バックアップ用フォルダを作成しました:', BACKUP_DIR);
  }

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    const srcPath = path.join(ICONS_DIR, file);
    const stat = fs.statSync(srcPath);
    if (!stat.isFile()) continue;

    const dims = await getPngDimensions(srcPath);
    if (!dims) {
      console.log('  [スキップ]', file, '(PNG形式でない可能性)');
      skipped++;
      continue;
    }

    const needResize = dims.width !== TARGET_SIZE || dims.height !== TARGET_SIZE;

    if (!needResize) {
      console.log('  [OK]', file, `(${dims.width}x${dims.height} - 既に規格サイズ)`);
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log('  [予定]', file, `${dims.width}x${dims.height} → ${TARGET_SIZE}x${TARGET_SIZE}`);
      processed++;
      continue;
    }

    try {
      // バックアップ
      const backupPath = path.join(BACKUP_DIR, file);
      fs.copyFileSync(srcPath, backupPath);

      // リサイズ（アスペクト比維持、中央でフィット、余白は透明のまま）
      const tmpPath = path.join(path.dirname(srcPath), '._resize_tmp_' + file);
      await sharp(srcPath)
        .resize(TARGET_SIZE, TARGET_SIZE, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(tmpPath);

      fs.copyFileSync(tmpPath, srcPath);
      fs.unlinkSync(tmpPath);
      console.log('  [完了]', file, `${dims.width}x${dims.height} → ${TARGET_SIZE}x${TARGET_SIZE}`);
      processed++;
    } catch (err) {
      console.error('  [エラー]', file, err.message);
      errors++;
    }
  }

  console.log('');
  console.log('--- 結果 ---');
  console.log('リサイズ:', processed, '件');
  console.log('スキップ:', skipped, '件');
  if (errors > 0) console.log('エラー:', errors, '件');
  
  if (processed > 0 && !DRY_RUN) {
    console.log('');
    console.log('元ファイルは', BACKUP_DIR, 'に保存されています。');
  }
}

resizeIcons().catch(err => {
  console.error(err);
  process.exit(1);
});
