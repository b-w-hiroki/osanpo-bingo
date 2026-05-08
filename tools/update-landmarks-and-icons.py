"""
1. Extract new osanpo icons (566-633) to assets/icons/
2. Extract active landmark icons to assets/icons/landmark/
3. Delete old placeholder landmark icons
4. Update landmarkDatabase in topics.js
"""
import sys, os, zipfile, unicodedata, re, shutil
sys.stdout.reconfigure(encoding='utf-8')

OSANPO_ZIP   = 'C:/Users/kojac/Downloads/osanpo-icon.zip'
LANDMARK_ZIP = 'C:/Users/kojac/Downloads/landmark-icon.zip'
ICONS_DIR    = 'assets/icons'
LANDMARK_DIR = 'assets/icons/landmark'
TOPICS       = 'topics.js'

def nfc(s): return unicodedata.normalize('NFC', s)

# ── 1. Extract new osanpo icons (566-633) ────────────────────────────
z = zipfile.ZipFile(OSANPO_ZIP)
new_osanpo = [f for f in z.namelist() if f.endswith('.png') and
              any(f'icon{n:03d}_' in f for n in range(566, 700))]
extracted_osanpo = 0
for zpath in new_osanpo:
    base = nfc(os.path.basename(zpath))
    out = os.path.join(ICONS_DIR, base)
    with z.open(zpath) as src, open(out, 'wb') as dst:
        shutil.copyfileobj(src, dst)
    extracted_osanpo += 1
print(f'Extracted {extracted_osanpo} new osanpo icons (566-633)')

# ── 2. Extract active landmark icons ─────────────────────────────────
os.makedirs(LANDMARK_DIR, exist_ok=True)
lz = zipfile.ZipFile(LANDMARK_ZIP)
active = [f for f in lz.namelist()
          if f.endswith('.png') and '使わない' not in f and os.path.basename(f)]
extracted_lm = 0
for zpath in active:
    base = nfc(os.path.basename(zpath))
    if not base:
        continue
    out = os.path.join(LANDMARK_DIR, base)
    with lz.open(zpath) as src, open(out, 'wb') as dst:
        shutil.copyfileobj(src, dst)
    extracted_lm += 1
    print(f'  landmark: {base}')
print(f'Extracted {extracted_lm} landmark icons')

# ── 3. Delete old placeholder landmark icons ──────────────────────────
old_placeholders = [f for f in os.listdir(LANDMARK_DIR)
                    if f.endswith('_ランドマーク.png')]
for f in old_placeholders:
    os.remove(os.path.join(LANDMARK_DIR, f))
    print(f'  Deleted placeholder: {f}')

# ── 4. Update landmarkDatabase in topics.js ───────────────────────────
# landmark files now on disk (NFC normalized)
lm_files = sorted(f for f in os.listdir(LANDMARK_DIR) if f.endswith('.png'))
# Parse: landmark001_自然.png → id=landmark001, text=自然, iconFile=filename
lm_entries = []
for f in lm_files:
    m = re.match(r'(landmark\d+)_(.+)\.png', f)
    if m:
        lid, text = m.group(1), m.group(2)
        lm_entries.append((lid, text, f))

new_db_lines = ['const landmarkDatabase = [']
for lid, text, fname in lm_entries:
    new_db_lines.append(
        f"  {{id: '{lid}', text: '{text}', iconFile: '{fname}', type: 'landmark', category: 'ランドマーク'}},"
    )
new_db_lines.append('];')
new_db = '\n'.join(new_db_lines)

with open(TOPICS, 'r', encoding='utf-8') as f:
    src = f.read()

src = re.sub(
    r'const landmarkDatabase = \[.*?\];',
    new_db,
    src,
    count=1,
    flags=re.DOTALL
)

with open(TOPICS, 'w', encoding='utf-8', newline='\n') as f:
    f.write(src)

print(f'\nlandmarkDatabase updated with {len(lm_entries)} entries:')
for lid, text, fname in lm_entries:
    print(f'  {lid}: {text} ({fname})')
print('\nNote: icon566-633 extracted but NOT yet in Excel master (osanpo rows still 267).')
