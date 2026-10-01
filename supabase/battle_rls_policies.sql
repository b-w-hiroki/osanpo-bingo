-- Authenticated battle-room authorization design.
-- Do not apply without a backup and explicit production approval. Enable
-- Supabase Anonymous Sign-Ins first. Existing rows have no trusted owner_uid;
-- retire or migrate them explicitly instead of trusting owner_user_id.

create table if not exists public.battle_rooms (
  room_code text primary key check (char_length(room_code) between 1 and 8),
  owner_uid uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.battle_room_members (
  room_code text not null references public.battle_rooms(room_code) on delete cascade,
  user_uid uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'participant')),
  joined_at timestamptz not null default now(),
  primary key (room_code, user_uid)
);

alter table public.battle_cell_owners add column if not exists owner_uid uuid references auth.users(id) on delete cascade;
alter table public.battle_cell_owners alter column owner_uid set default auth.uid();
alter table public.battle_rooms enable row level security;
alter table public.battle_room_members enable row level security;
alter table public.battle_cell_owners enable row level security;

create or replace function public.battle_base_room(p_room_code text)
returns text language sql immutable as $$ select regexp_replace(p_room_code, '::prs$', ''); $$;

create or replace function public.is_battle_room_member(p_room_code text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.battle_room_members m
    where m.room_code = public.battle_base_room(p_room_code) and m.user_uid = auth.uid()
  );
$$;
revoke all on function public.is_battle_room_member(text) from public, anon;
grant execute on function public.is_battle_room_member(text) to authenticated;

drop policy if exists "room_member_select" on public.battle_rooms;
drop policy if exists "room_owner_delete" on public.battle_rooms;
create policy "room_member_select" on public.battle_rooms for select to authenticated
  using (public.is_battle_room_member(room_code));
create policy "room_owner_delete" on public.battle_rooms for delete to authenticated
  using (owner_uid = auth.uid());

drop policy if exists "member_select" on public.battle_room_members;
create policy "member_select" on public.battle_room_members for select to authenticated
  using (public.is_battle_room_member(room_code));

drop policy if exists "anon_insert" on public.battle_cell_owners;
drop policy if exists "anon_select" on public.battle_cell_owners;
drop policy if exists "anon_delete" on public.battle_cell_owners;
drop policy if exists "member_select" on public.battle_cell_owners;
drop policy if exists "member_insert_own" on public.battle_cell_owners;
drop policy if exists "owner_update_own" on public.battle_cell_owners;
drop policy if exists "owner_delete_own" on public.battle_cell_owners;
create policy "member_select" on public.battle_cell_owners for select to authenticated
  using (public.is_battle_room_member(room_code));
create policy "member_insert_own" on public.battle_cell_owners for insert to authenticated
  with check (public.is_battle_room_member(room_code) and owner_uid = auth.uid());
create policy "owner_update_own" on public.battle_cell_owners for update to authenticated
  using (public.is_battle_room_member(room_code) and owner_uid = auth.uid())
  with check (public.is_battle_room_member(room_code) and owner_uid = auth.uid());
create policy "owner_delete_own" on public.battle_cell_owners for delete to authenticated
  using (public.is_battle_room_member(room_code) and owner_uid = auth.uid());

revoke all on public.battle_rooms, public.battle_room_members, public.battle_cell_owners from anon;
grant select on public.battle_rooms, public.battle_room_members to authenticated;
grant insert, update, delete on public.battle_cell_owners to authenticated;
grant select (room_code, topic_key, cell_index, owner_user_id, owner_uid)
  on public.battle_cell_owners to authenticated;

create or replace function public.create_battle_room(p_room_code text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if p_room_code is null or char_length(p_room_code) not between 1 and 8 or p_room_code = 'solo' then
    raise exception 'invalid room code';
  end if;
  insert into public.battle_rooms(room_code, owner_uid) values (p_room_code, auth.uid())
    on conflict (room_code) do nothing;
  if not exists (select 1 from public.battle_rooms where room_code = p_room_code and owner_uid = auth.uid()) then
    raise exception 'room already belongs to another user';
  end if;
  insert into public.battle_room_members(room_code, user_uid, role) values (p_room_code, auth.uid(), 'owner')
    on conflict (room_code, user_uid) do update set role = 'owner';
end;
$$;

create or replace function public.join_battle_room(p_room_code text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not exists (select 1 from public.battle_rooms where room_code = p_room_code) then
    raise exception 'room not found';
  end if;
  insert into public.battle_room_members(room_code, user_uid, role)
    values (p_room_code, auth.uid(), 'participant') on conflict (room_code, user_uid) do nothing;
end;
$$;

create or replace function public.delete_battle_room(p_room_code text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.battle_rooms where room_code = p_room_code and owner_uid = auth.uid()) then
    raise exception 'room owner required';
  end if;
  delete from public.battle_cell_owners where room_code in (p_room_code, p_room_code || '::prs');
  delete from public.battle_rooms where room_code = p_room_code;
end;
$$;

create or replace function public.leave_battle_room(p_room_code text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.battle_rooms where room_code = p_room_code and owner_uid = auth.uid()) then
    raise exception 'room owner must delete the room';
  end if;
  if not exists (
    select 1 from public.battle_room_members where room_code = p_room_code and user_uid = auth.uid()
  ) then raise exception 'room membership required'; end if;
  delete from public.battle_cell_owners
    where owner_uid = auth.uid() and room_code in (p_room_code, p_room_code || '::prs');
  delete from public.battle_room_members where room_code = p_room_code and user_uid = auth.uid();
end;
$$;

create or replace function public.battle_room_exists(p_room_code text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.battle_rooms where room_code = p_room_code);
$$;

create or replace function public.get_cell_photo(p_room_code text, p_cell_index int, p_owner_user_id text default null)
returns text language sql stable security definer set search_path = public as $$
  select c.photo_data from public.battle_cell_owners c
  where public.is_battle_room_member(p_room_code)
    and c.room_code = p_room_code and c.cell_index = p_cell_index
    and (p_owner_user_id is null or c.owner_user_id = p_owner_user_id)
  limit 1;
$$;

revoke all on function public.create_battle_room(text) from public, anon;
revoke all on function public.join_battle_room(text) from public, anon;
revoke all on function public.delete_battle_room(text) from public, anon;
revoke all on function public.leave_battle_room(text) from public, anon;
revoke all on function public.battle_room_exists(text) from public, anon;
revoke all on function public.get_cell_photo(text, int, text) from public, anon;
grant execute on function public.create_battle_room(text) to authenticated;
grant execute on function public.join_battle_room(text) to authenticated;
grant execute on function public.delete_battle_room(text) to authenticated;
grant execute on function public.leave_battle_room(text) to authenticated;
grant execute on function public.battle_room_exists(text) to authenticated;
grant execute on function public.get_cell_photo(text, int, text) to authenticated;
