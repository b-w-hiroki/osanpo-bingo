(function initBattleAuth(root) {
  const STORAGE_KEY = 'osanpo_battle_auth_session_v1';

  class OsanpoBattleAuth {
    constructor(config, options = {}) {
      this.url = String(config?.url || '').replace(/\/$/, '');
      this.key = String(config?.key || '');
      this.fetch = options.fetchImpl || root.fetch?.bind(root);
      this.storage = options.storage || root.sessionStorage;
      this.now = options.now || (() => Date.now());
      this.session = null;
    }

    _readSession() {
      if (this.session) return this.session;
      try { this.session = JSON.parse(this.storage?.getItem(STORAGE_KEY) || 'null'); } catch { this.session = null; }
      return this.session;
    }

    _saveSession(value) {
      this.session = value;
      try { this.storage?.setItem(STORAGE_KEY, JSON.stringify(value)); } catch { /* session only */ }
      return value;
    }

    async _authRequest(path, body) {
      if (!this.fetch || !this.url || !this.key) throw new Error('Battle backend is not configured');
      const response = await this.fetch(`${this.url}${path}`, {
        method: 'POST',
        headers: { apikey: this.key, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error(`Battle authentication failed (${response.status})`);
      const data = await response.json();
      if (!data?.access_token || !data?.user?.id) throw new Error('Battle authentication returned an invalid session');
      return this._saveSession({
        accessToken: data.access_token,
        refreshToken: data.refresh_token || '',
        userId: data.user.id,
        expiresAt: this.now() + Math.max(60, Number(data.expires_in) || 3600) * 1000,
      });
    }

    async ensureSession() {
      const current = this._readSession();
      if (current?.accessToken && current?.userId && current.expiresAt > this.now() + 30_000) return current;
      if (current?.refreshToken) {
        try {
          return await this._authRequest('/auth/v1/token?grant_type=refresh_token', { refresh_token: current.refreshToken });
        } catch { /* create a new anonymous identity below */ }
      }
      return this._authRequest('/auth/v1/signup', {});
    }

    async headers(extra = {}) {
      const session = await this.ensureSession();
      return { apikey: this.key, Authorization: `Bearer ${session.accessToken}`, ...extra };
    }

    async rpc(name, body) {
      const response = await this.fetch(`${this.url}/rest/v1/rpc/${name}`, {
        method: 'POST',
        headers: await this.headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error(`${name} failed (${response.status})`);
      if (response.status === 204) return null;
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }

    createRoom(roomCode) { return this.rpc('create_battle_room', { p_room_code: roomCode }); }
    joinRoom(roomCode) { return this.rpc('join_battle_room', { p_room_code: roomCode }); }
    deleteRoom(roomCode) { return this.rpc('delete_battle_room', { p_room_code: roomCode }); }
  }

  root.OsanpoBattleAuth = OsanpoBattleAuth;
  if (typeof module !== 'undefined' && module.exports) module.exports = { OsanpoBattleAuth, STORAGE_KEY };
}(typeof window === 'undefined' ? globalThis : window));
