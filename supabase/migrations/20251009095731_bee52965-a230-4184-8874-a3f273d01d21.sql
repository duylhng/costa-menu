-- Drop all tables to fix security issues
-- Drop in order to handle foreign key dependencies

DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop the app_role enum type
DROP TYPE IF EXISTS public.app_role CASCADE;