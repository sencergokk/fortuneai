import { ZodiacSign, TarotSpread } from "@/types";

// Horoscope reading
export async function getHoroscopeReading(sign: ZodiacSign): Promise<string> {
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'horoscope',
      parameters: {
        sign,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get horoscope reading');
  }

  const data = await response.json();
  return data.result;
}

// Tarot reading
export async function getTarotReading(
  spread: TarotSpread,
  question?: string,
  selectedCards?: string[]
): Promise<string> {
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'tarot',
      parameters: {
        spread,
        question,
        selectedCards,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get tarot reading');
  }

  const data = await response.json();
  return data.result;
}

// Coffee cup reading
export async function getCoffeeReading(
  description: string,
  question?: string,
  zodiacSign?: ZodiacSign
): Promise<string> {
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'coffee',
      parameters: {
        description,
        question,
        zodiacSign,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get coffee reading');
  }

  const data = await response.json();
  return data.result;
}

// Dream interpretation
export async function getDreamInterpretation(dream: string): Promise<string> {
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'dream',
      parameters: {
        dream,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get dream interpretation');
  }

  const data = await response.json();
  return data.result;
}

// Görsel tabanlı kahve falı yorumu
export async function getCoffeeReadingFromImages(
  images: string[],
  zodiacSign?: ZodiacSign
): Promise<string> {
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'coffee',
      parameters: {
        images,
        zodiacSign,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get coffee reading from images');
  }

  const data = await response.json();
  return data.result;
} 