-- Run this against your Neon database (neondb_owner role).
-- The neon_auth schema is managed by Neon Auth — do not modify it.

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id          TEXT PRIMARY KEY,
  role        TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('owner', 'client')),
  client_id   UUID,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clients (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  shop_domain  TEXT,
  email        TEXT UNIQUE NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.client_invites (
  email      TEXT PRIMARY KEY,
  client_id  UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS public.posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT UNIQUE NOT NULL,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  published  BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.form_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT,
  email      TEXT,
  message    TEXT,
  read       BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.experiments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id  UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  hypothesis TEXT,
  status     TEXT DEFAULT 'running' CHECK (status IN ('running', 'won', 'lost', 'paused')),
  result     TEXT,
  uplift     NUMERIC(6,2),
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at   TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.cro_metrics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  recorded_at   DATE NOT NULL,
  cvr           NUMERIC(5,2),
  aov           NUMERIC(10,2),
  revenue_lift  NUMERIC(10,2),
  UNIQUE(client_id, recorded_at)
);

CREATE TABLE IF NOT EXISTS public.reports (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_profiles
  ADD CONSTRAINT fk_client
  FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

ALTER TABLE public.client_invites
  ADD CONSTRAINT fk_invite_client
  FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;
