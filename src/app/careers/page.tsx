"use client";

import { motion } from "framer-motion";
import { Sparkles, Coffee, Heart, Star, Clock, Globe, Users, DollarSign, Award, Briefcase, CheckCircle2, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CareersPage() {
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
            Birlikte Büyüyelim
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Falomi Kariyer Fırsatları</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Geleneksel fal kültürünü dijital dünyaya taşıyan yenilikçi ekibimizin bir parçası olun ve milyonlarca insanın hayatına dokunun.
        </p>
      </motion.div>

      {/* Hero Banner */}
      <motion.div
        className="relative w-full h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl overflow-hidden mb-16"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 p-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Geleceği Birlikte Şekillendirelim</h2>
          <p className="text-lg md:text-xl max-w-3xl text-center mb-8">
            Falomi&apos;de sadece bir iş değil, geleneksel mirasımızı yenilikçi teknolojilerle birleştiren bir yolculuğun parçası olursunuz. 85+ kişilik yetenekli ekibimize katılmak ve fark yaratmak için bize katılın.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="bg-white text-purple-600 hover:bg-gray-100 hover:text-purple-700"
              size="lg"
            >
              Açık Pozisyonlar
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Neden Falomi Bölümü */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Neden Falomi?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Falomi&apos;de çalışmak, tutkulu bir ekibin parçası olmak ve sürekli gelişim fırsatlarıyla dolu bir yolculuğa çıkmak demektir.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Esnek Çalışma",
              description: "Hibrit çalışma modelimiz ve esnek saatlerimizle iş-yaşam dengenizi koruyabilirsiniz.",
              icon: <Clock className="h-5 w-5 text-violet-500" />,
            },
            {
              title: "Büyüme Fırsatı",
              description: "Hızla büyüyen bir startup&apos;ta kariyerinizi hızlandırın ve sektörde öncü olun.",
              icon: <Star className="h-5 w-5 text-yellow-500" />,
            },
            {
              title: "Kültürel Etki",
              description: "Geleneksel fal kültürünü modernize ederek kültürel mirasımızı korumaya katkıda bulunun.",
              icon: <Heart className="h-5 w-5 text-pink-500" />,
            },
            {
              title: "Öğrenme Kültürü",
              description: "Sürekli eğitim programları, konferanslar ve mentorluk fırsatlarıyla kendinizi geliştirin.",
              icon: <Coffee className="h-5 w-5 text-amber-500" />,
            },
            {
              title: "Uluslararası Ortam",
              description: "MENA bölgesi ve Avrupa&apos;ya açılan bir şirkette global bir perspektif kazanın.",
              icon: <Globe className="h-5 w-5 text-blue-500" />,
            },
            {
              title: "İnsan Odaklı Yaklaşım",
              description: "Çalışan memnuniyetini ve gelişimini en üst düzeyde tutmayı amaçlayan bir kültür.",
              icon: <Users className="h-5 w-5 text-green-500" />,
            },
          ].map((benefit, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-950 rounded-xl p-6 border border-border shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
            >
              <div className="p-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 rounded-full inline-flex mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Çalışan Hikayeleri ve Ofis Görüntüleri */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs defaultValue="stories" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
            <TabsTrigger value="stories">Çalışan Hikayeleri</TabsTrigger>
            <TabsTrigger value="office">Ofisimiz</TabsTrigger>
          </TabsList>
          <TabsContent value="stories">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: "Emre Yılmaz",
                  role: "Kıdemli Yazılım Mühendisi",
                  image: "/images/employee-1.jpg",
                  story: "3 yıl önce Falomi&apos;ye katıldığımda, küçük bir startup&apos;tı. O zamandan beri ekibimiz büyüdü, ürünümüz gelişti ve milyonlarca kullanıcıya ulaştık. Buradaki en sevdiğim şey, yeni fikirlerin her zaman değerlendirilmesi ve teknolojik yenilikleri uygulama özgürlüğü. Yaptığımız işin kültürel bir mirası yaşatması da ayrıca gurur verici.",
                },
                {
                  name: "Cansu Demir",
                  role: "Ürün Tasarımcısı",
                  image: "/images/employee-2.jpg",
                  story: "Falomi&apos;de çalışmak, her gün farklı bir meydan okuma ile karşılaşmak anlamına geliyor. Geleneksel falcılık ve modern dijital deneyimi birleştirmek yaratıcı potansiyelimi zorluyor. Ürün ekibimiz her zaman kullanıcı deneyimini ön planda tutuyor ve tasarım kararlarımızda özgürüz. Ayrıca, ekip içi aktivitelerimiz ve esnek çalışma saatlerimizle mükemmel bir iş-yaşam dengesi kurabiliyorum.",
                },
              ].map((employee, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden border border-border shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.role}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">&quot;{employee.story}&quot;</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="office">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <motion.div
                  key={index}
                  className={`${index === 0 ? 'md:col-span-2 md:row-span-2' : ''} relative h-64 rounded-xl overflow-hidden border border-border`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 z-10"></div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-6">
              <p className="text-muted-foreground">
                Levent&apos;teki modern ofisimizde yaratıcılığı ve iş birliğini teşvik eden açık çalışma alanları, toplantı odaları ve sosyal alanlar bulunmaktadır.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.section>

      {/* Yan Haklar */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Yan Haklar ve Faydalar</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Çalışanlarımıza sunduğumuz kapsamlı yan haklar paketi ile çalışma deneyiminizi zenginleştiriyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-950 rounded-xl p-6 border border-border shadow-sm">
            <h3 className="text-xl font-medium mb-6">Temel Faydalar</h3>
            <ul className="space-y-4">
              {[
                { text: "Rekabetçi maaş paketi", icon: <DollarSign className="h-5 w-5 text-green-500" /> },
                { text: "Özel sağlık sigortası", icon: <Heart className="h-5 w-5 text-red-500" /> },
                { text: "Hibrit çalışma modeli", icon: <Coffee className="h-5 w-5 text-amber-500" /> },
                { text: "Yılda 2 kez performans değerlendirmesi", icon: <Award className="h-5 w-5 text-blue-500" /> },
                { text: "Yemek ve yol yardımı", icon: <MapPin className="h-5 w-5 text-pink-500" /> },
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-full mt-0.5">
                    {item.icon}
                  </div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-xl p-6 border border-border shadow-sm">
            <h3 className="text-xl font-medium mb-6">Gelişim ve Motivasyon</h3>
            <ul className="space-y-4">
              {[
                { text: "Eğitim ve konferans bütçesi", icon: <Briefcase className="h-5 w-5 text-violet-500" /> },
                { text: "Şirket içi mentorluk programı", icon: <Users className="h-5 w-5 text-indigo-500" /> },
                { text: "Çalışan hisse opsiyonları", icon: <Star className="h-5 w-5 text-yellow-500" /> },
                { text: "Düzenli ekip aktiviteleri", icon: <Heart className="h-5 w-5 text-pink-500" /> },
                { text: "Esnek çalışma saatleri", icon: <Clock className="h-5 w-5 text-teal-500" /> },
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-full mt-0.5">
                    {item.icon}
                  </div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Açık Pozisyonlar */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Açık Pozisyonlar</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Yetenekli ve tutkulu ekibimize katılın. Şu anda aradığımız pozisyonları keşfedin.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              title: "Kıdemli Mobil Uygulama Geliştirici",
              location: "İstanbul, Hibrit",
              department: "Mühendislik",
              type: "Tam Zamanlı",
            },
            {
              title: "Yapay Zeka Mühendisi",
              location: "İstanbul, Hibrit",
              department: "Veri Bilimi",
              type: "Tam Zamanlı",
            },
            {
              title: "UX/UI Tasarımcısı",
              location: "İstanbul, Uzaktan",
              department: "Ürün",
              type: "Tam Zamanlı",
            },
            {
              title: "İçerik Editörü",
              location: "İstanbul, Hibrit",
              department: "İçerik",
              type: "Tam Zamanlı",
            },
            {
              title: "Büyüme Pazarlama Uzmanı",
              location: "İstanbul, Ofis",
              department: "Pazarlama",
              type: "Tam Zamanlı",
            },
          ].map((position, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-950 rounded-xl p-6 border border-border shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium">{position.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {position.location}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Briefcase className="h-3 w-3" /> {position.department}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {position.type}
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="md:w-auto w-full">
                  Detayları Gör
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Başvuru Süreci */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Başvuru Süreci</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Falomi&apos;ye katılma yolculuğunuz hızlı, şeffaf ve verimli bir süreçle ilerler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Başvuru",
              description: "Kariyer sayfamızdan veya LinkedIn üzerinden pozisyona başvurun ve sizden istenen bilgileri doldurun.",
              icon: <CheckCircle2 className="h-6 w-6 text-blue-500" />,
            },
            {
              title: "İlk Görüşme",
              description: "İnsan Kaynakları ekibimizle tanışma görüşmesi ve pozisyonun detayları hakkında bilgi alın.",
              icon: <CheckCircle2 className="h-6 w-6 text-pink-500" />,
            },
            {
              title: "Teknik Değerlendirme",
              description: "Pozisyona özel bir değerlendirme, teknik görüşme veya vaka çalışması aşaması.",
              icon: <CheckCircle2 className="h-6 w-6 text-purple-500" />,
            },
            {
              title: "Final Görüşme",
              description: "Departman yöneticileri ve ekip arkadaşlarınızla son görüşme ve teklif aşaması.",
              icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-950 rounded-xl p-6 border border-border shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 rounded-full flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* SSS */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="bg-white dark:bg-gray-950 rounded-xl p-6 md:p-8 border border-border shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Sıkça Sorulan Sorular</h2>
          <div className="space-y-6">
            {[
              {
                question: "Başvuru sonrası ne kadar sürede geri dönüş alacağım?",
                answer: "Başvurunuzu aldıktan sonra genellikle 1 hafta içinde ilk değerlendirmeyi yapar ve size geri dönüş sağlarız. Süreç yoğunluğuna göre bu süre değişebilir.",
              },
              {
                question: "Falomi&apos;de çalışma modeli nasıl?",
                answer: "Hibrit bir çalışma modelimiz var. Haftada 2-3 gün ofiste, diğer günlerde uzaktan çalışma imkanı sunuyoruz. Bazı pozisyonlar için tamamen uzaktan çalışma seçeneği de bulunmaktadır.",
              },
              {
                question: "Teknik deneyimim olmadan Falomi&apos;de çalışabilir miyim?",
                answer: "Evet, teknik olmayan pozisyonlarımız da mevcut. İçerik, pazarlama, insan kaynakları, müşteri deneyimi gibi alanlarda da ekip arkadaşları arıyoruz.",
              },
              {
                question: "İş başvurularında ne gibi belgeler istenmektedir?",
                answer: "Başvuru formunu doldurduktan sonra CV&apos;niz, varsa portfolyo veya iş örnekleriniz ve motivasyon mektubunuz ile değerlendirme sürecimiz başlar.",
              },
            ].map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 rounded-xl p-8 md:p-12 border border-purple-100 dark:border-purple-900/30 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Haydi Tanışalım!</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Sizin de tutkulu ekibimizin bir parçası olmak, geleneksel fal sanatlarını dijital dünyaya taşımak ve milyonlarca insanın hayatına dokunmak isterseniz, hemen başvurun.
          </p>
          <Button className="bg-gradient-to-r from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700 text-white" size="lg">
            Açık Pozisyonlara Göz Atın
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Açık pozisyonlar dışında da başvuru yapmak isterseniz CV&apos;nizi{" "}
            <a href="mailto:kariyer@falomi.com.tr" className="text-primary hover:underline">
              kariyer@falomi.com.tr
            </a>{" "}
            adresine gönderebilirsiniz.
          </p>
        </div>
      </motion.div>
    </div>
  );
} 