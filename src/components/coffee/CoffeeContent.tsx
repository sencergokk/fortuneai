import { useEffect } from "react";
import { zodiacSigns, type ZodiacSign } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Upload, Coffee, Sparkles, Clock, Heart, Star, ArrowRight, 
  Coins,  Eye, CircleDot, Activity
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FortuneLoadingAnimation } from "@/components/fortune/FortuneLoadingAnimation";

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


// Interface for CoffeeContent props
interface CoffeeContentProps {
  description: string;
  question: string;
  selectedSign: ZodiacSign | null;
  reading: string | null;
  isLoading: boolean;
  imagePreview: string | null;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleQuestionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGetReading: () => void;
  setSelectedSign: (sign: ZodiacSign | null) => void;
  resetForm: () => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

// Export the CoffeeContent component
export default function CoffeeContent({
  description,
  question,
  selectedSign,
  reading,
  isLoading,
  imagePreview,
  handleDescriptionChange,
  handleQuestionChange,
  handleImageChange,
  handleGetReading,
  setSelectedSign,
  resetForm,
  activeTab,
  setActiveTab
}: CoffeeContentProps) {
  // Fal sonucu geldiğinde otomatik olarak reading tab'ına geçiş yap
  useEffect(() => {
    if (reading && activeTab !== "reading") {
      setActiveTab("reading");
    }
  }, [reading, activeTab, setActiveTab]);

  return (
    <div className="mx-auto mt-8 max-w-[980px]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Fincanınızı Tanımlayın</TabsTrigger>
          <TabsTrigger value="reading" disabled={!reading}>
            Kahve Falınız
          </TabsTrigger>
        </TabsList>
        <TabsContent value="input" className="mt-4">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="py-10"
            >
              <FortuneLoadingAnimation 
                type="coffee" 
                message="Fincanınızdaki şekiller yorumlanıyor ve kahve falınız hazırlanıyor..."
              />
            </motion.div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Fincanınızı Tanımlayın</CardTitle>
                <CardDescription>
                  Kahve fincanınızdaki şekilleri detaylı olarak anlatın veya fotoğraf yükleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="image" className="text-base">Fincan Fotoğrafı (İsteğe Bağlı)</Label>
                    <div className="flex items-center gap-4">
                      <div className="grid w-full gap-1.5">
                        <Label 
                          htmlFor="image" 
                          className="cursor-pointer flex items-center justify-center border-2 border-dashed border-muted-foreground/25 p-4 h-32 rounded-md hover:bg-muted transition-colors"
                        >
                          {imagePreview ? (
                            <div className="relative h-full w-full">
                              <Image 
                                src={imagePreview}
                                alt="Coffee cup"
                                className="object-contain"
                                fill={true}
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-muted-foreground">
                              <Upload className="h-8 w-8" />
                              <span>Fotoğraf yüklemek için tıklayın</span>
                            </div>
                          )}
                        </Label>
                        <Input 
                          id="image" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description" className="text-base">Fincan Tanımı</Label>
                    <Textarea
                      id="description"
                      placeholder="Fincanınızda gördüğünüz şekilleri detaylı olarak tanımlayın. Örneğin: 'Fincanın sağ tarafında bir kuş, alt kısmında dağ gibi bir şekil, sol tarafta bir yol görüyorum...'"
                      value={description}
                      onChange={handleDescriptionChange}
                      className="min-h-32"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="question" className="text-base">Sorunuz (İsteğe Bağlı)</Label>
                    <Input
                      id="question"
                      placeholder="Kahve falınızda özellikle cevap arıyorsanız sorunuzu yazın"
                      value={question}
                      onChange={handleQuestionChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-base">Burcunuz (İsteğe Bağlı)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {Object.entries(zodiacSigns).map(([key, sign]) => (
                        <Button
                          key={key}
                          type="button"
                          variant={selectedSign === key ? "default" : "outline"}
                          className="h-auto py-2 justify-start"
                          onClick={() => setSelectedSign(key as ZodiacSign)}
                        >
                          <span className="mr-2">{sign.emoji}</span>
                          {sign.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleGetReading} disabled={isLoading || !description.trim()}>
                  Falımı Göster
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="reading" className="mt-4">
          {reading && (
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 