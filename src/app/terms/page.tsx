"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, FileText, Check } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const lastUpdated = new Date(2023, 11, 15); // 15 Aralık 2023

export default function TermsPage() {
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
          <Sparkles className="h-4 w-4 text-pink-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600">
            Yasal Bilgiler
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Kullanım Şartları</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Bu şartlar, Falomi fal uygulamasının kullanımına ilişkin yasal düzenlemeleri ve yükümlülükleri açıklar.
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
            "Kullanım Koşullarının Kabulü",
            "Hizmet Tanımı",
            "Hesap Oluşturma ve Güvenlik",
            "Ödeme ve Abonelikler",
            "Gizlilik Politikası",
            "Fikri Mülkiyet Hakları",
            "Kullanıcı Sorumlulukları",
            "Hizmet Sınırlamaları ve Değişiklikler",
            "Fesih",
            "Sorumluluk Reddi",
            "Tazminat",
            "Uygulanacak Hukuk",
            "İletişim Bilgileri",
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
          <h2 className="text-2xl font-semibold mb-4">1. Kullanım Koşullarının Kabulü</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Falomi uygulamasını kullanarak, bu kullanım koşullarını tam olarak ve koşulsuz şekilde kabul etmiş sayılırsınız. Eğer bu koşulları kabul etmiyorsanız, lütfen uygulamayı kullanmayı bırakın.
            </p>
            <p>
              Falomi, bu kullanım koşullarını herhangi bir zamanda değiştirme hakkını saklı tutar. Değişiklikler, uygulamada yayınlandığı tarihten itibaren geçerli olacaktır. Kullanıcılar, uygulamayı kullanmaya devam ederek güncellenmiş koşulları kabul etmiş sayılırlar.
            </p>
            <p>
              Kullanıcı, hizmetimizi kullanarak 18 yaşından büyük olduğunu veya reşit olduğunu, ya da ebeveyn/yasal vasisinin izniyle hareket ettiğini ve bu sözleşmenin şartlarını kabul etme yetkisine sahip olduğunu beyan ve taahhüt eder.
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
          <h2 className="text-2xl font-semibold mb-4">2. Hizmet Tanımı</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Falomi, kullanıcılarına kahve falı, tarot, astroloji, ve rüya yorumu gibi çeşitli fal ve yorumlama hizmetleri sunan bir dijital platformdur. Uygulamamız, kullanıcılarına eğlence ve kişisel gelişim amaçlı içerikler sunmayı amaçlar.
            </p>
            <p>
              Sunulan tüm fal ve yorumlar tamamen eğlence amaçlıdır ve hiçbir şekilde profesyonel tavsiye, psikolojik destek, tıbbi öneri, finansal danışmanlık veya hukuki görüş niteliğinde değildir.
            </p>
            <p>
              Falomi&apos;nin sağladığı hizmetler, kullanıcının kararlarını veya eylemlerini belirlemek için değil, sadece eğlence ve kişisel içgörü amacıyla kullanılmalıdır. Kullanıcılar, hayatlarıyla ilgili önemli kararlar alırken profesyonel tavsiye almalıdır.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="section-3"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-4">3. Hesap Oluşturma ve Güvenlik</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Falomi&apos;nin bazı özelliklerini kullanabilmek için hesap oluşturmanız gerekebilir. Hesap oluşturduğunuzda, doğru, güncel ve eksiksiz bilgiler sağlamakla yükümlüsünüz. Bu bilgileri güncel tutma sorumluluğu size aittir.
            </p>
            <p>
              Kullanıcı adınız ve şifreniz dahil hesap bilgilerinizin gizliliğini korumakla yükümlüsünüz. Hesabınızda yetkisiz bir erişim ya da kullanım olduğunu fark etmeniz durumunda, derhal Falomi&apos;ye bildirmeniz gerekir.
            </p>
            <p>
              Falomi, herhangi bir hesabı herhangi bir zamanda ve herhangi bir nedenle askıya alma veya sonlandırma hakkını saklı tutar. Özellikle, bu kullanım koşullarının ihlali durumunda böyle bir yaptırım uygulanabilir.
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
          <h2 className="text-2xl font-semibold mb-4">4. Ödeme ve Abonelikler</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Falomi, bazı premium özelliklere erişim için kredi sistemi veya abonelik modeli kullanmaktadır. Ödeme bilgilerinizi sağlayarak, belirtilen ücretlerin sizden tahsil edilmesine izin vermiş olursunuz.
            </p>
            <p>
              Tüm fiyatlar, vergiler dahil olmak üzere Türk Lirası (TL) cinsinden belirtilmiştir. Falomi, fiyatları önceden haber vermeksizin değiştirme hakkını saklı tutar, ancak mevcut aboneliklerin fiyatını abonelik dönemi içinde değiştirmez.
            </p>
            <p>
              Abonelikler, siz iptal etmediğiniz sürece otomatik olarak yenilenir. İptal işlemleri, bir sonraki ödeme tarihinden en az 24 saat önce yapılmalıdır. İptal işlemi, mevcut abonelik döneminin sonuna kadar hizmet erişiminizi etkilemez.
            </p>
            <p>
              Kredi satın alımları kesin olup, kullanılmamış krediler için geri ödeme yapılmaz. Abonelikler için iade politikası, satın alımdan sonraki 14 gün içinde ve hizmetin kullanılmamış olması şartıyla geçerlidir.
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
          <h2 className="text-2xl font-semibold mb-4">5. Gizlilik Politikası</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Kullanıcılarımızın gizliliği bizim için önemlidir. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında detaylı bilgi için lütfen{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Gizlilik Politikamızı
              </Link>{" "}
              inceleyin.
            </p>
            <p>
              Falomi&apos;yi kullanarak, Gizlilik Politikamızda belirtilen veri toplama ve işleme uygulamalarını kabul etmiş sayılırsınız. Eğer bu politikayı kabul etmiyorsanız, lütfen uygulamayı kullanmayı bırakın.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="section-6"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <h2 className="text-2xl font-semibold mb-4">6. Fikri Mülkiyet Hakları</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Falomi uygulaması, içeriği, logoları, yazılımı ve diğer tüm unsurları, ilgili fikri mülkiyet hakları kanunları tarafından korunmaktadır. Bu içeriklerin tümü, Falomi veya lisans verenlerin mülkiyetindedir.
            </p>
            <p>
              Kullanıcılar, Falomi&apos;nin yazılı izni olmadan, uygulamanın içeriğini kopyalayamaz, değiştiremez, dağıtamaz veya ticari amaçla kullanamaz. Kişisel ve ticari olmayan kullanım için sınırlı bir lisans verilmiştir.
            </p>
            <p>
              Kullanıcılar tarafından uygulama üzerinde paylaşılan içerikler (yorumlar, geri bildirimler vb.) için, Falomi&apos;ye dünya çapında, süresiz, münhasır olmayan, telifsiz ve alt lisans verilebilir bir lisans vermiş olursunuz.
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
          <h2 className="text-2xl font-semibold mb-4">7. Kullanıcı Sorumlulukları</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Falomi&apos;yi kullanırken, kullanıcılar aşağıdaki davranışlardan kaçınmakla yükümlüdür:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Yasa dışı, zararlı, tehditkar, taciz edici veya ayrımcı içerik paylaşmak</li>
              <li>Başkalarının fikri mülkiyet haklarını ihlal etmek</li>
              <li>Virüs veya zararlı yazılım yaymak</li>
              <li>Uygulamanın normal işleyişini bozmak veya aşırı yüklemek</li>
              <li>Uygulama güvenliğini ihlal etmek veya buna teşebbüs etmek</li>
              <li>Falomi&apos;nin yazılı izni olmadan uygulamaya otomatik sorgular göndermek</li>
              <li>Yanlış veya yanıltıcı bilgi sağlamak</li>
            </ul>
            <p>
              Bu yükümlülüklerin ihlali, hesabınızın askıya alınması veya sonlandırılması ile sonuçlanabilir. Ayrıca, yasadışı faaliyetler ilgili yetkililere bildirilecektir.
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
          <h2 className="text-2xl font-semibold mb-4">8. Hizmet Sınırlamaları ve Değişiklikler</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Falomi, uygulamanın özelliklerini, içeriğini veya işlevselliğini herhangi bir zamanda ve herhangi bir nedenle değiştirme, askıya alma veya sonlandırma hakkını saklı tutar.
            </p>
            <p>
              Uygulamanın kullanılabilirliği veya erişilebilirliği konusunda herhangi bir garanti verilmez. Bakım, güncelleme veya diğer nedenlerle uygulamada kesintiler olabilir.
            </p>
            <p>
              Falomi, önceden bildirimde bulunmaksızın uygulamaya yeni özellikler ekleyebilir veya mevcut özellikleri kaldırabilir. Ücretli hizmetler için yapılacak önemli değişiklikler, makul bir süre öncesinde bildirilecektir.
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
          <h2 className="text-2xl font-semibold mb-4">9. Fesih</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Kullanıcılar, istedikleri zaman hesaplarını silme veya aboneliklerini iptal etme hakkına sahiptir. Hesap silindiğinde, kullanıcının tüm verileri kalıcı olarak silinebilir.
            </p>
            <p>
              Falomi, kendi takdirine bağlı olarak, bu kullanım koşullarının ihlali veya diğer haklı nedenlerle, herhangi bir kullanıcının hesabını sonlandırma veya hizmet erişimini engelleme hakkını saklı tutar.
            </p>
            <p>
              Sözleşmenin feshi, ödenmemiş ücretleri veya fesih tarihinden önce ortaya çıkan yükümlülükleri etkilemez.
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
          <h2 className="text-2xl font-semibold mb-4">10. Sorumluluk Reddi</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              FALOMI UYGULAMASI &quot;OLDUĞU GİBİ&quot; VE &quot;MEVCUT OLDUĞU ŞEKILDE&quot; SUNULUR, HERHANGİ BİR GARANTİ VERİLMEZ. FALOMI, AÇIK VEYA ZIMNİ, SATILABİLİRLİK, BELİRLİ BİR AMACA UYGUNLUK VEYA İHLAL ETMEME DAHİL OLMAK ÜZERE, TÜM GARANTİLERİ REDDEDER.
            </p>
            <p>
              FALOMI, UYGULAMANIN KESİNTİSİZ, ZAMANINDA, GÜVENLİ VEYA HATASIZ OLACAĞINI; HERHANGİ BİR HATA VEYA KUSURÜN DÜZELTİLECEĞİNİ; VEYA UYGULAMANIN VİRÜS VEYA DİĞER ZARARLI BİLEŞENLERDEN ARINMIŞ OLACAĞINI GARANTİ ETMEZ.
            </p>
            <p>
              HİÇBİR DURUMDA FALOMI, KULLANICILARINDAKİ VEYA ÜÇÜNCÜ TARAFLARDAN KAYNAKLANAN HERHANGİ BİR DOĞRUDAN, DOLAYLI, ARIZİ, ÖZEL, CEZAİ VEYA SONUÇ OLARAK ORTAYA ÇIKAN ZARARLARDAN SORUMLU OLMAYACAKTIR.
            </p>
            <p>
              FALOMI TARAFINDAN SAĞLANAN YORUMLAR VE TAHMİNLER TAMAMEN EĞLENCE AMAÇLIDIR VE GELECEKTEKİ OLAYLARIN KESİN TAHMİNLERİ OLARAK YORUMLANMAMALIDIR.
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
          <h2 className="text-2xl font-semibold mb-4">11. Tazminat</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Kullanıcı, Falomi&apos;yi, yöneticilerini, çalışanlarını ve temsilcilerini, kullanıcının bu kullanım koşullarını ihlalinden kaynaklanan tüm iddia, sorumluluk, zarar, kayıp ve masraflardan (makul avukatlık ücretleri dahil) tazmin eder ve zarardan muaf tutar.
            </p>
            <p>
              Bu tazminat yükümlülüğü, kullanıcının Falomi uygulamasını kullanması, kullanıcı tarafından yayınlanan içerik veya kullanıcının bu koşulları ihlal etmesi sonucunda ortaya çıkan tüm iddiaları kapsar.
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
          <h2 className="text-2xl font-semibold mb-4">12. Uygulanacak Hukuk</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Bu kullanım koşulları, Türkiye Cumhuriyeti kanunlarına tabidir ve bu kanunlara göre yorumlanacaktır, kanunlar ihtilafı prensipleri hariç tutulmuştur.
            </p>
            <p>
              Bu koşullardan kaynaklanan veya bunlarla ilgili herhangi bir anlaşmazlık, İstanbul mahkemelerinin münhasır yargı yetkisine tabi olacaktır.
            </p>
            <p>
              Bu koşulların herhangi bir hükmünün geçersiz veya uygulanamaz olduğu tespit edilirse, bu hüküm minimum ölçüde sınırlandırılacak veya elimine edilecek, böylece kalan hükümler tam olarak yürürlükte kalacak ve etkisini sürdürecektir.
            </p>
          </div>
        </motion.section>

        <motion.section
          id="section-13"
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold mb-4">13. İletişim Bilgileri</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Bu kullanım koşulları hakkında sorularınız veya endişeleriniz varsa, lütfen bizimle iletişime geçin:
            </p>
            <p>
              E-posta: <a href="mailto:yasal@falomi.com.tr" className="text-primary hover:underline">yasal@falomi.com.tr</a>
            </p>
            <p>
              Posta Adresi: Levent, 34330, İstanbul, Türkiye
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
      </div>

      {/* Alt bilgi */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.85 }}
      >
        <p className="text-sm text-muted-foreground">
          Bu kullanım şartları en son {format(lastUpdated, "d MMMM yyyy", { locale: tr })} tarihinde güncellenmiştir.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          &copy; {new Date().getFullYear()} Falomi. Tüm hakları saklıdır.
        </p>
      </motion.div>
    </div>
  );
} 