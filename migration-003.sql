-- =====================================================================
--  NUQTA update 003: faster language filter
--  The old version used a back-reference pattern to collapse repeated
--  letters ("shiiit" -> "shiit"). On texts longer than ~1,000 characters
--  it hit the database time limit, so long posts and every article failed
--  to save. This version does the same thing in a single linear pass.
--  Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- =====================================================================
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
