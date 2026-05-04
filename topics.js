// お散歩ビンゴ - お題データベース
// このファイルは tools/csv-to-topics.js で自動生成されています
// 編集する場合は topics_list.csv を更新して npm run build-topics を実行してください
// 生成日時: 2026-05-04 11:37:40（walking_bingo_master.xlsx より自動生成）

// お題ID → アイコン画像ファイル名（なければ絵文字フォールバック）
const topicIconMap = {
  2: 'icon002_郵便ポスト.png',
  3: 'icon003_信号機.png',
  4: 'icon004_横断歩道.png',
  5: 'icon005_カーブミラー.png',
  6: 'icon006_飛び出し坊や.png',
  7: 'icon007_マンホール.png',
  8: 'icon008_ガードレール.png',
  11: 'icon011_道路反射板.png',
  12: 'icon012_点字ブロック.png',
  13: 'icon013_表札プレート.png',
  14: 'icon014_玄関灯.png',
  15: 'icon015_郵便受け.png',
  16: 'icon016_インターホン.png',
  17: 'icon017_門柱.png',
  19: 'icon019_宅配ボックス.png',
  20: 'icon020_家のフェンス.png',
  21: 'icon021_窓の格子.png',
  22: 'icon022_雨どい.png',
  23: 'icon023_小さな物置.png',
  24: 'icon024_家の外階段.png',
  25: 'icon025_すべり台.png',
  26: 'icon026_ブランコ.png',
  27: 'icon027_ジャングルジム.png',
  28: 'icon028_シーソー.png',
  29: 'icon029_鉄棒.png',
  30: 'icon030_砂場.png',
  31: 'icon031_バネの遊具.png',
  32: 'icon032_公園の水飲み場.png',
  33: 'icon033_通学路ポール.png',
  34: 'icon034_公園のベンチ.png',
  35: 'icon035_公園の案内板.png',
  36: 'icon036_公園のごみ箱.png',
  37: 'icon037_たんぽぽ.png',
  38: 'icon038_クローバー.png',
  39: 'icon039_小さな白い花.png',
  40: 'icon040_赤い実.png',
  41: 'icon041_松ぼっくり.png',
  42: 'icon042_どんぐり.png',
  43: 'icon043_苔.png',
  44: 'icon044_木の切り株.png',
  45: 'icon045_丸い葉っぱ.png',
  46: 'icon046_細長い葉っぱ.png',
  48: 'icon048_植え込み.png',
  49: 'icon049_ブロック塀.png',
  50: 'icon050_屋外の蛇口.png',
  51: 'icon051_車止め.png',
  52: 'icon052_街のゴミ箱.png',
  53: 'icon053_木の案内札.png',
  54: 'icon054_金網フェンス.png',
  55: 'icon055_手すり.png',
  56: 'icon056_駐輪ラック.png',
  57: 'icon057_低いポール.png',
  58: 'icon058_自動販売機.png',
  59: 'icon059_灰皿スタンド.png',
  60: 'icon060_街灯.png',
  61: 'icon061_猫.png',
  62: 'icon062_犬.png',
  63: 'icon063_すずめ.png',
  64: 'icon064_ハト.png',
  65: 'icon065_カラス.png',
  66: 'icon066_ちょうちょ.png',
  67: 'icon067_てんとう虫.png',
  68: 'icon068_アリ.png',
  69: 'icon069_ダンゴムシ.png',
  70: 'icon070_カタツムリ.png',
  71: 'icon071_トカゲ.png',
  72: 'icon072_メダカ鉢.png',
  73: 'icon073_のれん.png',
  74: 'icon074_立て看板.png',
  75: 'icon075_店先の鉢植え.png',
  76: 'icon076_食品サンプル.png',
  77: 'icon077_シャッター.png',
  78: 'icon078_アーケード.png',
  79: 'icon079_ガチャガチャ.png',
  80: 'icon080_店先の箱.png',
  81: 'icon081_テイクアウト窓口.png',
  82: 'icon082_商店街の旗.png',
  83: 'icon083_レジ横の小窓.png',
  84: 'icon084_店のライト.png',
  87: 'icon087_通学路標識.png',
  88: 'icon088_学校の門.png',
  89: 'icon089_校庭フェンス.png',
  91: 'icon091_一輪車.png',
  92: 'icon092_サッカーボール.png',
  93: 'icon093_竹馬.png',
  97: 'icon097_じょうろ.png',
  98: 'icon098_ほうき.png',
  99: 'icon099_傘立て.png',
  100: 'icon100_洗濯ばさみ.png',
  102: 'icon102_室外機.png',
  105: 'icon105_園芸鉢.png',
  107: 'icon107_ホースリール.png',
  109: 'icon109_おにぎり.png',
  110: 'icon110_パン.png',
  111: 'icon111_サンドイッチ.png',
  112: 'icon112_アイスクリーム.png',
  113: 'icon113_ドーナツ.png',
  114: 'icon114_クッキー.png',
  116: 'icon116_紙パック飲料.png',
  117: 'icon117_コーヒーカップ.png',
  118: 'icon118_お弁当.png',
  119: 'icon119_たい焼き.png',
  120: 'icon120_焼きいも.png',
  121: 'icon121_パーゴラ.png',
  122: 'icon122_水飲み場.png',
  124: 'icon124_チェーン柵.png',
  125: 'icon125_石橋.png',
  126: 'icon126_階段.png',
  127: 'icon127_花壇.png',
  128: 'icon128_手押しポンプ.png',
  129: 'icon129_掲示板.png',
  130: 'icon130_案内地図.png',
  131: 'icon131_トイレマーク.png',
  132: 'icon132_段差プレート.png',
  133: 'icon133_コンクリート壁.png',
  134: 'icon134_木製アーチ.png',
  135: 'icon135_ガーデンランプ.png',
  136: 'icon136_石段.png',
  139: 'icon139_低い柵.png',
  140: 'icon140_防火水槽ふた.png',
  141: 'icon141_消火栓.png',
  142: 'icon142_バス停.png',
  143: 'icon143_タクシー乗り場.png',
  144: 'icon144_駐車場ゲート.png',
  145: 'icon145_自転車.png',
  146: 'icon146_スクーター.png',
  147: 'icon147_自動車.png',
  148: 'icon148_トラック.png',
  149: 'icon149_新幹線.png',
  150: 'icon150_飛行機.png',
  151: 'icon151_気球.png',
  152: 'icon152_船.png',
  153: 'icon153_桜.png',
  154: 'icon154_こいのぼり.png',
  155: 'icon155_ひまわり.png',
  156: 'icon156_スイカ.png',
  157: 'icon157_銀杏.png',
  158: 'icon158_木の葉の山.png',
  159: 'icon159_雪だるま.png',
  160: 'icon160_ツリー.png',
  161: 'icon161_紅葉.png',
  163: 'icon163_止まれ足型マーク.png',
  164: 'icon164_マフラー.png',
  166: 'icon166_クリスマス飾り.png',
  167: 'icon167_風鈴.png',
  168: 'icon168_うちわ.png',
  169: 'icon169_赤いボール.png',
  170: 'icon170_段ボール箱.png',
  172: 'icon172_お地蔵さん.png',
  174: 'icon174_大きな岩.png',
  175: 'icon175_渦巻きオブジェ.png',
  177: 'icon177_星プレート.png',
  178: 'icon178_顔に見える石.png',
  179: 'icon179_直線の棒.png',
  180: 'icon180_しましま板.png',
  202: 'icon202_木漏れ日.png',
  205: 'icon205_縄跳び.png',
  209: 'icon209_屋外喫煙所.png',
  210: 'icon210_自販機横のゴミ箱.png',
  211: 'icon211_壁のイラスト.png',
  212: 'icon212_銅像.png',
  213: 'icon213_枝の風船.png',
  214: 'icon214_しぼんだボール.png',
  216: 'icon216_虹反射.png',
  219: 'icon219_鳥の巣.png',
  220: 'icon220_つぼみ.png',
  222: 'icon222_抜け殻.png',
  223: 'icon223_きのこ群.png',
  224: 'icon224_ベンチ下ボール.png',
  225: 'icon225_柵のタオル.png',
  245: 'icon245_マンホール周りの円形補修.png',
  253: 'icon253_雑草が出たすき間.png',
  254: 'icon254_根で盛り上がった舗装.png',
  257: 'icon257_十字路.png',
  258: 'icon258_T字路.png',
  259: 'icon259_行き止まり.png',
  261: 'icon261_坂道.png',
  262: 'icon262_急な坂.png',
  274: 'icon274_コンクリート側溝.png',
  275: 'icon275_丸い排水穴.png',
  277: 'icon277_側溝の落ち葉詰まり.png',
  280: 'icon280_集水ますのふた.png',
  346: 'icon346_地面より高いマンホール.png',
  406: 'icon406_ひし形マーク.png',
  409: 'icon409_左折矢印.png',
  410: 'icon410_右折矢印.png',
  411: 'icon411_自転車ナビライン.png',
  414: 'icon414_スクールゾーン舗装.png',
  415: 'icon415_緑舗装.png',
  416: 'icon416_赤舗装.png',
  418: 'icon418_注意色のしましま.png',
  419: 'icon419_黄色い注意プレート.png',
  420: 'icon420_赤い注意プレート.png',
  421: 'icon421_青い案内プレート.png',
  422: 'icon422_緑の誘導表示.png',
  424: 'icon424_避難案内マーク.png',
  425: 'icon425_駐輪禁止マーク.png',
  426: 'icon426_コンビニ外観.png',
  427: 'icon427_防犯カメラ表示.png',
  428: 'icon428_工事中カラー.png',
  430: 'icon430_古いステッカー跡.png',
  432: 'icon432_半分はがれた表示.png',
  442: 'icon442_グレーチング端.png',
  461: 'icon461_傾いたポール.png',
  462: 'icon462_傾いた看板.png',
  463: 'icon463_曲がったフェンス.png',
  465: 'icon465_屋外招き猫.png',
  466: 'icon466_シーサー.png',
  467: 'icon467_ふくろう置き物.png',
  468: 'icon468_黄色い量販店.png',
  469: 'icon469_商店街フラッグキャラ.png',
  470: 'icon470_商店街バナーキャラ.png',
  471: 'icon471_店先ポップスタンドキャラ.png',
  472: 'icon472_アーケード装飾キャラ.png',
  473: 'icon473_シャッターキャラ絵.png',
  474: 'icon474_壁キャライラスト.png',
  475: 'icon475_公共掲示板キャラ.png',
  477: 'icon477_元ハローマック跡っぽい店.png',
  479: 'icon479_地域イベント掲示キャラ.png',
  480: 'icon480_地域マスコット立て看板.png',
  485: 'icon485_分別表示.png',
  486: 'icon486_ゴミ収集曜日掲示.png',
  487: 'icon487_ペットボトル回収箱.png',
  488: 'icon488_電池回収ボックス.png',
  489: 'icon489_トレー回収箱.png',
  490: 'icon490_牛乳パック回収箱.png',
  495: 'icon495_カラスよけネット.png',
  496: 'icon496_ゴミステーション.png',
  498: 'icon498_消火栓プレート.png',
  499: 'icon499_路面反射鋲.png',
  501: 'icon501_側溝コンクリ穴フタ.png',
  508: 'icon508_屋外水道蛇口.png',
  513: 'icon513_小さなパン屋.png',
  514: 'icon514_個人ケーキ屋.png',
  515: 'icon515_惣菜屋.png',
  516: 'icon516_八百屋.png',
  517: 'icon517_町の肉屋.png',
  518: 'icon518_魚屋.png',
  519: 'icon519_クリーニング店.png',
  520: 'icon520_コインランドリー.png',
  521: 'icon521_理髪店サインポール.png',
  522: 'icon522_昔ながらの美容室入口.png',
  523: 'icon523_個人薬局.png',
  524: 'icon524_文房具屋.png',
  525: 'icon525_証明写真機.png',
  526: 'icon526_冷凍餃子自販機.png',
  527: 'icon527_卵自販機.png',
  528: 'icon528_おでん缶自販機.png',
  533: 'icon533_ブロック塀の通気穴.png',
  547: 'icon547_住宅煙突.png',
  548: 'icon548_銭湯煙突.png',
  550: 'icon550_水門ハンドル.png',
  551: 'icon551_銀杏.png',
  552: 'icon552_ガードレール.png',
  553: 'icon553_スーパー.png',
  554: 'icon554_ラーメン屋.png',
  555: 'icon555_カレー屋さん.png',
  556: 'icon556_ニワトリ.png',
  557: 'icon557_バスケットゴール.png',
  558: 'icon558_ネイルショップ.png',
  559: 'icon559_軍手.png',
  560: 'icon560_手袋（冬）.png',
  561: 'icon561_のぼりの土台.png',
  562: 'icon562_トマトジュース.png',
  563: 'icon563_ココア.png',
  564: 'icon564_マウンテンデュー.png',
  565: 'icon565_ソーラーパネル.png',
  566: 'icon566_地中配電設備.png',
  567: 'icon567_インド国旗.png',
  568: 'icon568_ネパール国旗.png',
  569: 'icon569_フランス国旗.png',
  570: 'icon570_イタリア国旗.png',
  571: 'icon571_アメリカ国旗.png',
  572: 'icon572_イギリス国旗.png',
  573: 'icon573_お寺.png',
  574: 'icon574_神社.png',
  575: 'icon575_長靴.png',
  576: 'icon576_グラフィティアート.png',
  577: 'icon577_クレープ屋さん.png',
  578: 'icon578_ポスト.png',
  579: 'icon579_オブジェ.png',
  580: 'icon580_町中華.png',
  581: 'icon581_おしるこ缶（冬）.png',
  582: 'icon582_洗濯機.png',
  583: 'icon583_三角コーン.png',
  584: 'icon584_ボロボロ三角コーン.png',
  585: 'icon585_サギ.png',
  586: 'icon586_消火器.png',
  587: 'icon587_靴屋さん.png',
  588: 'icon588_サボテン.png',
  589: 'icon589_竹.png',
  590: 'icon590_駅.png',
  591: 'icon591_パチンコ.png',
  592: 'icon592_ビニールハウス.png',
  593: 'icon593_かかし.png',
  594: 'icon594_大型ビジョン.png',
  595: 'icon595_閉店セール.png',
  596: 'icon596_キッチンカー.png',
  597: 'icon597_宣伝カー.png',
  598: 'icon598_つばき（冬）.png',
  599: 'icon599_つつじ（春）.png',
  600: 'icon600_あじさい（夏）.png',
  601: 'icon601_バラ（春夏秋）.png',
  602: 'icon602_チューリップ（春）.png',
  603: 'icon603_桜（春）.png',
  604: 'icon604_ユリ（春夏秋）.png',
  605: 'icon605_コスモス（秋）.png',
  606: 'icon606_50の数字.png',
  607: 'icon607_100の数字.png',
  608: 'icon608_時計.png',
  609: 'icon609_どんぐり（秋）.png',
  610: 'icon610_スズキ（秋）.png',
  611: 'icon611_カラス.png',
  612: 'icon612_川.png',
  613: 'icon613_橋.png',
  614: 'icon614_カメ.png',
  615: 'icon615_公衆電話.png',
  616: 'icon616_クモの巣.png',
  617: 'icon617_交番.png',
  618: 'icon618_居酒屋.png',
  619: 'icon619_広葉樹.png',
  620: 'icon620_針葉樹.png',
  621: 'icon621_歯医者.png',
  622: 'icon622_傘.png',
  623: 'icon623_魚.png',
  624: 'icon624_青い建物.png',
  625: 'icon625_タクシー.png',
  626: 'icon626_消防署.png',
  627: 'icon627_学校.png',
  628: 'icon628_レンガの建物.png',
  629: 'icon629_かき氷（夏）.png',
  630: 'icon630_海.png',
  631: 'icon631_落とし物.png',
  632: 'icon632_動物の遊具.png',
  633: 'icon633_可愛い置物.png',
  634: 'icon634_車両進入禁止.png',
  635: 'icon635_自転車通行止め.png',
  636: 'icon636_転回禁止.png',
  637: 'icon637_追越禁止.png',
  638: 'icon638_駐停車禁止.png',
  639: 'icon639_駐車禁止.png',
  640: 'icon640_高さ制限.png',
  641: 'icon641_歩行者専用.png',
};

