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
        response = await generateCoffeeReadingFromImages(
          parameters.images,
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

// Fotoğraflardan kahve falı yorumu oluşturma
async function generateCoffeeReadingFromImages(
  images: string[],
  zodiacSign?: string
) {
  if (!images || images.length === 0) {
    throw new Error('No images provided for coffee reading');
  }

  // Geliştirilmiş sistem mesajı
  const systemPrompt = `Sen deneyimli bir Türk kahve falı uzmanısın. Sana gönderilen fincan fotoğraflarını analiz ederek kahve falı yorumu yapmalısın.

ÖNEMLİ: Kullanıcıdan herhangi bir fincan açıklaması veya içerik gelmeyecektir. Sadece fotoğrafları analiz ederek yorum yapmalısın. İlave bilgi isteme veya daha fazla açıklama bekleme.

GÖREV: 
- Görsellerde gördüğün fincanların her birini detaylı analiz et.
- Fincanlardaki şekilleri, lekeleri ve desenleri yorumla.
- Fincanın farklı bölgelerindeki sembolleri ayrı ayrı değerlendir: Tabanı, kenarları, ağzı ve tabağı.
- Gördüğün her şekil ve sembolü yorumla, belirgin figürleri belirt.

YORUMLA BÖLÜMLERİ:
1. Genel Görünüm: Fincanda gördüğün ana sembolleri ve genel olarak ne ifade ettiğini detaylandır. Fincanın genel enerjisini tanımla.

2. Aşk & İlişkiler: Romantik hayat, mevcut/potansiyel ilişkiler, aşk hayatındaki olası gelişmeler, aile ilişkileri.

3. Kariyer & Başarı: İş hayatı, kariyer fırsatları, projeler, eğitim, mesleki gelişim.

4. Para & Bolluk: Finansal durum, beklenen gelirler/giderler, yatırımlar, maddi fırsatlar.

5. Sağlık & Enerji: Fiziksel/zihinsel sağlık, enerji seviyeleri, potansiyel sağlık uyarıları.

6. Beklentiler & Gelecek: Yakın ve uzak gelecekte beklenen önemli olaylar, değişimler.

Her bölümde, gördüğün sembolleri detaylandırarak açıkla ve anlamlarını bağlam içinde yorumla. Fincanın farklı bölgelerinde (iç, dış, tabak) gördüğün sembolleri zamansal olarak sırala. Mistik ama anlaşılır ol. Pozitif ve cesaretlendirici bir ton kullan, ancak görünen olumsuz işaretleri de nazikçe belirt. 

ASLA 'Fincan hakkında bilgi verilmediği için yorum yapamıyorum' veya benzeri bir cevap verme. Fotoğrafları analiz ederek detaylı yorum yapman gerekiyor.`;

  // Metin içeriği
  const textContent = `Kahve fincanımın fotoğraflarını gönderiyorum. ${zodiacSign ? 'Burcum: ' + zodiacSign + '.' : ''} Lütfen fincanımdaki şekilleri tespit et ve Türk kahve falı geleneğine göre yorumla.`;

  // İleti içeriğini OpenAI'nin API'sine uygun formatta hazırla
  type ContentPartText = {
    type: "text";
    text: string;
  };

  type ContentPartImage = {
    type: "image_url";
    image_url: {
      url: string;
      detail: "high" | "low" | "auto";
    };
  };

  type ContentPart = ContentPartText | ContentPartImage;

  // İçerik dizisini oluştur
  const contentParts: ContentPart[] = [
    { 
      type: "text", 
      text: textContent 
    }
  ];

  // Görselleri ekle
  images.forEach(image => {
    contentParts.push({
      type: "image_url",
      image_url: {
        url: image,
        detail: "high"
      }
    });
  });

  // OpenAI Vision API'sini çağır
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: contentParts
      }
    ],
    max_tokens: 2000,
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
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