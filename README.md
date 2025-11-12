# FitHub — Member Portal

Luxury fitness onboarding for Peak Performance Gym.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project and copy the Project URL and anon public key.

3. Create a `.env.local` at the project root (see `.env.local.example`) and add:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. In the Supabase SQL editor, run the SQL below to create the `profiles` and `memberships` tables with Row Level Security policies.

5. Start the dev server:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000` in your browser.

### Auth Flow

- During registration we store the onboarding answers in the Supabase user metadata.
- If email confirmations are disabled in your Supabase project, the profile and membership records are created immediately and the user is redirected to the in-app dashboard.
- If email confirmations are enabled (default), the app will prompt the user to verify their email first. After they confirm and log in, the dashboard ensures the profile and membership tables are populated from the stored metadata.
- The dashboard at `/dashboard` shows the logged-in user’s profile, membership tier, and gives a sign-out button so members can confirm their session state quickly.

### Database Schema (Supabase)

Run this in Supabase SQL editor:

```sql
-- auth-linked profile for each user
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  address text,
  contact_number text,
  emergency_contact text,
  goals text[] default '{}',
  created_at timestamptz default now()
);

-- user membership
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tier text not null check (tier in ('basic','premium','vip')),
  status text not null default 'active' check (status in ('active','canceled','past_due')),
  current_period_start timestamptz default now(),
  current_period_end timestamptz,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.memberships enable row level security;

-- Profiles: users can manage only their own row
create policy if not exists "profile_select_self"
  on public.profiles for select
  using (auth.uid() = id);

create policy if not exists "profile_insert_self"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy if not exists "profile_update_self"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Memberships: users can read their own and insert their own
create policy if not exists "membership_select_self"
  on public.memberships for select
  using (auth.uid() = user_id);

create policy if not exists "membership_insert_self"
  on public.memberships for insert
  with check (auth.uid() = user_id);
```
