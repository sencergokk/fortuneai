"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { zodiacSigns, type ZodiacSign } from '@/types';
import { getHoroscopeReading } from '@/lib/fortune-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Calendar, ThermometerSun, Wind, Droplets, Flame, Star, Heart, Brain, Diamond, Leaf, Sparkles, Plus, Minus, Users, CloudMoon } from 'lucide-react';
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
  const { user} = useAuth();
  const [activeTab, setActiveTab] = useState("daily");
  
  // Separate auth context access to avoid hook rule violation
  const auth = useAuth();

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
      // Use auth.useOneCredit instead of direct hook call
      const creditUsed = await auth.useOneCredit('horoscope');
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

  useEffect(() => {
    if (!isLoading) return;
    
    const fetchGeneralHoroscope = async () => {
      try {
        // First check localStorage cache
        const cachedHoroscope = localStorage.getItem(`horoscope_${zodiacSign}`);
        const cachedTimestamp = localStorage.getItem(`horoscope_${zodiacSign}_timestamp`);
        
        if (cachedHoroscope && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp);
          const now = Date.now();
          // Check if cache is still valid (less than 24 hours old)
          if (now - timestamp < 24 * 60 * 60 * 1000) {
            console.log('Using cached horoscope');
            setHoroscope(JSON.parse(cachedHoroscope));
            setIsLoading(false);
            return;
          }
        }
        
        const res = await fetch('/api/daily-horoscopes');
        
        if (!res.ok) {
          throw new Error('Failed to fetch daily horoscope');
        }
        
        const data = await res.json();
        
        if (data.horoscopes && Array.isArray(data.horoscopes)) {
          const signHoroscope = data.horoscopes.find((h: HoroscopeData) => h.sign === zodiacSign);
          
          if (signHoroscope) {
            setHoroscope(signHoroscope.content);
            // Cache the result in localStorage
            localStorage.setItem(`horoscope_${zodiacSign}`, JSON.stringify(signHoroscope.content));
            localStorage.setItem(`horoscope_${zodiacSign}_timestamp`, Date.now().toString());
          } else {
            // Fallback to generated horoscope
            setHoroscope(`${signDetails.name} burçları için bugün genel bir yorum. Kendinize zaman ayırın ve fırsatları değerlendirin.`);
          }
        } else {
          setHoroscope(`${signDetails.name} burçları için bugün genel bir yorum. Kendinize zaman ayırın ve fırsatları değerlendirin.`);
        }
      } catch (error) {
        console.error('Error fetching horoscope:', error);
        setHoroscope(`${signDetails.name} burçları için bugün genel bir yorum. Kendinize zaman ayırın ve fırsatları değerlendirin.`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGeneralHoroscope();
    
  }, [isLoading, zodiacSign, signDetails]);

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
                <Card className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden border-2 border-gray-200 dark:border-gray-800 shadow-md">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300" />
                  
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
                      <p className="text-lg leading-relaxed font-serif">
                        {generalHoroscope}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              
              <div className="grid grid-cols-1 gap-6">
                <motion.div 
                  {...fadeIn} 
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border-2 border-pink-100 dark:border-pink-900/50 bg-gradient-to-br from-white to-pink-50 dark:from-gray-900 dark:to-pink-950/20 shadow-md overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300" />
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Heart className="h-5 w-5 text-pink-500" />
                        Aşk & İlişkiler
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base">{loveHoroscope}</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div 
                  {...fadeIn} 
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="border-2 border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/20 shadow-md overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300" />
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Diamond className="h-5 w-5 text-blue-500" />
                        Kariyer & Çalışma
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base">{careerHoroscope}</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div 
                  {...fadeIn} 
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="border-2 border-green-100 dark:border-green-900/50 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950/20 shadow-md overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-300 via-emerald-300 to-green-300" />
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <ThermometerSun className="h-5 w-5 text-green-500" />
                        Sağlık & Enerji
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base">{healthHoroscope}</p>
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
              {...fadeIn} 
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden border-2 border-gray-200 dark:border-gray-800 shadow-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-300 via-primary-400 to-primary-300" />
                
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    {signDetails.name} Kişilik Özellikleri
                  </CardTitle>
                  <CardDescription>
                    {signDetails.element === 'Fire' ? 'Ateş' : signDetails.element === 'Earth' ? 'Toprak' : signDetails.element === 'Air' ? 'Hava' : 'Su'} elementine sahip {signDetails.name} burcunun temel karakter özellikleri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {personalityTraits.map((trait, index) => (
                      <motion.div 
                        key={trait}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`px-3 py-1.5 rounded-full inline-flex items-center gap-1 ${
                          getElementColorClass(signDetails.element)
                        }`}>
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>{trait}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg bg-white dark:bg-gray-900 shadow-inner border border-gray-100 dark:border-gray-800">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Plus className="h-4 w-4 text-green-500" />
                        <span>Güçlü Yönleri</span>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {zodiacStrengths[zodiacSign as ZodiacSign] || getGenericStrengths(signDetails.element)}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-white dark:bg-gray-900 shadow-inner border border-gray-100 dark:border-gray-800">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Minus className="h-4 w-4 text-red-500" />
                        <span>Zayıf Yönleri</span>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {zodiacWeaknesses[zodiacSign as ZodiacSign] || getGenericWeaknesses(signDetails.element)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 rounded-lg bg-white dark:bg-gray-900 shadow-inner border border-gray-100 dark:border-gray-800">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>Uyumlu Burçlar</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {getCompatibleSigns(zodiacSign as ZodiacSign).map((sign) => (
                        <Link 
                          key={sign} 
                          href={`/horoscope/${sign}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <span>{zodiacSigns[sign as ZodiacSign].emoji}</span>
                          <span>{zodiacSigns[sign as ZodiacSign].name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="personal">
            {horoscope ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-lg overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-300" />
                  
                  <div className="absolute top-0 right-0 opacity-20 pointer-events-none select-none">
                    <CloudMoon className="h-28 w-28 text-indigo-300 dark:text-indigo-600 rotate-12 translate-x-8 -translate-y-2" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 opacity-10 pointer-events-none select-none">
                    <Star className="h-24 w-24 text-purple-300 dark:text-purple-600 -translate-x-4 translate-y-4" />
                  </div>
                  
                  <CardHeader className="relative pb-6">
                    <div className="absolute inset-0 overflow-hidden opacity-5">
                      <div className="absolute inset-0 bg-repeat opacity-10" 
                           style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIvPjwvZz48L3N2Zz4=')" }} />
                    </div>
                    
                    <motion.div 
                      className="flex justify-center mb-4"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <div className={`h-16 w-16 rounded-full bg-gradient-to-br from-indigo-200 to-violet-400 dark:from-indigo-700 dark:to-violet-900 flex items-center justify-center text-white text-3xl`}>
                        {signDetails.emoji}
                      </div>
                    </motion.div>
                    
                    <CardTitle className="text-3xl text-center font-serif">
                      <span className="tracking-wide">Kişisel {signDetails.name} Yorumunuz</span>
                    </CardTitle>
                    
                    <div className="flex items-center justify-center mt-3 space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + (i * 0.1) }}
                        >
                          <Sparkles className="h-4 w-4 text-indigo-400" />
                        </motion.div>
                      ))}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <motion.div 
                      className="prose prose-indigo dark:prose-invert mx-auto max-w-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="p-6 rounded-lg bg-white/70 dark:bg-black/10 backdrop-blur-sm border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                        <HoroscopeParagraphs content={horoscope} startDelay={0.6} />
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Kişisel Burç Yorumunuz</CardTitle>
                  <CardDescription>
                    Kendinize özel, detaylı bir burç yorumu alın
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <div className="flex flex-col items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-primary-foreground flex items-center justify-center text-5xl">
                      {signDetails.emoji}
                    </div>
                    <div className="max-w-md">
                      <h3 className="text-lg font-semibold mb-2">Kişisel {signDetails.name} Yorumu</h3>
                      <p className="text-muted-foreground mb-6">
                        Burç yorumlarının çok daha detaylı ve kişisel bir versiyonunu görmek ister misiniz? Kişisel burç yorumu, karakterinizi, ilişkilerinizi, kariyerinizi ve önünüzdeki fırsatları daha derinlemesine analiz eder.
                      </p>
                      
                      <div className="flex justify-center">
                        {user ? (
                          <Button 
                            onClick={handleGetPersonalHoroscope} 
                            disabled={isLoading}
                            className="relative overflow-hidden group bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 px-6"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Yorumunuz hazırlanıyor...
                              </>
                            ) : (
                              <>
                                <span className="relative z-10">Kişisel Yorumu Göster (1 Kredi)</span>
                                <span className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></span>
                              </>
                            )}
                          </Button>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <p className="text-sm text-muted-foreground mb-2">Kişisel burç yorumu için giriş yapmalısınız</p>
                            <AuthModal triggerText="Giriş Yap / Kayıt Ol" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

// Yardımcı bileşenler
function HoroscopeParagraphs({ content, startDelay }: { content: string, startDelay: number }) {
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  
  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <motion.p 
          key={index} 
          className="text-lg leading-relaxed font-serif"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: startDelay + (index * 0.15) }}
        >
          {paragraph}
        </motion.p>
      ))}
    </div>
  );
}

// Burç uyumluluğu için yardımcı fonksiyonlar
function getCompatibleSigns(sign: ZodiacSign): ZodiacSign[] {
  const compatibility: Record<ZodiacSign, ZodiacSign[]> = {
    aries: ['leo', 'sagittarius', 'gemini', 'aquarius'],
    taurus: ['virgo', 'capricorn', 'cancer', 'pisces'],
    gemini: ['libra', 'aquarius', 'aries', 'leo'],
    cancer: ['scorpio', 'pisces', 'taurus', 'virgo'],
    leo: ['aries', 'sagittarius', 'gemini', 'libra'],
    virgo: ['taurus', 'capricorn', 'cancer', 'scorpio'],
    libra: ['gemini', 'aquarius', 'leo', 'sagittarius'],
    scorpio: ['cancer', 'pisces', 'virgo', 'capricorn'],
    sagittarius: ['aries', 'leo', 'libra', 'aquarius'],
    capricorn: ['taurus', 'virgo', 'scorpio', 'pisces'],
    aquarius: ['gemini', 'libra', 'aries', 'sagittarius'],
    pisces: ['cancer', 'scorpio', 'taurus', 'capricorn'],
  };
  
  return compatibility[sign] || [];
}

// Element renklerine göre class belirleyen yardımcı fonksiyon
function getElementColorClass(element: string): string {
  switch(element) {
    case 'Fire':
      return 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300';
    case 'Earth':
      return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300';
    case 'Air':
      return 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300';
    case 'Water':
      return 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300';
    default:
      return 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
  }
}

// Element bazlı güçlü ve zayıf yönler
function getGenericStrengths(element: string): string {
  switch(element) {
    case 'Fire':
      return 'Tutkulu, enerjik, ilham verici, yaratıcı ve cesurdur. İnsanları harekete geçirebilir ve zorlu durumlarda liderlik edebilir.';
    case 'Earth':
      return 'Pratik, güvenilir, disiplinli, çalışkan ve sabırlıdır. Kararlılığı ve gerçekçi yaklaşımıyla zorlu süreçleri yönetebilir.';
    case 'Air':
      return 'İletişimci, sosyal, yenilikçi, analitik ve uyarlanabilir. Farklı fikirleri kavrama ve sentezleme konusunda başarılıdır.';
    case 'Water':
      return 'Sezgisel, duygusal, şefkatli, anlayışlı ve yaratıcıdır. İnsanların duygularını anlama ve onlara destek olma konusunda yeteneklidir.';
    default:
      return 'Kendine özgü güçlü özellikleri ve yetenekleri vardır.';
  }
}

function getGenericWeaknesses(element: string): string {
  switch(element) {
    case 'Fire':
      return 'Bazen sabırsız, bencil ve kontrolsüz olabilir. Hızlı yanmaya meyillidir ve ani öfke patlamaları yaşayabilir.';
    case 'Earth':
      return 'Değişime dirençli, inatçı ve bazen çok kuralcı olabilir. Aşırı muhafazakarlık ve maddiyata bağlılık gösterebilir.';
    case 'Air':
      return 'Dağınık, kararsız ve bazen yüzeysel olabilir. Pratik olmaktan uzaklaşıp teoriye fazla odaklanabilir.';
    case 'Water':
      return 'Aşırı duygusal, manipülatif ve değişken ruh haline sahip olabilir. Gerçeklerden kaçmaya ve hayallere sığınmaya meyillidir.';
    default:
      return 'Kendisine özgü gelişime açık alanları vardır.';
  }
}

// Burçların güçlü ve zayıf yönleri
const zodiacStrengths: Record<ZodiacSign, string> = {
  aries: 'Cesur, enerjik, maceracı, bağımsız ve kendine güvenen. Zorlu durumlarda bile ileriye doğru atılmaktan çekinmez.',
  taurus: 'Güvenilir, sabırlı, pratik, kararlı ve sadık. Zorluklara rağmen hedeflerine ulaşmak için istikrarlı bir şekilde çalışır.',
  gemini: 'Uyarlanabilir, çok yönlü, meraklı, iletişim becerisi yüksek ve zeki. Farklı konularda bilgi edinme ve insanlarla bağlantı kurma konusunda yeteneklidir.',
  cancer: 'Şefkatli, koruyucu, sezgisel, duygusal olarak derin ve sadık. Sevdiklerinin refahını kendi ihtiyaçlarının üstünde tutar.',
  leo: 'Karizmatik, cömert, sadık, yaratıcı ve lider. İnsanları etrafında toplayıp ilham verme konusunda doğal bir yeteneğe sahiptir.',
  virgo: 'Analitik, pratik, çalışkan, detaycı ve güvenilir. Karmaşık sorunları parçalara ayırıp çözebilir.',
  libra: 'Diplomatik, adil, barışçıl, sosyal ve zarif. İnsanlar arasındaki anlaşmazlıkları çözüme kavuşturma konusunda yeteneklidir.',
  scorpio: 'Tutkulu, kararlı, sezgisel, güçlü ve dönüştürücü. Zorluklara göğüs germe ve kendini yeniden yaratma konusunda olağanüstü bir yeteneğe sahiptir.',
  sagittarius: 'İyimser, maceracı, felsefi, dürüst ve enerjik. Yeni fikirler ve deneyimler aramaktan asla vazgeçmez.',
  capricorn: 'Disiplinli, sorumlu, güvenilir, hırslı ve dayanıklı. En zorlu koşullarda bile hedeflerine doğru ilerlemeye devam eder.',
  aquarius: 'Yenilikçi, bağımsız, insancıl, ilerici ve orijinal. Geleneksel kalıpları yıkıp toplum yararına çalışma konusunda öncülük eder.',
  pisces: 'Şefkatli, sanatsal, sezgisel, hayalperest ve fedakar. Başkalarının acılarını anlama ve onlara yardım etme konusunda doğal bir yeteneğe sahiptir.',
};

const zodiacWeaknesses: Record<ZodiacSign, string> = {
  aries: 'Sabırsız, agresif, düşünmeden harekete geçen ve bazen bencil olabilir. Başladığı projeleri bitirmeden yeni maceralara atılma eğilimindedir.',
  taurus: 'İnatçı, değişime dirençli, aşırı sahiplenici ve bazen tembel olabilir. Konfor alanından çıkmak istemeyebilir.',
  gemini: 'Kararsız, dağınık, yüzeysel ve bazen iki yüzlü algılanabilir. Odaklanmakta zorlanabilir ve bir konudan diğerine atlayabilir.',
  cancer: 'Aşırı duygusal, değişken ruh halli, manipülatif ve geçmişe takılı kalabilir. Duygularının esiri olup rasyonel düşünmekte zorlanabilir.',
  leo: 'Egosantrik, inatçı, dominan ve ilgi açlığı çekebilir. Her zaman spotların altında olmak isteyebilir ve eleştiriye karşı aşırı hassas olabilir.',
  virgo: 'Aşırı eleştirel, takıntılı, mükemmeliyetçi ve endişeli olabilir. Detaylara takılıp büyük resmi kaçırma eğilimindedir.',
  libra: 'Kararsız, çatışmadan kaçınan, başkalarına fazla bağımlı ve yüzeysel olabilir. "Hayır" demekte zorlanabilir ve herkesin hoşuna gitmek isteyebilir.',
  scorpio: 'Kıskanç, kontrol edici, şüpheci, manipülatif ve intikamcı olabilir. Güçlü duyguları nedeniyle kendine zarar verici davranışlara yönelebilir.',
  sagittarius: 'Dikkatsiz, taktisiz, sorumluluklardan kaçan ve fazla idealleştirici olabilir. Sözünde durmakta zorlanabilir ve bağlanmaktan korkabilir.',
  capricorn: 'İş odaklı, mesafeli, fazla eleştirel, karamsar ve kontrol bağımlısı olabilir. İlişkileri önemsemeyip yalnızca kariyer hedeflerine odaklanabilir.',
  aquarius: 'Duygusal olarak kopuk, isyankar, alışılmadık, uzak ve değişken olabilir. Toplumsal hedefler uğruna kişisel ilişkileri ihmal edebilir.',
  pisces: 'Gerçeklikten kaçan, kurban psikolojisine bürünen, sınır koyamayan ve kararsız olabilir. Zorluklarla yüzleşmek yerine hayal dünyasına sığınabilir.'
}; 