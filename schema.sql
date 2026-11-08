-- =====================================================================
--  NUQTA database schema
--  Run this ONCE in Supabase: Dashboard -> SQL Editor -> New query ->
--  paste this whole file -> Run.
--  Every table is protected by Row Level Security, so the public
--  "anon" key in config.js can only do what the policies below allow.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Profiles and roles
--   member : default after sign-up (post, vote, report, submit articles)
--   editor : your admins (newsroom, approvals, moderation)
--   owner  : you (also promotes editors and bans accounts)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 40),
  role         text not null default 'member' check (role in ('member','editor','owner')),
  banned       boolean not null default false,
  created_at   timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare n text;
begin
  n := left(trim(coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))), 40);
  if char_length(n) < 2 then n := 'Reader'; end if;
  insert into public.profiles (id, display_name) values (new.id, n);
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as $$
  select case when banned then 'banned' else role end from public.profiles where id = auth.uid()
$$;
create or replace function public.is_editor() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.my_role() in ('editor','owner'), false)
$$;
create or replace function public.is_owner() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.my_role() = 'owner', false)
$$;
create or replace function public.can_post() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.my_role() in ('member','editor','owner'), false)
$$;

-- Only the owner may change roles or bans. (Direct SQL in the dashboard,
-- where auth.uid() is null, is allowed so you can make yourself owner.)
create or replace function public.protect_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null
     and (new.role is distinct from old.role or new.banned is distinct from old.banned)
     and not public.is_owner() then
    raise exception 'only_owner';
  end if;
  if auth.uid() = old.id and old.role = 'owner' and new.role <> 'owner' then
    raise exception 'owner_cannot_demote_self';
  end if;
  return new;
end $$;
drop trigger if exists profiles_protect on public.profiles;
create trigger profiles_protect before update on public.profiles
  for each row execute function public.protect_profile();

alter table public.profiles enable row level security;
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select using (true);
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_owner()) with check (id = auth.uid() or public.is_owner());

-- ---------------------------------------------------------------------
-- Current affairs
-- ---------------------------------------------------------------------
create table if not exists public.news (
  id         uuid primary key default gen_random_uuid(),
  title      text not null check (char_length(title) between 3 and 200),
  dek        text not null default '',
  why        text not null default '',
  body       text not null default '',
  region     text not null default 'World',
  status     text not null default 'Update',
  author     text not null default 'Nuqta Desk',
  sources    text not null default '',
  sample     boolean not null default false,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references public.profiles(id) on delete set null
);
alter table public.news enable row level security;
drop policy if exists news_read on public.news;
create policy news_read on public.news for select using (true);
drop policy if exists news_write on public.news;
create policy news_write on public.news for all to authenticated
  using (public.is_editor()) with check (public.is_editor());

-- ---------------------------------------------------------------------
-- Articles: submissions and published pieces share one table.
-- Members submit with status 'pending'; editors publish or send back.
-- ---------------------------------------------------------------------
create table if not exists public.articles (
  id           uuid primary key default gen_random_uuid(),
  title        text not null check (char_length(title) between 3 and 160),
  nuqta        text not null check (char_length(nuqta) between 3 and 240),
  dek          text not null default '',
  section      text not null default 'Politics',
  author       text not null check (char_length(author) between 2 and 80),
  body         text not null check (char_length(body) between 1 and 60000),
  symbol       text not null default '',
  featured     boolean not null default false,
  status       text not null default 'pending' check (status in ('pending','published','rejected')),
  editor_note  text not null default '',
  sample       boolean not null default false,
  submitted_by uuid default auth.uid() references public.profiles(id) on delete set null,
  decided_by   uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  published_at timestamptz
);
alter table public.articles enable row level security;
drop policy if exists articles_read on public.articles;
create policy articles_read on public.articles for select
  using (status = 'published' or submitted_by = auth.uid() or public.is_editor());
drop policy if exists articles_insert on public.articles;
create policy articles_insert on public.articles for insert to authenticated
  with check (public.can_post() and submitted_by = auth.uid()
              and (status = 'pending' or public.is_editor()));
drop policy if exists articles_update on public.articles;
create policy articles_update on public.articles for update to authenticated
  using (public.is_editor()) with check (public.is_editor());
