import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CookieOptions } from '@supabase/ssr';

// Define interfaces for better type safety
interface Horoscope {
  sign: string;
  sign_tr: string;
  content: string;
  date?: string;
  updated_at?: string;
}

interface CacheEntry {
  timestamp: number;
  data: Horoscope[];
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing environment variable: OPENAI_API_KEY');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const zodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer', 
  'leo', 'virgo', 'libra', 'scorpio', 
  'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const zodiacSignsTR = [
  'koç', 'boğa', 'ikizler', 'yengeç', 
  'aslan', 'başak', 'terazi', 'akrep', 
  'yay', 'oğlak', 'kova', 'balık'
];

// Önbellek değişkeni - sadece sunucu bellektedir, sunucu yeniden başlatıldığında sıfırlanır
let horoscopeCache: CacheEntry | null = null;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 saat (milisaniye cinsinden)

// Otomatik güncelleme için son tarih kaydı
let lastUpdateDate: string | null = null;

/**
 * Cron endpoint - Bu endpoint Vercel cron jobs tarafından 24 saatte bir tetiklenecek
 * Burç yorumlarını otomatik olarak güncelleyecek
 */
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/daily-horoscopes - Starting request');
    
    // URL parametresi kontrol et - eğer ?cron=true ise, burç yorumlarını zorla güncelle
    const isCronRequest = req.nextUrl.searchParams.get('cron') === 'true';
    
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    // Önbellekte veri var mı kontrol et - cron isteği değilse önbelleği kullan
    if (!isCronRequest && horoscopeCache && (Date.now() - horoscopeCache.timestamp) < CACHE_TTL) {
      console.log('Returning cached horoscopes from memory');
      return NextResponse.json({ horoscopes: horoscopeCache.data });
    }

    // Bugünün tarihi
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Cron için veya bugün zaten güncelleme yapılmadıysa güncelleme yapalım
    if (isCronRequest || lastUpdateDate !== currentDate) {
      console.log('Updating daily horoscopes due to cron request or new day');
      
      try {
        // Mevcut horoscope verilerini çekelim
        const { data: existingHoroscopes, error } = await supabase
          .from('daily_horoscopes')
          .select('*')
          .order('sign');
        
        if (error) {
          console.error('Supabase query error:', error);
          return NextResponse.json(
            { error: 'Database query failed' },
            { status: 500 }
          );
        }
        
        // Tüm burçlar için yeni yorumlar oluşturalım
        const updatedHoroscopes = existingHoroscopes && existingHoroscopes.length > 0 
          ? await updateExistingHoroscopes(existingHoroscopes)
          : await generateAllDailyHoroscopes();
        
        // Her burç için upsert işlemi gerçekleştirelim
        for (const horoscope of updatedHoroscopes) {
          const { error: upsertError } = await supabase
            .from('daily_horoscopes')
            .upsert(
              { 
                sign: horoscope.sign,
                sign_tr: horoscope.sign_tr,
                content: horoscope.content,
                date: currentDate,
                updated_at: new Date().toISOString()
              },
              { 
                onConflict: 'sign',
                ignoreDuplicates: false
              }
            );
            
          if (upsertError) {
            console.error(`Error updating horoscope for ${horoscope.sign}:`, upsertError);
          }
        }
        
        // Son güncelleme tarihini ayarla
        lastUpdateDate = currentDate;
        
        // Önbelleği temizle, yeni verilerle doldurulacak
        horoscopeCache = null;
        
        console.log('Successfully updated horoscopes in database');
        
        // Eğer cron isteğiyse, başarılı yanıt döndür
        if (isCronRequest) {
          return NextResponse.json({ 
            success: true, 
            message: 'Daily horoscopes updated successfully',
            updated: currentDate
          });
        }
      } catch (updateError) {
        console.error('Error updating horoscopes:', updateError);
        
        // Eğer cron isteğiyse, hata yanıtı döndür
        if (isCronRequest) {
          return NextResponse.json(
            { error: 'Failed to update horoscopes' }, 
            { status: 500 }
          );
        }
        // Normal GET isteği için, devam et ve veritabanındaki verileri döndür
      }
    }

    // Supabase'den en son burç yorumlarını alalım
    try {
      console.log('Querying Supabase for daily horoscopes');
      const { data: horoscopes, error } = await supabase
        .from('daily_horoscopes')
        .select('*')
        .order('sign');
      
      if (error) {
        console.error('Supabase query error:', error);
        return NextResponse.json(
          { error: 'Database query failed' },
          { status: 500 }
        );
      }
      
      // Eğer yeterli sayıda burç yorumu varsa, bunları döndür
      if (horoscopes && horoscopes.length === 12) {
        // Önbelleğe kaydet
        horoscopeCache = {
          timestamp: Date.now(),
          data: horoscopes
        };
        return NextResponse.json({ horoscopes });
      } else {
        // Yeterli veri yoksa, yeni veriler oluştur
        const newHoroscopes = await generateAllDailyHoroscopes();
        
        // Her burç için upsert işlemi gerçekleştirelim
        for (const horoscope of newHoroscopes) {
          await supabase
            .from('daily_horoscopes')
            .upsert(
              { 
                sign: horoscope.sign,
                sign_tr: horoscope.sign_tr,
                content: horoscope.content,
                date: currentDate,
                updated_at: new Date().toISOString()
              },
              { 
                onConflict: 'sign',
                ignoreDuplicates: false
              }
            );
        }
        
        // Önbelleğe kaydet
        horoscopeCache = {
          timestamp: Date.now(),
          data: newHoroscopes
        };
        
        return NextResponse.json({ horoscopes: newHoroscopes });
      }
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      
      // Veritabanı hatası durumunda bile yorumları üret ve döndür
      const newHoroscopes = await generateAllDailyHoroscopes();
      
      // Önbelleğe kaydet
      horoscopeCache = {
        timestamp: Date.now(),
        data: newHoroscopes
      };
      
      return NextResponse.json({ 
        horoscopes: newHoroscopes,
        message: 'Veritabanına erişilemedi, ancak burç yorumları başarıyla oluşturuldu.'
      });
    }
  } catch (error) {
    console.error('Unexpected error in daily-horoscopes API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mevcut burç yorumlarını güncelle - yeni yorum oluşturmadan
async function updateExistingHoroscopes(existingHoroscopes: Horoscope[]): Promise<Horoscope[]> {
  console.log('Updating existing horoscopes without API call');
  const updatedHoroscopes: Horoscope[] = [];
  
  for (const horoscope of existingHoroscopes) {
    // Her horoscopun içeriğini çok az değiştir (tarih güncellemesi gibi)
    const content = horoscope.content
      .replace(/bugün/g, "bugün")
      .replace(/bu gün/g, "bugün")
      .replace(/yarın/g, "bugün");
      
    updatedHoroscopes.push({
      sign: horoscope.sign,
      sign_tr: horoscope.sign_tr,
      content: content
    });
  }
  
  return updatedHoroscopes;
}

// CRON tarafından çağrılacak POST endpoint'i - otomatik güncelleme için
export async function POST(req: NextRequest) {
  try {
    // API anahtarını kontrol et - güvenlik için
    const authHeader = req.headers.get('authorization');
    const apiKey = process.env.CRON_SECRET_KEY;
    
    if (!apiKey || authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );
    
    const today = new Date().toISOString().split('T')[0];
    console.log('CRON job: Generating horoscopes for updating');
    
    // Önce mevcut burç yorumlarını alalım
    const { data: existingHoroscopes } = await supabase
      .from('daily_horoscopes')
      .select('*')
      .order('sign');
    
    // Mevcut burç yorumlarını güncelleyelim veya yenilerini oluşturalım
    const newHoroscopeContents = existingHoroscopes && existingHoroscopes.length === 12
      ? await updateExistingHoroscopes(existingHoroscopes)
      : await generateAllDailyHoroscopes();
    
    // Her burç için upsert işlemi gerçekleştirelim
    let successCount = 0;
    for (const horoscope of newHoroscopeContents) {
      const { error: upsertError } = await supabase
        .from('daily_horoscopes')
        .upsert(
          { 
            sign: horoscope.sign,
            sign_tr: horoscope.sign_tr,
            content: horoscope.content,
            date: today,
            updated_at: new Date().toISOString()
          },
          { 
            onConflict: 'sign',
            ignoreDuplicates: false
          }
        );
        
      if (upsertError) {
        console.error(`CRON job: Error updating horoscope for ${horoscope.sign}:`, upsertError);
      } else {
        successCount++;
      }
    }
    
    // Güncellenmiş burç yorumlarını alalım
    const { data: updatedHoroscopes } = await supabase
      .from('daily_horoscopes')
      .select('*')
      .order('sign');
    
    // Önbelleği güncelle
    if (updatedHoroscopes && updatedHoroscopes.length === 12) {
      horoscopeCache = {
        timestamp: Date.now(),
        data: updatedHoroscopes
      };
      console.log('CRON job: Updated memory cache');
    }
    
    console.log(`CRON job: Successfully updated ${successCount} daily horoscopes`);
    return NextResponse.json({ 
      success: true, 
      message: 'Daily horoscopes updated successfully',
      count: successCount
    });
    
  } catch (error) {
    console.error('CRON job error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update daily horoscopes',
      details: String(error)
    }, { status: 500 });
  }
}

// Tüm burçlar için günlük yorumları oluştur
async function generateAllDailyHoroscopes() {
  try {
    console.log('Generating horoscopes for all zodiac signs in a single API call');
    
    // Tüm burçları tek bir sistem promptu ile oluştur
    const systemPrompt = `Sen deneyimli bir astrologsun. Günlük burç yorumları yapıyorsun. 
Yorumların mistik, içgörü dolu ve kişiselleştirilmiş olmalı. Aynı zamanda pozitif ve motive edici olmalı.

ÖNEMLİ: Yanıtını sadece Türkçe olarak ver.`;

    const userPrompt = `Tüm 12 zodyak burcu için günlük burç yorumları oluştur:
Koç (Aries), Boğa (Taurus), İkizler (Gemini), Yengeç (Cancer), 
Aslan (Leo), Başak (Virgo), Terazi (Libra), Akrep (Scorpio), 
Yay (Sagittarius), Oğlak (Capricorn), Kova (Aquarius), Balık (Pisces).

Her burç yorumu aşk, kariyer ve kişisel gelişim hakkında içgörüler sunmalı ve yaklaşık 150 kelime olmalı.
Cevabını JSON formatında yapılandır, böylece kolayca parse edilebilir olsun.

Örnek:
{
  "aries": "Koç burcu yorumu...",
  "taurus": "Boğa burcu yorumu...",
  "gemini": "İkizler burcu yorumu...",
  ...
}`;

    // API çağrısı
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // API sonuçlarını işle
    const responseContent = completion.choices[0].message.content;
    console.log('Received API response, processing JSON');
    
    if (!responseContent) {
      throw new Error('Empty response from OpenAI API');
    }
    
    let horoscopeData;
    try {
      horoscopeData = JSON.parse(responseContent);
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      console.log('Raw response:', responseContent);
      throw new Error('Invalid JSON response from OpenAI API');
    }
    
    // JSON verisini işleyerek tüm burçları ekle
    const horoscopes = [];
    
    for (let i = 0; i < zodiacSigns.length; i++) {
      const sign = zodiacSigns[i];
      const signTR = zodiacSignsTR[i];
      
      // Burç yorumunu al
      const content = horoscopeData[sign];
      
      if (content) {
        horoscopes.push({
          sign: sign,
          sign_tr: signTR,
          content: content
        });
      } else {
        console.error(`Missing horoscope content for ${sign}`);
      }
    }
    
    console.log(`Successfully generated ${horoscopes.length} horoscopes`);
    return horoscopes;
    
  } catch (error) {
    console.error('Error generating horoscopes:', error);
    
    // Hata durumunda, burçları tek tek oluşturarak geri dönelim
    console.log('Falling back to individual horoscope generation');
    
    const horoscopes = [];
    for (let i = 0; i < zodiacSigns.length; i++) {
      const sign = zodiacSigns[i];
      const signTR = zodiacSignsTR[i];
      
      try {
        // Her burç için ayrı bir istek yap
        const horoscope = await generateHoroscope(sign);
        
        horoscopes.push({
          sign: sign,
          sign_tr: signTR,
          content: horoscope
        });
      } catch (innerError) {
        console.error(`Error generating horoscope for ${sign}:`, innerError);
        // Hata durumunda varsayılan bir mesaj koy
        horoscopes.push({
          sign: sign,
          sign_tr: signTR,
          content: `${signTR} burcu için günlük yorum yüklenemedi. Lütfen daha sonra tekrar deneyin.`
        });
      }
    }
    
    return horoscopes;
  }
}

// Tek bir burç için yorum oluştur (OpenAI API kullanarak)
async function generateHoroscope(sign: string) {
  const systemPrompt = `Sen deneyimli bir astrologsun. Günlük burç yorumları yapıyorsun. Yorumların mistik, içgörü dolu ve kişiselleştirilmiş olmalı. Aynı zamanda pozitif ve motive edici olmalı.

ÖNEMLİ: Yanıtını sadece Türkçe olarak ver.`;

  const userPrompt = `${sign} burcu için bugünün günlük burç yorumunu yap. Aşk, kariyer ve kişisel gelişim hakkında içgörüler sun. Yaklaşık 150 kelime olsun.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: userPrompt
      }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
} 