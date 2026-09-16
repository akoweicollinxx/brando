-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- These tables extend the existing brand_projects table.

-- 1. Landing Pages
create table if not exists landing_pages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references brand_projects(id) on delete cascade,
  slug text unique not null,
  content jsonb not null,
  published boolean default false,
  custom_domain text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Leads / CRM
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references brand_projects(id) on delete cascade,
  name text,
  email text not null,
  phone text,
  source text default 'landing_page',
  status text default 'new',
  notes text,
  created_at timestamptz default now()
);

-- 3. Email Sequences
create table if not exists email_sequences (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references brand_projects(id) on delete cascade,
  emails jsonb not null default '[]',
  active boolean default true,
  created_at timestamptz default now()
);

-- 4. Content Posts
create table if not exists content_posts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references brand_projects(id) on delete cascade,
  platform text,
  content text,
  scheduled_at timestamptz,
  status text default 'draft',
  created_at timestamptz default now()
);

-- 5. Page Visits
create table if not exists page_visits (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references brand_projects(id) on delete cascade,
  visitor_id text,
  referrer text,
  created_at timestamptz default now()
);

-- 6. Traction Metrics (daily snapshots)
create table if not exists traction_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references brand_projects(id) on delete cascade,
  traffic int default 0,
  leads int default 0,
  conversion_rate numeric default 0,
  followers int default 0,
  revenue numeric default 0,
  created_at timestamptz default now()
);
