import { useEffect} from "react";
import { zodiacSigns, type ZodiacSign } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Upload, Coffee, Sparkles, Clock, Heart, Star, ArrowRight, 
  Coins, Eye, CircleDot, Activity, X, Camera, ImageIcon, HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { toast } from "sonner";

// Helper functions (moved here or can be in a separate utils file)
function extractSection(reading: string, ...keywords: string[]): string | null {
  const lines = reading.split('\n');
  let extractedContent = '';
  let capturing = false;
  let previousLine = '';
  
  for (const line of lines) {
    if (!capturing && keywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))) {
      capturing = true;
      if (previousLine.trim()) {
        extractedContent += previousLine + '\n';
      }
      extractedContent += line + '\n';
      continue;
    }
    
    if (capturing && (line.trim() === '' || line.match(/^[A-ZÇĞİÖŞÜ].*:/))) {
      capturing = false;
      break;
    }
    
    if (capturing) {
      extractedContent += line + '\n';
    }
    
    previousLine = line;
  }
  
  return extractedContent.trim() || null;
}

function extractSymbols(reading: string): string[] {
  if (!reading) return [];
  
  const commonSymbols = [
    'fil', 'kuş', 'kalp', 'yol', 'ağaç', 'dağ', 'ev', 'yılan', 'balık', 
    'çiçek', 'yıldız', 'ay', 'güneş', 'göz', 'köpek', 'kedi', 'at', 
    'kuzu', 'aslan', 'kutu', 'gemi', 'uçak', 'araba', 'merdiven', 
    'anahtar', 'kapı', 'pencere', 'çanta', 'şemsiye', 'kitap', 'mektup',
    'para', 'yüzük', 'saat', 'kule', 'köprü', 'nehir', 'bulut', 'çizgi'
  ];
  
  const foundSymbols: string[] = [];
  
  commonSymbols.forEach(symbol => {
    const regex = new RegExp(`\\b${symbol}\\b`, 'gi');
    if (reading.match(regex)) {
      if (!foundSymbols.includes(symbol)) {
        foundSymbols.push(symbol);
      }
    }
  });
  
  const symbolRegex = /\b(sembol|figür|şekil)\b[^.]*((?:\w+))/gi;
  let match;
  
  while ((match = symbolRegex.exec(reading)) !== null) {
    const possibleSymbol = match[2].toLowerCase().trim();
    if (possibleSymbol.length > 2 && !foundSymbols.includes(possibleSymbol)) {
      foundSymbols.push(possibleSymbol);
    }
  }
  
  return foundSymbols.length > 0 ? foundSymbols : ['Genel semboller'];
}

const symbolMeanings: Record<string, string> = {
  'fil': 'güç, bereket, şans ve beklenmedik zenginlik',
  'kuş': 'haber, özgürlük ve gelecek fırsatlar',
  'kalp': 'aşk, romantizm ve duygusal gelişmeler',
  'yol': 'yeni bir yön, seçim yapmak veya yolculuk',
  'ağaç': 'uzun ömür, aile bağları ve gelişim',
  'dağ': 'zorluklar, engeller ve bunları aşma gücü',
  'ev': 'güvenlik, aile ve ev hayatındaki değişimler',
  'yılan': 'değişim, bilgelik veya aldatma',
  'balık': 'bolluk, bereket ve maddi kazançlar',
  'çiçek': 'mutluluk, şans ve yeni başlangıçlar',
  'yıldız': 'şans, fırsat ve hayallerin gerçekleşmesi',
  'ay': 'duygusallık, sezgi ve gizli düşünceler',
  'güneş': 'başarı, mutluluk ve enerji',
  'göz': 'korunma, dikkat ve farkındalık',
  'köpek': 'sadakat, dostluk ve koruma',
  'kedi': 'gizem, bağımsızlık ve feminen enerji',
  'at': 'güç, özgürlük ve hızlı gelişmeler',
  'kuzu': 'masumiyet, şefkat ve yeni başlangıçlar',
  'aslan': 'cesaret, liderlik ve güç',
  'kutu': 'sürprizler, gizli bilgiler ve beklenmeyen olaylar',
  'gemi': 'yolculuk, uzak yerler ve yeni deneyimler',
  'uçak': 'hızlı değişimler, uzak seyahatler ve yeni fırsatlar',
  'araba': 'ilerleme, hareket ve değişim',
  'merdiven': 'kariyer gelişimi, yükselme ve hedeflere ulaşma',
  'anahtar': 'çözümler, fırsatlar ve yeni kapıların açılması',
  'kapı': 'yeni fırsatlar, seçimler ve değişim',
  'pencere': 'yeni bakış açıları, farkındalık ve aydınlanma',
  'çanta': 'sorumluluklar, gizli sırlar veya maddi konular',
  'şemsiye': 'koruma, güvenlik ve olası sorunlardan kaçınma',
  'kitap': 'bilgi, öğrenme ve hayat dersleri',
  'mektup': 'haberler, iletişim ve yeni bilgiler',
  'para': 'finansal konular, bolluk ve maddi değişimler',
  'yüzük': 'bağlılık, evlilik veya önemli bir söz',
  'saat': 'zamanlama, sabır ve değişim zamanları',
};

