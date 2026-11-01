// バトルモード: v1.0では封印中。有効化するには true に変更する。
const BATTLE_MODE_ENABLED = true;

// お散歩ビンゴ - Phase 2: グループ機能 + 写真機能

// 招待リンクのベースURL（合言葉つきURLの組み立てに使用）
const GAME_URL = 'https://osanpobingo-battle.com/game.html';

// 合言葉の最大文字数（joinRoomCodeInput の maxlength と揃える）
const ROOM_CODE_MAX_LENGTH = 8;

/**
 * 招待リンク（?room=XXXXX）から合言葉を取り出す。
 * 不正・空・長すぎる値は null を返し、通常のモード選択にフォールバックする。
 */
function getInviteRoomFromUrl() {
  try {
    const raw = new URLSearchParams(window.location.search).get('room');
    if (!raw) return null;
    const code = raw.trim();
    if (!code || code.length > ROOM_CODE_MAX_LENGTH) return null;
    if (code === 'solo') return null;
    return code;
  } catch {
    return null;
  }
}

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

// ===== Supabase Realtime Broadcast クライアント =====
// Phoenix WebSocket プロトコル（Supabase Realtime v1）を使って
// チャンネルへの Broadcast 送受信を行う軽量クライアント。
// 外部 SDK 不要・自動再接続付き。
class SupabaseRealtimeClient {
  constructor(url, key) {
    this._wsUrl = url.replace(/^https?:\/\//, 'wss://') + '/realtime/v1/websocket?apikey=' + key + '&vsn=1.0.0';
    this._ws = null;
    this._ref = 0;
    this._joinRef = 0;
    this._heartbeatTimer = null;
    this._reconnectTimer = null;
    this._channels = {}; // topic -> {joinRef, handlers:{event->fn}, joined}
    this._active = false; // connect() で true、disconnect() で false
  }

  /** WebSocket 接続を開始（冪等） */
  connect() {
    if (this._ws || !this._active) return;
    this._ws = new WebSocket(this._wsUrl);
    this._ws.onopen = () => {
      this._startHeartbeat();
      for (const topic of Object.keys(this._channels)) this._doJoin(topic);
    };
    this._ws.onmessage = (evt) => {
      try {
        const [, , topic, event, payload] = JSON.parse(evt.data);
        if (event === 'broadcast' && this._channels[topic]) {
          const fn = this._channels[topic].handlers[payload?.event];
          if (fn) fn(payload?.payload ?? {});
        }
      } catch {}
    };
    this._ws.onclose = () => {
      this._ws = null;
      this._stopHeartbeat();
      for (const ch of Object.values(this._channels)) ch.joined = false;
      if (this._active) {
        this._reconnectTimer = setTimeout(() => { this._reconnectTimer = null; this.connect(); }, 5000);
      }
    };
    this._ws.onerror = () => {};
  }

  /** チャンネルを購読してハンドラを登録（connect より前でも可） */
  on(channelName, event, handler) {
    const topic = `realtime:${channelName}`;
    if (!this._channels[topic]) this._channels[topic] = { joinRef: null, handlers: {}, joined: false };
    this._channels[topic].handlers[event] = handler;
    if (this._ws?.readyState === WebSocket.OPEN) this._doJoin(topic);
    return this;
  }

  /** チャンネルに Broadcast を送信 */
  broadcast(channelName, event, payload = {}) {
    const topic = `realtime:${channelName}`;
    const ch = this._channels[topic];
    if (!ch || this._ws?.readyState !== WebSocket.OPEN) return;
    this._send([ch.joinRef, String(++this._ref), topic, 'broadcast', { type: 'broadcast', event, payload }]);
  }

  /** 接続・購読を全て破棄（以後 reconnect しない） */
  disconnect() {
    this._active = false;
    clearTimeout(this._reconnectTimer);
    this._stopHeartbeat();
    if (this._ws) { this._ws.onclose = null; this._ws.close(); this._ws = null; }
    this._channels = {};
  }

  _doJoin(topic) {
    const ch = this._channels[topic];
    if (!ch || ch.joined) return;
    const jRef = String(++this._joinRef);
    ch.joinRef = jRef;
    ch.joined = true;
    this._send([jRef, String(++this._ref), topic, 'phx_join', { config: { broadcast: { self: false, ack: false } } }]);
  }

  _send(msg) { if (this._ws?.readyState === WebSocket.OPEN) this._ws.send(JSON.stringify(msg)); }
  _startHeartbeat() { this._heartbeatTimer = setInterval(() => this._send([null, String(++this._ref), 'phoenix', 'heartbeat', {}]), 30000); }
  _stopHeartbeat() { clearInterval(this._heartbeatTimer); this._heartbeatTimer = null; }
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

// HTML特殊文字をエスケープ（innerHTML へユーザー入力を埋め込む際のXSS対策）
function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

