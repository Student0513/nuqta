-- =====================================================================
--  NUQTA update 004
--   1. A story can be pinned as the home page's Top story
--   2. Editors (and the owner) can edit and remove weekly questions
--  Run once in Supabase: SQL Editor -> New query -> paste -> Run.
--  Safe to run more than once.
-- =====================================================================

-- 1. Pinned top story
alter table public.news add column if not exists pinned boolean not null default false;
-- Start with "Smog season is back" as the top story
update public.news set pinned = (id = '546f3140-4618-416b-b825-82bc60c94429');

-- 2. Weekly questions: editors can now edit and remove them too
drop policy if exists prompts_update on public.prompts;
create policy prompts_update on public.prompts for update to authenticated
  using (public.is_editor()) with check (public.is_editor());
drop policy if exists prompts_delete on public.prompts;
create policy prompts_delete on public.prompts for delete to authenticated
  using (public.is_editor());
