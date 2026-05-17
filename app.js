// バトルモード: v1.0では封印中。有効化するには true に変更する。
const BATTLE_MODE_ENABLED = true;

// お散歩ビンゴ - Phase 2: グループ機能 + 写真機能

// カスタム確認・通知モーダル（confirm/alert の代わり）
function showConfirm(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById('dialogModal');
    const msgEl = document.getElementById('dialogMessage');
    const okBtn = document.getElementById('dialogOkBtn');
    const cancelBtn = document.getElementById('dialogCancelBtn');
    const actionsEl = document.getElementById('dialogActions');
    if (!modal || !msgEl) {
      resolve(confirm(message));
      return;
    }
    msgEl.textContent = message;
    actionsEl.classList.remove('alert-only');
    cancelBtn.style.display = '';
    const done = (result) => {
      modal.style.display = 'none';
      okBtn.onclick = null;
      cancelBtn.onclick = null;
      resolve(result);
    };
    okBtn.onclick = () => done(true);
    cancelBtn.onclick = () => done(false);
    modal.style.display = 'flex';
  });
}

function showAlert(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById('dialogModal');
    const msgEl = document.getElementById('dialogMessage');
    const okBtn = document.getElementById('dialogOkBtn');
    const cancelBtn = document.getElementById('dialogCancelBtn');
    const actionsEl = document.getElementById('dialogActions');
    if (!modal || !msgEl) {
      alert(message);
      resolve();
      return;
    }
    msgEl.textContent = message;
    actionsEl.classList.add('alert-only');
    cancelBtn.style.display = 'none';
    const done = () => {
      modal.style.display = 'none';
      okBtn.onclick = null;
      resolve();
    };
    okBtn.onclick = done;
    modal.style.display = 'flex';
  });
}

function getBattleBackendConfig() {
  const cfg = window.OSANPO_BATTLE_CONFIG || {};
  const url = typeof cfg.supabaseUrl === 'string' ? cfg.supabaseUrl.trim() : '';
  const key = typeof cfg.supabaseAnonKey === 'string' ? cfg.supabaseAnonKey.trim() : '';
  const enabled = Boolean(url && key);
  return { enabled, url, key };
}

function getBattleRandomId() {
  // localStorage を使用（sessionStorageはタブを閉じると消えIDが変わりcreator判定が壊れるため）
  let id = localStorage.getItem('osanpo_battle_player_id');
  if (!id) {
    id = 'bp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('osanpo_battle_player_id', id);
  }
  return id;
}

// バトルモード: プレイヤー色の定義（参加順に割り当て）
const PLAYER_COLORS = ['blue', 'red', 'yellow', 'green'];
/** 1ルームに参加できる最大人数（作成者含む） */
const MAX_BATTLE_PLAYERS = 3;
/**
 * プレゼンスレコードに使う cell_index のベース値（ゲームセル 0-24 の範囲外）。
 * blue=25, red=26, yellow=27, green=28 に対応。
 */
const PRESENCE_CELL_BASE = 25;

function makeBattlePlayerId(name, color, randomId) {
  const safeName = (name || '').trim() || '名無しさん';
  const safeColor = PLAYER_COLORS.includes(color) ? color : 'blue';
  return `${safeName}::${safeColor}::${randomId}`;
}

function parseOwnerName(ownerUserId) {
  if (!ownerUserId) return '名無しさん';
  const parts = ownerUserId.split('::');
  return parts[0] || '名無しさん';
}

function parseOwnerColor(ownerUserId) {
  if (!ownerUserId) return 'blue';
  const parts = ownerUserId.split('::');
  // 新形式: name::color::randomId
  if (parts.length >= 3 && PLAYER_COLORS.includes(parts[1])) return parts[1];
  // 旧形式: name::randomId → randomIdをハッシュして色を決定
  const randomPart = parts[parts.length - 1];
  let hash = 0;
  for (const char of randomPart) hash = (hash * 31 + char.charCodeAt(0)) & 0xffff;
  return PLAYER_COLORS[hash % 4];
}

// ── Google Analytics カスタムイベント送信ヘルパー ──────────────────────────
function sendGA(eventName, params) {
  if (typeof gtag === 'function') {
    try { gtag('event', eventName, params); } catch (e) {}
  }
}

class OsanpoBingo {
  constructor() {
    this.boardSize = 5;
    this.board = [];              // 25個のお題オブジェクト {text, icon}
    this.markedCells = new Set(); // マーク済みのインデックス
    this.bingoLines = [];         // 揃ったラインの配列
    this.reachLines = [];         // リーチ中のラインの配列（4/5マーク済み）
    
    // Phase 2: グループ機能
    this.roomCode = '';           // 合言葉
    this.difficulty = 'normal';   // 難易度
    this.topicSetId = 'default';    // お題セット（将来の課金・コラボ拡張用ID）
    this.userId = '';             // ユーザーID
    this.playerCount = 1;         // 参加人数
    
    // Phase 2: 写真機能
    this.photos = {};             // {index: ObjectURL} 表示用（base64ではない）
    this.photoBlobs = {};         // {index: Blob} IDB保存・グリッド生成用
    this.photoStorage = new PhotoStorage(); // IndexedDB ラッパー
    this.currentPhotoIndex = null; // 現在写真を撮影中のインデックス
    this.tempPhotoBlob = null;    // 選択中の写真 Blob（保存前）
    
    // フリー入力マス
    this.customTopics = [];       // ユーザーが入力したカスタムお題 [{text, icon}]
    
    // 遊び方（写真で記録 / マークだけ）
    this.playMode = 'photo';      // 'photo' | 'markOnly'
    this.gameStartTime = null;    // ゲーム開始時刻（プレイ時間表示用）
    this.playTimerInterval = null; // プレイ時間更新タイマー
    this._nextLongPlayCheckMs = null; // 長時間プレイ確認の次回チェック時刻（null=未初期化）
    this.gameType = 'normal';     // 'normal' | 'battle'
    this.landmarkMode = false;    // ランドマークモード ON/OFF
    this.landmarkRegion = 'all'; // 観光地エリア（'all' or 都道府県名）
    this.battleCellOwners = {};  // バトル用: {cellIndex: userId}
    this.battleBingoOwners = {};  // バトル用: {lineIndex: userId} ビンゴ成立権
    this.battleOpponentPhotos = {}; // バトル用: {cellIndex: base64DataUrl} 相手の写真キャッシュ
    this.battlePresencePlayers = new Set(); // バトル用: 参加者全員のplayerIdセット
    this.lastClaimedCellIndex = null; // 直近でクレームしたセルインデックス
    this.battlePlayerId = makeBattlePlayerId('', 'blue', getBattleRandomId());
    this.battleBackend = getBattleBackendConfig();
    this.battleTable = 'battle_cell_owners';
    this.battleSyncTimer = null;
    this._battlePaused = false; // true=一時保存済み（退出時にサーバーデータを残す）
    this.debugBattle = new URLSearchParams(window.location.search).get('debugBattle') === '1';
    this._resultImageBlob = null; // 結果画面用キャッシュ済みblob（ライブラリ保存の事前生成）
    this.lastBattleSyncAt = 0;
    this.lastBattleSyncStatus = 'idle';
    this.lastBattleSyncError = '';
    this.debugPanelEl = null;

    // 移動距離トラッキング
    this.totalDistance = 0;      // 累積メートル
    this.lastPosition = null;    // 最後の GeolocationCoordinates
    this.watchId = null;         // watchPosition ID
    // 'idle' | 'active' | 'denied' | 'unavailable'
    this.locationState = 'idle';

    // DOM要素（初期化時に取得）
    this.boardElement = null;
    this.messageElement = null;
    this.bingoCountElement = null;
    this.markedCountElement = null;
    this.photoCountElement = null;
    this.roomCodeDisplay = null;
    this.difficultyDisplay = null;
    this.playerCountDisplay = null;
    this.opponentClaimedCountElement = null;
    this.distanceElement = null;
  }
  
  // 初期化
  init() {
    // ユーザーIDを取得・生成
    this.userId = getUserId();
    
    // DOM要素を取得
    this.boardElement = document.getElementById('bingoBoard');
    this.messageElement = document.getElementById('bingoMessage');
    this.bingoCountElement = document.getElementById('bingoCount');
    this.markedCountElement = document.getElementById('markedCount');
    this.photoCountElement = document.getElementById('photoCount');
    this.roomCodeDisplay = document.getElementById('roomCodeDisplay');
    this.difficultyDisplay = document.getElementById('difficultyDisplay');
    this.playerCountDisplay = document.getElementById('playerCountDisplay');
    this.opponentClaimedCountElement = document.getElementById('opponentClaimedCount');
    this.distanceElement = document.getElementById('distanceDisplay');
    
    if (!this.boardElement) {
      console.error('❌ bingoBoard 要素が見つかりません');
      return;
    }
    this.setupDebugPanel();
    
    // イベントリスナーを設定
    this.setupEventListeners();
    
    // LocalStorageから読み込み
    const loaded = this.loadFromStorage();

    // IndexedDB 写真ロード（非同期・旧 localStorage 写真は自動マイグレーション）
    this.photoStorage.init()
      .then(() => this.initPhotosFromIDB(this._legacyPhotos))
      .then(() => { delete this._legacyPhotos; })
      .catch(e => console.warn('PhotoStorage init error:', e));

    if (!loaded || this.board.length !== 25) {
      this.showRoomCodeModal();
    } else {
      // 一時保存済み（_battlePaused=true）以外はリフレッシュとみなして確認なしに自動再開。
      // ソロ・バトル問わず「作り直す」ボタンがゲーム画面にあるため毎回確認する必要はない。
      const autoResume = !this._battlePaused;

      // resume=true: 続きから / false: 新しく始める
      const doResume = async (resume) => {
        if (!resume) {
          // 新しく始める: 保存データを削除してモーダルを表示
          try { localStorage.removeItem(this._storageKey); } catch {}
          this.board = [];
          this.gameType = 'normal';
          this.roomCode = '';
          this.showRoomCodeModal();
          return;
        }
        // 続きから: 既存データを使用
        const roomModal = document.getElementById('roomCodeModal');
        if (roomModal) roomModal.style.display = 'none';
        if (BATTLE_MODE_ENABLED && this.gameType === 'battle') {
          // battleBingoOwners はキャッシュから復元されるが、battleCellOwners から再計算して正確にする
          this.battleBingoOwners = this.recomputeBattleBingoOwners();
        }
        this.renderBoard();
        this.checkBingo();
        this.updateStats();
        // 「続きから」選択 = 再開の意思 → モード共通で _battlePaused をリセット＆永続化。
        // これをしないと「一時保存」後に続きから選んでもリフレッシュのたびにモーダルが出続ける。
        this._battlePaused = false;
        this.saveToStorage();
        if (BATTLE_MODE_ENABLED && this.gameType === 'battle') {
          // 再起動後も相手のリストに表示されるようプレゼンスを再登録（冪等）
          this.registerPlayerPresence();
          // 初回 sync を await してから描画済み状態を上書き（stale flash 防止）
          await this.syncBattleOwnersFromServer();
          this.startBattleSyncLoop(/* skipInitialSync= */ true);
        } else {
          this.stopBattleSyncLoop();
        }
        this.startLocationTracking();
        // 復元されたゲームでも3時間・24時間タイマーを有効にする
        this.startPlayTimer();
      };

      if (autoResume) {
        // バトル進行中リフレッシュ: モーダルを出さずにそのまま再開
        doResume(true);
      } else {
        this._showResumeModal().then(doResume);
      }
    }

  }
  
  // イベントリスナーを設定
  setupEventListeners() {
    // ビンゴボード（イベント委譲）
    if (this.boardElement) {
      // 左クリック
      this.boardElement.addEventListener('click', (e) => {
        const cell = e.target.closest('.bingo-cell');
        if (cell) {
          const index = parseInt(cell.dataset.index);
          this.handleCellClick(index);
        }
      });
      
    }
    
    // 作り直すボタン
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
      newGameBtn.addEventListener('click', () => this.newGame());
    }

    // 遊び方（？）ボタン
    const howToPlayBtn = document.getElementById('howToPlayBtn');
    if (howToPlayBtn) {
      howToPlayBtn.addEventListener('click', () => this.showHowToPlay());
    }

    // 終わるボタン
    const endGameBtn = document.getElementById('endGameBtn');
    if (endGameBtn) {
      endGameBtn.addEventListener('click', () => this.endGame());
    }

    // 途中保存ボタン（バトル：作成者のみ表示 / スタンダード：常に表示）
    const pauseGameBtn = document.getElementById('pauseGameBtn');
    if (pauseGameBtn) {
      pauseGameBtn.addEventListener('click', async () => {
        const ok = await showConfirm(
          this.gameType === 'battle'
            ? `ゲームを一時保存して中断しますか？\n\n同じ合言葉「${this.roomCode}」で再入室すれば続きから遊べます。`
            : 'ゲームを一時保存して中断しますか？\n\n次回同じデバイスで game.html を開くと続きから遊べます。'
        );
        if (!ok) return;
        await this.pauseAndGoToTop();
      });
    }

