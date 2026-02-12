// お散歩ビンゴのお題リスト（難易度別）
const topicsEasy = [
    '信号', 'ネコ', '犬', '花', '木', '葉っぱ',
    '自転車', '車', 'バス', '電車', 'ベンチ',
    '郵便ポスト', '看板', '自動販売機', '橋', '階段',
    '時計', 'ドア', '窓', '屋根',
    '傘', '帽子', 'かばん', '靴',
    '雲', '太陽', '鳥', '虫', '石'
];

const topicsNormal = [
    '眼鏡をかけた人', 'トラック', '公園', '滑り台', 'ブランコ',
    '噴水', '歩道橋', '煙突', '旗', '風船',
    'ボール', 'おもちゃ', '本', '新聞',
    'コーヒー', 'パン', '果物', '野菜', '魚',
    '虹', '蝶々'
];

const topicsHard = [
    '海', '山', '川', '湖', '森'
];

// シード値による決定論的シャッフル
function seededRandom(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function shuffleWithSeed(array, seed) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed + i) * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 文字列からシード値を生成
function stringToSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// ユーザーIDを生成または取得
function getUserId() {
    let userId = localStorage.getItem('osanpoBingoUserId');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('osanpoBingoUserId', userId);
    }
    return userId;
}

class OsanpoBingo {
    constructor() {
        this.board = [];
        this.markedCells = new Set();
        this.bingoLines = [];
        this.boardSize = 5;
        this.photos = {};
        this.currentPhotoIndex = null;
        this.roomCode = null;
        this.userId = getUserId();
        this.difficulty = 'normal'; // 'easy', 'normal', 'hard', 'mixed'
        this.customTopics = []; // カスタムお題
        this.totalMarked = 0; // 累計マーク数
        this.totalBingos = 0; // 累計ビンゴ数
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPhotoModal();
        this.setupRoomCodeModal();
        
        this.loadFromStorage();
        
        // 保存データが無いときは合言葉ダイアログを表示
        if (this.board.length !== this.boardSize * this.boardSize) {
            this.showRoomCodeDialog();
        } else {
            // 既存データがある場合はボードをレンダリング
            this.renderBoard();
            // 中央のマス（フリーマス）を自動的にマーク（まだマークされていない場合）
            const centerIndex = Math.floor(this.boardSize * this.boardSize / 2);
            if (!this.markedCells.has(centerIndex)) {
                this.markCell(centerIndex);
            }
            this.checkBingo();
            this.updateStats();
        }
    }

    // 合言葉ダイアログを表示
    showRoomCodeDialog() {
        const modal = document.getElementById('roomCodeModal');
        if (modal) modal.classList.add('show');
    }

    // 合言葉ダイアログを閉じる
    closeRoomCodeDialog() {
        const modal = document.getElementById('roomCodeModal');
        if (modal) modal.classList.remove('show');
    }

    // 合言葉モーダルの設定
    setupRoomCodeModal() {
        const modal = document.getElementById('roomCodeModal');
        const startBtn = document.getElementById('startGameBtn');
        const roomCodeInput = document.getElementById('roomCodeInput');
        const difficultySelect = document.getElementById('difficultySelect');

        if (!modal || !startBtn) return;

        startBtn.addEventListener('click', () => {
            const code = roomCodeInput ? roomCodeInput.value.trim() : '';
            const diff = difficultySelect ? difficultySelect.value : 'normal';
            this.roomCode = code || null;
            this.difficulty = diff;
            
            // ボードを作成
            this.createBoard();
            
            // 中央のマスをマーク
            const centerIndex = Math.floor(this.boardSize * this.boardSize / 2);
            this.markCell(centerIndex);
            
            // レンダリングと保存
            this.renderBoard();
            this.checkBingo();
            this.updateStats();
            this.saveToStorage();
            
            this.closeRoomCodeDialog();
        });
    }

