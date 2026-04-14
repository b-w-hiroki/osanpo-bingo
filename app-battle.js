// app-battle.js
// レビュー参照用ファイル。このファイルは動作に影響しません。
// app.js の OsanpoBingo クラスのバトルモード関連メソッドを抜粋したものです。

// ===== クラス外ヘルパー関数 =====

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

// ===== OsanpoBingo クラス内メソッド（抜粋） =====

// normalizeTopicKey(text)
normalizeTopicKey(text) {
  return String(text || '').trim().toLowerCase();
}

// getTopicKeyByIndex(index)
getTopicKeyByIndex(index) {
  const topic = this.board[index];
  if (!topic || topic.isFree) return '';
  return this.normalizeTopicKey(topic.text);
}

// getCellOwnerId(index)
getCellOwnerId(index) {
  const topicKey = this.getTopicKeyByIndex(index);
  if (!topicKey) return '';
  return this.battleTopicOwners[topicKey] || '';
}

// isCellClaimed(index)
isCellClaimed(index) {
  if (this.board[index]?.isFree) return true;
  if (this.gameType === 'battle') {
    const topicKey = this.getTopicKeyByIndex(index);
    if (!topicKey) return false;
    return this.battleTopicOwners[topicKey] === this.battlePlayerId;
  }
  return this.markedCells.has(index);
}

// syncBattleOwnersFromServer()
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

// startBattleSyncLoop()
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

// stopBattleSyncLoop()
stopBattleSyncLoop() {
  if (this.battleSyncTimer) {
    clearInterval(this.battleSyncTimer);
    this.battleSyncTimer = null;
  }
}

// claimBattleCellOnServer(index)
// 戻り値: 'claimed'=新規取得成功 / 'self'=自分が既に所持（冪等） / 'taken'=他人が先取り / 'unknown'=判定不能
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

// getBattleCounts()
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

// setupDebugPanel()
setupDebugPanel() {
  if (!this.debugBattle || this.debugPanelEl) return;
  const panel = document.createElement('div');
  panel.id = 'battleDebugPanel';
  panel.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:3000;background:rgba(0,0,0,0.78);color:#fff;font-size:12px;line-height:1.4;padding:8px 10px;border-radius:8px;max-width:320px;';
  document.body.appendChild(panel);
  this.debugPanelEl = panel;
  this.updateDebugPanel();
}

// updateDebugPanel()
updateDebugPanel() {
  if (!this.debugBattle || !this.debugPanelEl) return;
  const ownerCount = Object.keys(this.battleTopicOwners || {}).length;
  const syncText = this.lastBattleSyncAt ? new Date(this.lastBattleSyncAt).toLocaleTimeString() : '-';
  this.debugPanelEl.textContent = `debug battle | room=${this.roomCode || '-'} | mode=${this.gameType} | player=${this.battlePlayerId} | owners=${ownerCount} | lastSync=${syncText} | status=${this.lastBattleSyncStatus} | err=${this.lastBattleSyncError || '-'}`;
}
