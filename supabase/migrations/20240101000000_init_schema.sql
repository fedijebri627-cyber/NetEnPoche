-- DANGER: Drop legacy Streamlit tables and types
drop table if exists users cascade;
drop type if exists subscription_tier cascade;
drop type if exists subscription_status cascade;
drop type if exists activity_type cascade;
drop type if exists client_type cascade;
drop type if exists invoice_status cascade;
drop type if exists alert_type cascade;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- ENUMS
-- ==========================================
create type subscription_tier as enum ('free', 'pro', 'expert');
create type subscription_status as enum ('active', 'trialing', 'canceled', 'past_due');
create type activity_type as enum ('services_bic', 'services_bnc', 'vente', 'liberal');
create type client_type as enum ('b2b', 'b2c');
create type invoice_status as enum ('draft', 'sent', 'paid', 'overdue');
create type alert_type as enum ('urssaf_due', 'tva_threshold', 'ca_drop', 'goal_progress', 'entry_reminder');

-- ==========================================
-- TABLES
-- ==========================================

-- 1. users (extends Supabase auth.users)
create table if not exists users (
    id uuid primary key references auth.users on delete cascade,
    email text not null,
    full_name text,
    subscription_tier subscription_tier default 'free',
    subscription_status subscription_status,
    stripe_customer_id text,
    stripe_subscription_id text,
    trial_ends_at timestamptz,
    created_at timestamptz default now()
);

-- 2. activity_config (one per user per year)
create table if not exists activity_config (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.users(id) on delete cascade,
    year integer not null,
    activity_type activity_type not null,
    acre_enabled boolean default false,
    versement_liberatoire boolean default false,
    annual_ca_goal numeric default null,
    created_at timestamptz default now(),
    -- Constraint: 1 config per user per year
    unique(user_id, year)
);

-- 3. monthly_entries
create table if not exists monthly_entries (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.users(id) on delete cascade,
    year integer not null,
    month integer not null check (month between 1 and 12),
    ca_amount numeric not null default 0,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    -- Constraint: 1 entry per user, per month, per year
    unique(user_id, year, month)
);

-- 4. clients (expert tier)
create table if not exists clients (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.users(id) on delete cascade,
    name text not null,
    type client_type not null,
    email text,
    created_at timestamptz default now()
);

-- 5. invoices (expert tier)
create table if not exists invoices (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.users(id) on delete cascade,
    client_id uuid not null references public.clients(id) on delete cascade,
    amount_ht numeric not null,
    invoice_date date not null,
    due_date date not null,
    status invoice_status not null default 'draft',
    -- Auto-derived columns generated safely
    month integer generated always as (extract(month from invoice_date)) stored,
    year integer generated always as (extract(year from invoice_date)) stored,
    created_at timestamptz default now()
);

-- 6. alert_preferences
create table if not exists alert_preferences (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.users(id) on delete cascade,
    alert_type alert_type not null,
    enabled boolean default true,
    threshold_value numeric, -- e.g. 80 for 80%
    days_before integer,     -- e.g. 14 for 14 days before
    last_triggered_at timestamptz,
    unique(user_id, alert_type)
);

-- ==========================================
-- INDEXES
-- ==========================================
create index if not exists idx_monthly_entries_user_year on monthly_entries (user_id, year);
create index if not exists idx_activity_config_user_year on activity_config (user_id, year);
create index if not exists idx_invoices_user_year_month on invoices (user_id, year, month);

-- ==========================================
-- UPDATED_AT TRIGGER
-- ==========================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
    NEW.updated_at = now();
    return NEW;
end;
$$ language plpgsql;

create trigger update_monthly_entries_modtime
before update on monthly_entries
for each row execute function update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
alter table users enable row level security;
alter table activity_config enable row level security;
alter table monthly_entries enable row level security;
alter table clients enable row level security;
alter table invoices enable row level security;
alter table alert_preferences enable row level security;

-- Users Table Policies
create policy "Users can view their own profile" on users
    for select using (auth.uid() = id);
create policy "Users can update their own profile" on users
    for update using (auth.uid() = id);

-- Activity Config Policies
create policy "Users can perform all actions on their own activity configs" on activity_config
    for all using (auth.uid() = user_id);

-- Monthly Entries Policies
create policy "Users can perform all actions on their own monthly entries" on monthly_entries
    for all using (auth.uid() = user_id);

-- Clients Policies
create policy "Users can perform all actions on their own clients" on clients
    for all using (auth.uid() = user_id);

-- Invoices Policies
create policy "Users can perform all actions on their own invoices" on invoices
    for all using (auth.uid() = user_id);

-- Alert Preferences Policies
create policy "Users can perform all actions on their own alert preferences" on alert_preferences
    for all using (auth.uid() = user_id);

-- Autocreate User Trigger (Optional but helpful for Stripe integration)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
