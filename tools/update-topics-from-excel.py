"""
Update topics.js from walking_bingo_master.xlsx
Replaces: topicIconMap, topicDatabase, CATEGORY_QUOTAS
Keeps: all functions, constants, landmark data unchanged
"""
import sys, re, unicodedata, pandas as pd
sys.stdout.reconfigure(encoding='utf-8')

EXCEL   = 'C:/Users/kojac/Downloads/walking_bingo_master.xlsx'
TOPICS  = 'topics.js'

df_all = pd.read_excel(EXCEL, sheet_name=0)
df = df_all[df_all['asset_type'] == 'osanpo'].reset_index(drop=True)
diff_map = {1: 'easy', 2: 'normal', 3: 'hard', 4: 'oni', 5: 'oni'}

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
tiers = {'easy': [], 'normal': [], 'hard': [], 'oni': []}
for _, row in df.iterrows():
    num  = int(str(row['icon_id']).replace('icon', ''))
    text = unicodedata.normalize('NFC', str(row['display_name']))
    cat  = unicodedata.normalize('NFC', str(row['category']))
    diff = diff_map.get(int(row['difficulty_level']), 'normal')
    season = str(row['season']) if pd.notna(row['season']) else 'all'
    tiers[diff].append((num, text, cat, diff, season))

diff_label_jp = {
    'easy':   'かんたん',
    'normal': 'ふつう',
    'hard':   'むずかしい',
    'oni':    'おに',
}

db_lines = ['const topicDatabase = {']
for tier in ['easy', 'normal', 'hard', 'oni']:
    items = tiers[tier]
    db_lines.append(f"  // {diff_label_jp[tier]}（{len(items)}個）")
    db_lines.append(f"  {tier}: [")
    for (num, text, cat, diff, season) in items:
        t = text.replace("'", "\\'")
        c = cat.replace("'", "\\'")
        db_lines.append(f"    {{id: {num}, text: '{t}', icon: '\U0001f50d', category: '{c}', diff: '{diff}', season: '{season}'}},")
    db_lines.append("  ],")
db_lines.append('};')
db_block = '\n'.join(db_lines)

# ── Build CATEGORY_QUOTAS (total = 24) ───────────────────────────────
# Proportional quotas based on category size (min 3 items to qualify)
from collections import Counter
cat_counts = Counter(row['category'] for _, row in df.iterrows())
eligible = {c: n for c, n in cat_counts.items() if n >= 4}

# Manual quotas ensuring sum=24, balancing large and small categories
QUOTAS = {
    '自然・生き物':       3,  # 31 items
    '街構造・乗り物': 3,  # 30 items
    '街インフラ':             3,  # 28 items
    '生活・学校':             3,  # 27 items
    '家庭・食べ物':       2,  # 25 items
    '商業・店舗':             2,  # 15 items
    '季節・形・数':       1,  # 15 items
    '痕跡・発見':             1,  # 14 items
    '案内・注意表示': 1,  # 12 items
    '線・模様観察':       1,  # 11 items
    'キャラクター掲示物': 1,  # 9 items
    '道路標示・路面表示': 1,  # 7 items
    '生活・地域設備': 1,  # 7 items
    'その他観察':             1,  # 5 items
}
# Verify sum
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
quota_lines.append('}; // 合計 = 24')
quota_block = '\n'.join(quota_lines)

# ── Read current topics.js ────────────────────────────────────────────
with open(TOPICS, 'r', encoding='utf-8') as f:
    src = f.read()

# ── Replace topicIconMap section ──────────────────────────────────────
# Match from "const topicIconMap = {" to closing "};"
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
    r'/\*\*\s*\n\s*\* カテゴリ別.*?合計 = 24',
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
print(f"  easy: {len(tiers['easy'])}, normal: {len(tiers['normal'])}, hard: {len(tiers['hard'])}, oni: {len(tiers['oni'])}")
print(f"  CATEGORY_QUOTAS sum: {sum(QUOTAS.values())} (should be 24)")
