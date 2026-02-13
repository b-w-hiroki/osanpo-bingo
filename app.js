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

class OsanpoBingo {
  constructor() {
    this.boardSize = 5;
    this.board = [];              // 25個のお題オブジェクト {text, icon}
    this.markedCells = new Set(); // マーク済みのインデックス
    this.bingoLines = [];         // 揃ったラインの配列
    
    // Phase 2: グループ機能
    this.roomCode = '';           // 合言葉
    this.difficulty = 'medium';   // 難易度
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
    
    // DOM要素（初期化時に取得）
    this.boardElement = null;
    this.messageElement = null;
    this.bingoCountElement = null;
    this.markedCountElement = null;
    this.photoCountElement = null;
    this.roomCodeDisplay = null;
    this.difficultyDisplay = null;
    this.playerCountDisplay = null;
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
    
    if (!this.boardElement) {
      console.error('❌ bingoBoard 要素が見つかりません');
      return;
    }
    
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
      this.renderBoard();
      this.checkBingo();
      this.updateStats();
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
    
    // 設定ボタン（プレイ中に設定モーダルを開く）
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.showRoomCodeModal(true));
    }
    
    // 写真モーダル
    this.setupPhotoModal();
  }
  
  // ボードを作成（お題を配置）
  // shuffleSalt: 指定すると毎回異なるシャッフル（作り直し用）
  // customTopics: フリー入力マスのお題配列 [{text, icon}]
  createBoard(roomCode = '', difficulty = 'medium', shuffleSalt = '', customTopics = null) {
    // 合言葉と難易度を保存
    this.roomCode = roomCode || this.roomCode || '';
    this.difficulty = difficulty || this.difficulty || 'medium';
    
    // カスタムトピックを保存（渡されなければ既存を維持）
    if (customTopics !== null) {
      this.customTopics = customTopics;
    }
    
    // カスタムトピックの数だけランダムお題を減らす
    const customCount = this.customTopics.length;
    const randomCount = 24 - customCount;
    
    // 難易度に応じてランダムお題を取得
    const randomTopics = selectTopicsByDifficulty(
      this.difficulty, 
      this.roomCode, 
      this.userId,
      shuffleSalt
    ).slice(0, randomCount);
    
    // カスタムお題 + ランダムお題を合わせてシャッフル
    const allTopics = [...this.customTopics, ...randomTopics];
    const seedStr = [this.roomCode, this.userId, shuffleSalt, 'mix'].filter(Boolean).join('-');
    const seed = stringToSeed(seedStr);
    const shuffledTopics = shuffleWithSeed(allTopics, seed);
    
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
    
    // 保存
    this.saveToStorage();
  }
  
  // ボードをレンダリング
  renderBoard() {
    if (!this.boardElement) return;
    
    this.boardElement.innerHTML = '';
    
    this.board.forEach((topic, index) => {
      const cell = document.createElement('div');
      cell.className = 'bingo-cell';
      cell.dataset.index = index;
      
      // 写真がある場合（上に写真・下にテキストの構成で描画）
      const hasPhoto = !!this.photos[index];
      if (hasPhoto) {
        cell.classList.add('has-photo');
      }
      
      // マーク済みかFREEの場合
      if (this.markedCells.has(index) || topic.isFree) {
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
      
      // 中央マスはテキスト非表示（アイコンのみ）
      const displayText = index === 12 ? '' : topic.text;
      const textLen = displayText.length;
      let sizeClass = '';
      if (textLen <= 2) sizeClass = 'cell-text-s';
      else if (textLen <= 4) sizeClass = 'cell-text-m';
      else if (textLen <= 6) sizeClass = 'cell-text-l';
      else sizeClass = 'cell-text-xl';
      
      if (textLen >= 7) cell.classList.add('cell-len-xl');
      else if (textLen >= 5) cell.classList.add('cell-len-l');
      
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
  }
  
  // セルクリック処理
  handleCellClick(index) {
    if (index === 12) return;
    
    if (this.playMode === 'markOnly') {
      this.toggleMark(index);
      return;
    }
    this.showCellModal(index);
  }
  
  // ビンゴ判定
  checkBingo() {
    const lines = this.getAllLines();
    const newBingoLines = [];
    
    lines.forEach(line => {
      const allMarked = line.every(index => 
        this.markedCells.has(index) || this.board[index]?.isFree
      );
      
      if (allMarked) {
        newBingoLines.push(line);
      }
    });
    
    // 新しいビンゴがあるかチェック
    const oldCount = this.bingoLines.length;
    this.bingoLines = newBingoLines;
    const newCount = this.bingoLines.length;
    
    if (newCount > oldCount) {
      this.showBingoMessage(newCount);
      this.renderBoard(); // ビンゴラインをハイライト
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
  
  // 統計を更新
  updateStats() {
    if (this.bingoCountElement) {
      this.bingoCountElement.textContent = this.bingoLines.length;
    }
    
    if (this.markedCountElement) {
      this.markedCountElement.textContent = this.markedCells.size;
    }
    
    if (this.photoCountElement) {
      this.photoCountElement.textContent = Object.keys(this.photos).length;
    }
    
    if (this.roomCodeDisplay) {
      this.roomCodeDisplay.textContent = this.roomCode === 'solo' ? 'ふつう' : (this.roomCode || '-');
    }
    
    if (this.difficultyDisplay) {
      const diffText = {
        'easy': 'かんたん',
        'medium': 'ふつう',
        'hard': 'むずかしい'
      };
      this.difficultyDisplay.textContent = diffText[this.difficulty] || '-';
    }
    
    if (this.playerCountDisplay) {
      this.playerCountDisplay.textContent = this.playerCount || 1;
    }
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
    }
    
    // 統計を表示
    const bingoCountEl = document.getElementById('screenshotBingoCount');
    const markedCountEl = document.getElementById('screenshotMarkedCount');
    if (bingoCountEl) bingoCountEl.textContent = this.bingoLines.length;
    if (markedCountEl) markedCountEl.textContent = this.markedCells.size;
    
    // グループ入力欄をクリア
    const groupInput = document.getElementById('resultGroupInput');
    if (groupInput) groupInput.value = '';
    
    view.style.display = 'flex';
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
    document.getElementById('resultCaptureMarked').textContent = this.markedCells.size;
    
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
    const marked = this.markedCells.size;
    return [
      'お散歩ビンゴで遊んだ！',
      dateEl?.textContent || '',
      playTimeEl ? playTimeEl + ' ' : '',
      groupText ? groupText + ' ' : '',
      'ビンゴ' + bingo + '本・マーク' + marked + 'マス',
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
      this.createBoard(this.roomCode, this.difficulty, Date.now().toString(), null);
      this.markCell(12);
      this.renderBoard();
      this.checkBingo();
      this.updateStats();
      this.saveToStorage();
      if (this.messageElement) {
        this.messageElement.style.display = 'none';
      }
    });
  }
  
  // セルをマーク（プログラムから）
  markCell(index) {
    this.markedCells.add(index);
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
    const customTopicCountSelect = document.getElementById('customTopicCount');
    const customTopicInputsContainer = document.getElementById('customTopicInputs');
    
    const hideAllSteps = () => {
      [modeSelectStep, soloGameStep, groupModeSelectStep, createGameStep, joinGameStep].forEach(el => { if (el) el.style.display = 'none'; });
    };
    
    if (roomCodeInput) {
      roomCodeInput.value = (this.roomCode && this.roomCode !== 'solo') ? this.roomCode : this.generateRoomCode();
    }
    if (difficultySelect) difficultySelect.value = this.difficulty || 'medium';
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
    if (difficultySelectSolo) difficultySelectSolo.value = this.difficulty || 'medium';
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
    if (modeCreateBtn) {
      modeCreateBtn.addEventListener('click', () => {
        hideAll();
        if (createGameStep) createGameStep.style.display = 'block';
        if (roomCodeInput && !roomCodeInput.value) roomCodeInput.value = this.generateRoomCode();
      });
    }
    
    if (joinGameBtn) {
      joinGameBtn.addEventListener('click', () => {
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
        const difficultySelectSolo = document.getElementById('difficultySelectSolo');
        const modal = document.getElementById('roomCodeModal');
        const playModeRadio = document.querySelector('input[name="playModeSolo"]:checked');
        this.playMode = playModeRadio?.value === 'markOnly' ? 'markOnly' : 'photo';
        this.difficulty = difficultySelectSolo?.value || 'medium';
        const customTopics = this.collectCustomTopics(customTopicInputsSolo);
        this.gameStartTime = Date.now();
        this.roomCode = 'solo';
        this.playerCount = 1;
        this.createBoard('solo', this.difficulty, '', customTopics);
        this.markCell(12);
        this.renderBoard();
        this.checkBingo();
        this.updateStats();
        if (modal) modal.style.display = 'none';
        if (this.messageElement) this.messageElement.style.display = 'none';
      });
    }
    
    // ゲーム開始ボタン（みんなで・作成モード）
    if (startGameBtn) {
      startGameBtn.addEventListener('click', () => {
        const difficultySelect = document.getElementById('difficultySelect');
        const playerCountInput = document.getElementById('playerCountInput');
        const modal = document.getElementById('roomCodeModal');
        
        const roomCode = roomCodeInput?.value.trim() || this.generateRoomCode();
        const difficulty = difficultySelect?.value || 'medium';
        const playerCount = parseInt(playerCountInput?.value) || 1;
        
        // フリー入力マスのお題を収集
        const customTopics = this.collectCustomTopics();
        
        // 参加人数を保存
        this.playerCount = Math.max(1, Math.min(99, playerCount));
        
        const playModeRadio = document.querySelector('input[name="playModeCreate"]:checked');
        this.playMode = playModeRadio?.value === 'markOnly' ? 'markOnly' : 'photo';
        this.gameStartTime = Date.now();
        
        this.createBoard(roomCode, difficulty, '', customTopics);
        this.markCell(12);
        this.renderBoard();
        this.checkBingo();
        this.updateStats();
        
        if (modal) modal.style.display = 'none';
        if (this.messageElement) this.messageElement.style.display = 'none';
      });
    }
    
    // 参加ボタン（参加モード）
    if (joinGameBtn) {
      joinGameBtn.addEventListener('click', () => {
        const joinRoomCode = document.getElementById('joinRoomCodeInput');
        const joinDifficulty = document.getElementById('joinDifficultySelect');
        const modal = document.getElementById('roomCodeModal');
        const customTopicInputsJoin = document.getElementById('customTopicInputsJoin');
        
        const roomCode = joinRoomCode?.value.trim();
        if (!roomCode) {
          showAlert('合言葉を入力してください');
          return;
        }
        
        const difficulty = joinDifficulty?.value || 'medium';
        const playModeRadio = document.querySelector('input[name="playModeJoin"]:checked');
        this.playMode = playModeRadio?.value === 'markOnly' ? 'markOnly' : 'photo';
        this.gameStartTime = Date.now();
        
        this.playerCount = 1;
        // グループ＋自由記載：作った人から教えてもらったお題を入力（同じお題セットで並びだけ各自違うボードになる）
        const customTopics = customTopicInputsJoin ? this.collectCustomTopics(customTopicInputsJoin) : [];
        this.createBoard(roomCode, difficulty, '', customTopics);
        this.markCell(12);
        this.renderBoard();
        this.checkBingo();
        this.updateStats();
        
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
      if (this.photos[index]) {
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
    this.renderBoard();
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
  saveCellPhoto() {
    if (this.currentPhotoIndex === null || !this.tempPhotoData) return;
    
    // 振動フィードバック
    if (navigator.vibrate) navigator.vibrate(30);
    
    // 写真を保存
    this.photos[this.currentPhotoIndex] = this.tempPhotoData;
    
    // マークを追加
    this.markedCells.add(this.currentPhotoIndex);
    
    // 再レンダリング
    this.renderBoard();
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
        playerCount: this.playerCount,
        photos: this.photos,
        customTopics: this.customTopics,
        playMode: this.playMode,
        gameStartTime: this.gameStartTime
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
      
      return true;
    } catch (error) {
      console.error('❌ 読み込みエラー:', error);
      return false;
    }
  }
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
  const game = new OsanpoBingo();
  game.init();
  
  // デバッグ用にグローバルに公開
  window.game = game;
});
