// おさんぽビンゴ — お知らせデータ
// 新しいお知らせは、この配列の先頭に追加します。
// 本文は sections の paragraphs に文字列で、関連リンクは links に追加します。
window.NEWS_ITEMS = [
  {
    id: '2026-10-02-introduction',
    date: '2026-10-02',
    category: 'info',
    categoryLabel: 'アプリ紹介',
    title: '「おさんぽビンゴ」のご紹介',
    summary: 'お散歩しながら身近なものを見つけて、5×5のビンゴを完成させるゲームです。',
    sections: [
      {
        heading: 'あそびかた',
        paragraphs: [
          'ビンゴカードに書かれたものをお散歩中に見つけたら、写真を撮るかマスをタップして印を付けます。難易度を選んだり、自分でマスの内容を作ったりできます。',
          'ひとりで遊ぶほか、合言葉を使ってグループや対戦でも楽しめます。対戦では写真を撮ってマスを開けます。',
        ],
      },
      {
        heading: '保存とオフライン利用',
        paragraphs: [
          'ゲームの進行はこの端末のブラウザに自動保存され、JSON形式での書き出しと読み込みにも対応しています。PWAとしてインストールでき、ひとり用はオフラインでも遊べます。',
          '端末をまたいで対戦状況を共有する機能では、通信が必要です。',
        ],
      },
    ],
  },
  {
    id: '2026-10-02-x-account',
    date: '2026-10-02',
    category: 'info',
    categoryLabel: 'SNS',
    title: 'X公式アカウントのご案内',
    summary: 'おさんぽビンゴのX公式アカウント「@osabin_battle」をご案内します。',
    sections: [
      {
        heading: 'Xでもご覧いただけます',
        paragraphs: [
          'おさんぽビンゴのX公式アカウントは「@osabin_battle」です。下のリンクからプロフィールをご覧いただけます。',
        ],
        links: [
          { label: 'Xで @osabin_battle を見る', href: 'https://x.com/osabin_battle' },
        ],
      },
    ],
  },
];

window.NEWS_APP = {
  name: 'おさんぽビンゴ',
  icon: '🌿',
  appHref: './game.html',
  appLabel: 'おさんぽビンゴに戻る',
  readStorageKey: 'osanpo-bingo-news-read-ids',
};
