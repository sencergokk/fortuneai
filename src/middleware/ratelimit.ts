import { NextRequest, NextResponse } from 'next/server';
import { 
  authLimiter, 
  fortuneLimiter, 
  generalLimiter 
} from '@/lib/ratelimit';

export async function rateLimitMiddleware(request: NextRequest) {
  // İstemcinin IP adresini HTTP başlıklarından al
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  // IP adresi olarak önce x-forwarded-for, sonra x-real-ip, yoksa 127.0.0.1 kullan
  const ip = forwardedFor?.split(',')[0] || realIp || '127.0.0.1';
  
  // İstek yoluna göre hangi limiter'ı kullanacağımızı belirliyoruz
  const path = request.nextUrl.pathname;
  
  // Kullanılacak limiter'ı belirliyoruz
  let limiter = generalLimiter;
  
  if (path.startsWith('/api/auth')) {
    limiter = authLimiter;
  } else if (
    path.startsWith('/api/tarot') || 
    path.startsWith('/api/coffee') || 
    path.startsWith('/api/dream') ||
    path.startsWith('/api/horoscope') ||
    path.startsWith('/api/fortune') ||
    path.startsWith('/api/openai')
  ) {
    limiter = fortuneLimiter;
  }
  
  try {
    const { success, limit, remaining, reset } = await limiter.limit(ip);
    
    // Rate limit aşılmışsa
    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.',
          limit,
          remaining: 0,
          reset,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      );
    }
    
    // Rate limit aşılmamışsa, istek devam edebilir
    // Her istekte rate limit bilgilerini header'lara ekleyelim
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());
    
    return response;
  } catch (error) {
    console.error('Rate limit kontrolü sırasında hata:', error);
    // Hata durumunda isteğin devam etmesine izin veriyoruz
    return NextResponse.next();
  }
} 