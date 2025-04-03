"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles, Star } from "lucide-react";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

// Sayfanın ana bileşeni
export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("general");

  // FAQ kategorileri
  const categories = [
    { id: "general", name: "Genel Sorular" },
    { id: "account", name: "Hesap & Üyelik" },
    { id: "fortune", name: "Fallar & Yorumlar" },
    { id: "credits", name: "Krediler & Ödemeler" },
    { id: "technical", name: "Teknik Sorunlar" },
  ];

  // Sıkça sorulan sorular
  const faqItems: FAQItem[] = [
    {
      question: "Falomi nedir?",
      answer: "Falomi, yapay zeka teknolojisi ile desteklenen modern bir falcılık platformudur. Kahve falı, tarot falı, rüya yorumları ve burç yorumları gibi çeşitli falcılık hizmetleri sunuyoruz.",
      category: "general",
    },
    {
      question: "Falomi'de yorumlar nasıl oluşturuluyor?",
      answer: "Falomi'de yorumlar, gelişmiş yapay zeka modelleri kullanılarak oluşturulur. Bu modeller, çeşitli fal türlerinin geleneksel yorumlama metodlarını öğrenmiş ve her kullanıcıya özel kişiselleştirilmiş yorumlar sunabilmektedir.",
      category: "general",
    },
    {
      question: "Falomi ücretli mi?",
      answer: "Falomi'de bazı temel özellikler ücretsizdir. Ancak özel ve detaylı yorumlar için kredi sistemi kullanılmaktadır. Üye olduğunuzda her ay otomatik olarak hesabınıza yüklenen ücretsiz krediler alırsınız.",
      category: "general",
    },
    {
      question: "Hesap oluşturmak ücretsiz mi?",
      answer: "Evet, Falomi'de hesap oluşturmak tamamen ücretsizdir. Üye olduktan sonra her ay 15 ücretsiz kredi alırsınız.",
      category: "account",
    },
    {
      question: "Şifremi unuttum, ne yapmalıyım?",
      answer: "Giriş sayfasındaki 'Şifremi Unuttum' bağlantısını kullanarak şifre sıfırlama e-postası alabilirsiniz. Bu e-posta, kayıtlı e-posta adresinize gönderilir ve şifrenizi güvenli bir şekilde sıfırlamanıza olanak tanır.",
      category: "account",
    },
    {
      question: "Bir fal için kaç kredi harcanır?",
      answer: "Fallar türüne ve detay seviyesine göre farklı kredi miktarları gerektirir. Kahve falı 3 kredi, tarot falı seçtiğiniz kart sayısına göre 1-3 kredi ve rüya yorumları 1 kredi gerektirir. Her falın yanında gereken kredi miktarı belirtilmektedir.",
      category: "fortune",
    },
    {
      question: "Falların doğruluk oranı nedir?",
      answer: "Fallar, geleneksel yöntemlerle veya yapay zeka ile yorumlansa da, geleceği kesin olarak tahmin etmezler. Falomi, eğlence amaçlı hizmet vermektedir ve yorumlar kişisel gelişim ve düşünce süreçlerinize ilham verme amacı taşır.",
      category: "fortune",
    },
    {
      question: "Kahve falı için nasıl fotoğraf çekmeliyim?",
      answer: "Kahve falınız için fincanınızı ters çevirip bekledikten sonra, iyi aydınlatılmış bir ortamda, fincanın iç kısmının net görüneceği şekilde fotoğrafını çekmelisiniz. Birden fazla açıdan çekilmiş fotoğraflar daha doğru yorumlar almanıza yardımcı olur.",
      category: "fortune",
    },
    {
      question: "Kredi satın alma işlemi nasıl yapılır?",
      answer: "Hesabınıza giriş yaptıktan sonra 'Krediler' sayfasına giderek size uygun kredi paketini seçebilir ve güvenli ödeme sistemimiz aracılığıyla satın alabilirsiniz. Kredi kartı, banka kartı ve diğer ödeme yöntemleri kabul edilmektedir.",
      category: "credits",
    },
    {
      question: "Kredi iadesi mümkün mü?",
      answer: "Kullanılmamış krediler için, satın alma tarihinden itibaren 7 gün içinde iade talep edebilirsiniz. İade talepleriniz için lütfen destek ekibimizle iletişime geçin.",
      category: "credits",
    },
    {
      question: "Uygulama sürekli çöküyor, ne yapabilirim?",
      answer: "Öncelikle tarayıcınızı veya uygulamanızı güncelleyin. Çerezleri ve önbelleği temizlemeyi deneyin. Sorun devam ederse, kullandığınız cihaz, işletim sistemi ve tarayıcı bilgileriyle birlikte destek ekibimize bildirin.",
      category: "technical",
    },
    {
      question: "Falomi'yi mobil cihazlarda kullanabilir miyim?",
      answer: "Evet, Falomi tüm modern mobil tarayıcılarda sorunsuz çalışacak şekilde tasarlanmıştır. Ayrıca yakında iOS ve Android için özel uygulamalarımız da hizmetinizde olacaktır.",
      category: "technical",
    },
  ];

  // Aktif kategoriye göre filtrelenmiş sorular
  const filteredFAQs = faqItems.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  return (
    <div className="container py-12 mx-auto max-w-5xl">
      {/* Hero Bölümü */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/40 dark:to-purple-950/40 border border-pink-200 dark:border-pink-900/30 px-4 py-1.5 text-sm font-medium mb-4 shadow-sm">
          <Sparkles className="h-4 w-4 text-pink-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600">
            Yardım Merkezi
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Sıkça Sorulan Sorular</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Falomi hakkında en çok sorulan soruların cevaplarını burada bulabilirsiniz.
          Aradığınız cevabı bulamazsanız, lütfen{" "}
          <Link href="/contact" className="text-primary hover:underline">
            bizimle iletişime geçin
          </Link>
          .
        </p>
      </motion.div>

      {/* Kategori Sekmeleri */}
      <motion.div
        className="mb-8 overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
          <button
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
            onClick={() => setActiveCategory("all")}
          >
            Tümü
          </button>
        </div>
      </motion.div>

      {/* SSS Akordiyon */}
      <motion.div
        className="bg-white dark:bg-gray-950 rounded-xl p-6 border border-border shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Accordion type="single" collapsible className="w-full">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              Bu kategoride henüz soru bulunmamaktadır.
            </div>
          )}
        </Accordion>
      </motion.div>

      {/* İletişim CTA */}
      <motion.div
        className="mt-12 text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 p-6 rounded-xl border border-pink-100 dark:border-pink-900/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-xl font-bold mb-2">Sorunuz hala cevaplanmadı mı?</h3>
        <p className="text-muted-foreground mb-4">
          Merak ettiğiniz başka sorular varsa, doğrudan bizimle iletişime geçebilirsiniz.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
        >
          İletişime Geçin
          <ChevronDown className="h-4 w-4 ml-2 rotate-[-90deg]" />
        </Link>
      </motion.div>

      {/* Sayfa Dekorasyonu */}
      <div className="absolute top-40 right-10 text-6xl text-primary/5 rotate-12 pointer-events-none hidden lg:block">
        <Star />
      </div>
      <div className="absolute bottom-40 left-10 text-6xl text-primary/5 -rotate-12 pointer-events-none hidden lg:block">
        <Sparkles />
      </div>
    </div>
  );
} 