    // ← トップボタン：結果（写真保存）画面を経由してからトップへ
    const backToTopBtn = document.getElementById('footerBackToTop');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.endGame();
      });
    }
    
    // 結果画面：決定・ダウンロード・共有・戻る
    this.setupResultView();
    
    // 合言葉をクリックでコピー
    const roomCodeStat = document.getElementById('roomCodeStat');
    if (roomCodeStat) {
      roomCodeStat.addEventListener('click', () => this.copyRoomCode());
    }

    // 距離表示タップ → GPS 許諾を再リクエスト
    const distanceStat = document.getElementById('distanceStat');
    if (distanceStat) {
      distanceStat.addEventListener('click', () => this.handleDistanceTap());
    }
    
    // 合言葉モーダル
    this.setupRoomCodeModal();
    this.populateTopicSetSelects();
    ['topicSetSelectSolo', 'topicSetSelectCreate', 'topicSetSelectJoin'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => this.updateTopicSetHelpFor(el));
    });
    
    // 写真モーダル
    this.setupPhotoModal();

    // バトル: 相手マス閲覧モーダルを閉じる
    const closeBattleViewBtn = document.getElementById('closeBattleViewModal');
    const battleViewModal = document.getElementById('battleViewModal');
    if (closeBattleViewBtn && battleViewModal) {
      closeBattleViewBtn.addEventListener('click', () => {
        battleViewModal.style.display = 'none';
      });
      battleViewModal.addEventListener('click', (e) => {
        if (e.target === battleViewModal) battleViewModal.style.display = 'none';
      });
    }

    document.addEventListener('visibilitychange', () => {
      if (!BATTLE_MODE_ENABLED) return;
      if (document.visibilityState === 'visible') {
        // skipInitialSync=true にして startBattleSyncLoop 内の自動sync呼び出しを抑制し、
        // 直後の syncBattleOwnersFromServer 1回だけ走らせる（二重fetch防止）
        this.startBattleSyncLoop(/* skipInitialSync= */ true);
        this.syncBattleOwnersFromServer();
      } else {
        this.stopBattleSyncLoop();
      }
    });
  }
  
  // ボードを作成（お題を配置）
  // shuffleSalt: 指定すると毎回異なるシャッフル（作り直し用）
  // customTopics: フリー入力マスのお題配列 [{text, icon}]
  createBoard(roomCode = '', difficulty = 'normal', shuffleSalt = '', customTopics = null) {
    // 合言葉と難易度を保存
    this.roomCode = roomCode || this.roomCode || '';
    this.difficulty = difficulty || this.difficulty || 'normal';
    
    // カスタムトピックを保存（渡されなければ既存を維持）
    if (customTopics !== null) {
      this.customTopics = customTopics;
    }
    
    // カスタムトピックの数だけランダムお題を減らす
    const customCount = this.customTopics.length;
    const randomCount = 24 - customCount;
    
    // 合言葉がある場合は全員同じボードになるよう userId・salt をシードから除外
    const isShared = this.roomCode && this.roomCode !== 'solo';
    const seedUserId = isShared ? '' : this.userId;
    const seedSalt   = isShared ? '' : shuffleSalt;

    // 難易度に応じてランダムお題を取得
    const randomTopics = selectTopicsForGame(
      this.difficulty,
      this.roomCode,
      seedUserId,
      seedSalt,
      this.topicSetId || 'default',
      this.topicSetId || 'default',
      this.landmarkRegion || 'all'
    ).slice(0, randomCount);

    // カスタムお題 + ランダムお題を合わせてシャッフル
    const allTopics = [...this.customTopics, ...randomTopics];
    const seedStr = [this.roomCode, seedUserId, seedSalt, 'mix', this.topicSetId || 'default'].filter(Boolean).join('-');
    const seed = stringToSeed(seedStr);
    console.log(`[board seed] isShared=${isShared} seedStr="${seedStr}" seed=${seed}`);
    // シャッフル後に四隅制約を適用（ガチおに以外はおにが四隅に来ないよう保証）
    const shuffledTopics = enforceCornerConstraint(
      shuffleWithSeed(allTopics, seed),
      this.difficulty
    );

    // 25マスのボードを作成（中央12番は常に☆フリーマス）
    this.board = [];
    const lmDB = typeof getLandmarksByRegion === 'function'
      ? getLandmarksByRegion(this.landmarkRegion)
      : (typeof landmarkDatabase !== 'undefined' ? landmarkDatabase : []);
    if (this.landmarkMode && lmDB.length > 0) {
      // ランドマークモード: 中央は常に☆フリーマス、12以外の位置にランドマーク配置
      const lmSeed = stringToSeed([this.roomCode, seedUserId, seedSalt, 'lm'].filter(Boolean).join('-'));
      const lmRng = createRng(lmSeed);
      const count = this._getLandmarkCount(lmRng);
      const landmarkPositions = new Set();
      const extraCandidates = shuffleWithSeed([...Array(25).keys()].filter(p => p !== 12), lmSeed + 1);
      for (let i = 0; i < count && i < extraCandidates.length; i++) {
        landmarkPositions.add(extraCandidates[i]);
      }
      let topicIdx = 0;
      for (let i = 0; i < 25; i++) {
        if (i === 12) {
          // 中央は常に☆フリーマス（写真・操作不可）
          this.board.push({text: '', icon: '⭐', isFree: true});
        } else if (landmarkPositions.has(i)) {
          const lm = lmDB[Math.floor(lmRng() * lmDB.length)];
          this.board.push({...lm, isLandmark: true});
        } else {
          this.board.push(shuffledTopics[topicIdx++]);
        }
      }
    } else {
      // 通常モード: 中央はFREEスター
      for (let i = 0; i < 25; i++) {
        if (i === 12) {
          this.board.push({text: '', icon: '⭐', isFree: true});
        } else {
          const topicIndex = i < 12 ? i : i - 1;
          this.board.push(shuffledTopics[topicIndex]);
        }
      }
    }
    
    // マークと写真をクリア
    this.markedCells.clear();
    this.bingoLines = [];
    this._revokeAllPhotoURLs();
    this.photos = {};
    this.photoBlobs = {};
    this.battleCellOwners = {};
    this.battleOpponentPhotos = {};
    // IDB の写真も非同期クリア（エラーは無視）
    this.photoStorage.clearAll().catch(() => {});

    // ボードを初回描画（checkBingo は updateBoardOwnership のみなので明示的に呼ぶ）
    this.renderBoard();

    // 保存
    this.saveToStorage();
  }

  async syncBattleOwnersFromServer() {
    if (this._battlePaused) return; // ポーズ中はサーバー同期をスキップ
    if (this.gameType !== 'battle' || !this.battleBackend.enabled || !this.roomCode || this.roomCode === 'solo') {
      return;
    }
    try {
      const encodedRoom = encodeURIComponent(this.roomCode);
      const syncUrl = `${this.battleBackend.url}/rest/v1/${this.battleTable}?select=cell_index,owner_user_id&room_code=eq.${encodedRoom}`;
      const res = await fetch(syncUrl, {
        headers: {
          apikey: this.battleBackend.key,
          Authorization: `Bearer ${this.battleBackend.key}`
        }
      });
      if (!res.ok) {
        this.lastBattleSyncStatus = `http_${res.status}`;
        this.lastBattleSyncError = 'sync_get_failed';
        this.updateDebugPanel();
        return;
      }
      const rows = await res.json();
      const nextOwners = {};
      const nextPresence = new Set();
      (rows || []).forEach((row) => {
        const idx = Number(row?.cell_index);
        const ownerId = typeof row?.owner_user_id === 'string' ? row.owner_user_id : '';
        if (!ownerId || !Number.isInteger(idx)) return;
        // __settings__: プレフィックス → ルーム設定レコード。creatorId を presence に追加してスキップ
        if (ownerId.startsWith('__settings__:')) {
          try {
            const s = JSON.parse(ownerId.slice('__settings__:'.length));
            if (s.creatorId) nextPresence.add(s.creatorId);
          } catch {}
          return;
        }
        // cell_index 25+ → プレゼンスレコード（ゲームセル範囲外）
        if (idx >= PRESENCE_CELL_BASE) {
          nextPresence.add(ownerId);
          return;
        }
        // cell_index 0-24 → ゲームセルのクレーム
        if (idx >= 0 && idx <= 24) nextOwners[idx] = ownerId;
      });
      // プレゼンス差分チェック（スコアボード再描画が必要か判断）
      const presenceChanged = [...nextPresence].sort().join(',') !== [...this.battlePresencePlayers].sort().join(',');
      this.battlePresencePlayers = nextPresence;
      // 差分チェック: owners が変わっていなければ DOM 更新をスキップして点滅を防ぐ
      const changed = presenceChanged || JSON.stringify(nextOwners) !== JSON.stringify(this.battleCellOwners);
      this.battleCellOwners = nextOwners;
      // BINGO 所有権をサーバーデータから決定論的に再計算（全端末で一致させる）
      this.battleBingoOwners = this.recomputeBattleBingoOwners();
      if (changed) {
        this.checkBingo();   // updateBoardOwnership() + bingo celebration
        this.updateStats();
        this.saveToStorage();
      }
      this.lastBattleSyncAt = Date.now();
      this.lastBattleSyncStatus = 'ok';
      this.lastBattleSyncError = '';
      this.updateDebugPanel();
    } catch (e) {
      console.warn('battle owners sync failed', e);
      this.lastBattleSyncStatus = 'exception';
      this.lastBattleSyncError = e?.message || 'unknown';
      this.updateDebugPanel();
    }
  }

  startBattleSyncLoop(skipInitialSync = false) {
    this.stopBattleSyncLoop();
    if (this._battlePaused) return; // ポーズ中は再起動しない
    if (this.gameType !== 'battle' || !this.battleBackend.enabled || !this.roomCode || this.roomCode === 'solo') {
      return;
    }
    // skipInitialSync=true のときは初回を省略（呼び出し元が await 済みの場合）
    if (!skipInitialSync) this.syncBattleOwnersFromServer();
    this.battleSyncTimer = setInterval(() => {
      this.syncBattleOwnersFromServer();
    }, 2000);
  }

  stopBattleSyncLoop() {
    if (this.battleSyncTimer) {
      clearInterval(this.battleSyncTimer);
      this.battleSyncTimer = null;
    }
  }

  /**
   * プレゼンスレコードを Supabase に登録する。
   * cell_index = PRESENCE_CELL_BASE + color_index（25-28）に owner_user_id を INSERT。
   * ignore-duplicates なので再ログイン時も冪等に動作する。
   * これにより相手がまだセルをクレームしていない段階でもスコアボードに表示される。
   */
  async registerPlayerPresence() {
    if (!this.battleBackend.enabled || !this.roomCode || this.roomCode === 'solo') return;
    const { url, key } = this.battleBackend;
    const color = parseOwnerColor(this.battlePlayerId);
    const presenceIdx = PRESENCE_CELL_BASE + PLAYER_COLORS.indexOf(color);
    try {
      await fetch(`${url}/rest/v1/${this.battleTable}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: 'resolution=ignore-duplicates,return=minimal'
        },
        body: JSON.stringify({
          room_code: this.roomCode,
          cell_index: presenceIdx,
          owner_user_id: this.battlePlayerId
        })
      });
    } catch (e) {
      console.warn('registerPlayerPresence failed:', e);
    }
  }

  /**
   * 保存データ復元確認モーダルを表示して Promise<boolean> を返す。
   * true = 続きから / false = 新しく始める
   */
  _showResumeModal() {
    return new Promise((resolve) => {
      const modal = document.getElementById('resumeModal');
      const continueBtn = document.getElementById('resumeContinueBtn');
      const newBtn = document.getElementById('resumeNewBtn');
      if (!modal || !continueBtn || !newBtn) {
        resolve(true); // モーダルがなければそのまま続きから
        return;
      }
      const done = (ok) => {
        modal.style.display = 'none';
        continueBtn.onclick = null;
        newBtn.onclick = null;
        resolve(ok);
      };
      continueBtn.onclick = () => done(true);
      newBtn.onclick    = () => done(false);
      modal.style.display = 'flex';
    });
  }

  /**
   * 遊び方モーダルを開く（常に表示）。
   * mode: 'battle' | 'normal' — 表示するスライドセットを切り替える。
   * closeCb: モーダルを閉じたときのコールバック（省略可）。
   */
  _openTutorialModal(mode, closeCb) {
    const modal   = document.getElementById('battleTutorialModal');
    const dotsEl  = document.getElementById('tutorialDots');
    const prevBtn = document.getElementById('tutorialPrevBtn');
    const nextBtn = document.getElementById('tutorialNextBtn');
    if (!modal) { closeCb?.(); return; }

    // モード一致スライドだけを有効スライドとして収集
    const allSlides = Array.from(modal.querySelectorAll('.tutorial-slide'));
    const slides = allSlides.filter(s => {
      const m = s.dataset.mode;
      return !m || m === mode;
    });
    if (slides.length === 0) { closeCb?.(); return; }

    // ドットを動的生成
    if (dotsEl) {
      dotsEl.innerHTML = slides.map((_, i) =>
        `<span class="tutorial-dot${i === 0 ? ' active' : ''}" data-idx="${i}"></span>`
      ).join('');
    }
    const dots = dotsEl ? Array.from(dotsEl.querySelectorAll('.tutorial-dot')) : [];

    let current = 0;
    const total = slides.length;

    const goTo = (idx) => {
      slides[current].style.display = 'none';
      if (dots[current]) dots[current].classList.remove('active');
      current = idx;
      slides[current].style.display = '';
      if (dots[current]) dots[current].classList.add('active');
      prevBtn.style.visibility = current === 0 ? 'hidden' : '';
      nextBtn.textContent = current === total - 1 ? '閉じる ✓' : '次へ →';
    };

    dots.forEach((dot, i) => { dot.onclick = () => goTo(i); });
    prevBtn.onclick = () => { if (current > 0) goTo(current - 1); };
    nextBtn.onclick = () => {
      if (current < total - 1) {
        goTo(current + 1);
      } else {
        close();
      }
    };
    // 背景タップで閉じる
    const backdrop = modal.querySelector('.dialog-modal-backdrop');
    if (backdrop) backdrop.onclick = () => close();

    const close = () => {
      modal.style.display = 'none';
      prevBtn.onclick = null;
      nextBtn.onclick = null;
      if (backdrop) backdrop.onclick = null;
      closeCb?.();
    };

    // 全スライドを非表示にしてから有効スライドを表示
    allSlides.forEach(s => { s.style.display = 'none'; });
    slides[0].style.display = '';
    prevBtn.style.visibility = 'hidden';
    nextBtn.textContent = total === 1 ? '閉じる ✓' : '次へ →';
    modal.style.display = 'flex';
  }

  /**
   * バトルモード初回チュートリアルを表示する。
   * localStorage に完了フラグがある場合はスキップ。
   */
  _showBattleTutorial() {
    return new Promise((resolve) => {
      const DONE_KEY = 'osanpo_battle_tutorial_done';
      if (localStorage.getItem(DONE_KEY)) { resolve(); return; }
      this._openTutorialModal('battle', () => {
        localStorage.setItem(DONE_KEY, '1');
        resolve();
      });
    });
  }

  /**
   * ？ボタンからの遊び方表示（常に開く、gameType に応じてスライドを切り替え）。
   */
  showHowToPlay() {
    const mode = this.gameType === 'battle' ? 'battle' : 'normal';
    this._openTutorialModal(mode);
  }

  /**
   * バトルルームのすべてのデータをサーバーから削除する。
   * プレイヤーが退出（ゲームリセット）したときに呼び出し、
   * ルームログを蓄積させず合言葉を再利用可能にする。
   */
  async deleteRoomData(roomCode) {
    if (!this.battleBackend.enabled || !roomCode || roomCode === 'solo') return;
    try {
      const { url, key } = this.battleBackend;
      await fetch(
        `${url}/rest/v1/${this.battleTable}?room_code=eq.${encodeURIComponent(roomCode)}`,
        {
          method: 'DELETE',
          headers: { apikey: key, Authorization: `Bearer ${key}` }
        }
      );
    } catch {
      // 削除失敗は無視（次回合言葉生成で別コードを使うため問題なし）
    }
  }

  /**
   * 自分のマスだけをサーバーから削除する。
   * 参加者（非作成者）がゲームを退出するとき、カラースロットを解放して
   * 後から合言葉を再入力すれば同じルームに再参加できるようにする。
   */
  async deleteMyBattleRows(roomCode, playerId) {
    if (!this.battleBackend.enabled || !roomCode || roomCode === 'solo' || !playerId) return;
    try {
      const { url, key } = this.battleBackend;
      await fetch(
        `${url}/rest/v1/${this.battleTable}?room_code=eq.${encodeURIComponent(roomCode)}&owner_user_id=eq.${encodeURIComponent(playerId)}`,
        {
          method: 'DELETE',
          headers: { apikey: key, Authorization: `Bearer ${key}` }
        }
      );
    } catch {
      // 削除失敗は無視
    }
  }

  /** バトルルームの設定（難易度・topicSet等）をサーバーに保存 */
  async saveRoomSettingsToServer(roomCode, settings) {
    if (!this.battleBackend.enabled || !roomCode || roomCode === 'solo') return;
    const { url, key } = this.battleBackend;
    try {
      // UPSERT: 設定レコードを上書きできるよう resolution=merge-duplicates を使用
      await fetch(`${url}/rest/v1/${this.battleTable}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify({
          room_code: roomCode,
          cell_index: 12,
          owner_user_id: '__settings__:' + JSON.stringify(settings)
        })
      });
    } catch (e) {
      console.warn('saveRoomSettings failed', e);
    }
  }

  /**
   * バトルルームを「一時保存（ポーズ）」状態にする。
   * ゲーム終了時にサーバーデータを削除せず、次回同じ合言葉で再入室すると再開できる。
   * ルーム作成者のみが呼び出し可能。
   */
  async pauseBattleGame() {
    if (!this.battleBackend.enabled || !this.roomCode || this.roomCode === 'solo') return;
    // fetchRoomSettings が null を返した場合はローカルの設定値でフォールバック。
    // null のまま {} に paused だけ書くと difficulty 等の既存設定が失われる。
    const existing = await this.fetchRoomSettings(this.roomCode);
    const settings = existing ?? {
      difficulty:   this.difficulty,
      topicSetId:   this.topicSetId,
      landmarkMode: this.landmarkMode,
      landmarkRegion: this.landmarkRegion,
      playMode:     this.playMode,
      creatorId:    this.battlePlayerId,
      customTopics: this.customTopics || []
    };
    settings.paused    = true;
    settings.pauseTime = Date.now();
    await this.saveRoomSettingsToServer(this.roomCode, settings);
    // _battlePaused は pauseAndGoToTop() 側で await より前にセット済み
  }

  /** バトルルームの設定をサーバーから取得 */
  async fetchRoomSettings(roomCode) {
    if (!this.battleBackend.enabled || !roomCode || roomCode === 'solo') return null;
    const { url, key } = this.battleBackend;
    try {
      const res = await fetch(
        `${url}/rest/v1/${this.battleTable}?room_code=eq.${encodeURIComponent(roomCode)}&cell_index=eq.12&select=owner_user_id`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      );
      if (!res.ok) return null;
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const raw = rows[0].owner_user_id || '';
        const json = raw.startsWith('__settings__:') ? raw.slice('__settings__:'.length) : raw;
        return JSON.parse(json);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // 戻り値: 'claimed'=新規取得成功 / 'self'=自分が既に所持（冪等） / 'taken'=他人が先取り
  // photoData: base64 data URL（Supabase RLS がUPDATEを許可しないためINSERT時にまとめて送信）
  async claimBattleCellOnServer(index) {
    if (this.gameType !== 'battle' || !this.battleBackend.enabled || !this.roomCode || this.roomCode === 'solo') {
      return 'claimed';
    }
    if (index < 0 || index >= 25) return 'claimed';
    if (index === 12) return 'claimed'; // フリーマス / 設定スロット — 絶対にclaimしない
    const { url, key } = this.battleBackend;

    // POST（先着取得試行: room_code + cell_index の UNIQUE 制約で早い者勝ち）
    // photo_data はサイズが大きいため別リクエスト(uploadPhotoCellOnServer)で送る
    const postBody = {
      room_code: this.roomCode,
      cell_index: index,
      owner_user_id: this.battlePlayerId
    };
    const postRes = await fetch(`${url}/rest/v1/${this.battleTable}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        // return=minimal: レスポンスボディなし。photo_data を送り返さず帯域節約。
        // 201 Created = 新規INSERT成功（クレーム取得）
        // 200 OK      = UNIQUE重複でスキップ（既に誰かが所持）
        Prefer: 'resolution=ignore-duplicates,return=minimal'
      },
      body: JSON.stringify(postBody)
    });
    if (!postRes.ok) {
      this.lastBattleSyncStatus = `claim_http_${postRes.status}`;
      this.lastBattleSyncError = 'claim_failed';
      this.updateDebugPanel();
      throw new Error(`claim failed: ${postRes.status}`);
    }

    // 取得成功（201 = 新規INSERT）
    if (postRes.status === 201) {
      this.lastBattleSyncStatus = 'claim_ok';
      this.lastBattleSyncError = '';
      this.updateDebugPanel();
      return 'claimed';
    }

    // 空配列 → 既に誰かが持っている → GET で実オーナーを確認（冪等性チェック）
    let getRows = [];
    try {
      const getRes = await fetch(
        `${url}/rest/v1/${this.battleTable}?room_code=eq.${encodeURIComponent(this.roomCode)}&cell_index=eq.${index}&select=owner_user_id`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      );
      getRows = await getRes.json();
    } catch (e) {
      console.warn('battle claim GET failed', e);
      this.lastBattleSyncStatus = 'claim_get_failed';
      this.lastBattleSyncError = e?.message || 'unknown';
      this.updateDebugPanel();
      return 'unknown';
    }
    if (Array.isArray(getRows) && getRows.length > 0 && getRows[0].owner_user_id === this.battlePlayerId) {
      this.lastBattleSyncStatus = 'claim_ok';
      this.lastBattleSyncError = '';
      this.updateDebugPanel();
      return 'self';
    }

    await this.syncBattleOwnersFromServer();
    this.lastBattleSyncStatus = 'claim_taken';
    this.lastBattleSyncError = '';
    this.updateDebugPanel();
    return 'taken';
  }
  
  // ボードをレンダリング
  renderBoard() {
    if (!this.boardElement) return;
    
    this.boardElement.innerHTML = '';
    
    this.board.forEach((topic, index) => {
      const cell = document.createElement('div');
      cell.className = 'bingo-cell';
      cell.dataset.index = index;
      const ownerId = this.getCellOwnerId(index);
      
      // ランドマーククラス
      if (!topic.isFree && topic.type === 'landmark') {
        cell.classList.add('cell-landmark');
      }

      // 写真がある場合（上に写真・下にテキストの構成で描画）
      const hasPhoto = !!this.photos[index];
      if (hasPhoto) {
        cell.classList.add('has-photo');
      }
      
      // マーク状態（バトル時は所有者ベースで判定）
      const isMarked = topic.isFree || (
        this.gameType === 'battle'
          ? ownerId === this.battlePlayerId
          : this.markedCells.has(index)
      );
      if (isMarked) {
        cell.classList.add('marked');
      }
      
      // FREEの場合
      if (topic.isFree) {
        cell.classList.add('free');
      }
      
      // カスタムお題の場合
      if (topic.isCustom) {
        cell.classList.add('custom');
      }
      
      // ビンゴラインに含まれる場合
      const isInBingoLine = this.bingoLines.some(line => line.includes(index));
      if (isInBingoLine) {
        cell.classList.add('bingo');
      }
      // リーチラインの「残り1マス（誰にも取られていないマス）」のみ点滅
      // バトルでは相手取得済みも含めて isAnyCellClaimed でチェックする
      const isUnclaimedReach = !isInBingoLine && !this.isAnyCellClaimed(index) &&
        this.reachLines.some(line => line.includes(index));
      if (isUnclaimedReach) {
        cell.classList.add('reach');
      }
      if (this.gameType === 'battle' && ownerId) {
        const color = parseOwnerColor(ownerId);
        cell.classList.add('claimed', `claimed-${color}`);
        if (ownerId !== this.battlePlayerId) {
          cell.classList.add('locked');
        } else {
          cell.classList.add('claimed-self');
        }
      }
      
      // 中央マスはテキスト非表示（ランドマークは表示）
      const displayText = (index === 12 && !topic.isLandmark) ? '' : topic.text;
      const textLen = displayText.length;
      let sizeClass = '';
      if (textLen <= 2)       sizeClass = 'cell-text-s';
      else if (textLen <= 4)  sizeClass = 'cell-text-m';
      else if (textLen <= 8)  sizeClass = 'cell-text-l';
      else if (textLen <= 12) sizeClass = 'cell-text-xl';
      else                    sizeClass = 'cell-text-xxl';

      if (textLen >= 9)       cell.classList.add('cell-len-xxl');
      else if (textLen >= 5)  cell.classList.add('cell-len-l');

      if (hasPhoto) {
        cell.innerHTML = displayText
          ? `<div class="cell-photo-wrap"><img class="cell-photo-img" src="${this.photos[index]}" alt=""></div><div class="cell-text ${sizeClass}">${displayText}</div>`
          : `<div class="cell-photo-wrap"><img class="cell-photo-img" src="${this.photos[index]}" alt=""></div>`;
      } else {
        cell.innerHTML = displayText
          ? `${getTopicIcon(topic)}<div class="cell-text ${sizeClass}">${displayText}</div>`
          : getTopicIcon(topic);
      }
      
      // アクセシビリティ
      cell.setAttribute('role', 'button');
      cell.setAttribute('tabindex', '0');
      cell.setAttribute('aria-label', index === 12 ? '中央マス（最初からマーク済み）' : topic.text);
      cell.setAttribute('aria-pressed', this.markedCells.has(index) ? 'true' : 'false');
      
      this.boardElement.appendChild(cell);
    });

    // レイアウト確定後にテキストフィット（rAFで計測タイミングを保証）
    requestAnimationFrame(() => {
      this.boardElement.querySelectorAll('.bingo-cell').forEach(c => {
        this.fitCellText(c);
      });
    });
  }

  // セルの状態（写真・マーク・ビンゴライン・所有者色）を差分更新
  // DOM再構築なし。写真の追加/削除は単一セルだけ DOM パッチで対応（flicker防止）
  updateBoardOwnership() {
    if (!this.boardElement) return;
    this.boardElement.querySelectorAll('.bingo-cell').forEach(cell => {
      const index = parseInt(cell.dataset.index, 10);
      if (isNaN(index)) return;
      const topic = this.board[index];
      if (!topic) return;
      const ownerId = this.getCellOwnerId(index);
      const isInBingoLine = this.bingoLines.some(line => line.includes(index));
      // バトル: 自分の所有か / 非バトル: markedCells に存在するか
      const isMarked = topic.isFree || (
        this.gameType === 'battle'
          ? ownerId === this.battlePlayerId
          : this.markedCells.has(index)
      );
      // バトルでは相手取得済みも含めて isAnyCellClaimed でチェックする
      const isUnclaimedReach = !isInBingoLine && !this.isAnyCellClaimed(index) &&
        this.reachLines.some(line => line.includes(index));

      // 写真DOMの同期：this.photos[index] と DOM の状態が乖離していたら修正
      const photoUrl = this.photos[index] || '';
      const cellHasPhotoClass = cell.classList.contains('has-photo');
      if (photoUrl && !cellHasPhotoClass) {
        // 写真が新規追加 → 既存アイコンを除去してから先頭に photo-wrap を挿入
        // （renderBoard と同じ構成にする：cell-icon が残ると写真と半々になるバグを防ぐ）
        const existingIcon = cell.querySelector('.cell-icon');
        if (existingIcon) existingIcon.remove();
        const wrap = document.createElement('div');
        wrap.className = 'cell-photo-wrap';
        const img = document.createElement('img');
        img.className = 'cell-photo-img';
        img.src = photoUrl;
        img.alt = '';
        wrap.appendChild(img);
        cell.insertBefore(wrap, cell.firstChild);
        cell.classList.add('has-photo');
      } else if (!photoUrl && cellHasPhotoClass) {
        // 写真が削除された
        const wrap = cell.querySelector('.cell-photo-wrap');
        if (wrap) wrap.remove();
        cell.classList.remove('has-photo');
      } else if (photoUrl) {
        // 写真URLが差し替わっていれば src を更新
        const img = cell.querySelector('.cell-photo-img');
        if (img && img.src !== photoUrl) img.src = photoUrl;
      }

      cell.classList.toggle('marked', isMarked);
      cell.classList.toggle('bingo', isInBingoLine);
      cell.classList.toggle('reach', isUnclaimedReach);

      // 所有者色クラスをリセットしてから付与
      ['claimed', 'claimed-self', 'locked',
       'claimed-green', 'claimed-blue', 'claimed-red', 'claimed-yellow'].forEach(c => cell.classList.remove(c));
      if (ownerId) {
        const color = parseOwnerColor(ownerId);
        cell.classList.add('claimed', `claimed-${color}`);
        if (ownerId !== this.battlePlayerId) {
          cell.classList.add('locked');
        } else {
          cell.classList.add('claimed-self');
        }
      }
    });
  }

  // テキストがセル幅に収まるようにfont-sizeを縮小する
  // cell-text-xl / cell-text-xxl は CSS 側で折り返しが設定済みのためスキップ
  fitCellText(cell) {
    const textEl = cell.querySelector('.cell-text');
    if (!textEl || !textEl.textContent.trim()) return;

    // インラインスタイルをリセット（クローン引き継ぎ・再計測時の残骸を除去）
    textEl.style.fontSize = '';
    textEl.style.whiteSpace = '';
    textEl.style.lineHeight = '';

    const MIN_PX = 9;

    // xl/xxl はCSS側で2行折り返し済み → 強制縮小しない
    if (textEl.classList.contains('cell-text-xl') || textEl.classList.contains('cell-text-xxl')) return;

    // はみ出しがなければそのまま終了
    if (textEl.scrollWidth <= textEl.offsetWidth) return;

    let pxSize = parseFloat(getComputedStyle(textEl).fontSize);
    while (textEl.scrollWidth > textEl.offsetWidth + 1 && pxSize > MIN_PX) {
      pxSize -= 0.5;
      textEl.style.fontSize = pxSize + 'px';
    }
  }

  // セルクリック処理
  async handleCellClick(index) {
    if (this.board[index]?.isFree) return;
    // 連打ガード: 非同期 sync 中に別のタップが重なってモーダルが二重起動するのを防ぐ
    if (this._cellClickBusy) return;
    this._cellClickBusy = true;
    try {
      if (this.gameType === 'battle' && this.battleBackend.enabled && this.roomCode && this.roomCode !== 'solo') {
        // await しない: バックグラウンドで最新状態を取得しつつ、現在の battleCellOwners
        // でモーダルを即座に開いてレスポンスを改善（2秒ループで既に最新に近い）
        this.syncBattleOwnersFromServer().catch(() => {});
      }

      const ownerId = this.getCellOwnerId(index);
      if (this.gameType === 'battle' && ownerId && ownerId !== this.battlePlayerId) {
        // 相手が取得したマス → 写真モーダルを表示
        this.showBattleOpponentPhotoModal(index, ownerId);
        return;
      }

      if (this.playMode === 'markOnly') {
        if (this.gameType === 'battle') {
          // バトルでは markOnly でも写真撮影でマス取得 → モーダルを開く（alert なし）
          this.showCellModal(index);
          return;
        }
        this.toggleMark(index);
        return;
      }
      this.showCellModal(index);
    } finally {
      this._cellClickBusy = false;
    }
  }
  
  // ビンゴ判定
  isCellClaimed(index) {
    if (this.board[index]?.isFree) return true;
    if (this.gameType === 'battle') {
      return this.battleCellOwners[index] === this.battlePlayerId;
    }
    return this.markedCells.has(index);
  }

  // GA用ゲームタイプ文字列
  _gaGameType() {
    if (this.gameType === 'battle') return 'battle';
    return this.roomCode === 'solo' ? 'solo' : 'group';
  }

  // GA用 tier別マス集計
  _gaTierCounts() {
    const nonFree = this.board.map((c, i) => ({...c, idx: i})).filter(c => !c.isFree);
    const f = {1:0,2:0,3:0,4:0};
    const e = {1:0,2:0,3:0,4:0};
    nonFree.forEach(cell => {
      const t = Math.min(4, Math.max(1, cell.diff || 2));
      if (this.markedCells.has(cell.idx)) f[t]++; else e[t]++;
    });
    return { filled: f, empty: e };
  }

  checkBingo() {
    const lines = this.getAllLines();
    const newBingoLines = [];
    const newReachLines = [];

    // バトルモードでは全員の合計で5マス揃うとビンゴ成立
    const claimChecker = this.gameType === 'battle'
      ? (idx) => this.isAnyCellClaimed(idx)
      : (idx) => this.isCellClaimed(idx);

    lines.forEach((line, lineIndex) => {
      const markedCount = line.filter(claimChecker).length;
      if (markedCount === 5) {
        newBingoLines.push(line);
        // バトルモード: BINGO 所有権は recomputeBattleBingoOwners() で
        // battleCellOwners（サーバー同期済み）から決定論的に算出するため、
        // ここではローカル割り当てを行わない（sync 後に一括再計算される）。
      } else if (markedCount === 4) {
        newReachLines.push(line);
      }
    });

    const oldBingoCount = this.bingoLines.length;
    // 既存リーチラインをキーセットに変換（新規ラインを正確に検出するため）
    const oldReachKeys = new Set(this.reachLines.map(l => l.join(',')));
    this.bingoLines = newBingoLines;
    this.reachLines = newReachLines;
    const newBingoCount = this.bingoLines.length;

    // DOMがある場合はクラス差分更新のみ（innerHTML 全破棄を避けて点滅防止）
    // 初回描画は renderBoard() 側が担当するためここは updateBoardOwnership() で十分
    this.updateBoardOwnership();
    this.updateStats();

    if (newBingoCount > oldBingoCount) {
      // GA: ビンゴ達成
      const _gaFilledOnBingo = [...this.markedCells].filter(i => !this.board[i]?.isFree).length;
      sendGA('bingo_achieved', {
        bingo_count:  newBingoCount,
        cells_filled: _gaFilledOnBingo,
        difficulty:   this.difficulty,
        game_type:    this._gaGameType(),
        play_mode:    this.playMode,
      });
      this.showBingoMessage(newBingoCount);
      if (newBingoCount === 12 && oldBingoCount < 12) {
        this.showFullClearCelebration();
      } else {
        this.showBingoCelebration(newBingoLines, oldBingoCount);
      }
    }

    // ビンゴと独立して：本当に新しいリーチラインが現れた場合は常に表示
    const trulyNewReaches = newReachLines.filter(l => !oldReachKeys.has(l.join(',')));
    if (trulyNewReaches.length > 0) {
      this.showReachEffect(this.reachLines.length);
    }

    return this.bingoLines;
  }
  
  // 全ライン（横5、縦5、斜め2）を取得
  getAllLines() {
    const lines = [];
    
    // 横のライン
    for (let i = 0; i < 5; i++) {
      lines.push([i*5, i*5+1, i*5+2, i*5+3, i*5+4]);
    }
    
    // 縦のライン
    for (let i = 0; i < 5; i++) {
      lines.push([i, i+5, i+10, i+15, i+20]);
    }
    
    // 斜めのライン
    lines.push([0, 6, 12, 18, 24]); // 左上→右下
    lines.push([4, 8, 12, 16, 20]); // 右上→左下
    
    return lines;
  }
  
  // ビンゴメッセージを表示
  showBingoMessage(count) {
    if (!this.messageElement) return;
    
    this.messageElement.textContent = `🎉 ${count}本BINGO！`;
    this.messageElement.style.display = 'block';
    
    // アニメーション用クラスを追加
    this.messageElement.classList.remove('pulse');
    setTimeout(() => {
      this.messageElement.classList.add('pulse');
    }, 10);
  }
  
  // ==================== ビンゴ・リーチ演出 ====================

  showBingoCelebration(allBingoLines, oldCount) {
    // 新しく揃ったラインのセルを順番に光らせる
    const newLines = allBingoLines.slice(oldCount);
    const newCellIndices = [...new Set(newLines.flat())];
    newCellIndices.forEach((idx, i) => {
      setTimeout(() => {
        const cell = this.boardElement?.querySelector(`[data-index="${idx}"]`);
        if (!cell) return;
        cell.classList.remove('bingo-flash');
        void cell.offsetWidth;
        cell.classList.add('bingo-flash');
        cell.addEventListener('animationend', () => cell.classList.remove('bingo-flash'), { once: true });
      }, i * 70);
    });

    // セル点灯後にコンフェッティ＋中央テキスト
    const delay = newCellIndices.length * 70 + 100;
    setTimeout(() => {
      this._launchConfetti();
      this._showBingoText(allBingoLines.length);
    }, delay);
  }

  _launchConfetti() {
    const wrap = document.createElement('div');
    wrap.className = 'confetti-wrap';
    document.body.appendChild(wrap);

    const colors = ['#d32f2f', '#f9a825', '#2e7d32', '#1565c0', '#6a1b9a', '#e65100', '#c2185b'];
    for (let i = 0; i < 70; i++) {
      const p = document.createElement('div');
      const size = 6 + Math.random() * 9;
      const isRect = Math.random() < 0.4;
      const dur = (1.4 + Math.random() * 1.4).toFixed(2);
      const delay = (Math.random() * 0.9).toFixed(2);
      const rot = Math.floor(Math.random() * 720) - 360;
      p.className = 'confetti-piece';
      p.style.cssText = [
        `left:${Math.random() * 100}%`,
        `width:${isRect ? size * 2.2 : size}px`,
        `height:${size}px`,
        `background:${colors[Math.floor(Math.random() * colors.length)]}`,
        `border-radius:${Math.random() < 0.4 ? '50%' : '2px'}`,
        `--dur:${dur}s`,
        `--delay:${delay}s`,
        `--rot:${rot}deg`,
        `animation-delay:${delay}s`,
      ].join(';');
      wrap.appendChild(p);
    }
    setTimeout(() => wrap.remove(), 3800);
  }

  _showBingoText(count) {
    const el = document.createElement('div');
    el.className = 'bingo-celebration-text';
    el.innerHTML = `<span class="big">🎉 BINGO!</span><span class="sub">${count > 1 ? count + '本BINGO達成！' : 'BINGO達成！'}</span>`;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  showFullClearCelebration() {
    // 全セルを順番にフラッシュ
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        const cell = this.boardElement?.querySelector(`[data-index="${i}"]`);
        if (!cell) return;
        cell.classList.remove('bingo-flash');
        void cell.offsetWidth;
        cell.classList.add('bingo-flash');
        cell.addEventListener('animationend', () => cell.classList.remove('bingo-flash'), { once: true });
      }, i * 40);
    }
    // コンフェッティ大量 + 全クリアテキスト
    setTimeout(() => {
      this._launchFullClearConfetti();
      this._showFullClearText();
    }, 25 * 40 + 80);
  }

  _launchFullClearConfetti() {
    const wrap = document.createElement('div');
    wrap.className = 'confetti-wrap';
    document.body.appendChild(wrap);
    const colors = ['#d32f2f', '#f9a825', '#2e7d32', '#1565c0', '#6a1b9a', '#e65100', '#c2185b'];
    for (let i = 0; i < 130; i++) {
      const p = document.createElement('div');
      const size = 7 + Math.random() * 11;
      const isRect = Math.random() < 0.4;
      const dur = (1.2 + Math.random() * 1.8).toFixed(2);
      const delay = (Math.random() * 1.2).toFixed(2);
      const rot = Math.floor(Math.random() * 720) - 360;
      p.className = 'confetti-piece';
      p.style.cssText = [
        `left:${Math.random() * 100}%`,
        `width:${isRect ? size * 2.2 : size}px`,
        `height:${size}px`,
        `background:${colors[Math.floor(Math.random() * colors.length)]}`,
        `border-radius:${Math.random() < 0.4 ? '50%' : '2px'}`,
        `--dur:${dur}s`,
        `--delay:${delay}s`,
        `--rot:${rot}deg`,
        `animation-delay:${delay}s`,
      ].join(';');
      wrap.appendChild(p);
    }
    setTimeout(() => wrap.remove(), 5000);
  }

  _showFullClearText() {
    const el = document.createElement('div');
    el.className = 'bingo-celebration-text full-clear-text';
    el.innerHTML =
      '<span class="big">✨ FULL CLEAR!</span><span class="sub">全12ライン制覇！<br>すごすぎる！</span>';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  showReachEffect(reachCount) {
    const existing = document.querySelector('.reach-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'reach-toast';
    toast.textContent = reachCount > 1 ? `🔥 ${reachCount}本リーチ！` : '🔥 リーチ！';
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('out');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, 1800);
  }

  // ==================== 移動距離トラッキング ====================

  /**
   * Haversine 式で2点間の距離（メートル）を返す
   * @param {number} lat1 @param {number} lon1 @param {number} lat2 @param {number} lon2
   * @returns {number}
   */
  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // 地球半径 (m)
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  /**
   * メートルを表示文字列にフォーマット
   * GPS が使えない場合は「測定なし」を返す
   */
  formatDistance(meters) {
    if (this.locationState === 'unavailable' || this.locationState === 'denied') {
      return '測定なし';
    }
    if (this.locationState === 'idle') return '測定なし';
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  }

  /** 距離表示タップ時：GPS 許諾が取れていなければ再リクエスト */
  async handleDistanceTap() {
    // すでに計測中なら何もしない
    if (this.locationState === 'active') return;

    if (!navigator.geolocation) {
      showAlert('このブラウザでは位置情報が使用できません。');
      return;
    }

    // Permissions API で現在の許諾状態を確認
    let permState = 'prompt';
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      permState = result.state; // 'granted' | 'denied' | 'prompt'
    } catch (_) {
      // Permissions API 非対応ブラウザは prompt として扱う
    }

    if (permState === 'denied') {
      // ハード拒否済み → ブラウザ設定への案内
      showAlert(
        '位置情報の使用が拒否されています。\n\n' +
        '距離を計測するには、ブラウザの設定から\nこのサイトの位置情報を「許可」に変更してください。\n\n' +
        '📱 iPhoneの場合：\n設定 → プライバシーとセキュリティ → 位置情報サービス → Safari\n\n' +
        '📱 Androidの場合：\nブラウザのアドレスバー横の🔒をタップ → 権限 → 位置情報'
      );
      return;
    }

    // 'prompt' または 'granted' → トラッキング再開
    this.totalDistance = 0;
    this.lastPosition = null;
    this.locationState = 'idle';
    this.stopLocationTracking();
    this.startLocationTracking();
  }

  /** GPS トラッキング開始（パーミッション確認あり） */
  startLocationTracking() {
    if (!navigator.geolocation) {
      this.locationState = 'unavailable';
      this.updateStats();
      return;
    }
    if (this.watchId != null) return; // 二重起動防止

    this.locationState = 'idle';

    const options = {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000
    };

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => this.onLocationUpdate(pos),
      (err) => {
        // PERMISSION_DENIED(1) or POSITION_UNAVAILABLE(2) or TIMEOUT(3)
        if (err.code === 1) {
          this.locationState = 'denied';
        } else {
          this.locationState = 'unavailable';
        }
        this.updateStats();
      },
      options
    );
  }

  /** GPS トラッキング停止 */
  stopLocationTracking() {
    if (this.watchId != null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * 位置情報更新ハンドラ
   * 精度が低い点・GPS ジャンプはフィルタリングして無視する
   */
  onLocationUpdate(pos) {
    const { latitude, longitude, accuracy } = pos.coords;

    // GPS が取れた時点で active に（精度不問）
    if (this.locationState !== 'active') {
      this.locationState = 'active';
      this.updateStats();
    }

    // 精度 50m 超は距離加算に使わない（ノイズ除去）
    if (accuracy > 50) return;

    if (this.lastPosition) {
      const dist = this.haversineDistance(
        this.lastPosition.latitude,
        this.lastPosition.longitude,
        latitude,
        longitude
      );
      // GPS ジャンプ（150m 以上の瞬間移動）も無視
      if (dist < 150) {
        this.totalDistance += dist;
        this.updateStats();
        this.saveToStorage();
      }
    }

    this.lastPosition = { latitude, longitude };
  }

  // ==================== 統計を更新 ====================

  // 統計を更新
  updateStats() {
    if (this.bingoCountElement) {
      this.bingoCountElement.textContent = this.bingoLines.length;
    }
    
    if (this.markedCountElement) {
      const markedNonFree = [...this.markedCells].filter(idx => !this.board[idx]?.isFree).length;
      this.markedCountElement.textContent = this.gameType === 'battle'
        ? this.getBattleCounts().selfClaims
        : markedNonFree;
    }
    
    if (this.photoCountElement) {
      this.photoCountElement.textContent = Object.keys(this.photos).length;
    }
    
    if (this.roomCodeDisplay) {
      this.roomCodeDisplay.textContent = this.roomCode === 'solo' ? 'ふつう' : (this.roomCode || '-');
    }
    
    if (this.difficultyDisplay) {
      const diffText = {
        'easy':   'かんたん',
        'normal': 'ふつう',
        'hard':   'むずかしい',
        'oni':    'おに',
        'gachi':  'ガチおに'
      };
      this.difficultyDisplay.textContent = diffText[this.difficulty] || '-';
    }
    
    if (this.playerCountDisplay) {
      this.playerCountDisplay.textContent = this.playerCount || 1;
    }
    const isBattle = this.gameType === 'battle';
    // バトルモードでは「作り直す」を非表示
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) newGameBtn.style.display = isBattle ? 'none' : '';
    // 「一時保存」ボタン: バトルは作成者のみ表示、スタンダードは常に表示
    const pauseGameBtn = document.getElementById('pauseGameBtn');
    if (pauseGameBtn) {
      if (isBattle) {
        // 作成者かどうか: battlePlayerId の色が 'blue'（作成者は常に blue）
        const isCreator = parseOwnerColor(this.battlePlayerId) === 'blue';
        pauseGameBtn.style.display = isCreator ? '' : 'none';
      } else {
        pauseGameBtn.style.display = '';
      }
    }
    // 合言葉：バトルのみ表示
    const roomCodeStatEl = document.getElementById('roomCodeStat');
    if (roomCodeStatEl) roomCodeStatEl.style.display = isBattle ? '' : 'none';
    // バトルモード遊び方：バトルのみ表示
    const battleHowtoEl = document.getElementById('battleHowtoDetails');
    if (battleHowtoEl) battleHowtoEl.style.display = isBattle ? '' : 'none';
    // 観光地フィールド選択時のみ地域を表示
    const regionStatEl = document.getElementById('regionStat');
    const regionDisplayEl = document.getElementById('regionDisplay');
    const isKanko = this.topicSetId === '観光地';
    if (regionStatEl) regionStatEl.style.display = isKanko ? '' : 'none';
    if (regionDisplayEl && isKanko) {
      const region = this.landmarkRegion || 'all';
      regionDisplayEl.textContent = region === 'all' ? 'すべて' : region;
    }
    // 移動距離
    if (this.distanceElement) {
      this.distanceElement.textContent = this.formatDistance(this.totalDistance);
    }
    const distanceStat = document.getElementById('distanceStat');
    if (distanceStat) {
      const tappable = this.locationState !== 'active';
      distanceStat.classList.toggle('stat-item-clickable', tappable);
      distanceStat.title = tappable ? 'タップして位置情報を再取得' : '';
    }
    // プレイ時間
    const playTimeEl = document.getElementById('playTimeDisplay');
    if (playTimeEl) {
      if (this.gameStartTime) {
        const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const m = Math.floor(elapsed / 60);
        const s = elapsed % 60;
        playTimeEl.textContent = m > 0 ? `${m}分${String(s).padStart(2, '0')}秒` : `${s}秒`;
      } else {
        playTimeEl.textContent = '-';
      }
    }
    // スコアボード（バトル／スタンダード共通）
    // innerHTML の全書き換えを抑制: 内容が変わった場合のみ更新（2秒ループでの点滅防止）
    const scoreboardEl = document.getElementById('battleScoreboard');
    if (scoreboardEl) {
      let nextHtml;
      if (isBattle) {
        const scores = this.getBattleScores();
        nextHtml = scores.map(p => {
          const isMe = p.id === this.battlePlayerId;
          return `<div class="battle-score-row${isMe ? ' battle-score-row--me' : ''}">` +
            `<span class="battle-score-dot battle-color-${p.color}"></span>` +
            `<span class="battle-score-name">${p.name}${isMe ? '<span class="battle-score-you">あなた</span>' : ''}</span>` +
            `<span class="battle-score-marks">${p.marks}マス</span>` +
            `<span class="battle-score-bingo">BINGO×${p.bingos}</span>` +
            `<span class="battle-score-total">${p.total}pt</span></div>`;
        }).join('');
      } else {
        // スタンダードモード：マーク数とBINGO本数を表示
        const markedNonFree = [...this.markedCells].filter(idx => !this.board[idx]?.isFree).length;
        const bingoCount = this.bingoLines.length;
        nextHtml = `<div class="battle-score-row">` +
          `<span class="battle-score-name">あなた</span>` +
          `<span class="battle-score-marks">${markedNonFree}マス</span>` +
          `<span class="battle-score-bingo">BINGO×${bingoCount}</span></div>`;
      }
      if (scoreboardEl.innerHTML !== nextHtml) scoreboardEl.innerHTML = nextHtml;
      scoreboardEl.style.display = '';
    }
    this.updateDebugPanel();
  }

  startPlayTimer() {
    if (this.playTimerInterval) clearInterval(this.playTimerInterval);
    this._nextLongPlayCheckMs = null; // null = まだ初期化していない（3時間後に初回チェック）
    const FIRST_WARNING_MS    = 3  * 60 * 60 * 1000; // 最初の警告: 3時間後
    const RECHECK_INTERVAL_MS = 1  * 60 * 60 * 1000; // 「続ける」後: 1時間ごと
    const AUTO_DISCARD_MS     = 24 * 60 * 60 * 1000; // 24時間放置で自動破棄

    this.playTimerInterval = setInterval(() => {
      this.updateStats();
      if (!this.gameStartTime) return;

      const now     = Date.now();
      const elapsed = now - this.gameStartTime;

      // ① 24時間超えで自動破棄
      if (elapsed >= AUTO_DISCARD_MS) {
        clearInterval(this.playTimerInterval);
        this.playTimerInterval = null;
        showAlert('24時間が経過したため、ゲームデータを自動的にリセットします。\n大変お疲れさまでした！');
        this.resetAndGoToTop();
        return;
      }

      // ② 3時間未満はスキップ
      if (elapsed < FIRST_WARNING_MS) return;

      // 初回到達時にチェック時刻を初期化
      if (this._nextLongPlayCheckMs === null) {
        this._nextLongPlayCheckMs = this.gameStartTime + FIRST_WARNING_MS;
      }

      // ダイアログ表示中（Infinity）はスキップ
      if (this._nextLongPlayCheckMs === Infinity) return;

      if (now >= this._nextLongPlayCheckMs) {
        this._nextLongPlayCheckMs = Infinity; // 表示中は再トリガーしない
        const h = Math.floor(elapsed / 3_600_000);
        showConfirm(
          `🕐 ${h}時間が経過しました\n\nお疲れさまです！そろそろゲームを終了しますか？`
        ).then((ok) => {
          if (ok) {
            this.stopBattleSyncLoop();
            this.showResultView(); // showEndScreen は存在しないため正しいメソッドを使用
          } else {
            // 「続ける」→ 1時間後に再確認
            this._nextLongPlayCheckMs = Date.now() + RECHECK_INTERVAL_MS;
          }
        });
      }
    }, 1000);
  }

  stopPlayTimer() {
    if (this.playTimerInterval) {
      clearInterval(this.playTimerInterval);
      this.playTimerInterval = null;
    }
  }

  getBattleCounts() {
    const counts = {
      selfClaims: 0,
      opponentClaims: 0,
      unclaimed: 24
    };
    if (this.gameType !== 'battle') return counts;
    let claimed = 0;
    for (let i = 0; i < 25; i++) {
      if (i === 12) continue;
      const ownerId = this.getCellOwnerId(i);
      if (!ownerId) continue;
      claimed += 1;
      if (ownerId === this.battlePlayerId) counts.selfClaims += 1;
      else counts.opponentClaims += 1;
    }
    counts.unclaimed = Math.max(0, 24 - claimed);
    return counts;
  }

  setupDebugPanel() {
    if (!this.debugBattle || this.debugPanelEl) return;
    const panel = document.createElement('div');
    panel.id = 'battleDebugPanel';
    panel.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:3000;background:rgba(0,0,0,0.78);color:#fff;font-size:12px;line-height:1.4;padding:8px 10px;border-radius:8px;max-width:320px;';
    document.body.appendChild(panel);
    this.debugPanelEl = panel;
    this.updateDebugPanel();
  }

  updateDebugPanel() {
    if (!this.debugBattle || !this.debugPanelEl) return;
    const ownerCount = Object.keys(this.battleCellOwners || {}).length;
    const syncText = this.lastBattleSyncAt ? new Date(this.lastBattleSyncAt).toLocaleTimeString() : '-';
    this.debugPanelEl.textContent = `debug battle | room=${this.roomCode || '-'} | mode=${this.gameType} | player=${this.battlePlayerId} | owners=${ownerCount} | lastSync=${syncText} | status=${this.lastBattleSyncStatus} | err=${this.lastBattleSyncError || '-'}`;
  }
  
  // 終了（結果記録・共有画面を表示）
  endGame() {
    if (!this.board || this.board.length !== 25) {
      showAlert('まずはゲームを始めてみましょう！');
      return;
    }

    // バトルモードで未保存の場合：復帰不可の警告を表示
    const isBattleRoom = this.gameType === 'battle' && this.roomCode && this.roomCode !== 'solo';
    if (isBattleRoom && !this._battlePaused) {
      const isCreator = parseOwnerColor(this.battlePlayerId) === 'blue';
      const msg = isCreator
        ? '⚠️ ゲームを保存せずに終了しようとしています。\n\nルームデータが削除され、復帰できなくなります。\n本当に終了しますか？\n\n（「一時保存」ボタンを使うと後で再開できます）'
        : '⚠️ ゲームから退出しようとしています。\n\n退出後も合言葉を再入力すれば同じルームに再参加できます。\n本当に退出しますか？';
      showConfirm(msg).then((ok) => {
        if (ok) this.showResultView();
      });
      return;
    }

    showConfirm('おさんぽビンゴを終了しますか？\n結果を記録・共有できます。').then((ok) => {
      if (ok) this.showResultView();
    });
  }
  
  // 結果画面を表示（編集モード）
  showResultView() {
    this.stopPlayTimer();
    const view = document.getElementById('screenshotView');
    const container = document.querySelector('.container');
    const editArea = document.getElementById('resultEditArea');
    const shareArea = document.getElementById('resultShareArea');

    if (!view || !container) return;

    container.style.display = 'none';
    
    // 編集エリアを表示、共有エリアを非表示
    if (editArea) editArea.style.display = 'flex';
    if (shareArea) shareArea.style.display = 'none';
    
    const dateEl = document.getElementById('resultDate');
    if (dateEl) {
      const now = new Date();
      dateEl.textContent = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日';
    }
    
    const playTimeEl = document.getElementById('resultPlayTime');
    if (playTimeEl && this.gameStartTime) {
      const mins = Math.max(0, Math.floor((Date.now() - this.gameStartTime) / 60000));
      playTimeEl.textContent = mins > 0 ? `プレイ時間 約${mins}分` : 'プレイ時間 1分未満';
      playTimeEl.style.display = '';
    } else if (playTimeEl) {
      playTimeEl.textContent = '';
      playTimeEl.style.display = 'none';
    }
    
    // ビンゴボードを複製
    const sourceBoard = document.getElementById('bingoBoard');
    const targetBoard = document.getElementById('screenshotBoard');
    if (sourceBoard && targetBoard) {
      const clone = sourceBoard.cloneNode(true);
      clone.id = 'screenshotBoardClone';
      targetBoard.innerHTML = '';
      targetBoard.appendChild(clone);
      // クローン後にテキストを再フィット＆縦長（6/5）に高さ設定
      requestAnimationFrame(() => {
        clone.querySelectorAll('.bingo-cell').forEach(c => {
          this.fitCellText(c);
          const w = c.offsetWidth;
          if (w > 0) c.style.height = `${Math.round(w * 6 / 5)}px`;
        });
      });
      // 写真ありセルのみタップで拡大＆保存
      clone.addEventListener('click', (e) => {
        const cell = e.target.closest('.bingo-cell.has-photo');
        if (!cell) return;
        const img = cell.querySelector('.cell-photo-img');
        const topicText = cell.querySelector('.cell-text')?.textContent?.trim() || '';
        if (img) this.showResultPhotoLightbox(img.src, topicText);
      });
    }
    
    // 統計を表示
    const bingoCountEl = document.getElementById('screenshotBingoCount');
    const markedCountEl = document.getElementById('screenshotMarkedCount');
    if (bingoCountEl) bingoCountEl.textContent = this.bingoLines.length;
    if (markedCountEl) {
      markedCountEl.textContent = (BATTLE_MODE_ENABLED && this.gameType === 'battle')
        ? this.getBattleCounts().selfClaims
        : [...this.markedCells].filter(idx => !this.board[idx]?.isFree).length;
    }

    // 距離を表示
    const distEl = document.getElementById('screenshotDistance');
    if (distEl) distEl.textContent = this.formatDistance(this.totalDistance);
    const distDivider = document.getElementById('screenshotDistanceDivider');
    if (distDivider) distDivider.classList.remove('hidden');

    // 結果確定時にトラッキング停止
    this.stopLocationTracking();

    // GA: ゲーム終了
    {
      const _gaNonFree = this.board.map((c, i) => ({...c, idx: i})).filter(c => !c.isFree);
      const _gaFilled  = _gaNonFree.filter(c => this.markedCells.has(c.idx)).length;
      const _gaEmpty   = _gaNonFree.length - _gaFilled;
      const _gaDurMin  = this.gameStartTime ? Math.round((Date.now() - this.gameStartTime) / 60000) : 0;
      const _gaTier    = this._gaTierCounts();
      sendGA('game_end', {
        difficulty:   this.difficulty,
        game_type:    this._gaGameType(),
        play_mode:    this.playMode,
        cells_filled: _gaFilled,
        cells_empty:  _gaEmpty,
        bingo_count:  this.bingoLines.length,
        photo_count:  Object.keys(this.photoBlobs).length,
        duration_min: _gaDurMin,
        distance_m:   Math.round(this.totalDistance),
        tier1_filled: _gaTier.filled[1], tier1_empty: _gaTier.empty[1],
        tier2_filled: _gaTier.filled[2], tier2_empty: _gaTier.empty[2],
        tier3_filled: _gaTier.filled[3], tier3_empty: _gaTier.empty[3],
        tier4_filled: _gaTier.filled[4], tier4_empty: _gaTier.empty[4],
      });
    }

    // グループ入力欄をクリア
    const groupInput = document.getElementById('resultGroupInput');
    if (groupInput) groupInput.value = '';

    view.style.display = 'flex';
  }
  
  /** 写真を通常モーダルスタイルで表示（保存ボタン付き） */
  showResultPhotoLightbox(src, topicText = '') {
    const existing = document.getElementById('resultPhotoLightbox');
    if (existing) existing.remove();

    const box = document.createElement('div');
    box.id = 'resultPhotoLightbox';
    box.className = 'modal';
    box.style.cssText = 'display:flex; z-index:1200;';
    box.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" id="resultPhotoClose">✕</button>
        ${topicText ? `<p class="result-photo-modal-title">${topicText}</p>` : ''}
        <img src="${src}" alt="写真" class="result-photo-modal-img">
        <button class="btn btn-primary btn-large result-photo-save-btn">端末に保存</button>
      </div>
    `;

    box.addEventListener('click', (e) => { if (e.target === box) box.remove(); });
    box.querySelector('#resultPhotoClose').addEventListener('click', () => box.remove());
    box.querySelector('.result-photo-save-btn').addEventListener('click', () => {
      const filename = `osanpo-bingo-${topicText || Date.now()}.jpg`;
      this.savePhotoToDevice(src, filename);
    });

    const onKey = (e) => { if (e.key === 'Escape') { box.remove(); document.removeEventListener('keydown', onKey); } };
    document.addEventListener('keydown', onKey);
    document.body.appendChild(box);
  }

  // 結果画面のセットアップ
  setupResultView() {
    const confirmBtn = document.getElementById('resultConfirmBtn');
    const cancelBtn = document.getElementById('resultCancelBtn');
    const downloadBtn = document.getElementById('downloadImageBtn');
    const shareBtn = document.getElementById('shareSnsBtn');
    const exitBtn = document.getElementById('exitScreenshotBtn');
    
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.confirmResult());
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.cancelResultEdit());
    }
    
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadResultImage());
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.shareToSns());
    }

    const saveAllPhotosBtn = document.getElementById('saveAllPhotosBtn');
    if (saveAllPhotosBtn) {
      saveAllPhotosBtn.addEventListener('click', () => this.saveAllPhotosAsGrid());
    }
    
    if (exitBtn) {
      exitBtn.addEventListener('click', () => this.exitResultView());
    }
  }

  // 結果編集をキャンセルしてゲームに戻る
  cancelResultEdit() {
    const view = document.getElementById('screenshotView');
    const container = document.querySelector('.container');
    const editArea = document.getElementById('resultEditArea');
    const shareArea = document.getElementById('resultShareArea');

    if (view) view.style.display = 'none';
    if (container) container.style.display = 'flex';
    if (editArea) editArea.style.display = 'flex';
    if (shareArea) shareArea.style.display = 'none';

    // showResultView() でタイマーを停止したため、ゲームに戻る際に再開する
    this.startPlayTimer();
  }
  
  // 決定ボタン：編集内容を確定して共有エリアに表示
  confirmResult() {
    const editArea = document.getElementById('resultEditArea');
    const shareArea = document.getElementById('resultShareArea');
    
    if (!editArea || !shareArea) return;
    
    const groupText = (document.getElementById('resultGroupInput')?.value || '').trim();
    const dateEl = document.getElementById('resultDate');
    const boardEl = document.getElementById('screenshotBoard');
    
    document.getElementById('resultCaptureTitle').textContent = 'おさんぽビンゴ';
    document.getElementById('resultCaptureDate').textContent = dateEl?.textContent || '-';
    
    const playTimeEl = document.getElementById('resultPlayTime');
    const capturePlayTimeEl = document.getElementById('resultCapturePlayTime');
    const div1 = document.getElementById('resultCaptureDivider1');
    const div2 = document.getElementById('resultCaptureDivider2');
    if (capturePlayTimeEl && playTimeEl?.textContent) {
      capturePlayTimeEl.textContent = playTimeEl.textContent;
      capturePlayTimeEl.style.display = '';
      if (div1) div1.style.display = '';
      if (div2) div2.style.display = '';
    } else {
      if (capturePlayTimeEl) { capturePlayTimeEl.textContent = ''; capturePlayTimeEl.style.display = 'none'; }
      if (div1) div1.style.display = '';
      if (div2) div2.style.display = 'none';
    }
    
    const groupEl = document.getElementById('resultCaptureGroup');
    if (groupEl) {
      groupEl.textContent = groupText || '-';
    }
    document.getElementById('resultCaptureBingo').textContent = this.bingoLines.length;
    document.getElementById('resultCaptureMarked').textContent =
      (BATTLE_MODE_ENABLED && this.gameType === 'battle')
        ? this.getBattleCounts().selfClaims
        : [...this.markedCells].filter(idx => !this.board[idx]?.isFree).length;
    
    const captureBoard = document.getElementById('resultCaptureBoard');
    if (captureBoard && boardEl?.firstChild) {
      const clone = boardEl.firstChild.cloneNode(true);
      captureBoard.innerHTML = '';
      captureBoard.appendChild(clone);

      // html2canvasはaspect-ratio / object-fit:coverをサポートしないため
      // ① 高さを明示的にpx設定 ② 写真をbackground-imageに変換する
      requestAnimationFrame(() => {
        clone.querySelectorAll('.bingo-cell').forEach(cell => {
          this.fitCellText(cell);
          const w = cell.offsetWidth;
          // html2canvasはaspect-ratio非対応のため高さをpxで明示（縦長 6/5）
          if (w > 0) cell.style.height = `${Math.round(w * 6 / 5)}px`;
        });
        clone.querySelectorAll('.bingo-cell.has-photo').forEach(cell => {
          const img = cell.querySelector('.cell-photo-img');
          const wrap = cell.querySelector('.cell-photo-wrap');
          if (img && wrap && img.src) {
            wrap.style.backgroundImage = `url('${img.src}')`;
            wrap.style.backgroundSize = 'cover';
            wrap.style.backgroundPosition = 'center';
            img.style.display = 'none';
          }
        });
      });

      // 写真ありセルのみタップで保存モーダルを表示
      clone.addEventListener('click', (e) => {
        const cell = e.target.closest('.bingo-cell.has-photo');
        if (!cell) return;
        const img = cell.querySelector('.cell-photo-img');
        const topicText = cell.querySelector('.cell-text')?.textContent?.trim() || '';
        if (img) this.showResultPhotoLightbox(img.src, topicText);
      });
    }
    
    editArea.style.display = 'none';
    shareArea.style.display = 'flex';

    // iOS Share API のユーザージェスチャー制約を回避するため、
    // 確定ボタン押下時点でcanvasを事前生成してblobをキャッシュしておく
    this._resultImageBlob = null;
    const shareBtn    = document.getElementById('shareSnsBtn');
    const downloadBtn = document.getElementById('downloadImageBtn');
    const setBusy = (btn, label) => {
      if (!btn) return;
      btn.disabled = true;
      btn.dataset.originalText = btn.dataset.originalText || btn.textContent;
      btn.textContent = label;
    };
    const setReady = (btn) => {
      if (!btn) return;
      btn.disabled = false;
      btn.textContent = btn.dataset.originalText || btn.textContent;
    };
    setBusy(shareBtn,    '準備中...');
    setBusy(downloadBtn, '準備中...');
    // rAF×2 でDOM描画が落ち着いてから html2canvas を実行
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const area = document.getElementById('resultCaptureArea');
      if (!area || typeof html2canvas === 'undefined') {
        setReady(shareBtn); setReady(downloadBtn);
        return;
      }
      html2canvas(area, {
        scale: Math.max(2, window.devicePixelRatio || 2),
        useCORS: true, allowTaint: true, logging: false,
        backgroundColor: '#ffffff', imageTimeout: 15000
      }).then((canvas) => {
        canvas.toBlob((blob) => {
          this._resultImageBlob = blob;
          setReady(shareBtn); setReady(downloadBtn);
        }, 'image/png', 1);
      }).catch(() => {
        setReady(shareBtn); setReady(downloadBtn);
      });
    }));
  }

  // ビンゴカード画像を端末に保存
  //  - iOS: 写真ライブラリ保存のため共有シート経由（"写真に保存"を含む）
  //  - Android / PC: <a download> で直接ダウンロード
  downloadResultImage() {
    const doSave = async (blob) => {
      if (!blob) {
        showAlert('画像の保存に失敗しました。\nもう一度お試しください。');
        return;
      }
      // GA: カード保存
      sendGA('card_saved', {
        difficulty:   this.difficulty,
        game_type:    this._gaGameType(),
        cells_filled: [...this.markedCells].filter(i => !this.board[i]?.isFree).length,
        bingo_count:  this.bingoLines.length,
      });
      const filename = 'osanpo-bingo-' + new Date().toISOString().slice(0, 10) + '.png';
      const file = new File([blob], filename, { type: 'image/png' });

      // iOS: Safari は <a download> で写真ライブラリ保存ができないため共有シート経由
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
          return;
        } catch (e) {
          if (e.name === 'AbortError') return;
          // 失敗時はダウンロードにフォールバック
        }
      }

      // 直接ダウンロード（Android / PC / iOSフォールバック）
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    if (this._resultImageBlob) {
      doSave(this._resultImageBlob);
      return;
    }

    // フォールバック: その場で生成
    const area = document.getElementById('resultCaptureArea');
    if (!area || typeof html2canvas === 'undefined') {
      showAlert('画像の準備ができませんでした。\nもう一度お試しください。');
      return;
    }
    html2canvas(area, {
      scale: Math.max(2, window.devicePixelRatio || 2),
      useCORS: true, allowTaint: true, logging: false,
      backgroundColor: '#ffffff', imageTimeout: 15000
    }).then((canvas) => {
      canvas.toBlob((blob) => doSave(blob), 'image/png', 1);
    }).catch((err) => {
      console.error('html2canvas error:', err);
      showAlert('画像の保存に失敗しました。\nもう一度お試しください。');
    });
  }

  // SNSで共有（画像＋テキスト＋URL を1セットで共有）
  shareToSns() {
    const text = this.getShareText();
    const shareUrl = this.getShareUrl();

    const doShare = async (blob) => {
      // GA: シェア
      sendGA('shared_to_sns', {
        difficulty:    this.difficulty,
        game_type:     this._gaGameType(),
        bingo_count:   this.bingoLines.length,
        has_image:     blob ? 1 : 0,
      });

      // 画像付き共有を試行（iOS/Android のネイティブ共有シート対応）
      if (blob && navigator.canShare) {
        const filename = 'osanpo-bingo-' + new Date().toISOString().slice(0, 10) + '.png';
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: 'おさんぽビンゴ', text, url: shareUrl });
            return;
          } catch (e) {
            if (e.name === 'AbortError') return;
            // 失敗時はテキスト共有にフォールバック
          }
        }
      }

      // 画像なし or files非対応 → テキスト共有
      if (navigator.share) {
        try {
          await navigator.share({ title: 'おさんぽビンゴ', text, url: shareUrl });
          return;
        } catch (e) {
          if (e.name === 'AbortError') return;
        }
      }

      // 最終フォールバック: X Web Intent（PC Firefox など Web Share 未対応環境）
      const intent = 'https://x.com/intent/post?text=' +
        encodeURIComponent(text + '\n') + '&url=' + encodeURIComponent(shareUrl);
      window.open(intent, '_blank', 'noopener');
    };

    doShare(this._resultImageBlob);
  }
  
  getShareText() {
    const url = this.getShareUrl();
    return `おさんぽビンゴで遊んだよ～！\n#お散歩ビンゴ #散歩 #ビンゴ\n${url}`;
  }

  getShareUrl() {
    return 'https://osanpobingo-battle.com/';
  }
  
  // 共有テキストをクリップボードにコピー
  copyShareText(text) {
    const showSuccess = () => showAlert('テキストをコピーしました！\nSNSに貼り付けて共有できます。');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showSuccess).catch(() => {
        this.fallbackCopyText(text);
      });
    } else {
      this.fallbackCopyText(text);
    }
  }
  
  fallbackCopyText(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showAlert('テキストをコピーしました！\nSNSに貼り付けて共有できます。');
    } catch (e) {
      showAlert('自動コピーできませんでした。\n以下を長押しでコピーしてください：\n\n' + text);
    }
    document.body.removeChild(ta);
  }
  
  // 結果画面からトップへ戻る（キャッシュリセットして新規開始可能に）
  exitResultView() {
    showConfirm('お疲れさまでした！\nトップページに戻りますか？').then((ok) => {
      if (ok) this.resetAndGoToTop();
    });
  }

  // ゲームデータ・キャッシュをクリアしてトップへ遷移
  resetAndGoToTop() {
    this.stopBattleSyncLoop();
    // バトルモード退出時:
    // ・作成者（blue）かつ未保存 → ルームデータを全削除（合言葉を再利用可能に）
    // ・参加者（非blue）かつ未保存 → 自分のマスだけ削除しカラースロットを解放
    //   （ルームは残るため、合言葉を再入力して再参加できる）
    // ・一時保存済み（_battlePaused = true）→ 何も削除しない（再入室で再開）
    const isBattleRoom = this.gameType === 'battle' && this.roomCode && this.roomCode !== 'solo';
    const isCreator    = parseOwnerColor(this.battlePlayerId) === 'blue';
    if (isBattleRoom && !this._battlePaused) {
      if (isCreator) {
        this.deleteRoomData(this.roomCode).catch(() => {});
      } else {
        // 参加者：自分のマスだけ削除してカラースロットを解放
        this.deleteMyBattleRows(this.roomCode, this.battlePlayerId).catch(() => {});
      }
    }
    try {
      localStorage.removeItem(this._storageKey);
      // 旧フォーマット(固定キー)の残存データも念のため削除
      if (this._storageKey !== 'osanpoBingo') localStorage.removeItem('osanpoBingo');
    } catch (e) {}
    // IDB の写真も削除（次セッションに持ち越さない）
    this._revokeAllPhotoURLs();
    this.photoStorage.clearAll().catch(() => {});

    // キャッシュ削除を試みつつ、確実にナビゲーションする
    const doNavigate = () => {
      window.location.href = 'index.html';
    };

    // 万一キャッシュ処理が止まっても1秒後には必ず遷移
    const timer = setTimeout(doNavigate, 1000);

    try {
      if ('caches' in window) {
        caches.keys()
          .then((names) => Promise.all(names.map((n) => caches.delete(n))))
          .then(() => { clearTimeout(timer); doNavigate(); })
          .catch(() => { clearTimeout(timer); doNavigate(); });
      } else {
        clearTimeout(timer);
        doNavigate();
      }
    } catch (e) {
      clearTimeout(timer);
      doNavigate();
    }
  }
  
  /**
   * ゲームを中断して保存し、トップページへ遷移する。
   * resetAndGoToTop() と違い localStorage を削除しないため、
   * 次回 game.html を開いたときに「前回の続きから」で再開できる。
   *
   * バトルモードでは pauseBattleGame() を呼び出してサーバーにポーズ状態を保存してから遷移する。
   */
  async pauseAndGoToTop() {
    this.stopBattleSyncLoop();
    // サーバー書き込み中に例外が発生してもフラグが立つよう await より前にセット
    this._battlePaused = true;
    if (this.gameType === 'battle' && this.roomCode && this.roomCode !== 'solo') {
      await this.pauseBattleGame();
    }
    // _battlePaused=true を localStorage に永続化（バトル・ソロ共通）
    // ここで保存しないと再起動後に _battlePaused が false に戻り、
    // resetAndGoToTop() でルームデータが誤削除される
    this.saveToStorage();
    // localStorage を削除しないでトップへ遷移
    this.stopPlayTimer();
    window.location.href = 'index.html';
  }

  // 作り直す（お題をランダムシャッフル）
  newGame() {
    showConfirm('お題をシャッフルして\n新しいビンゴを作りますか？').then((ok) => {
      if (!ok) return;
      // バトルは同じ合言葉で同じシートを維持する
      // バトルは shuffleSalt を固定し、userId もシードに含まれないため全員同じ盤面になる。
      const shuffleSalt = this.gameType === 'battle' ? '' : Date.now().toString();
      this.createBoard(this.roomCode, this.difficulty, shuffleSalt, null);
      if (this.board[12]?.isFree) this.markCell(12);
      this.checkBingo();
      // 距離リセット＆再トラッキング
      this.totalDistance = 0;
      this.lastPosition = null;
      this.locationState = 'idle';
      this.stopLocationTracking();
      this.startLocationTracking();
      this.updateStats();
      this.saveToStorage();
      this.syncBattleOwnersFromServer();
      if (this.messageElement) {
        this.messageElement.style.display = 'none';
      }
    });
  }
  
  // ランドマーク配置数（難易度別・中央含む）
  // easy: 1固定、normal: 1〜2抽選、hard以上: 1〜4抽選
  _getLandmarkCount(rng) {
    if (this.difficulty === 'easy') return 1;
    if (this.difficulty === 'normal') return 1 + Math.floor(rng() * 2);  // 1〜2
    return 1 + Math.floor(rng() * 4);                                    // 1〜4
  }

  // セルをマーク（プログラムから）
  markCell(index) {
    this.markedCells.add(index);
  }
  
  populateTopicSetSelects() {
    if (typeof topicSets === 'undefined') return;
    const available = topicSets.filter(
      (s) => s.monetizationType === 'free' || s.monetizationType === 'sponsored-ready'
    );

    // hidden <select> を更新
    document.querySelectorAll('select.topic-set-select').forEach((sel) => {
      sel.innerHTML = '';
      available.forEach((set) => {
        const opt = document.createElement('option');
        opt.value = set.id;
        opt.textContent =
          set.sponsorName && set.monetizationType === 'sponsored-ready'
            ? `${set.name}（${set.sponsorName}）`
            : set.name;
        sel.appendChild(opt);
      });
      const current = (this.topicSetId && available.some((s) => s.id === this.topicSetId))
        ? this.topicSetId : 'default';
      sel.value = current;
    });

    // フィールドステッパーの表示テキストを更新
    [
      { stepperId: 'topicSetStepperSolo',   selectId: 'topicSetSelectSolo' },
      { stepperId: 'topicSetStepperCreate', selectId: 'topicSetSelectCreate' },
      { stepperId: 'topicSetStepperJoin',   selectId: 'topicSetSelectJoin' },
    ].forEach(({ stepperId, selectId }) => {
      const stepper = document.getElementById(stepperId);
      const sel     = document.getElementById(selectId);
      if (!stepper || !sel) return;
      const valueEl = stepper.querySelector('.stepper-value');
      if (valueEl && sel.options[sel.selectedIndex]) {
        valueEl.textContent = sel.options[sel.selectedIndex].textContent;
      }
    });

    document.querySelectorAll('select.topic-set-select').forEach((sel) => this.updateTopicSetHelpFor(sel));
  }
  
  updateTopicSetHelpFor(selectEl) {
    if (typeof getTopicSetById !== 'function' || !selectEl) return;
    const set = getTopicSetById(selectEl.value);
    const helpId = {
      topicSetSelectSolo: 'topicSetHelpSolo',
      topicSetSelectCreate: 'topicSetHelpCreate',
      topicSetSelectJoin: 'topicSetHelpJoin'
    }[selectEl.id];
    const el = helpId ? document.getElementById(helpId) : null;
    if (el) {
      let extra = '';
      if (set.monetizationType === 'sponsored-ready' && !set.sponsorName) {
        extra = ' 将来はスポンサー・店舗と連携できます。';
      }
      el.textContent = set.description + extra;
    }

    // 観光地エリア選択欄の表示制御
    const isKanko = selectEl.value === '観光地';
    const regionGroupId = {
      topicSetSelectSolo: 'landmarkRegionGroupSolo',
      topicSetSelectCreate: 'landmarkRegionGroupCreate',
    }[selectEl.id];
    const regionSelectId = {
      topicSetSelectSolo: 'landmarkRegionSelectSolo',
      topicSetSelectCreate: 'landmarkRegionSelectCreate',
    }[selectEl.id];
    const regionGroup = regionGroupId ? document.getElementById(regionGroupId) : null;
    const regionSel = regionSelectId ? document.getElementById(regionSelectId) : null;
    if (regionGroup) regionGroup.style.display = isKanko ? '' : 'none';
    if (regionSel && isKanko) {
      if (regionSel.options.length === 0) this.populateLandmarkRegionSelect(regionSel);
      else regionSel.value = this.landmarkRegion || 'all';
    }
  }

  populateLandmarkRegionSelect(sel) {
    const regions = typeof getAvailableRegions === 'function'
      ? getAvailableRegions()
      : [{id: 'all', name: 'すべての観光地'}];
    sel.innerHTML = '';
    regions.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = r.name;
      sel.appendChild(opt);
    });
    sel.value = this.landmarkRegion || 'all';
  }
  
  showRoomCodeModal(openToSettings) {
    const modal = document.getElementById('roomCodeModal');
    if (!modal) return;
    
    const modeSelectStep = document.getElementById('modeSelectStep');
    const soloGameStep = document.getElementById('soloGameStep');
    const groupModeSelectStep = document.getElementById('groupModeSelectStep');
    const createGameStep = document.getElementById('createGameStep');
    const joinGameStep = document.getElementById('joinGameStep');
    
    const roomCodeInput = document.getElementById('roomCodeInput');
    const difficultySelect = document.getElementById('difficultySelect');
    const customTopicCountSelect = document.getElementById('customTopicCount');
    const customTopicInputsContainer = document.getElementById('customTopicInputs');
    
    const hideAllSteps = () => {
      [modeSelectStep, soloGameStep, groupModeSelectStep, createGameStep, joinGameStep].forEach(el => { if (el) el.style.display = 'none'; });
    };
    
    if (roomCodeInput) {
      // 再設定時は既存の合言葉を復元、新規は空白（ユーザーが手入力 or 生成ボタンで設定）
      roomCodeInput.value = (this.roomCode && this.roomCode !== 'solo') ? this.roomCode : '';
    }
    if (difficultySelect) difficultySelect.value = this.difficulty || 'normal';
    
    const setPlayModeRadios = (name, value) => {
      const photo = document.querySelector(`input[name="${name}"][value="photo"]`);
      const mark = document.querySelector(`input[name="${name}"][value="markOnly"]`);
      if (photo) photo.checked = value === 'photo';
      if (mark) mark.checked = value === 'markOnly';
    };
    setPlayModeRadios('playModeCreate', this.playMode);
    setPlayModeRadios('playModeJoin', this.playMode);
    setPlayModeRadios('playModeSolo', this.playMode);
    
    const difficultySelectSolo = document.getElementById('difficultySelectSolo');
    const customTopicCountSolo = document.getElementById('customTopicCountSolo');
    const customTopicInputsSolo = document.getElementById('customTopicInputsSolo');
    if (difficultySelectSolo) difficultySelectSolo.value = this.difficulty || 'normal';
    const joinDifficultySelect = document.getElementById('joinDifficultySelect');
    if (joinDifficultySelect) joinDifficultySelect.value = this.difficulty || 'normal';
    ['topicSetSelectSolo', 'topicSetSelectCreate', 'topicSetSelectJoin'].forEach((id) => {
      const ts = document.getElementById(id);
      if (ts) {
        if (typeof topicSets !== 'undefined' && topicSets.some((s) => s.id === this.topicSetId)) {
          ts.value = this.topicSetId;
        } else {
          ts.value = 'default';
        }
        this.updateTopicSetHelpFor(ts);
      }
    });
    // 全ステッパーの表示テキストを同期
    [
      { stepperId: 'topicSetStepperSolo',    selectId: 'topicSetSelectSolo' },
      { stepperId: 'topicSetStepperCreate',  selectId: 'topicSetSelectCreate' },
      { stepperId: 'topicSetStepperJoin',    selectId: 'topicSetSelectJoin' },
    ].forEach(({ stepperId, selectId }) => {
      const stepper = document.getElementById(stepperId);
      const sel     = document.getElementById(selectId);
      if (!stepper || !sel) return;
      const valueEl = stepper.querySelector('.stepper-value');
      if (valueEl && sel.options[sel.selectedIndex]) {
        valueEl.textContent = sel.options[sel.selectedIndex].textContent;
      }
    });
    if (customTopicCountSolo && customTopicInputsSolo) {
      const n = this.customTopics.length;
      customTopicCountSolo.value = String(n);
      this.renderCustomTopicInputs(n, customTopicInputsSolo);
      if (n > 0) {
        customTopicInputsSolo.querySelectorAll('.custom-topic-input').forEach((input, i) => {
          if (this.customTopics[i]) input.value = this.customTopics[i].text || '';
        });
      }
    }
    
    if (customTopicCountSelect && customTopicInputsContainer) {
      const customCount = this.customTopics.length;
      customTopicCountSelect.value = customCount.toString();
      this.renderCustomTopicInputs(customCount, customTopicInputsContainer);
      if (customCount > 0) {
        const inputs = customTopicInputsContainer.querySelectorAll('.custom-topic-input');
        this.customTopics.forEach((topic, i) => { if (inputs[i]) inputs[i].value = topic.text || ''; });
      }
    }
    
    hideAllSteps();
    if (openToSettings && this.roomCode === 'solo') {
      if (soloGameStep) soloGameStep.style.display = 'block';
    } else if (openToSettings && this.roomCode && this.roomCode !== 'solo') {
      if (createGameStep) createGameStep.style.display = 'block';
    } else {
      if (modeSelectStep) modeSelectStep.style.display = 'block';
    }
    modal.style.display = 'flex';
  }
  
  setupRoomCodeModal() {
    const startGameBtn = document.getElementById('startGameBtn');
    const joinGameBtn = document.getElementById('joinGameBtn');
    const startSoloGameBtn = document.getElementById('startSoloGameBtn');
    const generateBtn = document.getElementById('generateRoomCodeBtn');
    const roomCodeInput = document.getElementById('roomCodeInput');
    const customTopicCountSelect = document.getElementById('customTopicCount');
    const customTopicInputsContainer = document.getElementById('customTopicInputs');
    const customTopicCountSolo = document.getElementById('customTopicCountSolo');
    const customTopicInputsSolo = document.getElementById('customTopicInputsSolo');
    
    const modeSelectStep = document.getElementById('modeSelectStep');
    const soloGameStep = document.getElementById('soloGameStep');
    const groupModeSelectStep = document.getElementById('groupModeSelectStep');
    const createGameStep = document.getElementById('createGameStep');
    const joinGameStep = document.getElementById('joinGameStep');
    
    const hideAll = () => {
      [modeSelectStep, soloGameStep, groupModeSelectStep, createGameStep, joinGameStep].forEach(el => { if (el) el.style.display = 'none'; });
    };
    
    // ふつうに遊ぶ（バトルではない）
    const modeSoloBtn = document.getElementById('modeSoloBtn');
    if (modeSoloBtn) {
      modeSoloBtn.addEventListener('click', () => {
        hideAll();
        if (soloGameStep) soloGameStep.style.display = 'block';
      });
    }
    
    // みんなで遊ぶ
    const modeGroupBtn = document.getElementById('modeGroupBtn');
    if (modeGroupBtn) {
      modeGroupBtn.addEventListener('click', () => {
        hideAll();
        if (groupModeSelectStep) groupModeSelectStep.style.display = 'block';
      });
    }
    
    const modeCreateBtn = document.getElementById('modeCreateBtn');
    const modeJoinBtn = document.getElementById('modeJoinBtn');
    if (modeCreateBtn) {
      modeCreateBtn.addEventListener('click', () => {
        hideAll();
        if (createGameStep) createGameStep.style.display = 'block';
        // 合言葉は空白のままにする（ユーザーが手入力 or 生成ボタンで設定する）
      });
    }
    
    if (modeJoinBtn) {
      modeJoinBtn.addEventListener('click', () => {
        hideAll();
        if (joinGameStep) joinGameStep.style.display = 'block';
        // ステップ切り替え時にステータスをリセット
        const statusEl = document.getElementById('joinRoomStatus');
        const infoEl = document.getElementById('joinRoomInfo');
        if (statusEl) { statusEl.textContent = ''; statusEl.className = 'join-room-status'; }
        if (infoEl) infoEl.style.display = 'none';
      });
    }

    // 合言葉入力 → ルーム存在チェック（デバウンス）
    const joinRoomCodeEl = document.getElementById('joinRoomCodeInput');
    const joinStatusEl = document.getElementById('joinRoomStatus');
    const joinInfoEl = document.getElementById('joinRoomInfo');
    const joinInfoContent = document.getElementById('joinRoomInfoContent');
    let joinCheckTimer = null;

    const checkJoinRoom = async (code) => {
      if (!joinStatusEl) return;
      if (!code) {
        joinStatusEl.textContent = '';
        joinStatusEl.className = 'join-room-status';
        if (joinInfoEl) joinInfoEl.style.display = 'none';
        return;
      }
      joinStatusEl.textContent = '確認中…';
      joinStatusEl.className = 'join-room-status status-checking';
      if (joinInfoEl) joinInfoEl.style.display = 'none';

      if (!this.battleBackend.enabled) {
        // バックエンドなし：入力があれば準備OK
        joinStatusEl.textContent = '合言葉を確認しました';
        joinStatusEl.className = 'join-room-status status-found';
        return;
      }

      try {
        // __room_settings__ の有無でルーム存在を確認（最も確実な方法）
        const sRes = await fetch(
          `${this.battleBackend.url}/rest/v1/${this.battleTable}?room_code=eq.${encodeURIComponent(code)}&cell_index=eq.12&select=owner_user_id`,
          { headers: { apikey: this.battleBackend.key, Authorization: `Bearer ${this.battleBackend.key}` } }
        );
        if (!sRes.ok) throw new Error('fetch failed');
        const sRows = await sRes.json();
        if (sRows.length > 0) {
          // 参加人数チェック（最大3人）
          let memberCount = 0;
          const _savedRoomCode = this.roomCode; // 必ず復元するために事前退避
          try {
            this.roomCode = code;
            const colors = await this._fetchRoomPlayerColors();
            memberCount = colors.size;
          } catch {
            // ネットワークエラー等は0人として扱う（参加ボタン側で再チェック）
          } finally {
            this.roomCode = _savedRoomCode; // 例外が発生しても必ず元に戻す
          }

          if (memberCount >= MAX_BATTLE_PLAYERS) {
            joinStatusEl.textContent = `このルームはすでに${MAX_BATTLE_PLAYERS}人参加しており、これ以上参加できません`;
            joinStatusEl.className = 'join-room-status status-full';
            if (joinInfoEl) joinInfoEl.style.display = 'none';
          } else {
            const remaining = MAX_BATTLE_PLAYERS - memberCount;
            joinStatusEl.textContent = `ルームが見つかりました（残り${remaining}人参加可）`;
            joinStatusEl.className = 'join-room-status status-found';
            // 設定サマリー表示
            if (joinInfoEl && joinInfoContent) {
              const diffLabel = { easy: 'かんたん', normal: 'ふつう', hard: 'むずかしい', oni: 'おに' };
              let settingsChips = '';
              try {
                const rawOwner = sRows[0].owner_user_id || '';
                const s = JSON.parse(rawOwner.startsWith('__settings__:') ? rawOwner.slice('__settings__:'.length) : rawOwner);
                const dLabel = diffLabel[s.difficulty] || s.difficulty || 'ふつう';
                const tsLabel = s.topicSetId && s.topicSetId !== 'default' ? ` / ${s.topicSetId}` : '';
                settingsChips = `<span class="join-room-info-chip">${dLabel}${tsLabel}</span>`;
              } catch (_) {}
              joinInfoContent.innerHTML =
                `<span class="join-room-info-chip">バトルモード</span>` +
                settingsChips;
              joinInfoEl.style.display = 'block';
            }
          }
        } else {
          // 設定行がない = ルーム未作成 or 作成者の設定書き込みが完了していない
          // 少し待って再確認するよう案内
          joinStatusEl.textContent = 'ルームが見つかりません。合言葉を確認してください';
          joinStatusEl.className = 'join-room-status status-empty';
          if (joinInfoEl) joinInfoEl.style.display = 'none';
        }
      } catch {
        joinStatusEl.textContent = '';
        joinStatusEl.className = 'join-room-status';
        if (joinInfoEl) joinInfoEl.style.display = 'none';
      }
    };

    if (joinRoomCodeEl) {
      joinRoomCodeEl.addEventListener('input', () => {
        clearTimeout(joinCheckTimer);
        const code = joinRoomCodeEl.value.trim();
        if (!code) {
          if (joinStatusEl) { joinStatusEl.textContent = ''; joinStatusEl.className = 'join-room-status'; }
          if (joinInfoEl) joinInfoEl.style.display = 'none';
          return;
        }
        joinCheckTimer = setTimeout(() => checkJoinRoom(code), 500);
      });
    }
    
    if (document.getElementById('backToModeSelectFromSolo')) {
      document.getElementById('backToModeSelectFromSolo').addEventListener('click', () => {
        hideAll();
        if (modeSelectStep) modeSelectStep.style.display = 'block';
      });
    }
    if (document.getElementById('backToModeSelectFromGroup')) {
      document.getElementById('backToModeSelectFromGroup').addEventListener('click', () => {
        hideAll();
        if (modeSelectStep) modeSelectStep.style.display = 'block';
      });
    }
    const backToGroupModeSelect = document.getElementById('backToGroupModeSelect');
    if (backToGroupModeSelect) {
      backToGroupModeSelect.addEventListener('click', () => {
        hideAll();
        if (groupModeSelectStep) groupModeSelectStep.style.display = 'block';
      });
    }
    const backToGroupModeSelectFromJoin = document.getElementById('backToGroupModeSelectFromJoin');
    if (backToGroupModeSelectFromJoin) {
      backToGroupModeSelectFromJoin.addEventListener('click', () => {
        hideAll();
        if (groupModeSelectStep) groupModeSelectStep.style.display = 'block';
      });
    }
    
    // 合言葉生成ボタン
    if (generateBtn && roomCodeInput) {
      generateBtn.addEventListener('click', () => {
        roomCodeInput.value = this.generateRoomCode();
      });
    }
    
    if (customTopicCountSelect && customTopicInputsContainer) {
      customTopicCountSelect.addEventListener('change', () => {
        this.renderCustomTopicInputs(parseInt(customTopicCountSelect.value) || 0, customTopicInputsContainer);
      });
    }
    if (customTopicCountSolo && customTopicInputsSolo) {
      customTopicCountSolo.addEventListener('change', () => {
        this.renderCustomTopicInputs(parseInt(customTopicCountSolo.value) || 0, customTopicInputsSolo);
      });
    }
    const joinCustomTopicCount = document.getElementById('joinCustomTopicCount');
    const customTopicInputsJoin = document.getElementById('customTopicInputsJoin');
    if (joinCustomTopicCount && customTopicInputsJoin) {
      joinCustomTopicCount.addEventListener('change', () => {
        this.renderCustomTopicInputs(parseInt(joinCustomTopicCount.value) || 0, customTopicInputsJoin);
      });
    }
    
    // ふつうに遊ぶ：ゲーム開始
    if (startSoloGameBtn) {
      startSoloGameBtn.addEventListener('click', () => {
        this.stopBattleSyncLoop();
        const difficultySelectSolo = document.getElementById('difficultySelectSolo');
        const modal = document.getElementById('roomCodeModal');
        const playModeRadio = document.querySelector('input[name="playModeSolo"]:checked');
        this.playMode = playModeRadio?.value === 'markOnly' ? 'markOnly' : 'photo';
        this.difficulty = difficultySelectSolo?.value || 'normal';
        this.topicSetId = document.getElementById('topicSetSelectSolo')?.value || 'default';
        this.gameType = 'normal';
        this.battleCellOwners = {};
        this.landmarkMode = (this.topicSetId === '観光地');
        this.landmarkRegion = this.landmarkMode
          ? (document.getElementById('landmarkRegionSelectSolo')?.value || 'all')
          : 'all';
        const customTopics = this.collectCustomTopics(customTopicInputsSolo);
        this.gameStartTime = Date.now();
        this.roomCode = 'solo';
        this.playerCount = 1;
        // GA: ゲーム開始（ソロ）
        sendGA('game_start', {
          difficulty:          this.difficulty,
          game_type:           'solo',
          play_mode:           this.playMode,
          topic_set:           this.topicSetId || 'default',
          landmark_mode:       this.landmarkMode ? 1 : 0,
          custom_topic_count:  customTopics.length,
        });
        // 前のゲームで _battlePaused=true が残っていると自動再開が効かなくなるためリセット
        this._battlePaused = false;
        const soloSalt = Date.now().toString();
        this.createBoard('solo', this.difficulty, soloSalt, customTopics);
        if (this.board[12]?.isFree) this.markCell(12);
        this.checkBingo();
        this.totalDistance = 0;
        this.lastPosition = null;
        this.stopLocationTracking();
        this.startLocationTracking();
        this.startPlayTimer();
        this.updateStats();
        this.saveToStorage(); // 開始直後にリフレッシュしても続きから再開できるよう保存
        if (modal) modal.style.display = 'none';
        if (this.messageElement) this.messageElement.style.display = 'none';
      });
    }
    
    // ゲーム開始ボタン（みんなで・作成モード）
    if (startGameBtn) {
      startGameBtn.addEventListener('click', async () => {
        this.stopBattleSyncLoop();
        const difficultySelect = document.getElementById('difficultySelect');
        const modal = document.getElementById('roomCodeModal');

        const roomCode = roomCodeInput?.value.trim();
        if (!roomCode) {
          showAlert('合言葉を入力してください。\n自動生成する場合は「ランダム生成」ボタンを押してください。');
          return;
        }

        // 同じ合言葉のルームがポーズ済みの場合は再開確認
        if (this.battleBackend.enabled) {
          this.roomCode = roomCode;
          const existingSettings = await this.fetchRoomSettings(roomCode);
          if (existingSettings?.paused && existingSettings?.pauseTime) {
            const pauseAge = Date.now() - existingSettings.pauseTime;
            if (pauseAge < 24 * 60 * 60 * 1000) {
              const h = Math.floor(pauseAge / 3_600_000);
              const m = Math.floor((pauseAge % 3_600_000) / 60_000);
              const ageText = h > 0 ? `${h}時間${m}分` : `${m}分`;
              const resume = await showConfirm(
                `この合言葉には${ageText}前に保存された途中データがあります。\n\n前回の続きから再開しますか？`
              );
              if (!resume) {
                await this.deleteRoomData(roomCode);
              } else {
                // 再開: ポーズフラグを解除
                const updatedSettings = { ...existingSettings, paused: false, pauseTime: null };
                await this.saveRoomSettingsToServer(roomCode, updatedSettings);
              }
            } else {
              // 期限切れは黙って削除
              await this.deleteRoomData(roomCode);
            }
          }
        }

        // 新しいゲーム開始時は一時保存フラグをリセット
        this._battlePaused = false;

        const difficulty = difficultySelect?.value || 'normal';
        const playerName = document.getElementById('playerNameCreateInput')?.value.trim() || '';
        // ゲーム作成者は常にblue（最初の参加者）
        this.battlePlayerId = makeBattlePlayerId(playerName, 'blue', getBattleRandomId());
        this.battleBingoOwners = {};
        this.lastClaimedCellIndex = null;

        // フリー入力マスのお題を収集
        const customTopics = this.collectCustomTopics();

        this.topicSetId = document.getElementById('topicSetSelectCreate')?.value || 'default';
        const playModeRadio = document.querySelector('input[name="playModeCreate"]:checked');
        this.playMode = playModeRadio?.value === 'markOnly' ? 'markOnly' : 'photo';
        // バトルモードは常に陣取り
        this.gameType = BATTLE_MODE_ENABLED ? 'battle' : 'normal';
        this.landmarkMode = (this.topicSetId === '観光地');
        this.landmarkRegion = this.landmarkMode
          ? (document.getElementById('landmarkRegionSelectCreate')?.value || 'all')
          : 'all';
        if (this.gameType === 'battle' && !this.battleBackend.enabled) {
          showAlert('バトル連携設定が未入力のため、この端末内のみでバトル挙動を行います。');
        }
        this.gameStartTime = Date.now();
        this.battleCellOwners = {};
        // GA: ゲーム開始（作成）
        sendGA('game_start', {
          difficulty:          difficulty,
          game_type:           this.gameType === 'battle' ? 'battle' : 'group',
          play_mode:           this.playMode,
          topic_set:           this.topicSetId || 'default',
          landmark_mode:       this.landmarkMode ? 1 : 0,
          custom_topic_count:  this.customTopics.length,
        });

        // 合言葉あり or バトル → salt なし（全員同じボード）、ソロ → Date.now() でランダム
        const initialSalt = (roomCode && roomCode !== 'solo') || this.gameType === 'battle'
          ? ''
          : Date.now().toString();
        this.createBoard(roomCode, difficulty, initialSalt, customTopics);
        if (this.board[12]?.isFree) this.markCell(12);
        this.checkBingo();
        this.totalDistance = 0;
        this.lastPosition = null;
        this.stopLocationTracking();
        this.startLocationTracking();
        this.startPlayTimer();
        this.updateStats();
        // バトルモードの場合、ルーム設定をサーバーに保存（参加者が同じボードを作れるよう）
        // await で保存完了を待つ：参加者が合言葉を入力したとき確実に設定が見える状態にする
        if (this.gameType === 'battle') {
          await this.saveRoomSettingsToServer(roomCode, {
            difficulty: this.difficulty,
            topicSetId: this.topicSetId,
            landmarkMode: this.landmarkMode,
            landmarkRegion: this.landmarkRegion,
            playMode: this.playMode,
            creatorId: this.battlePlayerId,
            // カスタムお題: 参加者が同じボードを生成できるよう送信
            customTopics: this.customTopics || []
          });
        }
        this.registerPlayerPresence();
        // 作成直後もサーバー状態を即時反映するため await
        await this.syncBattleOwnersFromServer();
        this.startBattleSyncLoop(/* skipInitialSync= */ true);

        if (modal) modal.style.display = 'none';
        if (this.messageElement) this.messageElement.style.display = 'none';

        // 初回バトルプレイ時はチュートリアルを表示（非同期・ゲーム開始後）
        this._showBattleTutorial().catch(() => {});
      });
    }

    // 参加ボタン（参加モード）
    if (joinGameBtn) {
      joinGameBtn.addEventListener('click', async () => {
        this.stopBattleSyncLoop();
        const joinRoomCode = document.getElementById('joinRoomCodeInput');
        const modal = document.getElementById('roomCodeModal');

        const roomCode = joinRoomCode?.value.trim();
        if (!roomCode) {
          showAlert('合言葉を入力してください');
          return;
        }

        this.gameType = 'battle';
        if (!this.battleBackend.enabled) {
          showAlert('バトル連携設定が未入力のため、この端末内のみでバトル挙動を行います。');
        }
        const joinPlayerName = document.getElementById('playerNameJoinInput')?.value.trim() || '';
        // 新しいゲーム開始時は一時保存フラグをリセット
        this._battlePaused = false;
        this.roomCode = roomCode; // 以降のAPIコールで使うため先にセット

        // ① ポーズ状態チェックを pickAvailableColor より先に行う
        //    （ポーズ中→削除した場合に3人制限カウントが正しく反映されるよう）
        const roomSettings = await this.fetchRoomSettings(roomCode);
        if (roomSettings?.paused && roomSettings?.pauseTime) {
          // このプレイヤーが作成者かどうかをcreatorIdのrandomId部分で判定
          const creatorParts   = (roomSettings.creatorId || '').split('::');
          const creatorRandId  = creatorParts[creatorParts.length - 1] || '';
          const isJoinerCreator = creatorRandId.length > 0 && creatorRandId === getBattleRandomId();

          const pauseAge = Date.now() - roomSettings.pauseTime;
          if (pauseAge >= 24 * 60 * 60 * 1000) {
            // 期限切れ：作成者のみ削除できる。非作成者は案内のみ
            if (isJoinerCreator) {
              showAlert('このルームは24時間以上前に保存されたため期限切れです。\n新しいゲームを作成してください。');
              await this.deleteRoomData(roomCode);
            } else {
              showAlert('このルームは期限切れです。\n作成者に新しいゲームを作成してもらってください。');
            }
            this.roomCode = '';
            return;
          }
          // 期限内の一時保存中ルーム
          if (!isJoinerCreator) {
            // 非作成者：再開を待つよう案内して終了
            showAlert('このルームは現在一時停止中です。\n作成者が再開するまでお待ちください。');
            this.roomCode = '';
            return;
          }
          // 作成者：再開するか確認
          const h = Math.floor(pauseAge / 3_600_000);
          const m = Math.floor((pauseAge % 3_600_000) / 60_000);
          const ageText = h > 0 ? `${h}時間${m}分` : `${m}分`;
          const resume = await showConfirm(
            `このルームには${ageText}前に保存された途中データがあります。\n\n前回の続きから再開しますか？`
          );
          if (!resume) {
            // 作成者が再開しないを選択 → サーバーデータを削除し参加も中止
            await this.deleteRoomData(roomCode);
            this.roomCode = '';
            showAlert('ルームデータを削除しました。\n新しいゲームを作成してください。');
            return;
          }
          // 再開：ポーズフラグをクリア
          const updatedSettings = { ...roomSettings, paused: false, pauseTime: null };
          await this.saveRoomSettingsToServer(roomCode, updatedSettings);
        }

        // ② ポーズ処理後に3人制限チェック（削除済みルームには引っかからない）
        let joinColor;
        try {
          joinColor = await this.pickAvailableColor();
        } catch (e) {
          showAlert('サーバーへの接続に失敗しました。\n通信状態を確認して再度お試しください。');
          this.roomCode = '';
          return;
        }
        if (joinColor === null) {
          showAlert(`このルームはすでに${MAX_BATTLE_PLAYERS}人参加しており、これ以上参加できません。`);
          this.roomCode = '';
          return;
        }
        this.battlePlayerId = makeBattlePlayerId(joinPlayerName, joinColor, getBattleRandomId());
        this.battleBingoOwners = {};
        this.lastClaimedCellIndex = null;

        // roomSettings が null の場合（設定書き込みタイミングの競合）は再フェッチを試みる
        const resolvedSettings = roomSettings || (await this.fetchRoomSettings(roomCode)) || {};
        const difficulty = resolvedSettings.difficulty || 'normal';
        this.topicSetId = resolvedSettings.topicSetId || 'default';
        this.playMode = resolvedSettings.playMode || 'photo';
        this.landmarkMode = resolvedSettings.landmarkMode || false;
        this.landmarkRegion = resolvedSettings.landmarkRegion || 'all';
        // カスタムお題: 作成者が設定したものを取得して同じボードを生成
        const joinCustomTopics = Array.isArray(resolvedSettings.customTopics)
          ? resolvedSettings.customTopics : [];
        this.customTopics = joinCustomTopics;

        this.gameStartTime = Date.now();
        this.battleCellOwners = {};
        this.playerCount = 1;
        // GA: ゲーム開始（参加）
        sendGA('game_start', {
          difficulty:         difficulty,
          game_type:          'battle',
          play_mode:          this.playMode,
          topic_set:          this.topicSetId || 'default',
          landmark_mode:      this.landmarkMode ? 1 : 0,
          custom_topic_count: joinCustomTopics.length,
        });

        this.createBoard(roomCode, difficulty, '', joinCustomTopics);
        if (this.board[12]?.isFree) this.markCell(12);
        this.checkBingo();
        this.totalDistance = 0;
        this.lastPosition = null;
        this.stopLocationTracking();
        this.startLocationTracking();
        this.startPlayTimer();
        this.updateStats();
        this.registerPlayerPresence();
        // 参加直後に対戦相手の取得済みマスを表示するため await で初回同期を待つ
        await this.syncBattleOwnersFromServer();
        this.startBattleSyncLoop(/* skipInitialSync= */ true);

        if (modal) modal.style.display = 'none';
        if (this.messageElement) this.messageElement.style.display = 'none';

        // 初回バトルプレイ時はチュートリアルを表示（非同期・ゲーム開始後）
        this._showBattleTutorial().catch(() => {});
      });
    }
  }

  // フリー入力マスの入力欄を動的に生成
  renderCustomTopicInputs(count, container) {
    if (!container) return;
    
    if (count <= 0) {
      container.style.display = 'none';
      container.innerHTML = '';
      return;
    }
    
    container.style.display = 'block';
    
    // 既存の値を保持
    const existingValues = [];
    container.querySelectorAll('.custom-topic-input').forEach(input => {
      existingValues.push(input.value);
    });
    
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
      const row = document.createElement('div');
      row.className = 'custom-topic-row';
      
      const num = document.createElement('span');
      num.className = 'custom-topic-num';
      num.textContent = (i + 1);
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'input-text custom-topic-input';
      input.placeholder = '例: 赤いポスト';
      input.maxLength = 20;
      input.dataset.index = i;
      
      // 既存の値を復元
      if (existingValues[i]) {
        input.value = existingValues[i];
      }
      
      row.appendChild(num);
      row.appendChild(input);
      container.appendChild(row);
    }
  }
  
  // フリー入力マスのお題を収集
  collectCustomTopics(container) {
    const root = container || document;
    const inputs = root.querySelectorAll ? root.querySelectorAll('.custom-topic-input') : document.querySelectorAll('.custom-topic-input');
    const topics = [];
    
    inputs.forEach(input => {
      const text = input.value.trim();
      if (text) {
        topics.push({
          text: text,
          icon: '✏️',
          category: 'カスタム',
          isCustom: true
        });
      }
    });
    
    return topics;
  }
  
  copyRoomCode() {
    if (!this.roomCode || this.roomCode === 'solo') return;
    
    // クリップボードにコピー
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.roomCode)
        .then(() => {
          // コピー成功のフィードバック
          const roomCodeStat = document.getElementById('roomCodeStat');
          if (roomCodeStat) {
            const originalBg = roomCodeStat.style.background;
            roomCodeStat.style.background = '#a8d5ba';
            roomCodeStat.style.transition = 'background 0.3s';
            
            setTimeout(() => {
              roomCodeStat.style.background = originalBg;
            }, 300);
          }
          
          // 小さな通知を表示
          this.showCopyNotification();
        })
        .catch(err => {
          console.error('コピー失敗:', err);
          showAlert(`合言葉は「${this.roomCode}」です\n\n長押しでコピーしてください`);
        });
    } else {
      // クリップボードAPIが使えない場合
      showAlert(`合言葉は「${this.roomCode}」です\n\n長押しでコピーしてください`);
    }
  }
  
  // コピー通知を表示
  showCopyNotification() {
    const notification = document.createElement('div');
    notification.textContent = '📋 合言葉をコピーしました！';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #7eb89a;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      z-index: 10000;
      font-size: 0.9rem;
      font-weight: 600;
      animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideDown 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }
  
  // 意味のある合言葉を生成（3-5文字）
  generateRoomCode() {
    // ひらがな単語リスト（3〜5文字）
    const words = [
      // 色
      'あお', 'あか', 'きいろ', 'みどり', 'ちゃいろ', 'むらさき', 'ももいろ', 'しろ', 'くろ', 'だいだい',
      // 自然
      'そら', 'うみ', 'やま', 'かわ', 'もり', 'いけ', 'たに', 'はやし', 'しま', 'たき',
      // 植物
      'はな', 'さくら', 'ばら', 'すみれ', 'ひまわり', 'たんぽぽ', 'もみじ', 'かえで', 'まつ', 'たけ',
      // 動物
      'ねこ', 'いぬ', 'とり', 'さかな', 'うさぎ', 'くま', 'きつね', 'りす', 'かえる', 'ちょう',
      // 天体・天気
      'ほし', 'つき', 'にじ', 'ひかり', 'たいよう', 'はれ', 'くもり', 'かぜ', 'ゆき', 'きり',
      // 季節・時間
      'はる', 'なつ', 'あき', 'ふゆ', 'あさひ', 'ゆうひ', 'よぞら', 'あした', 'きょう',
      // 場所
      'みち', 'にわ', 'こうえん', 'ひろば', 'みなと', 'えき', 'まち', 'むら', 'さと',
      // 感情・様子
      'えがお', 'げんき', 'わくわく', 'どきどき', 'にこにこ', 'きらきら', 'のんびり', 'ほんわか',
      // お散歩関連
      'さんぽ', 'あるく', 'みつける', 'はっけん', 'たのしい', 'ふしぎ', 'きれい',
    ];

    // 3〜5文字の単語のみ使用
    const validWords = words.filter(w => w.length >= 3 && w.length <= 5);

    // ランダムに1語選択し、残り文字数を数字で埋めて合計8文字にする
    const word  = validWords[Math.floor(Math.random() * validWords.length)];
    const digitCount = 8 - word.length;  // 3〜5桁
    const digits = Array.from({ length: digitCount }, () => Math.floor(Math.random() * 10)).join('');

    return word + digits;
  }
  
  // マス詳細モーダルを表示
  showCellModal(index) {
    this.currentPhotoIndex = index;
    const modal = document.getElementById('cellModal');
    const icon = document.getElementById('cellModalIcon');
    const title = document.getElementById('cellModalTitle');
    const photoDisplay = document.getElementById('cellPhotoDisplay');
    const photoImg = document.getElementById('cellPhotoImg');
    const photoPreview = document.getElementById('cellPhotoPreview');
    const noPhoto = document.getElementById('cellModalNoPhoto');
    const toggleMarkBtn = document.getElementById('toggleMarkBtn');

    if (!modal) {
      console.error('❌ cellModal が見つかりません');
      return;
    }

    const topic = this.board[index];
    const header = document.getElementById('cellModalHeader');
    const photoTitle = document.getElementById('cellModalPhotoTitle');

    // アイコンとタイトルを設定
    if (icon) icon.innerHTML = getTopicIcon(topic);
    if (title) title.textContent = topic.text;

    // プレビューは常に非表示（handleCellPhotoSelectで表示）
    if (photoPreview) photoPreview.style.display = 'none';

    if (this.photos[index] && photoDisplay && photoImg) {
      // State A: 写真あり — ヘッダー（大アイコン）は非表示、タイトルは写真上に表示
      photoImg.src = this.photos[index];
      photoDisplay.style.display = 'block';
      if (header) header.style.display = 'none';
      if (photoTitle) photoTitle.textContent = topic.text;
      if (noPhoto) noPhoto.style.display = 'none';
    } else {
      if (header) header.style.display = '';
      // State C: 写真なし
      if (photoDisplay) photoDisplay.style.display = 'none';
      if (noPhoto) {
        noPhoto.style.display = 'flex';
        const battleNote = document.getElementById('battlePhotoRequired');
        if (this.gameType === 'battle') {
          // バトルモード：マークボタン非表示・注釈表示
          if (toggleMarkBtn) toggleMarkBtn.style.display = 'none';
          if (battleNote) battleNote.style.display = '';
        } else {
          // スタンダードモード：マークボタン表示・注釈非表示
          if (battleNote) battleNote.style.display = 'none';
          if (toggleMarkBtn) {
            toggleMarkBtn.style.display = '';
            if (this.markedCells.has(index)) {
              toggleMarkBtn.textContent = 'マーク済み（解除）';
              toggleMarkBtn.classList.add('marked');
            } else {
              toggleMarkBtn.textContent = 'マークする';
              toggleMarkBtn.classList.remove('marked');
            }
          }
        }
      }
    }

    modal.style.display = 'flex';
  }
  
  // 写真モーダルを設定
  setupPhotoModal() {
    const modal = document.getElementById('cellModal');
    const closeBtn = document.getElementById('closeCellModal');
    const photoInputCamera = document.getElementById('cellPhotoInputCamera');
    const photoInputGallery = document.getElementById('cellPhotoInputGallery');
    const photoPreview = document.getElementById('cellPhotoPreview');
    const photoPreviewImg = document.getElementById('cellPhotoPreviewImg');
    const saveCellPhotoBtn = document.getElementById('saveCellPhotoBtn');
    const retakeCellPhotoBtn = document.getElementById('retakeCellPhotoBtn');
    const toggleMarkBtn = document.getElementById('toggleMarkBtn');
    const deleteCurrentPhotoBtn = document.getElementById('deleteCurrentPhotoBtn');

    const handlePhotoChange = (e) => {
      const file = e.target.files?.[0];
      if (file) this.handleCellPhotoSelect(file);
      e.target.value = '';
    };

    // 閉じるボタン
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        this.closeCellModal();
      });
    }

    // 写真選択（カメラ・ギャラリー両方）
    if (photoInputCamera) photoInputCamera.addEventListener('change', handlePhotoChange);
    if (photoInputGallery) photoInputGallery.addEventListener('change', handlePhotoChange);

    // カメラ・ギャラリーラベルタップ → プライバシー注意ポップアップ → ファイル選択
    const cameraLabel  = document.getElementById('uploadPhotoLabelCamera');
    const galleryLabel = document.getElementById('uploadPhotoLabelGallery');
    const openWithPrivacy = (inputId) => (e) => {
      e.preventDefault(); // label のデフォルト（input クリック）を抑制
      this.showPhotoPrivacyModal(() => {
        document.getElementById(inputId)?.click();
      });
    };
    if (cameraLabel)  cameraLabel.addEventListener('click',  openWithPrivacy('cellPhotoInputCamera'));
    if (galleryLabel) galleryLabel.addEventListener('click', openWithPrivacy('cellPhotoInputGallery'));

    // 保存ボタン
    if (saveCellPhotoBtn) {
      saveCellPhotoBtn.addEventListener('click', () => {
        this.saveCellPhoto();
      });
    }
    
    // 撮り直しボタン（プレビューを消して適切な状態に戻す）
    if (retakeCellPhotoBtn && photoPreview) {
      retakeCellPhotoBtn.addEventListener('click', () => {
        if (photoInputCamera) photoInputCamera.value = '';
        if (photoInputGallery) photoInputGallery.value = '';
        photoPreview.style.display = 'none';
        this._revokeTempPhotoURL();
        this.tempPhotoData = null;
        this.tempPhotoBlob = null;
        const idx = this.currentPhotoIndex;
        const header = document.getElementById('cellModalHeader');
        if (idx !== null && this.photos[idx]) {
          // State A に戻る（ヘッダー不要）
          const photoDisplay = document.getElementById('cellPhotoDisplay');
          const photoImg = document.getElementById('cellPhotoImg');
          if (photoDisplay && photoImg) {
            photoImg.src = this.photos[idx];
            photoDisplay.style.display = 'block';
          }
          if (header) header.style.display = 'none';
          const noPhoto = document.getElementById('cellModalNoPhoto');
          if (noPhoto) noPhoto.style.display = 'none';
        } else {
          // State C に戻る（ヘッダー復元）
          const noPhoto = document.getElementById('cellModalNoPhoto');
          if (noPhoto) noPhoto.style.display = 'flex';
          const photoDisplay = document.getElementById('cellPhotoDisplay');
          if (photoDisplay) photoDisplay.style.display = 'none';
          if (header) header.style.display = '';
        }
      });
    }

    // 端末に保存ボタン
    const savePhotoToDeviceBtn = document.getElementById('savePhotoToDeviceBtn');
    if (savePhotoToDeviceBtn) {
      savePhotoToDeviceBtn.addEventListener('click', () => {
        const idx = this.currentPhotoIndex;
        if (idx !== null && this.photos[idx]) {
          this.savePhotoToDevice(this.photos[idx], `osanpo-bingo-${Date.now()}.jpg`);
        }
      });
    }
    
    // マーク切り替えボタン（写真なしでマーク）
    if (toggleMarkBtn) {
      toggleMarkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = this.currentPhotoIndex;
        if (idx !== null) {
          this.toggleMark(idx);
        }
      });
    }
    
    // 写真削除ボタン
    // 「変更」ボタン → プライバシー確認を経てカメラ起動
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    if (changePhotoBtn) {
      changePhotoBtn.addEventListener('click', openWithPrivacy('cellPhotoInputCamera'));
    }

    if (deleteCurrentPhotoBtn) {
      deleteCurrentPhotoBtn.addEventListener('click', () => {
        const delIdx = this.currentPhotoIndex;
        if (delIdx !== null && this.photos[delIdx]) {
          showConfirm('この写真を削除しますか？').then(async (ok) => {
            if (!ok) return;
            // IDB から削除
            await this.photoStorage.delete(delIdx).catch(() => {});
            // ObjectURL を解放
            if (this.photos[delIdx] && this.photos[delIdx].startsWith('blob:')) {
              URL.revokeObjectURL(this.photos[delIdx]);
            }
            delete this.photos[delIdx];
            delete this.photoBlobs[delIdx];
            this.renderBoard();
            this.updateStats();
            this.saveToStorage();
            this.showCellModal(delIdx);
          });
        }
      });
    }
  }
  
  // セル写真選択処理（Blob + ObjectURL に変更）
  handleCellPhotoSelect(file) {
    const preview = document.getElementById('cellPhotoPreview');
    const previewImg = document.getElementById('cellPhotoPreviewImg');
    const photoDisplay = document.getElementById('cellPhotoDisplay');

    if (!preview || !previewImg) return;

    if (photoDisplay) photoDisplay.style.display = 'none';

    this.compressImage(file, (blob) => {
      // 旧プレビュー URL を解放
      this._revokeTempPhotoURL();
      this.tempPhotoBlob = blob;
      this.tempPhotoData = URL.createObjectURL(blob);

      previewImg.src = this.tempPhotoData;
      preview.style.display = 'block';

      // ヘッダー非表示、プレビュータイトルを設定
      const header = document.getElementById('cellModalHeader');
      if (header) header.style.display = 'none';
      const previewTitle = document.getElementById('cellModalPreviewTitle');
      if (previewTitle && this.currentPhotoIndex !== null) {
        previewTitle.textContent = this.board[this.currentPhotoIndex]?.text ?? '';
      }

      const noPhoto = document.getElementById('cellModalNoPhoto');
      if (noPhoto) noPhoto.style.display = 'none';
    });
  }
  
  // マークを切り替え
  toggleMark(index) {
    if (this.gameType === 'battle' && index !== 12) {
      showAlert('バトルではマークだけで取得できません。写真をアップロードしてください。');
      return;
    }
    const wasMarked = this.markedCells.has(index);
    if (wasMarked) {
      this.markedCells.delete(index);
    } else {
      this.markedCells.add(index);
    }
    
    // マークした場合は即座にモーダルを閉じる（renderBoard より先に実行）
    if (!wasMarked && this.markedCells.has(index)) {
      if (navigator.vibrate) navigator.vibrate(30);
      const modal = document.getElementById('cellModal');
      if (modal) modal.style.display = 'none';
      this.currentPhotoIndex = null;
      this._revokeTempPhotoURL();
      this.tempPhotoData = null;
      this.tempPhotoBlob = null;
      const photoPreview = document.getElementById('cellPhotoPreview');
      if (photoPreview) photoPreview.style.display = 'none';
    }

    // 再レンダリング
    this.checkBingo();
    this.updateStats();
    this.saveToStorage();

    // マークアニメーション
    if (!wasMarked) {
      const cell = this.boardElement?.querySelector(`[data-index="${index}"]`);
      if (cell) {
        cell.classList.add('just-marked');
        cell.addEventListener('animationend', () => cell.classList.remove('just-marked'), { once: true });
      }
    }
    
    // ボタンのテキストを更新（モーダルがまだ開いている場合）
    const toggleMarkBtn = document.getElementById('toggleMarkBtn');
    if (toggleMarkBtn) {
      if (this.markedCells.has(index)) {
        toggleMarkBtn.textContent = 'マーク済み（解除）';
        toggleMarkBtn.classList.add('marked');
      } else {
        toggleMarkBtn.textContent = 'マークする';
        toggleMarkBtn.classList.remove('marked');
      }
    }
  }
  
  /**
   * 撮影前プライバシー注意ポップアップ（MHNスタイル）
   * セッション中に一度見た場合はスキップして callback を直接呼ぶ
   */
  showPhotoPrivacyModal(callback) {
    const SEEN_KEY = 'osanpo_photo_privacy_seen';
    if (sessionStorage.getItem(SEEN_KEY)) {
      callback();
      return;
    }
    const modal = document.getElementById('photoPrivacyModal');
    const okBtn = document.getElementById('photoPrivacyOkBtn');
    if (!modal || !okBtn) {
      callback();
      return;
    }
    const done = () => {
      sessionStorage.setItem(SEEN_KEY, '1');
      modal.style.display = 'none';
      okBtn.onclick = null;
      callback();
    };
    okBtn.onclick = done;
    modal.style.display = 'flex';
  }

  closeCellModal() {
    const modal = document.getElementById('cellModal');
    if (modal) modal.style.display = 'none';
    this.currentPhotoIndex = null;
    this._revokeTempPhotoURL(); // 未保存プレビュー URL を解放
    this.tempPhotoData = null;
    this.tempPhotoBlob = null;
    const photoInputCamera = document.getElementById('cellPhotoInputCamera');
    if (photoInputCamera) photoInputCamera.value = '';
    const photoInputGallery = document.getElementById('cellPhotoInputGallery');
    if (photoInputGallery) photoInputGallery.value = '';
    const photoPreview = document.getElementById('cellPhotoPreview');
    if (photoPreview) photoPreview.style.display = 'none';
  }
  
  // ── IndexedDB 写真ロード（起動時 / 新ゲーム後に呼ぶ）──────────────────
  // legacyPhotos: 旧 localStorage に残っていた {index: base64} データ（初回のみ非 null）
  async initPhotosFromIDB(legacyPhotos = null) {
    // 旧 localStorage 写真を IDB にマイグレーション
    if (legacyPhotos && Object.keys(legacyPhotos).length > 0) {
      for (const [idx, base64] of Object.entries(legacyPhotos)) {
        try {
          const res  = await fetch(base64);
          const blob = await res.blob();
          await this.photoStorage.save(Number(idx), blob);
        } catch (e) {
          console.warn('photo migration error, index:', idx, e);
        }
      }
      // マイグレーション完了 → localStorage から写真を除いた状態で保存
      this.saveToStorage();
      console.log('✅ 写真を IndexedDB にマイグレーションしました');
    }

    // IDB から全写真を読み込み ObjectURL を生成
    let blobs;
    try {
      blobs = await this.photoStorage.getAll();
    } catch (e) {
      console.warn('PhotoStorage getAll error:', e);
      return;
    }

    // 既存 ObjectURL を解放してから再構築
    this._revokeAllPhotoURLs();
    this.photos     = {};
    this.photoBlobs = {};

    for (const [idx, blob] of Object.entries(blobs)) {
      const key = Number(idx);
      this.photos[key]     = URL.createObjectURL(blob);
      this.photoBlobs[key] = blob;
    }

    // ボードが揃っていて写真があるときのみ再描画
    // （board が空 = 新ゲーム開始前の状態ではレンダリング不要）
    if (Object.keys(this.photos).length > 0 && this.board.length === 25) {
      this.renderBoard();
      this.updateStats();
    }
  }

  // ── ObjectURL 管理ヘルパー ──────────────────────────────────────────
  /** 未保存プレビュー URL だけ解放 */
  _revokeTempPhotoURL() {
    if (this.tempPhotoData && this.tempPhotoData.startsWith('blob:')) {
      URL.revokeObjectURL(this.tempPhotoData);
    }
  }

  /** this.photos に登録済みの全 ObjectURL を解放 */
  _revokeAllPhotoURLs() {
    Object.values(this.photos).forEach(url => {
      if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
  }

  // 画像圧縮 → Blob で返却（IndexedDB 保存用）
  // ・1200px 上限: ライトボックス表示でも十分な解像度を確保
  // ・quality 0.92: ガビガビ防止のため品質を引き上げ
  // ・ステップダウンスケーリング: iPhone の 4000px 超を一気に縮小すると
  //   iOS Safari の canvas が低品質ダウンサンプリングになるため、
  //   半分ずつ段階的に縮小して高品質を維持
  compressImage(file, callback) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const maxSize = 1600;

        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round(height * maxSize / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round(width * maxSize / height);
          height = maxSize;
        }

        // ステップダウンスケーリング（iOS Safari対策）
        // 一気に縮小すると粗くなるため、目標サイズの2倍を超えている間は半分ずつ縮小
        let current = img;
        let curW = img.naturalWidth;
        let curH = img.naturalHeight;

        while (curW / 2 > width || curH / 2 > height) {
          const stepW = Math.max(width, Math.floor(curW / 2));
          const stepH = Math.max(height, Math.floor(curH / 2));
          const step = document.createElement('canvas');
          step.width = stepW;
          step.height = stepH;
          const sCtx = step.getContext('2d');
          sCtx.imageSmoothingEnabled = true;
          sCtx.imageSmoothingQuality = 'high';
          sCtx.drawImage(current, 0, 0, stepW, stepH);
          current = step;
          curW = stepW;
          curH = stepH;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(current, 0, 0, width, height);

        canvas.toBlob((blob) => callback(blob), 'image/jpeg', 0.92);
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }
  
  // 写真をデバイスライブラリに保存
  //  - iOS: <a download> はカメラロール保存不可のため共有シート経由
  //  - Android / PC: <a download> で直接ダウンロード
  async savePhotoToDevice(photoData, filename) {
    try {
      const response = await fetch(photoData);
      const blob = await response.blob();
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isIOS) {
        const file = new File([blob], filename, { type: blob.type });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          // iOSはライブラリに直接保存できないため共有シート経由、操作方法を先に案内
          await showAlert('共有シートが開きます。\n「写真に保存」をタップするとカメラロールに保存されます 📸');
          try {
            await navigator.share({ files: [file], title: 'おさんぽビンゴ写真' });
            return;
          } catch (e) {
            if (e.name === 'AbortError') return;
            // Share失敗時はダウンロードにフォールバック
          }
        }
      }

      // Android / PC: 直接ダウンロード（iOS フォールバックも）
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      showAlert('写真の保存に失敗しました。');
    }
  }

  // 全写真をグリッド画像にまとめて保存
  async saveAllPhotosAsGrid() {
    const entries = [];
    for (let i = 0; i < 25; i++) {
      if (this.photos[i] && this.board[i] && !this.board[i].isFree) {
        entries.push({ src: this.photos[i], topic: this.board[i].text || '' });
      }
    }
    if (entries.length === 0) {
      showAlert('保存できる写真がありません。');
      return;
    }

    const COLS = 3;
    const CELL_W = 260;
    const PHOTO_H = 195;
    const LABEL_H = 34;
    const CELL_H = PHOTO_H + LABEL_H;
    const GAP = 8;
    const HEADER_H = 52;
    const PAD = GAP;
    const rows = Math.ceil(entries.length / COLS);
    const canvasW = PAD + COLS * CELL_W + (COLS - 1) * GAP + PAD;
    const canvasH = HEADER_H + PAD + rows * CELL_H + (rows - 1) * GAP + PAD;

    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');

    // 背景
    ctx.fillStyle = '#f0f7f0';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // ヘッダー帯
    ctx.fillStyle = '#157F1F';
    ctx.fillRect(0, 0, canvasW, HEADER_H);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('おさんぽビンゴ 写真まとめ', canvasW / 2, HEADER_H / 2);

    // 画像を並行ロード
    const loadImg = (src) => new Promise((res) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => res(null);
      img.src = src;
    });
    const imgs = await Promise.all(entries.map(e => loadImg(e.src)));

    const drawRoundRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    entries.forEach(({ topic }, idx) => {
      const col = idx % COLS;
      const row = Math.floor(idx / COLS);
      const x = PAD + col * (CELL_W + GAP);
      const y = HEADER_H + PAD + row * (CELL_H + GAP);

      // カード背景
      ctx.fillStyle = '#ffffff';
      drawRoundRect(x, y, CELL_W, CELL_H, 8);
      ctx.fill();

      // 写真を cover クリップ
      const img = imgs[idx];
      if (img) {
        ctx.save();
        drawRoundRect(x, y, CELL_W, PHOTO_H, 8);
        ctx.clip();
        const scale = Math.max(CELL_W / img.width, PHOTO_H / img.height);
        const sw = img.width * scale;
        const sh = img.height * scale;
        ctx.drawImage(img, x + (CELL_W - sw) / 2, y + (PHOTO_H - sh) / 2, sw, sh);
        ctx.restore();
      } else {
        ctx.fillStyle = '#eee';
        drawRoundRect(x, y, CELL_W, PHOTO_H, 8);
        ctx.fill();
      }

      // ラベル（省略付き）
      ctx.fillStyle = '#333333';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let label = topic;
      const maxW = CELL_W - 16;
      if (ctx.measureText(label).width > maxW) {
        while (ctx.measureText(label + '…').width > maxW && label.length > 0) {
          label = label.slice(0, -1);
        }
        label += '…';
      }
      ctx.fillText(label, x + CELL_W / 2, y + PHOTO_H + LABEL_H / 2);
    });

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    await this.savePhotoToDevice(dataUrl, `osanpo-bingo-photos-${date}.jpg`);
  }

  // セル写真を保存（IndexedDB に Blob で保存）
  async saveCellPhoto() {
    if (this.currentPhotoIndex === null || !this.tempPhotoBlob) return;
    // await を挟む前にインデックスとblobをスナップショット（モーダルclose競合でnullになるのを防ぐ）
    const claimIndex = this.currentPhotoIndex;
    const claimBlob  = this.tempPhotoBlob;
    if (this.gameType === 'battle') {
      const ownerId = this.getCellOwnerId(claimIndex);
      if (ownerId && ownerId !== this.battlePlayerId) {
        showAlert(`このマスは${parseOwnerName(ownerId)}が取得していました。`);
        this.closeCellModal();
        return;
      }
      // Step1: マスの先着取得（写真なし・小サイズのINSERT）
      // photo_data は別途 PATCH で送るため、ここではclaim本体のみ。
      // INSERTを軽量に保つことでサイズ制限エラーを防ぎ、クレームの確実性を高める。
      try {
        const claimResult = await this.claimBattleCellOnServer(claimIndex);
        if (claimResult === 'taken') {
          showAlert('このマスはすでに他の人が取得していました。');
          this.closeCellModal();
          return;
        }
        // 'claimed' / 'self' / 'unknown' → 写真保存処理を続行（unknownはシンクループで後から反映）
      } catch (e) {
        // サーバー通信エラー → ブロックせずローカル保存を続行。シンクループで後から同期。
        console.warn('battle claim server error, proceeding locally:', e);
      }
      // Step2: クレーム成功とみなしてローカル状態を即時反映
      this.battleCellOwners[claimIndex] = this.battlePlayerId;
      this.lastClaimedCellIndex = claimIndex;
    }
    
    // 振動フィードバック
    if (navigator.vibrate) navigator.vibrate(30);

    // IndexedDB に Blob 保存（スナップショット済みの claimIndex/claimBlob を使用）
    const idx = claimIndex;
    const blob = claimBlob;
    try {
      await this.photoStorage.save(idx, blob);
    } catch (e) {
      console.error('IndexedDB save error:', e);
      showAlert('写真の保存に失敗しました。\nもう一度お試しください。');
      return;
    }

    // 旧 ObjectURL を解放してから新しい URL をセット
    if (this.photos[idx] && this.photos[idx].startsWith('blob:')) {
      URL.revokeObjectURL(this.photos[idx]);
    }
    // プレビュー URL を解放して null にする
    // （closeCellModal からの二重 revoke を防ぐため先にクリア）
    this._revokeTempPhotoURL();
    this.tempPhotoData = null;
    this.tempPhotoBlob = null;
    const displayUrl = URL.createObjectURL(blob);
    this.photos[idx] = displayUrl;
    this.photoBlobs[idx] = blob;

    // GA: 写真保存
    sendGA('photo_saved', {
      difficulty:        this.difficulty,
      game_type:         this._gaGameType(),
      photo_count_total: Object.keys(this.photoBlobs).length,
      topic_tier:        this.board[idx]?.diff || 0,
      topic_category:    (this.board[idx]?.category || '').slice(0, 50),
    });

    // バトルモードでは battleCellOwners が唯一のソースのため追加しない
    if (this.gameType !== 'battle') {
      this.markedCells.add(idx);
    }

    // バトルモード: Step3 として写真を Supabase にアップロード（ノンブロッキング）
    // claimBattleCellOnServer でINSERTが確定した後に PATCH で photo_data を付与する。
    if (this.gameType === 'battle' && this.battleBackend.enabled && this.roomCode && this.roomCode !== 'solo') {
      this.compressToBase64(blob, 640, 0.75).then(base64 => {
        this.uploadPhotoCellOnServer(idx, base64);
      }).catch(() => {}); // 失敗は無視（ローカル写真はIndexedDBに保存済み）
    }

    // 再レンダリング
    this.checkBingo();
    this.updateStats();
    this.saveToStorage();

    // モーダルを閉じる
    this.closeCellModal();
  }
  
  
  // ストレージキー: バトルモードは合言葉ごとに分離（同一PC複数タブの競合防止）
  get _storageKey() {
    if (this.gameType === 'battle' && this.roomCode && this.roomCode !== 'solo') {
      return `osanpoBingo_battle_${this.roomCode}`;
    }
    return 'osanpoBingo';
  }

  // LocalStorageに保存（写真は IndexedDB で管理するため含めない）
  saveToStorage() {
    try {
      const data = {
        board: this.board,
        markedCells: Array.from(this.markedCells),
        bingoLines: this.bingoLines,
        roomCode: this.roomCode,
        difficulty: this.difficulty,
        topicSetId: this.topicSetId,
        playerCount: this.playerCount,
        // photos は IDB で管理 → localStorage には保存しない
        customTopics: this.customTopics,
        playMode: this.playMode,
        gameStartTime: this.gameStartTime,
        gameType: this.gameType,
        battlePlayerId: this.battlePlayerId,
        battleCellOwners: this.battleCellOwners,
        battleBingoOwners: this.battleBingoOwners,
        totalDistance: this.totalDistance,
        landmarkMode: this.landmarkMode,
        landmarkRegion: this.landmarkRegion,
        battlePaused: this._battlePaused
      };
      localStorage.setItem(this._storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('❌ 保存エラー:', error);
      if (error.name === 'QuotaExceededError') {
        showAlert('保存容量がいっぱいです。\n不要な写真を削除してから再度お試しください。');
      }
    }
  }
  
  // LocalStorageから読み込み
  loadFromStorage() {
    try {
      // _storageKey はページロード直後 gameType='normal'/roomCode='' のため 'osanpoBingo' を返す。
      // バトルセーブは 'osanpoBingo_battle_<roomCode>' に保存されているため、
      // ベースキーにデータがなければ battle_* キーをスキャンする。
      let json = localStorage.getItem(this._storageKey);
      if (!json) {
        const battleKey = Object.keys(localStorage)
          .find(k => k.startsWith('osanpoBingo_battle_') && k !== 'osanpoBingo_battle_');
        if (battleKey) json = localStorage.getItem(battleKey);
      }
      if (!json) return false;
      
      const data = JSON.parse(json);
      
      if (data.board && Array.isArray(data.board)) {
        this.board = data.board;
      }
      
      if (data.markedCells && Array.isArray(data.markedCells)) {
        this.markedCells = new Set(data.markedCells);
      }
      
      if (data.bingoLines && Array.isArray(data.bingoLines)) {
        this.bingoLines = data.bingoLines;
      }
      
      if (data.roomCode) {
        this.roomCode = data.roomCode;
      }
      
      if (data.difficulty) {
        this.difficulty = data.difficulty;
      }
      
      if (data.topicSetId && typeof data.topicSetId === 'string') {
        this.topicSetId = data.topicSetId;
      }
      
      if (data.playerCount) {
        this.playerCount = data.playerCount;
      }
      
      // 旧バージョンの base64 写真 → IDB マイグレーション用に一時保存
      if (data.photos && typeof data.photos === 'object' && Object.keys(data.photos).length > 0) {
        this._legacyPhotos = data.photos;
      }
      
      if (data.customTopics && Array.isArray(data.customTopics)) {
        this.customTopics = data.customTopics;
      }
      if (data.playMode === 'photo' || data.playMode === 'markOnly') {
        this.playMode = data.playMode;
      }
      if (data.gameStartTime != null) {
        this.gameStartTime = data.gameStartTime;
      }
      if (data.gameType === 'photo' || data.gameType === 'markOnly') {
        // 旧データ誤保存の互換回避
        this.gameType = 'normal';
      } else if (data.gameType === 'battle' || data.gameType === 'normal') {
        this.gameType = data.gameType;
      }
      if (typeof data.battlePlayerId === 'string' && data.battlePlayerId.includes('::')) {
        this.battlePlayerId = data.battlePlayerId;
      }
      if (data.battleCellOwners && typeof data.battleCellOwners === 'object') {
        this.battleCellOwners = data.battleCellOwners;
      }
      if (data.battleBingoOwners && typeof data.battleBingoOwners === 'object') {
        this.battleBingoOwners = data.battleBingoOwners;
      }
      if (typeof data.totalDistance === 'number') {
        this.totalDistance = data.totalDistance;
        // 保存時点での距離があればactiveとして扱う
        if (data.totalDistance > 0) this.locationState = 'active';
      }
      if (typeof data.landmarkMode === 'boolean') {
        this.landmarkMode = data.landmarkMode;
      }
      if (typeof data.landmarkRegion === 'string') {
        this.landmarkRegion = data.landmarkRegion;
      }
      if (typeof data.battlePaused === 'boolean') {
        this._battlePaused = data.battlePaused;
      }

      return true;
    } catch (error) {
      console.error('❌ 読み込みエラー:', error);
      return false;
    }
  }

  getOpponentName() {
    for (let i = 0; i < 25; i++) {
      const ownerId = this.battleCellOwners[i];
      if (ownerId && ownerId !== this.battlePlayerId) return parseOwnerName(ownerId);
    }
    return null;
  }

  /** ルーム内の参加済みプレイヤー色セットを取得するユーティリティ */
  async _fetchRoomPlayerColors() {
    // 未設定・solo の場合は空セットを返す（バックエンド未設定時も同様）
    if (!this.battleBackend.enabled || !this.roomCode || this.roomCode === 'solo') {
      return new Set();
    }
    const { url, key } = this.battleBackend;
    const res = await fetch(
      `${url}/rest/v1/${this.battleTable}?room_code=eq.${encodeURIComponent(this.roomCode)}&select=cell_index,owner_user_id&limit=200`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) throw new Error('fetch failed');
    const rows = await res.json();
    const takenColors = new Set();
    (rows || []).forEach(r => {
      const id = r?.owner_user_id || '';
      if (!id) return;
      if (id.startsWith('__settings__:')) {
        try {
          const s = JSON.parse(id.slice('__settings__:'.length));
          if (s.creatorId) takenColors.add(parseOwnerColor(s.creatorId));
        } catch {}
      } else {
        takenColors.add(parseOwnerColor(id));
      }
    });
    return takenColors;
  }

  /**
   * ルーム内で未使用のプレイヤー色を取得する。
   * 最大参加人数（MAX_BATTLE_PLAYERS = 3）を超えている場合は null を返す。
   * ネットワークエラーの場合は Error をスローして呼び出し元で区別できるようにする。
   */
  async pickAvailableColor() {
    if (!this.battleBackend.enabled || !this.roomCode || this.roomCode === 'solo') {
      return PLAYER_COLORS[0];
    }
    const takenColors = await this._fetchRoomPlayerColors(); // エラーはそのままスロー
    if (takenColors.size >= MAX_BATTLE_PLAYERS) return null;
    return PLAYER_COLORS.find(c => !takenColors.has(c)) || null;
  }

  /**
   * バトルモード: BINGO成立ラインのオーナーを battleCellOwners から決定論的に再計算する。
   * 各デバイスが同じ計算を行うことで、サーバーへの BINGO 記録なしに全端末で一致した
   * スコアを表示できる。
   *
   * ルール: ライン内でフリーマスを除く取得マス数が最多のプレイヤーがビンゴオーナー。
   *         同数の場合は player ID 昇順（決定論的タイブレーカー）。
   */
  recomputeBattleBingoOwners() {
    const lines = this.getAllLines();
    const newBingoOwners = {};
    lines.forEach((line, lineIndex) => {
      // ライン上の全マスがクレーム済みか（フリーマス含む）
      const allClaimed = line.every(idx => this.isAnyCellClaimed(idx));
      if (!allClaimed) return;
      // フリーマス以外のマスについてプレイヤー別取得数を集計
      const counts = {};
      line.forEach(idx => {
        if (this.board[idx]?.isFree) return;
        const owner = this.battleCellOwners[idx];
        if (owner) counts[owner] = (counts[owner] || 0) + 1;
      });
      // 最多取得者をビンゴオーナーに（同数は ID 昇順でタイブレーク）
      // bestOwner が null の初回は必ず更新し、null との比較を避ける
      let bestOwner = null, bestCount = -1;
      for (const [id, count] of Object.entries(counts)) {
        if (count > bestCount || (count === bestCount && bestOwner !== null && id < bestOwner)) {
          bestOwner = id;
          bestCount = count;
        }
      }
      if (bestOwner) newBingoOwners[lineIndex] = bestOwner;
    });
    return newBingoOwners;
  }

  // バトルビンゴ成立をサーバーに記録（cell_index 0-24 のみ許容のためサーバー側記録は廃止）
  async claimBingoLineOnServer(lineIndex) {
    // Supabase の CHECK 制約 (cell_index 0-24) のためビンゴライン記録は行わない。
    // ビンゴ判定は recomputeBattleBingoOwners() で battleCellOwners から毎回再計算する。
  }

  /**
   * バトルモード: クレーム済みセルに photo_data を追加アップロードする。
   * claimBattleCellOnServer（INSERT）とは別リクエストにすることで、
   * 大容量 base64 がINSERT本体のサイズ制限に引っかかる問題を回避する。
   * UPDATE RLS が付与されている前提で PATCH を使用する。
   */
  async uploadPhotoCellOnServer(index, photoBase64) {
    if (!this.battleBackend.enabled || !this.roomCode || this.roomCode === 'solo') return;
    if (!photoBase64 || photoBase64 === 'data:,') return;
    const { url, key } = this.battleBackend;
    const encodedRoom = encodeURIComponent(this.roomCode);
    try {
      await fetch(
        `${url}/rest/v1/${this.battleTable}?room_code=eq.${encodedRoom}&cell_index=eq.${index}&owner_user_id=eq.${encodeURIComponent(this.battlePlayerId)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: key,
            Authorization: `Bearer ${key}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({ photo_data: photoBase64 }),
        }
      );
    } catch (e) {
      console.warn('uploadPhotoCellOnServer failed (non-critical):', e);
    }
  }

  // ========== バトル: 相手マス写真表示 ==========

  /** 相手が取得したセルをタップしたときに写真モーダルを表示 */
  showBattleOpponentPhotoModal(index, ownerId) {
    const modal = document.getElementById('battleViewModal');
    if (!modal) return;

    const titleEl   = document.getElementById('battleViewTitle');
    const badgeEl   = document.getElementById('battleViewOwnerBadge');
    const photoWrap = document.getElementById('battleViewPhotoWrap');
    const photoEl   = document.getElementById('battleViewPhoto');
    const noPhotoEl = document.getElementById('battleViewNoPhoto');

    // セルのお題テキスト
    const cell = this.board[index];
    if (titleEl) titleEl.textContent = cell?.text || '';

    // オーナー名・色バッジ
    const name  = parseOwnerName(ownerId);
    const color = parseOwnerColor(ownerId);
    const colorDot = { blue: '🔵', red: '🔴', yellow: '🟡', green: '🟢' }[color] || '●';
    if (badgeEl) badgeEl.textContent = `${colorDot} ${name}`;

    // キャッシュ済み写真があれば即時表示、なければサーバーから取得
    const cached = this.battleOpponentPhotos[index];
    if (cached) {
      if (photoEl) photoEl.src = cached;
      if (photoWrap) photoWrap.style.display = '';
      if (noPhotoEl) noPhotoEl.style.display = 'none';
    } else {
      // 取得中は「読み込み中」を表示
      if (photoWrap) photoWrap.style.display = 'none';
      if (noPhotoEl) {
        noPhotoEl.style.display = '';
        noPhotoEl.textContent = '📡 読み込み中...';
      }
      // 非同期でサーバーから取得してキャッシュ（ownerId を指定して確実に特定）
      this.fetchOpponentCellPhoto(index, ownerId).then(data => {
        if (data) {
          this.battleOpponentPhotos[index] = data;
          // モーダルがまだ開いていれば写真に切り替え
          if (modal.style.display !== 'none' && photoEl) {
            photoEl.src = data;
            if (photoWrap) photoWrap.style.display = '';
            if (noPhotoEl) noPhotoEl.style.display = 'none';
          }
        } else {
          // 取得失敗 or 写真なし → 「まだ写真がありません」に切り替え
          if (modal.style.display !== 'none' && noPhotoEl) {
            noPhotoEl.textContent = '📷 まだ写真がありません';
          }
        }
      });
    }

    modal.style.display = 'flex';
  }

  /** Supabase から特定セルの photo_data を取得（オンデマンド） */
  async fetchOpponentCellPhoto(cellIndex, ownerId) {
    if (!this.battleBackend.enabled || !this.roomCode || this.roomCode === 'solo') return null;
    const { url, key } = this.battleBackend;
    try {
      // オーナーIDを絞り込むことで、別プレイヤーのレコードと混在しないよう確実に特定する
      const ownerFilter = ownerId ? `&owner_user_id=eq.${encodeURIComponent(ownerId)}` : '';
      const fetchUrl = `${url}/rest/v1/${this.battleTable}?select=photo_data&room_code=eq.${encodeURIComponent(this.roomCode)}&cell_index=eq.${cellIndex}${ownerFilter}`;
      const res = await fetch(fetchUrl, {
        headers: { apikey: key, Authorization: `Bearer ${key}` }
      });
      if (!res.ok) return null;
      const rows = await res.json();
      return rows?.[0]?.photo_data || null;
    } catch (e) {
      console.warn('fetchOpponentCellPhoto failed', e);
      return null;
    }
  }

  /** 画像Blobをリサイズ圧縮してbase64 data URLに変換 */
  compressToBase64(blob, maxWidth = 640, quality = 0.75) {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(blob);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const nw = img.naturalWidth  || img.width;
        const nh = img.naturalHeight || img.height;
        const ratio = Math.min(1, maxWidth / nw);
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(nw * ratio);
        canvas.height = Math.round(nh * ratio);
        const ctx2 = canvas.getContext('2d');
        ctx2.imageSmoothingEnabled = true;
        ctx2.imageSmoothingQuality = 'high';
        ctx2.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(null); };
      img.src = objectUrl;
    });
  }

  // スコアボード用: 全プレイヤーのスコアを計算
  getBattleScores() {
    const playerMap = new Map();
    const addPlayer = (id) => {
      if (!id || playerMap.has(id)) return;
      playerMap.set(id, { name: parseOwnerName(id), color: parseOwnerColor(id), marks: 0, bingos: 0 });
    };
    addPlayer(this.battlePlayerId);
    // プレゼンス登録済みプレイヤー（まだセルを取得していなくても表示）
    this.battlePresencePlayers?.forEach(id => addPlayer(id));
    Object.values(this.battleCellOwners).forEach(id => addPlayer(id));
    Object.values(this.battleBingoOwners).forEach(id => { if (id) addPlayer(id); });

    for (const ownerId of Object.values(this.battleCellOwners)) {
      if (ownerId && playerMap.has(ownerId)) playerMap.get(ownerId).marks++;
    }
    for (const ownerId of Object.values(this.battleBingoOwners)) {
      if (ownerId && playerMap.has(ownerId)) playerMap.get(ownerId).bingos++;
    }

    return Array.from(playerMap.entries())
      .map(([id, p]) => ({ ...p, id, total: p.marks + p.bingos * 3 }))
      .sort((a, b) => b.total - a.total);
  }

  // バトル用: 自分・相手問わず誰かがクレームしているか
  isAnyCellClaimed(index) {
    if (this.board[index]?.isFree) return true;
    if (this.gameType === 'battle') {
      return !!this.battleCellOwners[index];
    }
    return this.markedCells.has(index);
  }

  normalizeTopicKey(text) {
    return String(text || '').trim().toLowerCase();
  }

  getTopicKeyByIndex(index) {
    const topic = this.board[index];
    if (!topic || topic.isFree) return '';
    return this.normalizeTopicKey(topic.text);
  }

  getCellOwnerId(index) {
    if (this.board[index]?.isFree) return '';
    return this.battleCellOwners[index] || '';
  }
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
  const game = new OsanpoBingo();
  game.init();
  
  // デバッグ用にグローバルに公開
  window.game = game;
});
