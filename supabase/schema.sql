-- ═══ PING DATABASE SCHEMA ═══
-- Run this in your Supabase SQL Editor (supabase.com → SQL)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ═══ USERS (extends Supabase auth.users) ═══
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  avatar_url text,
  location text,
  bio text,
  skills text[] default '{}',
  sub_skills text[] default '{}',
  include_remote boolean default true,
  plan text default 'free' check (plan in ('free', 'pro', 'team')),
  stripe_customer_id text,
  stripe_subscription_id text,
  daily_ping_count int default 0,
  daily_ping_reset_at timestamptz default now(),
  referral_code text unique default substr(md5(random()::text), 1, 8),
  referred_by uuid references public.profiles(id),
  bonus_pings int default 0,
  push_daily boolean default true,
  push_high_score boolean default true,
  push_replies boolean default true,
  links jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ═══ PINGS (the leads) ═══
create table public.pings (
  id uuid default uuid_generate_v4() primary key,
  company_name text not null,
  company_location text,
  ping_type text not null, -- 'new_registration', 'funding', 'cmo_departure', 'domain_purchased', 'hiring_creative'
  signal_source text, -- 'abn', 'whois', 'seek', 'crunchbase', 'google_alerts'
  signal_data jsonb default '{}', -- raw signal data
  score numeric(3,1) default 0,
  scores jsonb default '{}', -- {freshness, budget, match, urgency, reach}
  why text, -- why this is a ping
  image_url text, -- unsplash image
  contacts jsonb default '[]', -- array of contact objects
  messages jsonb default '[]', -- array of message objects
  skills_matched text[] default '{}', -- which skills this matches
  is_active boolean default true,
  expires_at timestamptz default (now() + interval '7 days'),
  created_at timestamptz default now()
);

-- Index for skill matching queries
create index idx_pings_skills on public.pings using gin(skills_matched);
create index idx_pings_active on public.pings(is_active, created_at desc);
create index idx_pings_score on public.pings(score desc);

-- ═══ USER PINGS (swipe history + saved leads) ═══
create table public.user_pings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  ping_id uuid references public.pings(id) on delete cascade not null,
  action text not null check (action in ('ping', 'skip')),
  status text default 'to_do' check (status in ('to_do', 'reached_out', 'replied', 'follow_up')),
  messages_sent jsonb default '[]', -- which message indices were sent
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, ping_id)
);

create index idx_user_pings_user on public.user_pings(user_id, created_at desc);

-- ═══ REFERRALS ═══
create table public.referrals (
  id uuid default uuid_generate_v4() primary key,
  referrer_id uuid references public.profiles(id) on delete cascade not null,
  referred_id uuid references public.profiles(id) on delete cascade not null,
  bonus_awarded boolean default false,
  created_at timestamptz default now(),
  unique(referrer_id, referred_id)
);

-- ═══ PUSH SUBSCRIPTIONS ═══
create table public.push_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subscription jsonb not null, -- PushSubscription object
  created_at timestamptz default now()
);

-- ═══ ROW LEVEL SECURITY ═══
alter table public.profiles enable row level security;
alter table public.pings enable row level security;
alter table public.user_pings enable row level security;
alter table public.referrals enable row level security;
alter table public.push_subscriptions enable row level security;

-- Profiles: users can read/update their own
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Pings: all authenticated users can read active pings
create policy "Authenticated users can view active pings" on public.pings for select using (is_active = true);

-- User pings: users can CRUD their own
create policy "Users can view own pings" on public.user_pings for select using (auth.uid() = user_id);
create policy "Users can create own pings" on public.user_pings for insert with check (auth.uid() = user_id);
create policy "Users can update own pings" on public.user_pings for update using (auth.uid() = user_id);

-- Referrals: users can view their own
create policy "Users can view own referrals" on public.referrals for select using (auth.uid() = referrer_id);

-- Push subs: users can manage their own
create policy "Users can manage own push subs" on public.push_subscriptions for all using (auth.uid() = user_id);

-- ═══ DAILY PING LIMIT RESET FUNCTION ═══
create or replace function public.reset_daily_pings()
returns void as $$
begin
  update public.profiles 
  set daily_ping_count = 0, daily_ping_reset_at = now()
  where daily_ping_reset_at < now() - interval '24 hours';
end;
$$ language plpgsql security definer;
