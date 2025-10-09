-- Drop the has_role function to fix the remaining security warning
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;

-- Also drop update_updated_at_column function if it exists
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;