-- Add SIRET and business name fields to users table
alter table public.users add column if not exists siret text;
alter table public.users add column if not exists business_name text;
