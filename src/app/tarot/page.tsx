"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getTarotReading } from "@/lib/fortune-api";
import { TarotSpread } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight, Moon, 
  Eye, Sun, Star, 
  LibraryBig, Hand, Flame, RefreshCw, Sparkles 
} from "lucide-react";
import { toast } from "sonner";
import { ProtectedFeature } from "@/components/auth/ProtectedFeature";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { FortuneLoadingAnimation } from "@/components/fortune/FortuneLoadingAnimation";

// Add tarot card data
const tarotCards = [
  { id: 1, name: "The Fool", image: "/tarot/fool.jpg" },
  { id: 2, name: "The Magician", image: "/tarot/magician.jpg" },
  { id: 3, name: "The High Priestess", image: "/tarot/high-priestess.jpg" },
  { id: 4, name: "The Empress", image: "/tarot/empress.jpg" },
  { id: 5, name: "The Emperor", image: "/tarot/emperor.jpg" },
  { id: 6, name: "The Hierophant", image: "/tarot/hierophant.jpg" },
  { id: 7, name: "The Lovers", image: "/tarot/lovers.jpg" },
  { id: 8, name: "The Chariot", image: "/tarot/chariot.jpg" },
  { id: 9, name: "Strength", image: "/tarot/strength.jpg" },
  { id: 10, name: "The Hermit", image: "/tarot/hermit.jpg" },
  { id: 11, name: "Wheel of Fortune", image: "/tarot/wheel-of-fortune.jpg" },
  { id: 12, name: "Justice", image: "/tarot/justice.jpg" },
  { id: 13, name: "The Hanged Man", image: "/tarot/hanged-man.jpg" },
  { id: 14, name: "Death", image: "/tarot/death.jpg" },
  { id: 15, name: "Temperance", image: "/tarot/temperance.jpg" },
  { id: 16, name: "The Devil", image: "/tarot/devil.jpg" },
  { id: 17, name: "The Tower", image: "/tarot/tower.jpg" },
  { id: 18, name: "The Star", image: "/tarot/star.jpg" },
  { id: 19, name: "The Moon", image: "/tarot/moon.jpg" },
  { id: 20, name: "The Sun", image: "/tarot/sun.jpg" },
  { id: 21, name: "Judgment", image: "/tarot/judgment.jpg" },
  { id: 22, name: "The World", image: "/tarot/world.jpg" },
];

const tarotSpreads: Record<TarotSpread, { 
  name: string; 
  description: string; 
  icon: React.ReactNode;
  color: string;
  credits: number;
  cardCount: number;
}> = {
  "single-card": {
    name: "Tek Kart",
    description: "Günlük rehberlik veya basit bir soruya cevap için idealdir",
    icon: <Sun className="h-8 w-8" />,
    color: "from-amber-300 to-yellow-500 border-amber-200 dark:border-amber-800",
    credits: 1,
    cardCount: 1
  },
  "three-card": {
    name: "Üç Kart",
    description: "Geçmiş, şimdi ve gelecek veya durum, eylem ve sonuç gibi üçlü bir perspektif sunar",
    icon: <LibraryBig className="h-8 w-8" />,
    color: "from-emerald-300 to-teal-500 border-emerald-200 dark:border-emerald-800",
    credits: 1,
    cardCount: 3
  },
  "celtic-cross": {
    name: "Kelt Haçı",
    description: "Derinlemesine ve kapsamlı bir okuma için 10 kart kullanılan klasik düzen",
    icon: <Flame className="h-8 w-8" />,
    color: "from-purple-300 to-violet-500 border-purple-200 dark:border-purple-800",
    credits: 3,
    cardCount: 10
  },
};

