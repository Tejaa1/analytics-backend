-- apps table
CREATE TABLE IF NOT EXISTS apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE,
  api_key TEXT NOT NULL UNIQUE,
  revoked BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- events table
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  app_id uuid REFERENCES apps(id),
  event_name TEXT NOT NULL,
  url TEXT,
  referrer TEXT,
  device TEXT,
  ip_address INET,
  user_id TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- indexes
CREATE INDEX IF NOT EXISTS idx_events_app_time ON events (app_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_name_time ON events (event_name, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_events_userid ON events (user_id);
CREATE INDEX IF NOT EXISTS idx_events_metadata_gin ON events USING gin (metadata);

