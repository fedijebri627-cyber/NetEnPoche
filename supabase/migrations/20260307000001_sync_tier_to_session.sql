-- This trigger automatically synchronizes the 'subscription_tier' from public.users 
-- into the auth.users 'raw_user_meta_data' JSONB object.
-- This ensures the subscription tier is securely embedded in the User JWT session,
-- allowing the client to read their tier without making an extra database query.

create or replace function public.sync_subscription_tier_to_auth()
returns trigger as $$
begin
  update auth.users
  set raw_user_meta_data = jsonb_set(
    coalesce(raw_user_meta_data, '{}'::jsonb),
    '{subscription_tier}',
    to_jsonb(NEW.subscription_tier)
  )
  where id = NEW.id;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_subscription_tier_change
  after insert or update of subscription_tier on public.users
  for each row execute procedure public.sync_subscription_tier_to_auth();

-- Backfill existing users (if any exist during this point of migration)
update auth.users au
set raw_user_meta_data = jsonb_set(
  coalesce(au.raw_user_meta_data, '{}'::jsonb),
  '{subscription_tier}',
  to_jsonb(pu.subscription_tier)
)
from public.users pu
where au.id = pu.id;
