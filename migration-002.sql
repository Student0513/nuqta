-- =====================================================================
--  NUQTA update 002
--   1. Article drafts for members
--   2. Everyone can edit their own Floor posts (shown as "edited")
--   3. Moderation, deleting/editing existing content and the team are
--      owner-only; editors keep approving, posting and weekly questions
--  Run once in Supabase: SQL Editor -> New query -> paste -> Run.
--  Safe to run more than once.
-- =====================================================================

-- Allow a 'draft' status (only the writer can see a draft)
alter table public.articles drop constraint if exists articles_status_check;
alter table public.articles add constraint articles_status_check
  check (status in ('draft','pending','published','rejected'));

-- Drafts are private: editors see submissions only once they are sent for review
drop policy if exists articles_read on public.articles;
create policy articles_read on public.articles for select
  using (status = 'published' or submitted_by = auth.uid()
         or (public.is_editor() and status <> 'draft'));

-- Members may create drafts or send for review; editors may also publish directly
drop policy if exists articles_insert on public.articles;
create policy articles_insert on public.articles for insert to authenticated
  with check (public.can_post() and submitted_by = auth.uid()
              and (status in ('draft','pending') or public.is_editor()));

-- Members may edit their own drafts and sent-back pieces, and resubmit them
drop policy if exists articles_update_own on public.articles;
create policy articles_update_own on public.articles for update to authenticated
  using (submitted_by = auth.uid() and status in ('draft','rejected'))
  with check (submitted_by = auth.uid() and status in ('draft','pending') and public.can_post());

-- Keep drafts out of the editors' review queue counts and limits
create or replace function public.moderate_article() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status <> 'draft'
     and public.has_blocked_language(concat_ws(' ', new.title, new.nuqta, new.dek, new.author, new.body)) then
    raise exception 'blocked_language';
  end if;
  if new.status = 'pending' and not public.is_editor()
     and (tg_op = 'INSERT' or old.status is distinct from 'pending')
     and (select count(*) from public.articles where submitted_by = new.submitted_by and status = 'pending') >= 5 then
    raise exception 'too_many_pending';
  end if;
  return new;
end $$;

-- ---------------------------------------------------------------------
-- 2. Editing your own posts
-- ---------------------------------------------------------------------
alter table public.posts add column if not exists edited_at timestamptz;

-- Authors may change only the text of their own post; everything else stays as it was
create or replace function public.protect_post() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner() then
    new.user_id := old.user_id; new.space := old.space; new.ref := old.ref;
    new.parent_id := old.parent_id; new.anon := old.anon; new.hidden := old.hidden;
    new.created_at := old.created_at;
  end if;
  if new.body is distinct from old.body then new.edited_at := now(); end if;
  return new;
end $$;
drop trigger if exists posts_protect on public.posts;
create trigger posts_protect before update on public.posts
  for each row execute function public.protect_post();

drop policy if exists posts_update on public.posts;
create policy posts_update on public.posts for update to authenticated
  using (user_id = auth.uid() or public.is_owner())
  with check (user_id = auth.uid() or public.is_owner());

create or replace view public.public_posts as
  select p.id,
         case when p.anon then null else p.user_id end           as user_id,
         case when p.anon then 'Anonymous reader' else pr.display_name end as author_name,
         p.space, p.ref, p.parent_id, p.body, p.anon, p.created_at,
         coalesce(p.user_id = auth.uid(), false)                  as mine,
         (select count(*) from public.dots d where d.post_id = p.id)::int as dots,
         p.edited_at
  from public.posts p
  join public.profiles pr on pr.id = p.user_id
  where not p.hidden;
grant select on public.public_posts to anon, authenticated;

-- ---------------------------------------------------------------------
-- 3. Owner-only moderation and management
-- ---------------------------------------------------------------------
-- Floor posts: only the author or the owner can delete; only they see the raw table
drop policy if exists posts_read on public.posts;
create policy posts_read on public.posts for select using (user_id = auth.uid() or public.is_owner());
drop policy if exists posts_delete on public.posts;
create policy posts_delete on public.posts for delete to authenticated
  using (user_id = auth.uid() or public.is_owner());

-- Reports and the blocked-words list: owner only
drop policy if exists reports_read on public.reports;
create policy reports_read on public.reports for select using (user_id = auth.uid() or public.is_owner());
drop policy if exists reports_update on public.reports;
create policy reports_update on public.reports for update to authenticated
  using (public.is_owner()) with check (public.is_owner());
drop policy if exists reports_delete on public.reports;
create policy reports_delete on public.reports for delete to authenticated
  using (user_id = auth.uid() or public.is_owner());
drop policy if exists blocked_words_editors on public.blocked_words;
drop policy if exists blocked_words_owner on public.blocked_words;
create policy blocked_words_owner on public.blocked_words for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

-- News and weekly questions: editors add new ones; only the owner edits or deletes
drop policy if exists news_write on public.news;
drop policy if exists news_insert on public.news;
drop policy if exists news_update on public.news;
drop policy if exists news_delete on public.news;
create policy news_insert on public.news for insert to authenticated with check (public.is_editor());
create policy news_update on public.news for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy news_delete on public.news for delete to authenticated using (public.is_owner());

drop policy if exists prompts_write on public.prompts;
drop policy if exists prompts_insert on public.prompts;
drop policy if exists prompts_update on public.prompts;
drop policy if exists prompts_delete on public.prompts;
create policy prompts_insert on public.prompts for insert to authenticated with check (public.is_editor());
create policy prompts_update on public.prompts for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy prompts_delete on public.prompts for delete to authenticated using (public.is_owner());

-- Articles: editors still approve and set the Latest Nuqta; only the owner deletes
drop policy if exists articles_delete on public.articles;
create policy articles_delete on public.articles for delete to authenticated
  using (public.is_owner() or (submitted_by = auth.uid() and status <> 'published'));
