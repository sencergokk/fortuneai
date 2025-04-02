"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Shield, Check, ExternalLink, HelpCircle, Mail } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const lastUpdated = new Date(2023, 11, 15); // 15 Aralık 2023

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12 mx-auto max-w-4xl">
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/40 dark:to-purple-950/40 border border-pink-200 dark:border-pink-900/30 px-4 py-1.5 text-sm font-medium mb-4 shadow-sm">
          <Shield className="h-4 w-4 text-pink-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600">
            Yasal Bilgiler
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Gizlilik Politikası</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Bu politika, Falomi fal uygulamasının kullanıcı verilerini nasıl topladığını, işlediğini ve koruduğunu açıklar.
        </p>
        <p className="text-sm text-muted-foreground mt-3">
          Son güncelleme: {format(lastUpdated, "d MMMM yyyy", { locale: tr })}
        </p>
      </motion.div>

      {/* İçerik */}
      <motion.div
        className="bg-white dark:bg-gray-950 rounded-xl p-6 md:p-8 border border-border shadow-sm mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">İçindekiler</h2>
        </div>

        <ul className="space-y-2">
          {[
            "Giriş",
            "Topladığımız Bilgiler",
            "Bilgileri Kullanma Amaçlarımız",
            "Bilgilerin Paylaşılması",
            "Veri Saklama",
            "Veri Güvenliği",
            "Çerezler ve Takip Teknolojileri",
            "Çocukların Gizliliği",
            "Kullanıcı Hakları",
            "Uluslararası Veri Transferleri",
            "Politika Değişiklikleri",
            "Bize Ulaşın",
          ].map((item, index) => (
            <li key={index}>
              <a
                href={`#section-${index + 1}`}
                className="flex items-center gap-2 hover:text-primary transition-colors duration-200 hover:underline"
              >
                <Check className="h-4 w-4 text-pink-500" />
                <span>{index + 1}. {item}</span>
              </a>
            </li>
          ))}
        </ul>
      </motion.div>

      <div className="space-y-8">
        <motion.section
          id="section-1"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4">1. Giriş</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Falomi (&quot;biz&quot;, &quot;bizim&quot; veya &quot;şirketimiz&quot;) olarak, gizliliğinize değer veriyoruz. Bu Gizlilik Politikası, Falomi web sitesini ve mobil uygulamasını (&quot;Hizmet&quot;) kullandığınızda kişisel verilerinizin nasıl toplandığını, kullanıldığını ve paylaşıldığını açıklar.
            </p>
            <p>
              Hizmetimizi kullanarak, bu politikada belirtilen uygulamaları kabul etmiş olursunuz. Politikamızı kabul etmiyorsanız, lütfen Hizmetimizi kullanmayın.
            </p>
            <p>
              Bu Gizlilik Politikası, Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuat ile uyumlu olarak hazırlanmıştır.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="section-2"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <h2 className="text-2xl font-semibold mb-4">2. Topladığımız Bilgiler</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Sizden aldığımız bilgiler şunları içerebilir:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Hesap Bilgileri:</strong> Hesap oluşturduğunuzda, adınız, e-posta adresiniz, doğum tarihiniz, cinsiyetiniz gibi bilgiler.
              </li>
              <li>
                <strong>Profil Bilgileri:</strong> Profil fotoğrafınız, ilgi alanlarınız, tercihleriniz.
              </li>
              <li>
                <strong>Soru ve İçerikler:</strong> Fal yorumları için gönderdiğiniz sorular, fotoğraflar, metin içerikleri.
              </li>
              <li>
                <strong>Ödeme Bilgileri:</strong> Kredi kartı bilgileri (ödeme işlemcileri aracılığıyla), fatura adresi.
              </li>
              <li>
                <strong>Kullanım Verileri:</strong> Hizmetimizle nasıl etkileşim kurduğunuza dair bilgiler, tıklama davranışları, özellik kullanımı, oturum süreleri.
              </li>
              <li>
                <strong>Cihaz Bilgileri:</strong> IP adresi, cihaz türü, işletim sistemi, tarayıcı türü, dil ayarları, konum bilgileri.
              </li>
              <li>
                <strong>İletişim Bilgileri:</strong> Müşteri hizmetleriyle iletişime geçtiğinizde sağladığınız bilgiler.
              </li>
            </ul>
            <p>
              Otomatik olarak topladığımız bilgiler:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Çerezler ve Benzer Teknolojiler:</strong> Hizmetimizi kullandığınızda çerezler, web işaretçileri ve benzer teknolojiler aracılığıyla bilgi toplarız.
              </li>
              <li>
                <strong>Log Verileri:</strong> Hizmetimizdeki etkinlikleriniz, sistem etkinliği, donanım ayarları, tarayıcı türü ve diğer ilgili bilgiler.
              </li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          id="section-3"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-4">3. Bilgileri Kullanma Amaçlarımız</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Topladığımız bilgileri aşağıdaki amaçlar için kullanırız:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Hizmetimizi sağlamak, yönetmek ve sürdürmek</li>
              <li>Hesabınızı oluşturmak ve yönetmek</li>
              <li>Fal ve yorum hizmetlerini sunmak</li>
              <li>Ödemeleri işlemek</li>
              <li>Müşteri desteği sağlamak</li>
              <li>Size bildirimler, güncellemeler ve pazarlama iletişimleri göndermek (tercihlerinize bağlı olarak)</li>
              <li>Hizmetimizi analiz etmek, geliştirmek ve iyileştirmek</li>
              <li>Dolandırıcılık ve güvenlik sorunlarını tespit etmek ve önlemek</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek</li>
            </ul>
            <p>
              Kişisel verileriniz, yukarıdaki amaçlar için gerekli olduğu sürece işlenecektir. Verilerinizi yalnızca belirtilen amaçlar doğrultusunda ve geçerli veri koruma yasalarına uygun olarak kullanacağız.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="section-4"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <h2 className="text-2xl font-semibold mb-4">4. Bilgilerin Paylaşılması</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Kişisel verilerinizi aşağıdaki durumlarda ve taraflarla paylaşabiliriz:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Hizmet Sağlayıcılar:</strong> Hizmetlerimizi sunmamıza yardımcı olan üçüncü taraf hizmet sağlayıcılarla (ödeme işlemcileri, bulut depolama sağlayıcıları, analiz hizmetleri gibi).
              </li>
              <li>
                <strong>İş Ortakları:</strong> Sizinle ilgili hizmetler sunmak için işbirliği yaptığımız şirketlerle.
              </li>
              <li>
                <strong>Yasal Gereklilikler:</strong> Yasal bir yükümlülüğe uymak, şirketimizin haklarını veya mülkiyetini korumak, acil durumlarda kişisel güvenliği korumak ya da yasal süreçlere yanıt vermek için gerekli olduğunda.
              </li>
              <li>
                <strong>İşlem veya Devralma Durumunda:</strong> Şirketimizin varlıklarının tamamı veya bir kısmı başka bir şirket tarafından devralınırsa veya birleşirse, kişisel verileriniz devredilen varlıklar arasında olabilir.
              </li>
              <li>
                <strong>İzninizle:</strong> Sizin açık izninizle bilgilerinizi diğer üçüncü taraflarla paylaşabiliriz.
              </li>
            </ul>
            <p>
              Üçüncü taraf hizmet sağlayıcılarımızın, verilerinizi korumak için uygun güvenlik önlemlerini aldıklarından emin olmak için makul adımlar atıyoruz ve bu üçüncü tarafların verilerinizi yalnızca onlara verdiğimiz talimatlar doğrultusunda işlemelerini sağlıyoruz.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="section-5"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-4">5. Veri Saklama</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Kişisel verilerinizi, Hizmetimizi sağlamak, yasal yükümlülüklerimizi yerine getirmek ve politikalarımızı uygulamak için gerekli olduğu sürece saklarız.
            </p>
            <p>
              Hesabınızı sildiğinizde, kişisel verileriniz aktif veritabanlarımızdan silinir, ancak yasal yükümlülüklerimizi yerine getirmek ve politikalarımızı uygulamak için gerekli olduğu sürece bazı veriler arşivlerimizde saklı kalabilir.
            </p>
            <p>
              Saklama sürelerimiz şu faktörlere dayanmaktadır:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Yasal saklama yükümlülükleri</li>
              <li>Sözleşmesel gereklilikler</li>
              <li>İş ihtiyaçları</li>
              <li>Endüstri standartları</li>
              <li>Kullanıcı beklentileri</li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          id="section-6"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <h2 className="text-2xl font-semibold mb-4">6. Veri Güvenliği</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Kişisel verilerinizin güvenliği bizim için önemlidir. Verilerinizi izinsiz erişim, değişiklik, ifşa veya imhaya karşı korumak için uygun teknik ve organizasyonel önlemler uyguluyoruz.
            </p>
            <p>
              Güvenlik önlemlerimiz şunları içerir:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Veri şifreleme (iletim ve depolama sırasında)</li>
              <li>İki faktörlü kimlik doğrulama seçenekleri</li>
              <li>Düzenli güvenlik değerlendirmeleri ve denetimler</li>
              <li>Erişim kontrolleri ve sınırlamaları</li>
              <li>Güvenlik izleme ve algılama sistemleri</li>
              <li>Çalışan gizlilik ve güvenlik eğitimi</li>
            </ul>
            <p>
              Ancak, internet üzerinden hiçbir veri iletimi veya elektronik depolama yöntemi %100 güvenli değildir. Her türlü makul önlemi almaya çalışsak da, kişisel verilerinizin mutlak güvenliğini garanti edemeyiz.
            </p>
            <p>
              Hesabınızın güvenlik ihlalinden şüpheleniyorsanız, lütfen derhal{" "}
              <a href="mailto:guvenlik@falomi.com.tr" className="text-primary hover:underline">
                guvenlik@falomi.com.tr
              </a>{" "}
              adresinden bizimle iletişime geçin.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="section-7"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4">7. Çerezler ve Takip Teknolojileri</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Hizmetimizi sağlamak ve geliştirmek için çerezler, piksel etiketleri, yerel depolama ve benzer teknolojiler kullanıyoruz. Bu teknolojiler, tercihlerinizi hatırlamak, hizmetlerimizin nasıl kullanıldığını anlamak ve kullanıcı deneyimini kişiselleştirmek için kullanılır.
            </p>
            <p>
              Kullandığımız çerez türleri şunlardır:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Gerekli Çerezler:</strong> Hizmetimizin düzgün çalışması için gereklidir ve kapatılamazlar.
              </li>
              <li>
                <strong>Performans Çerezleri:</strong> Ziyaretçilerin sitemizi nasıl kullandığını anlamamıza yardımcı olur.
              </li>
              <li>
                <strong>İşlevsellik Çerezleri:</strong> Site ayarlarınızı ve tercihlerinizi hatırlamak için kullanılır.
              </li>
              <li>
                <strong>Hedefleme/Reklam Çerezleri:</strong> İlgi alanlarınıza yönelik reklamlar göstermek için kullanılır.
              </li>
            </ul>
            <p>
              Çoğu web tarayıcısı, çerezleri reddetmenize veya çerez alırken sizi uyarmasına olanak tanır. Çerezleri reddetmeyi seçerseniz, Hizmetimizin bazı bölümlerinin düzgün çalışmayabileceğini lütfen unutmayın.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="section-8"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <h2 className="text-2xl font-semibold mb-4">8. Çocukların Gizliliği</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Hizmetimiz 18 yaşın altındaki kişilere yönelik değildir ve bilerek 18 yaşından küçük kişilerden kişisel veri toplamayız. 18 yaşından küçük bir kişinin bize kişisel veri sağladığını fark edersek, bu bilgileri mümkün olan en kısa sürede silmek için adımlar atarız.
            </p>
            <p>
              Eğer bir çocuğun bize kişisel verilerini sağladığını düşünüyorsanız, lütfen bizimle iletişime geçin ve gerekli adımları atalım.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="section-9"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4">9. Kullanıcı Hakları</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              KVKK ve diğer veri koruma yasaları uyarınca, kişisel verilerinizle ilgili olarak aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Erişim Hakkı:</strong> Sizinle ilgili hangi kişisel verileri işlediğimizi öğrenme hakkı.
              </li>
              <li>
                <strong>Düzeltme Hakkı:</strong> Yanlış veya eksik kişisel verilerin düzeltilmesini isteme hakkı.
              </li>
              <li>
                <strong>Silme Hakkı:</strong> Belirli koşullar altında kişisel verilerinizin silinmesini isteme hakkı.
              </li>
              <li>
                <strong>İşlemeyi Kısıtlama Hakkı:</strong> Belirli durumlarda kişisel verilerinizin işlenmesinin kısıtlanmasını isteme hakkı.
              </li>
              <li>
                <strong>Veri Taşınabilirliği Hakkı:</strong> Verilerinizi yapılandırılmış, yaygın olarak kullanılan ve makine tarafından okunabilir bir formatta alma ve başka bir veri sorumlusuna aktarma hakkı.
              </li>
              <li>
                <strong>İtiraz Hakkı:</strong> Meşru menfaatlerimize dayanarak işlenen kişisel verilerinize itiraz etme hakkı.
              </li>
              <li>
                <strong>Otomatik Karar Vermeye İtiraz:</strong> Sizi önemli ölçüde etkileyen otomatik karar verme süreçlerine tabi olmama hakkı.
              </li>
            </ul>
            <p>
              Bu hakları kullanmak isterseniz, lütfen aşağıdaki &quot;Bize Ulaşın&quot; bölümünde verilen iletişim bilgilerini kullanarak bizimle iletişime geçin. Talebinizi 30 gün içinde yanıtlayacağız.
            </p>
            <p>
              Veri koruma otoritesine şikayette bulunma hakkınız da bulunmaktadır. Ancak, herhangi bir endişeniz olduğunda öncelikle bizimle iletişime geçmenizi ve sorunu çözmemize fırsat vermenizi rica ederiz.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="section-10"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          <h2 className="text-2xl font-semibold mb-4">10. Uluslararası Veri Transferleri</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Falomi&apos;nin sunucuları Türkiye&apos;de bulunmaktadır, ancak hizmet sağlayıcılarımız ve iş ortaklarımız dünyanın farklı yerlerinde olabilir. Bu nedenle, kişisel verileriniz Türkiye dışındaki ülkelere aktarılabilir ve bu ülkelerde işlenebilir.
            </p>
            <p>
              Kişisel verileri Türkiye dışına aktardığımızda, verilerinizin yeterli düzeyde korunmasını sağlamak için uygun güvenlik önlemlerini alıyoruz, örneğin:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Avrupa Komisyonu tarafından onaylanmış standart sözleşme maddeleri</li>
              <li>Veri koruma yasaları tarafından yeterli koruma sağladığı kabul edilen ülkelere transfer</li>
              <li>Veri alıcılarıyla özel veri işleme anlaşmaları</li>
            </ul>
            <p>
              Uluslararası veri transferleri hakkında daha fazla bilgi edinmek isterseniz, lütfen bizimle iletişime geçin.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="section-11"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-2xl font-semibold mb-4">11. Politika Değişiklikleri</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler yaptığımızda, web sitemizde veya uygulamamızda bir bildirim yayınlayarak veya size e-posta göndererek sizi bilgilendireceğiz.
            </p>
            <p>
              Değişikliklerden sonra Hizmeti kullanmaya devam etmeniz, güncellenmiş Gizlilik Politikasını kabul ettiğiniz anlamına gelir. Güncel politikayı düzenli olarak gözden geçirmenizi öneririz.
            </p>
            <p>
              Bu politikanın önceki versiyonlarına erişmek isterseniz, lütfen bizimle iletişime geçin.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="section-12"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
        >
          <h2 className="text-2xl font-semibold mb-4">12. Bize Ulaşın</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Bu Gizlilik Politikası veya kişisel verilerinizin işlenmesi hakkında sorularınız, endişeleriniz veya talepleriniz varsa, lütfen bizimle iletişime geçin:
            </p>
            <p>
              E-posta: <a href="mailto:gizlilik@falomi.com.tr" className="text-primary hover:underline">gizlilik@falomi.com.tr</a>
            </p>
            <p>
              Posta Adresi: Levent, 34330, İstanbul, Türkiye
            </p>
            <p>
              Veri Koruma Görevlisi: <a href="mailto:kvkk@falomi.com.tr" className="text-primary hover:underline">kvkk@falomi.com.tr</a>
            </p>
            <p>
              Sorularınız için ayrıca{" "}
              <Link href="/contact" className="text-primary hover:underline">
                İletişim Formumuzu
              </Link>{" "}
              da kullanabilirsiniz.
            </p>
          </div>
        </motion.section>

        <motion.div
          className="bg-white dark:bg-gray-950 rounded-xl p-6 md:p-8 border border-border shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-xl font-semibold mb-4">İlgili Kaynaklar</h3>
          <div className="space-y-4">
            <Link
              href="/terms"
              className="flex items-center gap-2 p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/40 dark:to-purple-950/40 border border-pink-100 dark:border-pink-900/30 rounded-lg hover:shadow-md transition-all duration-300"
            >
              <FileText className="h-5 w-5 text-pink-500" />
              <div>
                <span className="font-medium">Kullanım Şartları</span>
                <p className="text-sm text-muted-foreground">Falomi hizmetlerinin kullanım koşullarını inceleyin</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/40 dark:to-purple-950/40 border border-pink-100 dark:border-pink-900/30 rounded-lg hover:shadow-md transition-all duration-300"
            >
              <Mail className="h-5 w-5 text-pink-500" />
              <div>
                <span className="font-medium">İletişim</span>
                <p className="text-sm text-muted-foreground">Gizlilik konularında bizimle iletişime geçin</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
            </Link>
            <Link
              href="/faq"
              className="flex items-center gap-2 p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/40 dark:to-purple-950/40 border border-pink-100 dark:border-pink-900/30 rounded-lg hover:shadow-md transition-all duration-300"
            >
              <HelpCircle className="h-5 w-5 text-pink-500" />
              <div>
                <span className="font-medium">Sıkça Sorulan Sorular</span>
                <p className="text-sm text-muted-foreground">Gizlilik hakkında sık sorulan soruları cevaplayalım</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Alt bilgi */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.85 }}
      >
        <p className="text-sm text-muted-foreground">
          Bu gizlilik politikası en son {format(lastUpdated, "d MMMM yyyy", { locale: tr })} tarihinde güncellenmiştir.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          &copy; {new Date().getFullYear()} Falomi. Tüm hakları saklıdır.
        </p>
      </motion.div>
    </div>
  );
} 