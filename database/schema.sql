CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_token_hash TEXT,
  verification_expires_at TIMESTAMPTZ,
  reset_token_hash TEXT,
  reset_expires_at TIMESTAMPTZ,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_verification_token_hash
  ON users (verification_token_hash);

CREATE INDEX idx_users_reset_token_hash
  ON users (reset_token_hash);

CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id),
  name VARCHAR(150) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES businesses(id),
  name VARCHAR(150) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE availability (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES businesses(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  UNIQUE (business_id, day_of_week)
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id),
  business_id INTEGER NOT NULL REFERENCES businesses(id),
  service_id INTEGER NOT NULL REFERENCES services(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT NOW(),
  CHECK (end_time > start_time),
  CONSTRAINT no_overlapping_bookings
    EXCLUDE USING gist (
      business_id WITH =,
      tsrange(start_time, end_time) WITH &&
    ) WHERE (status <> 'cancelled')
);