drop policy if exists articles_delete on public.articles;
create policy articles_delete on public.articles for delete to authenticated
  using (public.is_editor() or (submitted_by = auth.uid() and status <> 'published'));

-- ---------------------------------------------------------------------
-- Weekly questions (each goes live on the Monday of its week)
-- ---------------------------------------------------------------------
create table if not exists public.prompts (
  id         uuid primary key default gen_random_uuid(),
  question   text not null check (char_length(question) between 5 and 200),
  context    text not null default '',
  week       date not null,
  sample     boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.prompts enable row level security;
drop policy if exists prompts_read on public.prompts;
create policy prompts_read on public.prompts for select using (true);
drop policy if exists prompts_write on public.prompts;
create policy prompts_write on public.prompts for all to authenticated
  using (public.is_editor()) with check (public.is_editor());

-- ---------------------------------------------------------------------
-- The Floor: posts, dots (upvotes), stances, reports
-- ---------------------------------------------------------------------
create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  space      text not null check (space in ('article','prompt','open')),
  ref        uuid,
  parent_id  uuid references public.posts(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 2000),
  anon       boolean not null default false,
  hidden     boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists posts_space_ref on public.posts (space, ref);
alter table public.posts enable row level security;
-- Readers see posts through the public_posts view (which hides who wrote
-- anonymous posts). The raw table is visible only to its author and editors.
drop policy if exists posts_read on public.posts;
create policy posts_read on public.posts for select using (user_id = auth.uid() or public.is_editor());
drop policy if exists posts_insert on public.posts;
create policy posts_insert on public.posts for insert to authenticated
  with check (user_id = auth.uid() and public.can_post() and hidden = false);
drop policy if exists posts_update on public.posts;
create policy posts_update on public.posts for update to authenticated
  using (public.is_editor()) with check (public.is_editor());
drop policy if exists posts_delete on public.posts;
create policy posts_delete on public.posts for delete to authenticated
  using (user_id = auth.uid() or public.is_editor());

create table if not exists public.dots (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  primary key (post_id, user_id)
);
alter table public.dots enable row level security;
drop policy if exists dots_own on public.dots;
create policy dots_own on public.dots for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid() and public.can_post());

create table if not exists public.stances (
  article_id uuid not null references public.articles(id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  value      text not null check (value in ('agree','complicated','disagree')),
  primary key (article_id, user_id)
);
alter table public.stances enable row level security;
drop policy if exists stances_own on public.stances;
create policy stances_own on public.stances for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid() and public.can_post());

create table if not exists public.reports (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  resolved   boolean not null default false,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);
alter table public.reports enable row level security;
drop policy if exists reports_read on public.reports;
create policy reports_read on public.reports for select using (user_id = auth.uid() or public.is_editor());
drop policy if exists reports_insert on public.reports;
create policy reports_insert on public.reports for insert to authenticated
  with check (user_id = auth.uid() and public.can_post());
drop policy if exists reports_update on public.reports;
create policy reports_update on public.reports for update to authenticated
  using (public.is_editor()) with check (public.is_editor());
drop policy if exists reports_delete on public.reports;
create policy reports_delete on public.reports for delete to authenticated
  using (user_id = auth.uid() or public.is_editor());

-- ---------------------------------------------------------------------
-- Public views
-- ---------------------------------------------------------------------
create or replace view public.public_posts as
  select p.id,
         case when p.anon then null else p.user_id end           as user_id,
         case when p.anon then 'Anonymous reader' else pr.display_name end as author_name,
         p.space, p.ref, p.parent_id, p.body, p.anon, p.created_at,
         coalesce(p.user_id = auth.uid(), false)                  as mine,
         (select count(*) from public.dots d where d.post_id = p.id)::int as dots
  from public.posts p
  join public.profiles pr on pr.id = p.user_id
  where not p.hidden;

create or replace view public.stance_counts as
  select article_id,
         count(*) filter (where value = 'agree')::int       as agree,
         count(*) filter (where value = 'complicated')::int as complicated,
         count(*) filter (where value = 'disagree')::int    as disagree
  from public.stances group by article_id;

