alter table invoices
add column if not exists last_alert_sent timestamptz default null;
