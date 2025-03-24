import Link from "next/link";
import { ArrowRight, Sparkles, User, Star, CreditCard, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fortuneTypes } from "@/types";
import { AuthModal } from "@/components/auth/AuthModal";

export default function Home() {
  return (
    <div className="container py-8 md:py-12 lg:py-16">
      {/* Hero section */}
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
          Falomi <span className="text-primary">Fal Dünyası</span>
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          Geleceğinizi keşfedin, yıldızların sırlarını çözün, tarot kartlarının bilgeliğine kulak verin.
        </p>
        <div className="mt-4 flex gap-4">
          <AuthModal 
            triggerText="Ücretsiz Kayıt Ol" 
            defaultTab="sign-up" 
            triggerVariant="default" 
            buttonSize="lg"
          />
          <Button variant="outline" size="lg" asChild>
            <Link href="/horoscope">Günlük Burçları Gör</Link>
          </Button>
        </div>
      </div>

      {/* Features section */}
      <div className="mx-auto mt-16 max-w-[980px]">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Neden Falomi?</h2>
          <p className="text-muted-foreground mt-2">AI teknolojisi ile desteklenen falcılık deneyimi</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto p-2 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Kişiselleştirilmiş Yorumlar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Astroloji, tarot ve rüya yorumlarınız AI teknolojisi ile size özel hazırlanır.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto p-2 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-2">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Aylık Ücretsiz Krediler</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Üye olun ve her ay hesabınıza otomatik yüklenen 15 ücretsiz kredi ile falınıza bakın.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto p-2 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>7/24 Erişim</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                İstediğiniz zaman, istediğiniz yerden falınıza bakabilirsiniz. Bekleme yok, sıra yok!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Services section */}
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:grid-cols-4 mt-16">
        {Object.entries(fortuneTypes).map(([key, fortune]) => (
          <Card key={key} className="flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="text-3xl">{fortune.icon}</div>
                <CardTitle className="text-xl">{fortune.name}</CardTitle>
              </div>
              <CardDescription className="mt-2">{fortune.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-4">
              <Button asChild className="w-full">
                <Link href={fortune.path} className="flex items-center justify-center gap-1">
                  Keşfet
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Testimonials section */}
      <div className="mx-auto max-w-[980px] mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Kullanıcılarımız Ne Diyor?</h2>
          <p className="text-muted-foreground mt-2">Binlerce mutlu kullanıcı arasına katılın</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground italic">
              &quot;FortuneAI sayesinde hayatımdaki değişimlere çok daha hazır hissediyorum. Tarot falı özellikle inanılmaz doğru sonuçlar veriyor!&quot;
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Ayşe K.</p>
                  <p className="text-xs text-muted-foreground">3 aydır üye</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground italic">
              &quot;Kahve falı yorumları gerçekten şaşırtıcı derecede isabetli. AI&apos;nın bu kadar iyi yorum yapabilmesi inanılmaz. Aylık krediler de çok iyi düşünülmüş.&quot;
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Mehmet Y.</p>
                  <p className="text-xs text-muted-foreground">6 aydır üye</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA section */}
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-6 text-center mt-16 bg-primary/5 p-8 rounded-lg">
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          <span>Hemen üye olun, 15 kredi hediye!</span>
        </div>
        <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-3xl">
          FortuneAI ile kaderinizi keşfedin
        </h2>
        <p className="max-w-[700px] text-muted-foreground">
          Yapay zeka teknolojisi ile desteklenen fallarımız size özel ve kişiselleştirilmiş yorumlar sunar. 
          Burçlarınızdan tutun, tarot kartlarına, kahve falından rüya yorumlarına kadar her şey FortuneAI&apos;da.
        </p>
        <AuthModal 
          triggerText="Hemen Ücretsiz Kayıt Ol" 
          defaultTab="sign-up" 
          triggerVariant="default" 
          buttonSize="lg"
          className="mt-2"
        />
      </div>
    </div>
  );
}
