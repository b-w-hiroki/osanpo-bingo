-- ============================================================================
-- おさんぽビンゴバトル: battle_cell_owners のセキュリティ設定
--
-- 【背景】
-- このアプリは Supabase の anon key をクライアントに公開する設計です（意図的・
-- Supabase の標準的なパターン）。ただし、これまで RLS（行レベルセキュリティ）
-- が未設定だったため、anon key さえあれば誰でも以下が可能でした。
--
--   1. room_code でフィルタせず SELECT * すると、全ルーム・全プレイヤーの
--      写真（photo_data）を丸ごと取得できてしまう
--   2. 任意の room_code を指定して DELETE すれば、他人の対戦データを消せる
--
-- 【このスクリプトでの対応】
--   1. photo_data 列を anon の通常 SELECT から除外し、get_cell_photo() という
--      個別RPC経由でのみ取得できるようにする（app.js 側も対応済み）。
--      → select=* による全ルーム一括の写真抜き取りを防止する。
--   2. RLS を明示的に有効化し、現状の挙動（INSERT/SELECT/DELETE を anon に許可）
--      をポリシーとして明文化する。
--
-- 【残る限界（正直に書きます）】
-- このアプリには Supabase Auth によるログインがなく、owner_user_id は
-- クライアントが自己申告する文字列に過ぎません。そのため RLS だけでは
-- 「本人だけが自分の行を削除できる」ことは技術的に保証できません
-- （誰でも owner_user_id を騙って DELETE を送れます）。
-- これを本当に防ぐには、Supabase Anonymous Auth を導入して auth.uid() を
-- 使った所有者チェックに切り替える必要があります（将来の改善課題）。
-- 当面は「合言葉（room_code）を知っている人だけが対戦に参加できる」という
-- 現状の設計を維持しつつ、上記1.の写真一括流出だけは確実に塞ぎます。
--
-- 【使い方】
-- Supabase ダッシュボード → SQL Editor に貼り付けて実行してください。
-- 実行は1回だけでOKです（既存ポリシーがあれば一旦 DROP してから再作成します）。
-- ============================================================================

-- 1. RLS を有効化
alter table public.battle_cell_owners enable row level security;

-- 2. 既存ポリシーがあれば削除してから作り直す（再実行しても安全にするため）
drop policy if exists "anon_insert" on public.battle_cell_owners;
drop policy if exists "anon_select" on public.battle_cell_owners;
drop policy if exists "anon_delete" on public.battle_cell_owners;

-- 3. INSERT: 誰でも許可（新規参加・マス取得に必要）
create policy "anon_insert" on public.battle_cell_owners
  for insert to anon
  with check (true);

-- 4. SELECT: 誰でも許可（同じ合言葉のプレイヤー間で同期するために必要。
--    room_code は実質的な「合言葉＝秘密トークン」として扱う設計のため、
--    SNS等に room_code 付きの招待URLをそのまま公開投稿しないよう運用で注意する）
create policy "anon_select" on public.battle_cell_owners
  for select to anon
  using (true);

-- 5. DELETE: 誰でも許可（退出時・一時保存の仕組みで必要。
--    上記の通り、本人確認は技術的にできていない点に注意）
create policy "anon_delete" on public.battle_cell_owners
  for delete to anon
  using (true);

-- 6. photo_data 列だけは通常の SELECT から除外する
--    （select=* / select=photo_data による一括取得を防ぐ）
revoke select (photo_data) on public.battle_cell_owners from anon;

-- 7. photo_data を個別に取得するための RPC。
--    room_code + cell_index（+ 任意で owner_user_id）を指定した
--    ピンポイントな問い合わせのみ許可する。
create or replace function public.get_cell_photo(
  p_room_code text,
  p_cell_index int,
  p_owner_user_id text default null
)
returns text
language sql
security definer
set search_path = public
as $$
  select photo_data
  from battle_cell_owners
  where room_code = p_room_code
    and cell_index = p_cell_index
    and (p_owner_user_id is null or owner_user_id = p_owner_user_id)
  limit 1;
$$;

grant execute on function public.get_cell_photo(text, int, text) to anon;

-- ============================================================================
-- 確認方法（任意）:
-- 実行後、以下のように photo_data 列だけを直接 SELECT しようとするとエラーになれば成功です。
--
--   curl "https://<project>.supabase.co/rest/v1/battle_cell_owners?select=photo_data&limit=1" \
--     -H "apikey: <anon key>" -H "Authorization: Bearer <anon key>"
--   → 403 / column does not exist 等のエラーになるはず
--
-- 一方、RPC 経由なら room_code と cell_index を指定した場合のみ取得できます:
--
--   curl -X POST "https://<project>.supabase.co/rest/v1/rpc/get_cell_photo" \
--     -H "apikey: <anon key>" -H "Authorization: Bearer <anon key>" \
--     -H "Content-Type: application/json" \
--     -d '{"p_room_code":"実在する合言葉","p_cell_index":0}'
-- ============================================================================