    // ビンゴボードを作成
    createBoard() {
        let allTopics = [];
        
        // 難易度に応じてお題を選択
        if (this.difficulty === 'easy') {
            allTopics = [...topicsEasy];
        } else if (this.difficulty === 'hard') {
            allTopics = [...topicsEasy, ...topicsNormal, ...topicsHard];
        } else if (this.difficulty === 'mixed') {
            allTopics = [...topicsEasy, ...topicsNormal, ...topicsHard];
        } else { // normal
            allTopics = [...topicsEasy, ...topicsNormal];
        }

        // カスタムお題を追加
        if (this.customTopics.length > 0) {
            allTopics = [...allTopics, ...this.customTopics];
        }

        // 合言葉とユーザーIDからシード値を生成
        const seedBase = this.roomCode ? stringToSeed(this.roomCode) : Date.now();
        const userSeed = stringToSeed(this.userId);
        const finalSeed = seedBase + userSeed;

        // シード値でシャッフル
        const shuffledTopics = shuffleWithSeed(allTopics, finalSeed);
        
        this.board = [];
        for (let i = 0; i < this.boardSize * this.boardSize; i++) {
            const centerIndex = Math.floor(this.boardSize * this.boardSize / 2);
            if (i === centerIndex) {
                this.board.push('FREE');
            } else {
                this.board.push(shuffledTopics[i < centerIndex ? i : i - 1]);
            }
        }
    }

    // ビンゴボードをレンダリング
    renderBoard() {
        const boardElement = document.getElementById('bingoBoard');
        if (!boardElement) {
            console.error('bingoBoard element not found');
            return;
        }
        boardElement.innerHTML = '';

        this.board.forEach((topic, index) => {
            const cell = document.createElement('div');
            cell.className = 'bingo-cell';
            cell.dataset.index = index;
            cell.setAttribute('role', 'button');
            cell.setAttribute('tabindex', topic === 'FREE' ? '-1' : '0');
            cell.setAttribute('aria-label', topic === 'FREE' ? 'フリーマス' : `${topic}のマス`);
            cell.setAttribute('aria-pressed', this.markedCells.has(index) ? 'true' : 'false');
            
            if (topic === 'FREE') {
                cell.classList.add('free');
                cell.textContent = 'FREE';
                cell.setAttribute('aria-disabled', 'true');
            } else {
                cell.textContent = topic;
            }

            if (this.markedCells.has(index)) {
                cell.classList.add('marked');
            }

            // 写真がある場合は表示
            if (this.photos[index]) {
                cell.classList.add('has-photo');
                const photoImg = document.createElement('img');
                photoImg.className = 'cell-photo';
                photoImg.src = this.photos[index];
                photoImg.alt = topic;
                cell.appendChild(photoImg);
            }

            // ビンゴラインのアニメーション
            if (this.bingoLines.some(line => line.includes(index))) {
                cell.classList.add('bingo-line');
            }

            // クリックイベント
            cell.addEventListener('click', () => this.handleCellClick(index));
            
            // キーボードイベント
            cell.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCellClick(index);
                } else if (e.key === 'p' || e.key === 'P') {
                    e.preventDefault();
                    this.openPhotoModal(index);
                }
            });

