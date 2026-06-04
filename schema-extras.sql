-- ============================================================
-- RentCircle — Additional Schema (run after schema.sql)
-- ============================================================

-- Payment logs table
CREATE TABLE IF NOT EXISTS payment_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reference       TEXT UNIQUE NOT NULL,
  amount          INT NOT NULL,
  currency        TEXT DEFAULT 'NGN',
  type            TEXT NOT NULL CHECK (type IN ('premium','verification','boost')),
  listing_id      UUID REFERENCES listings(id) ON DELETE SET NULL,
  status          TEXT DEFAULT 'success' CHECK (status IN ('success','failed','refunded')),
  paystack_data   JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Premium expiry columns
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ DEFAULT NOW();

-- Boost expiry on listings
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS boost_expires_at TIMESTAMPTZ;

-- Increment listing views (safe, no race condition)
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE listings SET views = views + 1 WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Full-text search function for listings
CREATE OR REPLACE FUNCTION search_listings(
  search_query TEXT,
  p_state TEXT DEFAULT NULL,
  p_area TEXT DEFAULT NULL,
  p_min_rent INT DEFAULT NULL,
  p_max_rent INT DEFAULT NULL,
  p_verified_only BOOLEAN DEFAULT FALSE,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE(
  id UUID, title TEXT, rent_amount INT, location JSONB,
  amenities TEXT[], property_type TEXT, is_verified BOOLEAN,
  photos TEXT[], created_at TIMESTAMPTZ, rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id, l.title, l.rent_amount, l.location,
    l.amenities, l.property_type, l.is_verified,
    l.photos, l.created_at,
    ts_rank(
      to_tsvector('english', l.title || ' ' || COALESCE(l.description, '')),
      plainto_tsquery('english', search_query)
    ) AS rank
  FROM listings l
  WHERE
    l.is_active = TRUE
    AND (search_query IS NULL OR search_query = '' OR
      to_tsvector('english', l.title || ' ' || COALESCE(l.description, ''))
      @@ plainto_tsquery('english', search_query))
    AND (p_state IS NULL OR l.location->>'state' = p_state)
    AND (p_area IS NULL OR l.location->>'area' = p_area)
    AND (p_min_rent IS NULL OR l.rent_amount >= p_min_rent)
    AND (p_max_rent IS NULL OR l.rent_amount <= p_max_rent)
    AND (NOT p_verified_only OR l.is_verified = TRUE)
  ORDER BY
    l.is_featured DESC,
    rank DESC,
    l.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Auto-expire premium subscriptions
CREATE OR REPLACE FUNCTION expire_premium()
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET is_premium = FALSE
  WHERE is_premium = TRUE
    AND premium_expires_at IS NOT NULL
    AND premium_expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Auto-expire featured listings
CREATE OR REPLACE FUNCTION expire_boosts()
RETURNS VOID AS $$
BEGIN
  UPDATE listings
  SET is_featured = FALSE
  WHERE is_featured = TRUE
    AND boost_expires_at IS NOT NULL
    AND boost_expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule expiry (requires pg_cron extension, or call from cron job)
-- SELECT cron.schedule('expire-premium', '0 * * * *', $$SELECT expire_premium()$$);
-- SELECT cron.schedule('expire-boosts', '0 * * * *', $$SELECT expire_boosts()$$);

-- Mutual match trigger: when both users like each other, update status
CREATE OR REPLACE FUNCTION check_mutual_match()
RETURNS TRIGGER AS $$
DECLARE
  other_action TEXT;
BEGIN
  -- Check if the other user already liked us
  SELECT user_a_action INTO other_action
  FROM matches
  WHERE user_a = NEW.user_b AND user_b = NEW.user_a;

  IF other_action IN ('like', 'super-like') AND NEW.user_a_action IN ('like', 'super-like') THEN
    -- Update both records to 'matched'
    UPDATE matches SET status = 'matched'
    WHERE (user_a = NEW.user_a AND user_b = NEW.user_b)
       OR (user_a = NEW.user_b AND user_b = NEW.user_a);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_mutual_match
  AFTER INSERT OR UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION check_mutual_match();

-- Conversation unread count view
CREATE OR REPLACE VIEW conversation_summaries AS
SELECT
  c.id,
  c.participant_a,
  c.participant_b,
  c.last_message,
  c.last_message_at,
  COUNT(m.id) FILTER (WHERE m.read_at IS NULL AND m.sender_id != c.participant_a) AS unread_for_a,
  COUNT(m.id) FILTER (WHERE m.read_at IS NULL AND m.sender_id != c.participant_b) AS unread_for_b
FROM conversations c
LEFT JOIN messages m ON m.conversation_id = c.id
GROUP BY c.id, c.participant_a, c.participant_b, c.last_message, c.last_message_at;

-- RLS on payment logs
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payment_logs_own" ON payment_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payment_logs_insert" ON payment_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
