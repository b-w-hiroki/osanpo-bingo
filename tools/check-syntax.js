const { spawnSync } = require('node:child_process');
const { resolve } = require('node:path');

// app-battle.js is a review-only class-method excerpt, not a standalone script.
for (const file of ['app.js', 'battle-auth.js', 'photo-storage.js', 'service-worker.js']) {
  const result = spawnSync(process.execPath, ['--check', resolve(__dirname, '..', file)], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
