import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Upstash Redis için bir Redis istemcisi oluşturuyoruz
// NOT: Gerçek kullanımda process.env değerlerini .env dosyasından almalısınız
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://your-upstash-redis-url.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'your-upstash-redis-token',
});

// Farklı API'ler için farklı rate limitlerini tanımlıyoruz
export const generalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 saniyede en fazla 5 istek
  analytics: true, // İsteğe bağlı olarak analitik verilerini etkinleştir
  prefix: 'ratelimit:general',
});

export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'), // 1 dakikada en fazla 10 istek
  analytics: true,
  prefix: 'ratelimit:auth',
});

export const fortuneLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'), // 1 dakikada en fazla 5 fal isteği
  analytics: true,
  prefix: 'ratelimit:fortune',
});

// Rate limit kontrolü için yardımcı fonksiyon
export async function checkRateLimit(
  limiter: Ratelimit, 
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);
    return { success, limit, remaining, reset };
  } catch (error) {
    console.error('Rate limit kontrolü sırasında hata:', error);
    // Hata durumunda varsayılan olarak başarılı kabul ediyoruz
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
} 