#!/usr/bin/env node
/**
 * ローカルで静的ファイルを配信（PWA / Service Worker は file:// より localhost が安定）
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 4173;
const ROOT = path.resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
};

function safePath(urlPath) {
  const parts = urlPath.split('/').filter(p => p && p !== '..');
  const joined = path.join(ROOT, ...parts);
  const resolved = path.resolve(joined);
  const rootR = path.resolve(ROOT);
  if (!resolved.toLowerCase().startsWith(rootR.toLowerCase())) return null;
  return resolved;
}

const server = http.createServer((req, res) => {
  try {
    const u = new URL(req.url || '/', 'http://localhost');
    let urlPath = decodeURIComponent(u.pathname);
    if (urlPath.endsWith('/')) urlPath = `${urlPath}index.html`;

    let filePath = safePath(urlPath.slice(1));
    if (!filePath) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(filePath, (err, st) => {
      if (!err && st.isDirectory()) {
        const idx = path.join(filePath, 'index.html');
        fs.stat(idx, (e2, s2) => {
          if (!e2 && s2.isFile()) streamFile(idx, res);
          else {
            res.writeHead(404);
            res.end('Not found');
          }
        });
        return;
      }
      if (err || !st.isFile()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      streamFile(filePath, res);
    });
  } catch {
    res.writeHead(400);
    res.end('Bad request');
  }
});

function streamFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(res);
}

server.listen(PORT, () => {
  const base = `http://localhost:${PORT}`;
  console.log(`プレビュー: ${base}/`);
  console.log(`ゲーム:     ${base}/game.html`);
  console.log('終了は Ctrl+C');
});
