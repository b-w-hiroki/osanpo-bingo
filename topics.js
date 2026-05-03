// お散歩ビンゴ - お題データベース
// このファイルは tools/csv-to-topics.js で自動生成されています
// 編集する場合は topics_list.csv を更新して npm run build-topics を実行してください
// 生成日時: 2026-05-03 08:31:02

// お題ID → アイコン画像ファイル名（なければ絵文字フォールバック）
const topicIconMap = {
  1: 'icon001_電柱.png',
  2: 'icon002_郵便ポスト.png',
  3: 'icon003_信号機.png',
  4: 'icon004_横断歩道.png',
  5: 'icon005_カーブミラー.png',
  6: 'icon006_飛び出し坊や.png',
  7: 'icon007_マンホール.png',
  8: 'icon008_ガードレール.png',
  9: 'icon009_道路の白線.png',
  10: 'icon010_排水口.png',
  11: 'icon011_道路反射板.png',
  12: 'icon012_点字ブロック.png',
  13: 'icon013_表札プレート.png',
  14: 'icon014_玄関灯.png',
  15: 'icon015_郵便受け.png',
  16: 'icon016_インターホン.png',
  17: 'icon017_門柱.png',
  18: 'icon018_玄関マット.png',
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
  33: 'icon033_通学路ポール.png',
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
  47: 'icon047_草むら.png',
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
  85: 'icon085_ランドセル.png',
  86: 'icon086_黄色い帽子.png',
  87: 'icon087_通学路標識.png',
  88: 'icon088_学校の門.png',
  89: 'icon089_校庭フェンス.png',
  90: 'icon090_体育倉庫.png',
  91: 'icon091_一輪車.png',
  92: 'icon092_サッカーボール.png',
  93: 'icon093_竹馬.png',
  94: 'icon094_チョーク.png',
  95: 'icon095_黒板消し.png',
  96: 'icon096_上履き袋.png',
  97: 'icon097_じょうろ.png',
  98: 'icon098_ほうき.png',
  99: 'icon099_傘立て.png',
  100: 'icon100_洗濯ばさみ.png',
  101: 'icon101_物干し竿.png',
  102: 'icon102_室外機.png',
  103: 'icon103_ガーデンライト.png',
  104: 'icon104_庭のイス.png',
  105: 'icon105_園芸鉢.png',
  106: 'icon106_庭石.png',
  107: 'icon107_ホースリール.png',
  108: 'icon108_ウッドデッキ.png',
  109: 'icon109_おにぎり.png',
  110: 'icon110_パン屋さん.png',
  111: 'icon111_サンドイッチ.png',
  112: 'icon112_アイスクリーム屋さん.png',
  113: 'icon113_ドーナツ屋さん.png',
  114: 'icon114_クッキー屋さん.png',
  115: 'icon115_水筒.png',
  116: 'icon116_紙パック飲料.png',
  117: 'icon117_コーヒーカップ.png',
  118: 'icon118_お弁当屋さん.png',
  119: 'icon119_たい焼き屋さん.png',
  120: 'icon120_焼きいも屋さん.png',
  121: 'icon121_パーゴラ.png',
  122: 'icon122_水飲み場.png',
  123: 'icon123_自転車ラック.png',
  124: 'icon124_チェーン柵.png',
  125: 'icon125_石橋.png',
  126: 'icon126_階段.png',
  127: 'icon127_花壇.png',
  128: 'icon128_手押しポンプ.png',
  129: 'icon129_掲示板.png',
  130: 'icon130_案内地図.png',
  131: 'icon131_トイレマーク.png',
  132: 'icon132_段差プレート.png',
  133: 'icon133_コンクリート壁.png',
  134: 'icon134_木製アーチ.png',
  135: 'icon135_ガーデンランプ.png',
  136: 'icon136_石段.png',
  137: 'icon137_グレーチング.png',
  138: 'icon138_古いポンプ.png',
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
  162: 'icon162_つらら.png',
  163: 'icon163_止まれ足型マーク.png',
  164: 'icon164_マフラー.png',
  165: 'icon165_こいのぼり.png',
  166: 'icon166_リース.png',
  167: 'icon167_風鈴.png',
  168: 'icon168_うちわ.png',
  169: 'icon169_赤いボール.png',
  170: 'icon170_段ボール箱.png',
  171: 'icon171_カーブミラー裏側.png',
  172: 'icon172_お地蔵さん.png',
  173: 'icon173_小石.png',
  174: 'icon174_大きな岩.png',
  175: 'icon175_渦巻きオブジェ.png',
  176: 'icon176_ジグザグ板.png',
  177: 'icon177_星.png',
  178: 'icon178_顔に見える石.png',
  179: 'icon179_直線の棒.png',
  180: 'icon180_カラフル板.png',
  181: 'icon181_石2つ並び.png',
  182: 'icon182_石3つ並び.png',
  183: 'icon183_小石4つ.png',
  184: 'icon184_5本線マーク板.png',
  185: 'icon185_1本の棒.png',
  186: 'icon186_多数並び小石.png',
  187: 'icon187_同形葉2枚.png',
  188: 'icon188_同形葉3枚.png',
  189: 'icon189_段差プレート.png',
  190: 'icon190_ブロック塀笠木.png',
  191: 'icon191_門扉蝶番.png',
  192: 'icon192_小石10個以上.png',
  193: 'icon193_タイル補修跡.png',
  194: 'icon194_外壁換気.png',
  195: 'icon195_雨どい固定金具.png',
  196: 'icon196_エアコン配管.png',
  197: 'icon197_玄関横フック.png',
  198: 'icon198_ポーチライト.png',
  199: 'icon199_宅配注意.png',
  200: 'icon200_インターホン.png',
  201: 'icon201_玄関横の砂利.png',
  202: 'icon202_縁石雑草.png',
  203: 'icon203_ブロック塀笠木別角度.png',
  204: 'icon204_門扉ラッチ金具.png',
  205: 'icon205_玄関タイル.png',
  206: 'icon206_傾いたカラーコーン.png',
  207: 'icon207_めくれた紙.png',
  208: 'icon208_斜め看板.png',
  209: 'icon209_屋外喫煙所.png',
  210: 'icon210_自販機横のゴミ箱.png',
  211: 'icon211_壁のイラスト.png',
  212: 'icon212_銅像.png',
  213: 'icon213_枝の風船.png',
  214: 'icon214_しぼんだボール.png',
  215: 'icon215_ハート石.png',
  216: 'icon216_虹反射.png',
  217: 'icon217_ねじれ枝.png',
  218: 'icon218_つる輪.png',
  219: 'icon219_鳥の巣.png',
  220: 'icon220_つぼみ.png',
  221: 'icon221_開いた実.png',
  222: 'icon222_抜け殻.png',
  223: 'icon223_きのこ.png',
  224: 'icon224_ベンチ下ボール.png',
  225: 'icon225_柵のタオル.png',
  226: 'icon226_エアコン室外機png.png',
  227: 'icon227_ガスメーター.png',
  228: 'icon228_電力量メーター.png',
  229: 'icon229_雨どい.png',
  230: 'icon230_雨どい金具.png',
  231: 'icon231_外壁の点検口.png',
  232: 'icon232_四角い換気口.png',
  233: 'icon233_丸い換気口.png',
  234: 'icon234_ブロック塀の壁.png',
  235: 'icon235_フェンス支柱.png',
  236: 'icon236_門柱の表札png.png',
  237: 'icon237_新聞受け口.png',
  238: 'icon238_手紙.png',
  239: 'icon239_ひっくり葉.png',
  240: 'icon240_石の輪.png',
  241: 'icon241_色の違う舗装ブロック.png',
  242: 'icon242_タイルの補修跡.png',
  243: 'icon243_アスファルトのひび.png',
  244: 'icon244_側溝のふたの種類違い.png',
  245: 'icon245_補修されたマンホール.png',
  246: 'icon246_点字ブロックの終端.png',
  247: 'icon247_白線のかすれ.png',
  248: 'icon248_横断歩道のすり減り.png',
  249: 'icon249_舗装の切り替わり線.png',
  250: 'icon250_道路の水たまり跡.png',
  251: 'icon251_小さな砂だまり.png',
  252: 'icon252_落ち葉が集まった端.png',
  253: 'icon253_雑草が出たすき間.png',
  254: 'icon254_根で盛り上がった舗装.png',
  255: 'icon255_地面の小さな穴.png',
  256: 'icon256_石が埋まった舗装.png',
  257: 'icon257_十字路.png',
  258: 'icon258_T字路.png',
  259: 'icon259_行き止まり.png',
  260: 'icon260_曲がり角.png',
  261: 'icon261_坂道.png',
  262: 'icon262_急な坂.png',
  263: 'icon263_細い路地.png',
  264: 'icon264_袋小路.png',
  265: 'icon265_一方通行の道.png',
  266: 'icon266_車止めのある道.png',
  267: 'icon267_歩道と車道の段差.png',
  268: 'icon268_縁石の切れ目.png',
  269: 'icon269_段差解消スロープ.png',
  270: 'icon270_カーブした白線.png',
  271: 'icon271_道路の合流部分.png',
  272: 'icon272_道の幅が変わる場所.png',
  273: 'icon273_側溝の格子ふた.png',
  274: 'icon274_フタなし側溝.png',
  275: 'icon275_水抜き穴.png',
  276: 'icon276_細長い排水穴.png',
  277: 'icon277_側溝の落ち葉詰まり.png',
  278: 'icon278_側溝の水の流れ.png',
  279: 'icon279_雨水ます.png',
  280: 'icon280_集水ます.png',
  281: 'icon281_排水口の金網.png',
  282: 'icon282_水が流れた跡.png',
  283: 'icon283_雨だれ跡.png',
  284: 'icon284_壁際の湿った跡.png',
  285: 'icon285_苔の生えた排水まわり.png',
  286: 'icon286_泥の跳ね跡.png',
  287: 'icon287_側溝の段差.png',
  288: 'icon288_溝に落ちた葉っぱ.png',
  289: 'icon289_道路と砂利の境界.png',
  290: 'icon290_舗装と土の境界.png',
  291: 'icon291_コンクリートと芝の境界.png',
  292: 'icon292_舗装とタイルの境界.png',
  293: 'icon293_道路と側溝の境界線.png',
  294: 'icon294_歩道と植え込みの境界.png',
  295: 'icon295_縁石の角.png',
  296: 'icon296_縁石の丸い角.png',
  297: 'icon297_縁石の欠け.png',
  298: 'icon298_塀の終わり位置.png',
  299: 'icon299_フェンスの終端.png',
  300: 'icon300_ガードレールの終端.png',
  301: 'icon301_道路の端の白線.png',
  302: 'icon302_舗装の切り欠き部分.png',
  303: 'icon303_舗装の角の補修.png',
  304: 'icon304_道の端に集まった砂.png',
  305: 'icon305_白線の途切れ.png',
  306: 'icon306_白線の重なり.png',
  307: 'icon307_消えかけた白線.png',
  308: 'icon308_新しい白線.png',
  309: 'icon309_古い白線.png',
  310: 'icon310_白線の端の丸まり.png',
  311: 'icon311_タイル目地の線.png',
  312: 'icon312_ブロック塀の目地.png',
  313: 'icon313_室外機ドレンホース.png',
  314: 'icon314_ベランダ避難ハッチ.png',
  315: 'icon315_屋外給湯器.png',
  316: 'icon316_換気口の虫よけ.png',
  317: 'icon317_交差するひび.png',
  318: 'icon318_曲がったひび.png',
  319: 'icon319_影が一直線.png',
  320: 'icon320_フェンスの影の線.png',
  321: 'icon321_濡れて色が変わった舗装.png',
  322: 'icon322_乾いて色が違う舗装.png',
  323: 'icon323_苔が広がった面.png',
  324: 'icon324_砂が広がった面.png',
  325: 'icon325_落ち葉が広がった面.png',
  326: 'icon326_タイルが並ぶ面.png',
  327: 'icon327_ブロック塀の面.png',
  328: 'icon328_金属ふたの面.png',
  329: 'icon329_アスファルトの粗い面.png',
  330: 'icon330_コンクリートの滑らかな面.png',
  331: 'icon331_小石が多い面.png',
  332: 'icon332_影が広がった面.png',
  333: 'icon333_水が広がった面.png',
  334: 'icon334_補修された四角い面.png',
  335: 'icon335_色が違う舗装パッチ面.png',
  336: 'icon336_草が広がった面.png',
  337: 'icon337_少し高い縁石.png',
  338: 'icon338_とても高い縁石.png',
  339: 'icon339_低い段差.png',
  340: 'icon340_2段の段差.png',
  341: 'icon341_3段の段差.png',
  342: 'icon342_スロープの始まり.png',
  343: 'icon343_スロープの終わり.png',
  344: 'icon344_盛り上がった舗装.png',
  345: 'icon345_沈んだ舗装.png',
  346: 'icon346_地面より高いマンホール.png',
  347: 'icon347_地面より低いマンホール.png',
  348: 'icon348_高さの違うタイル.png',
  349: 'icon349_高低差のある境界.png',
  350: 'icon350_影でわかる段差.png',
  351: 'icon351_壁の基礎の立ち上がり.png',
  352: 'icon352_土が盛られた端.png',
  353: 'icon353_舗装の終わり.png',
  354: 'icon354_タイルの終端.png',
  355: 'icon355_白線の終端.png',
  356: 'icon356_フェンスの終端.png',
  357: 'icon357_ガードレールの終端.png',
  358: 'icon358_側溝の終端.png',
  359: 'icon359_ブロック塀の終端.png',
  360: 'icon360_手すりの終端.png',
  361: 'icon361_縁石の切れ目.png',
  362: 'icon362_舗装と土の境界.png',
  363: 'icon363_舗装と草の境界.png',
  364: 'icon364_舗装と砂利の境界.png',
  365: 'icon365_壁と地面の境界.png',
  366: 'icon366_影の終端.png',
  367: 'icon367_水たまりの縁.png',
  368: 'icon368_落ち葉の縁.png',
  369: 'icon369_ボルト留め.png',
  370: 'icon370_ネジ頭.png',
  371: 'icon371_金具プレート.png',
  372: 'icon372_L字金具.png',
  373: 'icon373_針金のねじり.png',
  374: 'icon374_結束バンド.png',
  375: 'icon375_フック.png',
  376: 'icon376_カラビナ風金具.png',
  377: 'icon377_鎖の接続部.png',
  378: 'icon378_手すりの継ぎ目.png',
  379: 'icon379_フェンスの接合部.png',
  380: 'icon380_標識柱の根元.png',
  381: 'icon381_ガードレールの接合部.png',
  382: 'icon382_ベンチの固定金具.png',
  383: 'icon383_配管クランプ.png',
  384: 'icon384_ワイヤー固定具.png',
  385: 'icon385_アスファルトとコンクリートの境界.png',
  386: 'icon386_コンクリートとタイルの境界.png',
  387: 'icon387_タイルと砂利の境界.png',
  388: 'icon388_土と草の境界.png',
  389: 'icon389_砂と石の境界.png',
  390: 'icon390_白線とアスファルト.png',
  391: 'icon391_側溝ふたと舗装の境界.png',
  392: 'icon392_縁石と車道の境界.png',
  393: 'icon393_町内会掲示板.png',
  394: 'icon394_点字ブロックと歩道の境界.png',
  395: 'icon395_マンホールと舗装の境界.png',
  396: 'icon396_グレーチングと舗装の境界.png',
  397: 'icon397_舗装の色違いパッチ.png',
  398: 'icon398_補修跡の舗装.png',
  399: 'icon399_新しい舗装と古い舗装.png',
  400: 'icon400_ひび割れ補修ライン.png',
  401: 'icon401_横断歩道ライン.png',
  402: 'icon402_停止線_三角.png',
  403: 'icon403_黄色中央線.png',
  404: 'icon404_白中央線.png',
  405: 'icon405_外側線.png',
  406: 'icon406_ひし形マーク.png',
  407: 'icon407_停止三角.png',
  408: 'icon408_直進矢印.png',
  409: 'icon409_左折矢印.png',
  410: 'icon410_右折矢印.png',
  411: 'icon411_自転車ナビライン.png',
  412: 'icon412_バス停ライン.png',
  413: 'icon413_減速マーク.png',
  414: 'icon414_スクールゾーン舗装.png',
  415: 'icon415_緑舗装.png',
  416: 'icon416_赤舗装.png',
  417: 'icon417_矢印の一部.png',
  418: 'icon418_注意色のしましま.png',
  419: 'icon419_黄色い注意プレート.png',
  420: 'icon420_赤い注意プレート.png',
  421: 'icon421_青い案内プレート.png',
  422: 'icon422_緑の誘導表示.png',
  423: 'icon423_消火設備マーク.png',
  424: 'icon424_避難案内マーク.png',
  425: 'icon425_駐輪禁止マーク.png',
  426: 'icon426_コンビニ.png',
  427: 'icon427_防犯カメラ表示.png',
  428: 'icon428_工事中カラー.png',
  429: 'icon429_反射材つき表示.png',
  430: 'icon430_古いステッカー跡.png',
  431: 'icon431_色あせた表示.png',
  432: 'icon432_半分はがれた表示.png',
  433: 'icon433_アスファルトとコンクリート.png',
  434: 'icon434_段差のある縁石.png',
  435: 'icon435_点字ブロックの端.png',
  436: 'icon436_タイルの切り替わり.png',
  437: 'icon437_色違い舗装.png',
  438: 'icon438_舗装補修パッチ.png',
  439: 'icon439_一本ひび.png',
  440: 'icon440_分岐ひび.png',
  441: 'icon441_並ぶ側溝ふた.png',
  442: 'icon442_グレーチング端.png',
  443: 'icon443_マンホール補修跡.png',
  444: 'icon444_途切れた白線.png',
  445: 'icon445_歩道ブロック継ぎ目.png',
  446: 'icon446_インターロッキング.png',
  447: 'icon447_縁石の角.png',
  448: 'icon448_縁石カーブ.png',
  449: 'icon449_色あせた白線.png',
  450: 'icon450_スーパー入口.png',
  451: 'icon451_サビの出た金属.png',
  452: 'icon452_サビの流れ跡.png',
  453: 'icon453_ヒビの入った縁石.png',
  454: 'icon454_欠けたコンクリート角.png',
  455: 'icon455_古い舗装の色差.png',
  456: 'icon456_重ね塗りされた線.png',
  457: 'icon457_消えかけたマーク.png',
  458: 'icon458_交換された舗装.png',
  459: 'icon459_補修された穴の丸跡.png',
  460: 'icon460_ずれたブロック.png',
  461: 'icon461_傾いたポール.png',
  462: 'icon462_傾いた看板.png',
  463: 'icon463_曲がったフェンス.png',
  464: 'icon464_草が生えているすき間.png',
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
  476: 'icon476_案内板横キャラ.png',
  477: 'icon477_元ハローマック跡っぽい店.png',
  478: 'icon478_公民館掲示キャラ.png',
  479: 'icon479_地域イベント掲示キャラ.png',
  480: 'icon480_地域マスコット立て看板.png',
  481: 'icon481_室外機.png',
  482: 'icon482_軒先の植木鉢.png',
  483: 'icon483_傘立て.png',
  484: 'icon484_ほうきとちりとり.png',
  485: 'icon485_分別表示.png',
  486: 'icon486_ゴミ収集曜日掲示.png',
  487: 'icon487_ペットボトル回収箱.png',
  488: 'icon488_電池回収ボックス.png',
  489: 'icon489_トレー回収箱.png',
  490: 'icon490_牛乳パック回収箱.png',
  491: 'icon491_宅配ボックス.png',
  492: 'icon492_置き配荷物.png',
  493: 'icon493_玄関マット.png',
  494: 'icon494_物干し竿.png',
  495: 'icon495_カラスよけネット.png',
  496: 'icon496_ゴミステーション.png',
  497: 'icon497_電柱番号札.png',
  498: 'icon498_消火栓プレート.png',
  499: 'icon499_路面反射鋲.png',
  500: 'icon500_停止線.png',
  501: 'icon501_側溝コンクリ穴フタ.png',
  502: 'icon502_電柱黄色巻き.png',
  503: 'icon503_防犯カメラダミー.png',
  504: 'icon504_玄関脇ほうき.png',
  505: 'icon505_壁付けポスト.png',
  506: 'icon506_立体表札.png',
  507: 'icon507_軒下すだれ.png',
  508: 'icon508_屋外水道蛇口.png',
  509: 'icon509_ブロック塀笠木.png',
  510: 'icon510_勝手口ドア.png',
  511: 'icon511_段差プレート.png',
  512: 'icon512_タイル補修跡.png',
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
  529: 'icon529_玄関横の傘フック.png',
  530: 'icon530_門前の植木スタンド.png',
  531: 'icon531_宅配再配達票.png',
  532: 'icon532_玄関前の小型踏み台.png',
  533: 'icon533_ブロック塀の通気穴.png',
  534: 'icon534_側溝フタ（住宅前）.png',
  535: 'icon535_砂利敷き駐車スペース.png',
  536: 'icon536_カーポート柱.png',
  537: 'icon537_屋外コンセント.png',
  538: 'icon538_壁付け散水蛇口.png',
  539: 'icon539_電力量メーター箱.png',
  540: 'icon540_ガスメーター保護ボックス.png',
  541: 'icon541_据え置き物干し台.png',
  542: 'icon542_竿受け金具.png',
  543: 'icon543_雨戸収納戸袋.png',
  544: 'icon544_外壁換気フード.png',
  545: 'icon545_郵便受けの雨よけ屋根.png',
  546: 'icon546_門灯の透明カバー.png',
  547: 'icon547_住宅煙突.png',
  548: 'icon548_銭湯煙突.png'
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
  {id: 'landmark001', text: 'ランドマーク①', iconFile: 'landmark001_ランドマーク.png', type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark002', text: 'ランドマーク②', iconFile: 'landmark002_ランドマーク.png', type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark003', text: 'ランドマーク③', iconFile: 'landmark003_ランドマーク.png', type: 'landmark', category: 'ランドマーク'},
  {id: 'landmark004', text: 'ランドマーク④', iconFile: 'landmark004_ランドマーク.png', type: 'landmark', category: 'ランドマーク'},
];

