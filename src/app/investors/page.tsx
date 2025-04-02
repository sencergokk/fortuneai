"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, TrendingUp, Users, PieChart, BarChart3, Download, Building2, FileText, Mail, ExternalLink, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InvestorsPage() {
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
          <TrendingUp className="h-4 w-4 text-pink-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600">
            Yatırımcı Merkezi
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Yatırımcı İlişkileri</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Falomi&apos;nin büyüme hikayesi, finansal performansı ve geleceğe yönelik stratejileri hakkında yatırımcı bilgileri.
        </p>
      </motion.div>

      {/* Hero Banner */}
      <motion.div
        className="relative w-full h-80 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl overflow-hidden mb-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 p-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Dijital Fal Pazarında Öncü</h2>
          <p className="text-lg md:text-xl max-w-2xl text-center mb-8">
            2021&apos;den beri dijital fal ve astroloji pazarının lider oyuncusu olarak hızlı büyüme ve sürdürülebilir iş modeli ile yatırımcılarımıza değer yaratıyoruz.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-purple-600 hover:bg-gray-100 hover:text-purple-700">
              <Download className="h-4 w-4 mr-2" />
              Yatırımcı Sunumu
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/20">
              <FileText className="h-4 w-4 mr-2" />
              2023 Yıllık Rapor
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Finansal Göstergeler */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Finansal Göstergeler</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Yıllık Gelir Artışı",
              value: "+124%",
              description: "Son finansal yılda önceki yıla göre gelir artışı",
              icon: <TrendingUp className="h-8 w-8 text-emerald-500" />,
              color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/30",
            },
            {
              title: "Aktif Kullanıcılar",
              value: "1.2M+",
              description: "Aylık aktif kullanıcı sayısı (MAU)",
              icon: <Users className="h-8 w-8 text-blue-500" />,
              color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/30",
            },
            {
              title: "Kârlılık Oranı",
              value: "38%",
              description: "FAVÖK marjı (EBITDA)",
              icon: <PieChart className="h-8 w-8 text-violet-500" />,
              color: "bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-900/30",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`rounded-xl p-6 border shadow-sm ${item.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">{item.title}</h3>
                {item.icon}
              </div>
              <p className="text-3xl font-bold mb-2">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Yatırımcı Dokumanları */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Yatırımcı Dökümanları</h2>
        </div>
        
        <div className="bg-white dark:bg-gray-950 rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {[
              {
                title: "Finansal Raporlar",
                items: [
                  { name: "2023 Yıllık Rapor", date: "15 Mart 2024" },
                  { name: "2023 Q4 Sonuçları", date: "31 Ocak 2024" },
                  { name: "2023 Q3 Sonuçları", date: "31 Ekim 2023" },
                  { name: "2022 Yıllık Rapor", date: "15 Mart 2023" },
                ],
              },
              {
                title: "Yatırımcı Sunumları",
                items: [
                  { name: "Kurumsal Sunum 2024", date: "5 Ocak 2024" },
                  { name: "Büyüme Stratejisi", date: "15 Kasım 2023" },
                  { name: "Yatırımcı Günü 2023", date: "20 Eylül 2023" },
                  { name: "Pazar Analizi", date: "10 Haziran 2023" },
                ],
              },
              {
                title: "Kurumsal Yönetim",
                items: [
                  { name: "Yönetim Kurulu", date: "Güncel" },
                  { name: "Kurumsal Yönetim İlkeleri", date: "15 Şubat 2024" },
                  { name: "Etik Kurallar", date: "10 Ocak 2024" },
                  { name: "Sürdürülebilirlik Raporu", date: "1 Aralık 2023" },
                ],
              },
              {
                title: "Basın Bültenleri",
                items: [
                  { name: "Yeni Özellik Lansmanı", date: "25 Mart 2024" },
                  { name: "Kullanıcı Sayısındaki Artış", date: "10 Şubat 2024" },
                  { name: "Yeni Ortaklık Duyurusu", date: "5 Ocak 2024" },
                  { name: "Stratejik Büyüme Planı", date: "15 Kasım 2023" },
                ],
              },
            ].map((category, index) => (
              <div key={index} className="p-6">
                <h3 className="text-lg font-medium mb-4">{category.title}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href="#"
                        className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 p-2 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center">
                          <Download className="h-4 w-4 text-pink-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span>{item.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Hakkımızda & Vizyon */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Şirket & Vizyon</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-950 rounded-xl p-6 border border-border shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Şirket Profili</h3>
            <p className="text-muted-foreground mb-4">
              Falomi, 2021 yılında kurulmuş, dijital fal ve astroloji hizmetleri sunan öncü bir teknoloji şirketidir. Günümüzde 1.2 milyondan fazla aktif kullanıcıya hizmet vermekteyiz.
            </p>
            <p className="text-muted-foreground mb-4">
              Şirketimiz, yapay zeka destekli kahve falı, tarot, astroloji, ve rüya yorumları gibi çeşitli fal hizmetleri sunarak kişiselleştirilmiş manevi deneyimler sunmaktadır.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="font-medium">Kuruluş</h4>
                <p className="text-sm text-muted-foreground">2021, İstanbul, Türkiye</p>
              </div>
              <div>
                <h4 className="font-medium">Çalışan Sayısı</h4>
                <p className="text-sm text-muted-foreground">85+ çalışan (2024 itibarıyla)</p>
              </div>
              <div>
                <h4 className="font-medium">Pazarlar</h4>
                <p className="text-sm text-muted-foreground">Türkiye, MENA bölgesi, ve Avrupa</p>
              </div>
              <div>
                <h4 className="font-medium">Toplam Yatırım</h4>
                <p className="text-sm text-muted-foreground">$12.5M (Seri A finansmanı dahil)</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-xl p-6 border border-border shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Büyüme & Vizyon</h3>
            <p className="text-muted-foreground mb-4">
              Falomi olarak vizyonumuz, kişiselleştirilmiş manevi içgörü ve kehanet hizmetlerinde dünyanın lider dijital platformu olmaktır. Misyonumuz, geleneksel fal sanatlarını modern teknoloji ile birleştirerek herkes için erişilebilir, saygılı ve aydınlatıcı deneyimler sunmaktır.
            </p>
            
            <h4 className="font-medium mt-6 mb-3">Stratejik Önceliklerimiz</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Yapay zeka ve makine öğrenimi teknolojilerinde sürekli gelişim</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Uluslararası pazarlarda genişleme ve yerel kültürel değerlere uygun hizmetler sunma</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Kullanıcı deneyimini sürekli iyileştirerek memnuniyet ve bağlılık oluşturma</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Premium içerik ve abonelik modeliyle sürdürülebilir gelir artışı sağlama</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Stratejik ortaklıklar ve seçici satın almalarla ekosistem genişletme</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Yatırımcı İletişim */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Mail className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Yatırımcı İletişim</h2>
        </div>

        <div className="bg-gradient-to-r from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/40 dark:to-pink-950/40 rounded-xl p-8 border border-pink-100 dark:border-pink-900/30 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Yatırımcı İlişkileri Ekibi</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium">Ayşe Yılmaz</h4>
                  <p className="text-sm text-muted-foreground mb-1">Yatırımcı İlişkileri Direktörü</p>
                  <a href="mailto:ayse.yilmaz@falomi.com.tr" className="text-sm text-primary hover:underline flex items-center gap-1">
                    <Mail className="h-3 w-3" /> ayse.yilmaz@falomi.com.tr
                  </a>
                </div>
                <div>
                  <h4 className="font-medium">Mehmet Kaya</h4>
                  <p className="text-sm text-muted-foreground mb-1">Finans Direktörü (CFO)</p>
                  <a href="mailto:mehmet.kaya@falomi.com.tr" className="text-sm text-primary hover:underline flex items-center gap-1">
                    <Mail className="h-3 w-3" /> mehmet.kaya@falomi.com.tr
                  </a>
                </div>
                <div>
                  <h4 className="font-medium">Genel Yatırımcı İletişim</h4>
                  <a href="mailto:yatirimci@falomi.com.tr" className="text-sm text-primary hover:underline flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3" /> yatirimci@falomi.com.tr
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Yatırımcı Bülteni</h3>
              <p className="text-muted-foreground mb-4">
                Falomi&apos;nin finansal sonuçları, yeni ürün lansmanları ve şirket haberleri hakkında güncel bilgiler almak için yatırımcı bültenimize kaydolun.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950"
                />
                <Button className="shrink-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white">
                  Kaydol
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Gizlilik politikamıza uygun olarak verilerinizi işleyeceğiz. Dilediğiniz zaman abonelikten çıkabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SSS ve İlgili Linkler */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="bg-white dark:bg-gray-950 rounded-xl p-6 border border-border shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Sıkça Sorulan Sorular</h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <h4 className="font-medium mb-1">Falomi halka açık bir şirket midir?</h4>
              <p className="text-sm text-muted-foreground">
                Hayır, Falomi şu anda özel bir şirkettir. Gelecekteki halka arz planları hakkında güncellemeler için yatırımcı bültenimize kaydolabilirsiniz.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Falomi&apos;ye nasıl yatırım yapabilirim?</h4>
              <p className="text-sm text-muted-foreground">
                Şu anda Falomi, seçili kurumsal yatırımcılar ve akredite bireysel yatırımcılar ile çalışmaktadır. Yatırım fırsatları hakkında bilgi almak için yatırımcı ilişkileri ekibimizle iletişime geçebilirsiniz.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Falomi&apos;nin gelir modeli nedir?</h4>
              <p className="text-sm text-muted-foreground">
                Falomi&apos;nin gelir modeli, freemium model ile kredi tabanlı satın alımlar, premium abonelikler ve seçili pazarlarda reklam gelirlerinden oluşmaktadır. Finansal raporlarımızda gelir dağılımı hakkında detaylı bilgi bulabilirsiniz.
              </p>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-4">İlgili Bağlantılar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/about"
              className="flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors"
            >
              <Building2 className="h-5 w-5 text-pink-500" />
              <div>
                <span className="font-medium">Hakkımızda</span>
                <p className="text-sm text-muted-foreground">Şirket tarihi ve değerlerimiz</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
            </Link>
            <Link 
              href="/contact"
              className="flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors"
            >
              <Mail className="h-5 w-5 text-pink-500" />
              <div>
                <span className="font-medium">İletişim</span>
                <p className="text-sm text-muted-foreground">Bizimle iletişime geçin</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
            </Link>
            <Link 
              href="/terms"
              className="flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors"
            >
              <FileText className="h-5 w-5 text-pink-500" />
              <div>
                <span className="font-medium">Kullanım Şartları</span>
                <p className="text-sm text-muted-foreground">Hizmet koşullarımız</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
            </Link>
            <Link 
              href="/privacy"
              className="flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors"
            >
              <Shield className="h-5 w-5 text-pink-500" />
              <div>
                <span className="font-medium">Gizlilik Politikası</span>
                <p className="text-sm text-muted-foreground">Veri koruma politikalarımız</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
} 