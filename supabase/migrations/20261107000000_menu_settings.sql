-- =============================================================================
-- Menu settings editable from /admin: which items are "popular" (★ badge and
-- ticker) and which appear in "Readers' favourites" on the front page.
--
-- Needs 20261106000000_menu_prices.sql to have been run first (for the roles).
-- Safe to run more than once.
-- =============================================================================

create table if not exists public.menu_settings (
  key text primary key check (key in ('popular', 'front_page')),
  -- An array of menu item ids, e.g. ["cod", "calamari-rings"]. For front_page the
  -- order is the order they appear in.
  value jsonb not null check (jsonb_typeof(value) = 'array'),
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid() references auth.users (id) on delete set null,
  constraint front_page_max_six check (key <> 'front_page' or jsonb_array_length(value) <= 6),
  constraint at_most_200_items check (jsonb_array_length(value) <= 200)
);

alter table public.menu_settings enable row level security;

drop policy if exists "Anyone can read menu settings" on public.menu_settings;
create policy "Anyone can read menu settings"
  on public.menu_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can add menu settings" on public.menu_settings;
create policy "Admins can add menu settings"
  on public.menu_settings for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can change menu settings" on public.menu_settings;
create policy "Admins can change menu settings"
  on public.menu_settings for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can reset menu settings" on public.menu_settings;
create policy "Admins can reset menu settings"
  on public.menu_settings for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

grant select on public.menu_settings to anon, authenticated;
grant insert, update, delete on public.menu_settings to authenticated;

-- ---------------------------------------------------------------------------
-- History
-- ---------------------------------------------------------------------------
create table if not exists public.menu_settings_history (
  id bigint generated always as identity primary key,
  key text not null,
  old_value jsonb,
  new_value jsonb, -- null means "reset to the website's built-in choice"
  changed_at timestamptz not null default now(),
  changed_by uuid,
  changed_by_email text
);

alter table public.menu_settings_history enable row level security;

drop policy if exists "Admins can read menu settings history" on public.menu_settings_history;
create policy "Admins can read menu settings history"
  on public.menu_settings_history for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

grant select on public.menu_settings_history to authenticated;

-- Reuses touch_menu_price() from the prices migration (sets updated_at / updated_by).
drop trigger if exists menu_settings_touch on public.menu_settings;
create trigger menu_settings_touch
  before insert or update on public.menu_settings
  for each row execute function public.touch_menu_price();

create or replace function public.log_menu_settings_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and old.value = new.value then
    return new;
  end if;

  insert into public.menu_settings_history (key, old_value, new_value, changed_by, changed_by_email)
  values (
    coalesce(new.key, old.key),
    case when tg_op in ('UPDATE', 'DELETE') then old.value end,
    case when tg_op in ('INSERT', 'UPDATE') then new.value end,
    auth.uid(),
    (select email from auth.users where id = auth.uid())
  );
  return coalesce(new, old);
end
$$;

drop trigger if exists menu_settings_log on public.menu_settings;
create trigger menu_settings_log
  after insert or update or delete on public.menu_settings
  for each row execute function public.log_menu_settings_change();
