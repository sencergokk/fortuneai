import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing environment variable: OPENAI_API_KEY');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateHoroscope(sign: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert astrologer providing daily horoscope readings. Your responses should be mystical, insightful, and personalized while being positive and uplifting."
      },
      {
        role: "user",
        content: `Generate a daily horoscope for ${sign} for today. Include insights about love, career, and personal growth. Keep it around 150 words.`
      }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

export async function generateTarotReading(spread: string, question?: string) {
  const queryContent = question 
    ? `Generate a tarot reading for the ${spread} spread regarding the question: "${question}".` 
    : `Generate a general tarot reading for the ${spread} spread.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert tarot reader with deep knowledge of the symbolic meanings of each card. Your readings are insightful, nuanced, and spiritually oriented. You should explain what each card means and how they interact with each other in the spread."
      },
      {
        role: "user",
        content: queryContent + " Include card names, their positions, meanings, and an overall interpretation. Be mystical but practical."
      }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
} 