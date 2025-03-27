"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, ShieldCheck, InfoIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Çerez onayı localStorage'da yoksa göster
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (!cookieConsent) {
      // Kullanıcıya hemen göstermek yerine 1 saniye bekle
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 md:bottom-8 inset-x-0 z-50 px-4 md:px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl shadow-xl max-w-4xl mx-auto overflow-hidden border border-pink-100 dark:border-pink-900/30">
            <div className="flex flex-col md:flex-row">
              {/* Dekoratif sol kısım - sadece tablet ve üzeri */}
              <div className="hidden md:flex flex-col items-center justify-center p-6 bg-gradient-to-br from-fuchsia-50 to-violet-50 dark:from-fuchsia-950/40 dark:to-violet-950/40 border-r border-pink-100 dark:border-pink-900/30 w-40">
                <Cookie className="h-12 w-12 text-fuchsia-500 mb-3" />
                <p className="text-center text-xs text-muted-foreground">Çerez Tercihleriniz</p>
              </div>
              
              <div className="flex-1 p-4 md:p-6 relative">
                <button 
                  onClick={() => setIsVisible(false)}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <div className="flex items-center gap-2 mb-2 md:hidden">
                  <Cookie className="h-5 w-5 text-fuchsia-500" />
                  <h3 className="font-medium">Çerez Tercihleriniz</h3>
                </div>
                
                <h3 className="font-medium text-lg hidden md:block mb-2">Çerez Tercihleriniz</h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Size en iyi deneyimi sunmak için çerezleri kullanıyoruz. Web sitemizi kullanarak, 
                  <Link href="/privacy" className="text-fuchsia-600 dark:text-fuchsia-400 hover:underline mx-1">
                    Gizlilik Politikamızı
                  </Link>
                  kabul etmiş olursunuz.
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-fuchsia-500 mt-0.5" />
                    <p className="text-xs">Verilerinizi güvenle saklıyoruz ve kesinlikle 3. taraflarla paylaşmıyoruz.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <InfoIcon className="h-4 w-4 text-fuchsia-500 mt-0.5" />
                    <p className="text-xs">Çerezler, falcılık deneyiminizi kişiselleştirebilmemiz için gereklidir.</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDecline}
                    className="border-pink-200 dark:border-pink-900/30"
                  >
                    Sadece Gerekli Çerezler
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleAccept}
                    className="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 text-white"
                  >
                    Tümünü Kabul Et
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 