const topicDatabase = {
  // かんたん（101個）: よく見かけるもの
  easy: [
    {id: 1, text: '電柱', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 2, text: '郵便ポスト', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 3, text: '信号機', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 4, text: '横断歩道', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 5, text: 'カーブミラー', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 6, text: '飛び出し坊や', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 7, text: 'マンホール', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 8, text: 'ガードレール', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 9, text: '道路の白線', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 10, text: '排水口', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 11, text: '道路反射板', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 12, text: '点字ブロック', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 13, text: '表札プレート', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 14, text: '玄関灯', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 15, text: '郵便受け', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 16, text: 'インターホン', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 17, text: '門柱', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
    {id: 18, text: '玄関マット', icon: '🔍', category: '街インフラ', diff: 'easy', season: 'all'},
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
    {id: 47, text: '草むら', icon: '🔍', category: '自然・生き物', diff: 'easy', season: 'all'},
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
    {id: 85, text: 'ランドセル', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 86, text: '黄色い帽子', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 87, text: '通学路標識', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 88, text: '学校の門', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 89, text: '校庭フェンス', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 90, text: '体育倉庫', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 91, text: '一輪車', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 92, text: 'サッカーボール', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 93, text: '竹馬', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 94, text: 'チョーク', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 95, text: '黒板消し', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 96, text: '上履き袋', icon: '🔍', category: '生活・学校', diff: 'easy', season: 'all'},
    {id: 497, text: '電柱番号札', icon: '🔍', category: 'その他観察', diff: 'easy', season: 'all'},
    {id: 502, text: '電柱黄色巻き', icon: '🔍', category: 'その他観察', diff: 'easy', season: 'all'},
    {id: 526, text: '冷凍餃子自販機', icon: '🔍', category: '商業・店舗', diff: 'easy', season: 'all'},
    {id: 527, text: '卵自販機', icon: '🔍', category: '商業・店舗', diff: 'easy', season: 'all'},
    {id: 528, text: 'おでん缶自販機', icon: '🔍', category: '商業・店舗', diff: 'easy', season: 'all'}
  ],

  // ふつう（156個）: 少し探す必要があるもの
  normal: [
    {id: 97, text: 'じょうろ', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 98, text: 'ほうき', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 99, text: '傘立て', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 100, text: '洗濯ばさみ', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 101, text: '物干し竿', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 102, text: '室外機', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 103, text: 'ガーデンライト', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 104, text: '庭のイス', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 105, text: '園芸鉢', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 106, text: '庭石', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 107, text: 'ホースリール', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 108, text: 'ウッドデッキ', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 109, text: 'おにぎり', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 110, text: 'パン', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 111, text: 'サンドイッチ', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 112, text: 'アイスクリーム', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 113, text: 'ドーナツ', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 114, text: 'クッキー', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 115, text: '水筒', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 116, text: '紙パック飲料', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 117, text: 'コーヒーカップ', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 118, text: 'お弁当', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 119, text: 'たい焼き', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 120, text: '焼きいも', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'winter'},
    {id: 121, text: 'パーゴラ', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 122, text: '水飲み場', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
    {id: 123, text: '自転車ラック', icon: '🔍', category: '家庭・食べ物', diff: 'normal', season: 'all'},
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
    {id: 137, text: 'グレーチング', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
    {id: 138, text: '古いポンプ', icon: '🔍', category: '街構造・乗り物', diff: 'normal', season: 'all'},
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
    {id: 162, text: 'つらら', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'winter'},
    {id: 163, text: '止まれ足型マーク', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 164, text: 'マフラー', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'winter'},
    {id: 165, text: 'こいのぼり', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'spring'},
    {id: 166, text: 'クリスマス飾り', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'winter'},
    {id: 167, text: '風鈴', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'summer'},
    {id: 168, text: 'うちわ', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'summer'},
    {id: 169, text: '赤いボール', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 170, text: '段ボール箱', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 171, text: 'カーブミラー裏側', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 172, text: 'お地蔵さん', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 173, text: '小石', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 174, text: '大きな岩', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 175, text: '渦巻きオブジェ', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 176, text: 'ジグザグ板', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 177, text: '星プレート', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 178, text: '顔に見える石', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 179, text: '直線の棒', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 180, text: 'しましま板', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 181, text: '石2つ並び', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 182, text: '石3つ並び', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 183, text: '小石4つ', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 184, text: '5本線マーク板', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 185, text: '1本の棒', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 186, text: '多数並び小石', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 187, text: '同形葉2枚', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 188, text: '同形葉3枚', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 189, text: '段差プレート', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 190, text: 'ブロック塀笠木', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 191, text: '門扉蝶番', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 192, text: '小石10個以上', icon: '🔍', category: '季節・形・数', diff: 'normal', season: 'all'},
    {id: 353, text: '舗装の終わり', icon: '🔍', category: '境界・終端・切れ目', diff: 'normal', season: 'all'},
    {id: 355, text: '白線の終端', icon: '🔍', category: '境界・終端・切れ目', diff: 'normal', season: 'all'},
    {id: 358, text: '側溝の終端', icon: '🔍', category: '境界・終端・切れ目', diff: 'normal', season: 'all'},
    {id: 361, text: '縁石の切れ目', icon: '🔍', category: '境界・終端・切れ目', diff: 'normal', season: 'all'},
    {id: 363, text: '舗装と草の境界', icon: '🔍', category: '境界・終端・切れ目', diff: 'normal', season: 'all'},
    {id: 369, text: 'ボルト留め', icon: '🔍', category: '接続・固定・留め具', diff: 'normal', season: 'all'},
    {id: 374, text: '結束バンド', icon: '🔍', category: '接続・固定・留め具', diff: 'normal', season: 'all'},
    {id: 380, text: '標識柱の根元', icon: '🔍', category: '接続・固定・留め具', diff: 'normal', season: 'all'},
    {id: 385, text: 'アスファルトとコンクリートの境界', icon: '🔍', category: '素材境界・舗装差', diff: 'normal', season: 'all'},
    {id: 390, text: '白線とアスファルト', icon: '🔍', category: '素材境界・舗装差', diff: 'normal', season: 'all'},
    {id: 391, text: '側溝ふたと舗装の境界', icon: '🔍', category: '素材境界・舗装差', diff: 'normal', season: 'all'},
    {id: 392, text: '縁石と車道の境界', icon: '🔍', category: '素材境界・舗装差', diff: 'normal', season: 'all'},
    {id: 393, text: '町内会掲示板', icon: '🔍', category: '素材境界・舗装差', diff: 'normal', season: 'all'},
    {id: 394, text: '点字ブロックと歩道の境界', icon: '🔍', category: '素材境界・舗装差', diff: 'normal', season: 'all'},
    {id: 395, text: 'マンホールと舗装の境界', icon: '🔍', category: '素材境界・舗装差', diff: 'normal', season: 'all'},
    {id: 396, text: 'グレーチングと舗装の境界', icon: '🔍', category: '素材境界・舗装差', diff: 'normal', season: 'all'},
    {id: 398, text: '補修跡の舗装', icon: '🔍', category: '素材境界・舗装差', diff: 'normal', season: 'all'},
    {id: 401, text: '横断歩道ライン', icon: '🔍', category: '道路標示・路面表示', diff: 'normal', season: 'all'},
    {id: 405, text: '外側線', icon: '🔍', category: '道路標示・路面表示', diff: 'normal', season: 'all'},
    {id: 426, text: 'コンビニ外観', icon: '🔍', category: '案内・注意表示', diff: 'normal', season: 'all'},
    {id: 433, text: 'アスファルトとコンクリート', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'normal', season: 'all'},
    {id: 434, text: '段差のある縁石', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'normal', season: 'all'},
    {id: 435, text: '点字ブロックの端', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'normal', season: 'all'},
    {id: 438, text: '舗装補修パッチ', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'normal', season: 'all'},
    {id: 441, text: '並ぶ側溝ふた', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'normal', season: 'all'},
    {id: 447, text: '縁石の角', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'normal', season: 'all'},
    {id: 465, text: '屋外招き猫', icon: '🔍', category: 'キャラクター掲示物', diff: 'normal', season: 'all'},
    {id: 466, text: 'シーサー', icon: '🔍', category: 'キャラクター掲示物', diff: 'normal', season: 'all'},
    {id: 471, text: '店先ポップスタンドキャラ', icon: '🔍', category: '店舗周辺', diff: 'normal', season: 'all'},
    {id: 481, text: '室外機', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 483, text: '傘立て', icon: '🔍', category: 'その他観察', diff: 'normal', season: 'all'},
    {id: 484, text: 'ほうきとちりとり', icon: '🔍', category: 'その他観察', diff: 'normal', season: 'all'},
    {id: 493, text: '玄関マット', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 494, text: '物干し竿', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 504, text: '玄関脇ほうき', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 505, text: '壁付けポスト', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 506, text: '立体表札', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
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
    {id: 529, text: '玄関横の傘フック', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 530, text: '門前の植木スタンド', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 532, text: '玄関前の小型踏み台', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 534, text: '側溝フタ（住宅前）', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 536, text: 'カーポート柱', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 537, text: '屋外コンセント', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 541, text: '据え置き物干し台', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 542, text: '竿受け金具', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 544, text: '外壁換気フード', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'},
    {id: 545, text: '郵便受けの雨よけ屋根', icon: '🔍', category: '商業・店舗', diff: 'normal', season: 'all'},
    {id: 546, text: '門灯の透明カバー', icon: '🔍', category: '住宅・外構', diff: 'normal', season: 'all'}
  ],

  // むずかしい（179個）: よく観察しないと見つからないもの
  hard: [
    {id: 193, text: 'タイル補修跡', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 194, text: '外壁換気', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 195, text: '雨どい固定金具', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 196, text: 'エアコン配管', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 197, text: '玄関横フック', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'winter'},
    {id: 198, text: 'ポーチライト', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 199, text: '宅配注意', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 200, text: 'インターホン', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 201, text: '玄関横の砂利', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 202, text: '縁石雑草', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 203, text: 'ブロック塀笠木別角度', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 204, text: '門扉ラッチ金具', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 205, text: '玄関タイル', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 206, text: '傾いたカラーコーン', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 207, text: 'めくれた紙', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 208, text: '斜め看板', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 209, text: '屋外喫煙所', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 210, text: '自販機横のゴミ箱', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 211, text: '壁のイラスト', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 212, text: '銅像', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'autumn'},
    {id: 213, text: '枝の風船', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 214, text: 'しぼんだボール', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 215, text: 'ハート石', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 216, text: '虹反射', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 217, text: 'ねじれ枝', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 218, text: 'つる輪', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 219, text: '鳥の巣', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 220, text: 'つぼみ', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'spring'},
    {id: 221, text: '開いた実', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 222, text: '抜け殻', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'summer'},
    {id: 223, text: 'きのこ群', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'autumn'},
    {id: 224, text: 'ベンチ下ボール', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 225, text: '柵のタオル', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 226, text: 'エアコン室外機', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'autumn'},
    {id: 227, text: 'ガスメーター', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 228, text: '電力量メーター', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 229, text: '雨どい', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 230, text: '雨どい金具', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 231, text: '外壁の点検口', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 232, text: '四角い換気口', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 233, text: '丸い換気口', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 234, text: 'ブロック塀の壁', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 235, text: 'フェンス支柱', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 236, text: '門柱の表札', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 237, text: '新聞受け口', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 238, text: '手紙', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 239, text: 'ひっくり葉', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 240, text: '石の輪', icon: '🔍', category: '痕跡・発見', diff: 'hard', season: 'all'},
    {id: 241, text: '色の違う舗装ブロック', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 242, text: 'タイルの補修跡', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 243, text: 'アスファルトのひび', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 244, text: '側溝のふたの種類違い', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 245, text: 'マンホール周りの円形補修', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 246, text: '点字ブロックの終端', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 247, text: '白線のかすれ', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 248, text: '横断歩道のすり減り', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 249, text: '舗装の切り替わり線', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 250, text: '道路の水たまり跡', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 251, text: '小さな砂だまり', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 252, text: '落ち葉が集まった端', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'autumn'},
    {id: 253, text: '雑草が出たすき間', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 254, text: '根で盛り上がった舗装', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 255, text: '地面の小さな穴', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 256, text: '石が埋まった舗装', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 257, text: '十字路', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 258, text: 'T字路', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 259, text: '行き止まり', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 260, text: '曲がり角', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 261, text: '坂道', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 262, text: '急な坂', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 263, text: '細い路地', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 264, text: '袋小路', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 265, text: '一方通行の道', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 266, text: '車止めのある道', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 267, text: '歩道と車道の段差', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 268, text: '縁石の切れ目', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 269, text: '段差解消スロープ', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 270, text: 'カーブした白線', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 271, text: '道路の合流部分', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 272, text: '道の幅が変わる場所', icon: '🔍', category: '線・模様観察', diff: 'hard', season: 'all'},
    {id: 354, text: 'タイルの終端', icon: '🔍', category: '境界・終端・切れ目', diff: 'hard', season: 'all'},
    {id: 356, text: 'フェンスの終端', icon: '🔍', category: '境界・終端・切れ目', diff: 'hard', season: 'all'},
    {id: 357, text: 'ガードレールの終端', icon: '🔍', category: '境界・終端・切れ目', diff: 'hard', season: 'all'},
    {id: 359, text: 'ブロック塀の終端', icon: '🔍', category: '境界・終端・切れ目', diff: 'hard', season: 'all'},
    {id: 360, text: '手すりの終端', icon: '🔍', category: '境界・終端・切れ目', diff: 'hard', season: 'all'},
    {id: 362, text: '舗装と土の境界', icon: '🔍', category: '境界・終端・切れ目', diff: 'hard', season: 'all'},
    {id: 364, text: '舗装と砂利の境界', icon: '🔍', category: '境界・終端・切れ目', diff: 'hard', season: 'all'},
    {id: 365, text: '壁と地面の境界', icon: '🔍', category: '境界・終端・切れ目', diff: 'hard', season: 'all'},
    {id: 368, text: '落ち葉の縁', icon: '🔍', category: '境界・終端・切れ目', diff: 'hard', season: 'autumn'},
    {id: 370, text: 'ネジ頭', icon: '🔍', category: '接続・固定・留め具', diff: 'hard', season: 'all'},
    {id: 371, text: '金具プレート', icon: '🔍', category: '接続・固定・留め具', diff: 'hard', season: 'all'},
    {id: 375, text: 'フック', icon: '🔍', category: '接続・固定・留め具', diff: 'hard', season: 'all'},
    {id: 377, text: '鎖の接続部', icon: '🔍', category: '接続・固定・留め具', diff: 'hard', season: 'all'},
    {id: 378, text: '手すりの継ぎ目', icon: '🔍', category: '接続・固定・留め具', diff: 'hard', season: 'all'},
    {id: 379, text: 'フェンスの接合部', icon: '🔍', category: '接続・固定・留め具', diff: 'hard', season: 'all'},
    {id: 381, text: 'ガードレールの接合部', icon: '🔍', category: '接続・固定・留め具', diff: 'hard', season: 'all'},
    {id: 383, text: '配管クランプ', icon: '🔍', category: '接続・固定・留め具', diff: 'hard', season: 'all'},
    {id: 386, text: 'コンクリートとタイルの境界', icon: '🔍', category: '素材境界・舗装差', diff: 'hard', season: 'all'},
    {id: 388, text: '土と草の境界', icon: '🔍', category: '素材境界・舗装差', diff: 'hard', season: 'all'},
    {id: 397, text: '舗装の色違いパッチ', icon: '🔍', category: '素材境界・舗装差', diff: 'hard', season: 'all'},
    {id: 399, text: '新しい舗装と古い舗装', icon: '🔍', category: '素材境界・舗装差', diff: 'hard', season: 'all'},
    {id: 400, text: 'ひび割れ補修ライン', icon: '🔍', category: '素材境界・舗装差', diff: 'hard', season: 'all'},
    {id: 403, text: '黄色中央線', icon: '🔍', category: '道路標示・路面表示', diff: 'hard', season: 'all'},
    {id: 404, text: '白中央線', icon: '🔍', category: '道路標示・路面表示', diff: 'hard', season: 'all'},
    {id: 406, text: 'ひし形マーク', icon: '🔍', category: '道路標示・路面表示', diff: 'hard', season: 'all'},
    {id: 407, text: '停止三角', icon: '🔍', category: '道路標示・路面表示', diff: 'hard', season: 'all'},
    {id: 408, text: '直進矢印', icon: '🔍', category: '道路標示・路面表示', diff: 'hard', season: 'all'},
    {id: 409, text: '左折矢印', icon: '🔍', category: '道路標示・路面表示', diff: 'hard', season: 'all'},
    {id: 410, text: '右折矢印', icon: '🔍', category: '道路標示・路面表示', diff: 'hard', season: 'all'},
    {id: 415, text: '緑舗装', icon: '🔍', category: '道路標示・路面表示', diff: 'hard', season: 'all'},
    {id: 416, text: '赤舗装', icon: '🔍', category: '道路標示・路面表示', diff: 'hard', season: 'all'},
    {id: 418, text: '注意色のしましま', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 419, text: '黄色い注意プレート', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 421, text: '青い案内プレート', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 422, text: '緑の誘導表示', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 423, text: '消火設備マーク', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 424, text: '避難案内マーク', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 425, text: '駐輪禁止マーク', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 427, text: '防犯カメラ表示', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 428, text: '工事中カラー', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 429, text: '反射材つき表示', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 431, text: '色あせた表示', icon: '🔍', category: '案内・注意表示', diff: 'hard', season: 'all'},
    {id: 436, text: 'タイルの切り替わり', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'hard', season: 'all'},
    {id: 437, text: '色違い舗装', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'hard', season: 'all'},
    {id: 439, text: '一本ひび', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'hard', season: 'all'},
    {id: 442, text: 'グレーチング端', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'hard', season: 'all'},
    {id: 443, text: 'マンホール補修跡', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'hard', season: 'all'},
    {id: 444, text: '途切れた白線', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'hard', season: 'all'},
    {id: 445, text: '歩道ブロック継ぎ目', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'hard', season: 'all'},
    {id: 446, text: 'インターロッキング', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'hard', season: 'all'},
    {id: 448, text: '縁石カーブ', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'hard', season: 'all'},
    {id: 449, text: '色あせた白線', icon: '🔍', category: '劣化・補修・ズレ', diff: 'hard', season: 'all'},
    {id: 450, text: 'スーパー入口', icon: '🔍', category: '劣化・補修・ズレ', diff: 'hard', season: 'all'},
    {id: 451, text: 'サビの出た金属', icon: '🔍', category: '劣化・補修・ズレ', diff: 'hard', season: 'all'},
    {id: 453, text: 'ヒビの入った縁石', icon: '🔍', category: '劣化・補修・ズレ', diff: 'hard', season: 'all'},
    {id: 454, text: '欠けたコンクリート角', icon: '🔍', category: '劣化・補修・ズレ', diff: 'hard', season: 'all'},
    {id: 455, text: '古い舗装の色差', icon: '🔍', category: '劣化・補修・ズレ', diff: 'hard', season: 'all'},
    {id: 456, text: '重ね塗りされた線', icon: '🔍', category: '劣化・補修・ズレ', diff: 'hard', season: 'all'},
    {id: 458, text: '交換された舗装', icon: '🔍', category: '劣化・補修・ズレ', diff: 'hard', season: 'all'},
    {id: 464, text: '草が生えているすき間', icon: '🔍', category: '劣化・補修・ズレ', diff: 'hard', season: 'all'},
    {id: 467, text: 'ふくろう置き物', icon: '🔍', category: 'キャラクター掲示物', diff: 'hard', season: 'all'},
    {id: 469, text: '商店街フラッグキャラ', icon: '🔍', category: 'キャラクター掲示物', diff: 'hard', season: 'all'},
    {id: 470, text: '商店街バナーキャラ', icon: '🔍', category: 'キャラクター掲示物', diff: 'hard', season: 'all'},
    {id: 474, text: '壁キャライラスト', icon: '🔍', category: 'キャラクター掲示物', diff: 'hard', season: 'all'},
    {id: 475, text: '公共掲示板キャラ', icon: '🔍', category: '公共施設', diff: 'hard', season: 'all'},
    {id: 476, text: '案内板横キャラ', icon: '🔍', category: '公共施設', diff: 'hard', season: 'all'},
    {id: 478, text: '公民館掲示キャラ', icon: '🔍', category: '公共施設', diff: 'hard', season: 'all'},
    {id: 479, text: '地域イベント掲示キャラ', icon: '🔍', category: '観光・地域情報', diff: 'hard', season: 'all'},
    {id: 482, text: '軒先の植木鉢', icon: '🔍', category: '自然・生き物', diff: 'hard', season: 'all'},
    {id: 485, text: '分別表示', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 486, text: 'ゴミ収集曜日掲示', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 487, text: 'ペットボトル回収箱', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 488, text: '電池回収ボックス', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 489, text: 'トレー回収箱', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 490, text: '牛乳パック回収箱', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 491, text: '宅配ボックス', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 492, text: '置き配荷物', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 495, text: 'カラスよけネット', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 496, text: 'ゴミステーション', icon: '🔍', category: '生活・地域設備', diff: 'hard', season: 'all'},
    {id: 498, text: '消火栓プレート', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 499, text: '路面反射鋲', icon: '🔍', category: '道路・路面', diff: 'hard', season: 'all'},
    {id: 500, text: '停止線', icon: '🔍', category: '道路・路面', diff: 'hard', season: 'all'},
    {id: 501, text: '側溝コンクリ穴フタ', icon: '🔍', category: '道路・路面', diff: 'hard', season: 'all'},
    {id: 503, text: '防犯カメラダミー', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 507, text: '軒下すだれ', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'summer'},
    {id: 509, text: 'ブロック塀笠木', icon: '🔍', category: '自然・生き物', diff: 'hard', season: 'all'},
    {id: 510, text: '勝手口ドア', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 511, text: '段差プレート', icon: '🔍', category: '道路・路面', diff: 'hard', season: 'all'},
    {id: 512, text: 'タイル補修跡', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 522, text: '昔ながらの美容室入口', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 525, text: '証明写真機', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 531, text: '宅配再配達票', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 533, text: 'ブロック塀の通気穴', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 535, text: '砂利敷き駐車スペース', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 538, text: '壁付け散水蛇口', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 539, text: '電力量メーター箱', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 540, text: 'ガスメーター保護ボックス', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 543, text: '雨戸収納戸袋', icon: '🔍', category: 'その他観察', diff: 'hard', season: 'all'},
    {id: 547, text: '住宅煙突', icon: '🔍', category: '住宅・外構', diff: 'hard', season: 'all'}
  ],

  // おに（112個）: 相当注意しないと見つからないもの
  oni: [
    {id: 273, text: '側溝の格子ふた', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 274, text: 'コンクリート側溝', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 275, text: '丸い排水穴', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 276, text: '細長い排水穴', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 277, text: '側溝の落ち葉詰まり', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'autumn'},
    {id: 278, text: '側溝の水の流れ', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 279, text: '雨水ます', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 280, text: '集水ますのふた', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 281, text: '排水口の金網', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 282, text: '水が流れた跡', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 283, text: '雨だれ跡', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 284, text: '壁際の湿った跡', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 285, text: '苔の生えた排水まわり', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 286, text: '泥の跳ね跡', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 287, text: '側溝の段差', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 288, text: '溝に落ちた葉っぱ', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 289, text: '道路と砂利の境界', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 290, text: '舗装と土の境界', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 291, text: 'コンクリートと芝の境界', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 292, text: '舗装とタイルの境界', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 293, text: '道路と側溝の境界線', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 294, text: '歩道と植え込みの境界', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 295, text: '縁石の角', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 296, text: '縁石の丸い角', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 297, text: '縁石の欠け', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 298, text: '塀の終わり位置', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 299, text: 'フェンスの終端', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 300, text: 'ガードレールの終端', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 301, text: '道路の端の白線', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 302, text: '舗装の切り欠き部分', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 303, text: '舗装の角の補修', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 304, text: '道の端に集まった砂', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 305, text: '白線の途切れ', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 306, text: '白線の重なり', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 307, text: '消えかけた白線', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 308, text: '新しい白線', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 309, text: '古い白線', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 310, text: '白線の端の丸まり', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 311, text: 'タイル目地の線', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 312, text: 'ブロック塀の目地', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 313, text: '室外機ドレンホース', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 314, text: 'ベランダ避難ハッチ', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 315, text: '屋外給湯器', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 316, text: '換気口の虫よけ', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 317, text: '交差するひび', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 318, text: '曲がったひび', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 319, text: '影が一直線', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 320, text: 'フェンスの影の線', icon: '🔍', category: '線・模様観察', diff: 'oni', season: 'all'},
    {id: 321, text: '濡れて色が変わった舗装', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 322, text: '乾いて色が違う舗装', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 323, text: '苔が広がった面', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 324, text: '砂が広がった面', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 325, text: '落ち葉が広がった面', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'autumn'},
    {id: 326, text: 'タイルが並ぶ面', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 327, text: 'ブロック塀の面', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 328, text: '金属ふたの面', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 329, text: 'アスファルトの粗い面', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 330, text: 'コンクリートの滑らかな面', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 331, text: '小石が多い面', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 332, text: '影が広がった面', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 333, text: '水が広がった面', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 334, text: '補修された四角い面', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 335, text: '色が違う舗装パッチ面', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 336, text: '草が広がった面', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 337, text: '少し高い縁石', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 338, text: 'とても高い縁石', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 339, text: '低い段差', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 340, text: '2段の段差', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 341, text: '3段の段差', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 342, text: 'スロープの始まり', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 343, text: 'スロープの終わり', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 344, text: '盛り上がった舗装', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 345, text: '沈んだ舗装', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 346, text: '地面より高いマンホール', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 347, text: '地面より低いマンホール', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 348, text: '高さの違うタイル', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 349, text: '高低差のある境界', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 350, text: '影でわかる段差', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 351, text: '壁の基礎の立ち上がり', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 352, text: '土が盛られた端', icon: '🔍', category: '面・高さ観察', diff: 'oni', season: 'all'},
    {id: 366, text: '影の終端', icon: '🔍', category: '境界・終端・切れ目', diff: 'oni', season: 'all'},
    {id: 367, text: '水たまりの縁', icon: '🔍', category: '境界・終端・切れ目', diff: 'oni', season: 'all'},
    {id: 372, text: 'L字金具', icon: '🔍', category: '接続・固定・留め具', diff: 'oni', season: 'all'},
    {id: 373, text: '針金のねじり', icon: '🔍', category: '接続・固定・留め具', diff: 'oni', season: 'all'},
    {id: 376, text: 'カラビナ風金具', icon: '🔍', category: '接続・固定・留め具', diff: 'oni', season: 'all'},
    {id: 382, text: 'ベンチの固定金具', icon: '🔍', category: '接続・固定・留め具', diff: 'oni', season: 'all'},
    {id: 384, text: 'ワイヤー固定具', icon: '🔍', category: '接続・固定・留め具', diff: 'oni', season: 'all'},
    {id: 387, text: 'タイルと砂利の境界', icon: '🔍', category: '素材境界・舗装差', diff: 'oni', season: 'all'},
    {id: 389, text: '砂と石の境界', icon: '🔍', category: '素材境界・舗装差', diff: 'oni', season: 'all'},
    {id: 402, text: '停止線_三角', icon: '🔍', category: '道路標示・路面表示', diff: 'oni', season: 'all'},
    {id: 411, text: '自転車ナビライン', icon: '🔍', category: '道路標示・路面表示', diff: 'oni', season: 'all'},
    {id: 412, text: 'バス停ライン', icon: '🔍', category: '道路標示・路面表示', diff: 'oni', season: 'all'},
    {id: 413, text: '減速マーク', icon: '🔍', category: '道路標示・路面表示', diff: 'oni', season: 'all'},
    {id: 414, text: 'スクールゾーン舗装', icon: '🔍', category: '道路標示・路面表示', diff: 'oni', season: 'all'},
    {id: 417, text: '矢印の一部', icon: '🔍', category: '案内・注意表示', diff: 'oni', season: 'all'},
    {id: 420, text: '赤い注意プレート', icon: '🔍', category: '案内・注意表示', diff: 'oni', season: 'all'},
    {id: 430, text: '古いステッカー跡', icon: '🔍', category: '案内・注意表示', diff: 'oni', season: 'all'},
    {id: 432, text: '半分はがれた表示', icon: '🔍', category: '案内・注意表示', diff: 'oni', season: 'all'},
    {id: 440, text: '分岐ひび', icon: '🔍', category: '舗装・縁石・路面状態', diff: 'oni', season: 'all'},
    {id: 452, text: 'サビの流れ跡', icon: '🔍', category: '劣化・補修・ズレ', diff: 'oni', season: 'all'},
    {id: 457, text: '消えかけたマーク', icon: '🔍', category: '劣化・補修・ズレ', diff: 'oni', season: 'all'},
    {id: 459, text: '補修された穴の丸跡', icon: '🔍', category: '劣化・補修・ズレ', diff: 'oni', season: 'all'},
    {id: 460, text: 'ずれたブロック', icon: '🔍', category: '劣化・補修・ズレ', diff: 'oni', season: 'all'},
    {id: 461, text: '傾いたポール', icon: '🔍', category: '劣化・補修・ズレ', diff: 'oni', season: 'all'},
    {id: 462, text: '傾いた看板', icon: '🔍', category: '劣化・補修・ズレ', diff: 'oni', season: 'all'},
    {id: 463, text: '曲がったフェンス', icon: '🔍', category: '劣化・補修・ズレ', diff: 'oni', season: 'all'},
    {id: 468, text: '黄色い量販店', icon: '🔍', category: 'キャラクター掲示物', diff: 'oni', season: 'all'},
    {id: 472, text: 'アーケード装飾キャラ', icon: '🔍', category: 'キャラクター掲示物', diff: 'oni', season: 'all'},
    {id: 473, text: 'シャッターキャラ絵', icon: '🔍', category: 'キャラクター掲示物', diff: 'oni', season: 'all'},
    {id: 477, text: '元ハローマック跡っぽい店', icon: '🔍', category: '観光・地域情報', diff: 'oni', season: 'all'},
    {id: 480, text: '地域マスコット立て看板', icon: '🔍', category: '観光・地域情報', diff: 'oni', season: 'all'},
    {id: 548, text: '銭湯煙突', icon: '🔍', category: '住宅・外構', diff: 'oni', season: 'all'}
  ]
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
  hard:   { easy: 0.10, normal: 0.30, hard: 0.50, oni: 0.10 },
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
  '線・模様観察':       4,
  '痕跡・発見':         3,
  '自然・生き物':       2,
  '街インフラ':         2,
  '季節・形・数':       2,
  '面・高さ観察':       1,
  '生活・学校':         1,
  '街構造・乗り物':     1,
  '家庭・食べ物':       1,
  '住宅・外構':         1,
  '商業・店舗':         1,
  '境界・終端・切れ目': 1,
  '接続・固定・留め具': 1,
  '素材境界・舗装差':   1,
  '道路標示・路面表示': 1,
  '舗装・縁石・路面状態': 1,
  '劣化・補修・ズレ':   1
}; // 合計 = 24

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
