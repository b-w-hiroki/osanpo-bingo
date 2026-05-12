"""
Update topics.js from walking_bingo_master.xlsx
Replaces: topicIconMap, topicDatabase, CATEGORY_QUOTAS
Keeps: all functions, constants, landmark data unchanged

Tier format: numeric 1-4 (1=かんたん, 2=ふつう, 3=むずかしい, 4=おに)
"""
import sys, re, unicodedata, os, pandas as pd
sys.stdout.reconfigure(encoding='utf-8')

EXCEL   = 'C:/Users/kojac/OneDrive/sub_work/osanpo-bingo/walking_bingo_master.xlsx'
TOPICS  = 'topics.js'

df_all = pd.read_excel(EXCEL, sheet_name=0)
df = df_all[df_all['asset_type'] == 'osanpo'].reset_index(drop=True)

# Field mapping: Excel → JS
FIELD_MAP = {
    'すべて':    None,           # omit property (defaults to ['all'] in code)
    '住宅街':    ['residential'],
    'オフィス街': ['office'],
    '観光地':    ['landmark'],
}

# ── Build topicIconMap ───────────────────────────────────────────────
icon_lines = ['const topicIconMap = {']
for _, row in df.iterrows():
    num = int(str(row['icon_id']).replace('icon', ''))
    fname = unicodedata.normalize('NFC', str(row['icon_file_name']))
    if not fname.endswith('.png'):
        fname += '.png'
    icon_lines.append(f"  {num}: '{fname}',")
icon_lines.append('};')
icon_block = '\n'.join(icon_lines)

# ── Build topicDatabase ──────────────────────────────────────────────
tiers = {1: [], 2: [], 3: [], 4: []}
tier_label_jp = {1: 'かんたん', 2: 'ふつう', 3: 'むずかしい', 4: 'おに'}

for _, row in df.iterrows():
    num    = int(str(row['icon_id']).replace('icon', ''))
    text   = unicodedata.normalize('NFC', str(row['display_name']))
    cat    = unicodedata.normalize('NFC', str(row['category'])) if pd.notna(row['category']) else 'その他観察'
    diff   = int(row['difficulty_level']) if int(row['difficulty_level']) <= 4 else 4
    season = str(row['season']) if pd.notna(row['season']) else 'all'
    field_val = str(row['field']) if pd.notna(row['field']) else 'すべて'
    fields = FIELD_MAP.get(field_val, None)
    region = str(row['region_limit']) if pd.notna(row['region_limit']) else None
    tiers[diff].append((num, text, cat, diff, season, fields, region))

db_lines = ['const topicDatabase = {']
for tier in [1, 2, 3, 4]:
    items = tiers[tier]
    db_lines.append(f"  // ティア{tier}（{tier_label_jp[tier]}・{len(items)}個）")
    db_lines.append(f"  {tier}: [")
    for (num, text, cat, diff, season, fields, region) in items:
        t = text.replace("'", "\\'")
        c = cat.replace("'", "\\'")
        entry = f"    {{id: {num}, text: '{t}', icon: '\U0001f50d', category: '{c}', diff: {diff}, season: '{season}'"
        if fields:
            entry += f", fields: {fields}"
        if region:
            entry += f", region_limit: '{region}'"
        entry += "},"
        db_lines.append(entry)
    db_lines.append("  ],")
db_lines.append('};')
db_block = '\n'.join(db_lines)

# ── Build CATEGORY_QUOTAS (total = 24) ───────────────────────────────
QUOTAS = {
    '自然・生き物':         3,  # 53 items
    '街構造・乗り物':       3,  # 43 items
    '街インフラ':           3,  # 29 items
    '生活・学校':           3,  # 28 items
    '家庭・食べ物':         2,  # 36 items
    '商業・店舗':           2,  # 37 items
    '季節・形・数':         1,  # 18 items
    '痕跡・発見':           1,  # 18 items
    '案内・注意表示':       1,  # 15 items
    '標識':                 1,  # 14 items
    '生活・地域設備':       1,  # 14 items
    'キャラクター掲示物':   1,  # 11 items
    '線・模様観察':         1,  # 12 items
    '道路標示・路面表示':   1,  # 7 items
}  # 合計 = 24 ※その他観察（48件）はフィラー枠で補完

total = sum(QUOTAS.values())
assert total == 24, f"CATEGORY_QUOTAS sum is {total}, expected 24"

quota_lines = [
    '/**',
    ' * カテゴリ別 24マス枠割り当て（合計=24）',
    ' * ゲームごとに±1の揺らぎを加えてバリエーションを出す',
    ' */',
    'const CATEGORY_QUOTAS = {',
]
for cat, q in QUOTAS.items():
    c = cat.replace("'", "\\'")
    quota_lines.append(f"  '{c}': {q},")
quota_lines.append('}; // 合計 = 24（その他観察・住宅外構等はフィラー枠で補完）')
quota_block = '\n'.join(quota_lines)

# ── Read current topics.js ────────────────────────────────────────────
with open(TOPICS, 'r', encoding='utf-8') as f:
    src = f.read()

# ── Replace topicIconMap section ──────────────────────────────────────
src = re.sub(
    r'const topicIconMap = \{.*?\};',
    icon_block,
    src,
    count=1,
    flags=re.DOTALL
)

# ── Replace topicDatabase section ─────────────────────────────────────
src = re.sub(
    r'const topicDatabase = \{.*?\};',
    db_block,
    src,
    count=1,
    flags=re.DOTALL
)

# ── Replace CATEGORY_QUOTAS section ──────────────────────────────────
src = re.sub(
    r'/\*\*\s*\n\s*\* カテゴリ別.*?合計 = 24[^\n]*',
    quota_block,
    src,
    count=1,
    flags=re.DOTALL
)

# ── Update header comment ─────────────────────────────────────────────
from datetime import datetime
now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
src = re.sub(
    r'// 生成日時: .*',
    f'// 生成日時: {now}（walking_bingo_master.xlsx より自動生成）',
    src
)

with open(TOPICS, 'w', encoding='utf-8', newline='\n') as f:
    f.write(src)

print(f"Done. topics.js updated with {len(df)} topics.")
for tier in [1, 2, 3, 4]:
    print(f"  ティア{tier}: {len(tiers[tier])}件")
print(f"  CATEGORY_QUOTAS sum: {sum(QUOTAS.values())} (should be 24)")
