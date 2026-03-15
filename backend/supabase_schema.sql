-- ============================================================
-- ClauseAI — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Analyses table: one row per contract scan
create table if not exists public.analyses (
  id            uuid primary key default gen_random_uuid(),
  user_id       text not null,              -- Clerk user ID (e.g. "user_abc123")
  created_at    timestamptz not null default now(),

  -- Input metadata
  contract_type text,                        -- e.g. "Lease Agreement"
  input_length  int,                         -- character count of original text

  -- Structured results
  attention_score int not null,              -- 1–10
  score_label   text not null,              -- e.g. "Worth Reviewing"
  summary       text,                        -- plain-English summary
  key_points    jsonb not null default '[]', -- array of strings
  red_flags     jsonb not null default '[]'  -- array of {clause, concern, severity}
);

-- Index for fast per-user history queries
create index if not exists analyses_user_id_idx on public.analyses (user_id, created_at desc);

-- Row Level Security: users can only see/manage their own rows
alter table public.analyses enable row level security;

create policy "Users can read own analyses"
  on public.analyses for select
  using (auth.uid()::text = user_id);

create policy "Service role can insert analyses"
  on public.analyses for insert
  with check (true);   -- Backend uses service role key, bypasses RLS

-- ============================================================
-- Usage tracking table (for free tier enforcement)
-- ============================================================
create table if not exists public.usage (
  user_id       text primary key,
  analyses_this_month int not null default 0,
  period_start  timestamptz not null default date_trunc('month', now())
);

alter table public.usage enable row level security;

create policy "Users can read own usage"
  on public.usage for select
  using (auth.uid()::text = user_id);

create policy "Service role can upsert usage"
  on public.usage for all
  with check (true);