-- ---------------------------------------------------------------------
-- Moderation: blocked words, link and rate limits, auto-hide on reports
-- These run inside the database, so they cannot be bypassed.
-- ---------------------------------------------------------------------
create table if not exists public.blocked_words (
  word text primary key check (char_length(word) between 2 and 60)
);
alter table public.blocked_words enable row level security;
drop policy if exists blocked_words_editors on public.blocked_words;
create policy blocked_words_editors on public.blocked_words for all to authenticated
  using (public.is_editor()) with check (public.is_editor());

-- Lower-case, undo leetspeak (@ 4 0 ! 1 | 3 5 $ 7), squash repeated letters,
-- and turn everything that is not a letter (any script) into spaces.
create or replace function public.nuqta_normalise(t text) returns text
language sql immutable as $$
  with s as (
    select translate(lower(coalesce(t, '')), '@40!1|35$7', 'aaoiiiesst') as v
  ), c as (
    select u.ch, u.i, lag(u.ch, 1) over (order by u.i) as p1, lag(u.ch, 2) over (order by u.i) as p2
    from s, unnest(string_to_array(s.v, null)) with ordinality as u(ch, i)
  )
  select ' ' || regexp_replace(
           coalesce((select string_agg(ch, '' order by i) from c where not coalesce(ch = p1 and ch = p2, false)), ''),
           '[^[:alpha:]]+', ' ', 'g') || ' '
$$;

create or replace function public.has_blocked_language(t text) returns boolean
language sql stable security definer set search_path = public as $$
  with x as (select public.nuqta_normalise(t) as n)
  select exists (
    select 1 from public.blocked_words w, x,
         lateral (select trim(public.nuqta_normalise(w.word)) as v) b
    where b.v <> '' and (x.n like '% ' || b.v || ' %'
                         or (char_length(b.v) >= 5 and x.n like '% ' || b.v || '%'))
  )
$$;

create or replace function public.moderate_post() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if public.has_blocked_language(new.body) then raise exception 'blocked_language'; end if;
  if (select count(*) from regexp_matches(new.body, 'https?://', 'g')) > 2 then raise exception 'too_many_links'; end if;
  if tg_op = 'INSERT' and not public.is_editor()
     and (select count(*) from public.posts where user_id = new.user_id and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'rate_limited';
  end if;
  return new;
end $$;
drop trigger if exists posts_moderate on public.posts;
create trigger posts_moderate before insert or update of body on public.posts
  for each row execute function public.moderate_post();

create or replace function public.moderate_article() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if public.has_blocked_language(concat_ws(' ', new.title, new.nuqta, new.dek, new.author, new.body)) then
    raise exception 'blocked_language';
  end if;
  if tg_op = 'INSERT' and not public.is_editor()
     and (select count(*) from public.articles where submitted_by = new.submitted_by and status = 'pending') >= 5 then
    raise exception 'too_many_pending';
  end if;
  return new;
end $$;
drop trigger if exists articles_moderate on public.articles;
create trigger articles_moderate before insert or update on public.articles
  for each row execute function public.moderate_article();

-- A post reported by 3 different people is hidden until an editor reviews it.
create or replace function public.auto_hide_reported() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.reports where post_id = new.post_id and not resolved) >= 3 then
    update public.posts set hidden = true where id = new.post_id;
  end if;
  return new;
end $$;
drop trigger if exists reports_auto_hide on public.reports;
create trigger reports_auto_hide after insert on public.reports
  for each row execute function public.auto_hide_reported();

-- Starter list (English + Roman Urdu). Editors add more from the Newsroom.
insert into public.blocked_words (word) values
  ('fuck'),('fucking'),('motherfucker'),('shit'),('bullshit'),('bitch'),('bastard'),('asshole'),
  ('cunt'),('slut'),('whore'),('retard'),('faggot'),('nigger'),('nigga'),
  ('chutiya'),('chutia'),('choothiya'),('bhenchod'),('behenchod'),('bhencho'),('madarchod'),
  ('maderchod'),('harami'),('haramzada'),('haramkhor'),('kamina'),('kamine'),('gandu'),
  ('bhosdi'),('bhosda'),('bhosdike'),('randi'),('kanjar'),('lund'),('tatte')
on conflict do nothing;

-- ---------------------------------------------------------------------
-- Access for the website's public key (RLS above still decides rows)
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant select on public.public_posts, public.stance_counts to anon, authenticated;
grant execute on all functions in schema public to anon, authenticated;
