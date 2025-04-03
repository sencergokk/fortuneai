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

// Cache variable - exists only in server memory, resets when server restarts
let horoscopeCache: CacheEntry | null = null;
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours (in milliseconds) - reduced from 24 hours

// Ensure dynamic response
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable cache completely for this endpoint

/**
 * Endpoint - two different modes:
 * 1. When called with cron=true parameter: Generates new horoscope content
 * 2. Normal request: Returns existing horoscopes from database, NEVER generates new content
 */
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/daily-horoscopes - Starting request');
    
    // Check URL parameter - if ?cron=true, force update horoscopes
    const isCronRequest = req.nextUrl.searchParams.get('cron') === 'true';
    
    // Cache headers
    const headers = {
      'Cache-Control': 'no-store, max-age=0'
    };
    
    // For normal user requests, use memory cache if available and fresh
    if (!isCronRequest && horoscopeCache && (Date.now() - horoscopeCache.timestamp) < CACHE_TTL) {
      console.log('Returning cached horoscopes from memory');
      return NextResponse.json({ horoscopes: horoscopeCache.data }, { headers });
    }
    
    // Set up Supabase connection
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

    // Current date
    const currentDate = new Date().toISOString().split('T')[0];

    // CRON JOB PROCESSING - Only when called with cron=true parameter
    if (isCronRequest) {
      console.log('Cron job request detected - generating new horoscopes');
      
      try {
        // Generate new horoscopes for all signs
        const newHoroscopes = await generateAllDailyHoroscopes();
        
        // Array of promises for bulk update
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
                ignoreDuplicates: false  // Always update existing entries
              }
            )
        );
        
        // Execute all updates in parallel
        const results = await Promise.allSettled(updatePromises);
        
        // Check for errors
        let hasErrors = false;
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            hasErrors = true;
            console.error(`Error updating horoscope for ${newHoroscopes[index].sign}:`, result.reason);
          }
        });
        
        // Clear cache to force fresh fetch next time
        horoscopeCache = null;
        
        console.log('Successfully generated and updated horoscopes via cron job');
        
        if (hasErrors) {
          return NextResponse.json({ 
            success: true, 
            warning: 'Some horoscopes could not be updated',
            updated: currentDate
          }, { status: 207 });
        }
        
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

    // GET EXISTING HOROSCOPES FROM DATABASE
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
    
    // If no records found (first-time setup), generate new content
    if (!horoscopes || horoscopes.length < 12) {
      console.log('First time setup: No horoscopes found in database, generating initial set');
      const initialHoroscopes = await generateAllDailyHoroscopes();
      
      // Save to database
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
      
      // Save to cache
      horoscopeCache = {
        timestamp: Date.now(),
        data: initialHoroscopes
      };
      
      return NextResponse.json({ horoscopes: initialHoroscopes }, { headers });
    }
    
    // Check if horoscopes need updating based on date
    const needsUpdate = horoscopes.some(horoscope => {
      // If date is missing or different from current date, update is needed
      return !horoscope.date || horoscope.date !== currentDate;
    });
    
    if (needsUpdate && !isCronRequest) {
      console.log('Horoscopes are outdated, triggering async update');
      // Make a non-blocking call to the cron endpoint
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://fortuneai.vercel.app'}/api/daily-horoscopes?cron=true`, {
        method: 'GET',
        headers: { 'x-internal-trigger': 'true' }
      }).catch(err => {
        console.error('Failed to trigger horoscope update:', err);
      });
    }
    
    // Found horoscope records in database, cache them and return
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

// Generate daily horoscopes for all zodiac signs
async function generateAllDailyHoroscopes() {
  try {
    console.log('Generating horoscopes for all zodiac signs in a single API call');
    
    // API key check - debugging purposes
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is missing or empty');
      throw new Error('Missing OpenAI API key');
    } else {
      console.log('OpenAI API key is configured');
    }
    
    // Generate horoscopes for all signs using a single system prompt
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

    // API call
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

    // Process API results
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
    
    // Process JSON data and add all horoscopes
    const horoscopes = [];
    
    for (let i = 0; i < zodiacSigns.length; i++) {
      const sign = zodiacSigns[i];
      const signTR = zodiacSignsTR[i];
      
      // Get horoscope content
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
    
    // Fallback to individual horoscope generation if error occurs
    console.log('Falling back to individual horoscope generation');
    
    const horoscopes = [];
    for (let i = 0; i < zodiacSigns.length; i++) {
      const sign = zodiacSigns[i];
      const signTR = zodiacSignsTR[i];
      
      try {
        // Make separate API call for each sign
        const horoscope = await generateHoroscope(sign);
        
        horoscopes.push({
          sign: sign,
          sign_tr: signTR,
          content: horoscope
        });
      } catch (innerError) {
        console.error(`Error generating horoscope for ${sign}:`, innerError);
        // Default message if error occurs
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

// Generate horoscope for a single sign (using OpenAI API)
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