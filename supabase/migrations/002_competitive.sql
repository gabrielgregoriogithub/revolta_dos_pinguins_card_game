-- Competitive schema. Apply only after configuring Supabase Auth and the
-- authoritative match service. Clients must never write rating or results.
create table if not exists competitive_profiles (
  player_id uuid primary key references players(id) on delete cascade,
  current_rating integer not null default 1000 check (current_rating >= 0),
  peak_rating integer not null default 1000,
  ranked_wins integer not null default 0,
  ranked_losses integer not null default 0,
  ranked_draws integer not null default 0,
  placement_matches integer not null default 0,
  updated_at timestamptz not null default now()
);
create table if not exists seasons (
  id text primary key, name text not null, starts_at timestamptz not null,
  ends_at timestamptz not null, status text not null check (status in ('UPCOMING','ACTIVE','ENDED')),
  ruleset_version text not null, cardset_version text not null
);
create table if not exists season_ratings (
  season_id text not null references seasons(id), player_id uuid not null references players(id),
  rating integer not null default 1000, division text not null, wins integer not null default 0,
  losses integer not null default 0, draws integer not null default 0,
  primary key (season_id, player_id)
);
create table if not exists matchmaking_queue (
  id uuid primary key default gen_random_uuid(), player_id uuid not null references players(id),
  deck_id text not null, rating integer not null, status text not null default 'QUEUED',
  joined_at timestamptz not null default now(), expires_at timestamptz,
  unique (player_id)
);
create table if not exists ranked_matches (
  match_id uuid primary key references matches(id) on delete cascade, season_id text not null references seasons(id),
  player_a_id uuid not null references players(id), player_b_id uuid not null references players(id),
  result text, status text not null, created_at timestamptz not null default now(), completed_at timestamptz,
  check (player_a_id <> player_b_id)
);
create table if not exists rating_history (
  id uuid primary key default gen_random_uuid(), match_id uuid not null references ranked_matches(match_id),
  player_id uuid not null references players(id), previous_rating integer not null,
  rating_change integer not null, new_rating integer not null, result text not null,
  created_at timestamptz not null default now(), unique (match_id, player_id)
);
create table if not exists competitive_rewards (
  id uuid primary key default gen_random_uuid(), player_id uuid not null references players(id),
  season_id text not null references seasons(id), reward_id text not null, granted_at timestamptz not null default now(),
  unique (player_id, season_id, reward_id)
);
create index if not exists idx_matchmaking_queue_rating on matchmaking_queue(status, rating, joined_at);
create index if not exists idx_rating_history_player on rating_history(player_id, created_at desc);

-- RLS policies are intentionally not enabled by this local migration until
-- the project has a configured auth provider and the authoritative service role.
