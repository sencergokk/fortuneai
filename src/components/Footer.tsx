"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook, Heart, Sparkles, Star, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fortuneTypes } from "@/types";

// Footer için animasyon varyantları
const footerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Dekoratif elementler için animasyon varyantları
const decorElements = [
  { emoji: "✨", delay: 0, top: "10%", left: "5%" },
  { emoji: "🔮", delay: 2, top: "30%", right: "8%" },
  { emoji: "⭐", delay: 1, bottom: "20%", left: "10%" },
  { emoji: "🌙", delay: 3, bottom: "30%", right: "15%" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Lütfen e-posta adresinizi girin");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || "Bülten aboneliğiniz için teşekkürler!");
        setEmail("");
      } else {
        toast.error(data.error || "Bir hata oluştu, lütfen tekrar deneyin.");
      }
    } catch (error) {
      toast.error("İstek sırasında bir hata oluştu.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const footerLinks = [
    { title: "Hakkımızda", href: "/about" },
    { title: "SSS", href: "/faq" },
    { title: "İletişim", href: "/contact" },
    { title: "Kullanım Şartları", href: "/terms" },
    { title: "Gizlilik Politikası", href: "/privacy" },
  ];

  const socialLinks = [
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
  ];

  return (
    <motion.footer 
      className="border-t border-pink-200/30 dark:border-pink-900/20 py-8 md:py-12 relative overflow-hidden bg-white/90 dark:bg-gray-950/90 backdrop-blur-md"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      {/* Dekoratif elementler */}
      {decorElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-purple-400/10 dark:text-purple-400/5 text-3xl pointer-events-none"
          style={{
            top: element.top,
            bottom: element.bottom,
            left: element.left,
            right: element.right,
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            delay: element.delay,
            ease: "easeInOut"
          }}
        >
          {element.emoji}
        </motion.div>
      ))}

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo ve Açıklama */}
          <motion.div 
            className="md:col-span-2" 
            variants={itemVariants}
          >
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-violet-600">
                <Sparkles className="h-5 w-5 inline-block mr-1 text-pink-500" /> Falomi
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Yapay zeka teknolojisi ile desteklenen falcılık deneyimi. Kahve falı, tarot kartları, 
              rüya yorumları ve günlük burç yorumları ile kaderinizi keşfedin.
            </p>
            
            {/* Bülten Aboneliği */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 flex items-center gap-1">
                <Star className="h-4 w-4 text-pink-500" /> 
                Aylık falcılık bültenimize abone olun
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <Input 
                  type="email" 
                  placeholder="E-posta adresiniz" 
                  className="border-pink-200 dark:border-pink-900/30 focus-visible:ring-fuchsia-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 text-white transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Abone Ol
                </Button>
              </form>
            </div>
          </motion.div>
          
          {/* Linkler */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <h4 className="font-medium mb-4 text-fuchsia-600 dark:text-fuchsia-400">Fallarımız</h4>
            <ul className="space-y-2">
              {Object.values(fortuneTypes).map((fortune) => (
                <li key={fortune.path}>
                  <Link 
                    href={fortune.path} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-base text-violet-500 dark:text-violet-400 transition-all duration-300 group-hover:scale-110">
                      {fortune.icon}
                    </span>
                    {fortune.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="md:col-span-1">
            <h4 className="font-medium mb-4 text-fuchsia-600 dark:text-fuchsia-400">Bağlantılar</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.title}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      ✨
                    </span>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="md:col-span-1">
            <h4 className="font-medium mb-4 text-fuchsia-600 dark:text-fuchsia-400">Sosyal Medya</h4>
            <div className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="p-2 rounded-full bg-pink-50 dark:bg-pink-900/20 text-fuchsia-500 dark:text-fuchsia-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-pink-100 dark:group-hover:bg-pink-800/20">
                    {link.icon}
                  </div>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="border-t border-pink-100 dark:border-pink-900/20 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          variants={itemVariants}
        >
          <p className="text-center text-sm text-muted-foreground md:text-left flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} Falomi</span>
            <span className="mx-1">•</span>
            <span>Tüm hakları saklıdır</span>
            <Heart className="h-3 w-3 ml-1 text-pink-500 inline-block" />
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-fuchsia-500 dark:hover:text-fuchsia-400 transition-colors"
            >
              Yatırımcı İlişkileri
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-fuchsia-500 dark:hover:text-fuchsia-400 transition-colors"
            >
              Kariyer Fırsatları
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
} 