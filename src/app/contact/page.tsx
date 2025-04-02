"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare, Send, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form doğrulaması
    if (!formState.name || !formState.email || !formState.subject || !formState.message) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }
    
    // E-posta doğrulaması
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      toast.error("Lütfen geçerli bir e-posta adresi girin");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Gerçek projede bir API çağrısı yapılabilir
      // Simüle edilmiş bir gecikme
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Mesajınız başarıyla gönderildi! En kısa sürede size yanıt vereceğiz.");
      
      // Formu temizle
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-pink-500" />,
      title: "E-posta",
      details: "destek@falomi.com.tr",
      action: "mailto:destek@falomi.com.tr",
      actionLabel: "E-posta Gönder",
    },
    {
      icon: <Phone className="h-6 w-6 text-violet-500" />,
      title: "Telefon",
      details: "+90 (212) 123 45 67",
      action: "tel:+902121234567",
      actionLabel: "Hemen Ara",
    },
    {
      icon: <MapPin className="h-6 w-6 text-fuchsia-500" />,
      title: "Adres",
      details: "Levent, 34330, İstanbul, Türkiye",
      action: "https://maps.google.com",
      actionLabel: "Haritada Gör",
    },
  ];

  return (
    <div className="container py-12 mx-auto max-w-6xl">
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/40 dark:to-purple-950/40 border border-pink-200 dark:border-pink-900/30 px-4 py-1.5 text-sm font-medium mb-4 shadow-sm">
          <Sparkles className="h-4 w-4 text-pink-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600">
            Bize Ulaşın
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4">İletişim</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz. Size en kısa sürede yanıt vereceğiz.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {contactInfo.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-950 rounded-xl p-6 border border-border shadow-sm text-center flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="p-4 rounded-full bg-gradient-to-r from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/40 dark:to-pink-950/40 mb-4">
              {item.icon}
            </div>
            <h3 className="text-lg font-medium mb-2">{item.title}</h3>
            <p className="text-muted-foreground mb-4">{item.details}</p>
            <a
              href={item.action}
              target={item.title === "Adres" ? "_blank" : undefined}
              rel={item.title === "Adres" ? "noopener noreferrer" : undefined}
              className="text-primary hover:underline flex items-center gap-1 text-sm"
            >
              {item.actionLabel} →
            </a>
          </motion.div>
        ))}
      </div>

      {/* İletişim Formu ve SSS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <motion.div
          className="bg-white dark:bg-gray-950 rounded-xl p-6 md:p-8 border border-border shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">İletişim Formu</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Adınız Soyadınız</Label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                placeholder="Adınız Soyadınız"
                className="border-input focus-visible:ring-primary/40"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta Adresiniz</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleInputChange}
                placeholder="ornek@email.com"
                className="border-input focus-visible:ring-primary/40"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Konu</Label>
              <Select
                value={formState.subject}
                onValueChange={handleSelectChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full border-input focus-visible:ring-primary/40">
                  <SelectValue placeholder="Bir konu seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Genel Bilgi</SelectItem>
                  <SelectItem value="support">Teknik Destek</SelectItem>
                  <SelectItem value="billing">Ödeme ve Faturalama</SelectItem>
                  <SelectItem value="partnership">İş Birliği</SelectItem>
                  <SelectItem value="feedback">Geri Bildirim</SelectItem>
                  <SelectItem value="other">Diğer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mesajınız</Label>
              <Textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleInputChange}
                placeholder="Mesajınızı buraya yazın..."
                className="min-h-[120px] border-input focus-visible:ring-primary/40"
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              className={cn(
                "w-full mt-2 bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 transition-all duration-300 text-white",
                isLoading && "opacity-80"
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" /> Mesaj Gönder
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* FAQ ve Destek */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white dark:bg-gray-950 rounded-xl p-6 md:p-8 border border-border shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Sıkça Sorulan Sorular</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Ne kadar sürede yanıt alacağım?</h4>
                <p className="text-sm text-muted-foreground">
                  Mesajlarınıza genellikle 24 saat içinde yanıt vermeye çalışıyoruz. Yoğun dönemlerde bu süre 48 saate kadar uzayabilir.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Teknik sorunları nasıl bildirebilirim?</h4>
                <p className="text-sm text-muted-foreground">
                  İletişim formunda &quot;Teknik Destek&quot; konusunu seçerek yaşadığınız sorunu detaylı bir şekilde açıklayabilirsiniz.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">İş birliği teklifleri için ne yapmalıyım?</h4>
                <p className="text-sm text-muted-foreground">
                  İş birliği teklifleriniz için iletişim formunda &quot;İş Birliği&quot; konusunu seçebilir veya doğrudan <a href="mailto:isbirligi@falomi.com.tr" className="text-primary hover:underline">isbirligi@falomi.com.tr</a> adresine e-posta gönderebilirsiniz.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/faq"
                className="text-primary hover:underline flex items-center gap-1 text-sm"
              >
                Tüm sıkça sorulan soruları görüntüle →
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/40 dark:to-pink-950/40 rounded-xl p-6 md:p-8 border border-pink-100 dark:border-pink-900/30 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Acil Yardım mı Gerekiyor?</h3>
            <p className="text-muted-foreground mb-4">
              Hesap güvenliği veya ödeme sorunları gibi acil durumlar için müşteri hizmetlerimizi arayabilirsiniz.
            </p>
            <div className="bg-white/60 dark:bg-gray-900/60 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="font-medium">+90 (212) 123 45 67</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Hafta içi 09:00 - 18:00
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 