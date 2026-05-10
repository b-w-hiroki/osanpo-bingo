// ============================================================
// PhotoStorage — IndexedDB ベースの写真ストレージ
// localStorage の容量制限を回避し、Blob（バイナリ）で直接保存する
// ・Safari 含む全ブラウザで 24 マス全写真を安全に保存可能
// ・base64 変換なし → 約 25% 省スペース
// ============================================================
class PhotoStorage {
  constructor() {
    this.db       = null;
    this.DB_NAME  = 'osanpo-bingo-photos';
    this.DB_VER   = 1;
    this.STORE    = 'photos';
  }

  /** DB を開く（初回のみ実行） */
  async init() {
    if (this.db) return;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, this.DB_VER);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.STORE)) {
          db.createObjectStore(this.STORE);
        }
      };
      req.onsuccess = (e) => { this.db = e.target.result; resolve(); };
      req.onerror   = ()  => { console.error('PhotoStorage open error:', req.error); reject(req.error); };
    });
  }

  /** Blob を保存（key = セルインデックス番号） */
  async save(index, blob) {
    return new Promise((resolve, reject) => {
      const req = this.db.transaction(this.STORE, 'readwrite')
                         .objectStore(this.STORE).put(blob, index);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  }

  /** 1 件取得（なければ null） */
  async get(index) {
    return new Promise((resolve, reject) => {
      const req = this.db.transaction(this.STORE, 'readonly')
                         .objectStore(this.STORE).get(index);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror   = () => reject(req.error);
    });
  }

  /** 全件取得 → { index(number): Blob } */
  async getAll() {
    return new Promise((resolve, reject) => {
      const result = {};
      const req = this.db.transaction(this.STORE, 'readonly')
                         .objectStore(this.STORE).openCursor();
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) { result[cursor.key] = cursor.value; cursor.continue(); }
        else resolve(result);
      };
      req.onerror = () => reject(req.error);
    });
  }

  /** 1 件削除 */
  async delete(index) {
    return new Promise((resolve, reject) => {
      const req = this.db.transaction(this.STORE, 'readwrite')
                         .objectStore(this.STORE).delete(index);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  }

  /** 全件削除（新ゲーム開始時） */
  async clearAll() {
    return new Promise((resolve, reject) => {
      const req = this.db.transaction(this.STORE, 'readwrite')
                         .objectStore(this.STORE).clear();
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  }
}
