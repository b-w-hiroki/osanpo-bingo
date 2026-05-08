import sys, re, pandas as pd
sys.stdout.reconfigure(encoding='utf-8')

df_new = pd.read_excel('C:/Users/kojac/Downloads/walking_bingo_master.xlsx', sheet_name=0)

with open('C:/Users/kojac/Desktop/AITEST/osanpo bingo/topics.js', encoding='utf-8') as f:
    src = f.read()

pattern = r"\{id: (\d+), text: '([^']*)', icon: '[^']*', category: '([^']*)', diff: '([^']*)', season: '([^']*)'\}"
current = {int(m[0]): (m[1], m[2], m[3], m[4]) for m in re.findall(pattern, src)}
# current[id] = (text, category, diff, season)

diff_map = {1: 'easy', 2: 'normal', 3: 'hard', 4: 'oni', 5: 'oni'}
changes = []
for _, row in df_new.iterrows():
    num = int(str(row['icon_id']).replace('icon', ''))
    text = str(row['display_name'])
    cat = str(row['category'])
    diff = diff_map.get(int(row['difficulty_level']), 'normal')
    season = str(row['season']) if pd.notna(row['season']) else 'all'
    if num in current:
        ct, cc, cd, cs = current[num]
        if diff != cd or season != cs or cat != cc or text != ct:
            changes.append(f'id={num} {ct!r}: diff={cd}->{diff}, season={cs}->{season}, cat={cc!r}->{cat!r}, name={ct!r}->{text!r}')

print(f'Changed: {len(changes)} entries')
for c in changes:
    print(' ', c)
