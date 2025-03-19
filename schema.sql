-- FortuneAI veritabanı şeması

-- Kullanıcılar Tablosu - Supabase Auth ile otomatik olarak oluşturulur
-- Bu tablo Supabase Auth tarafından yönetilir ve kullanıcı kimlik bilgilerini içerir

-- Kullanıcı Kredileri Tablosu
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL DEFAULT 15,
  last_refresh TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Kredi Kullanımı Tablosu - Kullanıcıların kredi kullanım geçmişini izlemek için
CREATE TABLE credit_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_type VARCHAR(50) NOT NULL, -- 'tarot_reading', 'coffee_reading', 'dream_interpretation', etc.
  usage_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tarot Falı Tablosu
CREATE TABLE tarot_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT,
  cards JSONB NOT NULL, -- Seçilen kartların bilgilerini içerir
  interpretation TEXT NOT NULL, -- Fal yorumu
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE -- Kullanıcının falını herkese açık olarak paylaşıp paylaşmadığı
);

-- Kahve Falı Tablosu
CREATE TABLE coffee_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT, -- Kahve fincanı fotoğrafı (opsiyonel, eğer kullanıcı yüklerse)
  question TEXT,
  interpretation TEXT NOT NULL, -- Fal yorumu
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Rüya Yorumu Tablosu
CREATE TABLE dream_interpretations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dream_description TEXT NOT NULL,
  interpretation TEXT NOT NULL, -- Rüya yorumu
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Burç Bilgileri Tablosu
CREATE TABLE zodiac_signs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  name_tr VARCHAR(50) NOT NULL,
  date_range VARCHAR(50) NOT NULL,
  element VARCHAR(20) NOT NULL, -- Ateş, Toprak, Hava, Su
  symbol VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Burç Yorumları Tablosu - Günlük, haftalık ve aylık yorumlar
CREATE TABLE horoscope_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zodiac_id INTEGER NOT NULL REFERENCES zodiac_signs(id),
  reading_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
  reading_date DATE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(zodiac_id, reading_type, reading_date)
);

-- Kullanıcı Profil Tablosu - Ek profil bilgileri
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  birth_date DATE,
  zodiac_id INTEGER REFERENCES zodiac_signs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Kullanıcı Favori Falları - Kullanıcıların kaydettiği fallar
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_type VARCHAR(50) NOT NULL, -- 'tarot', 'coffee', 'dream', 'horoscope'
  reading_id UUID NOT NULL, -- İlgili fal tablosundaki ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, reading_type, reading_id)
);

-- Bildirimler Tablosu
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies - Veri güvenliği için

-- user_credits için politikalar
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi kredi bilgilerini görebilir" 
  ON user_credits FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Sadece adminler ve kullanıcının kendisi kredi bilgilerini düzenleyebilir" 
  ON user_credits FOR UPDATE 
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- credit_usage için politikalar
ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi kredi kullanım geçmişlerini görebilir" 
  ON credit_usage FOR SELECT 
  USING (auth.uid() = user_id);

-- tarot_readings için politikalar
ALTER TABLE tarot_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi tarot fallarını görebilir" 
  ON tarot_readings FOR SELECT 
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Kullanıcılar kendi tarot fallarını düzenleyebilir" 
  ON tarot_readings FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi tarot fallarını silebilir" 
  ON tarot_readings FOR DELETE 
  USING (auth.uid() = user_id);

-- coffee_readings için politikalar
ALTER TABLE coffee_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi kahve fallarını görebilir" 
  ON coffee_readings FOR SELECT 
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Kullanıcılar kendi kahve fallarını düzenleyebilir" 
  ON coffee_readings FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi kahve fallarını silebilir" 
  ON coffee_readings FOR DELETE 
  USING (auth.uid() = user_id);

-- dream_interpretations için politikalar
ALTER TABLE dream_interpretations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi rüya yorumlarını görebilir" 
  ON dream_interpretations FOR SELECT 
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Kullanıcılar kendi rüya yorumlarını düzenleyebilir" 
  ON dream_interpretations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi rüya yorumlarını silebilir" 
  ON dream_interpretations FOR DELETE 
  USING (auth.uid() = user_id);

-- zodiac_signs için politikalar (herkes görebilir)
ALTER TABLE zodiac_signs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes burç bilgilerini görebilir" 
  ON zodiac_signs FOR SELECT 
  USING (TRUE);

-- horoscope_readings için politikalar (herkes görebilir)
ALTER TABLE horoscope_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes burç yorumlarını görebilir" 
  ON horoscope_readings FOR SELECT 
  USING (TRUE);

-- user_profiles için politikalar
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi profil bilgilerini görebilir" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi profil bilgilerini düzenleyebilir" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- user_favorites için politikalar
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi favori fallarını görebilir" 
  ON user_favorites FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi favori fallarını ekleyebilir" 
  ON user_favorites FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi favori fallarını silebilir" 
  ON user_favorites FOR DELETE 
  USING (auth.uid() = user_id);

-- notifications için politikalar
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi bildirimlerini görebilir" 
  ON notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi bildirimlerini düzenleyebilir (okundu olarak işaretleyebilir)" 
  ON notifications FOR UPDATE 
  USING (auth.uid() = user_id);

-- Burç verilerini ekle
INSERT INTO zodiac_signs (name, name_tr, date_range, element, symbol) VALUES
('Aries', 'Koç', 'March 21 - April 19', 'Fire', 'Ram'),
('Taurus', 'Boğa', 'April 20 - May 20', 'Earth', 'Bull'),
('Gemini', 'İkizler', 'May 21 - June 20', 'Air', 'Twins'),
('Cancer', 'Yengeç', 'June 21 - July 22', 'Water', 'Crab'),
('Leo', 'Aslan', 'July 23 - August 22', 'Fire', 'Lion'),
('Virgo', 'Başak', 'August 23 - September 22', 'Earth', 'Virgin'),
('Libra', 'Terazi', 'September 23 - October 22', 'Air', 'Scales'),
('Scorpio', 'Akrep', 'October 23 - November 21', 'Water', 'Scorpion'),
('Sagittarius', 'Yay', 'November 22 - December 21', 'Fire', 'Archer'),
('Capricorn', 'Oğlak', 'December 22 - January 19', 'Earth', 'Goat'),
('Aquarius', 'Kova', 'January 20 - February 18', 'Air', 'Water Bearer'),
('Pisces', 'Balık', 'February 19 - March 20', 'Water', 'Fish');

-- Fonksiyonlar ve Tetikleyiciler

-- Kullanıcı kaydı sırasında otomatik kredi hesabı oluşturma
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits, last_refresh)
  VALUES (NEW.id, 15, NOW());
  
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Son güncelleme tarihi otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON user_credits
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 