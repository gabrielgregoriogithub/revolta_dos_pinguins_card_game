-- Preparation only: the local WebSocket authority is the executable MVP.
-- Apply these tables only after configuring Supabase Auth and a server-side authority.
create table if not exists public.lobbies (
  id uuid primary key default gen_random_uuid(),
  invite_code text unique not null,
  host_player_id uuid not null,
  status text not null check (status in ('WAITING','READY','STARTED','CLOSED')),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  lobby_id uuid not null references public.lobbies(id),
  status text not null,
  active_player_id uuid,
  turn_number integer not null default 1,
  state_version bigint not null default 0,
  ruleset_version text not null,
  cardset_version text not null,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);
create table if not exists public.match_commands (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id),
  player_id uuid not null,
  request_id text not null,
  expected_version bigint,
  command_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  unique(match_id, request_id)
);
create table if not exists public.match_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id),
  sequence bigint not null,
  event_type text not null,
  public_payload jsonb not null,
  created_at timestamptz not null default now(),
  unique(match_id, sequence)
);
-- RLS is intentionally not enabled by this preparation migration until Auth ownership policies are defined.
