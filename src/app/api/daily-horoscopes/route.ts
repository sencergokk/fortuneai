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

// Statik yanıt için headers
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Her saat cache'i temizle (saniye cinsinden)

/**
 * Endpoint - iki farklı mod:
 * 1. cron=true parametre ile çağrıldığında: Yeni burç yorumları oluşturur
 * 2. Normal istek: Veritabanındaki mevcut yorumları döndürür, ASLA yeni içerik oluşturmaz
 */
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/daily-horoscopes - Starting request');
    
    // URL parametresi kontrol et - eğer ?cron=true ise, burç yorumlarını zorla güncelle
    const isCronRequest = req.nextUrl.searchParams.get('cron') === 'true';
    
    // Cache header'ları
    const headers = {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    };
    
    // Normal kullanıcı istekleri için önbellek kullan
    if (!isCronRequest && horoscopeCache && (Date.now() - horoscopeCache.timestamp) < CACHE_TTL) {
      console.log('Returning cached horoscopes from memory');
      return NextResponse.json({ horoscopes: horoscopeCache.data }, { headers });
    }
    
    // Supabase bağlantısı kur
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

    // Bugünün tarihi
    const currentDate = new Date().toISOString().split('T')[0];

    // CRON JOB İŞLEMİ - Sadece cron=true parametresi ile çağrıldığında
    if (isCronRequest) {
      console.log('Cron job request detected - generating new horoscopes');
      
      try {
        // Tüm burçlar için yeni yorumlar oluştur
        const newHoroscopes = await generateAllDailyHoroscopes();
        
        // Toplu güncelleme için promises dizisi
        const updatePromises = newHoroscopes.map(horoscope => 
          supabase
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
            )
        );
        
        // Tüm güncellemeleri paralel olarak çalıştır
        const results = await Promise.allSettled(updatePromises);
        
        // Hataları kontrol et
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(`Error updating horoscope for ${newHoroscopes[index].sign}:`, result.reason);
          }
        });
        
        // Önbelleği temizle
        horoscopeCache = null;
        
        console.log('Successfully generated and updated horoscopes via cron job');
        
        return NextResponse.json({ 
          success: true, 
          message: 'Daily horoscopes updated successfully',
          updated: currentDate
        });
      } catch (error) {
        console.error('Error in cron job:', error);
        return NextResponse.json(
          { error: 'Failed to update horoscopes via cron job' }, 
          { status: 500 }
        );
      }
    }

    // VERİTABANINDAN MEVCUT YORUMLARI AL
    console.log('Querying Supabase for daily horoscopes');
    const { data: horoscopes, error } = await supabase
      .from('daily_horoscopes')
      .select('sign, sign_tr, content, date, updated_at')
      .order('sign');
    
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      );
    }
    
    // Eğer veritabanında kayıt bulamazsak (ilk kurulum), yeni içerik oluştur
    if (!horoscopes || horoscopes.length < 12) {
      console.log('First time setup: No horoscopes found in database, generating initial set');
      const initialHoroscopes = await generateAllDailyHoroscopes();
      
      // Veritabanına kaydet
      for (const horoscope of initialHoroscopes) {
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
        data: initialHoroscopes
      };
      
      return NextResponse.json({ horoscopes: initialHoroscopes }, { headers });
    }
    
    // Veritabanında burç yorumları bulundu, bunları önbelleğe al ve döndür
    horoscopeCache = {
      timestamp: Date.now(),
      data: horoscopes
    };
    
    return NextResponse.json({ horoscopes }, { headers });
  } catch (error) {
    console.error('Unexpected error in daily-horoscopes API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Tüm burçlar için günlük yorumları oluştur
async function generateAllDailyHoroscopes() {
  try {
    console.log('Generating horoscopes for all zodiac signs in a single API call');
    
    // API anahtarı kontrol - debugging için
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is missing or empty');
      throw new Error('Missing OpenAI API key');
    } else {
      console.log('OpenAI API key is configured');
    }
    
    // Tüm burçları tek bir sistem promptu ile oluştur
    const systemPrompt = `Sen deneyimli ve profesyonel bir astrologsun. Günlük burç yorumları yapıyorsun. 
Yorumların mistik, içgörü dolu ve kişiselleştirilmiş olmalı. Aynı zamanda pozitif, motive edici ve gerçekçi olmalı. Yorumlarını gerçekten iyi analiz ederek hazırla.

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
  const systemPrompt = `Sen deneyimli ve profesyonel bir astrologsun. Günlük burç yorumları yapıyorsun. 
Yorumların mistik, içgörü dolu ve kişiselleştirilmiş olmalı. Aynı zamanda pozitif, motive edici ve gerçekçi olmalı. Yorumlarını gerçekten iyi analiz ederek hazırla.

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