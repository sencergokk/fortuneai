"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Star, Clock, Zap, Gift, TrendingUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import Image from "next/image";

const creditPackages = [
  {
    id: "starter",
    name: "Starter",
    credits: 50,
    price: 9.99,
    originalPrice: 14.99,
    features: [
      "50 Kredi",
      "Tüm Fal Türleri",
      "7 Gün Geçerlilik",
      "Öncelikli Destek",
      "Özel Fal Seçenekleri",
    ],
    icon: <Zap className="h-8 w-8 text-purple-400" />,
    color: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/30",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    id: "popular",
    name: "Popular",
    credits: 150,
    price: 24.99,
    originalPrice: 39.99,
    features: [
      "150 Kredi",
      "Tüm Fal Türleri",
      "30 Gün Geçerlilik",
      "Öncelikli Destek",
      "Özel Fal Seçenekleri",
    ],
    popular: true,
    icon: <Star className="h-8 w-8 text-amber-400" />,
    color: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    promotion: "38% indirim",
  },
  {
    id: "premium",
    name: "Premium",
    credits: 400,
    price: 49.99,
    originalPrice: 99.99,
    features: [
      "400 Kredi",
      "Tüm Fal Türleri",
      "90 Gün Geçerlilik",
      "Özel Fal Seçenekleri",
      "Özel Yorumlar",
    ],
    icon: <Sparkles className="h-8 w-8 text-blue-400" />,
    color: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    promotion: "50% indirim",
  },
];

