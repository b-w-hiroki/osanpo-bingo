#!/usr/bin/env node
/**
 * お題図鑑ページ（topics.html）を topics.js から自動生成する。
 *
 *   npm run build-topics-page
 *
 * topics.js を更新したら再実行して topics.html をコミットすること。
 * （GitHub Pages 配信のため、生成物もリポジトリに含める）
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE_URL = 'https://osanpobingo-battle.com';

const DIFFICULTY_LABELS = {
  1: { name: 'かんたん', desc: '散歩に出れば必ず目に入るもの。小さな子でも見つけられます。' },
  2: { name: 'ふつう', desc: '少し意識して探すと見つかるもの。ビンゴの中心になるお題です。' },
  3: { name: 'むずかしい', desc: '見つけたら思わず声が出るレアなお題。' },
  4: { name: 'おに', desc: '出会えたらその日は当たり。上級者向けのお題です。' },
};

function loadTopicDatabase() {
  const src = fs.readFileSync(path.join(ROOT, 'topics.js'), 'utf8');
  // topics.js はブラウザ用のプレーンなスクリプト。トップレベルの const をそのまま取り出す。
  return new Function(`${src}; return { topicDatabase, topicIconMap };`)();
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSections(topicDatabase) {
  return [1, 2, 3, 4].map((tier) => {
    const topics = topicDatabase[tier] || [];
    // カテゴリごとにまとめる（出現順を維持）
    const byCategory = new Map();
    topics.forEach((t) => {
      const cat = t.category || 'その他';
      if (!byCategory.has(cat)) byCategory.set(cat, []);
      byCategory.get(cat).push(t);
    });
    return { tier, label: DIFFICULTY_LABELS[tier], total: topics.length, byCategory };
  });
}

function renderSection({ tier, label, total, byCategory }) {
  const groups = [...byCategory.entries()]
    .map(([category, topics]) => {
      const items = topics
        .map((t) => `<li class="topic-item">${escapeHtml(t.text)}</li>`)
        .join('\n            ');
      return `        <div class="topic-group">
          <h3 class="topic-category">${escapeHtml(category)}<span class="topic-category-count">${topics.length}</span></h3>
          <ul class="topic-list">
            ${items}
          </ul>
        </div>`;
    })
    .join('\n');

  return `      <section class="tier" id="tier-${tier}">
        <h2 class="tier-title">
          <span class="tier-badge tier-badge-${tier}">${escapeHtml(label.name)}</span>
          <span class="tier-count">${total}個のお題</span>
        </h2>
        <p class="tier-desc">${escapeHtml(label.desc)}</p>
${groups}
      </section>`;
}

function renderPage(sections, totalCount) {
  const title = `お題図鑑 - おさんぽビンゴ全${totalCount}お題一覧`;
  const description = `おさんぽビンゴで出題される全${totalCount}個のお題を難易度・カテゴリ別に一覧で紹介。散歩ビンゴのお題ネタ探しにどうぞ。アプリ不要・無料で今すぐ遊べます。`;

  const nav = sections
    .map((s) => `<a class="tier-nav-link" href="#tier-${s.tier}">${escapeHtml(s.label.name)}</a>`)
    .join('\n        ');

  const itemListElements = sections
    .flatMap((s) => [...s.byCategory.values()].flat())
    .map((t, i) => `      { "@type": "ListItem", "position": ${i + 1}, "name": ${JSON.stringify(t.text)} }`)
    .join(',\n');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#157F1F">
  <title>${escapeHtml(title)}</title>
  <link rel="canonical" href="${SITE_URL}/topics.html">

  <!-- OGP -->
  <meta property="og:site_name" content="おさんぽビンゴバトル">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${SITE_URL}/static/osanpo-bingo-battle.png">
  <meta property="og:url" content="${SITE_URL}/topics.html">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${SITE_URL}/static/osanpo-bingo-battle.png">

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-VDM84JMFJ0"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-VDM84JMFJ0');
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": ${JSON.stringify(title)},
    "description": ${JSON.stringify(description)},
    "numberOfItems": ${totalCount},
    "itemListElement": [
${itemListElements}
    ]
  }
  </script>

  <style>
    :root {
      --green: #157F1F;
      --green-light: #7eb89a;
      --ink: #2f3b33;
      --muted: #6b7a70;
      --bg: #f7faf6;
      --card: #ffffff;
      --border: #e2ebe3;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
      background: var(--bg);
      color: var(--ink);
      line-height: 1.7;
    }
    .wrap { max-width: 880px; margin: 0 auto; padding: 0 16px 64px; }
    header.hero {
      background: linear-gradient(160deg, #157F1F 0%, #4aa35a 100%);
      color: #fff;
      padding: 40px 16px 32px;
      text-align: center;
    }
    header.hero h1 { font-size: 1.6rem; margin: 0 0 8px; }
    header.hero p { margin: 0 auto; max-width: 640px; font-size: 0.95rem; opacity: 0.95; }
    .cta {
      display: inline-block;
      margin-top: 20px;
      background: #fff;
      color: var(--green);
      font-weight: 700;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 999px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .cta:hover { opacity: 0.9; }
    .tier-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin: 28px 0 8px;
    }
    .tier-nav-link {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 999px;
      padding: 6px 16px;
      color: var(--green);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .tier { margin-top: 40px; }
    .tier-title { display: flex; align-items: center; gap: 12px; margin: 0 0 4px; font-size: 1.25rem; }
    .tier-badge { color: #fff; border-radius: 8px; padding: 4px 14px; font-size: 1rem; }
    .tier-badge-1 { background: #4aa35a; }
    .tier-badge-2 { background: #157F1F; }
    .tier-badge-3 { background: #d4802a; }
    .tier-badge-4 { background: #b4453c; }
    .tier-count { font-size: 0.85rem; color: var(--muted); font-weight: 500; }
    .tier-desc { margin: 0 0 16px; color: var(--muted); font-size: 0.92rem; }
    .topic-group {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 18px;
      margin-bottom: 12px;
    }
    .topic-category { margin: 0 0 10px; font-size: 1rem; display: flex; align-items: center; gap: 8px; }
    .topic-category-count {
      background: var(--bg);
      color: var(--muted);
      border-radius: 999px;
      padding: 1px 10px;
      font-size: 0.78rem;
      font-weight: 500;
    }
    .topic-list { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
    .topic-item {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 4px 12px;
      font-size: 0.9rem;
    }
    .intro { margin-top: 28px; }
    .intro h2 { font-size: 1.15rem; margin-bottom: 8px; }
    .bottom-cta { text-align: center; margin-top: 48px; }
    .bottom-cta .cta { background: var(--green); color: #fff; }
    footer { text-align: center; padding: 32px 16px; color: var(--muted); font-size: 0.85rem; }
    footer a { color: var(--green); }
    @media (max-width: 480px) {
      header.hero h1 { font-size: 1.3rem; }
      .topic-item { font-size: 0.85rem; }
    }
  </style>
</head>
<body>
  <header class="hero">
    <h1>おさんぽビンゴ お題図鑑</h1>
    <p>おさんぽビンゴに登場する全${totalCount}個のお題を、難易度とカテゴリ別にまとめました。散歩ビンゴを紙で作るときのネタ探しにもどうぞ。</p>
    <a class="cta" href="game.html">アプリ不要・無料で遊ぶ</a>
  </header>

  <div class="wrap">
    <nav class="tier-nav">
        ${nav}
    </nav>

    <section class="intro">
      <h2>お題はどう選ばれる？</h2>
      <p>おさんぽビンゴでは、5×5のカードに <strong>かんたん・ふつう・むずかしい・おに</strong> の4段階のお題が混ざって出題されます。難易度を選ぶと、その難易度のお題が多めに配られる仕組みです。カテゴリのバランスも自動で調整されるため、「街インフラばかり」「植物ばかり」にはなりません。</p>
      <p>お気に入りのお題がなければ、ゲーム内の<strong>フリー入力マス</strong>で自分だけのお題を最大12個まで追加できます。地域のお祭りや、通学路の目印など、その場所ならではのお題を入れると盛り上がります。</p>
    </section>

${sections.map(renderSection).join('\n\n')}

    <div class="bottom-cta">
      <a class="cta" href="game.html">このお題で遊んでみる（無料・登録不要）</a>
    </div>
  </div>

  <footer>
    <p><a href="./">トップページ</a> ｜ <a href="game.html">遊ぶ</a> ｜ <a href="privacy.html">プライバシーポリシー</a> ｜ <a href="terms.html">利用規約</a></p>
    <p>© おさんぽビンゴ</p>
  </footer>
</body>
</html>
`;
}

function main() {
  const { topicDatabase } = loadTopicDatabase();
  const sections = buildSections(topicDatabase);
  const totalCount = sections.reduce((sum, s) => sum + s.total, 0);
  const html = renderPage(sections, totalCount);
  const outPath = path.join(ROOT, 'topics.html');
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`✅ topics.html を生成しました（${totalCount}お題 / ${sections.length}難易度）`);
}

main();