export default function TarotPage() {
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread | null>(null);
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCardSelection, setShowCardSelection] = useState(false);
  const [activeTab, setActiveTab] = useState("select");
  const auth = useAuth();

  const handleSpreadSelect = (spread: TarotSpread) => {
    setSelectedSpread(spread);
    setSelectedCards([]);
    setShowCardSelection(false);
    setReading(null);
    setActiveTab("select");
  };

  const handleProceedToCardSelection = () => {
    setShowCardSelection(true);
  };

  const handleCardSelect = (cardId: number) => {
    if (!selectedSpread) return;

    const newSelectedCards = [...selectedCards];
    const index = newSelectedCards.indexOf(cardId);

    if (index === -1) {
      // Kart seçilmemişse, ekle (eğer limit aşılmıyorsa)
      if (selectedCards.length < tarotSpreads[selectedSpread].cardCount) {
        newSelectedCards.push(cardId);
      } else {
        // Maximum kart sayısına ulaşıldı
        toast.info(`${tarotSpreads[selectedSpread].name} için maksimum ${tarotSpreads[selectedSpread].cardCount} kart seçebilirsiniz.`);
        return;
      }
    } else {
      // Kart zaten seçilmişse, çıkar
      newSelectedCards.splice(index, 1);
    }

    setSelectedCards(newSelectedCards);
  };

  const handleGetReading = async () => {
    try {
      if (!selectedSpread) {
        toast.error("Lütfen bir fal tipi seçin");
        return;
      }
      
      setIsLoading(true);
      
      // Use credit based on spread type
      const creditUsed = await auth.useOneCredit('tarot', selectedSpread);
      if (!creditUsed) {
        toast.error("Kredi kullanılamadı. Kredi bakiyenizi kontrol edin.");
        setIsLoading(false);
        return;
      }
      
      // Get selected card names
      const selectedCardNames = selectedCards.map(id => 
        tarotCards.find(card => card.id === id)?.name || ""
      );
      
      const result = await getTarotReading(
        selectedSpread, 
        question.trim() || undefined, 
        selectedCardNames
      );
      
      setReading(result);
      // Sonuç tab'ına geçiş yap
      setActiveTab("result");
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Tarot okuması alınırken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const resetTarot = () => {
    setSelectedSpread(null);
    setSelectedCards([]);
    setShowCardSelection(false);
    setReading(null);
    setQuestion("");
    setActiveTab("select");
  };

  return (
    <div className="container py-8 px-4 sm:px-6 space-y-6">
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-300 dark:to-indigo-300">
          Tarot Falı
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tarot kartları ile geleceğinizi keşfedin ve sorularınıza cevap bulun
        </p>
      </div>

      <ProtectedFeature
        title="Tarot Falı - Üyelere Özel"
        description="Tarot falı özelliğini kullanmak için giriş yapmanız gerekmektedir. Tek kart ve üç kart falı 1 kredi, Kelt haçı falı 3 kredi kullanır. Kayıtlı kullanıcılara her ay 15 kredi verilir."
      >
        <TarotContent
          selectedSpread={selectedSpread}
          question={question}
          reading={reading}
          isLoading={isLoading}
          showCardSelection={showCardSelection}
          selectedCards={selectedCards}
          handleSpreadSelect={handleSpreadSelect}
          handleQuestionChange={handleQuestionChange}
          handleProceedToCardSelection={handleProceedToCardSelection}
          handleCardSelect={handleCardSelect}
          handleGetReading={handleGetReading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          resetTarot={resetTarot}
        />
      </ProtectedFeature>
    </div>
  );
}

function TarotContent({
  selectedSpread,
  question,
  reading,
  isLoading,
  showCardSelection,
  selectedCards,
  handleSpreadSelect,
  handleQuestionChange,
  handleProceedToCardSelection,
  handleCardSelect,
  handleGetReading,
  activeTab,
  setActiveTab,
  resetTarot
}: {
  selectedSpread: TarotSpread | null;
  question: string;
  reading: string | null;
  isLoading: boolean;
  showCardSelection: boolean;
  selectedCards: number[];
  handleSpreadSelect: (spread: TarotSpread) => void;
  handleQuestionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProceedToCardSelection: () => void;
  handleCardSelect: (cardId: number) => void;
  handleGetReading: () => Promise<void>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  resetTarot: () => void;
}) {
  // Okuma sonucunda otomatik olarak sonuç tabına geçiş yap
  useEffect(() => {
    if (reading) {
      setActiveTab("result");
    }
  }, [reading, setActiveTab]);

  return (
    <div className="mx-auto mt-8 max-w-[980px]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="select">Fal Tipi Seçin</TabsTrigger>
          <TabsTrigger value="result" disabled={!reading}>
            Tarot Okumanız
          </TabsTrigger>
        </TabsList>
        <TabsContent value="select" className="mt-4">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="py-10"
            >
              <FortuneLoadingAnimation 
                type="tarot" 
                message="Kartlar açılıyor ve size özel tarot okuması hazırlanıyor..."
              />
            </motion.div>
          ) : showCardSelection ? (
            <CardSelectionView 
              selectedSpread={selectedSpread}
              selectedCards={selectedCards}
              handleCardSelect={handleCardSelect}
              handleGetReading={handleGetReading}
            />
          ) : (
            <>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {Object.entries(tarotSpreads).map(([key, spread], index) => (
                  <motion.div
                    key={key}
                    className="h-full flex"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card 
                      className={cn(
                        "cursor-pointer hover:shadow-md transition-all border-2 overflow-hidden relative group w-full flex flex-col",
                        selectedSpread === key 
                          ? `ring-2 ring-primary border-primary` 
                          : "hover:border-primary/50"
                      )}
                      onClick={() => handleSpreadSelect(key as TarotSpread)}
                    >
                      <div className={cn(
                        "absolute top-0 left-0 h-1 w-full bg-gradient-to-r", 
                        spread.color
                      )} />
                      
                      <div className="absolute right-0 top-0 opacity-5 rotate-12 translate-x-4 -translate-y-4 transform group-hover:scale-110 transition-transform duration-700">
                        <Star className="w-24 h-24" />
                      </div>
                      
                      <div className="absolute top-2 right-2 bg-black/10 dark:bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        <span>{spread.credits} Kredi</span>
                      </div>
                      
                      <CardHeader className="pb-2 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={cn(
                            "p-2 rounded-full bg-gradient-to-br text-white flex items-center justify-center shadow-sm",
                            spread.color
                          )}>
                            {spread.icon}
                          </div>
                          <CardTitle>{spread.name}</CardTitle>
                        </div>
                        <CardDescription className="mt-1 group-hover:text-primary transition-colors flex-grow">
                          {spread.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
              
              {selectedSpread && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="mt-8 border-primary/20 shadow-md overflow-hidden">
                    <div className={cn(
                      "absolute top-0 left-0 h-1 w-full bg-gradient-to-r", 
                      selectedSpread && tarotSpreads[selectedSpread].color
                    )} />
                    
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-primary" />
                        Sorununuzu Yazın (İsteğe Bağlı)
                      </CardTitle>
                      <CardDescription>
                        Tarot kartlarına sormak istediğiniz spesifik bir soru yazabilirsiniz
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="question">Sorunuz</Label>
                          <Input
                            id="question"
                            placeholder="Örn: Kariyer değişikliği yapmalı mıyım?"
                            value={question}
                            onChange={handleQuestionChange}
                            className="border-primary/20 focus-visible:ring-primary/30"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button 
                        onClick={handleProceedToCardSelection} 
                        disabled={isLoading}
                        className="relative overflow-hidden group"
                      >
                        <span className="relative z-10">Devam Et</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></span>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </>
          )}
        </TabsContent>
        <TabsContent value="result" className="mt-4">
          {reading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-300" />
                
                <div className="absolute top-0 right-0 opacity-20 pointer-events-none select-none">
                  <Moon className="h-32 w-32 text-purple-300 dark:text-purple-600 rotate-12 translate-x-10 -translate-y-4" />
                </div>
                
                <div className="absolute bottom-0 left-0 opacity-10 pointer-events-none select-none">
                  <Star className="h-28 w-28 text-indigo-300 dark:text-indigo-600 -translate-x-4 translate-y-4" />
                </div>
                
                <CardHeader className="relative pb-6">
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
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-200 to-purple-400 dark:from-purple-700 dark:to-purple-900 flex items-center justify-center">
                      <Hand className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  
                  <CardTitle className="text-3xl text-center font-serif">
                    <span className="tracking-wide">{selectedSpread && tarotSpreads[selectedSpread].name} Tarot Okuması</span>
                  </CardTitle>
                  
                  {question && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <CardDescription className="mt-3 text-center italic text-base">
                        <span className="text-purple-700 dark:text-purple-300 font-medium">Sorduğunuz:</span> &quot;{question}&quot;
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
                        <Star className="h-4 w-4 text-purple-400 fill-purple-400" />
                      </motion.div>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <motion.div 
                    className="prose prose-purple dark:prose-invert mx-auto max-w-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="p-6 rounded-lg bg-white/60 dark:bg-black/10 backdrop-blur-sm border border-purple-100 dark:border-purple-800/50 shadow-inner">
                      <TarotParagraphs content={reading} startDelay={0.6} />
                    </div>
                  </motion.div>
                </CardContent>
                
                <motion.div 
                  className="relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <CardFooter className="flex justify-center gap-2 py-6 mt-2 bg-gradient-to-b from-transparent to-purple-100/50 dark:to-purple-900/20">
                    <Button
                      variant="outline"
                      onClick={resetTarot}
                      className="mr-2 bg-white dark:bg-black border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all duration-300 shadow-sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Yeni Fal Bak
                    </Button>
                    <Button 
                      onClick={() => handleGetReading()}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Tekrar Fal Bak
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

// Paragrafları tek tek animasyonla göstermek için yardımcı bileşen
function TarotParagraphs({ content, startDelay }: { content: string, startDelay: number }) {
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  
  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <motion.p 
          key={index} 
          className="text-lg leading-relaxed font-serif"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: startDelay + (index * 0.15) }}
        >
          {paragraph}
        </motion.p>
      ))}
    </div>
  );
}

// Add a new component for card selection
function CardSelectionView({
  selectedSpread,
  selectedCards,
  handleCardSelect,
  handleGetReading
}: {
  selectedSpread: TarotSpread | null;
  selectedCards: number[];
  handleCardSelect: (cardId: number) => void;
  handleGetReading: () => Promise<void>;
}) {
  const requiredCards = selectedSpread ? tarotSpreads[selectedSpread].cardCount : 0;
  
  // Karışık kart dizilimi oluşturmak için useState kullanıyoruz
  const [shuffledCards] = useState(() => {
    // Kartları kopyalayıp karıştırıyoruz
    return [...tarotCards].sort(() => Math.random() - 0.5);
  });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-primary/20 shadow-md overflow-hidden mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hand className="h-5 w-5 text-primary" />
            Tarot Kartlarınızı Seçin
          </CardTitle>
          <CardDescription>
            {selectedSpread && (
              <>
                <p className="mb-2">
                  {tarotSpreads[selectedSpread].name} için {requiredCards} kart seçin. 
                  <span className="font-semibold ml-2">
                    {selectedCards.length} / {requiredCards} kart seçildi
                  </span>
                </p>
                {selectedCards.length > 0 && (
                  <div className="text-xs mt-1 flex flex-wrap gap-1">
                    <span className="font-medium">Seçilen kartlar:</span>
                    {selectedCards.map((id) => (
                      <span key={id} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300">
                        {tarotCards.find(card => card.id === id)?.name}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {shuffledCards.map((card) => {
              const isSelected = selectedCards.includes(card.id);
              
              return (
                <div key={card.id} className="relative">
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute -top-3 -left-3 z-30 bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white">
                      {selectedCards.indexOf(card.id) + 1}
                    </div>
                  )}
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer relative h-48 sm:h-56 rounded-lg overflow-hidden border-2 shadow-md"
                    onClick={() => {
                      // Karta tıklandığında hafif bir titreşim efekti
                      if ('vibrate' in navigator) {
                        navigator.vibrate(30);
                      }
                      handleCardSelect(card.id);
                    }}
                    style={{ 
                      perspective: '1000px',
                      transformStyle: 'preserve-3d'
                    }}
                    layout
                  >
                    <AnimatePresence initial={false} mode="wait">
                      {isSelected ? (
                        // Ön yüz (seçilince görünür)
                        <motion.div
                          key="front"
                          initial={{ opacity: 0, rotateY: 90 }}
                          animate={{ 
                            opacity: 1, 
                            rotateY: 0,
                            transition: { 
                              type: "spring",
                              stiffness: 80,
                              damping: 12,
                              duration: 0.4 
                            }
                          }}
                          exit={{ 
                            opacity: 0,
                            rotateY: -90,
                            transition: { duration: 0.2 }
                          }}
                          className={cn(
                            "absolute inset-0 rounded-lg overflow-hidden transform-gpu",
                            "border-2 shadow-md",
                            "border-primary ring-2 ring-primary"
                          )}
                          style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                          }}
                        >
                          <div className="relative h-full w-full">
                            <Image 
                              src={card.image}
                              alt={card.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                              className="object-cover"
                              priority
                            />
                            
                            {/* Card name banner at bottom */}
                            <div className="absolute bottom-0 inset-x-0 py-1 bg-black/60 backdrop-blur-sm">
                              <h3 className="text-xs text-center font-medium text-white">
                                {card.name}
                              </h3>
                            </div>
                            
                            {/* Selection indicator (sparkle icon) */}
                            <div className="absolute top-2 right-2 z-20 bg-primary rounded-full p-1 shadow-lg">
                              <Sparkles className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        // Arka yüz (seçilmeyince görünür)
                        <motion.div
                          key="back"
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: 1,
                            rotateY: 0,
                            transition: { 
                              duration: 0.3,
                              delay: Math.random() * 0.3
                            }
                          }}
                          exit={{
                            opacity: 0,
                            rotateY: 90,
                            transition: { duration: 0.2 }
                          }}
                          className={cn(
                            "absolute inset-0 rounded-lg overflow-hidden transform-gpu",
                            "border-2 shadow-md bg-purple-100 dark:bg-purple-900/30",
                            "border-purple-200 dark:border-purple-800/50 hover:border-primary/50"
                          )}
                          style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                          }}
                        >
                          <div className="relative h-full w-full">
                            <Image 
                              src="/tarot/back.jpg"
                              alt="Tarot Card Back"
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => {
              if (selectedCards.length > 0) {
                // Clear selected cards
                selectedCards.forEach(id => handleCardSelect(id));
              }
            }}
            className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50"
            disabled={selectedCards.length === 0}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Seçimi Sıfırla
          </Button>
          
          <Button 
            onClick={handleGetReading} 
            disabled={selectedCards.length !== requiredCards}
            className={cn(
              "relative overflow-hidden group",
              selectedCards.length === requiredCards 
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0"
                : ""
            )}
          >
            <span className="relative z-10">Falımı Göster</span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 