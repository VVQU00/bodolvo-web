-- REQUIRED BEFORE DEPLOYING Link Hub ownership controls.
-- Existing profiles remain unclaimed. Do NOT assign legacy owners using an unverified username.
alter table public.link_hubs add column if not exists owner_id uuid references auth.users(id) on delete set null;
create index if not exists link_hubs_owner_id_idx on public.link_hubs(owner_id);
-- Existing/legacy profiles with owner_id NULL cannot be modified through the new publishing API.
-- Verify the rightful owner before assigning any legacy profile manually in Supabase dashboard.
-- Requires NEXT_PUBLIC_SUPABASE_ANON_KEY in both local .env.local and Vercel settings.
-- Ensure Supabase email/password authentication is enabled and confirm-email is configured as desired.
