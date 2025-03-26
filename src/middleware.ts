import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { rateLimitMiddleware } from "./middleware/ratelimit";

export async function middleware(request: NextRequest) {
  // Gelen isteğin URL'ini al
  const url = request.nextUrl.clone();
  
  // API istekleri için rate limiting uygula
  if (url.pathname.startsWith('/api/')) {
    return rateLimitMiddleware(request);
  }
  
  // Yanıt nesnesini oluştur
  const response = NextResponse.next();
  
  // Güvenlik başlıklarını ekle
  addSecurityHeaders(response);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check auth condition for protected routes
  if (!session && isProtectedRoute(url.pathname)) {
    // Kullanıcı giriş yapmamış ve korumalı bir sayfa istemiş
    url.searchParams.set("login", "required");
    return NextResponse.rewrite(url);
  }

  return response;
}

// Güvenlik başlıklarını eklemek için yardımcı fonksiyon
function addSecurityHeaders(response: NextResponse) {
  // Content Security Policy (CSP) başlığı
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.gstatic.com; connect-src 'self' *.supabase.co *.googleapis.com; img-src 'self' data: blob: *.githubusercontent.com; style-src 'self' 'unsafe-inline' *.googleapis.com; font-src 'self' data: *.gstatic.com; frame-src 'self'"
  );
  
  // XSS koruması için
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Clickjacking koruması
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // MIME tipini tarayıcının değiştirmesini önleme
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // HTTP Strict Transport Security
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  return response;
}

// Define which routes require authentication
function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    "/dashboard",
    "/account-settings",
    "/dream",
    "/tarot",
    "/coffee",
    "/credits",
  ];
  
  // Allow public horoscope pages
  if (pathname === "/horoscope") {
    return false;
  }
  
  // Check if the current route is a protected route
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account-settings/:path*",
    "/dream/:path*",
    "/tarot/:path*",
    "/coffee/:path*",
    "/credits/:path*",
    "/horoscope/:path*",
    "/api/:path*",
  ],
}; 