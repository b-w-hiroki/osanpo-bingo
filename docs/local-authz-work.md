# Battle authorization local work

Branch: `codex/battle-authz`

Implemented locally:

- Anonymous Auth session acquisition and refresh in `battle-auth.js`.
- Authenticated create/join/delete-room RPC calls.
- All battle REST reads and writes use the user's access token, never the public anon key as identity.
- RLS migration design binds writes to `auth.uid()` and reads to room membership.
- Participant deletion/update is limited to rows whose `owner_uid` matches `auth.uid()`; room deletion is owner-only.

Not applied to production:

1. Back up `battle_cell_owners` and decide how to retire or explicitly migrate legacy rows without a trusted `owner_uid`.
2. Enable Supabase Anonymous Sign-Ins.
3. Review and apply `supabase/battle_rls_policies.sql` in a non-production project first.
4. Run two-session tests: owner creates, participant joins by invite, unrelated user cannot select, participant cannot update/delete owner rows, owner can delete the room.
5. Apply to production only after separate approval and repeat the denial tests against dummy rooms.

Resume locally with `npm test`. No production settings, permissions, or data were changed.
