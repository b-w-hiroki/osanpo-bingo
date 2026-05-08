import sys, re, pandas as pd, unicodedata, os
sys.stdout.reconfigure(encoding='utf-8')

df = pd.read_excel('C:/Users/kojac/Downloads/walking_bingo_master.xlsx', sheet_name=0)
osanpo_df = df[df['asset_type'] == 'osanpo']
print('Excel osanpo rows:', len(osanpo_df))

with open('topics.js', encoding='utf-8') as f:
    src = f.read()

cur = {}
for m in re.finditer(r"\{id: (\d+), text: '((?:[^'\\]|\\.)*)', icon: '[^']*', category: '([^']*)', diff: '([^']*)', season: '([^']*)'}", src):
    cur[int(m.group(1))] = {'text': m.group(2), 'cat': m.group(3), 'diff': m.group(4), 'season': m.group(5)}
print('Current topics.js entries:', len(cur))

diff_map = {1:'easy', 2:'normal', 3:'hard', 4:'oni', 5:'oni'}
added, changed = [], []

for _, row in osanpo_df.iterrows():
    num = int(str(row['icon_id']).replace('icon',''))
    text = unicodedata.normalize('NFC', str(row['display_name']))
    cat  = unicodedata.normalize('NFC', str(row['category']))
    diff = diff_map.get(int(row['difficulty_level']), 'normal')
    season = str(row['season']) if pd.notna(row['season']) else 'all'
    fname = unicodedata.normalize('NFC', str(row['icon_file_name']))
    if not fname.endswith('.png'):
        fname += '.png'

    if num not in cur:
        added.append((num, text, cat, diff, season, fname))
    else:
        c = cur[num]
        diffs = []
        if text != c['text']: diffs.append(f"text: {c['text']!r}->{text!r}")
        if cat  != c['cat']:  diffs.append(f"cat: {c['cat']!r}->{cat!r}")
        if diff != c['diff']: diffs.append(f"diff: {c['diff']!r}->{diff!r}")
        if season != c['season']: diffs.append(f"season: {c['season']!r}->{season!r}")
        if diffs:
            changed.append((num, text, diffs))

print(f'\nNew entries: {len(added)}')
for a in added:
    print(f'  id={a[0]} {a[1]!r} [{a[2]}/{a[3]}/{a[4]}] file={a[5]}')
    # check if icon exists
    icon_path = f'assets/icons/{a[5]}'
    if not os.path.exists(icon_path):
        print(f'    !! ICON MISSING: {icon_path}')

print(f'\nChanged entries: {len(changed)}')
for c in changed:
    print(f'  id={c[0]} {c[1]!r}: {", ".join(c[2])}')
