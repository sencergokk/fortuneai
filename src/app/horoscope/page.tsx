"use client";

import { useState } from "react";
import { zodiacSigns, type ZodiacSign } from "@/types";
import { getHoroscopeReading } from "@/lib/fortune-api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Flame, Leaf, Wind, Droplets } from "lucide-react";
import { ChevronRight } from "lucide-react";
import DailyHoroscopes from "@/components/DailyHoroscopes";

// Element renkleri
const elementColors = {
  Fire: "from-orange-500 to-rose-500 border-rose-300 dark:border-rose-700 hover:shadow-rose-200 dark:hover:shadow-rose-900",
  Earth: "from-emerald-500 to-green-600 border-green-300 dark:border-green-700 hover:shadow-green-200 dark:hover:shadow-green-900",
  Air: "from-sky-400 to-blue-500 border-blue-300 dark:border-blue-700 hover:shadow-blue-200 dark:hover:shadow-blue-900",
  Water: "from-indigo-400 to-violet-500 border-violet-300 dark:border-violet-700 hover:shadow-violet-200 dark:hover:shadow-violet-900",
};

// Element simgeleri
const elementIcons = {
  Fire: <Flame className="h-4 w-4" />,
  Earth: <Leaf className="h-4 w-4" />,
  Air: <Wind className="h-4 w-4" />,
  Water: <Droplets className="h-4 w-4" />,
};

export default function HoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const { user, useOneCredit, credits } = useAuth();

  // Store the useOneCredit function reference
  const useOneCreditFn = useOneCredit;

  const handleSignSelect = (sign: ZodiacSign) => {
    setSelectedSign(sign);
  };

  const handleGetHoroscope = async () => {
    if (!selectedSign) return;

    try {
      // Require a credit for personalized reading
      if (user) {
        const creditUsed = await useOneCreditFn();
        if (!creditUsed) {
          return;
        }
      } else {
        toast.error("Kişisel burç yorumu için giriş yapmanız gerekiyor.");
        return;
      }
    } catch (error) {
      toast.error("Burç yorumu alınırken bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(error);
    }
  };

  // Create a zodiac card component to keep UI consistent
  const ZodiacCard = ({ sign, index }: { sign: ZodiacSign, index: number }) => {
    const signDetails = zodiacSigns[sign];
    
    return (
      <motion.div 
        key={sign}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Link href={`/horoscope/${sign}`}>
          <Card className={`group overflow-hidden border hover:shadow-lg transition-all duration-300 hover:border-${elementColors[signDetails.element].split(' ')[0].replace('from-', '')}-400 h-full`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center mb-2">
                <div className={`flex items-center justify-center text-3xl bg-gradient-to-br ${elementColors[signDetails.element]} p-3 rounded-full text-white shadow-md`}>
                  {signDetails.emoji}
                </div>
                <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-xs">
                  {elementIcons[signDetails.element]}
                  <span>{signDetails.element === 'Fire' ? 'Ateş' : signDetails.element === 'Earth' ? 'Toprak' : signDetails.element === 'Air' ? 'Hava' : 'Su'}</span>
                </div>
              </div>
              <CardTitle className="flex justify-between items-center">
                {signDetails.name}
              </CardTitle>
              <CardDescription className="text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {signDetails.date}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm line-clamp-3">
                {signDetails.element === 'Fire' ? 
                  'Tutkulu, enerjik ve hayat dolu. Liderlik özellikleri ve cesareti ile öne çıkar.' : 
                  signDetails.element === 'Earth' ? 
                  'Pratik, güvenilir ve kararlı. Sabır ve çalışkanlığı ile hedeflerine ulaşır.' : 
                  signDetails.element === 'Air' ? 
                  'İletişimci, sosyal ve analitik. Zekası ve uyumu ile çevresiyle iyi geçinir.' : 
                  'Duygusal, sezgisel ve empatik. Merhametli ve koruyucu özellikler taşır.'}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full group-hover:bg-gradient-to-r group-hover:text-white transition-all duration-300 group-hover:border-transparent group-hover:from-gray-800 group-hover:to-gray-900 dark:group-hover:from-gray-200 dark:group-hover:to-gray-300 dark:group-hover:text-gray-800">
                <span>Günlük Yorum</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="container py-8 md:py-12">
      <motion.div 
        className="mx-auto max-w-[1200px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-4 text-center mb-2">
          <div className="flex items-center gap-2 bg-muted px-4 py-1 rounded-full text-sm mb-2">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date().toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl mb-4">
            Günlük Burç Yorumları
          </h1>
          <p className="text-lg text-muted-foreground max-w-[42rem] mb-4">
            Aşk, kariyer ve sağlık alanında günlük burç yorumlarını inceleyin. Kişisel yorumlar için burcunuzu seçin.
          </p>
        </div>

        {/* Daily horoscopes from API - Showing general comments for all users */}
        <div className="mx-auto mb-16 max-w-[1200px]">
          <div className="text-center mb-4">
            <p className="text-muted-foreground">Bugün yıldızlar senin için ne diyor?</p>
          </div>
          <DailyHoroscopes />
        </div>
        
        {/* Divider */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 