function getTopicIcon(topic) {
  if (topic.type === 'landmark') {
    return `<span class="cell-icon cell-icon-img-wrap"><img src="assets/icons/landmark/${topic.iconFile}" alt="" class="cell-icon-img"></span>`;
  }
  const iconFile = topic.id && topicIconMap[topic.id];
  if (iconFile) {
    return `<span class="cell-icon cell-icon-img-wrap"><img src="assets/icons/${iconFile}" alt="" class="cell-icon-img"></span>`;
  }
  return `<span class="cell-icon">${topic.icon}</span>`;
}

// ランドマークDB
// landmark000: 中央専用フリー枠（なんでも置ける）
const landmarkFreeEntry = {id: 'landmark000', text: 'なんでも置ける！', iconFile: 'landmark000_フリー.png', type: 'landmark', category: 'ランドマーク', isFreeSlot: true};

const landmarkDatabase = [
  {id: 'landmark001', text: '自然', iconFile: 'landmark001_自然.png', type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark002', text: '歴史的施設', iconFile: 'landmark002_歴史的施設.png', type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark003', text: '最新施設', iconFile: 'landmark003_最新施設.png', type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark004', text: '観光地', iconFile: 'landmark004_観光地.png', type: 'landmark', category: 'ランドマーク'},
];

const topicDatabase = {
  // かんたん（93個）
  easy: [
    {id: 2, text: '郵便ポスト', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 3, text: '信号機', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 4, text: '横断歩道', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 5, text: 'カーブミラー', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 6, text: '飛び出し坊や', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 7, text: 'マンホール', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 8, text: 'ガードレール', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 11, text: '道路反射板', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 12, text: '点字ブロック', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 13, text: '表札プレート', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 14, text: '玄関灯', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 15, text: '郵便受け', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 16, text: 'インターホン', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 17, text: '門柱', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 19, text: '宅配ボックス', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 20, text: '家のフェンス', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 21, text: '窓の格子', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 22, text: '雨どい', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 23, text: '小さな物置', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 24, text: '家の外階段', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 25, text: 'すべり台', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 26, text: 'ブランコ', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 27, text: 'ジャングルジム', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 28, text: 'シーソー', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 29, text: '鉄棒', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 30, text: '砂場', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 31, text: 'バネの遊具', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 32, text: '公園の水飲み場', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 33, text: '通学路ポール', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 34, text: '公園のベンチ', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 35, text: '公園の案内板', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 36, text: '公園のごみ箱', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 37, text: 'たんぽぽ', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'spring'},
    {id: 38, text: 'クローバー', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 39, text: '小さな白い花', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 40, text: '赤い実', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 41, text: '松ぼっくり', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 42, text: 'どんぐり', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'autumn'},
    {id: 43, text: '苔', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 44, text: '木の切り株', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 45, text: '丸い葉っぱ', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 46, text: '細長い葉っぱ', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 48, text: '植え込み', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 49, text: 'ブロック塀', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 50, text: '屋外の蛇口', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 51, text: '車止め', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 52, text: '街のゴミ箱', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 53, text: '木の案内札', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 54, text: '金網フェンス', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 55, text: '手すり', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 56, text: '駐輪ラック', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 57, text: '低いポール', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 58, text: '自動販売機', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 59, text: '灰皿スタンド', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 60, text: '街灯', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 61, text: '猫', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 62, text: '犬', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 63, text: 'すずめ', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 64, text: 'ハト', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
    {id: 65, text: 'カラス', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 66, text: 'ちょうちょ', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'summer'},
    {id: 67, text: 'てんとう虫', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'summer'},
    {id: 68, text: 'アリ', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 69, text: 'ダンゴムシ', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 70, text: 'カタツムリ', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'summer'},
    {id: 71, text: 'トカゲ', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 72, text: 'メダカ鉢', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 73, text: 'のれん', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 74, text: '立て看板', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 75, text: '店先の鉢植え', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 76, text: '食品サンプル', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 77, text: 'シャッター', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 78, text: 'アーケード', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 79, text: 'ガチャガチャ', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 80, text: '店先の箱', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 81, text: 'テイクアウト窓口', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 82, text: '商店街の旗', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 83, text: 'レジ横の小窓', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 84, text: '店のライト', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 87, text: '通学路標識', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 88, text: '学校の門', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 89, text: '校庭フェンス', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 91, text: '一輪車', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 92, text: 'サッカーボール', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 93, text: '竹馬', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 526, text: '冷凍餃子自販機', icon: '🔍', category: '商業・店舗', diff: 'easy', season: 'all'},
    {id: 527, text: '卵自販機', icon: '🔍', category: '商業・店舗', diff: 'easy', season: 'all'},
    {id: 528, text: 'おでん缶自販機', icon: '🔍', category: '商業・店舗', diff: 'easy', season: 'all'},
    {id: 552, text: 'ガードレール', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'easy', season: 'all'},
    {id: 578, text: 'ポスト', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 583, text: '三角コーン', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 611, text: 'カラス', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 619, text: '広葉樹', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
  ],
  // ふつう（130個）
  normal: [
    {id: 97, text: 'じょうろ', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 98, text: 'ほうき', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 99, text: '傘立て', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 100, text: '洗濯ばさみ', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 102, text: '室外機', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 105, text: '園芸鉢', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 107, text: 'ホースリール', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 109, text: 'おにぎり', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 110, text: 'パン', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 111, text: 'サンドイッチ', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 112, text: 'アイスクリーム', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 113, text: 'ドーナツ', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 114, text: 'クッキー', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 116, text: '紙パック飲料', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 117, text: 'コーヒーカップ', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 118, text: 'お弁当', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 119, text: 'たい焼き', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 120, text: '焼きいも', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'winter'},
    {id: 121, text: 'パーゴラ', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 122, text: '水飲み場', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 124, text: 'チェーン柵', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 125, text: '石橋', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 126, text: '階段', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 127, text: '花壇', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 128, text: '手押しポンプ', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 129, text: '掲示板', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 130, text: '案内地図', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 131, text: 'トイレマーク', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 132, text: '段差プレート', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 133, text: 'コンクリート壁', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 134, text: '木製アーチ', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 135, text: 'ガーデンランプ', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 136, text: '石段', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 139, text: '低い柵', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 140, text: '防火水槽ふた', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 141, text: '消火栓', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 142, text: 'バス停', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 143, text: 'タクシー乗り場', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 144, text: '駐車場ゲート', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 145, text: '自転車', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 146, text: 'スクーター', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 147, text: '自動車', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 148, text: 'トラック', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 149, text: '新幹線', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 150, text: '飛行機', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 151, text: '気球', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 152, text: '船', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 153, text: '桜', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'spring'},
    {id: 154, text: 'こいのぼり', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'spring'},
    {id: 155, text: 'ひまわり', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'summer'},
    {id: 156, text: 'スイカ', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'summer'},
    {id: 157, text: '銀杏', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'autumn'},
    {id: 158, text: '木の葉の山', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'autumn'},
    {id: 159, text: '雪だるま', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'winter'},
    {id: 160, text: 'ツリー', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'winter'},
    {id: 161, text: '紅葉', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'autumn'},
    {id: 163, text: '止まれ足型マーク', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 164, text: 'マフラー', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'winter'},
    {id: 166, text: 'クリスマス飾り', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'winter'},
    {id: 167, text: '風鈴', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'summer'},
    {id: 168, text: 'うちわ', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'summer'},
    {id: 169, text: '赤いボール', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 170, text: '段ボール箱', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 172, text: 'お地蔵さん', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 174, text: '大きな岩', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 175, text: '渦巻きオブジェ', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 177, text: '星プレート', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 178, text: '顔に見える石', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 179, text: '直線の棒', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 180, text: 'しましま板', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 274, text: 'コンクリート側溝', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 426, text: 'コンビニ外観', icon: '🔍', category: '案内・注意表示', diff: 'normal', season: 'all'},
    {id: 465, text: '屋外招き猫', icon: '🔍', category: 'キャラクター掲示物', diff: 'normal', season: 'all'},
    {id: 466, text: 'シーサー', icon: '🔍', category: 'キャラクター掲示物', diff: 'normal', season: 'all'},
    {id: 471, text: '店先ポップスタンドキャラ', icon: '🔍', category: '店舗周辺', diff: 'normal', season: 'all'},
    {id: 508, text: '屋外水道蛇口', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 513, text: '小さなパン屋', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 514, text: '個人ケーキ屋', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 515, text: '惣菜屋', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 516, text: '八百屋', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 517, text: '町の肉屋', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 518, text: '魚屋', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 519, text: 'クリーニング店', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 520, text: 'コインランドリー', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 521, text: '理髪店サインポール', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 523, text: '個人薬局', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 524, text: '文房具屋', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 553, text: 'スーパー', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 554, text: 'ラーメン屋', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 555, text: 'カレー屋さん', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 556, text: 'ニワトリ', icon: '🔍', category: 'その他観察', diff: 'normal', season: 'all'},
    {id: 559, text: '軍手', icon: '🔍', category: '痕跡・発見', diff: 'normal', season: 'all'},
    {id: 560, text: '手袋（冬）', icon: '🔍', category: '痕跡・発見', diff: 'normal', season: 'winter'},
    {id: 563, text: 'ココア', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 565, text: 'ソーラーパネル', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 575, text: '長靴', icon: '🔍', category: '痕跡・発見', diff: 'normal', season: 'all'},
    {id: 577, text: 'クレープ屋さん', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 580, text: '町中華', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 581, text: 'おしるこ缶（冬）', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'winter'},
    {id: 586, text: '消火器', icon: '🔍', category: '街インフラ', diff: 'normal', season: 'all'},
    {id: 587, text: '靴屋さん', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 589, text: '竹', icon: '🔍', category: '自然・生き物', diff: 'normal', season: 'all'},
    {id: 590, text: '駅', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 599, text: 'つつじ（春）', icon: '🔍', category: '自然・生き物', diff: 'normal', season: 'spring'},
    {id: 600, text: 'あじさい（夏）', icon: '🔍', category: '自然・生き物', diff: 'normal', season: 'summer'},
    {id: 602, text: 'チューリップ（春）', icon: '🔍', category: '自然・生き物', diff: 'normal', season: 'spring'},
    {id: 603, text: '桜（春）', icon: '🔍', category: '自然・生き物', diff: 'normal', season: 'spring'},
    {id: 605, text: 'コスモス（秋）', icon: '🔍', category: '自然・生き物', diff: 'normal', season: 'autumn'},
    {id: 606, text: '50の数字', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 608, text: '時計', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 609, text: 'どんぐり（秋）', icon: '🔍', category: '自然・生き物', diff: 'normal', season: 'autumn'},
    {id: 612, text: '川', icon: '🔍', category: '自然・生き物', diff: 'normal', season: 'all'},
    {id: 613, text: '橋', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 616, text: 'クモの巣', icon: '🔍', category: '自然・生き物', diff: 'normal', season: 'all'},
    {id: 617, text: '交番', icon: '🔍', category: '公共施設', diff: 'normal', season: 'all'},
    {id: 618, text: '居酒屋', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 620, text: '針葉樹', icon: '🔍', category: '自然・生き物', diff: 'normal', season: 'all'},
    {id: 621, text: '歯医者', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 622, text: '傘', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 625, text: 'タクシー', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 626, text: '消防署', icon: '🔍', category: '公共施設', diff: 'normal', season: 'all'},
    {id: 627, text: '学校', icon: '🔍', category: '生活・学校', diff: 'normal', season: 'all'},
    {id: 629, text: 'かき氷（夏）', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'summer'},
    {id: 635, text: '自転車通行止め', icon: '🔍', category: '街インフラ', diff: 'normal', season: 'all'},
    {id: 636, text: '転回禁止', icon: '🔍', category: '街インフラ', diff: 'normal', season: 'all'},
    {id: 637, text: '追越禁止', icon: '🔍', category: '街インフラ', diff: 'normal', season: 'all'},
    {id: 638, text: '駐停車禁止', icon: '🔍', category: '街インフラ', diff: 'normal', season: 'all'},
    {id: 639, text: '駐車禁止', icon: '🔍', category: '街インフラ', diff: 'normal', season: 'all'},
    {id: 640, text: '高さ制限', icon: '🔍', category: '街インフラ', diff: 'normal', season: 'all'},
    {id: 641, text: '歩行者専用', icon: '🔍', category: '街インフラ', diff: 'normal', season: 'all'},
  ],
  // むずかしい（86個）
  hard: [
    {id: 202, text: '木漏れ日', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 209, text: '屋外喫煙所', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 210, text: '自販機横のゴミ箱', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 211, text: '壁のイラスト', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 212, text: '銅像', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'autumn'},
    {id: 213, text: '枝の風船', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 214, text: 'しぼんだボール', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 216, text: '虹反射', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 219, text: '鳥の巣', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 220, text: 'つぼみ', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'spring'},
    {id: 222, text: '抜け殻', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'summer'},
    {id: 223, text: 'きのこ群', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'autumn'},
    {id: 224, text: 'ベンチ下ボール', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 225, text: '柵のタオル', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 245, text: 'マンホール周りの円形補修', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 253, text: '雑草が出たすき間', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 254, text: '根で盛り上がった舗装', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 257, text: '十字路', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 258, text: 'T字路', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 259, text: '行き止まり', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 261, text: '坂道', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 262, text: '急な坂', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 406, text: 'ひし形マーク', icon: '🔍', category: '道路標示・路面表示', diff: 'hard', season: 'all'},
    {id: 409, text: '左折矢印', icon: '🔍', category: '道路標示・路面表示', diff: 'hard', season: 'all'},
    {id: 410, text: '右折矢印', icon: '🔍', category: '道路標示・路面表示', diff: 'hard', season: 'all'},
    {id: 415, text: '緑舗装', icon: '🔍', category: '道路標示・路面表示', diff: 'hard', season: 'all'},
    {id: 416, text: '赤舗装', icon: '🔍', category: '道路標示・路面表示', diff: 'hard', season: 'all'},
    {id: 418, text: '注意色のしましま', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 419, text: '黄色い注意プレート', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 421, text: '青い案内プレート', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 422, text: '緑の誘導表示', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 424, text: '避難案内マーク', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 425, text: '駐輪禁止マーク', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 427, text: '防犯カメラ表示', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 428, text: '工事中カラー', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 442, text: 'グレーチング端', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'hard', season: 'all'},
    {id: 467, text: 'ふくろう置き物', icon: '🔍', category: 'キャラクター掲示物', diff: 'hard', season: 'all'},
    {id: 469, text: '商店街フラッグキャラ', icon: '🔍', category: 'キャラクター掲示物', diff: 'hard', season: 'all'},
    {id: 470, text: '商店街バナーキャラ', icon: '🔍', category: 'キャラクター掲示物', diff: 'hard', season: 'all'},
    {id: 474, text: '壁キャライラスト', icon: '🔍', category: 'キャラクター掲示物', diff: 'hard', season: 'all'},
    {id: 475, text: '公共掲示板キャラ', icon: '🔍', category: '公共施設', diff: 'hard', season: 'all'},
    {id: 479, text: '地域イベント掲示キャラ', icon: '🔍', category: '観光・地域情報', diff: 'hard', season: 'all'},
    {id: 485, text: '分別表示', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 486, text: 'ゴミ収集曜日掲示', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 487, text: 'ペットボトル回収箱', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 488, text: '電池回収ボックス', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 489, text: 'トレー回収箱', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 490, text: '牛乳パック回収箱', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 495, text: 'カラスよけネット', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 496, text: 'ゴミステーション', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 498, text: '消火栓プレート', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 499, text: '路面反射鋲', icon: '🔍', category: '道路・路面', diff: 'hard', season: 'all'},
    {id: 501, text: '側溝コンクリ穴フタ', icon: '🔍', category: '道路・路面', diff: 'hard', season: 'all'},
    {id: 522, text: '昔ながらの美容室入口', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 525, text: '証明写真機', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 533, text: 'ブロック塀の通気穴', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 547, text: '住宅煙突', icon: '🔍', category: '住宅・外構', diff: 'hard', season: 'all'},
    {id: 551, text: '銀杏', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'autumn'},
    {id: 558, text: 'ネイルショップ', icon: '🔍', category: '商業・店舗', diff: 'hard', season: 'all'},
    {id: 561, text: 'のぼりの土台', icon: '🔍', category: '商業・店舗', diff: 'hard', season: 'all'},
    {id: 562, text: 'トマトジュース', icon: '🔍', category: '家庭・食べ物', diff: 'hard', season: 'all'},
    {id: 564, text: 'マウンテンデュー', icon: '🔍', category: '家庭・食べ物', diff: 'hard', season: 'all'},
    {id: 566, text: '地中配電設備', icon: '🔍', category: '街インフラ', diff: 'hard', season: 'all'},
    {id: 573, text: 'お寺', icon: '🔍', category: '観光・地域情報', diff: 'hard', season: 'all'},
    {id: 574, text: '神社', icon: '🔍', category: '観光・地域情報', diff: 'hard', season: 'all'},
    {id: 579, text: 'オブジェ', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 582, text: '洗濯機', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 584, text: 'ボロボロ三角コーン', icon: '🔍', category: '劣化・補修・ズレ', diff: 'hard', season: 'all'},
    {id: 585, text: 'サギ', icon: '🔍', category: '自然・生き物', diff: 'hard', season: 'all'},
    {id: 588, text: 'サボテン', icon: '🔍', category: '自然・生き物', diff: 'hard', season: 'all'},
    {id: 591, text: 'パチンコ', icon: '🔍', category: '商業・店舗', diff: 'hard', season: 'all'},
    {id: 595, text: '閉店セール', icon: '🔍', category: '商業・店舗', diff: 'hard', season: 'all'},
    {id: 596, text: 'キッチンカー', icon: '🔍', category: '商業・店舗', diff: 'hard', season: 'all'},
    {id: 598, text: 'つばき（冬）', icon: '🔍', category: '自然・生き物', diff: 'hard', season: 'winter'},
    {id: 601, text: 'バラ（春夏秋）', icon: '🔍', category: '自然・生き物', diff: 'hard', season: 'all'},
    {id: 604, text: 'ユリ（春夏秋）', icon: '🔍', category: '自然・生き物', diff: 'hard', season: 'all'},
    {id: 607, text: '100の数字', icon: '🔍', category: '季節・形・数', diff: 'hard', season: 'all'},
    {id: 614, text: 'カメ', icon: '🔍', category: '自然・生き物', diff: 'hard', season: 'all'},
    {id: 623, text: '魚', icon: '🔍', category: '自然・生き物', diff: 'hard', season: 'all'},
    {id: 624, text: '青い建物', icon: '🔍', category: '住宅・外構', diff: 'hard', season: 'all'},
    {id: 628, text: 'レンガの建物', icon: '🔍', category: '住宅・外構', diff: 'hard', season: 'all'},
    {id: 630, text: '海', icon: '🔍', category: '自然・生き物', diff: 'hard', season: 'all'},
    {id: 631, text: '落とし物', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 632, text: '動物の遊具', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 633, text: '可愛い置物', icon: '🔍', category: 'キャラクター掲示物', diff: 'hard', season: 'all'},
    {id: 634, text: '車両進入禁止', icon: '🔍', category: '街インフラ', diff: 'hard', season: 'all'},
  ],
  // おに（34個）
  oni: [
    {id: 205, text: '縄跳び', icon: '🔍', category: '生活・学校', diff: 'oni', season: 'all'},
    {id: 275, text: '丸い排水穴', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 277, text: '側溝の落ち葉詰まり', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'autumn'},
    {id: 280, text: '集水ますのふた', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 346, text: '地面より高いマンホール', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 411, text: '自転車ナビライン', icon: '🔍', category: '道路標示・路面表示', diff: 'oni', season: 'all'},
    {id: 414, text: 'スクールゾーン舗装', icon: '🔍', category: '道路標示・路面表示', diff: 'oni', season: 'all'},
    {id: 420, text: '赤い注意プレート', icon: '🔍', category: '案内・注意表示', diff: 'oni', season: 'all'},
    {id: 430, text: '古いステッカー跡', icon: '🔍', category: '案内・注意表示', diff: 'oni', season: 'all'},
    {id: 432, text: '半分はがれた表示', icon: '🔍', category: '案内・注意表示', diff: 'oni', season: 'all'},
    {id: 461, text: '傾いたポール', icon: '🔍', category: '劣化・補修・ズレ', diff: 'oni', season: 'all'},
    {id: 462, text: '傾いた看板', icon: '🔍', category: '劣化・補修・ズレ', diff: 'oni', season: 'all'},
    {id: 463, text: '曲がったフェンス', icon: '🔍', category: '劣化・補修・ズレ', diff: 'oni', season: 'all'},
    {id: 468, text: '黄色い量販店', icon: '🔍', category: 'キャラクター掲示物', diff: 'oni', season: 'all'},
    {id: 472, text: 'アーケード装飾キャラ', icon: '🔍', category: 'キャラクター掲示物', diff: 'oni', season: 'all'},
    {id: 473, text: 'シャッターキャラ絵', icon: '🔍', category: 'キャラクター掲示物', diff: 'oni', season: 'all'},
    {id: 477, text: '元ハローマック跡っぽい店', icon: '🔍', category: '観光・地域情報', diff: 'oni', season: 'all'},
    {id: 480, text: '地域マスコット立て看板', icon: '🔍', category: '観光・地域情報', diff: 'oni', season: 'all'},
    {id: 548, text: '銭湯煙突', icon: '🔍', category: '住宅・外構', diff: 'oni', season: 'all'},
    {id: 550, text: '水門ハンドル', icon: '🔍', category: 'その他観察', diff: 'oni', season: 'all'},
    {id: 557, text: 'バスケットゴール', icon: '🔍', category: 'その他観察', diff: 'oni', season: 'all'},
    {id: 567, text: 'インド国旗', icon: '🔍', category: '観光・地域情報', diff: 'oni', season: 'all'},
    {id: 568, text: 'ネパール国旗', icon: '🔍', category: '観光・地域情報', diff: 'oni', season: 'all'},
    {id: 569, text: 'フランス国旗', icon: '🔍', category: '観光・地域情報', diff: 'oni', season: 'all'},
    {id: 570, text: 'イタリア国旗', icon: '🔍', category: '観光・地域情報', diff: 'oni', season: 'all'},
    {id: 571, text: 'アメリカ国旗', icon: '🔍', category: '観光・地域情報', diff: 'oni', season: 'all'},
    {id: 572, text: 'イギリス国旗', icon: '🔍', category: '観光・地域情報', diff: 'oni', season: 'all'},
    {id: 576, text: 'グラフィティアート', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 592, text: 'ビニールハウス', icon: '🔍', category: 'その他観察', diff: 'oni', season: 'all'},
    {id: 593, text: 'かかし', icon: '🔍', category: 'その他観察', diff: 'oni', season: 'all'},
    {id: 594, text: '大型ビジョン', icon: '🔍', category: '商業・店舗', diff: 'oni', season: 'all'},
    {id: 597, text: '宣伝カー', icon: '🔍', category: '街構造・乗り物', diff: 'oni', season: 'all'},
    {id: 610, text: 'スズキ（秋）', icon: '🔍', category: '自然・生き物', diff: 'oni', season: 'autumn'},
    {id: 615, text: '公衆電話', icon: '🔍', category: '生活・地域設備', diff: 'oni', season: 'all'},
  ],
};


/**
 * お題セット（将来: 有料・スポンサー拡張用。MVP では free のみ使用）
 * topicIds が空 = 通常のバランス抽選。非空 = 当該IDに限定（不足分は補完）
 */
const topicSets = [
  {
    id: 'default',
    name: 'いつものお散歩',
    description: '道ばたや公園で見つけやすい、基本のお題セットです。',
    monetizationType: 'free',
    topicIds: []
  },
  {
    id: 'park',
    name: '公園さんぽ',
    description: '公園で見つけやすいものを集めたお題セットです。',
    monetizationType: 'free',
    topicIds: [
      25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
      37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
      61, 62, 63, 64, 66, 67, 68, 69, 70, 71, 72,
      193, 194, 199, 200, 201, 202, 205, 219, 220, 221, 223
    ]
  },
  {
    id: 'family',
    name: '親子で発見',
    description: '親子で一緒に探しやすいお題セットです。',
    monetizationType: 'free',
    topicIds: [
      1, 2, 3, 4, 5, 6, 7, 25, 26, 27, 28, 29, 30, 31,
      37, 38, 39, 40, 41, 42, 61, 62, 63, 64, 66, 67, 68,
      85, 86, 87, 91, 92, 93, 109, 110, 111, 112, 113, 114,
      142, 145, 146, 147, 148, 149, 150, 165, 167
    ]
  },
  {
    id: 'shopping-street',
    name: '商店街さんぽ',
    description: 'お店や街なかで楽しめるお題セットです。',
    monetizationType: 'sponsored-ready',
    sponsorName: null,
    sponsorLogo: null,
    campaignUrl: null,
    topicIds: [
      1, 2, 3, 4, 5, 6, 7, 58, 73, 74, 75, 76, 77, 78,
      79, 80, 81, 82, 83, 84, 142, 143, 144, 145, 149,
      150, 151, 152, 153, 154
    ]
  }
];

function getTopicSetById(id) {
  return topicSets.find((s) => s.id === id) || topicSets[0];
}

function getTopicById(id) {
  for (const key of ['easy', 'normal', 'hard', 'oni']) {
    const t = topicDatabase[key].find((x) => x.id === id);
    if (t) return t;
  }
  return null;
}

// ========== 難易度設計 ==========

/**
 * ゲーム難易度ごとのお題難易度出現確率テーブル
 *
 * ゲーム難易度: easy（かんたん）/ normal（ふつう）/ hard（むずかしい）/ oni（おに）/ gachi（ガチおに）
 * お題難易度:   easy / normal / hard / oni
 *
 * 各値は確率（合計1.0）。この値がそのまま重み付きサンプリングの基準となる。
 */
const GAME_DIFFICULTY_PROBS = {
  easy:   { easy: 0.70, normal: 0.25, hard: 0.05, oni: 0.00 },
  normal: { easy: 0.30, normal: 0.50, hard: 0.15, oni: 0.05 },
  hard:   { easy: 0.10, normal: 0.30, hard: 0.45, oni: 0.15 },
  oni:    { easy: 0.05, normal: 0.25, hard: 0.30, oni: 0.40 },
  gachi:  { easy: 0.00, normal: 0.00, hard: 0.00, oni: 1.00 },
};

const GAME_DIFFICULTY_WEIGHTS = {
  easy:   { easy: 70, normal: 25, hard:  5, oni:   0 },
  normal: { easy: 30, normal: 50, hard: 15, oni:   5 },
  hard:   { easy: 10, normal: 30, hard: 50, oni:  10 },
  oni:    { easy:  5, normal: 25, hard: 30, oni:  40 },
  gacha:  { easy:  0, normal:  0, hard:  0, oni: 100 },
};

/**
 * カテゴリ別 24マス枠割り当て（合計=24）
 * ゲームごとに±1の揺らぎを加えてバリエーションを出す
 */
const CATEGORY_QUOTAS = {
  '自然・生き物': 2,      // 他カテゴリより約33%低く設定（運要素が強いため）
  '街構造・乗り物': 3,
  '街インフラ': 3,
  '生活・学校': 3,
  '家庭・食べ物': 2,
  '商業・店舗': 2,
  '季節・形・数': 1,
  '痕跡・発見': 1,
  '案内・注意表示': 1,
  '線・模様観察': 1,
  'キャラクター掲示物': 1,
  '道路標示・路面表示': 1,
  '生活・地域設備': 1,
  'その他観察': 1,
}; // 合計 = 23（残り1枠はフィラーで補完）

/**
 * ビンゴボード内の四隅インデックス（5×5: 位置0,4,20,24）
 * FREEマス(12)挿入前の24要素配列における四隅インデックス
 *   board[0]  → topics[0]
 *   board[4]  → topics[4]
 *   board[20] → topics[19]  (12より後なので-1)
 *   board[24] → topics[23]
 */
const CORNER_INDICES = [0, 4, 19, 23];

/**
 * ガチおに以外のゲーム難易度で「おに」お題が四隅に来ないよう制御する
 * おに以外（easy/normal/hard）の非コーナー位置と入れ替える
 */
function enforceCornerConstraint(topics, gameDifficulty) {
  if (gameDifficulty === 'gachi') return topics;
  const result = [...topics];
  for (const ci of CORNER_INDICES) {
    if (result[ci] && result[ci].diff === 'oni') {
      // コーナー以外でおに以外の最初の要素と交換
      for (let i = 0; i < result.length; i++) {
        if (!CORNER_INDICES.includes(i) && result[i] && result[i].diff !== 'oni') {
          [result[ci], result[i]] = [result[i], result[ci]];
          break;
        }
      }
    }
  }
  return result;
}

/**
 * ティア確率で重み付けした非復元サンプリング
 * pool の各要素は _tierWeight プロパティを持つ
 */
function weightedSample(pool, count, rng) {
  if (pool.length === 0) return [];
  if (pool.length <= count) return [...pool];

  const result = [];
  const remaining = [...pool];

  for (let i = 0; i < count; i++) {
    if (remaining.length === 0) break;
    const totalWeight = remaining.reduce((sum, t) => sum + (t._tierWeight || 1), 0);
    let r = rng() * totalWeight;
    let idx = remaining.length - 1;
    for (let j = 0; j < remaining.length; j++) {
      r -= (remaining[j]._tierWeight || 1);
      if (r <= 0) { idx = j; break; }
    }
    result.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  return result;
}

/**
 * Mulberry32 シード付き乱数ジェネレータを生成
 */
function createRng(seed) {
  let s = seed;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * ゲーム難易度確率テーブルに基づき24件のお題を返す
 *
 * アルゴリズム:
 *   1. 各ティアの出現確率をアイテム数で正規化して _tierWeight を付与
 *   2. カテゴリ別クォータでバランス選出
 *   3. 不足分を残りプールから補完
 *   4. シャッフル後に四隅制約を適用（ガチおに除く）
 */
function buildWeightedPool(gameDifficulty, allowedIds, currentSeason) {
  const weights = GAME_DIFFICULTY_WEIGHTS[gameDifficulty] || GAME_DIFFICULTY_WEIGHTS.normal;
  const tiers = ['easy', 'normal', 'hard', 'oni'];

  const allTopics = [];
  for (const tier of tiers) {
    const tierWeight = weights[tier];
    if (tierWeight === 0) continue;
    const tierTopics = topicDatabase[tier] || [];
    for (const t of tierTopics) {
      if (allowedIds && !allowedIds.has(t.id)) continue;
      if (t.season && t.season !== 'all' && t.season !== currentSeason) continue;
      allTopics.push({ ...t, _effectiveWeight: (t.weight || 1000) * tierWeight });
    }
  }

  const nonOniTopics = allTopics.filter(t => t.diff !== 'oni');
  return { allTopics, nonOniTopics };
}

function weightedSampleEffective(pool, count, rng) {
  if (pool.length === 0) return [];
  if (pool.length <= count) return [...pool];

  const result = [];
  const remaining = [...pool];

  for (let i = 0; i < count; i++) {
    if (remaining.length === 0) break;
    const totalWeight = remaining.reduce((sum, t) => sum + t._effectiveWeight, 0);
    let r = rng() * totalWeight;
    let idx = remaining.length - 1;
    for (let j = 0; j < remaining.length; j++) {
      r -= remaining[j]._effectiveWeight;
      if (r <= 0) { idx = j; break; }
    }
    result.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  return result;
}

/**
 * @param {string} gameDifficulty - 'easy'|'normal'|'hard'|'oni'|'gachi'
 * @param {string} roomCode
 * @param {string} userId
 * @param {string} shuffleSalt
 * @param {string} topicSetId
 * @returns {Array} 25件（インデックス12=フリーマス含む）のお題配列
 */
function selectTopicsForGame(
  gameDifficulty,
  roomCode = '',
  userId = '',
  shuffleSalt = '',
  topicSetId = 'default'
) {
  const probs = GAME_DIFFICULTY_PROBS[gameDifficulty] || GAME_DIFFICULTY_PROBS.normal;
  const set = getTopicSetById(topicSetId);
  const allowed = set.topicIds && set.topicIds.length > 0 ? new Set(set.topicIds) : null;
  const currentSeason = getCurrentSeason();

  const seedStr = [roomCode, userId, shuffleSalt, topicSetId !== 'default' ? topicSetId : '']
    .filter(Boolean).join('-');
  const seed = seedStr ? stringToSeed(seedStr) : (Math.random() * 0xFFFFFFFF | 0);
  const rng = createRng(seed);

  // ティアごとにアイテムをフィルタして _tierWeight（確率/件数）を付与
  const TIERS = ['easy', 'normal', 'hard', 'oni'];
  const pool = TIERS.flatMap(tier => {
    const tierProb = probs[tier] || 0;
    if (tierProb === 0) return [];
    const tierItems = (topicDatabase[tier] || [])
      .filter(t => !t.season || t.season === 'all' || t.season === currentSeason)
      .filter(t => !allowed || allowed.has(t.id));
    if (tierItems.length === 0) return [];
    const itemWeight = tierProb / tierItems.length;
    return tierItems.map(t => ({ ...t, _tierWeight: itemWeight }));
  });

  const { allTopics, nonOniTopics } = buildWeightedPool(gameDifficulty, allowed, currentSeason);

  // カテゴリ別グループ化（全プール）
  const byCategory = {};
  for (const t of pool) {
    const cat = t.category || '不明';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(t);
  }

  // カテゴリクォータ抽選（±1の揺らぎ付き）
  const selected = [];
  const usedIds = new Set();

  for (const [cat, baseQuota] of Object.entries(CATEGORY_QUOTAS)) {
    const variance = Math.floor(rng() * 3) - 1;
    const quota = Math.max(1, baseQuota + variance);
    const catPool = (byCategory[cat] || []).filter(t => !usedIds.has(t.id));
    const picked = weightedSampleEffective(catPool, quota, rng);
    for (const t of picked) {
      selected.push(t);
      usedIds.add(t.id);
    }
  }

  // 不足分をプール残りから補完（補完枠は同一カテゴリ最大2件）
  if (selected.length < 24) {
    const FILLER_CAT_MAX = 2;
    const fillerCatCounts = {};
    const filler = pool.filter(t => !usedIds.has(t.id));

    while (selected.length < 24 && filler.length > 0) {
      // カテゴリ上限未満の候補を優先。全滅なら上限なしで拾う
      const eligible = filler.filter(t => (fillerCatCounts[t.category] || 0) < FILLER_CAT_MAX);
      const candidates = eligible.length > 0 ? eligible : filler;
      const [picked] = weightedSample(candidates, 1, rng);
      if (!picked) break;
      selected.push(picked);
      usedIds.add(picked.id);
      fillerCatCounts[picked.category] = (fillerCatCounts[picked.category] || 0) + 1;
      filler.splice(filler.findIndex(t => t.id === picked.id), 1);
    }
  }

  // プール自体が不足する場合は全ティアから無条件補完
  if (selected.length < 24) {
    const allTopics = TIERS.flatMap(t => topicDatabase[t] || []);
    for (const t of allTopics) {
      if (selected.length >= 24) break;
      if (!usedIds.has(t.id)) { selected.push(t); usedIds.add(t.id); }
    }
  }

  return shuffleWithSeed(selected.slice(0, 24), seed + 1);
}

// 現在の季節を返す（3-5月:spring / 6-8月:summer / 9-11月:autumn / 12-2月:winter）
function getCurrentSeason() {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

// 文字列からシード値を生成
function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// シード付きシャッフル（決定論的・Mulberry32）
function shuffleWithSeed(array, seed) {
  const arr = [...array];
  let currentSeed = seed;
  const random = () => {
    currentSeed = (currentSeed + 0x6D2B79F5) | 0;
    let t = Math.imul(currentSeed ^ (currentSeed >>> 15), 1 | currentSeed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 通常シャッフル
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ユーザーIDを生成・取得
function getUserId() {
  let userId = localStorage.getItem('osanpo_userId');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('osanpo_userId', userId);
  }
  return userId;
}
