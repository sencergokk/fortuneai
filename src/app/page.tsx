"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, User, Star, CreditCard, Clock, Zap, Wand, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fortuneTypes } from "@/types";
import { AuthModal } from "@/components/auth/AuthModal";
import { cn } from "@/lib/utils";

// Animasyon varyantları
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Özellik kartları için renkler
const featureColors = [
  "from-purple-500 to-indigo-600 shadow-purple-500/20",
  "from-amber-500 to-orange-600 shadow-amber-500/20",
  "from-emerald-500 to-teal-600 shadow-emerald-500/20",
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Arka plan dekoratif elementleri */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-56 h-56 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-56 h-56 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-32 left-1/3 w-56 h-56 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        <div 
          className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px] dark:bg-grid-slate-400/[0.05]"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")` 
          }}
        ></div>
      </div>
      
      <div className="container py-12 md:py-16 lg:py-20 relative z-10">
        {/* Hero section */}
        <motion.div 
          className="mx-auto flex max-w-[980px] flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-1.5 text-sm font-medium mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Kaderinizi keşfedin ✨</span>
          </div>
          
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl">
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-primary to-pink-600">Falomi</span>
            <span className="block mt-2 md:mt-4">Fal Dünyası</span>
          </h1>
          
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Geleceğinizi keşfedin, yıldızların sırlarını çözün, tarot kartlarının bilgeliğine kulak verin.
          </p>
          
          <div className="relative mt-2 flex flex-wrap gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <AuthModal 
                triggerText="Ücretsiz Kayıt Ol" 
                defaultTab="sign-up" 
                triggerVariant="default" 
                buttonSize="lg"
                className="relative shadow-xl bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 transition-all duration-300"
              />
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="outline" size="lg" asChild className="border-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300">
                <Link href="/horoscope">Günlük Burçları Gör</Link>
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            className="w-full mt-12 md:mt-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="relative mx-auto max-w-[95%] xs:max-w-[90%] aspect-auto xs:aspect-[4/3] sm:aspect-[4/3] md:aspect-[5/2] rounded-xl overflow-hidden shadow-2xl shadow-primary/20 border border-gray-200 dark:border-gray-800">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100/90 to-white/50 dark:from-gray-900/90 dark:to-gray-800/50">
                <div className="absolute inset-0 backdrop-blur-[2px]" />
              </div>
              
              <div className="relative h-full w-full p-3 xs:p-4 md:p-6 flex items-center justify-center">
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 md:gap-4 w-full">
                  {Object.entries(fortuneTypes).map(([key, fortune], index) => (
                    <div key={key} className="flex items-center justify-center">
                      <Link 
                        href={fortune.path} 
                        className="w-full flex items-center justify-center"
                      >
                        <motion.div 
                          className="w-full max-w-[90px] xs:max-w-[110px] md:max-w-[130px] aspect-square rounded-2xl bg-white dark:bg-gray-800 shadow-lg flex flex-col items-center justify-center p-2 xs:p-3 md:p-4 hover:shadow-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + (index * 0.1) }}
                          whileHover={{ 
                            y: -8, 
                            boxShadow: "0 15px 30px rgba(125, 125, 125, 0.12)",
                            transition: { duration: 0.3, ease: "easeOut" }
                          }}
                        >
                          <div className="text-2xl xs:text-3xl md:text-4xl mb-1 xs:mb-2 md:mb-3 transition-transform duration-300 group-hover:scale-110">{fortune.icon}</div>
                          <p className="text-[10px] xs:text-xs md:text-sm font-medium text-center">{fortune.name}</p>
                        </motion.div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features section */}
        <motion.div 
          className="mx-auto mt-24 max-w-[980px]"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div 
            className="text-center mb-12"
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold">Neden <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-600">Falomi</span>?</h2>
            <p className="text-muted-foreground mt-3">AI teknolojisi ile desteklenen falcılık deneyimi</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Star className="h-6 w-6 text-white" />,
                title: "Kişiselleştirilmiş Yorumlar",
                description: "Astroloji, tarot ve rüya yorumlarınız AI teknolojisi ile size özel hazırlanır.",
                color: featureColors[0]
              },
              {
                icon: <CreditCard className="h-6 w-6 text-white" />,
                title: "Aylık Ücretsiz Krediler",
                description: "Üye olun ve her ay hesabınıza otomatik yüklenen 15 ücretsiz kredi ile falınıza bakın.",
                color: featureColors[1]
              },
              {
                icon: <Clock className="h-6 w-6 text-white" />,
                title: "7/24 Erişim",
                description: "İstediğiniz zaman, istediğiniz yerden falınıza bakabilirsiniz. Bekleme yok, sıra yok!",
                color: featureColors[2]
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="border overflow-hidden group bg-white dark:bg-gray-950 hover:border-primary/50 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="relative">
                      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br", feature.color)} />
                      <div className="mx-auto p-3 rounded-full bg-primary/10 group-hover:bg-transparent w-14 h-14 flex items-center justify-center mb-3 relative transition-all duration-300 z-10">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 text-primary group-hover:text-white transition-colors duration-300">
                          {feature.icon}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-center group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Services section */}
        <motion.div 
          className="mx-auto mt-24 max-w-[980px]"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div 
            className="text-center mb-12"
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold">Keşfedin</h2>
            <p className="text-muted-foreground mt-3">Sunduğumuz falcılık hizmetleri</p>
          </motion.div>
          
          <div className="mx-auto grid justify-center gap-4 md:gap-6 grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(fortuneTypes).map(([key, fortune], index) => (
              <motion.div 
                key={key}
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="flex flex-col h-full group overflow-hidden border-2 bg-white dark:bg-gray-950">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                      <div className="text-3xl md:text-4xl transform group-hover:scale-110 transition-transform duration-300">{fortune.icon}</div>
                      <CardTitle className="text-base md:text-xl group-hover:text-primary transition-colors duration-300">{fortune.name}</CardTitle>
                    </div>
                    <CardDescription className="mt-2 md:mt-3 text-sm md:text-base">{fortune.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto pt-3 md:pt-4">
                    <Button 
                      asChild 
                      className="w-full bg-gradient-to-r from-primary/80 to-primary text-white hover:from-primary hover:to-primary/90 transition-all transform group-hover:translate-y-[-2px] duration-300 shadow-lg shadow-primary/20"
                    >
                      <Link href={fortune.path} className="flex items-center justify-center gap-1">
                        Keşfet
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials section */}
        <motion.div 
          className="mx-auto max-w-[980px] mt-24"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div 
            className="text-center mb-12"
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold">Kullanıcılarımız Ne Diyor?</h2>
            <p className="text-muted-foreground mt-3">Binlerce mutlu kullanıcı arasına katılın</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                content: "FortuneAI sayesinde hayatımdaki değişimlere çok daha hazır hissediyorum. Tarot falı özellikle inanılmaz doğru sonuçlar veriyor!",
                name: "Ayşe K.",
                duration: "3 aydır üye",
                emoji: "✨"
              },
              {
                content: "Kahve falı yorumları gerçekten şaşırtıcı derecede isabetli. AI'nın bu kadar iyi yorum yapabilmesi inanılmaz. Aylık krediler de çok iyi düşünülmüş.",
                name: "Mehmet Y.",
                duration: "6 aydır üye",
                emoji: "☕"
              }
            ].map((testimonial, index) => (
              <motion.div key={index} variants={fadeIn} transition={{ delay: index * 0.1 }}>
                <Card className="overflow-hidden group border-2 bg-white dark:bg-gray-950 h-full hover:border-primary/30 transition-all">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary/80 to-primary/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  
                  <CardContent className="relative pt-8">
                    <div className="absolute top-6 right-6 text-2xl opacity-30 dark:opacity-20 group-hover:opacity-60 transition-opacity">{testimonial.emoji}</div>
                    
                    <motion.div className="mb-6 text-lg font-serif italic text-muted-foreground">
                      &quot;{testimonial.content}&quot;
                    </motion.div>
                    
                    <div className="mt-6 flex items-center gap-3">
                      <div className="relative rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.duration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA section */}
        <motion.div 
          className="mx-auto max-w-[980px] mt-24 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-950 p-8 md:p-10 shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
            
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />
            </div>
            
            <div className="relative z-10 flex flex-col items-center gap-6 text-center">
              <div className="flex items-center gap-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm px-4 py-2 text-sm font-medium">
                <Wand className="h-4 w-4 text-primary" />
                <span>Hemen üye olun, 15 kredi hediye!</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tighter">
                <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-600">Falomi</span> ile kaderinizi keşfedin
              </h2>
              
              <p className="max-w-[700px] text-muted-foreground">
                Yapay zeka teknolojisi ile desteklenen fallarımız size özel ve kişiselleştirilmiş yorumlar sunar. 
                Burçlarınızdan tutun, tarot kartlarına, kahve falından rüya yorumlarına kadar her şey Falomi&apos;de.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <AuthModal 
                  triggerText="Hemen Ücretsiz Kayıt Ol" 
                  defaultTab="sign-up" 
                  triggerVariant="default" 
                  buttonSize="lg"
                  className="mt-4 relative bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 shadow-xl shadow-primary/20"
                />
              </motion.div>
              
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {[
                  { icon: <Zap className="h-5 w-5" />, text: "15 ücretsiz kredi" },
                  { icon: <ShieldCheck className="h-5 w-5" />, text: "Güvenli ve gizli" },
                  { icon: <Star className="h-5 w-5" />, text: "Kişiye özel yorumlar" },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .text-gradient {
          background-size: 400% 400%;
          animation: gradient 8s ease infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
