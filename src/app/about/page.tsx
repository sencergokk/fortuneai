"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Users, Lightbulb, History, Coffee, Compass, Award, Star, Anchor, Heart, Sparkle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container py-12 mx-auto max-w-6xl">
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/40 dark:to-purple-950/40 border border-pink-200 dark:border-pink-900/30 px-4 py-1.5 text-sm font-medium mb-4 shadow-sm">
          <Sparkles className="h-4 w-4 text-pink-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600">
            Falomi Hakkında
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Biz Kimiz?</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Falomi, geleneksel fal sanatlarını modern teknoloji ile birleştirerek kişiselleştirilmiş manevi deneyimler sunan öncü bir dijital platformdur.
        </p>
      </motion.div>

      {/* Misyon ve Vizyon */}
      <motion.section
        className="mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-pink-50 to-fuchsia-50 dark:from-pink-950/40 dark:to-fuchsia-950/40 rounded-xl p-8 border border-pink-100 dark:border-pink-900/30 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white dark:bg-gray-900 rounded-full">
                <Compass className="h-6 w-6 text-fuchsia-500" />
              </div>
              <h2 className="text-2xl font-semibold">Misyonumuz</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Geleneksel fal sanatlarını modern teknoloji ile birleştirerek herkes için erişilebilir, saygılı ve aydınlatıcı deneyimler sunmak.
            </p>
            <p className="text-muted-foreground">
              İnsanları içsel yolculuklarında desteklemek ve kendi potansiyellerini keşfetmeleri için ilham vermek amacıyla yapay zeka destekli kişiselleştirilmiş içgörü hizmetleri geliştiriyoruz.
            </p>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40 rounded-xl p-8 border border-violet-100 dark:border-violet-900/30 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white dark:bg-gray-900 rounded-full">
                <Star className="h-6 w-6 text-purple-500" />
              </div>
              <h2 className="text-2xl font-semibold">Vizyonumuz</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Kişiselleştirilmiş manevi içgörü ve kehanet hizmetlerinde dünyanın lider dijital platformu olmak.
            </p>
            <p className="text-muted-foreground">
              Falomi&apos;yi, küresel çapta milyonlarca insanın kendilerini daha iyi anlamak için başvurdukları, kültürel olarak kapsayıcı ve erişilebilir bir platform olarak konumlandırmayı hedefliyoruz.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Hikayemiz */}
      <motion.section 
        className="mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-r from-pink-100 to-fuchsia-100 dark:from-pink-900/60 dark:to-fuchsia-900/60 rounded-full">
            <History className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">Falomi&apos;nin Hikayesi</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-4">
            <p className="text-muted-foreground">
              Falomi&apos;nin hikayesi, 2021 yılında kurucumuz Aylin Yıldız&apos;ın geleneksel kahve falı kültürünü dijital dünyaya taşıma vizyonuyla başladı. Teknoloji uzmanı bir aileden gelen Aylin, çocukluğunda büyükannesinin kahve falı baktığı anılarından ilham aldı.
            </p>
            <p className="text-muted-foreground">
              İstanbul&apos;da bir apartman dairesinde iki yazılım mühendisi ve bir içerik uzmanıyla yola çıkan Falomi, ilk beta sürümünü 2021 sonbaharında yayınladı. Kullanıcılardan gelen olumlu geri bildirimler ve büyüyen taleple, ekibimiz hızla büyüdü.
            </p>
            <p className="text-muted-foreground">
              2022&apos;de ilk yatırım turunu tamamlayarak yapay zeka altyapımızı güçlendirdik ve kahve falının yanı sıra tarot, astroloji ve rüya yorumlama gibi yeni özellikleri platformumuza ekledik.
            </p>
            <p className="text-muted-foreground">
              Bugün 85+ kişilik ekibimiz ve 1.2 milyondan fazla kullanıcımızla, Türkiye&apos;nin en büyük dijital fal platformu olarak hizmet vermeye ve geleneksel fal kültürünü modern teknoloji ile birleştirmeye devam ediyoruz.
            </p>
          </div>
          <div className="md:col-span-5 relative min-h-[300px] rounded-xl overflow-hidden">
            <Image 
              src="/images/office.jpg"
              alt="Falomi Ofis"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          {[
            {
              year: "2021",
              title: "Falomi&apos;nin Kuruluşu",
              description: "İstanbul&apos;da küçük bir ekiple yolculuğumuza başladık ve ilk beta sürümünü yayınladık.",
              icon: <Coffee className="h-5 w-5 text-amber-500" />,
            },
            {
              year: "2022",
              title: "Büyüme ve Yatırım",
              description: "İlk yatırım turumuzu tamamladık ve yapay zeka teknolojimizi geliştirdik.",
              icon: <Anchor className="h-5 w-5 text-blue-500" />,
            },
            {
              year: "2023",
              title: "Uluslararası Genişleme",
              description: "MENA bölgesi ve Avrupa pazarlarına açıldık, 1 milyon kullanıcı eşiğini aştık.",
              icon: <Sparkles className="h-5 w-5 text-fuchsia-500" />,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-950 rounded-xl p-6 border border-border shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">
                  {item.year}
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-full">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Ekibimiz */}
      <motion.section
        className="mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-r from-pink-100 to-fuchsia-100 dark:from-pink-900/60 dark:to-fuchsia-900/60 rounded-full">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">Yönetim Ekibimiz</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Aylin Yıldız",
              title: "Kurucu & CEO",
              bio: "Teknoloji ve girişimcilik geçmişine sahip Aylin, Falomi'nin vizyonunu ve stratejik yönünü belirliyor.",
              image: "/images/team-member-1.jpg",
            },
            {
              name: "Ahmet Kaya",
              title: "Teknoloji Direktörü (CTO)",
              bio: "20 yıllık yazılım deneyimi ile Ahmet, Falomi'nin teknolojik altyapısını ve yapay zeka çözümlerini yönetiyor.",
              image: "/images/team-member-2.jpg",
            },
            {
              name: "Zeynep Aksoy",
              title: "İçerik ve Kültür Direktörü",
              bio: "Antropoloji geçmişiyle Zeynep, fal geleneklerinin doğru ve saygılı bir şekilde dijitalleştirilmesini sağlıyor.",
              image: "/images/team-member-3.jpg",
            },
            {
              name: "Mehmet Demir",
              title: "Finans Direktörü (CFO)",
              bio: "Finans sektöründeki tecrübesiyle Mehmet, şirketin finansal stratejisini ve yatırımcı ilişkilerini yönetiyor.",
              image: "/images/team-member-4.jpg",
            },
          ].map((member, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden border border-border shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <div className="relative w-full h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 z-10"></div>
                <div className="absolute top-4 left-4 bg-white dark:bg-gray-950 z-20 px-3 py-1 rounded-full text-xs font-medium border border-border">
                  {member.title}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-2">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/careers" 
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            Ekibimize katılmak ister misiniz? Açık pozisyonlarımıza göz atın →
          </Link>
        </div>
      </motion.section>

      {/* Değerlerimiz */}
      <motion.section
        className="mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-r from-pink-100 to-fuchsia-100 dark:from-pink-900/60 dark:to-fuchsia-900/60 rounded-full">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">Temel Değerlerimiz</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Kültürel Saygı",
              description: "Farklı kültürlerin manevi geleneklerine derin bir saygı gösterir ve bu gelenekleri teknoloji aracılığıyla yaşatırız.",
              icon: <Award className="h-6 w-6 text-orange-500" />,
              color: "from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40 border-orange-100 dark:border-orange-900/30",
            },
            {
              title: "Teknolojik İnovasyon",
              description: "Yapay zeka ve makine öğrenimi gibi teknolojileri manevi geleneklerle harmanlayarak yenilikçi çözümler üretiriz.",
              icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
              color: "from-yellow-50 to-lime-50 dark:from-yellow-950/40 dark:to-lime-950/40 border-yellow-100 dark:border-yellow-900/30",
            },
            {
              title: "Kişisel Gelişim",
              description: "Kullanıcılarımızın kendilerini keşfetmelerine ve kişisel gelişimlerine rehberlik etmeyi amaçlarız.",
              icon: <Sparkle className="h-6 w-6 text-blue-500" />,
              color: "from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 border-blue-100 dark:border-blue-900/30",
            },
            {
              title: "Erişilebilirlik",
              description: "Falcılık ve astroloji gibi geleneksel sanatları herkes için erişilebilir kılmayı hedefleriz.",
              icon: <Users className="h-6 w-6 text-green-500" />,
              color: "from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-green-100 dark:border-green-900/30",
            },
          ].map((value, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${value.color} rounded-xl p-6 border shadow-sm`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <div className="p-3 bg-white/60 dark:bg-gray-900/60 rounded-full inline-flex mb-4">
                {value.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* İletişim CTA */}
      <motion.section
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/40 dark:to-pink-950/40 rounded-xl p-8 md:p-12 border border-pink-100 dark:border-pink-900/30 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Bize Ulaşın</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Falomi hakkında daha fazla bilgi edinmek, geri bildirimde bulunmak veya iş birliği teklifleri için bizimle iletişime geçebilirsiniz.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white font-medium shadow-sm hover:from-fuchsia-600 hover:to-pink-700 transition-colors"
          >
            İletişime Geçin
          </Link>
        </div>
      </motion.section>
    </div>
  );
} 