function SymbolMeanings({ symbols, reading, delay }: { symbols: string[], reading: string, delay: number }) {
  if (!symbols.length || symbols[0] === 'Genel semboller') return null;
  
  const extractedMeanings: Record<string, string> = {};
  symbols.forEach(symbol => {
    const meaningRegex = new RegExp(`\\b${symbol}\\b[^.]*?(anlam|ifade|temsil|göster)[^.]*\\.`, 'gi');
    const match = reading.match(meaningRegex);
    
    if (match && match.length > 0) {
      extractedMeanings[symbol] = match[0].trim();
    } else if (symbolMeanings[symbol]) {
      extractedMeanings[symbol] = `${symbol}, ${symbolMeanings[symbol]} anlamına gelir.`;
    }
  });
  
  const foundMeanings = Object.entries(extractedMeanings);
  if (foundMeanings.length === 0) return null;
  
  return (
    <motion.div 
      className="mb-8 bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-yellow-400 to-amber-300 flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">Sembollerin Anlamları</h3>
      </div>
      <div className="grid gap-2 ml-8">
        {foundMeanings.map(([symbol, meaning], index) => (
          <motion.div 
            key={symbol}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + (index * 0.1) }}
            className="text-sm text-amber-800 dark:text-amber-300"
          >
            <span className="font-semibold capitalize">{symbol}: </span>
            <span>{meaning.includes(symbol) ? meaning : `${meaning}`}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 

function AnimatedReadingSection({
  icon,
  title,
  content,
  delay,
  color
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  delay: number;
  color: string;
}) {
  return (
    <motion.div 
      className="mb-6 last:mb-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <div className={cn("h-6 w-6 rounded-full bg-gradient-to-r flex items-center justify-center", color)}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">{title}</h3>
      </div>
      <p className="text-lg leading-relaxed font-serif whitespace-pre-line ml-8">
        {content}
      </p>
    </motion.div>
  );
}

// Dosya türünü kontrol eden yardımcı fonksiyon
function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/heic', 'image/heif'];
  return validTypes.includes(file.type);
}

// Interface for CoffeeContent props
interface CoffeeContentProps {
  question: string;
  selectedSign: ZodiacSign | null;
  reading: string | null;
  isLoading: boolean;
  imagePreview: string | null;
  handleQuestionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGetReading: () => void;
  setSelectedSign: (sign: ZodiacSign | null) => void;
  resetForm: () => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  cupImages: string[];
  setCupImages: React.Dispatch<React.SetStateAction<string[]>>;
}

// Export the CoffeeContent component
export default function CoffeeContent({
  question,
  selectedSign,
  reading,
  isLoading,
  handleQuestionChange,
  handleGetReading,
  setSelectedSign,
  resetForm,
  activeTab,
  setActiveTab,
  cupImages,
  setCupImages
}: CoffeeContentProps) {
  // Remove the local cupImages state since it's now passed from props
  // const [cupImages, setCupImages] = useState<string[]>([]);
  
  // Yüklenen resim dosyalarını işleyecek fonksiyon
  const handleCupImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // 3 resim limitini kontrol et - mevcut resimlerle birlikte toplam 3'ü geçmemeli
    const availableSlots = 3 - cupImages.length;
    if (availableSlots <= 0) {
      toast.error("En fazla 3 fincan fotoğrafı yükleyebilirsiniz.");
      return;
    }
    
    const newImages: string[] = [];
    // Sadece yüklenebilecek sayıda resmi alacağız
    const filesToProcess = Array.from(files).slice(0, availableSlots);
    
    // Kullanıcı çok fazla resim seçtiyse uyarı göster
    if (files.length > availableSlots) {
      toast.warning(`Sadece ${availableSlots} resim daha yükleyebilirsiniz. İlk ${availableSlots} resim işlenecek.`);
    }
    
    // Sadece resimleri işle ve base64'e dönüştür
    filesToProcess.forEach(file => {
      if (isValidImageFile(file)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === filesToProcess.filter(isValidImageFile).length) {
            setCupImages(prev => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };
  
  // Fotoğrafı kaldırma fonksiyonu
  const removeImage = (index: number) => {
    setCupImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Reset fonksiyonunu güncelliyoruz
  const handleReset = () => {
    resetForm();
  };
  
  // Değişiklik 1: Hem fal sonucu geldiğinde, hem de yükleme başladığında reading tab'ına geçiş yap
  useEffect(() => {
    if ((isLoading || reading) && activeTab !== "reading") {
      setActiveTab("reading");
    }
  }, [reading, isLoading, activeTab, setActiveTab]);

  return (
    <div className="mx-auto mt-8 max-w-[980px]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input" disabled={isLoading}>Kahve Falınız</TabsTrigger>
          <TabsTrigger value="reading" disabled={!reading && !isLoading}>Yorumunuz</TabsTrigger>
        </TabsList>
        <TabsContent value="input" className="p-0 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Kahve Falınız</CardTitle>
              <CardDescription>
                Türk kahvesi fincanınızın fotoğraflarını yükleyin. En iyi yorumu alabilmek için fincanın farklı açılardan 
                (iç kısmı, tabağa çevrilmiş hali ve tabağı) çekilmiş net fotoğraflarını yükleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Görsel yükleme ve önizleme alanı */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Camera className="h-4 w-4" />
                  Fincan Fotoğrafları (En fazla 3 adet)
                </Label>
                
                <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 mb-4">
                  <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="text-amber-800 dark:text-amber-300 text-sm font-medium">Nasıl fotoğraf çekmelisiniz?</AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-400 text-xs">
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>Fincanın içini net görebileceğimiz bir fotoğraf</li>
                      <li>Fincanı tabağa ters çevirip 40 sn bekledikten sonra kaldırılmış halini gösteren fotoğraf</li>
                      <li>Tabaktaki kahve izlerinin fotoğrafı</li>
                      <li>Varsa fincanın kulpu tarafındaki izlerin fotoğrafı</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                {/* Yüklenen görsellerin önizlemesi */}
                {cupImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3">
                    {cupImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-border">
                          <Image 
                            src={image} 
                            alt={`Fincan ${index + 1}`} 
                            className="w-full h-full object-cover"
                            width={200}
                            height={200}
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-90 hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Fotoğraf ekleme butonu */}
                    {cupImages.length < 3 && (
                      <div className="flex items-center justify-center border border-dashed border-border rounded-lg aspect-square">
                        <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-1" />
                          <span className="text-xs text-muted-foreground">Fotoğraf Ekle</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCupImageUpload}
                            className="hidden"
                            multiple
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Fotoğraf yükleme alanı - fotoğraf yoksa */}
                {cupImages.length === 0 && (
                  <div className="border border-dashed border-border rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Fincan fotoğraflarınızı buraya sürükleyin<br /> veya yüklemek için tıklayın</p>
                      <p className="text-xs text-muted-foreground mt-1 mb-2">En az 1, en fazla 3 fincan fotoğrafı yükleyebilirsiniz</p>
                      <Label 
                        htmlFor="cup-images" 
                        className="cursor-pointer mt-4 bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md text-sm"
                      >
                        Fotoğraf Seç
                      </Label>
                      <input
                        id="cup-images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleCupImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Diğer form alanları */}
              <div className="space-y-2">
                <Label htmlFor="question">Sorunuz (İsteğe bağlı)</Label>
                <Input
                  id="question"
                  placeholder="Merak ettiğiniz bir konu veya soru"
                  value={question}
                  onChange={handleQuestionChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Coffee className="h-4 w-4" />
                  Burcunuz (İsteğe bağlı)
                </Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {Object.keys(zodiacSigns).map((sign) => (
                    <Button
                      key={sign}
                      type="button"
                      variant={selectedSign === sign ? "default" : "outline"}
                      size="sm"
                      className={cn("w-full", 
                        selectedSign === sign ? 
                        "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" : 
                        ""
                      )}
                      onClick={() => setSelectedSign(selectedSign === sign ? null : sign as ZodiacSign)}
                      disabled={isLoading}
                    >
                      {zodiacSigns[sign as ZodiacSign].name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
              >
                Temizle
              </Button>
              
              <div className="flex items-center">
                <p className="text-xs mr-3 text-muted-foreground">3 kredi kullanılacak</p>
                <Button 
                  onClick={handleGetReading}
                  disabled={
                    isLoading || cupImages.length === 0
                  }
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  {isLoading ? (
                    <>Yorumlanıyor</>
                  ) : (
                    <>Falımı Yorumla</>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Fal yorumu tab'ı - mevcut kodlara dokunmuyoruz */}
        <TabsContent value="reading" className="p-0 pt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="max-w-md text-center space-y-4">
                <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300">
                  Fincanınızdaki şekiller analiz ediliyor...
                </h3>
                <p className="text-muted-foreground text-sm">
                  Fotoğraflarınızdaki fincan, tabak ve kahve izlerindeki sembolleri analiz ediyoruz. Bu işlem yaklaşık 15-20 saniye sürebilir.
                </p>
                <div className="pt-4 flex justify-center">
                  <div className="inline-flex gap-1.5">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.2 }}
                      className="w-2 h-2 rounded-full bg-amber-400"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.2, repeatDelay: 0.2 }}
                      className="w-2 h-2 rounded-full bg-amber-400"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, repeatDelay: 0.2 }}
                      className="w-2 h-2 rounded-full bg-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : reading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-amber-200 dark:border-amber-800 shadow-lg overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 via-orange-300 to-amber-300" />
                
                <CardHeader className="relative pb-8">
                  <div className="absolute inset-0 overflow-hidden opacity-5">
                    <div className="absolute inset-0 bg-repeat opacity-10" 
                         style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIvPjwvZz48L3N2Zz4=')" }} />
                  </div>
                  
                  <motion.div 
                    className="flex justify-center mb-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 dark:from-amber-700 dark:to-amber-900 flex items-center justify-center">
                      <Coffee className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  
                  <CardTitle className="text-3xl text-center font-serif">
                    <span className="tracking-wide">Kahve Falınız</span>
                  </CardTitle>
                  
                  {question && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <CardDescription className="mt-3 text-center italic text-base">
                        <span className="text-amber-700 dark:text-amber-300 font-medium">Sorduğunuz:</span> &quot;{question}&quot;
                      </CardDescription>
                    </motion.div>
                  )}
                  
                  <div className="flex items-center justify-center mt-4 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                      >
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      </motion.div>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <motion.div 
                    className="prose prose-amber dark:prose-invert mx-auto max-w-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="p-6 rounded-lg bg-white/60 dark:bg-black/10 backdrop-blur-sm border border-amber-100 dark:border-amber-800/50 shadow-inner">
                      {/* Fincanda Görülen Semboller */}
                      <motion.div 
                        className="mb-8 bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 flex items-center justify-center">
                            <Eye className="h-3.5 w-3.5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">Fincanda Görülen Semboller</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-8 mb-3">
                          {extractSymbols(reading).map((symbol, index) => (
                            <motion.span 
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.7 + (index * 0.1) }}
                              className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm border border-amber-200 dark:border-amber-800/30 shadow-sm"
                            >
                              <CircleDot className="h-3 w-3 mr-1.5" />
                              {symbol}
                            </motion.span>
                          ))}
                        </div>
                        <div className="ml-8 mt-3 text-sm text-amber-700 dark:text-amber-400 italic">
                          Figürler kahve falında görülen sembollerden oluşturulmuştur. Her sembol farklı anlamlar taşır.
                        </div>
                      </motion.div>
                      
                      <SymbolMeanings 
                        symbols={extractSymbols(reading)}
                        reading={reading}
                        delay={0.8}
                      />
                      
                      <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 flex items-center justify-center">
                            <Clock className="h-3.5 w-3.5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">Genel Yorumunuz</h3>
                        </div>
                        <p className="text-lg leading-relaxed font-serif whitespace-pre-line ml-8">
                          {extractSection(reading, "Genel Yorumunuz", "Genel", "Yorumunuz") || reading.split('\n\n')[0] || reading}
                        </p>
                      </div>
                      
                      <AnimatedReadingSection 
                        icon={<Heart className="h-3.5 w-3.5 text-white" />} 
                        title="Aşk & İlişkiler"
                        content={extractSection(reading, "Aşk", "İlişkiler") || "Kahve fincanında aşk ve ilişkiler ile ilgili özel işaretler görünmüyor."}
                        delay={1.0}
                        color="from-pink-400 to-rose-300"
                      />
                      
                      <AnimatedReadingSection 
                        icon={<Sparkles className="h-3.5 w-3.5 text-white" />} 
                        title="Kariyer & Başarı"
                        content={extractSection(reading, "Kariyer", "İş", "Başarı") || "Kahve fincanında kariyer ve iş hayatı ile ilgili özel işaretler görünmüyor."}
                        delay={1.2}
                        color="from-blue-400 to-indigo-300"
                      />
                      
                      <AnimatedReadingSection 
                        icon={<Coins className="h-3.5 w-3.5 text-white" />} 
                        title="Para & Bolluk"
                        content={extractSection(reading, "Para", "Bolluk", "Maddi") || "Kahve fincanında para ve bolluk ile ilgili özel işaretler görünmüyor."}
                        delay={1.4}
                        color="from-emerald-400 to-green-300"
                      />
                      
                      <AnimatedReadingSection 
                        icon={<Activity className="h-3.5 w-3.5 text-white" />} 
                        title="Sağlık & Enerji"
                        content={extractSection(reading, "Sağlık", "Enerji", "Fiziksel") || "Kahve fincanında sağlık ve enerji ile ilgili özel işaretler görünmüyor."}
                        delay={1.6}
                        color="from-orange-400 to-amber-300"
                      />
                    </div>
                  </motion.div>
                </CardContent>
                
                <motion.div 
                  className="relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                >
                  <CardFooter className="flex justify-center py-6 mt-2 bg-gradient-to-b from-transparent to-amber-100/50 dark:to-amber-900/20">
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="mr-2 bg-white dark:bg-black border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-all duration-300 shadow-sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Yeni Fal Bak
                    </Button>
                  </CardFooter>
                </motion.div>
              </Card>
            </motion.div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
} 