-- ============================================================
-- RentCircle Database Schema — Supabase PostgreSQL
-- Run in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy text search

-- ── USERS / PROFILES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name         TEXT NOT NULL,
  email             TEXT,
  phone             TEXT,
  age               INT CHECK (age >= 18 AND age <= 80),
  gender            TEXT CHECK (gender IN ('male','female','non-binary','prefer-not-to-say')),
  occupation        TEXT,
  school_or_company TEXT,
  bio               TEXT,
  avatar_url        TEXT,
  preferred_areas   TEXT[] DEFAULT '{}',
  budget_min        INT DEFAULT 0,
  budget_max        INT DEFAULT 0,
  lifestyle         JSONB DEFAULT '{}',
  is_verified       BOOLEAN DEFAULT FALSE,
  verification_level INT DEFAULT 0 CHECK (verification_level BETWEEN 0 AND 3),
  is_premium        BOOLEAN DEFAULT FALSE,
  is_active         BOOLEAN DEFAULT TRUE,
  last_seen         TIMESTAMPTZ DEFAULT NOW(),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── LISTINGS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  property_type   TEXT CHECK (property_type IN ('room','flat','apartment','duplex','bungalow')),
  listing_type    TEXT CHECK (listing_type IN ('room-available','looking-for-roommate','full-apartment')),
  rent_amount     INT NOT NULL,
  rent_period     TEXT DEFAULT 'monthly' CHECK (rent_period IN ('monthly','yearly')),
  caution_fee     INT,
  service_charge  INT,
  location        JSONB NOT NULL DEFAULT '{}',
  amenities       TEXT[] DEFAULT '{}',
  house_rules     TEXT[] DEFAULT '{}',
  photos          TEXT[] DEFAULT '{}',
  spots_available INT DEFAULT 1,
  gender_preference TEXT CHECK (gender_preference IN ('male','female','any')),
  is_verified     BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  is_featured     BOOLEAN DEFAULT FALSE,
  views           INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── MATCHES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS matches (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_a_action        TEXT CHECK (user_a_action IN ('like','pass','super-like')),
  user_b_action        TEXT CHECK (user_b_action IN ('like','pass','super-like')),
  compatibility_score  INT DEFAULT 0,
  status               TEXT DEFAULT 'pending' CHECK (status IN ('pending','matched','declined')),
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_a, user_b)
);

-- ── CONVERSATIONS & MESSAGES ──────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_a UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_b UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_a, participant_b)
);

CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  type            TEXT DEFAULT 'text' CHECK (type IN ('text','image','voice')),
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── GROUPS (Group Renting) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS rent_groups (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  description       TEXT,
  creator_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_area       TEXT,
  budget_per_person INT NOT NULL,
  max_members       INT DEFAULT 4 CHECK (max_members BETWEEN 2 AND 10),
  status            TEXT DEFAULT 'forming' CHECK (status IN ('forming','searching','found','closed')),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID NOT NULL REFERENCES rent_groups(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- ── SAVED LISTINGS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_listings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- ── REVIEWS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id     UUID REFERENCES listings(id) ON DELETE CASCADE,
  rating         INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  honesty        INT CHECK (honesty BETWEEN 1 AND 5),
  cleanliness    INT CHECK (cleanliness BETWEEN 1 AND 5),
  responsiveness INT CHECK (responsiveness BETWEEN 1 AND 5),
  safety         INT CHECK (safety BETWEEN 1 AND 5),
  comment        TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── REPORTS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_user UUID REFERENCES profiles(id) ON DELETE SET NULL,
  target_listing UUID REFERENCES listings(id) ON DELETE SET NULL,
  reason      TEXT NOT NULL,
  description TEXT,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewed','resolved','dismissed')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── VERIFICATION REQUESTS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS verification_requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('email','phone','id','address')),
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  document_url TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- ── NOTIFICATIONS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  data       JSONB DEFAULT '{}',
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── INDEXES ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_listings_owner ON listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_active ON listings(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings USING GIN(location);
CREATE INDEX IF NOT EXISTS idx_listings_amenities ON listings USING GIN(amenities);
CREATE INDEX IF NOT EXISTS idx_listings_rent ON listings(rent_amount);
CREATE INDEX IF NOT EXISTS idx_messages_convo ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_matches_users ON matches(user_a, user_b);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_profiles_areas ON profiles USING GIN(preferred_areas);
CREATE INDEX IF NOT EXISTS idx_listings_title_trgm ON listings USING GIN(title gin_trgm_ops);

-- ── UPDATED_AT TRIGGER ────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_groups_updated_at BEFORE UPDATE ON rent_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── ROW LEVEL SECURITY ────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_own_write" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_own_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Listings: public read, owner write
CREATE POLICY "listings_public_read" ON listings FOR SELECT USING (is_active = TRUE);
CREATE POLICY "listings_owner_insert" ON listings FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "listings_owner_update" ON listings FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "listings_owner_delete" ON listings FOR DELETE USING (auth.uid() = owner_id);

-- Matches: participants only
CREATE POLICY "matches_participants" ON matches FOR ALL USING (auth.uid() IN (user_a, user_b));

-- Conversations: participants only
CREATE POLICY "conversations_participants" ON conversations FOR ALL USING (auth.uid() IN (participant_a, participant_b));

-- Messages: conversation participants only
CREATE POLICY "messages_participants" ON messages FOR ALL
  USING (EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = conversation_id AND auth.uid() IN (c.participant_a, c.participant_b)
  ));

-- Saved listings: own only
CREATE POLICY "saved_own" ON saved_listings FOR ALL USING (auth.uid() = user_id);

-- Notifications: own only
CREATE POLICY "notifications_own" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Groups: public read, member write
CREATE POLICY "groups_public_read" ON rent_groups FOR SELECT USING (TRUE);
CREATE POLICY "groups_creator_write" ON rent_groups FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "groups_creator_update" ON rent_groups FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "group_members_read" ON group_members FOR SELECT USING (TRUE);
CREATE POLICY "group_members_join" ON group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "group_members_leave" ON group_members FOR DELETE USING (auth.uid() = user_id);

-- ── REALTIME ─────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;

-- ── STORAGE BUCKETS ──────────────────────────────────────────
-- Run these in Supabase Storage UI or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('listing-photos', 'listing-photos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('verification-docs', 'verification-docs', false);
