const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { OsanpoBattleAuth } = require('../battle-auth.js');

const response = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
  text: async () => body == null ? '' : JSON.stringify(body),
});

function memoryStorage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
}

test('anonymous auth token, not the public anon key, authorizes room creation', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    if (url.endsWith('/auth/v1/signup')) {
      return response(200, { access_token: 'user-a-token', refresh_token: 'refresh-a', expires_in: 3600, user: { id: 'user-a' } });
    }
    return response(204, null);
  };
  const auth = new OsanpoBattleAuth({ url: 'https://local.test', key: 'public-anon-key' }, { fetchImpl, storage: memoryStorage() });
  await auth.createRoom('invite01');

  assert.equal(calls[1].url, 'https://local.test/rest/v1/rpc/create_battle_room');
  assert.equal(calls[1].init.headers.Authorization, 'Bearer user-a-token');
  assert.notEqual(calls[1].init.headers.Authorization, 'Bearer public-anon-key');
  assert.deepEqual(JSON.parse(calls[1].init.body), { p_room_code: 'invite01' });
});

test('a second anonymous user can join only through the invite RPC', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    if (url.endsWith('/auth/v1/signup')) {
      return response(200, { access_token: 'participant-token', expires_in: 3600, user: { id: 'participant-user' } });
    }
    return response(204, null);
  };
  const participant = new OsanpoBattleAuth({ url: 'https://local.test', key: 'public-anon-key' }, { fetchImpl, storage: memoryStorage() });
  await participant.joinRoom('invite01');

  assert.equal(calls[1].url, 'https://local.test/rest/v1/rpc/join_battle_room');
  assert.equal(calls[1].init.headers.Authorization, 'Bearer participant-token');
  assert.deepEqual(JSON.parse(calls[1].init.body), { p_room_code: 'invite01' });
});

test('authorization failures are surfaced instead of falling back to anon-key writes', async () => {
  let count = 0;
  const fetchImpl = async () => (++count === 1)
    ? response(200, { access_token: 'user-token', expires_in: 3600, user: { id: 'user-id' } })
    : response(403, { message: 'not allowed' });
  const auth = new OsanpoBattleAuth({ url: 'https://local.test', key: 'public-anon-key' }, { fetchImpl, storage: memoryStorage() });
  await assert.rejects(() => auth.deleteRoom('owned-by-someone-else'), /delete_battle_room failed \(403\)/);
});

test('participant leave uses an authenticated RPC that removes membership', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    if (url.endsWith('/auth/v1/signup')) {
      return response(200, { access_token: 'participant-token', expires_in: 3600, user: { id: 'participant-user' } });
    }
    return response(204, null);
  };
  const auth = new OsanpoBattleAuth({ url: 'https://local.test', key: 'public-anon-key' }, { fetchImpl, storage: memoryStorage() });
  await auth.leaveRoom('invite01');
  assert.equal(calls[1].url, 'https://local.test/rest/v1/rpc/leave_battle_room');
  assert.equal(calls[1].init.headers.Authorization, 'Bearer participant-token');
});

test('RLS design rejects impersonated ownership and limits reads to room members', () => {
  const root = resolve(__dirname, '..');
  const sql = readFileSync(resolve(root, 'supabase/battle_rls_policies.sql'), 'utf8');
  const app = readFileSync(resolve(root, 'app.js'), 'utf8');

  assert.match(sql, /member_insert_own[\s\S]*owner_uid = auth\.uid\(\)/);
  assert.match(sql, /owner_update_own[\s\S]*owner_uid = auth\.uid\(\)/);
  assert.match(sql, /owner_delete_own[\s\S]*owner_uid = auth\.uid\(\)/);
  assert.match(sql, /leave_battle_room[\s\S]*delete from public\.battle_room_members/);
  assert.match(sql, /member_select[\s\S]*is_battle_room_member\(room_code\)/);
  assert.doesNotMatch(sql, /create policy[\s\S]{0,120}\bto anon\b/i);
  assert.match(sql, /revoke all on public\.battle_rooms, public\.battle_room_members, public\.battle_cell_owners from anon/);
  assert.match(sql, /grant select \(room_code, topic_key, cell_index, owner_user_id, owner_uid\)/);
  assert.doesNotMatch(sql, /grant select, insert, update, delete on public\.battle_cell_owners/);
  assert.doesNotMatch(app, /Authorization:\s*`Bearer \$\{(?:key|this\.battleBackend\.key)\}`/);
  assert.match(app, /battleAuth\.createRoom\(roomCode\)/);
  assert.match(app, /battleAuth\.joinRoom\(roomCode\)/);
  const joinFlow = app.slice(app.indexOf("joinGameBtn.addEventListener('click'"));
  assert.ok(joinFlow.indexOf('battleAuth.joinRoom(roomCode)') < joinFlow.indexOf('fetchRoomSettings(roomCode)'));
});
