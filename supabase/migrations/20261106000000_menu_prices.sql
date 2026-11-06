-- =============================================================================
-- Live menu prices, editable from /admin by admins only.
--
-- Safe to run more than once, and safe on a project that already has (or doesn't
-- have) the earlier role tables: everything is created only if missing.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------
do $$
begin
  create type public.app_role as enum ('admin', 'customer');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

drop policy if exists "Users can view their own roles" on public.user_roles;
create policy "Users can view their own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

grant select on public.user_roles to authenticated;

-- ---------------------------------------------------------------------------
-- Prices. A row overrides the price built into the website; no row means
-- "use the website's built-in price".
-- ---------------------------------------------------------------------------
create table if not exists public.menu_prices (
  item_id text primary key check (item_id ~ '^[a-z0-9-]{1,64}$'),
  price_cents integer not null check (price_cents between 0 and 100000),
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid() references auth.users (id) on delete set null
);

alter table public.menu_prices enable row level security;

drop policy if exists "Anyone can read prices" on public.menu_prices;
create policy "Anyone can read prices"
  on public.menu_prices for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can add prices" on public.menu_prices;
create policy "Admins can add prices"
  on public.menu_prices for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can change prices" on public.menu_prices;
create policy "Admins can change prices"
  on public.menu_prices for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can reset prices" on public.menu_prices;
create policy "Admins can reset prices"
  on public.menu_prices for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

grant select on public.menu_prices to anon, authenticated;
grant insert, update, delete on public.menu_prices to authenticated;

-- ---------------------------------------------------------------------------
-- History: every change is logged automatically by a trigger, so you can see
-- who changed what and when (and put a price back if needed).
-- ---------------------------------------------------------------------------
create table if not exists public.menu_price_history (
  id bigint generated always as identity primary key,
  item_id text not null,
  old_price_cents integer,
  new_price_cents integer, -- null means "reset to the website's built-in price"
  changed_at timestamptz not null default now(),
  changed_by uuid,
  changed_by_email text
);

alter table public.menu_price_history enable row level security;

drop policy if exists "Admins can read price history" on public.menu_price_history;
create policy "Admins can read price history"
  on public.menu_price_history for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

grant select on public.menu_price_history to authenticated;

create or replace function public.touch_menu_price()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end
$$;

drop trigger if exists menu_prices_touch on public.menu_prices;
create trigger menu_prices_touch
  before insert or update on public.menu_prices
  for each row execute function public.touch_menu_price();

create or replace function public.log_menu_price_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Skip no-op updates (saving the same price again).
  if tg_op = 'UPDATE' and old.price_cents = new.price_cents then
    return new;
  end if;

  insert into public.menu_price_history (item_id, old_price_cents, new_price_cents, changed_by, changed_by_email)
  values (
    coalesce(new.item_id, old.item_id),
    case when tg_op in ('UPDATE', 'DELETE') then old.price_cents end,
    case when tg_op in ('INSERT', 'UPDATE') then new.price_cents end,
    auth.uid(),
    (select email from auth.users where id = auth.uid())
  );
  return coalesce(new, old);
end
$$;

drop trigger if exists menu_prices_log on public.menu_prices;
create trigger menu_prices_log
  after insert or update or delete on public.menu_prices
  for each row execute function public.log_menu_price_change();