export default function CreditsPage() {
  const { language } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState<string | null>("popular");
  const { user, credits, redeemCoupon } = useAuth();
  const [countdown, setCountdown] = useState({ hours: 5, minutes: 59, seconds: 59 });
  const [hasVisited, setHasVisited] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isSubmittingCoupon, setIsSubmittingCoupon] = useState(false);

  useEffect(() => {
    // Show confetti on first component mount
    if (!hasVisited) {
      const end = Date.now() + 2 * 1000;
      const colors = ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'];
      
      (function frame() {
        confetti({
          particleCount: 7,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 7,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });
      
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
      
      setHasVisited(true);
    }
  }, [hasVisited]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prevState => {
        if (prevState.seconds > 0) {
          return { ...prevState, seconds: prevState.seconds - 1 };
        } else if (prevState.minutes > 0) {
          return { ...prevState, minutes: prevState.minutes - 1, seconds: 59 };
        } else if (prevState.hours > 0) {
          return { hours: prevState.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prevState;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePurchase = async () => {
    if (!user) {
      toast.error(language === "tr" ? "Lütfen önce giriş yapın." : "Please login first.");
      return;
    }

    // Play confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // TODO: Implement payment integration
    toast.success(
      language === "tr"
        ? "Ödeme işlemi başlatılıyor..."
        : "Starting payment process..."
    );
  };

  // Calculate savings
  const calculateSavings = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      toast.error(language === "tr" ? "Lütfen bir kupon kodu girin." : "Please enter a coupon code.");
      return;
    }

    if (!user) {
      toast.error(language === "tr" ? "Kupon kullanmak için giriş yapmalısınız." : "You must be logged in to use a coupon.");
      return;
    }

    setIsSubmittingCoupon(true);
    try {
      const success = await redeemCoupon(couponCode);
      if (success) {
        setCouponCode("");
      }
    } finally {
      setIsSubmittingCoupon(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="container mx-auto py-8">
      <motion.div 
        className="text-center mb-12"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-400" />
          {language === "tr" ? "Özel Fırsat Paketleri" : "Special Offer Packages"}
          <Sparkles className="h-6 w-6 text-yellow-400" />
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {language === "tr"
            ? "Sınırlı süre için özel indirimli fırsat paketlerini kaçırmayın! Mistik yolculuğunuzu uygun fiyatlarla sürdürün."
            : "Don't miss our special discounted packages for a limited time! Continue your mystical journey at affordable prices."}
        </p>
        
        <div className="flex items-center justify-center mt-4 mb-8 space-x-2 font-bold text-xl">
          <Clock className="h-5 w-5 text-red-500" />
          <span className="text-red-500">
            {countdown.hours.toString().padStart(2, '0')}:
            {countdown.minutes.toString().padStart(2, '0')}:
            {countdown.seconds.toString().padStart(2, '0')}
          </span>
        </div>
        
        {credits !== undefined && (
          <motion.div 
            className="bg-muted rounded-lg p-4 max-w-md mx-auto mb-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg">{language === "tr" ? "Mevcut Krediniz" : "Your Current Credits"}</p>
            <p className="text-3xl font-bold">{credits} {language === "tr" ? "Kredi" : "Credits"}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {language === "tr" 
                ? "Kredilerinizi tüm fal hizmetlerinde kullanabilirsiniz"
                : "You can use your credits for all fortune telling services"}
            </p>
          </motion.div>
        )}
      </motion.div>
      
      {/* Special offer banner */}
      <motion.div 
        className="relative overflow-hidden rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6 mb-8 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="absolute inset-0 opacity-20">
          {/* Fallback: eğer bu görsel yoksa, bir şey göstermeyecek */}
          {false && (
            <Image 
              src="/images/stars-pattern.png" 
              alt="Stars pattern" 
              layout="fill" 
              objectFit="cover"
              className="opacity-20"
              style={{ objectFit: 'cover' }}
              width={1000}
              height={1000}
            />
          )}
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <Gift className="mr-2 h-6 w-6" /> 
              {language === "tr" ? "İlk Alışverişe Özel" : "Special First Purchase"}
            </h2>
            <p className="max-w-md">
              {language === "tr" 
                ? "İlk kredi paketinizi satın alın, ekstra %15 kredi kazanın! Bu fırsat sadece yeni kullanıcılar için geçerlidir."
                : "Buy your first credit package and get extra 15% credits! This offer is valid only for new users."}
            </p>
          </div>
          <div>
            <Button variant="secondary" className="text-indigo-600 bg-white hover:bg-gray-100">
              {language === "tr" ? "Kupon Kodu: YENI15" : "Coupon Code: NEW15"}
            </Button>
          </div>
        </div>
      </motion.div>

      {user && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "tr" ? "Kupon Kodu Kullan" : "Redeem Coupon Code"}
              </CardTitle>
              <CardDescription>
                {language === "tr" 
                  ? "Promosyon kupon kodunuzu girerek ekstra kredi kazanın" 
                  : "Enter your promotional coupon code to earn extra credits"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCouponSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder={language === "tr" ? "KUPON KODU" : "COUPON CODE"}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button type="submit" disabled={isSubmittingCoupon} className="shrink-0">
                  {isSubmittingCoupon ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {language === "tr" ? "İşleniyor..." : "Processing..."}
                    </>
                  ) : (
                    language === "tr" ? "Kullan" : "Redeem"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {creditPackages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <Card
              className={`relative h-full ${pkg.color} ${pkg.borderColor} ${
                pkg.popular ? "border-2 shadow-lg" : ""
              } ${selectedPackage === pkg.id ? "ring-2 ring-primary" : ""} transition-all hover:shadow-lg`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {pkg.popular && (
                <Badge
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1"
                  variant="default"
                >
                  {language === "tr" ? "En Popüler" : "Most Popular"}
                </Badge>
              )}
              {pkg.promotion && (
                <div className="absolute -right-2 -top-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md transform rotate-12">
                  {pkg.promotion}
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="mb-3">{pkg.icon}</div>
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end">
                      <span className="text-sm font-medium line-through text-muted-foreground mr-2">
                        {pkg.originalPrice}₺
                      </span>
                      <span className="text-3xl font-bold">{pkg.price}₺</span>
                    </div>
                    <Badge variant="outline" className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      {calculateSavings(pkg.originalPrice, pkg.price)}% {language === "tr" ? "indirim" : "off"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="bg-primary/10 text-primary rounded-md p-3 mb-4 flex items-center gap-2"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 + (index * 0.1) }}
                >
                  <TrendingUp className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    {language === "tr" 
                      ? `${pkg.credits} kredi = ${Math.round(pkg.credits / 1)} fal`
                      : `${pkg.credits} credits = ${Math.round(pkg.credits / 1)} readings`}
                  </p>
                </motion.div>
                
                <ul className="space-y-3">
                  {pkg.features.map((feature, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (i * 0.05) + (index * 0.1) }}
                    >
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full text-base py-6"
                  variant={selectedPackage === pkg.id ? "default" : "outline"}
                  onClick={() => handlePurchase()}
                  size="lg"
                >
                  {language === "tr" ? "Satın Al" : "Purchase"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
              <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm">
              {language === "tr" ? "Güvenli Ödeme" : "Secure Payment"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm">
              {language === "tr" ? "Anında Teslimat" : "Instant Delivery"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
              <Check className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm">
              {language === "tr" ? "7/24 Destek" : "24/7 Support"}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {language === "tr"
            ? "Tüm ödemeler güvenli bir şekilde işlenir. Kredi paketleri satın alındıktan sonra iade edilemez."
            : "All payments are processed securely. Credit packages are non-refundable after purchase."}
        </p>
      </motion.div>

      <motion.div 
        className="mt-12 bg-muted rounded-lg p-6 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-xl font-bold mb-4">
          {language === "tr" ? "Sık Sorulan Sorular" : "Frequently Asked Questions"}
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">
              {language === "tr" 
                ? "Kredilerim ne kadar süreyle geçerli olacak?" 
                : "How long will my credits be valid?"}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              {language === "tr"
                ? "Kredilerinizin geçerlilik süresi satın aldığınız pakete göre değişir. Starter paketi 7 gün, Popular paketi 30 gün, Premium paketi ise 90 gün geçerlidir."
                : "The validity period of your credits varies according to the package you purchase. Starter package is valid for 7 days, Popular package for 30 days, and Premium package for 90 days."}
            </p>
          </div>
          <div>
            <h3 className="font-medium">
              {language === "tr" 
                ? "Kalan kredilerimi nasıl görebilirim?" 
                : "How can I see my remaining credits?"}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              {language === "tr"
                ? "Kalan kredilerinizi profilinizde ve her fal sayfasında görebilirsiniz."
                : "You can see your remaining credits in your profile and on every fortune telling page."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 