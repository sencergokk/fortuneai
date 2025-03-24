import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
interface CacheEntry {
  timestamp: number;
  data: any[];
}
let horoscopeCache: CacheEntry | null = null;
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 saat (milisaniye cinsinden)

// GET isteği ile tüm günlük burç yorumlarını alalım
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/daily-horoscopes - Starting request');
    
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    // Bugünün tarihini alalım (YYYY-MM-DD formatında)
    const today = new Date().toISOString().split('T')[0];
    console.log('Today date:', today);
    
    // Önbellekte veri var mı kontrol et
    if (horoscopeCache && (Date.now() - horoscopeCache.timestamp) < CACHE_TTL) {
      console.log('Returning cached horoscopes from memory');
      return NextResponse.json({ horoscopes: horoscopeCache.data });
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
        // Tablo yoksa veya erişim hatası olabilir - ama devam et, hata fırlatma
      }
      
      // Eğer yeterli sayıda güncel burç yorumu varsa, bunları döndür
      if (horoscopes && horoscopes.length === 12) {
        // Bugünün tarihine bakarak ne zaman güncellenmiş olduğunu kontrol et
        const lastUpdateDate = new Date(horoscopes[0].updated_at).toISOString().split('T')[0];
        
        if (lastUpdateDate === today) {
          console.log('Returning today\'s horoscopes from database');
          // Önbelleğe kaydet
          horoscopeCache = {
            timestamp: Date.now(),
            data: horoscopes
          };
          return NextResponse.json({ horoscopes });
        }
        
        // Bu noktaya geldiyse, yorumlar güncel değil demektir - güncellememiz gerekiyor
        console.log('Horoscopes not updated today, updating from database');
      }
      
      // Veritabanındaki yorumları güncelleyelim
      try {
        // Tüm burçlar için yorum oluşturmak yerine, önce mevcut yorumları alalım
        // Sadece içeriği güncelleyelim, böylece API çağrısı yapmaya gerek kalmaz
        const updatedHoroscopes = horoscopes && horoscopes.length > 0 
          ? await updateExistingHoroscopes(horoscopes)
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
                date: today,
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
        
        console.log('Successfully updated horoscopes in database');
        
        // Güncellenmiş yorumları alalım
        const { data: updatedDbHoroscopes, error: fetchError } = await supabase
          .from('daily_horoscopes')
          .select('*')
          .order('sign');
          
        if (fetchError) {
          console.error('Error fetching updated horoscopes:', fetchError);
          // Önbelleğe kaydedelim
          horoscopeCache = {
            timestamp: Date.now(),
            data: updatedHoroscopes
          };
          return NextResponse.json({ horoscopes: updatedHoroscopes });
        }
        
        // Önbelleğe kaydedelim
        horoscopeCache = {
          timestamp: Date.now(),
          data: updatedDbHoroscopes
        };
        return NextResponse.json({ horoscopes: updatedDbHoroscopes });
        
      } catch (dbError) {
        console.error('Database operation error:', dbError);
        // Veritabanı hatası olsa bile yorumları döndür
        if (horoscopes && horoscopes.length === 12) {
          // Önbelleğe kaydedelim
          horoscopeCache = {
            timestamp: Date.now(),
            data: horoscopes
          };
          return NextResponse.json({ horoscopes });
        }
        
        // Yoksa yeni yorumlar oluştur
        const newHoroscopes = await generateAllDailyHoroscopes();
        // Önbelleğe kaydedelim
        horoscopeCache = {
          timestamp: Date.now(),
          data: newHoroscopes
        };
        return NextResponse.json({ horoscopes: newHoroscopes });
      }
      
    } catch (supabaseError) {
      console.error('Supabase operation failed:', supabaseError);
      // Supabase hatası durumunda bile yorumları üret ve döndür
      
      // Önbellekte veri varsa kullan
      if (horoscopeCache) {
        console.log('Using cached horoscopes due to Supabase error');
        return NextResponse.json({ 
          horoscopes: horoscopeCache.data,
          message: 'Veritabanına erişilemedi, önbellekten alınan burç yorumları gösteriliyor.'
        });
      }
      
      // Yoksa yeni yorumlar oluştur
      const newHoroscopeContents = await generateAllDailyHoroscopes();
      // Önbelleğe kaydedelim
      horoscopeCache = {
        timestamp: Date.now(),
        data: newHoroscopeContents
      };
      return NextResponse.json({ 
        horoscopes: newHoroscopeContents,
        message: 'Veritabanına erişilemedi, ancak burç yorumları başarıyla oluşturuldu.'
      });
    }
    
  } catch (error) {
    console.error('API error in daily-horoscopes:', error);
    
    // Önbellekte veri varsa kullan
    if (horoscopeCache) {
      console.log('Using cached horoscopes due to general error');
      return NextResponse.json({ 
        horoscopes: horoscopeCache.data,
        message: 'Bir hata oluştu, önbellekten alınan burç yorumları gösteriliyor.'
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch daily horoscopes', details: String(error) },
      { status: 500 }
    );
  }
}

// Mevcut burç yorumlarını güncelle - yeni yorum oluşturmadan
async function updateExistingHoroscopes(existingHoroscopes: any[]) {
  console.log('Updating existing horoscopes without API call');
  const today = new Date();
  const updatedHoroscopes = [];
  
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
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );
    
    const today = new Date().toISOString().split('T')[0];
    console.log('CRON job: Generating horoscopes for updating');
    
    // Önce mevcut burç yorumlarını alalım
    const { data: existingHoroscopes, error: fetchError } = await supabase
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