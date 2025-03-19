ALTER TABLE daily_horoscopes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_horoscopes_sign ON daily_horoscopes(sign);

WITH latest_horoscopes AS (
  SELECT DISTINCT ON (sign) 
    id, 
    sign, 
    sign_tr, 
    content, 
    NOW() as updated_at
  FROM 
    daily_horoscopes
  ORDER BY 
    sign, date DESC
)
DELETE FROM daily_horoscopes
WHERE id NOT IN (SELECT id FROM latest_horoscopes);

ALTER TABLE daily_horoscopes DROP CONSTRAINT IF EXISTS daily_horoscopes_pkey;
ALTER TABLE daily_horoscopes ADD PRIMARY KEY (sign);
