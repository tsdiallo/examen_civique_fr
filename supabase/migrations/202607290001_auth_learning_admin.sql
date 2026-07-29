begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  selected_path text check (selected_path in ('csp', 'resident', 'naturalisation')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  path_slug text not null check (path_slug in ('csp', 'resident', 'naturalisation')),
  module_slug text not null,
  mastery integer not null default 0 check (mastery between 0 and 100),
  wrong_concepts jsonb not null default '[]'::jsonb,
  next_review_at timestamptz,
  last_attempt_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, path_slug, module_slug)
);

create table if not exists public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  path_slug text not null check (path_slug in ('csp', 'resident', 'naturalisation')),
  score integer not null check (score >= 0),
  total integer not null check (total > 0 and score <= total),
  duration_seconds integer not null check (duration_seconds >= 0),
  breakdown jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.content_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  page_path text not null,
  message text not null check (char_length(message) between 10 and 2000),
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists learning_progress_user_idx on public.learning_progress(user_id);
create index if not exists learning_progress_review_idx on public.learning_progress(user_id, next_review_at);
create index if not exists exam_attempts_user_created_idx on public.exam_attempts(user_id, created_at desc);
create index if not exists content_reports_status_created_idx on public.content_reports(status, created_at desc);

alter table public.profiles enable row level security;
alter table public.learning_progress enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.content_reports enable row level security;

revoke all on public.profiles, public.learning_progress, public.exam_attempts, public.content_reports from anon;
grant select, insert, update on public.profiles, public.learning_progress to authenticated;
grant select, insert on public.exam_attempts to authenticated;
grant insert on public.content_reports to authenticated;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "learning_progress_select_own"
on public.learning_progress for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "learning_progress_insert_own"
on public.learning_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "learning_progress_update_own"
on public.learning_progress for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "exam_attempts_select_own"
on public.exam_attempts for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "exam_attempts_insert_own"
on public.exam_attempts for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "content_reports_insert_own"
on public.content_reports for insert
to authenticated
with check ((select auth.uid()) = user_id);

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.touch_updated_at() from public, anon, authenticated;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function private.touch_updated_at();

drop trigger if exists learning_progress_touch_updated_at on public.learning_progress;
create trigger learning_progress_touch_updated_at
before update on public.learning_progress
for each row execute function private.touch_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'display_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

commit;
