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

    // Supabase'den en son burç yorumlarını alalım
    try {
      console.log('Querying Supabase for daily horoscopes');
      const { data: horoscopes, error } = await supabase
        .from('daily_horoscopes')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(12);
      
      if (error) {
        console.error('Supabase query error:', error);
        // Tablo yoksa veya erişim hatası olabilir - ama devam et, hata fırlatma
      }
      
      // Son güncelleme tarihini kontrol et
      const lastUpdateDate = horoscopes && horoscopes.length > 0 
        ? new Date(horoscopes[0].updated_at).toISOString().split('T')[0] 
        : null;
      
      // Eğer bugün güncellenmiş yorumlar varsa, hepsini döndürelim
      if (lastUpdateDate === today && horoscopes && horoscopes.length === 12) {
        console.log('Returning cached horoscopes from database');
        return NextResponse.json({ horoscopes });
      }
      
      // Eğer hiç yorum yoksa veya bugün güncellenmemişse, yeni yorumlar oluşturalım
      console.log('Horoscopes not updated today, generating new ones');
      const newHoroscopeContents = await generateAllDailyHoroscopes();
      
      // Veritabanına kaydetmeyi dene, hata olursa loglayıp devam et
      try {
        // Her burç için upsert işlemi gerçekleştirelim (varsa güncelle, yoksa ekle)
        for (const horoscope of newHoroscopeContents) {
          const { error: upsertError } = await supabase
            .from('daily_horoscopes')
            .upsert(
              { 
                sign: horoscope.sign,
                sign_tr: horoscope.sign_tr,
                content: horoscope.content,
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
        const { data: updatedHoroscopes, error: fetchError } = await supabase
          .from('daily_horoscopes')
          .select('*')
          .order('sign');
          
        if (fetchError) {
          console.error('Error fetching updated horoscopes:', fetchError);
          return NextResponse.json({ horoscopes: newHoroscopeContents });
        }
        
        return NextResponse.json({ horoscopes: updatedHoroscopes });
        
      } catch (dbError) {
        console.error('Database operation error:', dbError);
        // Veritabanı hatası olsa bile yorumları döndür
        return NextResponse.json({ horoscopes: newHoroscopeContents });
      }
      
    } catch (supabaseError) {
      console.error('Supabase operation failed:', supabaseError);
      // Supabase hatası durumunda bile yorumları üret ve döndür
      const newHoroscopeContents = await generateAllDailyHoroscopes();
      return NextResponse.json({ 
        horoscopes: newHoroscopeContents,
        message: 'Veritabanına erişilemedi, ancak burç yorumları başarıyla oluşturuldu.'
      });
    }
    
  } catch (error) {
    console.error('API error in daily-horoscopes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily horoscopes', details: String(error) },
      { status: 500 }
    );
  }
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
    
    console.log('CRON job: Generating horoscopes for updating');
    
    // Yeni burç yorumları oluştur
    const newHoroscopeContents = await generateAllDailyHoroscopes();
    
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