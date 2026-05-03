// バトルモード: v1.0では封印中。有効化するには true に変更する。
const BATTLE_MODE_ENABLED = false;

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

function getBattlePlayerId() {
  let id = sessionStorage.getItem('osanpo_battle_player_id');
  if (!id) {
    id = 'bp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem('osanpo_battle_player_id', id);
  }
  return id;
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
    this.photos = {};             // {index: base64Data}
    this.currentPhotoIndex = null; // 現在写真を撮影中のインデックス
    
    // フリー入力マス
    this.customTopics = [];       // ユーザーが入力したカスタムお題 [{text, icon}]
    
    // 遊び方（写真で記録 / マークだけ）
    this.playMode = 'photo';      // 'photo' | 'markOnly'
    this.gameStartTime = null;    // ゲーム開始時刻（プレイ時間表示用）
    this.gameType = 'normal';     // 'normal' | 'battle'
    this.battleTopicOwners = {};  // バトル用: {topicKey: userId}
    this.battlePlayerId = getBattlePlayerId();
    this.battleBackend = getBattleBackendConfig();
    this.battleTable = 'battle_cell_owners';
    this.battleSyncTimer = null;
    this.debugBattle = new URLSearchParams(window.location.search).get('debugBattle') === '1';
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
    
    if (!loaded || this.board.length !== 25) {
      this.showRoomCodeModal();
    } else {
      // 既存データを使用（モーダルを確実に非表示にしてボードを操作可能に）
      const roomModal = document.getElementById('roomCodeModal');
      if (roomModal) roomModal.style.display = 'none';
      this.checkBingo();
      this.updateStats();
      if (BATTLE_MODE_ENABLED && this.gameType === 'battle') {
        this.syncBattleOwnersFromServer();
        this.startBattleSyncLoop();
      } else {
        this.stopBattleSyncLoop();
      }
      // 位置情報トラッキング開始
      this.startLocationTracking();
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
    
    // 終わるボタン
    const endGameBtn = document.getElementById('endGameBtn');
    if (endGameBtn) {
      endGameBtn.addEventListener('click', () => this.endGame());
    }
    
    // 結果画面：決定・ダウンロード・共有・戻る
    this.setupResultView();
    
    // 合言葉をクリックでコピー
    const roomCodeStat = document.getElementById('roomCodeStat');
    if (roomCodeStat) {
      roomCodeStat.addEventListener('click', () => this.copyRoomCode());
    }
    
    // 合言葉モーダル
    this.setupRoomCodeModal();
    this.populateTopicSetSelects();
    ['topicSetSelectSolo', 'topicSetSelectCreate', 'topicSetSelectJoin'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => this.updateTopicSetHelpFor(el));
    });
    
    // 設定ボタン（プレイ中に設定モーダルを開く）
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.showRoomCodeModal(true));
    }
    
    // 写真モーダル
    this.setupPhotoModal();

    document.addEventListener('visibilitychange', () => {
      if (!BATTLE_MODE_ENABLED) return;
      if (document.visibilityState === 'visible') {
        this.startBattleSyncLoop();
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
    
    const boardSeedUserId = this.userId;
    // 難易度に応じてランダムお題を取得
    const randomTopics = selectTopicsForGame(
      this.difficulty, 
      this.roomCode, 
      boardSeedUserId,
      shuffleSalt,
      this.topicSetId || 'default'
    ).slice(0, randomCount);
    
    // カスタムお題 + ランダムお題を合わせてシャッフル
    const allTopics = [...this.customTopics, ...randomTopics];
    const seedStr = [this.roomCode, boardSeedUserId, shuffleSalt, 'mix', this.topicSetId || 'default'].filter(Boolean).join('-');
    const seed = stringToSeed(seedStr);
    // シャッフル後に四隅制約を適用（ガチおに以外はおにが四隅に来ないよう保証）
    const shuffledTopics = enforceCornerConstraint(
      shuffleWithSeed(allTopics, seed),
      this.difficulty
    );
    
    // 25マスのボードを作成（中央はFREE・表示はアイコンのみ）
    this.board = [];
    for (let i = 0; i < 25; i++) {
      if (i === 12) {
        this.board.push({text: '', icon: '⭐', isFree: true});
      } else {
        const topicIndex = i < 12 ? i : i - 1;
        this.board.push(shuffledTopics[topicIndex]);
      }
    }
    
    // マークと写真をクリア
    this.markedCells.clear();
    this.bingoLines = [];
    this.photos = {};
    this.battleTopicOwners = {};
    
    // 保存
    this.saveToStorage();
  }

  async syncBattleOwnersFromServer() {
    if (this.gameType !== 'battle' || !this.battleBackend.enabled || !this.roomCode || this.roomCode === 'solo') {
      return;
    }
    try {
      const endpointUrl = new URL(`${this.battleBackend.url}/rest/v1/${this.battleTable}`);
      endpointUrl.searchParams.set('select', 'topic_key,cell_index,owner_user_id');
      endpointUrl.searchParams.set('room_code', `eq.${this.roomCode}`);
      const res = await fetch(endpointUrl.toString(), {
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
      (rows || []).forEach((row) => {
        let topicKey = typeof row?.topic_key === 'string' ? row.topic_key : '';
        if (!topicKey) {
          const idx = Number(row?.cell_index);
          if (Number.isInteger(idx) && idx >= 0 && idx < 25) {
            topicKey = this.getTopicKeyByIndex(idx);
          }
        }
        const ownerId = typeof row?.owner_user_id === 'string' ? row.owner_user_id : '';
        if (topicKey && ownerId) {
          nextOwners[topicKey] = ownerId;
        }
      });
      this.battleTopicOwners = nextOwners;
      this.checkBingo();
      this.updateStats();
      this.saveToStorage();
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

  startBattleSyncLoop() {
    this.stopBattleSyncLoop();
    if (this.gameType !== 'battle' || !this.battleBackend.enabled || !this.roomCode || this.roomCode === 'solo') {
      return;
    }
    this.syncBattleOwnersFromServer();
    this.battleSyncTimer = setInterval(() => {
      this.syncBattleOwnersFromServer();
    }, 4000);
  }

  stopBattleSyncLoop() {
    if (this.battleSyncTimer) {
      clearInterval(this.battleSyncTimer);
      this.battleSyncTimer = null;
    }
  }

  // 戻り値: 'claimed'=新規取得成功 / 'self'=自分が既に所持（冪等） / 'taken'=他人が先取り
  async claimBattleCellOnServer(index) {
    if (this.gameType !== 'battle' || !this.battleBackend.enabled || !this.roomCode || this.roomCode === 'solo') {
      return 'claimed';
    }
    const topicKey = this.getTopicKeyByIndex(index);
    if (!topicKey) return 'claimed';
    const { url, key } = this.battleBackend;

    // POST（先着取得試行）
    const postRes = await fetch(`${url}/rest/v1/${this.battleTable}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'resolution=ignore-duplicates,return=representation'
      },
      body: JSON.stringify({
        room_code: this.roomCode,
        topic_key: topicKey,
        // cell_index は参考値。各プレイヤーでボードレイアウトが異なるため
        // 競合判定には使用しない（topic_key の UNIQUE 制約が先着判定の肝）
        cell_index: index,
        owner_user_id: this.battlePlayerId
      })
    });
    if (!postRes.ok) {
      this.lastBattleSyncStatus = `claim_http_${postRes.status}`;
      this.lastBattleSyncError = 'claim_failed';
      this.updateDebugPanel();
      throw new Error(`claim failed: ${postRes.status}`);
    }
    const postRows = await postRes.json();

    // 取得成功
    if (Array.isArray(postRows) && postRows.length > 0) {
      this.lastBattleSyncStatus = 'claim_ok';
      this.lastBattleSyncError = '';
      this.updateDebugPanel();
      return 'claimed';
    }

    // 空配列 → 既に誰かが持っている → GET で実オーナーを確認（冪等性チェック）
    let getRows = [];
    try {
      const getRes = await fetch(
        `${url}/rest/v1/${this.battleTable}?room_code=eq.${encodeURIComponent(this.roomCode)}&topic_key=eq.${encodeURIComponent(topicKey)}&select=owner_user_id`,
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
      
      // ランドマーク / 難易度クラス
      if (!topic.isFree) {
        if (topic.type === 'landmark') {
          cell.classList.add('cell-landmark');
        } else {
          const diff = topic.diff || 'normal';
          if (diff === 'oni') {
            cell.classList.add('cell-diff-oni');
          } else if (diff === 'hard') {
            cell.classList.add('cell-diff-hard');
          }
        }
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
      // リーチラインに含まれる（ビンゴ済みラインは除外）
      const isInReachLine = !isInBingoLine && this.reachLines.some(line => line.includes(index));
      if (isInReachLine) {
        cell.classList.add('reach');
      }
      if (this.gameType === 'battle' && ownerId) {
        cell.classList.add('claimed');
        if (ownerId !== this.battlePlayerId) {
          cell.classList.add('locked');
        } else {
          cell.classList.add('claimed-self');
        }
      }
      
      // 中央マスはテキスト非表示（アイコンのみ）
      const displayText = index === 12 ? '' : topic.text;
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
        cell.innerHTML = index === 12
          ? `<div class="cell-photo-wrap"><img class="cell-photo-img" src="${this.photos[index]}" alt=""></div>`
          : `<div class="cell-photo-wrap"><img class="cell-photo-img" src="${this.photos[index]}" alt=""></div><div class="cell-text ${sizeClass}">${displayText}</div>`;
      } else {
        cell.innerHTML = index === 12
          ? getTopicIcon(topic)
          : `${getTopicIcon(topic)}<div class="cell-text ${sizeClass}">${displayText}</div>`;
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
      this.drawBingoLines();
    });
  }

  drawBingoLines() {
    const existing = this.boardElement?.querySelector('.bingo-lines-svg');
    if (existing) existing.remove();
    if (!this.boardElement || this.bingoLines.length === 0) return;

    const boardRect = this.boardElement.getBoundingClientRect();
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'bingo-lines-svg');
    svg.setAttribute('width', boardRect.width);
    svg.setAttribute('height', boardRect.height);

    this.bingoLines.forEach(line => {
      const firstCell = this.boardElement.querySelector(`[data-index="${line[0]}"]`);
      const lastCell  = this.boardElement.querySelector(`[data-index="${line[line.length - 1]}"]`);
      if (!firstCell || !lastCell) return;

      const fr = firstCell.getBoundingClientRect();
      const lr = lastCell.getBoundingClientRect();
      const x1 = fr.left + fr.width  / 2 - boardRect.left;
      const y1 = fr.top  + fr.height / 2 - boardRect.top;
      const x2 = lr.left + lr.width  / 2 - boardRect.left;
      const y2 = lr.top  + lr.height / 2 - boardRect.top;

      // 影線（視認性向上）
      const shadow = document.createElementNS(NS, 'line');
      shadow.setAttribute('x1', x1); shadow.setAttribute('y1', y1);
      shadow.setAttribute('x2', x2); shadow.setAttribute('y2', y2);
      shadow.setAttribute('stroke', 'rgba(0,0,0,0.35)');
      shadow.setAttribute('stroke-width', '8');
      shadow.setAttribute('stroke-linecap', 'round');
      svg.appendChild(shadow);

      // メイン線（白）
      const main = document.createElementNS(NS, 'line');
      main.setAttribute('x1', x1); main.setAttribute('y1', y1);
      main.setAttribute('x2', x2); main.setAttribute('y2', y2);
      main.setAttribute('stroke', '#ffffff');
      main.setAttribute('stroke-width', '5');
      main.setAttribute('stroke-linecap', 'round');
      svg.appendChild(main);
    });

    this.boardElement.appendChild(svg);
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

    const MIN_PX = 7;

    // はみ出しがなければそのまま終了
    if (textEl.scrollWidth <= textEl.offsetWidth) return;

    let pxSize = parseFloat(getComputedStyle(textEl).fontSize);
    while (textEl.scrollWidth > textEl.offsetWidth + 1 && pxSize > MIN_PX) {
      pxSize -= 0.5;
      textEl.style.fontSize = pxSize + 'px';
    }
  }

  // セルクリック処理
  handleCellClick(index) {
    if (index === 12) return;
    const ownerId = this.getCellOwnerId(index);
    if (this.gameType === 'battle' && ownerId && ownerId !== this.battlePlayerId) {
      showAlert('このマスはすでに他の人が取得しています。');
      return;
    }
    
    if (this.playMode === 'markOnly') {
      if (this.gameType === 'battle') {
        showAlert('バトルでは写真アップロード時にマス取得となります。');
        this.showCellModal(index);
        return;
      }
      this.toggleMark(index);
      return;
    }
    this.showCellModal(index);
  }
  
  // ビンゴ判定
  isCellClaimed(index) {
    if (this.board[index]?.isFree) return true;
    if (this.gameType === 'battle') {
      const topicKey = this.getTopicKeyByIndex(index);
      if (!topicKey) return false;
      return this.battleTopicOwners[topicKey] === this.battlePlayerId;
    }
    return this.markedCells.has(index);
  }

  checkBingo() {
    const lines = this.getAllLines();
    const newBingoLines = [];
    const newReachLines = [];

    lines.forEach(line => {
      const markedCount = line.filter(idx => this.isCellClaimed(idx)).length;
      if (markedCount === 5) {
        newBingoLines.push(line);
      } else if (markedCount === 4) {
        newReachLines.push(line);
      }
    });

    const oldBingoCount = this.bingoLines.length;
    const oldReachCount = this.reachLines.length;
    this.bingoLines = newBingoLines;
    this.reachLines = newReachLines;
    const newBingoCount = this.bingoLines.length;
    const newReachCount = this.reachLines.length;

    this.renderBoard();
    this.updateStats();

    if (newBingoCount > oldBingoCount) {
      this.showBingoMessage(newBingoCount);
      this.showBingoCelebration(newBingoLines, oldBingoCount);
    } else if (newReachCount > oldReachCount && newBingoCount === 0) {
      // ビンゴが1本もない場合のみリーチ演出を出す
      this.showReachEffect(newReachCount);
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
    
    this.messageElement.textContent = `🎉 ${count}本ビンゴ！`;
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
    el.innerHTML = `<span class="big">🎉 BINGO!</span><span class="sub">${count > 1 ? count + '本ビンゴ達成！' : 'ビンゴ達成！'}</span>`;
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

    // 精度 30m 超はノイズとして無視
    if (accuracy > 30) return;

    // 最初の有効な位置が取れた → active に
    this.locationState = 'active';

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
      this.markedCountElement.textContent = this.gameType === 'battle'
        ? this.getBattleCounts().selfClaims
        : this.markedCells.size;
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
    if (this.opponentClaimedCountElement) {
      const statItem = this.opponentClaimedCountElement.closest('.stat-item');
      if (this.gameType === 'battle') {
        this.opponentClaimedCountElement.textContent = this.getBattleCounts().opponentClaims;
        if (statItem) statItem.style.display = '';
      } else {
        if (statItem) statItem.style.display = 'none';
      }
    }
    if (this.distanceElement) {
      this.distanceElement.textContent = this.formatDistance(this.totalDistance);
    }
    this.updateDebugPanel();
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
    const ownerCount = Object.keys(this.battleTopicOwners || {}).length;
    const syncText = this.lastBattleSyncAt ? new Date(this.lastBattleSyncAt).toLocaleTimeString() : '-';
    this.debugPanelEl.textContent = `debug battle | room=${this.roomCode || '-'} | mode=${this.gameType} | player=${this.battlePlayerId} | owners=${ownerCount} | lastSync=${syncText} | status=${this.lastBattleSyncStatus} | err=${this.lastBattleSyncError || '-'}`;
  }
  
  // 終了（結果記録・共有画面を表示）
  endGame() {
    if (!this.board || this.board.length !== 25) {
      showAlert('まずはゲームを始めてみましょう！');
      return;
    }
    showConfirm('お散歩ビンゴを終了しますか？\n結果を記録・共有できます。').then((ok) => {
      if (ok) this.showResultView();
    });
  }
  
  // 結果画面を表示（編集モード）
  showResultView() {
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
      // クローン後にセルサイズが変わるため、テキストを再フィット
      requestAnimationFrame(() => {
        clone.querySelectorAll('.bingo-cell').forEach(c => this.fitCellText(c));
      });
      // 写真ありセルのみタップで拡大表示
      clone.addEventListener('click', (e) => {
        const cell = e.target.closest('.bingo-cell.has-photo');
        if (!cell) return;
        const img = cell.querySelector('.cell-photo-img');
        if (img) this.showResultPhotoLightbox(img.src);
      });
    }
    
    // 統計を表示
    const bingoCountEl = document.getElementById('screenshotBingoCount');
    const markedCountEl = document.getElementById('screenshotMarkedCount');
    if (bingoCountEl) bingoCountEl.textContent = this.bingoLines.length;
    if (markedCountEl) {
      markedCountEl.textContent = (BATTLE_MODE_ENABLED && this.gameType === 'battle')
        ? this.getBattleCounts().selfClaims
        : this.markedCells.size;
    }

    // 距離を表示
    const distEl = document.getElementById('screenshotDistance');
    if (distEl) distEl.textContent = this.formatDistance(this.totalDistance);
    const distDivider = document.getElementById('screenshotDistanceDivider');
    if (distDivider) distDivider.classList.remove('hidden');

    // 結果確定時にトラッキング停止
    this.stopLocationTracking();

    // グループ入力欄をクリア
    const groupInput = document.getElementById('resultGroupInput');
    if (groupInput) groupInput.value = '';

    view.style.display = 'flex';
  }
  
  /** 写真をフルスクリーンで表示するライトボックス */
  showResultPhotoLightbox(src) {
    const existing = document.getElementById('resultPhotoLightbox');
    if (existing) existing.remove();

    const box = document.createElement('div');
    box.id = 'resultPhotoLightbox';
    box.className = 'result-photo-lightbox';
    box.innerHTML = `
      <img src="${src}" alt="写真">
      <span class="result-photo-lightbox-hint">タップして閉じる</span>
    `;
    box.addEventListener('click', () => box.remove());
    // Escキーでも閉じる
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
  }
  
  // 決定ボタン：編集内容を確定して共有エリアに表示
  confirmResult() {
    const editArea = document.getElementById('resultEditArea');
    const shareArea = document.getElementById('resultShareArea');
    
    if (!editArea || !shareArea) return;
    
    const groupText = (document.getElementById('resultGroupInput')?.value || '').trim();
    const dateEl = document.getElementById('resultDate');
    const boardEl = document.getElementById('screenshotBoard');
    
    document.getElementById('resultCaptureTitle').textContent = 'お散歩ビンゴ';
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
        : this.markedCells.size;
    
    const captureBoard = document.getElementById('resultCaptureBoard');
    if (captureBoard && boardEl?.firstChild) {
      const clone = boardEl.firstChild.cloneNode(true);
      captureBoard.innerHTML = '';
      captureBoard.appendChild(clone);
    }
    
    editArea.style.display = 'none';
    shareArea.style.display = 'flex';
  }
  
  // 画像をダウンロード
  downloadResultImage() {
    const area = document.getElementById('resultCaptureArea');
    if (!area || typeof html2canvas === 'undefined') {
      showAlert('画像の準備ができませんでした。\nもう一度お試しください。');
      return;
    }
    
    const opts = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      imageTimeout: 15000
    };
    
    html2canvas(area, opts).then((canvas) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          showAlert('画像の保存に失敗しました。\nもう一度お試しください。');
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'osanpo-bingo-' + new Date().toISOString().slice(0, 10) + '.png';
        link.href = url;
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showAlert('画像を保存しました。');
      }, 'image/png', 1);
    }).catch((err) => {
      console.error('html2canvas error:', err);
      showAlert('画像の保存に失敗しました。\nもう一度お試しください。');
    });
  }
  
  // SNSで共有（テキストを優先＝ユーザー操作直後に実行で確実に動作）
  shareToSns() {
    const text = this.getShareText();
    const shareUrl = window.location.href.replace(/game\.html.*$/, '') || window.location.origin + '/';
    
    if (navigator.share) {
      navigator.share({
        title: 'お散歩ビンゴ',
        text: text,
        url: shareUrl
      }).then(() => {
        showAlert('共有しました！\nお疲れさまでした。');
      }).catch((err) => {
        if (err.name === 'AbortError') return;
        this.copyShareText(text);
      });
      return;
    }
    
    this.copyShareText(text);
  }
  
  getShareText() {
    let groupText = document.getElementById('resultCaptureGroup')?.textContent || '';
    if (groupText === '-') groupText = '';
    const dateEl = document.getElementById('resultCaptureDate');
    const playTimeEl = document.getElementById('resultCapturePlayTime')?.textContent || '';
    const bingo = this.bingoLines.length;
    const marked = (BATTLE_MODE_ENABLED && this.gameType === 'battle')
      ? this.getBattleCounts().selfClaims
      : this.markedCells.size;
    return [
      'お散歩ビンゴで遊んだ！',
      dateEl?.textContent || '',
      playTimeEl ? playTimeEl + ' ' : '',
      groupText ? groupText + ' ' : '',
      'ビンゴ' + bingo + '本・マーク' + marked + 'マス' + (this.totalDistance > 0 ? '・' + this.formatDistance(this.totalDistance) + '歩いた' : ''),
      '#お散歩ビンゴ #散歩 #ビンゴ'
    ].filter(Boolean).join('\n');
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
    try {
      localStorage.removeItem('osanpoBingo');
    } catch (e) {}

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
  
  // 作り直す（お題をランダムシャッフル）
  newGame() {
    showConfirm('お題をシャッフルして\n新しいビンゴを作りますか？').then((ok) => {
      if (!ok) return;
      // バトルは同じ合言葉で同じシートを維持する
      // バトルは shuffleSalt を固定するが、createBoard 内で userId がシードに含まれるため
      // 各プレイヤーのマス配置は異なる。競合判定は topic_key ベースで行うため問題なし。
      const shuffleSalt = this.gameType === 'battle' ? '' : Date.now().toString();
      this.createBoard(this.roomCode, this.difficulty, shuffleSalt, null);
      this.markCell(12);
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
  
  // セルをマーク（プログラムから）
  markCell(index) {
    this.markedCells.add(index);
  }
  
  populateTopicSetSelects() {
    if (typeof topicSets === 'undefined') return;
    const available = topicSets.filter(
      (s) => s.monetizationType === 'free' || s.monetizationType === 'sponsored-ready'
    );
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
      if (this.topicSetId && available.some((s) => s.id === this.topicSetId)) {
        sel.value = this.topicSetId;
      } else {
        sel.value = 'default';
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
    const playerCountInput = document.getElementById('playerCountInput');
    const gameTypeCreate = document.getElementById('gameTypeCreate');
    const gameTypeJoin = document.getElementById('gameTypeJoin');
    const customTopicCountSelect = document.getElementById('customTopicCount');
    const customTopicInputsContainer = document.getElementById('customTopicInputs');
    
    const hideAllSteps = () => {
      [modeSelectStep, soloGameStep, groupModeSelectStep, createGameStep, joinGameStep].forEach(el => { if (el) el.style.display = 'none'; });
    };
    
    if (roomCodeInput) {
      roomCodeInput.value = (this.roomCode && this.roomCode !== 'solo') ? this.roomCode : this.generateRoomCode();
    }
    if (difficultySelect) difficultySelect.value = this.difficulty || 'normal';
    if (playerCountInput) playerCountInput.value = this.playerCount || 1;
    
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
    if (gameTypeCreate) gameTypeCreate.value = this.gameType || 'normal';
    if (gameTypeJoin) gameTypeJoin.value = this.gameType || 'normal';
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
        if (roomCodeInput && !roomCodeInput.value) roomCodeInput.value = this.generateRoomCode();
      });
    }
    
    if (modeJoinBtn) {
      modeJoinBtn.addEventListener('click', () => {
        hideAll();
        if (joinGameStep) joinGameStep.style.display = 'block';
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
        this.battleTopicOwners = {};
        const customTopics = this.collectCustomTopics(customTopicInputsSolo);
        this.gameStartTime = Date.now();
        this.roomCode = 'solo';
        this.playerCount = 1;
        this.createBoard('solo', this.difficulty, '', customTopics);
        this.markCell(12);
        this.checkBingo();
        this.totalDistance = 0;
        this.lastPosition = null;
        this.stopLocationTracking();
        this.startLocationTracking();
        this.updateStats();
        if (modal) modal.style.display = 'none';
        if (this.messageElement) this.messageElement.style.display = 'none';
      });
    }
    
    // ゲーム開始ボタン（みんなで・作成モード）
    if (startGameBtn) {
      startGameBtn.addEventListener('click', () => {
        this.stopBattleSyncLoop();
        const difficultySelect = document.getElementById('difficultySelect');
        const playerCountInput = document.getElementById('playerCountInput');
        const gameTypeCreate = document.getElementById('gameTypeCreate');
        const modal = document.getElementById('roomCodeModal');
        
        const roomCode = roomCodeInput?.value.trim() || this.generateRoomCode();
        const difficulty = difficultySelect?.value || 'normal';
        const playerCount = parseInt(playerCountInput?.value) || 1;
        
        // フリー入力マスのお題を収集
        const customTopics = this.collectCustomTopics();
        
        // 参加人数を保存
        this.playerCount = Math.max(1, Math.min(99, playerCount));
        
        this.topicSetId = document.getElementById('topicSetSelectCreate')?.value || 'default';
        const playModeRadio = document.querySelector('input[name="playModeCreate"]:checked');
        this.playMode = playModeRadio?.value === 'markOnly' ? 'markOnly' : 'photo';
        this.gameType = BATTLE_MODE_ENABLED
          ? (gameTypeCreate?.value || 'normal')
          : 'normal';
        if (this.gameType === 'battle' && !this.battleBackend.enabled) {
          showAlert('バトル連携設定が未入力のため、この端末内のみでバトル挙動を行います。');
        }
        this.gameStartTime = Date.now();
        this.battleTopicOwners = {};

        this.createBoard(roomCode, difficulty, '', customTopics);
        this.markCell(12);
        this.checkBingo();
        this.totalDistance = 0;
        this.lastPosition = null;
        this.stopLocationTracking();
        this.startLocationTracking();
        this.updateStats();
        this.syncBattleOwnersFromServer();
        this.startBattleSyncLoop();

        if (modal) modal.style.display = 'none';
        if (this.messageElement) this.messageElement.style.display = 'none';
      });
    }

    // 参加ボタン（参加モード）
    if (joinGameBtn) {
      joinGameBtn.addEventListener('click', () => {
        this.stopBattleSyncLoop();
        const joinRoomCode = document.getElementById('joinRoomCodeInput');
        const joinDifficulty = document.getElementById('joinDifficultySelect');
        const gameTypeJoin = document.getElementById('gameTypeJoin');
        const modal = document.getElementById('roomCodeModal');
        const customTopicInputsJoin = document.getElementById('customTopicInputsJoin');
        
        const roomCode = joinRoomCode?.value.trim();
        if (!roomCode) {
          showAlert('合言葉を入力してください');
          return;
        }
        
        const difficulty = joinDifficulty?.value || 'normal';
        this.topicSetId = document.getElementById('topicSetSelectJoin')?.value || 'default';
        const playModeRadio = document.querySelector('input[name="playModeJoin"]:checked');
        this.playMode = playModeRadio?.value === 'markOnly' ? 'markOnly' : 'photo';
        this.gameType = BATTLE_MODE_ENABLED
          ? (gameTypeJoin?.value || 'normal')
          : 'normal';
        if (this.gameType === 'battle' && !this.battleBackend.enabled) {
          showAlert('バトル連携設定が未入力のため、この端末内のみでバトル挙動を行います。');
        }
        this.gameStartTime = Date.now();
        this.battleTopicOwners = {};
        
        this.playerCount = 1;
        // グループ＋自由記載：作った人から教えてもらったお題を入力（同じお題セットで並びだけ各自違うボードになる）
        const customTopics = customTopicInputsJoin ? this.collectCustomTopics(customTopicInputsJoin) : [];
        this.createBoard(roomCode, difficulty, '', customTopics);
        this.markCell(12);
        this.checkBingo();
        this.totalDistance = 0;
        this.lastPosition = null;
        this.stopLocationTracking();
        this.startLocationTracking();
        this.updateStats();
        this.syncBattleOwnersFromServer();
        this.startBattleSyncLoop();
        
        if (modal) modal.style.display = 'none';
        if (this.messageElement) this.messageElement.style.display = 'none';
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
    // 3-5文字の単語リスト
    const words = [
      // 色（3文字）
      'きいろ', 'みどり', 'ちゃいろ', 'むらさき', 'ももいろ',
      // 自然（3-4文字）
      'そら', 'うみ', 'やま', 'かわ', 'もり', 'いけ', 'たに', 'はやし',
      // 植物（3-5文字）
      'はな', 'さくら', 'ばら', 'すみれ', 'ひまわり', 'こすもす', 'たんぽぽ',
      // 動物（3-5文字）
      'ねこ', 'いぬ', 'とり', 'さかな', 'うさぎ', 'くま', 'きつね', 'りす',
      // 天体（3-4文字）
      'ほし', 'つき', 'にじ', 'ひかり', 'たいよう',
      // 季節・時間（3-4文字）
      'はる', 'なつ', 'あき', 'ふゆ', 'あさひ', 'ゆうひ', 'よぞら',
      // 天気（3-4文字）
      'はれ', 'くもり', 'あめ', 'ゆき', 'かぜ', 'つゆ', 'きり',
      // 場所（3-4文字）
      'みち', 'はし', 'にわ', 'こうえん', 'ひろば', 'みなと',
      // 感情・様子（3-5文字）
      'えがお', 'げんき', 'わくわく', 'どきどき', 'にこにこ', 'きらきら',
      // その他（3-4文字）
      'ゆめ', 'うた', 'おと', 'いろ', 'かげ', 'みず', 'ひかり', 'おもいで'
    ];
    
    // 3文字以上のものだけをフィルタ
    const validWords = words.filter(word => word.length >= 3);
    
    // ランダムに1つ選ぶ
    const word = validWords[Math.floor(Math.random() * validWords.length)];
    
    return word;
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
    const toggleMarkBtn = document.getElementById('toggleMarkBtn');
    const uploadLabel = document.getElementById('uploadPhotoLabel');
    
    if (!modal) {
      console.error('❌ cellModal が見つかりません');
      return;
    }
    
    const topic = this.board[index];
    
    // アイコンとタイトルを設定（画像優先）
    if (icon) icon.innerHTML = getTopicIcon(topic);
    if (title) title.textContent = topic.text;
    
    // 既存の写真を表示
    if (this.photos[index] && photoDisplay && photoImg) {
      photoImg.src = this.photos[index];
      photoDisplay.style.display = 'block';
    } else if (photoDisplay) {
      photoDisplay.style.display = 'none';
    }
    
    // プレビューを非表示
    if (photoPreview) {
      photoPreview.style.display = 'none';
    }
    
    if (toggleMarkBtn) {
      if (this.gameType === 'battle') {
        toggleMarkBtn.style.display = 'none';
      } else if (this.photos[index]) {
        toggleMarkBtn.style.display = 'none';
      } else {
        toggleMarkBtn.style.display = '';
        if (this.markedCells.has(index)) {
          toggleMarkBtn.textContent = '✓ マーク済み';
          toggleMarkBtn.classList.add('marked');
        } else {
          toggleMarkBtn.textContent = '✓ マークする';
          toggleMarkBtn.classList.remove('marked');
        }
      }
    }
    
    if (uploadLabel) {
      uploadLabel.style.display = '';
      if (this.photos[index]) {
        uploadLabel.innerHTML = '📷 写真を変更';
      } else {
        uploadLabel.innerHTML = '📷 写真を撮る・選ぶ';
      }
    }
    
    modal.style.display = 'flex';
  }
  
  // 写真モーダルを設定
  setupPhotoModal() {
    const modal = document.getElementById('cellModal');
    const closeBtn = document.getElementById('closeCellModal');
    const photoInput = document.getElementById('cellPhotoInput');
    const photoPreview = document.getElementById('cellPhotoPreview');
    const photoPreviewImg = document.getElementById('cellPhotoPreviewImg');
    const saveCellPhotoBtn = document.getElementById('saveCellPhotoBtn');
    const retakeCellPhotoBtn = document.getElementById('retakeCellPhotoBtn');
    const toggleMarkBtn = document.getElementById('toggleMarkBtn');
    const deleteCurrentPhotoBtn = document.getElementById('deleteCurrentPhotoBtn');
    
    // 閉じるボタン
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        this.closeCellModal();
      });
    }
    
    // 写真選択
    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          this.handleCellPhotoSelect(file);
        }
      });
    }
    
    // 保存ボタン
    if (saveCellPhotoBtn) {
      saveCellPhotoBtn.addEventListener('click', () => {
        this.saveCellPhoto();
      });
    }
    
    // 撮り直しボタン（プレビューを消して「写真を撮る・選ぶ」「マークする」を再表示）
    if (retakeCellPhotoBtn && photoInput && photoPreview) {
      retakeCellPhotoBtn.addEventListener('click', () => {
        photoInput.value = '';
        photoPreview.style.display = 'none';
        this.tempPhotoData = null;
        const uploadLabel = document.getElementById('uploadPhotoLabel');
        const toggleMarkBtn = document.getElementById('toggleMarkBtn');
        if (uploadLabel) uploadLabel.style.display = '';
        if (toggleMarkBtn) toggleMarkBtn.style.display = '';
      });
    }
    
    // マーク切り替えボタン
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
    if (deleteCurrentPhotoBtn) {
      deleteCurrentPhotoBtn.addEventListener('click', () => {
        if (this.currentPhotoIndex !== null && this.photos[this.currentPhotoIndex]) {
          showConfirm('この写真を削除しますか？').then((ok) => {
            if (!ok) return;
            delete this.photos[this.currentPhotoIndex];
            this.renderBoard();
            this.updateStats();
            this.saveToStorage();
            this.showCellModal(this.currentPhotoIndex);
          });
        }
      });
    }
  }
  
  // セル写真選択処理
  handleCellPhotoSelect(file) {
    const preview = document.getElementById('cellPhotoPreview');
    const previewImg = document.getElementById('cellPhotoPreviewImg');
    const photoDisplay = document.getElementById('cellPhotoDisplay');
    
    if (!preview || !previewImg) return;
    
    // 既存の写真表示を非表示
    if (photoDisplay) {
      photoDisplay.style.display = 'none';
    }
    
    this.compressImage(file, (compressedData) => {
      previewImg.src = compressedData;
      preview.style.display = 'block';
      this.tempPhotoData = compressedData;
      const uploadLabel = document.getElementById('uploadPhotoLabel');
      const toggleMarkBtn = document.getElementById('toggleMarkBtn');
      if (uploadLabel) uploadLabel.style.display = 'none';
      if (toggleMarkBtn) toggleMarkBtn.style.display = 'none';
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
      this.tempPhotoData = null;
      const photoInput = document.getElementById('cellPhotoInput');
      if (photoInput) photoInput.value = '';
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
    
    // ボタンのテキストを更新
    const toggleMarkBtn = document.getElementById('toggleMarkBtn');
    if (toggleMarkBtn) {
      if (this.markedCells.has(index)) {
        toggleMarkBtn.textContent = '✓ マーク済み';
        toggleMarkBtn.classList.add('marked');
      } else {
        toggleMarkBtn.textContent = '✓ マークする';
        toggleMarkBtn.classList.remove('marked');
      }
    }
  }
  
  closeCellModal() {
    const modal = document.getElementById('cellModal');
    if (modal) modal.style.display = 'none';
    this.currentPhotoIndex = null;
    this.tempPhotoData = null;
    const photoInput = document.getElementById('cellPhotoInput');
    if (photoInput) photoInput.value = '';
    const photoPreview = document.getElementById('cellPhotoPreview');
    if (photoPreview) photoPreview.style.display = 'none';
    const uploadLabel = document.getElementById('uploadPhotoLabel');
    if (uploadLabel) uploadLabel.style.display = '';
  }
  
  // 画像圧縮
  compressImage(file, callback) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // リサイズ（最大800px）
        let width = img.width;
        let height = img.height;
        const maxSize = 800;
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // JPEG形式で圧縮（品質0.8）
        const compressedData = canvas.toDataURL('image/jpeg', 0.8);
        callback(compressedData);
      };
      
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
  }
  
  // セル写真を保存
  async saveCellPhoto() {
    if (this.currentPhotoIndex === null || !this.tempPhotoData) return;
    if (this.gameType === 'battle') {
      const topicKey = this.getTopicKeyByIndex(this.currentPhotoIndex);
      const ownerId = this.getCellOwnerId(this.currentPhotoIndex);
      if (ownerId && ownerId !== this.battlePlayerId) {
        showAlert('このマスはすでに他の人が取得していました。');
        this.closeCellModal();
        return;
      }
      try {
        const claimResult = await this.claimBattleCellOnServer(this.currentPhotoIndex);
        if (claimResult === 'taken') {
          showAlert('このマスはすでに他の人が取得していました。');
          this.closeCellModal();
          return;
        }
        if (claimResult === 'unknown') {
          showAlert('通信エラーが発生しました。数秒後に自動で反映されます。');
          return;
        }
        // 'claimed' または 'self'（冪等）→ 写真保存処理を続行
      } catch (e) {
        showAlert('取得確認に失敗しました。通信環境を確認して再試行してください。');
        return;
      }
      if (topicKey) this.battleTopicOwners[topicKey] = this.battlePlayerId;
    }
    
    // 振動フィードバック
    if (navigator.vibrate) navigator.vibrate(30);
    
    // 写真を保存
    this.photos[this.currentPhotoIndex] = this.tempPhotoData;
    
    // バトルモードでは battleTopicOwners が唯一のソースのため追加しない
    if (this.gameType !== 'battle') {
      this.markedCells.add(this.currentPhotoIndex);
    }
    
    // 再レンダリング
    this.checkBingo();
    this.updateStats();
    this.saveToStorage();
    
    // モーダルを閉じる
    this.closeCellModal();
  }
  
  
  // LocalStorageに保存
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
        photos: this.photos,
        customTopics: this.customTopics,
        playMode: this.playMode,
        gameStartTime: this.gameStartTime,
        gameType: this.gameType,
        battleTopicOwners: this.battleTopicOwners,
        totalDistance: this.totalDistance
      };
      localStorage.setItem('osanpoBingo', JSON.stringify(data));
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
      const json = localStorage.getItem('osanpoBingo');
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
      
      if (data.photos && typeof data.photos === 'object') {
        this.photos = data.photos;
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
      if (data.battleTopicOwners && typeof data.battleTopicOwners === 'object') {
        this.battleTopicOwners = data.battleTopicOwners;
      }
      if (typeof data.totalDistance === 'number') {
        this.totalDistance = data.totalDistance;
        // 保存時点での距離があればactiveとして扱う
        if (data.totalDistance > 0) this.locationState = 'active';
      }

      return true;
    } catch (error) {
      console.error('❌ 読み込みエラー:', error);
      return false;
    }
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
    const topicKey = this.getTopicKeyByIndex(index);
    if (!topicKey) return '';
    return this.battleTopicOwners[topicKey] || '';
  }
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
  const game = new OsanpoBingo();
  game.init();
  
  // デバッグ用にグローバルに公開
  window.game = game;
});
