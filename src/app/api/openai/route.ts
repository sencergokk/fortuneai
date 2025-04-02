import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CookieOptions } from '@supabase/ssr';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing environment variable: OPENAI_API_KEY');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // Create Supabase server client
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

    // Check user authentication for protected routes
    const { type, parameters } = await req.json();
    const { data: { session } } = await supabase.auth.getSession();
    
    // Allow horoscope without authentication
    if (type !== 'horoscope' && !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // For authenticated routes, check if user has credits
    // NOT: Krediler artık burada düşülmüyor, sadece yeterli krediniz var mı kontrolü yapılıyor
    if (type !== 'horoscope' && session) {
      const { data: userData, error: userError } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', session.user.id)
        .single();

      if (userError || !userData || userData.credits <= 0) {
        return NextResponse.json(
          { error: 'Insufficient credits' },
          { status: 403 }
        );
      }

      // Kredi düşme kodu kaldırıldı, bu işlem frontend'deki AuthContext tarafından yapılacak
      // Burada sadece yeterli kredinin olup olmadığı kontrol ediliyor
    }

    let response;

    switch (type) {
      case 'horoscope':
        response = await generateHoroscope(parameters.sign);
        break;
      case 'tarot':
        response = await generateTarotReading(parameters.spread, parameters.question, parameters.selectedCards);
        break;
      case 'coffee':
        response = await generateCoffeeReading(
          parameters.description,
          parameters.question,
          parameters.zodiacSign
        );
        break;
      case 'dream':
        response = await generateDreamInterpretation(parameters.dream);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid fortune-telling type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ result: response });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}

async function generateHoroscope(sign: string) {
  const systemPrompt = `Sen deneyimli bir astrologsun. Günlük burç yorumları yapıyorsun. Yorumların mistik, içgörü dolu ve kişiselleştirilmiş olmalı. Aynı zamanda pozitif ve motive edici olmalı.

ÖNEMLİ: Kullanıcının sorduğu dilde yanıt vermelisin. Eğer soru Türkçe ise Türkçe, İngilizce ise İngilizce yanıt ver. Asla farklı bir dilde yanıt verme.`;

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

async function generateTarotReading(spread: string, question?: string, selectedCards?: string[]) {
  const systemPrompt = `Sen deneyimli bir tarot okuyucusun. Her kartın sembolik anlamlarını derinlemesine biliyorsun. Yorumların içgörü dolu, nüanslı ve ruhani yönlü olmalı. Her kartın anlamını ve kartların birbiriyle olan etkileşimini açıklamalısın.

ÖNEMLİ: Kullanıcının sorduğu dilde yanıt vermelisin. Eğer soru Türkçe ise Türkçe, İngilizce ise İngilizce yanıt ver. Asla farklı bir dilde yanıt verme.

FORMATLAMA: Cevabın düz metin olmalı. Markdown formatı kullanma (** işaretleri, # başlıklar, vs kullanma). Paragraflar arasında boşluk bırak ve yeni satır (\n) kullan. Başlıkları kalın yapmak yerine sadece düz metin olarak yaz. Örneğin "Tek Kart Okuması: 'Soru' için The Tower Kartı" şeklinde normal yazı kullan.`;

  let queryContent = question 
    ? `${spread} düzeni için "${question}" sorusuna yönelik gerçekçi bir tarot okuması yap.`
    : `${spread} düzeni için genel ve gerçekçi bir tarot okuması yap.`;

  // Add selected cards to the query if provided
  if (selectedCards && selectedCards.length > 0) {
    queryContent += ` Kullanıcının seçtiği kartlar: ${selectedCards.join(', ')}. Kartların isimlerini, pozisyonlarını, anlamlarını ve tam olarak bu kartların yer aldığı bir genel yorum içermeli. Gerçekçi olarak yorumla.`;
  } else {
    queryContent += " Kartların isimlerini, pozisyonlarını, anlamlarını ve genel yorumu içermeli.";
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: queryContent + " Mistik ama pratik olmalı. Markdown formatı (**) kullanma ve başlıkları sadece düz metin olarak yaz."
      }
    ],
    temperature: 0.4,
  });

  return completion.choices[0].message.content;
}

