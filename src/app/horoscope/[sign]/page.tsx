"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { zodiacSigns, type ZodiacSign } from '@/types';
import { getHoroscopeReading } from '@/lib/fortune-api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Calendar, ThermometerSun, Wind, Droplets, Flame, Star, Heart, Brain, Diamond, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { motion } from 'framer-motion';
import React from 'react';

// Element renklerini tanımla
const elementColors = {
  Fire: "from-orange-500 to-rose-500 border-rose-300 dark:border-rose-700",
  Earth: "from-emerald-500 to-green-600 border-green-300 dark:border-green-700",
  Air: "from-sky-400 to-blue-500 border-blue-300 dark:border-blue-700",
  Water: "from-indigo-400 to-violet-500 border-violet-300 dark:border-violet-700",
};

// Element ikonlarını tanımla
const elementIcons = {
  Fire: <Flame className="h-5 w-5" />,
  Earth: <Leaf className="h-5 w-5" />,
  Air: <Wind className="h-5 w-5" />,
  Water: <Droplets className="h-5 w-5" />,
};

interface ZodiacPageProps {
  params: Promise<{
    sign: string;
  }>;
}

interface HoroscopeData {
  sign: string;
  content: string;
  updated_at?: string;
}

export default function ZodiacPage({ params }: ZodiacPageProps) {
  // Fix: Use React.use to unwrap the params Promise
  const unwrappedParams = React.use(params);
  const sign = unwrappedParams.sign;
  
  const [horoscope, setHoroscope] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generalHoroscope, setGeneralHoroscope] = useState<string | null>(null);
  const [isGeneralLoading, setIsGeneralLoading] = useState(true);
  const [lastUpdateDate, setLastUpdateDate] = useState<string>("");
  const { user, useOneCredit, credits } = useAuth();
  const [activeTab, setActiveTab] = useState("daily");

  // Store the useOneCredit function reference
  const useOneCreditFn = useOneCredit;

  // Burç bilgisini kontrol et
  const zodiacSign = Object.keys(zodiacSigns).find(key => key === sign);
  if (!zodiacSign) {
    notFound();
  }

  const signDetails = zodiacSigns[zodiacSign as ZodiacSign];

  // Set active tab based on login status
  useEffect(() => {
    if (user) {
      setActiveTab("daily");
    } else {
      setActiveTab("daily");
    }
  }, [user]);

  // Fetch general horoscope from API
  useEffect(() => {
    // Generate a generic horoscope if API fails
    const generateGenericHoroscope = () => {
      return `${signDetails.name} burcu için günlük genel yorum. ${signDetails.name} burçları bugün ${signDetails.element === 'Fire' ? 'enerjik ve tutkulu' : signDetails.element === 'Earth' ? 'pratik ve kararlı' : signDetails.element === 'Air' ? 'sosyal ve iletişimci' : 'duygusal ve sezgisel'} olacaklar. Kendinize zaman ayırın ve fırsatları değerlendirin.`;
    };

    const fetchGeneralHoroscope = async () => {
      try {
        setIsGeneralLoading(true);
        const response = await fetch('/api/daily-horoscopes');
        if (!response.ok) {
          throw new Error('Failed to fetch general horoscope');
        }
        
        const data = await response.json();
        if (data.horoscopes && Array.isArray(data.horoscopes)) {
          const signHoroscope = data.horoscopes.find((h: HoroscopeData) => h.sign === zodiacSign);
          if (signHoroscope) {
            setGeneralHoroscope(signHoroscope.content);
            
            // Yorumun son güncelleme tarihini göster
            if (signHoroscope.updated_at) {
              const updateDate = new Date(signHoroscope.updated_at);
              const formattedDate = updateDate.toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });
              setLastUpdateDate(formattedDate);
            }
          } else {
            // Fallback to generated content if API doesn't return data for this sign
            setGeneralHoroscope(generateGenericHoroscope());
          }
        } else {
          setGeneralHoroscope(generateGenericHoroscope());
        }
      } catch (error) {
        console.error('Error fetching general horoscope:', error);
        setGeneralHoroscope(generateGenericHoroscope());
      } finally {
        setIsGeneralLoading(false);
      }
    };

    fetchGeneralHoroscope();
  }, [zodiacSign, signDetails]);

  // Burç özellikleri
  const traitsBySign: Record<ZodiacSign, string[]> = {
    aries: ["Cesur", "Enerjik", "Öncü", "Rekabetçi", "Girişken"],
    taurus: ["Kararlı", "Güvenilir", "Sabırlı", "Pratik", "Sevgi dolu"],
    gemini: ["Meraklı", "Uyarlanabilir", "İletişimci", "Esprili", "Zeki"],
    cancer: ["Duygusal", "Koruyucu", "Sezgisel", "Sevecen", "Sadık"],
    leo: ["Coşkulu", "Yaratıcı", "Cömert", "Güvenli", "Karizmatik"],
    virgo: ["Analitik", "Mükemmeliyetçi", "Özenli", "Pratik", "Çalışkan"],
    libra: ["Diplomatik", "Barışçıl", "Adaletli", "Sosyal", "Kibar"],
    scorpio: ["Yoğun", "Tutkulu", "Sezgisel", "Kararlı", "Stratejik"],
    sagittarius: ["Maceracı", "İyimser", "Felsefi", "Dürüst", "Özgürlükçü"],
    capricorn: ["Disiplinli", "Sorumlu", "Geleneksel", "Hırslı", "Dayanıklı"],
    aquarius: ["Yenilikçi", "Bağımsız", "Hümanist", "Entelektüel", "Orijinal"],
    pisces: ["Şefkatli", "Sanatsal", "Hayalperest", "Sezgisel", "Merhametli"],
  };

  // Aşk, kariyer ve sağlık için günlük yorumlar
  const loveHoroscope = `${signDetails.name} burçları için bugün aşk hayatında ${
    signDetails.element === 'Fire' ? 'tutkulu ve heyecan verici' : 
    signDetails.element === 'Earth' ? 'istikrarlı ve güvenilir' : 
    signDetails.element === 'Air' ? 'iletişimi kuvvetli ve neşeli' : 
    'duygusal ve romantik'} bir gün olabilir.`;

  const careerHoroscope = `İş hayatında bugün ${signDetails.name} burçları ${
    signDetails.element === 'Fire' ? 'yeni fırsatlar yakalayabilir ve inisiyatif alabilir' : 
    signDetails.element === 'Earth' ? 'kararlı ve pratik yaklaşımlarla başarı elde edebilir' : 
    signDetails.element === 'Air' ? 'iletişim becerileriyle öne çıkabilir ve yeni bağlantılar kurabilir' : 
    'sezgileriyle doğru kararlar alabilir ve duygusal zekalarını kullanabilir'}.`;

  const healthHoroscope = `Sağlık açısından, ${signDetails.name} burçları bugün ${
    signDetails.element === 'Fire' ? 'enerji dolu ve aktif' : 
    signDetails.element === 'Earth' ? 'dengeli ve sağlam' : 
    signDetails.element === 'Air' ? 'zihinsel olarak aktif ve rahatlamış' : 
    'duygusal dengesi iyi ve dinlenmiş'} hissedebilir.`;

  const personalityTraits = traitsBySign[zodiacSign as ZodiacSign] || [];
  
  const handleGetPersonalHoroscope = async () => {
    if (!user) {
      toast.error("Kişisel burç yorumu için giriş yapmanız gerekiyor.");
      return;
    }

    try {
      // Kredi kullanımı
      const creditUsed = await useOneCreditFn();
      if (!creditUsed) {
        return;
      }
      
      setIsLoading(true);
      const result = await getHoroscopeReading(zodiacSign as ZodiacSign);
      setHoroscope(result);
    } catch (error) {
      toast.error("Burç yorumu alınırken bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="container py-8 md:py-12">
      <motion.div 
        className="mx-auto max-w-[980px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <div className={`text-6xl mb-2 p-4 rounded-full bg-gradient-to-br ${elementColors[signDetails.element]} text-white shadow-lg`}>
            {signDetails.emoji}
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl">
            {signDetails.name} Burcu
          </h1>
          <p className="text-lg text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {signDetails.date}
          </p>
          <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm">
            {elementIcons[signDetails.element]}
            <span>{signDetails.element === 'Fire' ? 'Ateş' : signDetails.element === 'Earth' ? 'Toprak' : signDetails.element === 'Air' ? 'Hava' : 'Su'} Elementi</span>
          </div>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="daily">Günlük Burç</TabsTrigger>
            <TabsTrigger value="personality">Karakter</TabsTrigger>
            <TabsTrigger value="personal">Kişisel Yorum</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                {...fadeIn} 
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Günlük Genel Yorum
                    </CardTitle>
                    <CardDescription>
                      {lastUpdateDate || new Date().toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isGeneralLoading ? (
                      <div className="flex items-center justify-center h-20">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : (
                      <p className="text-lg">{generalHoroscope}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid grid-cols-1 gap-6">
                <motion.div {...fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
                  <Card className="border-pink-100 dark:border-pink-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Heart className="h-4 w-4 text-pink-500" />
                        Aşk
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{loveHoroscope}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div {...fadeIn} transition={{ duration: 0.5, delay: 0.3 }}>
                  <Card className="border-amber-100 dark:border-amber-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Diamond className="h-4 w-4 text-amber-500" />
                        Kariyer & Para
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{careerHoroscope}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div {...fadeIn} transition={{ duration: 0.5, delay: 0.4 }}>
                  <Card className="border-green-100 dark:border-green-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <ThermometerSun className="h-4 w-4 text-green-500" />
                        Sağlık & İyi Oluş
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{healthHoroscope}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button onClick={() => setActiveTab("personal")}>
                {user ? "Kişisel Yorumumu Göster" : "Kişisel Yorum İçin Giriş Yap"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="personality">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    {signDetails.name} Burcu Özellikleri
                  </CardTitle>
                  <CardDescription>
                    {signDetails.name} burcunun temel karakter özellikleri ve eğilimleri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Temel Özellikler</h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {personalityTraits.map((trait, index) => (
                          <div 
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${elementColors[signDetails.element]} text-white`}
                          >
                            {trait}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Element</h3>
                          <p className="flex items-center gap-2">
                            {elementIcons[signDetails.element]}
                            <span>
                              {signDetails.element === 'Fire' ? 'Ateş' : 
                               signDetails.element === 'Earth' ? 'Toprak' : 
                               signDetails.element === 'Air' ? 'Hava' : 'Su'}
                            </span>
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Sembol</h3>
                          <p>{signDetails.symbol}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">{signDetails.name} Burcu ve Uyumu</h3>
                      <p className="mb-4">
                        {signDetails.name} burcu {signDetails.element === 'Fire' ? 
                          'diğer ateş burçları olan Koç, Aslan ve Yay ile yüksek uyuma sahiptir. Hava burçlarıyla da iyi anlaşır.' : 
                          signDetails.element === 'Earth' ? 
                          'diğer toprak burçları olan Boğa, Başak ve Oğlak ile yüksek uyuma sahiptir. Su burçlarıyla da iyi anlaşır.' : 
                          signDetails.element === 'Air' ? 
                          'diğer hava burçları olan İkizler, Terazi ve Kova ile yüksek uyuma sahiptir. Ateş burçlarıyla da iyi anlaşır.' : 
                          'diğer su burçları olan Yengeç, Akrep ve Balık ile yüksek uyuma sahiptir. Toprak burçlarıyla da iyi anlaşır.'}
                      </p>
                      
                      <h3 className="text-lg font-medium mb-3">En İyi Yanları</h3>
                      <p>
                        {signDetails.element === 'Fire' ? 
                          'Tutkulu, enerjik, lider ruhlu, cesur, kendine güvenen' : 
                          signDetails.element === 'Earth' ? 
                          'Pratik, güvenilir, sabırlı, kararlı, çalışkan' : 
                          signDetails.element === 'Air' ? 
                          'İletişimci, analitik, sosyal, uyumlu, meraklı' : 
                          'Duygusal, sezgisel, merhametli, empatik, koruyucu'}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline">
                    <Link href="/horoscope">
                      Tüm Burçlara Dön
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Kişiye Özel {signDetails.name} Burç Yorumu</CardTitle>
                <CardDescription>
                  Size özel, detaylı ve kişiselleştirilmiş günlük burç yorumu alın
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!horoscope ? (
                  user ? (
                    <div className="text-center py-8">
                      <div className="space-y-4 max-w-md mx-auto">
                        <p className="text-muted-foreground">
                          Kişisel burç yorumunuz, sadece size özel olarak hazırlanır ve 1 kredi kullanır.
                        </p>
                        <div className="font-medium">
                          Mevcut Krediniz: {credits}
                        </div>
                        
                        <Button 
                          className="mt-4"
                          onClick={handleGetPersonalHoroscope} 
                          disabled={isLoading || credits < 1}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Yorum hazırlanıyor...
                            </>
                          ) : credits < 1 ? (
                            "Kredi Yetersiz"
                          ) : (
                            "Kişisel Yorumumu Göster (1 Kredi)"
                          )}
                        </Button>
                        
                        {credits < 1 && (
                          <Button asChild variant="outline" className="mt-2">
                            <Link href="/credits">
                              Kredi Satın Al
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Kişisel burç yorumu için giriş yapmanız gerekiyor
                      </p>
                      <AuthModal 
                        triggerText="Giriş Yap / Kayıt Ol" 
                        triggerVariant="default"
                      />
                    </div>
                  )
                ) : (
                  <div className="prose prose-sm dark:prose-invert mx-auto max-w-none">
                    <p className="text-lg leading-relaxed whitespace-pre-line">
                      {horoscope}
                    </p>
                  </div>
                )}
              </CardContent>
              {horoscope && (
                <CardFooter className="flex justify-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setHoroscope(null)}
                  >
                    Yeni Yorum Al
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
} 