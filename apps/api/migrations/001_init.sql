CREATE TABLE IF NOT EXISTS users (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL CHECK (length(trim(name)) > 0),
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);