async function generateCoffeeReading(description: string, question?: string, zodiacSign?: string) {
  const systemPrompt = `Sen deneyimli bir Türk kahve falı uzmanısın. Fincandaki figürleri, sembolleri ve şekilleri yorumlayarak kişiye özel fal bakarsın. Her sembolün geleneksel ve modern yorumlarını bilirsin.

ÖNEMLİ: Fincan tanımında görülen figürleri doğrudan analiz et. Örneğin "fil" görüldüyse, bu sembolün anlamını (güç, dayanıklılık, bolluk, talih) açıkla.

Yorumlarını şu bölümlere ayır:
1. Genel Yorumunuz - Fincandaki genel görünümü ve öne çıkan sembollerin genel anlamını açıkla
2. Aşk & İlişkiler - Aşk hayatı ve ilişkilerle ilgili sembolleri ve anlamlarını açıkla
3. Kariyer & Başarı - İş ve kariyer ile ilgili sembolleri ve anlamlarını açıkla
4. Para & Bolluk - Finansal durumla ilgili sembolleri ve anlamlarını açıkla
5. Sağlık & Enerji - Sağlık ile ilgili sembolleri ve anlamlarını açıkla

Her bir sembol için "Bu sembol ... anlamına gelir" şeklinde açıklamalar yap. Fincanda görülen her figürün anlamını mutlaka belirt.

ÖNEMLİ: Kullanıcının sorduğu dilde yanıt vermelisin. Eğer soru Türkçe ise Türkçe, İngilizce ise İngilizce yanıt ver. Asla farklı bir dilde yanıt verme.`;

  let content = "Türk kahve falı yorumu yapacaksın. ";
  content += `Fincan hakkında şu bilgiler verildi: "${description}". `;
  
  if (question) {
    content += `Kullanıcının sorusu: "${question}". `;
  }
  
  if (zodiacSign) {
    content += `Kullanıcının burcu: ${zodiacSign}. `;
  }
  
  content += `Fincan tanımında belirtilen her figürü ve sembolü ayrı ayrı analiz et. Özellikle tanımda belirtilen şu sembolleri yorumla: ${extractKeySymbols(description)}. 

Her bir sembol için geleneksel anlamını açıkla. Fincan tanımını ve (varsa) kullanıcının burcunu dikkate alarak kişiye özel yorumla. 

Cevabını şu bölümlere ayır:
- Genel Yorumunuz
- Aşk & İlişkiler 
- Kariyer & Başarı
- Para & Bolluk
- Sağlık & Enerji`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: content
      }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

// Fincan tanımından anahtar sembolleri çıkaran yardımcı fonksiyon
function extractKeySymbols(description: string): string {
  // Türkçe yaygın nesneler için regex pattern
  const symbolPattern = /\b(fil|kuş|kalp|yol|ağaç|dağ|ev|yılan|balık|çiçek|yıldız|ay|güneş|göz|köpek|kedi|at|kuzu|aslan|kutu|gemi|uçak|araba|merdiven|anahtar|kapı|pencere|çanta|şemsiye|kitap|mektup|para|yüzük|saat)\b/gi;

  // Tanımdaki sembolleri bul
  const matches = description.match(symbolPattern);
  
  // Eşleşme yoksa veya boşsa, genel bir ifade döndür
  if (!matches || matches.length === 0) {
    return "fincandaki tüm şekilleri ve sembolleri";
  }
  
  // Tekrar edenleri kaldır ve string olarak birleştir
  return [...new Set(matches.map(match => match.toLowerCase()))].join(', ');
}

async function generateDreamInterpretation(dream: string) {
  const systemPrompt = `Sen deneyimli bir rüya yorumcususun. Psikolojik, sembolik ve kültürel açıdan rüyaları analiz edebilirsin. Yorumların içgörü dolu ve düşündürücü olmalı.

ÖNEMLİ: Kullanıcının sorduğu dilde yanıt vermelisin. Eğer soru Türkçe ise Türkçe, İngilizce ise İngilizce yanıt ver. Asla farklı bir dilde yanıt verme.`;

  const userPrompt = `Şu rüyayı yorumlar mısın: "${dream}". Rüyadaki semboller, karakterler ve olayları analiz et. Rüya sahibinin hayatında neler olabileceğine dair içgörüler sun. Türk kültüründeki rüya yorumlama geleneklerini de göz önünde bulundur.`;

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