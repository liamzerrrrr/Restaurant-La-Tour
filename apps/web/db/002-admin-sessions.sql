CREATE TABLE admin_sessions (
 token_hash text PRIMARY KEY CHECK(length(token_hash)=64),
 identity_hash text NOT NULL,
 expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX admin_sessions_expiry ON admin_sessions(expires_at);
