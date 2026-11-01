# Service Worker update regression

Run `npm test` and `npm run test:browser` (Chrome required, or set `CHROME_BIN`).
The existing pull-request workflow runs both, including the new SW browser test.

The isolated localhost browser test serves repository assets and the actual v161
worker fixture. It does not contact production, analytics, or Supabase.

1. Install v161, verify online LP/news/game responses, and seed another app cache.
2. Serve v162 with a 503 for battle-auth.js. Verify the installing worker becomes
   redundant, there is no waiting replacement, and v161 remains active with its
   healthy cache. Simulate connection failure and navigate to LP/news in frames.
3. Restore the network and retry. Verify v162 waits for the existing user update
   message, v161 survives until activation, and only this app's old cache is deleted.
4. Inspect game.html script references against the new cache, then simulate network
   failure and fetch all local scripts. Navigate to LP/news and verify fallback;
   game.html navigation must still bypass the SW. Restore online game access.

HTML scripts are blocked in navigation frames: this test exercises SW lifecycle,
asset delivery and page fallback, not gameplay/authentication or visual layout.
The existing restored-board browser regression continues to exercise game rendering.

Install rejects cache.addAll failures. The browser therefore keeps the previous
active worker; this does not attempt to repair users whose previous cache was
already incomplete. Cache version must be bumped for each asset release.
No automatic skipWaiting is added; the existing update acceptance flow remains.
