import sys, pandas as pd
sys.stdout.reconfigure(encoding='utf-8')

df_new = pd.read_excel('C:/Users/kojac/Downloads/walking_bingo_master.xlsx', sheet_name=0)
diff_map = {1: 'easy', 2: 'normal', 3: 'hard', 4: 'oni', 5: 'oni'}

# Build new state from Excel
new_state = {}
for _, row in df_new.iterrows():
    num = int(str(row['icon_id']).replace('icon', ''))
    new_state[num] = {
        'text': str(row['display_name']),
        'cat':  str(row['category']),
        'diff': diff_map.get(int(row['difficulty_level']), 'normal'),
        'season': str(row['season']) if pd.notna(row['season']) else 'all',
        'diff_raw': int(row['difficulty_level']),
    }

# Build current state from topics.js line by line
import re
with open('C:/Users/kojac/Desktop/AITEST/osanpo bingo/topics.js', encoding='utf-8') as f:
    src = f.read()

cur_state = {}
for m in re.finditer(r"\{id: (\d+), text: '((?:[^'\\]|\\.)*)', icon: '[^']*', category: '([^']*)', diff: '([^']*)', season: '([^']*)'\}", src):
    num = int(m.group(1))
    cur_state[num] = {'text': m.group(2), 'cat': m.group(3), 'diff': m.group(4), 'season': m.group(5)}

print(f'Current entries: {len(cur_state)}, New entries: {len(new_state)}')

changes = []
for num, ns in new_state.items():
    if num not in cur_state:
        changes.append(f'NEW id={num}: {ns}')
        continue
    cs = cur_state[num]
    diffs = []
    for key in ('text', 'cat', 'diff', 'season'):
        nv = ns[key]
        cv = cs.get(key, '?')
        if nv != cv:
            diffs.append(f'{key}: {cv!r}->{nv!r}')
    if diffs:
        changes.append(f'id={num} ({ns["text"]}): ' + ', '.join(diffs))

print(f'Changed: {len(changes)}')
for c in changes:
    print(' ', c)
