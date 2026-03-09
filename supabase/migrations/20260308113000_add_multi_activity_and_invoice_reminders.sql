alter table public.activity_config
    add column if not exists secondary_activity_type public.activity_type,
    add column if not exists secondary_activity_share numeric check (
        secondary_activity_share is null
        or (secondary_activity_share >= 0 and secondary_activity_share <= 0.9)
    );

alter table public.invoices
    add column if not exists paid_at date;

create table if not exists public.invoice_reminders (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.users(id) on delete cascade,
    invoice_id uuid not null references public.invoices(id) on delete cascade,
    channel text not null default 'email',
    template_key text not null default 'friendly',
    recipient text,
    note text,
    created_at timestamptz not null default now()
);

create index if not exists idx_invoice_reminders_user_created
    on public.invoice_reminders (user_id, created_at desc);

create index if not exists idx_invoice_reminders_invoice
    on public.invoice_reminders (invoice_id, created_at desc);

alter table public.invoice_reminders enable row level security;

drop policy if exists "Users can perform all actions on their own invoice reminders" on public.invoice_reminders;
create policy "Users can perform all actions on their own invoice reminders"
    on public.invoice_reminders
    for all using (auth.uid() = user_id);