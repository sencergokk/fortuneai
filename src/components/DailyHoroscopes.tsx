'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from 'lucide-react';

// Zodyak işaretleri ve simgeleri
const zodiacIcons = {
  'aries': '♈',
  'taurus': '♉',
  'gemini': '♊',
  'cancer': '♋',
  'leo': '♌',
  'virgo': '♍',
  'libra': '♎',
  'scorpio': '♏',
  'sagittarius': '♐',
  'capricorn': '♑',
  'aquarius': '♒',
  'pisces': '♓',
};

// Zodyak işaretlerinin Türkçe karşılıkları
const zodiacNamesTR = {
  'aries': 'Koç',
  'taurus': 'Boğa',
  'gemini': 'İkizler',
  'cancer': 'Yengeç',
  'leo': 'Aslan',
  'virgo': 'Başak',
  'libra': 'Terazi',
  'scorpio': 'Akrep',
  'sagittarius': 'Yay',
  'capricorn': 'Oğlak',
  'aquarius': 'Kova',
  'pisces': 'Balık',
};

// Tarihleri Türkçeye çeviren fonksiyon
const getZodiacDate = (sign: string) => {
  switch (sign) {
    case 'aries': return '21 Mart - 20 Nisan';
    case 'taurus': return '21 Nisan - 20 Mayıs';
    case 'gemini': return '21 Mayıs - 21 Haziran';
    case 'cancer': return '22 Haziran - 22 Temmuz';
    case 'leo': return '23 Temmuz - 22 Ağustos';
    case 'virgo': return '23 Ağustos - 22 Eylül';
    case 'libra': return '23 Eylül - 22 Ekim';
    case 'scorpio': return '23 Ekim - 21 Kasım';
    case 'sagittarius': return '22 Kasım - 21 Aralık';
    case 'capricorn': return '22 Aralık - 20 Ocak';
    case 'aquarius': return '21 Ocak - 18 Şubat';
    case 'pisces': return '19 Şubat - 20 Mart';
    default: return '';
  }
};

// Horoscope tipi
type Horoscope = {
  sign: string;
  sign_tr: string;
  content: string;
  updated_at: string;
};

export default function DailyHoroscopes() {
  const [horoscopes, setHoroscopes] = useState<Horoscope[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // Günlük burç yorumlarını getir
  useEffect(() => {
    const fetchHoroscopes = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching horoscopes from API...');
        
        const response = await fetch('/api/daily-horoscopes');
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error details:', errorText);
          throw new Error(`Failed to fetch horoscopes: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        if (data.horoscopes && Array.isArray(data.horoscopes) && data.horoscopes.length > 0) {
          console.log('Setting horoscopes data:', data.horoscopes.length, 'items');
          setHoroscopes(data.horoscopes);
          
          // Son güncelleme tarihini ayarla
          if (data.horoscopes[0].updated_at) {
            const updateDate = new Date(data.horoscopes[0].updated_at);
            setLastUpdated(updateDate.toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }));
          }
        } else if (data.error) {
          console.error('API returned error:', data.error);
          setError(data.error);
        } else {
          console.error('No horoscopes data in response');
          setError('Burç yorumları yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        }
      } catch (error) {
        console.error('Error fetching horoscopes:', error);
        setError('Burç yorumları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHoroscopes();
  }, []);
  
  // Manuel yeniden deneme için
  const handleManualRetry = () => {
    setLoading(true);
    // Burç yorumlarını tekrar yükle
    fetch('/api/daily-horoscopes')
      .then(response => response.json())
      .then(data => {
        if (data.horoscopes) {
          setHoroscopes(data.horoscopes);
          setError(null);
        }
      })
      .catch(error => {
        console.error('Error retrying fetch:', error);
        setError('Yenileme başarısız. Lütfen daha sonra tekrar deneyin.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  // Yükleme durumu gösterge (Skeleton)
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(12).fill(0).map((_, index) => (
            <Card key={index} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="flex-1">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  // Hata varsa göster
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4 text-red-500">
          <p>{error}</p>
        </div>
        <Button onClick={handleManualRetry} variant="outline">
          Tekrar Dene
        </Button>
      </div>
    );
  }
  
  // Veri yoksa göster
  if (!horoscopes || horoscopes.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4 text-muted-foreground">Şu anda burç yorumları görüntülenemiyor.</p>
        <Button onClick={handleManualRetry} variant="outline">
          Tekrar Dene
        </Button>
      </div>
    );
  }
  
  // İçeriği özet veya tam olarak göster, veri varsa
  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mx-auto">
          <TabsTrigger value="overview">Özet Görünüm</TabsTrigger>
          <TabsTrigger value="detailed">Detaylı Görünüm</TabsTrigger>
        </TabsList>
        
        {lastUpdated && (
          <div className="text-center mt-2 text-sm text-muted-foreground">
            Son güncelleme: {lastUpdated}
          </div>
        )}
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {horoscopes.map((horoscope) => (
              <Card key={horoscope.sign} className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl">{zodiacIcons[horoscope.sign as keyof typeof zodiacIcons] || '⭐'}</div>
                    <CardTitle className="text-xl">{zodiacNamesTR[horoscope.sign as keyof typeof zodiacNamesTR] || horoscope.sign_tr || horoscope.sign}</CardTitle>
                  </div>
                  <CardDescription>{getZodiacDate(horoscope.sign) || 'Tarih bilgisi alınamadı'}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="line-clamp-4 text-sm text-muted-foreground">
                    {horoscope.content || 'Burç yorumu alınamadı.'}
                  </p>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/horoscope/${horoscope.sign}`}>
                      Devamını Oku
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="detailed" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {horoscopes.map((horoscope) => (
              <Card key={horoscope.sign} className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl">{zodiacIcons[horoscope.sign as keyof typeof zodiacIcons] || '⭐'}</div>
                    <CardTitle className="text-xl">{zodiacNamesTR[horoscope.sign as keyof typeof zodiacNamesTR] || horoscope.sign_tr || horoscope.sign}</CardTitle>
                  </div>
                  <CardDescription>{getZodiacDate(horoscope.sign) || 'Tarih bilgisi alınamadı'}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {horoscope.content || 'Burç yorumu alınamadı.'}
                  </p>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button asChild className="w-full">
                    <Link href={`/horoscope/${horoscope.sign}`}>
                      Tam Sayfada Gör
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 