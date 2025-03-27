import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CookieOptions } from '@supabase/ssr';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // Supabase server client oluştur
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

    // Kullanıcı giriş yapmışsa kullanıcı ID'sini ekle
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // E-postanın zaten kayıtlı olup olmadığını kontrol et
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select()
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi zaten abone' },
        { status: 200 }
      );
    }

    // Yeni abone kaydı ekle
    const { error } = await supabase.from('newsletter_subscribers').insert({
      email,
      user_id: userId || null,
      subscribed_at: new Date().toISOString(),
      status: 'active'
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Abonelik işlemi başarısız oldu' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Bülten aboneliği başarıyla tamamlandı' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'İsteğiniz işlenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 