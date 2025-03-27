"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, User, Star, CreditCard, Clock, Zap, Wand, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fortuneTypes } from "@/types";
import { AuthModal } from "@/components/auth/AuthModal";
import { cn } from "@/lib/utils";
import { FloatingElements, GlowingEffect } from "../components/AnimatedElements";

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
  "from-violet-500 to-purple-600 shadow-violet-500/30",
  "from-pink-500 to-rose-600 shadow-pink-500/30",
  "from-teal-500 to-cyan-600 shadow-teal-500/30",
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Arka plan dekoratif elementleri */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-56 h-56 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-56 h-56 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-32 left-1/3 w-56 h-56 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 right-1/3 w-56 h-56 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-6000"></div>
        <div 
          className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px] dark:bg-grid-slate-400/[0.05]"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")` 
          }}
        ></div>
      </div>

      <FloatingElements />
      <GlowingEffect />
      
      <div className="container py-12 md:py-16 lg:py-20 relative z-10">
        {/* Hero section */}
        <motion.div 
          className="mx-auto flex max-w-[980px] flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/40 dark:to-purple-950/40 border border-pink-200 dark:border-pink-900/30 px-4 py-1.5 text-sm font-medium mb-2 group shadow-sm hover:shadow-md transition-all duration-300">
            <Sparkles className="h-4 w-4 text-pink-500 group-hover:animate-ping" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600">Kaderinizi keşfedin ✨</span>
          </div>
          
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl">
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-violet-600 to-purple-600 relative">
              Falomi
              <motion.span 
                className="absolute -top-2 -right-4 text-2xl md:text-4xl"
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ✨
              </motion.span>
            </span>
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
                className="relative shadow-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 transition-all duration-300"
              />
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="outline" size="lg" asChild className="border-2 border-pink-200 dark:border-pink-900/50 hover:bg-pink-50/80 dark:hover:bg-pink-950/20 transition-all duration-300">
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
            <div className="relative mx-auto max-w-[95%] xs:max-w-[90%] aspect-auto xs:aspect-[4/3] sm:aspect-[4/3] md:aspect-[5/2] rounded-xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-pink-200 dark:border-pink-900/30">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/90 to-pink-50/50 dark:from-purple-950/90 dark:to-pink-950/50">
                <div className="absolute inset-0 backdrop-blur-[2px]" />
                
                {/* Dekoratif elementler */}

                <div className="absolute bottom-6 right-6 text-3xl text-pink-300/30 dark:text-pink-300/20 animate-pulse" style={{ animationDelay: "1.5s" }}>✨</div>
                <div className="absolute top-1/2 left-10 text-2xl text-violet-300/30 dark:text-violet-300/20 animate-pulse" style={{ animationDelay: "0.8s" }}>🌙</div>
                <div className="absolute bottom-1/3 right-10 text-2xl text-fuchsia-300/30 dark:text-fuchsia-300/20 animate-pulse" style={{ animationDelay: "2.2s" }}>⭐</div>
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
                          className="w-full max-w-[90px] xs:max-w-[110px] md:max-w-[130px] aspect-square rounded-2xl bg-white/90 dark:bg-gray-800/90 shadow-lg shadow-purple-500/10 flex flex-col items-center justify-center p-2 xs:p-3 md:p-4 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer border border-transparent hover:border-pink-300/50 dark:hover:border-pink-500/30 relative group overflow-hidden"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + (index * 0.1) }}
                          whileHover={{ 
                            y: -8, 
                            boxShadow: "0 15px 30px rgba(168, 85, 247, 0.2)",
                            transition: { duration: 0.3, ease: "easeOut" }
                          }}
                        >
                          {/* Glow effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-400/10 via-transparent to-violet-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          <motion.div 
                            className="text-2xl xs:text-3xl md:text-4xl mb-1 xs:mb-2 md:mb-3 text-violet-500 dark:text-violet-400 transition-all duration-300 relative z-10"
                            whileHover={{ 
                              rotate: [0, -10, 10, -5, 5, 0],
                              scale: 1.1,
                              transition: { duration: 0.6 } 
                            }}
                          >
                            {fortune.icon}
                          </motion.div>
                          <p className="text-[10px] xs:text-xs md:text-sm font-medium text-center relative z-10">{fortune.name}</p>
                          
                          {/* Sparkle decoration on hover */}
                          <motion.div 
                            className="absolute top-0 right-0 text-sm opacity-0 group-hover:opacity-100 text-pink-300"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileHover={{ 
                              opacity: 1, 
                              scale: 1,
                              rotate: [0, 15, -15, 0],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            ✨
                          </motion.div>
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
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40 border border-violet-200 dark:border-violet-900/30 px-4 py-1.5 text-sm font-medium mb-4">
              <Star className="h-4 w-4 text-violet-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">Neden biz?</span>
            </div>
            
            <h2 className="text-3xl font-bold">Neden <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-violet-600">Falomi</span>?</h2>
            <p className="text-muted-foreground mt-3">AI teknolojisi ile desteklenen falcılık deneyimi</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Star className="h-6 w-6 text-white" />,
                title: "Kişiselleştirilmiş Yorumlar",
                description: "Astroloji, tarot ve rüya yorumlarınız AI teknolojisi ile size özel hazırlanır.",
                color: featureColors[0],
                emoji: "✨"
              },
              {
                icon: <CreditCard className="h-6 w-6 text-white" />,
                title: "Aylık Ücretsiz Krediler",
                description: "Üye olun ve her ay hesabınıza otomatik yüklenen 15 ücretsiz kredi ile falınıza bakın.",
                color: featureColors[1],
                emoji: "💎"
              },
              {
                icon: <Clock className="h-6 w-6 text-white" />,
                title: "7/24 Erişim",
                description: "İstediğiniz zaman, istediğiniz yerden falınıza bakabilirsiniz. Bekleme yok, sıra yok!",
                color: featureColors[2],
                emoji: "🌙"
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="border overflow-hidden group bg-white/80 dark:bg-gray-950/80 hover:border-pink-300/50 dark:hover:border-pink-700/50 transition-all duration-300 h-full backdrop-blur-sm">
                  <CardHeader>
                    <div className="relative">
                      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br", feature.color)} />
                      <div className="mx-auto p-3 rounded-full bg-primary/10 group-hover:bg-transparent w-14 h-14 flex items-center justify-center mb-3 relative transition-all duration-300 z-10">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 text-primary group-hover:text-white transition-colors duration-300">
                          {feature.icon}
                        </div>
                      </div>
                      
                      <motion.div 
                        className="absolute -top-1 -right-1 text-xl opacity-40 dark:opacity-30"
                        animate={{ 
                          y: [0, -5, 0],
                          opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.8
                        }}
                      >
                        {feature.emoji}
                      </motion.div>
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
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-50 to-fuchsia-50 dark:from-pink-950/40 dark:to-fuchsia-950/40 border border-pink-200 dark:border-pink-900/30 px-4 py-1.5 text-sm font-medium mb-4">
              <Star className="h-4 w-4 text-pink-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-fuchsia-600">Hizmetlerimiz</span>
            </div>
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
                <Card className="flex flex-col h-full group overflow-hidden border-2 border-pink-100 dark:border-pink-900/20 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm relative">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Shimmering background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-400/5 via-transparent to-violet-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardHeader className="pb-2 relative">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                      <motion.div 
                        className="text-3xl md:text-4xl text-violet-500 dark:text-violet-400"
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                      >
                        {fortune.icon}
                      </motion.div>

                    </div>
                    <CardTitle className="text-base md:text-xl group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors duration-300">{fortune.name}</CardTitle>
                    <CardDescription className="mt-2 md:mt-3 text-sm md:text-base">{fortune.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto pt-3 md:pt-4 relative z-10">
                    <Button 
                      asChild 
                      className="w-full bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white hover:from-fuchsia-600 hover:to-violet-700 transition-all transform group-hover:translate-y-[-2px] duration-300 shadow-lg shadow-violet-500/20"
                    >
                      <Link href={fortune.path} className="flex items-center justify-center gap-1">
                        Keşfet
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials section with new styling */}
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
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-50 to-violet-50 dark:from-fuchsia-950/40 dark:to-violet-950/40 border border-fuchsia-200 dark:border-fuchsia-900/30 px-4 py-1.5 text-sm font-medium mb-4">
              <Star className="h-4 w-4 text-fuchsia-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-violet-600">Kullanıcı Yorumları</span>
            </div>
            <h2 className="text-3xl font-bold">Kullanıcılarımız Ne Diyor?</h2>
            <p className="text-muted-foreground mt-3">Binlerce mutlu kullanıcı arasına katılın</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                content: "FortuneAI sayesinde hayatımdaki değişimlere çok daha hazır hissediyorum. Tarot falı özellikle inanılmaz doğru sonuçlar veriyor!",
                name: "Ayşe K.",
                duration: "3 aydır üye",
                emoji: "✨",
                color: "from-violet-500/10 to-fuchsia-500/10"
              },
              {
                content: "Kahve falı yorumları gerçekten şaşırtıcı derecede isabetli. AI'nın bu kadar iyi yorum yapabilmesi inanılmaz. Aylık krediler de çok iyi düşünülmüş.",
                name: "Mehmet Y.",
                duration: "6 aydır üye",
                emoji: "☕",
                color: "from-pink-500/10 to-rose-500/10"
              }
            ].map((testimonial, index) => (
              <motion.div key={index} variants={fadeIn} transition={{ delay: index * 0.1 }}>
                <Card className="overflow-hidden group border-2 border-pink-100 dark:border-pink-900/20 bg-gradient-to-br bg-white/90 dark:bg-gray-950/90 h-full hover:border-pink-300/50 dark:hover:border-pink-700/50 transition-all backdrop-blur-sm relative">
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${testimonial.color}`} />
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-400/40 via-violet-500/80 to-fuchsia-400/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  
                  <CardContent className="relative pt-8">
                    <motion.div 
                      className="absolute top-6 right-6 text-2xl opacity-30 dark:opacity-20 group-hover:opacity-60 transition-opacity"
                      animate={{ 
                        rotate: [0, 10, -10, 10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ 
                        duration: 5,
                        repeat: Infinity,
                        delay: index * 1.2
                      }}
                    >
                      {testimonial.emoji}
                    </motion.div>
                    
                    <motion.div className="mb-6 text-lg font-serif italic text-muted-foreground relative">
                      {/* Decorative quotes */}
                      <span className="absolute -top-2 -left-2 text-4xl text-pink-300/20 dark:text-pink-700/10 font-serif">&quot;</span>
                      <span className="absolute -bottom-4 -right-2 text-4xl text-pink-300/20 dark:text-pink-700/10 font-serif">&quot;</span>
                      
                      &quot;{testimonial.content}&quot;
                    </motion.div>
                    
                    <div className="mt-6 flex items-center gap-3">
                      <div className="relative rounded-full bg-gradient-to-br from-fuchsia-100 to-violet-100 dark:from-fuchsia-900/20 dark:to-violet-900/20 w-10 h-10 flex items-center justify-center group-hover:from-fuchsia-200 group-hover:to-violet-200 dark:group-hover:from-fuchsia-900/30 dark:group-hover:to-violet-900/30 transition-colors">
                        <User className="h-5 w-5 text-fuchsia-500 dark:text-fuchsia-400" />
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
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950/50 dark:to-pink-950/50 p-8 md:p-10 shadow-2xl border border-pink-200 dark:border-pink-900/30 backdrop-blur-sm">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-400/40 via-violet-500/80 to-fuchsia-400/40" />
            
            <div className="relative z-10 flex flex-col items-center gap-6 text-center">
              <div className="flex items-center gap-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm px-4 py-2 text-sm font-medium border border-pink-200/50 dark:border-pink-900/30">
                <Wand className="h-4 w-4 text-fuchsia-500 dark:text-fuchsia-400" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-violet-600">Hemen üye olun, 15 kredi hediye!</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tighter">
                <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-violet-600">Falomi</span> ile kaderinizi keşfedin
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
                  className="mt-4 relative bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 shadow-xl shadow-violet-500/20"
                />
              </motion.div>
              
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {[
                  { icon: <Zap className="h-5 w-5 text-amber-500" />, text: "15 ücretsiz kredi" },
                  { icon: <ShieldCheck className="h-5 w-5 text-teal-500" />, text: "Güvenli ve gizli" },
                  { icon: <Star className="h-5 w-5 text-pink-500" />, text: "Kişiye özel yorumlar" },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
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
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
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
        @keyframes float-slow {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(15px); }
          100% { transform: translateY(0) translateX(0); }
        }
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
