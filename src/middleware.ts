import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // Gelen isteğin URL'ini al
  const url = request.nextUrl.clone();
  
  // Yanıt nesnesini oluştur
  const response = NextResponse.next();

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
  ],
}; 