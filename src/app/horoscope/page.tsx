"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import DailyHoroscopes from "@/components/DailyHoroscopes";

export default function HoroscopePage() {
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