            // 右クリックイベント
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.openPhotoModal(index);
            });

            // タッチデバイス用の長押し（改善版）
            let touchTimer;
            let touchMoved = false;
            
            cell.addEventListener('touchstart', (e) => {
                touchMoved = false;
                touchTimer = setTimeout(() => {
                    if (!touchMoved) {
                        e.preventDefault();
                        this.openPhotoModal(index);
                    }
                }, 500);
            }, { passive: false });
            
            cell.addEventListener('touchmove', () => {
                touchMoved = true;
                clearTimeout(touchTimer);
            });
            
            cell.addEventListener('touchend', () => {
                clearTimeout(touchTimer);
            });
            
            cell.addEventListener('touchcancel', () => {
                clearTimeout(touchTimer);
            });

            boardElement.appendChild(cell);
        });
    }

    // セルのクリック処理
    handleCellClick(index) {
        if (this.board[index] === 'FREE') {
            return;
        }

        if (this.markedCells.has(index)) {
            // すでにマークされている場合は解除
            this.markedCells.delete(index);
            this.checkBingo();
            this.renderBoard();
            this.saveToStorage();
        } else {
            // 未マークの場合は写真アップロードを促す
            if (!this.photos[index]) {
                // 写真がない場合、アップロードモーダルを開く
                this.showPhotoPrompt(index);
            } else {
                // すでに写真がある場合は直接マーク
                this.markCell(index);
                this.checkBingo();
                this.renderBoard();
                this.saveToStorage();
            }
        }
    }

    // 写真アップロードを促すダイアログ
    showPhotoPrompt(index) {
        const modal = document.getElementById('photoPromptModal');
        const promptMessage = document.getElementById('photoPromptMessage');
        const uploadBtn = document.getElementById('promptUploadBtn');
        const skipBtn = document.getElementById('promptSkipBtn');

        if (!modal || !promptMessage || !uploadBtn || !skipBtn) return;

        promptMessage.textContent = `「${this.board[index]}」を見つけましたか？写真を撮影してマークしましょう！`;
        modal.classList.add('show');

        // 既存のイベントリスナーをクリア（クローンで置き換え）
        const newUploadBtn = uploadBtn.cloneNode(true);
        const newSkipBtn = skipBtn.cloneNode(true);
        uploadBtn.parentNode.replaceChild(newUploadBtn, uploadBtn);
        skipBtn.parentNode.replaceChild(newSkipBtn, skipBtn);

        // 写真を撮影ボタン
        newUploadBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            this.openPhotoModal(index);
        });

        // スキップしてマーク
        newSkipBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            this.markCell(index);
            this.checkBingo();
            this.renderBoard();
            this.updateStats();
            this.saveToStorage();
        });
    }

    // セルをマーク
    markCell(index) {
        this.markedCells.add(index);
    }

    // ビンゴ判定
    checkBingo() {
        this.bingoLines = [];
        const size = this.boardSize;

        // 横のラインをチェック
        for (let row = 0; row < size; row++) {
            const line = [];
            let isComplete = true;
            for (let col = 0; col < size; col++) {
                const index = row * size + col;
                line.push(index);
                if (!this.markedCells.has(index)) {
                    isComplete = false;
                }
            }
            if (isComplete) {
                this.bingoLines.push(line);
            }
        }

        // 縦のラインをチェック
        for (let col = 0; col < size; col++) {
            const line = [];
            let isComplete = true;
            for (let row = 0; row < size; row++) {
                const index = row * size + col;
                line.push(index);
                if (!this.markedCells.has(index)) {
                    isComplete = false;
                }
            }
            if (isComplete) {
                this.bingoLines.push(line);
            }
        }

        // 斜めのライン（左上から右下）
        const diagonal1 = [];
        let isComplete1 = true;
        for (let i = 0; i < size; i++) {
            const index = i * size + i;
            diagonal1.push(index);
            if (!this.markedCells.has(index)) {
                isComplete1 = false;
            }
        }
        if (isComplete1) {
            this.bingoLines.push(diagonal1);
        }

        // 斜めのライン（右上から左下）
        const diagonal2 = [];
        let isComplete2 = true;
        for (let i = 0; i < size; i++) {
            const index = i * size + (size - 1 - i);
            diagonal2.push(index);
            if (!this.markedCells.has(index)) {
                isComplete2 = false;
            }
        }
        if (isComplete2) {
            this.bingoLines.push(diagonal2);
        }

        this.showBingoMessage();
    }

    // ビンゴメッセージを表示
    showBingoMessage() {
        const messageElement = document.getElementById('bingoMessage');
        if (!messageElement) return;
        
        const previousBingoCount = this.totalBingos;
        
        if (this.bingoLines.length > 0) {
            const count = this.bingoLines.length;
            
            // 新しいビンゴが達成されたか確認
            if (count > previousBingoCount) {
                this.totalBingos = count;
                this.saveToStorage();
            }
            
            messageElement.textContent = `🎉 ${count}本のビンゴ達成！おめでとうございます！🎉`;
            messageElement.classList.add('show');
        } else {
            messageElement.textContent = '';
            messageElement.classList.remove('show');
        }
        
        this.updateStats();
    }

    // 統計情報を更新
    updateStats() {
        const statsElement = document.getElementById('statsDisplay');
        if (!statsElement) {
            console.warn('statsDisplay element not found');
            return;
        }
        
        // FREEマスを除いたマーク数を計算
        let markedCount = this.markedCells.size;
        const centerIndex = Math.floor(this.boardSize * this.boardSize / 2);
        if (this.markedCells.has(centerIndex)) {
            markedCount = Math.max(0, markedCount - 1);
        }
        
        const photoCount = Object.keys(this.photos).length;
        
        statsElement.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">📍 マーク数</span>
                <span class="stat-value">${markedCount}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">📷 写真数</span>
                <span class="stat-value">${photoCount}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">🎯 ビンゴ</span>
                <span class="stat-value">${this.bingoLines.length}</span>
            </div>
        `;
    }

    // リセット
    reset() {
        this.markedCells.clear();
        this.bingoLines = [];
        const centerIndex = Math.floor(this.boardSize * this.boardSize / 2);
        this.markCell(centerIndex);
        this.checkBingo();
        this.renderBoard();
        this.saveToStorage();
    }

    // 新しいゲーム
    newGame() {
        if (confirm('新しいゲームを開始しますか？写真もすべて削除されます。')) {
            this.markedCells.clear();
            this.bingoLines = [];
            this.photos = {};
            this.showRoomCodeDialog();
        }
    }

    // 写真モーダルの設定
    setupPhotoModal() {
        const modal = document.getElementById('photoModal');
        const closeBtn = document.getElementById('modalClose');
        const photoInput = document.getElementById('photoInput');
        const saveBtn = document.getElementById('savePhotoBtn');
        const deleteBtn = document.getElementById('deletePhotoBtn');

        if (!modal || !closeBtn) return;

        closeBtn.addEventListener('click', () => this.closePhotoModal());
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closePhotoModal();
            }
        });

        if (photoInput) photoInput.addEventListener('change', (e) => this.handlePhotoSelect(e));
        if (saveBtn) saveBtn.addEventListener('click', () => this.savePhoto());
        if (deleteBtn) deleteBtn.addEventListener('click', () => this.deletePhoto());
    }

    // 写真モーダルを開く
    openPhotoModal(index) {
        if (this.board[index] === 'FREE') {
            return;
        }

        const modal = document.getElementById('photoModal');
        const modalTitle = document.getElementById('modalTitle');
        const photoPreview = document.getElementById('photoPreview');
        const deleteBtn = document.getElementById('deletePhotoBtn');
        const saveBtn = document.getElementById('savePhotoBtn');
        const photoInput = document.getElementById('photoInput');

        if (!modal || !modalTitle || !photoPreview) return;

        this.currentPhotoIndex = index;
        modalTitle.textContent = `写真をアップロード: ${this.board[index]}`;
        modal.classList.add('show');

        if (this.photos[index]) {
            photoPreview.src = this.photos[index];
            photoPreview.style.display = 'block';
            if (deleteBtn) deleteBtn.style.display = 'block';
            if (saveBtn) saveBtn.style.display = 'none';
        } else {
            photoPreview.style.display = 'none';
            if (deleteBtn) deleteBtn.style.display = 'none';
            if (saveBtn) saveBtn.style.display = 'none';
        }

        if (photoInput) photoInput.value = '';
    }

    // 写真モーダルを閉じる
    closePhotoModal() {
        const modal = document.getElementById('photoModal');
        if (modal) modal.classList.remove('show');
        this.currentPhotoIndex = null;
    }

    // 写真選択処理（圧縮機能付き）
    handlePhotoSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('画像ファイルを選択してください');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.compressImage(e.target.result, (compressedData) => {
                const photoPreview = document.getElementById('photoPreview');
                const saveBtn = document.getElementById('savePhotoBtn');
                if (photoPreview) {
                    photoPreview.src = compressedData;
                    photoPreview.style.display = 'block';
                }
                if (saveBtn) saveBtn.style.display = 'block';
            });
        };
        reader.readAsDataURL(file);
    }

    // 画像を圧縮
    compressImage(dataUrl, callback, maxWidth = 800, quality = 0.8) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // リサイズ
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // 圧縮してbase64に変換
            const compressedData = canvas.toDataURL('image/jpeg', quality);
            callback(compressedData);
        };
        img.src = dataUrl;
    }

    // 写真を保存
    savePhoto() {
        const photoPreview = document.getElementById('photoPreview');
        if (!photoPreview || !photoPreview.src || photoPreview.src === window.location.href) {
            return;
        }
        if (photoPreview.style.display === 'none') {
            return;
        }

        if (this.currentPhotoIndex !== null) {
            this.photos[this.currentPhotoIndex] = photoPreview.src;
            this.markCell(this.currentPhotoIndex);
            this.checkBingo();
            this.renderBoard();
            this.saveToStorage();
            this.closePhotoModal();
        }
    }

    // 写真を削除
    deletePhoto() {
        if (this.currentPhotoIndex !== null && this.photos[this.currentPhotoIndex]) {
            delete this.photos[this.currentPhotoIndex];
            this.renderBoard();
            this.saveToStorage();
            this.closePhotoModal();
        }
    }

    // LocalStorageに保存
    saveToStorage() {
        try {
            const data = {
                board: this.board,
                markedCells: Array.from(this.markedCells),
                photos: this.photos,
                roomCode: this.roomCode,
                difficulty: this.difficulty,
                customTopics: this.customTopics,
                totalBingos: this.totalBingos
            };
            localStorage.setItem('osanpoBingo', JSON.stringify(data));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert('保存容量を超えました。古い写真を削除してください。');
                console.warn('お散歩ビンゴ: 保存容量を超えました。');
            } else {
                console.error('Failed to save:', e);
            }
        }
    }

    // LocalStorageから読み込み
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('osanpoBingo');
            if (saved) {
                const data = JSON.parse(saved);
                if (data.board && data.board.length === this.boardSize * this.boardSize) {
                    this.board = data.board;
                }
                if (data.markedCells && Array.isArray(data.markedCells)) {
                    this.markedCells = new Set(data.markedCells);
                }
                if (data.photos && typeof data.photos === 'object') {
                    this.photos = data.photos;
                }
                if (data.roomCode) {
                    this.roomCode = data.roomCode;
                }
                if (data.difficulty) {
                    this.difficulty = data.difficulty;
                }
                if (data.customTopics && Array.isArray(data.customTopics)) {
                    this.customTopics = data.customTopics;
                }
                if (data.totalBingos) {
                    this.totalBingos = data.totalBingos;
                }
            }
        } catch (e) {
            console.error('Failed to load from storage:', e);
        }
    }

    // エクスポート機能
    exportData() {
        const data = {
            board: this.board,
            markedCells: Array.from(this.markedCells),
            photos: this.photos,
            roomCode: this.roomCode,
            difficulty: this.difficulty,
            customTopics: this.customTopics,
            totalBingos: this.totalBingos,
            exportDate: new Date().toISOString()
        };
        
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `osanpo-bingo-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert('データをエクスポートしました！');
    }

    // インポート機能
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('現在のデータは上書きされます。インポートしますか？')) {
                    if (data.board) this.board = data.board;
                    if (data.markedCells) this.markedCells = new Set(data.markedCells);
                    if (data.photos) this.photos = data.photos;
                    if (data.roomCode) this.roomCode = data.roomCode;
                    if (data.difficulty) this.difficulty = data.difficulty;
                    if (data.customTopics) this.customTopics = data.customTopics;
                    if (data.totalBingos) this.totalBingos = data.totalBingos;
                    
                    this.checkBingo();
                    this.renderBoard();
                    this.saveToStorage();
                    
                    alert('データをインポートしました！');
                }
            } catch (error) {
                alert('データの読み込みに失敗しました。');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    }

    // ビンゴ画面をシェア（スクリーンショット）
    async shareBoard() {
        const boardElement = document.getElementById('bingoBoard');
        if (!boardElement) return;

        try {
            // html2canvasライブラリがない場合は代替手段
            if (typeof html2canvas === 'undefined') {
                alert('シェア機能を使うには、ページをリロードしてください。');
                return;
            }

            const canvas = await html2canvas(boardElement, {
                backgroundColor: '#f2f7f4',
                scale: 2
            });

            canvas.toBlob((blob) => {
                if (navigator.share && blob) {
                    const file = new File([blob], 'osanpo-bingo.png', { type: 'image/png' });
                    navigator.share({
                        files: [file],
                        title: 'お散歩ビンゴ',
                        text: `${this.bingoLines.length}本のビンゴ達成！`
                    }).catch((error) => {
                        console.log('Share cancelled or failed:', error);
                        this.downloadBoardImage(canvas);
                    });
                } else {
                    this.downloadBoardImage(canvas);
                }
            });
        } catch (error) {
            console.error('Screenshot error:', error);
            alert('画像の生成に失敗しました。');
        }
    }

    // ビンゴ画面を画像としてダウンロード
    downloadBoardImage(canvas) {
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `osanpo-bingo-${Date.now()}.png`;
        a.click();
    }

    // カスタムお題を追加
    addCustomTopic(topic) {
        if (!topic || topic.trim() === '') {
            alert('お題を入力してください。');
            return;
        }
        
        if (this.customTopics.includes(topic)) {
            alert('このお題はすでに追加されています。');
            return;
        }
        
        this.customTopics.push(topic);
        this.saveToStorage();
        this.renderCustomTopics();
    }

    // カスタムお題を削除
    removeCustomTopic(topic) {
        this.customTopics = this.customTopics.filter(t => t !== topic);
        this.saveToStorage();
        this.renderCustomTopics();
    }

    // カスタムお題のリストを表示
    renderCustomTopics() {
        const listElement = document.getElementById('customTopicsList');
        if (!listElement) return;
        
        if (this.customTopics.length === 0) {
            listElement.innerHTML = '<p class="help-text">まだカスタムお題がありません</p>';
        } else {
            listElement.innerHTML = this.customTopics.map(topic => `
                <div class="custom-topic-item">
                    <span>${topic}</span>
                    <button class="btn-delete-topic" data-topic="${topic}">削除</button>
                </div>
            `).join('');
            
            // 削除ボタンのイベント
            listElement.querySelectorAll('.btn-delete-topic').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const topic = e.target.dataset.topic;
                    if (confirm(`「${topic}」を削除しますか？`)) {
                        this.removeCustomTopic(topic);
                    }
                });
            });
        }
    }

    // イベントリスナーの設定
    setupEventListeners() {
        const resetBtn = document.getElementById('resetBtn');
        const newGameBtn = document.getElementById('newGameBtn');
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        const importFileInput = document.getElementById('importFileInput');
        const shareBtn = document.getElementById('shareBtn');
        const customTopicBtn = document.getElementById('customTopicBtn');
        const addTopicBtn = document.getElementById('addTopicBtn');
        const customTopicInput = document.getElementById('customTopicInput');
        
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
        if (newGameBtn) newGameBtn.addEventListener('click', () => this.newGame());
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
        
        if (importBtn && importFileInput) {
            importBtn.addEventListener('click', () => importFileInput.click());
            importFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.importData(file);
                }
            });
        }
        
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareBoard());
        }
        
        if (customTopicBtn) {
            customTopicBtn.addEventListener('click', () => {
                const modal = document.getElementById('customTopicModal');
                if (modal) {
                    modal.classList.add('show');
                    this.renderCustomTopics();
                }
            });
        }
        
        if (addTopicBtn && customTopicInput) {
            addTopicBtn.addEventListener('click', () => {
                this.addCustomTopic(customTopicInput.value.trim());
                customTopicInput.value = '';
            });
            
            customTopicInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addCustomTopic(customTopicInput.value.trim());
                    customTopicInput.value = '';
                }
            });
        }
        
        // カスタムお題モーダルの閉じるボタン
        const customTopicModalClose = document.getElementById('customTopicModalClose');
        if (customTopicModalClose) {
            customTopicModalClose.addEventListener('click', () => {
                const modal = document.getElementById('customTopicModal');
                if (modal) modal.classList.remove('show');
            });
        }
    }
}

// ゲームを開始
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new OsanpoBingo();
});
