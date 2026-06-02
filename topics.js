// お散歩ビンゴ - お題データベース
// このファイルは tools/csv-to-topics.js で自動生成されています
// 編集する場合は topics_list.csv を更新して npm run build-topics を実行してください
// 生成日時: 2026-05-31 13:46:59（walking_bingo_master.xlsx より自動生成）

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
  14: 'icon014_玄関灯.png',
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
  109: 'icon109_おにぎり屋さん.png',
  110: 'icon110_パン屋さん.png',
  111: 'icon111_サンドイッチ屋さん.png',
  112: 'icon112_アイスクリーム屋さん.png',
  113: 'icon113_ドーナツ屋さん.png',
  114: 'icon114_クッキー屋さん.png',
  116: 'icon116_紙パック飲料.png',
  117: 'icon117_コーヒーカップ.png',
  118: 'icon118_お弁当屋さん.png',
  119: 'icon119_たい焼き屋さん.png',
  120: 'icon120_焼きいも屋さん.png',
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
  140: 'icon140_防火水槽マンホール.png',
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
  158: 'icon158_木の葉の山.png',
  159: 'icon159_雪だるま.png',
  160: 'icon160_ツリー.png',
  161: 'icon161_紅葉.png',
  163: 'icon163_止まれ足型マーク.png',
  164: 'icon164_マフラー.png',
  166: 'icon166_リース.png',
  167: 'icon167_風鈴.png',
  168: 'icon168_うちわ.png',
  169: 'icon169_赤いボール.png',
  170: 'icon170_段ボール箱.png',
  172: 'icon172_お地蔵さん.png',
  174: 'icon174_大きな岩.png',
  175: 'icon175_渦巻きオブジェ.png',
  177: 'icon177_星.png',
  178: 'icon178_顔に見える石.png',
  179: 'icon179_直線の棒.png',
  180: 'icon180_カラフル板.png',
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
  223: 'icon223_きのこ.png',
  224: 'icon224_ベンチ下ボール.png',
  225: 'icon225_柵のタオル.png',
  245: 'icon245_補修されたマンホール.png',
  253: 'icon253_強き雑草.png',
  254: 'icon254_根で盛り上がった舗装.png',
  257: 'icon257_十字路.png',
  258: 'icon258_T字路.png',
  259: 'icon259_行き止まり.png',
  261: 'icon261_坂道.png',
  262: 'icon262_急な坂.png',
  274: 'icon274_コンクリート側溝.png',
  275: 'icon275_水抜き穴.png',
  277: 'icon277_側溝の落ち葉詰まり.png',
  280: 'icon280_集水ます.png',
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
  442: 'icon442_グレーチング.png',
  461: 'icon461_傾いたポール.png',
  462: 'icon462_傾いた看板.png',
  463: 'icon463_曲がったフェンス.png',
  465: 'icon465_屋外招き猫.png',
  466: 'icon466_シーサー.png',
  467: 'icon467_ふくろう置き物.png',
  468: 'icon468_黄色い量販店.png',
  469: 'icon469_商店街のキャラ旗.png',
  470: 'icon470_商店街のバナー.png',
  471: 'icon471_店先ポップスタンド.png',
  472: 'icon472_アーケード装飾.png',
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
  528: 'icon528_おでん缶.png',
  533: 'icon533_ブロック塀の通気穴.png',
  547: 'icon547_住宅煙突.png',
  548: 'icon548_銭湯煙突.png',
  550: 'icon550_水門ハンドル.png',
  551: 'icon551_銀杏.png',
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
  578: 'icon578_珍しいポスト.png',
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
  610: 'icon610_スズキ（秋）.png',
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
  642: 'icon642_電波塔.png',
  643: 'icon643_コンテナ.png',
  644: 'icon644_タワマン.png',
  645: 'icon645_ヤシの木.png',
  646: 'icon646_ゴルフ打ちっぱなし.png',
  647: 'icon647_バッティングセンター.png',
  648: 'icon648_ドラム缶.png',
  650: 'icon650_ファミマ.png',
  651: 'icon651_ローソン.png',
  652: 'icon652_セブンイレブン.png',
  653: 'icon653_デイリーヤマザキ.png',
  654: 'icon654_重機.png',
  655: 'icon655_ショベルカー.png',
  656: 'icon656_ブルドーザー.png',
  657: 'icon657_ダンプカー.png',
  658: 'icon658_クレーン車.png',
  659: 'icon659_ミキサー車.png',
  660: 'icon660_セイコーマート.png',
  661: 'icon661_ロードローラー.png',
  662: 'icon662_捨てタイヤ.png',
  663: 'icon663_肉球.png',
  664: 'icon664_黄色いコーン.png',
  665: 'icon665_緑色のコーン.png',
  666: 'icon666_赤色のコーン.png',
  667: 'icon667_営業中の看板.png',
  668: 'icon668_〇〇ちゃんのお店.png',
  669: 'icon669_踏切.png',
  670: 'icon670_貯水タンク.png',
  671: 'icon671_首曲がりミラー.png',
  672: 'icon672_白い恋人.png',
  673: 'icon673_雪ミク.png',
  674: 'icon674_A&W.png',
  675: 'icon675_ハイビスカス.png',
  676: 'icon676_国際通り.png',
  677: 'icon677_カメ入り泡盛.png',
  678: 'icon678_泡盛.png',
  679: 'icon679_たこ焼き.png',
  680: 'icon680_かに道楽.png',
  681: 'icon681_吉本新喜劇.png',
  682: 'icon682_グリコサイン.png',
  683: 'icon683_ニッカのおじさん.png',
  684: 'icon684_ゴミ袋.png',
  685: 'icon685_自転車カバー.png',
  686: 'icon686_電柱の広告.png',
  687: 'icon687_赤い花.png',
  688: 'icon688_黄色い花.png',
  689: 'icon689_一時停止.png',
  690: 'icon690_国道番号.png',
  691: 'icon691_最高速度.png',
  692: 'icon692_横断歩道.png',
  693: 'icon693_一方通行.png',
  694: 'icon694_歩行者横断禁止.png',
  695: 'icon695_アンテナ.png',
  696: 'icon696_パラボラアンテナ.png',
  697: 'icon697_蛇の抜け殻.png',
  698: 'icon698_擁壁（ようへき）.png',
  699: 'icon699_土のう.png',
  700: 'icon700_水抜き穴.png',
  701: 'icon701_水抜き穴から草.png',
  702: 'icon702_コーンバー.png',
  703: 'icon703_ツタまみれの建物.png',
  704: 'icon704_法枠工擁壁.png',
  705: 'icon705_粗大ゴミ.png',
  706: 'icon706_給水塔.png',
  707: 'icon707_一部がない店名.png',
  708: 'icon708_どこにも繋がってない階段.png',
  709: 'icon709_ゴム製のタイヤ止め.png',
  710: 'icon710_杉玉.png',
  711: 'icon711_ソフトクリーム置物.png',
  712: 'icon712_タイル壁.png',
  713: 'icon713_工事.png',
  714: 'icon714_家の基礎.png',
  715: 'icon715_メッシュシート.png',
  716: 'icon716_中洲.png',
  717: 'icon717_根固めブロック.png',
  718: 'icon718_線路.png',
  719: 'icon719_収納式車止め.png',
  720: 'icon720_定礎.png',
  721: 'icon721_EV充電スタンド.png',
  722: 'icon722_美術館.png',
  723: 'icon723_宝くじ売り場.png',
  724: 'icon724_映画館.png',
  725: 'icon725_馬.png',
  726: 'icon726_なんでも相談所.png',
  727: 'icon727_大仏.png',
  728: 'icon728_県境.png',
  729: 'icon729_水槽.png',
  730: 'icon730_鐘.png',
  731: 'icon731_顔ハメパネル.png',
  732: 'icon732_コストコ.png',
  733: 'icon733_ミスタードーナツ.png',
  734: 'icon734_マクドナルド.png',
  735: 'icon735_ロッテリア.png',
  736: 'icon736_ポリタンク.png',
  737: 'icon737_スポーツジム.png',
  738: 'icon738_パーキングエリア.png',
  739: 'icon739_シェアサイクリング.png',
  740: 'icon740_薬局.png',
  741: 'icon741_西口（の文字）.png',
  742: 'icon742_まいばすけっと.png',
  743: 'icon743_空車OR満車.png',
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

