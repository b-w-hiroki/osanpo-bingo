import sys, zipfile, unicodedata, pandas as pd
sys.stdout.reconfigure(encoding='utf-8')

EXCEL = 'C:/Users/kojac/Downloads/walking_bingo_master.xlsx'
ZIP   = 'C:/Users/kojac/Downloads/osanpo-icon.zip'
OUT   = 'C:/Users/kojac/Desktop/AITEST/osanpo bingo/_gen_topics_data.txt'

df = pd.read_excel(EXCEL, sheet_name=0)

diff_map = {1: 'easy', 2: 'normal', 3: 'hard', 4: 'oni'}

lines = []

# topicIconMap
lines.append('const topicIconMap = {')
for _, row in df.iterrows():
    num = int(str(row['icon_id']).replace('icon', ''))
    fname = row['icon_file_name']
    lines.append(f'  {num}: \'{fname}\',')
lines.append('};')
lines.append('')

# Group by difficulty
tiers = {'easy': [], 'normal': [], 'hard': [], 'oni': []}
for _, row in df.iterrows():
    num = int(str(row['icon_id']).replace('icon', ''))
    text = row['display_name']
    category = row['category']
    diff_num = int(row['difficulty_level'])
    diff = diff_map.get(diff_num, 'normal')
    season = row['season'] if pd.notna(row['season']) else 'all'
    tiers[diff].append((num, text, category, diff, season))

diff_labels = {
    'easy':   f'easy ({len(tiers["easy"])} items)',
    'normal': f'normal ({len(tiers["normal"])} items)',
    'hard':   f'hard ({len(tiers["hard"])} items)',
    'oni':    f'oni ({len(tiers["oni"])} items)',
}

lines.append('const topicDatabase = {')
for tier in ['easy', 'normal', 'hard', 'oni']:
    lines.append(f'  // {diff_labels[tier]}')
    lines.append(f'  {tier}: [')
    for (num, text, cat, diff, season) in tiers[tier]:
        t = text.replace("'", "\\'")
        c = cat.replace("'", "\\'")
        lines.append(f"    {{id: {num}, text: '{t}', icon: '\U0001f50d', category: '{c}', diff: '{diff}', season: '{season}'}},")
    lines.append('  ],')
lines.append('};')

with open(OUT, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')
print(f'Written {len(lines)} lines to {OUT}')

# Also print category distribution for CATEGORY_QUOTAS reference
from collections import Counter
cats = Counter(row['category'] for _, row in df.iterrows())
print('\nCategory counts:')
for cat, cnt in sorted(cats.items(), key=lambda x: -x[1]):
    print(f'  {cat}: {cnt}')
