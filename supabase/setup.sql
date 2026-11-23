-- Run once in Supabase → SQL Editor. Safe to re-run.

-- 1) Lets a logged-in user delete their OWN account (and synced data) from the website.
--    Runs with elevated rights, but can only ever delete auth.uid() = the caller.
create or replace function public.delete_user()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  delete from public.prisma_sync where user_id = uid;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_user() from public, anon;
grant execute on function public.delete_user() to authenticated;

-- 2) Make sure RLS is on and each user only touches their own row.
--    (Skip if you already have equivalent policies; duplicates are harmless but untidy.)
alter table public.prisma_sync enable row level security;

drop policy if exists "own row select" on public.prisma_sync;
drop policy if exists "own row insert" on public.prisma_sync;
drop policy if exists "own row update" on public.prisma_sync;
drop policy if exists "own row delete" on public.prisma_sync;

create policy "own row select" on public.prisma_sync for select to authenticated using ((select auth.uid()) = user_id);
create policy "own row insert" on public.prisma_sync for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own row update" on public.prisma_sync for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own row delete" on public.prisma_sync for delete to authenticated using ((select auth.uid()) = user_id);

-- 3) Optional: auto-delete synced data if a user is removed from the dashboard too.
--    Only works if user_id is uuid. Uncomment to apply.
-- alter table public.prisma_sync
--   add constraint prisma_sync_user_fk foreign key (user_id) references auth.users(id) on delete cascade;

-- 4) Reviews: anyone can read, logged-in users can write ONE review and delete their own.
create table if not exists public.reviews (
  id bigint generated always as identity primary key,
  user_id uuid not null unique default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 32),
  body text not null check (char_length(body) between 3 and 300),
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
drop policy if exists "reviews read" on public.reviews;
drop policy if exists "reviews write own" on public.reviews;
drop policy if exists "reviews delete own" on public.reviews;
create policy "reviews read" on public.reviews for select to anon, authenticated using (true);
create policy "reviews write own" on public.reviews for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "reviews delete own" on public.reviews for delete to authenticated using ((select auth.uid()) = user_id);