// ランドマークDB（地域の特別スポット・準備中）
const landmarkDatabase = [
  // region_limit なし = すべての観光地で共通出現
  {id: 'landmark001', text: 'ランドマーク①', iconFile: 'landmark001_自然.png', type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark002', text: 'ランドマーク②', iconFile: 'landmark002_歴史的施設.png', type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark003', text: 'ランドマーク③', iconFile: 'landmark003_最新施設.png', type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark004', text: 'ランドマーク④', iconFile: 'landmark004_観光地.png', type: 'landmark', category: 'ランドマーク'},
  // region_limit あり = 指定地域のみで出現（例）
  // {id: 'landmark_tokyo_001', text: '東京タワー', iconFile: 'landmark_tokyo_001.png', type: 'landmark', category: 'ランドマーク', region_limit: '東京都'},
];

// 観光地エリア一覧（47都道府県 + すべて）
const landmarkRegions = [
  {id: 'all', name: 'すべての観光地'},
  {id: '北海道', name: '北海道'},
  {id: '青森県', name: '青森県'},
  {id: '岩手県', name: '岩手県'},
  {id: '宮城県', name: '宮城県'},
  {id: '秋田県', name: '秋田県'},
  {id: '山形県', name: '山形県'},
  {id: '福島県', name: '福島県'},
  {id: '茨城県', name: '茨城県'},
  {id: '栃木県', name: '栃木県'},
  {id: '群馬県', name: '群馬県'},
  {id: '埼玉県', name: '埼玉県'},
  {id: '千葉県', name: '千葉県'},
  {id: '東京都', name: '東京都'},
  {id: '神奈川県', name: '神奈川県'},
  {id: '新潟県', name: '新潟県'},
  {id: '富山県', name: '富山県'},
  {id: '石川県', name: '石川県'},
  {id: '福井県', name: '福井県'},
  {id: '山梨県', name: '山梨県'},
  {id: '長野県', name: '長野県'},
  {id: '岐阜県', name: '岐阜県'},
  {id: '静岡県', name: '静岡県'},
  {id: '愛知県', name: '愛知県'},
  {id: '三重県', name: '三重県'},
  {id: '滋賀県', name: '滋賀県'},
  {id: '京都府', name: '京都府'},
  {id: '大阪府', name: '大阪府'},
  {id: '兵庫県', name: '兵庫県'},
  {id: '奈良県', name: '奈良県'},
  {id: '和歌山県', name: '和歌山県'},
  {id: '鳥取県', name: '鳥取県'},
  {id: '島根県', name: '島根県'},
  {id: '岡山県', name: '岡山県'},
  {id: '広島県', name: '広島県'},
  {id: '山口県', name: '山口県'},
  {id: '徳島県', name: '徳島県'},
  {id: '香川県', name: '香川県'},
  {id: '愛媛県', name: '愛媛県'},
  {id: '高知県', name: '高知県'},
  {id: '福岡県', name: '福岡県'},
  {id: '佐賀県', name: '佐賀県'},
  {id: '長崎県', name: '長崎県'},
  {id: '熊本県', name: '熊本県'},
  {id: '大分県', name: '大分県'},
  {id: '宮崎県', name: '宮崎県'},
  {id: '鹿児島県', name: '鹿児島県'},
  {id: '沖縄県', name: '沖縄県'},
];

// regionId に対応するランドマーク一覧を返す
// region_limit なし（汎用）は常に含む。該当データが0件の場合は全件フォールバック
function getLandmarksByRegion(regionId) {
  if (!regionId || regionId === 'all') return landmarkDatabase;
  const filtered = landmarkDatabase.filter(lm => !lm.region_limit || lm.region_limit === regionId);
  return filtered.length > 0 ? filtered : landmarkDatabase;
}

// topicDatabase に region_limit が設定されている地域一覧を返す（ドロップダウン用）
function getAvailableRegions() {
  const seen = new Set();
  for (const tier of [1, 2, 3, 4]) {
    for (const t of topicDatabase[tier] || []) {
      if (t.region_limit) seen.add(t.region_limit);
    }
  }
  return [
    {id: 'all', name: 'すべての観光地'},
    ...Array.from(seen).sort().map(r => ({id: r, name: r})),
  ];
}

const topicDatabase = {
  // ティア1（かんたん・148個）
  1: [
    {id: 2, text: '郵便ポスト', icon: '🔍', category: '街インフラ', diff: 1, season: 'all'},
    {id: 3, text: '信号機', icon: '🔍', category: '街インフラ', diff: 1, season: 'all'},
    {id: 4, text: '横断歩道', icon: '🔍', category: '街インフラ', diff: 1, season: 'all'},
    {id: 5, text: 'カーブミラー', icon: '🔍', category: '街インフラ', diff: 1, season: 'all'},
    {id: 7, text: 'マンホール', icon: '🔍', category: '街インフラ', diff: 1, season: 'all'},
    {id: 8, text: 'ガードレール', icon: '🔍', category: '街インフラ', diff: 1, season: 'all'},
    {id: 12, text: '点字ブロック', icon: '🔍', category: '街インフラ', diff: 1, season: 'all'},
    {id: 14, text: '玄関灯', icon: '🔍', category: '街インフラ', diff: 1, season: 'all'},
    {id: 22, text: '雨どい', icon: '🔍', category: '街インフラ', diff: 1, season: 'all'},
    {id: 23, text: '小さな物置', icon: '🔍', category: '街インフラ', diff: 1, season: 'all', fields: ['residential']},
    {id: 24, text: '家の外階段', icon: '🔍', category: '街インフラ', diff: 1, season: 'all'},
    {id: 29, text: '鉄棒', icon: '🔍', category: '街インフラ', diff: 1, season: 'all', fields: ['residential']},
    {id: 31, text: 'バネの遊具', icon: '🔍', category: '街インフラ', diff: 1, season: 'all', fields: ['residential']},
    {id: 32, text: '公園の水飲み場', icon: '🔍', category: '街インフラ', diff: 1, season: 'all', fields: ['residential']},
    {id: 34, text: '公園のベンチ', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 39, text: '小さな白い花', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 44, text: '木の切り株', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 48, text: '植え込み', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 49, text: 'ブロック塀', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 51, text: '車止め', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 52, text: '街のゴミ箱', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 54, text: '金網フェンス', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 55, text: '手すり', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 56, text: '駐輪ラック', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 57, text: '低いポール', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 58, text: '自動販売機', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 60, text: '街灯', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 73, text: 'のれん', icon: '🔍', category: '生活・学校', diff: 1, season: 'all'},
    {id: 74, text: '立て看板', icon: '🔍', category: '生活・学校', diff: 1, season: 'all', fields: ['residential']},
    {id: 75, text: '店先の鉢植え', icon: '🔍', category: '生活・学校', diff: 1, season: 'all'},
    {id: 77, text: 'シャッター', icon: '🔍', category: '生活・学校', diff: 1, season: 'all'},
    {id: 81, text: 'テイクアウト窓口', icon: '🔍', category: '生活・学校', diff: 1, season: 'all'},
    {id: 84, text: '店のライト', icon: '🔍', category: '生活・学校', diff: 1, season: 'all'},
    {id: 88, text: '学校の門', icon: '🔍', category: '生活・学校', diff: 1, season: 'all'},
    {id: 89, text: '校庭フェンス', icon: '🔍', category: '生活・学校', diff: 1, season: 'all'},
    {id: 99, text: '傘立て', icon: '🔍', category: '家庭・食べ物', diff: 1, season: 'all'},
    {id: 102, text: '室外機', icon: '🔍', category: '家庭・食べ物', diff: 1, season: 'all'},
    {id: 105, text: '園芸鉢', icon: '🔍', category: '家庭・食べ物', diff: 1, season: 'all'},
    {id: 110, text: 'パン屋さん', icon: '🔍', category: '家庭・食べ物', diff: 1, season: 'all'},
    {id: 116, text: '紙パック飲料', icon: '🔍', category: '家庭・食べ物', diff: 1, season: 'all'},
    {id: 121, text: 'パーゴラ', icon: '🔍', category: '家庭・食べ物', diff: 1, season: 'all'},
    {id: 122, text: '水飲み場', icon: '🔍', category: '家庭・食べ物', diff: 1, season: 'all', fields: ['residential']},
    {id: 124, text: 'チェーン柵', icon: '🔍', category: '家庭・食べ物', diff: 1, season: 'all'},
    {id: 126, text: '階段', icon: '🔍', category: '家庭・食べ物', diff: 1, season: 'all'},
    {id: 127, text: '花壇', icon: '🔍', category: '家庭・食べ物', diff: 1, season: 'all'},
    {id: 129, text: '掲示板', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 130, text: '案内地図', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 131, text: 'トイレマーク', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 132, text: '段差プレート', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 133, text: 'コンクリート壁', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 139, text: '低い柵', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 142, text: 'バス停', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 143, text: 'タクシー乗り場', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 144, text: '駐車場ゲート', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 145, text: '自転車', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 146, text: 'スクーター', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 147, text: '自動車', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 148, text: 'トラック', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 158, text: '木の葉の山', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'autumn'},
    {id: 163, text: '止まれ足型マーク', icon: '🔍', category: '季節・形・数', diff: 1, season: 'all'},
    {id: 170, text: '段ボール箱', icon: '🔍', category: '季節・形・数', diff: 1, season: 'all'},
    {id: 210, text: '自販機横のゴミ箱', icon: '🔍', category: '痕跡・発見', diff: 1, season: 'all'},
    {id: 220, text: 'つぼみ', icon: '🔍', category: '痕跡・発見', diff: 1, season: 'spring'},
    {id: 222, text: '抜け殻', icon: '🔍', category: '痕跡・発見', diff: 1, season: 'summer'},
    {id: 245, text: '補修されたマンホール', icon: '🔍', category: '線・模様観察', diff: 1, season: 'all'},
    {id: 253, text: '強き雑草', icon: '🔍', category: '線・模様観察', diff: 1, season: 'all'},
    {id: 254, text: '根で盛り上がった舗装', icon: '🔍', category: '線・模様観察', diff: 1, season: 'all'},
    {id: 257, text: '十字路', icon: '🔍', category: '線・模様観察', diff: 1, season: 'all'},
    {id: 258, text: 'T字路', icon: '🔍', category: '線・模様観察', diff: 1, season: 'all'},
    {id: 259, text: '行き止まり', icon: '🔍', category: '線・模様観察', diff: 1, season: 'all', fields: ['residential']},
    {id: 261, text: '坂道', icon: '🔍', category: '線・模様観察', diff: 1, season: 'all', fields: ['residential']},
    {id: 262, text: '急な坂', icon: '🔍', category: '線・模様観察', diff: 1, season: 'all', fields: ['residential']},
    {id: 274, text: 'コンクリート側溝', icon: '🔍', category: '住宅・外構', diff: 1, season: 'all'},
    {id: 275, text: '水抜き穴', icon: '🔍', category: '線・模様観察', diff: 1, season: 'all'},
    {id: 277, text: '側溝の落ち葉詰まり', icon: '🔍', category: '線・模様観察', diff: 1, season: 'autumn'},
    {id: 280, text: '集水ます', icon: '🔍', category: '線・模様観察', diff: 1, season: 'all'},
    {id: 406, text: 'ひし形マーク', icon: '🔍', category: '道路標示・路面表示', diff: 1, season: 'all'},
    {id: 409, text: '左折矢印', icon: '🔍', category: '道路標示・路面表示', diff: 1, season: 'all'},
    {id: 410, text: '右折矢印', icon: '🔍', category: '道路標示・路面表示', diff: 1, season: 'all'},
    {id: 411, text: '自転車ナビライン', icon: '🔍', category: '道路標示・路面表示', diff: 1, season: 'all'},
    {id: 414, text: 'スクールゾーン舗装', icon: '🔍', category: '道路標示・路面表示', diff: 1, season: 'all'},
    {id: 418, text: '注意色のしましま', icon: '🔍', category: '案内・注意表示', diff: 1, season: 'all'},
    {id: 421, text: '青い案内プレート', icon: '🔍', category: '案内・注意表示', diff: 1, season: 'all'},
    {id: 426, text: 'コンビニ外観', icon: '🔍', category: '案内・注意表示', diff: 1, season: 'all'},
    {id: 427, text: '防犯カメラ表示', icon: '🔍', category: '案内・注意表示', diff: 1, season: 'all'},
    {id: 428, text: '工事中カラー', icon: '🔍', category: '案内・注意表示', diff: 1, season: 'all'},
    {id: 430, text: '古いステッカー跡', icon: '🔍', category: '案内・注意表示', diff: 1, season: 'all'},
    {id: 432, text: '半分はがれた表示', icon: '🔍', category: '案内・注意表示', diff: 1, season: 'all'},
    {id: 442, text: 'グレーチング', icon: '🔍', category: '舗装・縁石・路面状態', diff: 1, season: 'all'},
    {id: 469, text: '商店街のキャラ旗', icon: '🔍', category: 'キャラクター掲示物', diff: 1, season: 'all', fields: ['residential']},
    {id: 470, text: '商店街のバナー', icon: '🔍', category: 'キャラクター掲示物', diff: 1, season: 'all', fields: ['residential']},
    {id: 485, text: '分別表示', icon: '🔍', category: '生活・地域設備', diff: 1, season: 'all'},
    {id: 486, text: 'ゴミ収集曜日掲示', icon: '🔍', category: '生活・地域設備', diff: 1, season: 'all', fields: ['residential']},
    {id: 495, text: 'カラスよけネット', icon: '🔍', category: 'その他観察', diff: 1, season: 'all'},
    {id: 496, text: 'ゴミステーション', icon: '🔍', category: '生活・地域設備', diff: 1, season: 'all'},
    {id: 501, text: '側溝コンクリ穴フタ', icon: '🔍', category: '道路・路面', diff: 1, season: 'all'},
    {id: 533, text: 'ブロック塀の通気穴', icon: '🔍', category: 'その他観察', diff: 1, season: 'all', fields: ['residential']},
    {id: 553, text: 'スーパー', icon: '🔍', category: '商業・店舗', diff: 1, season: 'all'},
    {id: 576, text: 'グラフィティアート', icon: '🔍', category: '線・模様観察', diff: 1, season: 'all'},
    {id: 583, text: '三角コーン', icon: '🔍', category: '街インフラ', diff: 1, season: 'all'},
    {id: 584, text: 'ボロボロ三角コーン', icon: '🔍', category: '劣化・補修・ズレ', diff: 1, season: 'all', fields: ['residential']},
    {id: 606, text: '50の数字', icon: '🔍', category: '季節・形・数', diff: 1, season: 'all'},
    {id: 607, text: '100の数字', icon: '🔍', category: '季節・形・数', diff: 1, season: 'all'},
    {id: 608, text: '時計', icon: '🔍', category: '季節・形・数', diff: 1, season: 'all'},
    {id: 619, text: '広葉樹', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 620, text: '針葉樹', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 621, text: '歯医者', icon: '🔍', category: '商業・店舗', diff: 1, season: 'all'},
    {id: 622, text: '傘', icon: '🔍', category: '家庭・食べ物', diff: 1, season: 'all'},
    {id: 625, text: 'タクシー', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 627, text: '学校', icon: '🔍', category: '生活・学校', diff: 1, season: 'all'},
    {id: 634, text: '車両進入禁止', icon: '🔍', category: '標識', diff: 1, season: 'all'},
    {id: 635, text: '自転車通行止め', icon: '🔍', category: '標識', diff: 1, season: 'all'},
    {id: 640, text: '高さ制限', icon: '🔍', category: '標識', diff: 1, season: 'all'},
    {id: 641, text: '歩行者専用', icon: '🔍', category: '標識', diff: 1, season: 'all'},
    {id: 643, text: 'コンテナ', icon: '🔍', category: '生活・地域設備', diff: 1, season: 'all', fields: ['residential']},
    {id: 644, text: 'タワマン', icon: '🔍', category: '住宅・外構', diff: 1, season: 'all'},
    {id: 650, text: 'ファミマ', icon: '🔍', category: '商業・店舗', diff: 1, season: 'all'},
    {id: 651, text: 'ローソン', icon: '🔍', category: '商業・店舗', diff: 1, season: 'all'},
    {id: 652, text: 'セブンイレブン', icon: '🔍', category: '商業・店舗', diff: 1, season: 'all'},
    {id: 660, text: 'セイコーマート', icon: '🔍', category: '商業・店舗', diff: 1, season: 'all', fields: ['landmark'], region_limit: '北海道'},
    {id: 662, text: '捨てタイヤ', icon: '🔍', category: '劣化・補修・ズレ', diff: 1, season: 'all', fields: ['residential']},
    {id: 664, text: '黄色いコーン', icon: '🔍', category: '案内・注意表示', diff: 1, season: 'all'},
    {id: 667, text: '営業中の看板', icon: '🔍', category: '店舗周辺', diff: 1, season: 'all'},
    {id: 669, text: '踏切', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 670, text: '貯水タンク', icon: '🔍', category: '生活・地域設備', diff: 1, season: 'all'},
    {id: 672, text: '白い恋人', icon: '🔍', category: '家庭・食べ物', diff: 1, season: 'all', fields: ['landmark'], region_limit: '北海道'},
    {id: 674, text: 'A&W', icon: '🔍', category: '家庭・食べ物', diff: 1, season: 'all', fields: ['landmark'], region_limit: '沖縄'},
    {id: 675, text: 'ハイビスカス', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all', fields: ['landmark'], region_limit: '沖縄'},
    {id: 676, text: '国際通り', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all', fields: ['landmark'], region_limit: '沖縄'},
    {id: 679, text: 'たこ焼き', icon: '🔍', category: '家庭・食べ物', diff: 1, season: 'all', fields: ['landmark'], region_limit: '大阪'},
    {id: 684, text: 'ゴミ袋', icon: '🔍', category: '生活・地域設備', diff: 1, season: 'all'},
    {id: 685, text: '自転車カバー', icon: '🔍', category: '生活・地域設備', diff: 1, season: 'all'},
    {id: 686, text: '電柱の広告', icon: '🔍', category: '案内・注意表示', diff: 1, season: 'all'},
    {id: 687, text: '赤い花', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 688, text: '黄色い花', icon: '🔍', category: '自然・生き物', diff: 1, season: 'all'},
    {id: 689, text: '一時停止', icon: '🔍', category: '標識', diff: 1, season: 'all'},
    {id: 690, text: '国道番号', icon: '🔍', category: '標識', diff: 1, season: 'all'},
    {id: 691, text: '最高速度', icon: '🔍', category: '標識', diff: 1, season: 'all'},
    {id: 692, text: '横断歩道', icon: '🔍', category: '標識', diff: 1, season: 'all'},
    {id: 693, text: '一方通行', icon: '🔍', category: '標識', diff: 1, season: 'all'},
    {id: 694, text: '歩行者横断禁止', icon: '🔍', category: '標識', diff: 1, season: 'all'},
    {id: 695, text: 'アンテナ', icon: '🔍', category: '住宅・外構', diff: 1, season: 'all', fields: ['residential']},
    {id: 696, text: 'パラボラアンテナ', icon: '🔍', category: '住宅・外構', diff: 1, season: 'all', fields: ['residential']},
    {id: 698, text: '擁壁（ようへき）', icon: '🔍', category: '住宅・外構', diff: 1, season: 'all', fields: ['residential']},
    {id: 700, text: '水抜き穴', icon: '🔍', category: '住宅・外構', diff: 1, season: 'all', fields: ['residential']},
    {id: 702, text: 'コーンバー', icon: '🔍', category: '街構造・乗り物', diff: 1, season: 'all'},
    {id: 718, text: '線路', icon: '🔍', category: '生活・地域設備', diff: 1, season: 'all', fields: ['residential']},
    {id: 720, text: '定礎', icon: '🔍', category: '案内・注意表示', diff: 1, season: 'all'},
  ],
  // ティア2（ふつう・164個）
  2: [
    {id: 11, text: '道路反射板', icon: '🔍', category: '街インフラ', diff: 2, season: 'all'},
    {id: 25, text: 'すべり台', icon: '🔍', category: '街インフラ', diff: 2, season: 'all', fields: ['residential']},
    {id: 26, text: 'ブランコ', icon: '🔍', category: '街インフラ', diff: 2, season: 'all', fields: ['residential']},
    {id: 30, text: '砂場', icon: '🔍', category: '街インフラ', diff: 2, season: 'all', fields: ['residential']},
    {id: 35, text: '公園の案内板', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all'},
    {id: 37, text: 'たんぽぽ', icon: '🔍', category: '自然・生き物', diff: 2, season: 'spring'},
    {id: 38, text: 'クローバー', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all'},
    {id: 41, text: '松ぼっくり', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all'},
    {id: 42, text: 'どんぐり', icon: '🔍', category: '自然・生き物', diff: 2, season: 'autumn'},
    {id: 43, text: '苔', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all'},
    {id: 45, text: '丸い葉っぱ', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all'},
    {id: 50, text: '屋外の蛇口', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all'},
    {id: 59, text: '灰皿スタンド', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all'},
    {id: 61, text: '猫', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all'},
    {id: 62, text: '犬', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all'},
    {id: 63, text: 'すずめ', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all'},
    {id: 64, text: 'ハト', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all'},
    {id: 65, text: 'カラス', icon: '🔍', category: '生活・学校', diff: 2, season: 'all'},
    {id: 68, text: 'アリ', icon: '🔍', category: '生活・学校', diff: 2, season: 'all'},
    {id: 69, text: 'ダンゴムシ', icon: '🔍', category: '生活・学校', diff: 2, season: 'all', fields: ['residential']},
    {id: 76, text: '食品サンプル', icon: '🔍', category: '生活・学校', diff: 2, season: 'all'},
    {id: 79, text: 'ガチャガチャ', icon: '🔍', category: '生活・学校', diff: 2, season: 'all'},
    {id: 80, text: '店先の箱', icon: '🔍', category: '生活・学校', diff: 2, season: 'all'},
    {id: 82, text: '商店街の旗', icon: '🔍', category: '生活・学校', diff: 2, season: 'all'},
    {id: 87, text: '通学路標識', icon: '🔍', category: '生活・学校', diff: 2, season: 'all'},
    {id: 92, text: 'サッカーボール', icon: '🔍', category: '生活・学校', diff: 2, season: 'all'},
    {id: 97, text: 'じょうろ', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'all'},
    {id: 98, text: 'ほうき', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'all'},
    {id: 100, text: '洗濯ばさみ', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'all'},
    {id: 107, text: 'ホースリール', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'all', fields: ['residential']},
    {id: 113, text: 'ドーナツ屋さん', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'all'},
    {id: 117, text: 'コーヒーカップ', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'all'},
    {id: 118, text: 'お弁当屋さん', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'all'},
    {id: 119, text: 'たい焼き屋さん', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'all'},
    {id: 120, text: '焼きいも屋さん', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'winter'},
    {id: 135, text: 'ガーデンランプ', icon: '🔍', category: '街構造・乗り物', diff: 2, season: 'all'},
    {id: 136, text: '石段', icon: '🔍', category: '街構造・乗り物', diff: 2, season: 'all'},
    {id: 140, text: '防火水槽マンホール', icon: '🔍', category: '街構造・乗り物', diff: 2, season: 'all'},
    {id: 141, text: '消火栓', icon: '🔍', category: '街構造・乗り物', diff: 2, season: 'all'},
    {id: 153, text: '桜', icon: '🔍', category: '街構造・乗り物', diff: 2, season: 'spring'},
    {id: 154, text: 'こいのぼり', icon: '🔍', category: '街構造・乗り物', diff: 2, season: 'spring'},
    {id: 155, text: 'ひまわり', icon: '🔍', category: '街構造・乗り物', diff: 2, season: 'summer'},
    {id: 156, text: 'スイカ', icon: '🔍', category: '街構造・乗り物', diff: 2, season: 'summer'},
    {id: 159, text: '雪だるま', icon: '🔍', category: '街構造・乗り物', diff: 2, season: 'winter'},
    {id: 160, text: 'ツリー', icon: '🔍', category: '街構造・乗り物', diff: 2, season: 'winter'},
    {id: 161, text: '紅葉', icon: '🔍', category: '季節・形・数', diff: 2, season: 'autumn'},
    {id: 164, text: 'マフラー', icon: '🔍', category: '季節・形・数', diff: 2, season: 'winter'},
    {id: 166, text: 'リース', icon: '🔍', category: '季節・形・数', diff: 2, season: 'winter'},
    {id: 169, text: '赤いボール', icon: '🔍', category: '季節・形・数', diff: 2, season: 'all'},
    {id: 172, text: 'お地蔵さん', icon: '🔍', category: '季節・形・数', diff: 2, season: 'all', fields: ['residential']},
    {id: 174, text: '大きな岩', icon: '🔍', category: '季節・形・数', diff: 2, season: 'all'},
    {id: 180, text: 'カラフル板', icon: '🔍', category: '季節・形・数', diff: 2, season: 'all'},
    {id: 202, text: '木漏れ日', icon: '🔍', category: '痕跡・発見', diff: 2, season: 'all'},
    {id: 209, text: '屋外喫煙所', icon: '🔍', category: '痕跡・発見', diff: 2, season: 'all'},
    {id: 223, text: 'きのこ', icon: '🔍', category: '痕跡・発見', diff: 2, season: 'autumn', fields: ['residential']},
    {id: 419, text: '黄色い注意プレート', icon: '🔍', category: '案内・注意表示', diff: 2, season: 'all'},
    {id: 424, text: '避難案内マーク', icon: '🔍', category: '案内・注意表示', diff: 2, season: 'all'},
    {id: 425, text: '駐輪禁止マーク', icon: '🔍', category: '案内・注意表示', diff: 2, season: 'all'},
    {id: 461, text: '傾いたポール', icon: '🔍', category: '劣化・補修・ズレ', diff: 2, season: 'all'},
    {id: 462, text: '傾いた看板', icon: '🔍', category: '劣化・補修・ズレ', diff: 2, season: 'all'},
    {id: 463, text: '曲がったフェンス', icon: '🔍', category: '劣化・補修・ズレ', diff: 2, season: 'all'},
    {id: 466, text: 'シーサー', icon: '🔍', category: 'キャラクター掲示物', diff: 2, season: 'all', region_limit: '沖縄'},
    {id: 468, text: '黄色い量販店', icon: '🔍', category: 'キャラクター掲示物', diff: 2, season: 'all'},
    {id: 471, text: '店先ポップスタンド', icon: '🔍', category: '店舗周辺', diff: 2, season: 'all'},
    {id: 472, text: 'アーケード装飾', icon: '🔍', category: 'キャラクター掲示物', diff: 2, season: 'all', fields: ['residential']},
    {id: 473, text: 'シャッターキャラ絵', icon: '🔍', category: 'キャラクター掲示物', diff: 2, season: 'all', fields: ['residential']},
    {id: 474, text: '壁キャライラスト', icon: '🔍', category: 'キャラクター掲示物', diff: 2, season: 'all'},
    {id: 475, text: '公共掲示板キャラ', icon: '🔍', category: '公共施設', diff: 2, season: 'all'},
    {id: 487, text: 'ペットボトル回収箱', icon: '🔍', category: '生活・地域設備', diff: 2, season: 'all', fields: ['residential']},
    {id: 489, text: 'トレー回収箱', icon: '🔍', category: '生活・地域設備', diff: 2, season: 'all', fields: ['residential']},
    {id: 490, text: '牛乳パック回収箱', icon: '🔍', category: '生活・地域設備', diff: 2, season: 'all', fields: ['residential']},
    {id: 498, text: '消火栓プレート', icon: '🔍', category: 'その他観察', diff: 2, season: 'all'},
    {id: 499, text: '路面反射鋲', icon: '🔍', category: '道路・路面', diff: 2, season: 'all'},
    {id: 508, text: '屋外水道蛇口', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all', fields: ['residential']},
    {id: 513, text: '小さなパン屋', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all', fields: ['residential']},
    {id: 514, text: '個人ケーキ屋', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all', fields: ['residential']},
    {id: 515, text: '惣菜屋', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all', fields: ['residential']},
    {id: 516, text: '八百屋', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all', fields: ['residential']},
    {id: 517, text: '町の肉屋', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all', fields: ['residential']},
    {id: 518, text: '魚屋', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all', fields: ['residential']},
    {id: 519, text: 'クリーニング店', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all'},
    {id: 520, text: 'コインランドリー', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all'},
    {id: 521, text: '理髪店サインポール', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all'},
    {id: 522, text: '昔ながらの美容室入口', icon: '🔍', category: 'その他観察', diff: 2, season: 'all', fields: ['residential']},
    {id: 523, text: '個人薬局', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all', fields: ['residential']},
    {id: 524, text: '文房具屋', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all', fields: ['residential']},
    {id: 525, text: '証明写真機', icon: '🔍', category: 'その他観察', diff: 2, season: 'all'},
    {id: 550, text: '水門ハンドル', icon: '🔍', category: 'その他観察', diff: 2, season: 'all', fields: ['residential']},
    {id: 551, text: '銀杏', icon: '🔍', category: 'その他観察', diff: 2, season: 'autumn'},
    {id: 554, text: 'ラーメン屋', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all'},
    {id: 555, text: 'カレー屋さん', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all'},
    {id: 558, text: 'ネイルショップ', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all'},
    {id: 560, text: '手袋（冬）', icon: '🔍', category: '痕跡・発見', diff: 2, season: 'winter'},
    {id: 561, text: 'のぼりの土台', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all', fields: ['residential']},
    {id: 562, text: 'トマトジュース', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'all'},
    {id: 563, text: 'ココア', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'all'},
    {id: 564, text: 'マウンテンデュー', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'all'},
    {id: 565, text: 'ソーラーパネル', icon: '🔍', category: '住宅・外構', diff: 2, season: 'all', fields: ['residential']},
    {id: 566, text: '地中配電設備', icon: '🔍', category: '街インフラ', diff: 2, season: 'all'},
    {id: 567, text: 'インド国旗', icon: '🔍', category: '観光・地域情報', diff: 2, season: 'all'},
    {id: 568, text: 'ネパール国旗', icon: '🔍', category: '観光・地域情報', diff: 2, season: 'all'},
    {id: 573, text: 'お寺', icon: '🔍', category: '観光・地域情報', diff: 2, season: 'all'},
    {id: 574, text: '神社', icon: '🔍', category: '観光・地域情報', diff: 2, season: 'all'},
    {id: 581, text: 'おしるこ缶（冬）', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'winter'},
    {id: 585, text: 'サギ', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all', fields: ['residential']},
    {id: 586, text: '消火器', icon: '🔍', category: '街インフラ', diff: 2, season: 'all'},
    {id: 587, text: '靴屋さん', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all'},
    {id: 588, text: 'サボテン', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all'},
    {id: 589, text: '竹', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all', fields: ['residential']},
    {id: 590, text: '駅', icon: '🔍', category: '街構造・乗り物', diff: 2, season: 'all'},
    {id: 591, text: 'パチンコ', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all'},
    {id: 592, text: 'ビニールハウス', icon: '🔍', category: 'その他観察', diff: 2, season: 'all', fields: ['residential']},
    {id: 593, text: 'かかし', icon: '🔍', category: 'その他観察', diff: 2, season: 'all', fields: ['residential']},
    {id: 594, text: '大型ビジョン', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all', fields: ['office']},
    {id: 596, text: 'キッチンカー', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all', fields: ['office']},
    {id: 597, text: '宣伝カー', icon: '🔍', category: '街構造・乗り物', diff: 2, season: 'all', fields: ['office']},
    {id: 598, text: 'つばき', icon: '🔍', category: '自然・生き物', diff: 2, season: 'winter', fields: ['residential']},
    {id: 599, text: 'つつじ', icon: '🔍', category: '自然・生き物', diff: 2, season: 'spring', fields: ['residential']},
    {id: 600, text: 'あじさい', icon: '🔍', category: '自然・生き物', diff: 2, season: 'summer', fields: ['residential']},
    {id: 601, text: 'バラ', icon: '🔍', category: '自然・生き物', diff: 2, season: 'summer', fields: ['residential']},
    {id: 602, text: 'チューリップ', icon: '🔍', category: '自然・生き物', diff: 2, season: 'spring', fields: ['residential']},
    {id: 603, text: '桜', icon: '🔍', category: '自然・生き物', diff: 2, season: 'spring'},
    {id: 604, text: 'ユリ', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all', fields: ['residential']},
    {id: 605, text: 'コスモス', icon: '🔍', category: '自然・生き物', diff: 2, season: 'autumn', fields: ['residential']},
    {id: 610, text: 'スズキ', icon: '🔍', category: '自然・生き物', diff: 2, season: 'autumn', fields: ['residential']},
    {id: 612, text: '川', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all', fields: ['residential']},
    {id: 613, text: '橋', icon: '🔍', category: '街構造・乗り物', diff: 2, season: 'all', fields: ['residential']},
    {id: 615, text: '公衆電話', icon: '🔍', category: '生活・地域設備', diff: 2, season: 'all'},
    {id: 617, text: '交番', icon: '🔍', category: '公共施設', diff: 2, season: 'all'},
    {id: 618, text: '居酒屋', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all'},
    {id: 623, text: '魚', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all', fields: ['residential']},
    {id: 624, text: '青い建物', icon: '🔍', category: '住宅・外構', diff: 2, season: 'all'},
    {id: 626, text: '消防署', icon: '🔍', category: '公共施設', diff: 2, season: 'all'},
    {id: 628, text: 'レンガの建物', icon: '🔍', category: '住宅・外構', diff: 2, season: 'all'},
    {id: 629, text: 'かき氷（夏）', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'summer'},
    {id: 632, text: '動物の遊具', icon: '🔍', category: '生活・地域設備', diff: 2, season: 'all'},
    {id: 633, text: '可愛い置物', icon: '🔍', category: 'キャラクター掲示物', diff: 2, season: 'all'},
    {id: 636, text: '転回禁止', icon: '🔍', category: '標識', diff: 2, season: 'all'},
    {id: 637, text: '追越禁止', icon: '🔍', category: '標識', diff: 2, season: 'all'},
    {id: 638, text: '駐停車禁止', icon: '🔍', category: '標識', diff: 2, season: 'all'},
    {id: 639, text: '駐車禁止', icon: '🔍', category: '標識', diff: 2, season: 'all'},
    {id: 642, text: '電波塔', icon: '🔍', category: '街インフラ', diff: 2, season: 'all'},
    {id: 645, text: 'ヤシの木', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all'},
    {id: 646, text: 'ゴルフ打ちっぱなし', icon: '🔍', category: '生活・地域設備', diff: 2, season: 'all', fields: ['residential']},
    {id: 648, text: 'ドラム缶', icon: '🔍', category: '生活・地域設備', diff: 2, season: 'all'},
    {id: 663, text: '肉球', icon: '🔍', category: '自然・生き物', diff: 2, season: 'all'},
    {id: 665, text: '緑色のコーン', icon: '🔍', category: '案内・注意表示', diff: 2, season: 'all'},
    {id: 666, text: '赤色のコーン', icon: '🔍', category: '案内・注意表示', diff: 2, season: 'all'},
    {id: 671, text: '首曲がりミラー', icon: '🔍', category: '街インフラ', diff: 2, season: 'all'},
    {id: 677, text: 'カメ入り泡盛', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'all', fields: ['landmark'], region_limit: '沖縄'},
    {id: 678, text: '泡盛', icon: '🔍', category: '家庭・食べ物', diff: 2, season: 'all', fields: ['landmark'], region_limit: '沖縄'},
    {id: 680, text: 'かに道楽', icon: '🔍', category: '街構造・乗り物', diff: 2, season: 'all', fields: ['landmark'], region_limit: '大阪'},
    {id: 681, text: '吉本新喜劇', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all', fields: ['landmark'], region_limit: '大阪'},
    {id: 682, text: 'グリコサイン', icon: '🔍', category: '街インフラ', diff: 2, season: 'all', fields: ['landmark'], region_limit: '大阪'},
    {id: 683, text: 'ニッカのおじさん', icon: '🔍', category: '街インフラ', diff: 2, season: 'all', fields: ['landmark'], region_limit: '北海道'},
    {id: 699, text: '土のう', icon: '🔍', category: '住宅・外構', diff: 2, season: 'all', fields: ['residential']},
    {id: 705, text: '粗大ゴミ', icon: '🔍', category: '住宅・外構', diff: 2, season: 'all', fields: ['residential']},
    {id: 713, text: '工事', icon: '🔍', category: '生活・地域設備', diff: 2, season: 'all'},
    {id: 715, text: 'メッシュシート', icon: '🔍', category: '生活・地域設備', diff: 2, season: 'all'},
    {id: 716, text: '中洲', icon: '🔍', category: '生活・地域設備', diff: 2, season: 'all', fields: ['residential']},
    {id: 733, text: 'ミスタードーナツ', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all'},
    {id: 734, text: 'マクドナルド', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all'},
    {id: 735, text: 'ロッテリア', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all'},
    {id: 742, text: 'まいばすけっと', icon: '🔍', category: '商業・店舗', diff: 2, season: 'all'},
  ],
  // ティア3（むずかしい・88個）
  3: [
    {id: 6, text: '飛び出し坊や', icon: '🔍', category: '街インフラ', diff: 3, season: 'all', fields: ['residential']},
    {id: 27, text: 'ジャングルジム', icon: '🔍', category: '街インフラ', diff: 3, season: 'all', fields: ['residential']},
    {id: 28, text: 'シーソー', icon: '🔍', category: '街インフラ', diff: 3, season: 'all', fields: ['residential']},
    {id: 33, text: '通学路ポール', icon: '🔍', category: '自然・生き物', diff: 3, season: 'all'},
    {id: 40, text: '赤い実', icon: '🔍', category: '自然・生き物', diff: 3, season: 'all'},
    {id: 46, text: '細長い葉っぱ', icon: '🔍', category: '自然・生き物', diff: 3, season: 'all'},
    {id: 53, text: '木の案内札', icon: '🔍', category: '自然・生き物', diff: 3, season: 'all'},
    {id: 66, text: 'ちょうちょ', icon: '🔍', category: '生活・学校', diff: 3, season: 'summer', fields: ['residential']},
    {id: 67, text: 'てんとう虫', icon: '🔍', category: '生活・学校', diff: 3, season: 'summer', fields: ['residential']},
    {id: 70, text: 'カタツムリ', icon: '🔍', category: '生活・学校', diff: 3, season: 'summer', fields: ['residential']},
    {id: 78, text: 'アーケード', icon: '🔍', category: '生活・学校', diff: 3, season: 'all'},
    {id: 83, text: 'レジ横の小窓', icon: '🔍', category: '生活・学校', diff: 3, season: 'all'},
    {id: 91, text: '一輪車', icon: '🔍', category: '生活・学校', diff: 3, season: 'all', fields: ['residential']},
    {id: 93, text: '竹馬', icon: '🔍', category: '生活・学校', diff: 3, season: 'all', fields: ['residential']},
    {id: 109, text: 'おにぎり屋さん', icon: '🔍', category: '家庭・食べ物', diff: 3, season: 'all'},
    {id: 112, text: 'アイスクリーム屋さん', icon: '🔍', category: '家庭・食べ物', diff: 3, season: 'all'},
    {id: 114, text: 'クッキー屋さん', icon: '🔍', category: '家庭・食べ物', diff: 3, season: 'all'},
    {id: 125, text: '石橋', icon: '🔍', category: '家庭・食べ物', diff: 3, season: 'all'},
    {id: 128, text: '手押しポンプ', icon: '🔍', category: '家庭・食べ物', diff: 3, season: 'all', fields: ['residential']},
    {id: 134, text: '木製アーチ', icon: '🔍', category: '街構造・乗り物', diff: 3, season: 'all'},
    {id: 149, text: '新幹線', icon: '🔍', category: '街構造・乗り物', diff: 3, season: 'all'},
    {id: 150, text: '飛行機', icon: '🔍', category: '街構造・乗り物', diff: 3, season: 'all'},
    {id: 152, text: '船', icon: '🔍', category: '街構造・乗り物', diff: 3, season: 'all'},
    {id: 167, text: '風鈴', icon: '🔍', category: '季節・形・数', diff: 3, season: 'summer'},
    {id: 168, text: 'うちわ', icon: '🔍', category: '季節・形・数', diff: 3, season: 'summer'},
    {id: 179, text: '直線の棒', icon: '🔍', category: '季節・形・数', diff: 3, season: 'all'},
    {id: 205, text: '縄跳び', icon: '🔍', category: '生活・学校', diff: 3, season: 'all'},
    {id: 211, text: '壁のイラスト', icon: '🔍', category: '痕跡・発見', diff: 3, season: 'all'},
    {id: 212, text: '銅像', icon: '🔍', category: '痕跡・発見', diff: 3, season: 'all'},
    {id: 214, text: 'しぼんだボール', icon: '🔍', category: '痕跡・発見', diff: 3, season: 'all', fields: ['residential']},
    {id: 216, text: '虹反射', icon: '🔍', category: '痕跡・発見', diff: 3, season: 'all'},
    {id: 219, text: '鳥の巣', icon: '🔍', category: '痕跡・発見', diff: 3, season: 'all'},
    {id: 224, text: 'ベンチ下ボール', icon: '🔍', category: '痕跡・発見', diff: 3, season: 'all'},
    {id: 225, text: '柵のタオル', icon: '🔍', category: '痕跡・発見', diff: 3, season: 'all'},
    {id: 346, text: '地面より高いマンホール', icon: '🔍', category: '面・高さ観察', diff: 3, season: 'all'},
    {id: 415, text: '緑舗装', icon: '🔍', category: '道路標示・路面表示', diff: 3, season: 'all'},
    {id: 416, text: '赤舗装', icon: '🔍', category: '道路標示・路面表示', diff: 3, season: 'all'},
    {id: 420, text: '赤い注意プレート', icon: '🔍', category: '案内・注意表示', diff: 3, season: 'all'},
    {id: 422, text: '緑の誘導表示', icon: '🔍', category: '案内・注意表示', diff: 3, season: 'all'},
    {id: 465, text: '屋外招き猫', icon: '🔍', category: 'キャラクター掲示物', diff: 3, season: 'all'},
    {id: 467, text: 'ふくろう置き物', icon: '🔍', category: 'キャラクター掲示物', diff: 3, season: 'all'},
    {id: 479, text: '地域イベント掲示キャラ', icon: '🔍', category: '観光・地域情報', diff: 3, season: 'all'},
    {id: 480, text: '地域マスコット立て看板', icon: '🔍', category: '観光・地域情報', diff: 3, season: 'all'},
    {id: 488, text: '電池回収ボックス', icon: '🔍', category: '生活・地域設備', diff: 3, season: 'all', fields: ['residential']},
    {id: 526, text: '冷凍餃子自販機', icon: '🔍', category: '商業・店舗', diff: 3, season: 'all', fields: ['residential']},
    {id: 547, text: '住宅煙突', icon: '🔍', category: '住宅・外構', diff: 3, season: 'all', fields: ['residential']},
    {id: 548, text: '銭湯煙突', icon: '🔍', category: '住宅・外構', diff: 3, season: 'all', fields: ['residential']},
    {id: 556, text: 'ニワトリ', icon: '🔍', category: 'その他観察', diff: 3, season: 'all', fields: ['residential']},
    {id: 557, text: 'バスケットゴール', icon: '🔍', category: 'その他観察', diff: 3, season: 'all', fields: ['residential']},
    {id: 559, text: '軍手', icon: '🔍', category: '痕跡・発見', diff: 3, season: 'all', fields: ['residential']},
    {id: 569, text: 'フランス国旗', icon: '🔍', category: '観光・地域情報', diff: 3, season: 'all'},
    {id: 570, text: 'イタリア国旗', icon: '🔍', category: '観光・地域情報', diff: 3, season: 'all'},
    {id: 571, text: 'アメリカ国旗', icon: '🔍', category: '観光・地域情報', diff: 3, season: 'all'},
    {id: 572, text: 'イギリス国旗', icon: '🔍', category: '観光・地域情報', diff: 3, season: 'all'},
    {id: 575, text: '長靴', icon: '🔍', category: '痕跡・発見', diff: 3, season: 'all'},
    {id: 577, text: 'クレープ屋さん', icon: '🔍', category: '商業・店舗', diff: 3, season: 'all'},
    {id: 578, text: '珍しいポスト', icon: '🔍', category: '街インフラ', diff: 3, season: 'all'},
    {id: 579, text: 'オブジェ', icon: '🔍', category: 'その他観察', diff: 3, season: 'all'},
    {id: 580, text: '町中華', icon: '🔍', category: '商業・店舗', diff: 3, season: 'all'},
    {id: 582, text: '洗濯機', icon: '🔍', category: '生活・地域設備', diff: 3, season: 'all', fields: ['residential']},
    {id: 595, text: '閉店セール', icon: '🔍', category: '商業・店舗', diff: 3, season: 'all'},
    {id: 614, text: 'カメ', icon: '🔍', category: '自然・生き物', diff: 3, season: 'all'},
    {id: 616, text: 'クモの巣', icon: '🔍', category: '自然・生き物', diff: 3, season: 'all', fields: ['residential']},
    {id: 631, text: '落とし物', icon: '🔍', category: '痕跡・発見', diff: 3, season: 'all'},
    {id: 647, text: 'バッティングセンター', icon: '🔍', category: '商業・店舗', diff: 3, season: 'all', fields: ['residential']},
    {id: 653, text: 'デイリーヤマザキ', icon: '🔍', category: '商業・店舗', diff: 3, season: 'all'},
    {id: 654, text: '重機', icon: '🔍', category: '街構造・乗り物', diff: 3, season: 'all'},
    {id: 658, text: 'クレーン車', icon: '🔍', category: '街構造・乗り物', diff: 3, season: 'all'},
    {id: 659, text: 'ミキサー車', icon: '🔍', category: '街構造・乗り物', diff: 3, season: 'all'},
    {id: 668, text: '〇〇ちゃんのお店', icon: '🔍', category: '商業・店舗', diff: 3, season: 'all'},
    {id: 673, text: '雪ミク', icon: '🔍', category: 'キャラクター掲示物', diff: 3, season: 'all', fields: ['landmark'], region_limit: '北海道'},
    {id: 701, text: '水抜き穴から草', icon: '🔍', category: '住宅・外構', diff: 3, season: 'all', fields: ['residential']},
    {id: 703, text: 'ツタまみれの建物', icon: '🔍', category: '住宅・外構', diff: 3, season: 'all', fields: ['residential']},
    {id: 704, text: '法枠工擁壁', icon: '🔍', category: '街構造・乗り物', diff: 3, season: 'all', fields: ['residential']},
    {id: 706, text: '給水塔', icon: '🔍', category: '生活・地域設備', diff: 3, season: 'all', fields: ['residential']},
    {id: 709, text: 'ゴム製のタイヤ止め', icon: '🔍', category: '生活・地域設備', diff: 3, season: 'all'},
    {id: 711, text: 'ソフトクリーム置物', icon: '🔍', category: '商業・店舗', diff: 3, season: 'all'},
    {id: 712, text: 'タイル壁', icon: '🔍', category: '住宅・外構', diff: 3, season: 'all'},
    {id: 717, text: '根固めブロック', icon: '🔍', category: '生活・地域設備', diff: 3, season: 'all', fields: ['residential']},
    {id: 721, text: 'EV充電スタンド', icon: '🔍', category: '街構造・乗り物', diff: 3, season: 'all'},
    {id: 723, text: '宝くじ売り場', icon: '🔍', category: '商業・店舗', diff: 3, season: 'all'},
    {id: 729, text: '水槽', icon: '🔍', category: '生活・地域設備', diff: 3, season: 'all', fields: ['residential']},
    {id: 730, text: '鐘', icon: '🔍', category: '観光・地域情報', diff: 3, season: 'all', fields: ['landmark']},
    {id: 731, text: '顔ハメパネル', icon: '🔍', category: '観光・地域情報', diff: 3, season: 'all', fields: ['landmark']},
    {id: 737, text: 'スポーツジム', icon: '🔍', category: '商業・店舗', diff: 3, season: 'all'},
    {id: 738, text: 'パーキングエリア', icon: '🔍', category: '商業・店舗', diff: 3, season: 'all'},
    {id: 739, text: 'シェアサイクリング', icon: '🔍', category: '商業・店舗', diff: 3, season: 'all'},
    {id: 740, text: '薬局', icon: '🔍', category: '商業・店舗', diff: 3, season: 'all'},
  ],
  // ティア4（おに・33個）
  4: [
    {id: 36, text: '公園のごみ箱', icon: '🔍', category: '自然・生き物', diff: 4, season: 'all'},
    {id: 71, text: 'トカゲ', icon: '🔍', category: '生活・学校', diff: 4, season: 'all', fields: ['residential']},
    {id: 72, text: 'メダカ鉢', icon: '🔍', category: '生活・学校', diff: 4, season: 'all', fields: ['residential']},
    {id: 111, text: 'サンドイッチ屋さん', icon: '🔍', category: '家庭・食べ物', diff: 4, season: 'all'},
    {id: 151, text: '気球', icon: '🔍', category: '街構造・乗り物', diff: 4, season: 'all'},
    {id: 175, text: '渦巻きオブジェ', icon: '🔍', category: '季節・形・数', diff: 4, season: 'all'},
    {id: 177, text: '星', icon: '🔍', category: '季節・形・数', diff: 4, season: 'all'},
    {id: 178, text: '顔に見える石', icon: '🔍', category: '季節・形・数', diff: 4, season: 'all'},
    {id: 213, text: '枝の風船', icon: '🔍', category: '痕跡・発見', diff: 4, season: 'all', fields: ['residential']},
    {id: 477, text: '元ハローマック跡っぽい店', icon: '🔍', category: '観光・地域情報', diff: 4, season: 'all', fields: ['residential']},
    {id: 527, text: '卵自販機', icon: '🔍', category: '商業・店舗', diff: 4, season: 'all', fields: ['residential']},
    {id: 528, text: 'おでん缶', icon: '🔍', category: '商業・店舗', diff: 4, season: 'all'},
    {id: 630, text: '海', icon: '🔍', category: '自然・生き物', diff: 4, season: 'all', fields: ['residential']},
    {id: 655, text: 'ショベルカー', icon: '🔍', category: '街構造・乗り物', diff: 4, season: 'all'},
    {id: 656, text: 'ブルドーザー', icon: '🔍', category: '街構造・乗り物', diff: 4, season: 'all'},
    {id: 657, text: 'ダンプカー', icon: '🔍', category: '街構造・乗り物', diff: 4, season: 'all'},
    {id: 661, text: 'ロードローラー', icon: '🔍', category: '街構造・乗り物', diff: 4, season: 'all'},
    {id: 697, text: '蛇の抜け殻', icon: '🔍', category: '自然・生き物', diff: 4, season: 'all', fields: ['residential']},
    {id: 707, text: '一部がない店名', icon: '🔍', category: '商業・店舗', diff: 4, season: 'all'},
    {id: 708, text: 'どこにも繋がってない階段', icon: '🔍', category: '生活・地域設備', diff: 4, season: 'all'},
    {id: 710, text: '杉玉', icon: '🔍', category: '商業・店舗', diff: 4, season: 'all'},
    {id: 714, text: '家の基礎', icon: '🔍', category: '生活・地域設備', diff: 4, season: 'all', fields: ['residential']},
    {id: 719, text: '収納式車止め', icon: '🔍', category: '生活・地域設備', diff: 4, season: 'all'},
    {id: 722, text: '美術館', icon: '🔍', category: '商業・店舗', diff: 4, season: 'all'},
    {id: 724, text: '映画館', icon: '🔍', category: '商業・店舗', diff: 4, season: 'all'},
    {id: 725, text: '馬', icon: '🔍', category: '自然・生き物', diff: 4, season: 'all'},
    {id: 726, text: 'なんでも相談所', icon: '🔍', category: '商業・店舗', diff: 4, season: 'all', fields: ['residential']},
    {id: 727, text: '大仏', icon: '🔍', category: '観光・地域情報', diff: 4, season: 'all', fields: ['landmark']},
    {id: 728, text: '県境', icon: '🔍', category: '観光・地域情報', diff: 4, season: 'all', fields: ['landmark']},
    {id: 732, text: 'コストコ', icon: '🔍', category: '商業・店舗', diff: 4, season: 'all'},
    {id: 736, text: 'ポリタンク', icon: '🔍', category: '商業・店舗', diff: 4, season: 'all'},
    {id: 741, text: '西口（の文字）', icon: '🔍', category: '生活・地域設備', diff: 4, season: 'all'},
    {id: 743, text: '空車OR満車', icon: '🔍', category: '生活・地域設備', diff: 4, season: 'all'},
  ],
};


/**
 * お題セット（将来: 有料・スポンサー拡張用。MVP では free のみ使用）
 * topicIds が空 = 通常のバランス抽選。非空 = 当該IDに限定（不足分は補完）
 */
const topicSets = [
  {
    id: 'default',
    name: 'すべて',
    description: 'すべてのフィールドのお題から出題します。',
    monetizationType: 'free',
    topicIds: []
  },
  {
    id: '商店街',
    name: '商店街',
    description: '商店街や繁華街で見つけやすいお題です。',
    monetizationType: 'free',
    topicIds: []
  },
  {
    id: 'オフィス街',
    name: 'オフィス街',
    description: 'オフィス街や都市部で見つけやすいお題です。',
    monetizationType: 'free',
    topicIds: []
  }
];
function getTopicSetById(id) {
  return topicSets.find((s) => s.id === id) || topicSets[0];
}

function getTopicById(id) {
  for (const key of [1, 2, 3, 4]) {
    const t = topicDatabase[key].find((x) => x.id === id);
    if (t) return t;
  }
  return null;
}

// ========== 難易度設計 ==========

/**
 * ゲーム難易度ごとのお題ティア出現確率テーブル
 *
 * ゲーム難易度（5段階）: easy（かんたん）/ normal（ふつう）/ hard（むずかしい）/ oni（おに）/ gachi（ガチおに）
 * お題ティア（1〜4）:   1（かんたん）/ 2（ふつう）/ 3（むずかしい）/ 4（おに）
 *
 * 各値は確率（合計1.0）。この値がそのまま重み付きサンプリングの基準となる。
 * ガチおには全マスがティア4から選出される。
 */
const GAME_DIFFICULTY_PROBS = {
  easy:   { 1: 1.00, 2: 0.00, 3: 0.00, 4: 0.00 },
  normal: { 1: 0.30, 2: 0.50, 3: 0.15, 4: 0.05 },
  hard:   { 1: 0.05, 2: 0.30, 3: 0.50, 4: 0.15 },
  oni:    { 1: 0.05, 2: 0.25, 3: 0.30, 4: 0.40 },
  gachi:  { 1: 0.00, 2: 0.00, 3: 0.00, 4: 1.00 },
};

/**
 * カテゴリ別 24マス枠割り当て（合計=24）
 * ゲームごとに±1の揺らぎを加えてバリエーションを出す
 */
const CATEGORY_QUOTAS = {
  '自然・生き物': 3,
  '街構造・乗り物': 3,
  '街インフラ': 3,
  '生活・学校': 3,
  '家庭・食べ物': 2,
  '商業・店舗': 2,
  '季節・形・数': 1,
  '痕跡・発見': 1,
  '案内・注意表示': 1,
  '標識': 1,
  '生活・地域設備': 1,
  'キャラクター掲示物': 1,
  '線・模様観察': 1,
  '道路標示・路面表示': 1,
}; // 合計 = 24（その他観察・住宅外構等はフィラー枠で補完）

// 四隅のボードインデックス（5×5ビンゴ）
const CORNER_INDICES = [0, 4, 20, 24];

/**
 * ガチおに以外のゲーム難易度でティア4（おに）お題が四隅に来ないよう制御する
 * ティア4以外の非コーナー位置と入れ替える
 */
function enforceCornerConstraint(topics, gameDifficulty) {
  if (gameDifficulty === 'gachi') return topics;
  const result = [...topics];
  for (const ci of CORNER_INDICES) {
    if (result[ci] && result[ci].diff === 4) {
      // コーナー以外でティア4以外の最初の要素と交換
      for (let i = 0; i < result.length; i++) {
        if (!CORNER_INDICES.includes(i) && result[i] && result[i].diff !== 4) {
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

function weightedSampleEffective(pool, count, rng) {
  if (pool.length === 0) return [];
  if (pool.length <= count) return [...pool];
  const result = [];
  const remaining = [...pool];
  for (let i = 0; i < count; i++) {
    if (remaining.length === 0) break;
    const totalWeight = remaining.reduce((sum, t) => sum + (t._tierWeight || t._effectiveWeight || 1), 0);
    let r = rng() * totalWeight;
    let idx = remaining.length - 1;
    for (let j = 0; j < remaining.length; j++) {
      r -= (remaining[j]._tierWeight || remaining[j]._effectiveWeight || 1);
      if (r <= 0) { idx = j; break; }
    }
    result.push(remaining[idx]);
    remaining.splice(idx, 1);
  }
  return result;
}

/**
 * ゲーム難易度確率テーブルに基づき24件のお題を返す
 *
 * アルゴリズム:
 *   1. 各ティアの出現確率をアイテム数で正規化して _tierWeight を付与
 *   2. カテゴリ別クォータでバランス選出
 *   3. 不足分を残りプールから補完
 *   4. シャッフル後に四隅制約を適用（ガチおに除く）
 *
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
  topicSetId = 'default',
  fieldId = 'default',
  regionId = 'all'
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
  const TIERS = [1, 2, 3, 4];
  const pool = TIERS.flatMap(tier => {
    const tierProb = probs[tier] || 0;
    if (tierProb === 0) return [];
    const tierItems = (topicDatabase[tier] || [])
      .filter(t => !t.season || t.season === 'all' || t.season === currentSeason)
      .filter(t => {
        // topicIds 指定がある場合はそれで絞り込み
        if (allowed && !allowed.has(t.id)) return false;
        // フィールドフィルタ（fields: ['all'] はすべてのフィールドで出現）
        if (fieldId && fieldId !== 'default') {
          const topicFields = t.fields || ['all'];
          if (!topicFields.includes('all') && !topicFields.includes(fieldId)) return false;
        }
        // 地域フィルタ: region_limit 付きアイテムは地域が明示指定されかつ一致する場合のみ出現
        // 通常モード・観光地allどちらも region_limit なしの中から抽選
        if (t.region_limit) {
          if (!regionId || regionId === 'all') return false;          // 地域未指定なら除外
          if (t.region_limit !== regionId) return false;              // 地域不一致なら除外
        }
        return true;
      });
    if (tierItems.length === 0) return [];
    const itemWeight = tierProb / tierItems.length;
    return tierItems.map(t => ({ ...t, _tierWeight: itemWeight }));
  });

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
