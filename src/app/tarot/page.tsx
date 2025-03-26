"use client";

import { useState } from "react";
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
  Loader2, ArrowRight, Moon, 
  Eye, Sun, Star, 
  LibraryBig, Hand, Flame, RefreshCw 
} from "lucide-react";
import { toast } from "sonner";
import { ProtectedFeature } from "@/components/auth/ProtectedFeature";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tarotSpreads: Record<TarotSpread, { 
  name: string; 
  description: string; 
  icon: React.ReactNode;
  color: string;
}> = {
  "single-card": {
    name: "Tek Kart",
    description: "Günlük rehberlik veya basit bir soruya cevap için idealdir",
    icon: <Sun className="h-8 w-8" />,
    color: "from-amber-300 to-yellow-500 border-amber-200 dark:border-amber-800"
  },
  "three-card": {
    name: "Üç Kart",
    description: "Geçmiş, şimdi ve gelecek veya durum, eylem ve sonuç gibi üçlü bir perspektif sunar",
    icon: <LibraryBig className="h-8 w-8" />,
    color: "from-emerald-300 to-teal-500 border-emerald-200 dark:border-emerald-800"
  },
  "celtic-cross": {
    name: "Kelt Haçı",
    description: "Derinlemesine ve kapsamlı bir okuma için 10 kart kullanılan klasik düzen",
    icon: <Flame className="h-8 w-8" />,
    color: "from-purple-300 to-violet-500 border-purple-200 dark:border-purple-800"
  },
};

export default function TarotPage() {
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread | null>(null);
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const handleSpreadSelect = (spread: TarotSpread) => {
    setSelectedSpread(spread);
    setReading(null);
  };

  const handleGetReading = async () => {
    if (!selectedSpread) return;

    try {
      const creditUsed = await auth.useOneCredit();
      if (!creditUsed) {
        return;
      }
      
      setIsLoading(true);
      const result = await getTarotReading(selectedSpread, question.trim() || undefined);
      setReading(result);
    } catch (error) {
      toast.error("Tarot okuması alınırken bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
          Tarot Falı
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground">
          Tarot kartları ile geleceğinizi keşfedin ve sorularınıza cevap bulun
        </p>
      </div>

      <ProtectedFeature
        title="Tarot Falı - Üyelere Özel"
        description="Tarot falı özelliğini kullanmak için giriş yapmanız gerekmektedir. Her tarot falı 1 kredi kullanır ve kayıtlı kullanıcılara her ay 15 kredi verilir."
      >
        <TarotContent 
          selectedSpread={selectedSpread}
          question={question}
          reading={reading}
          isLoading={isLoading}
          handleSpreadSelect={handleSpreadSelect}
          handleQuestionChange={handleQuestionChange}
          handleGetReading={handleGetReading}
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
  handleSpreadSelect,
  handleQuestionChange,
  handleGetReading
}: {
  selectedSpread: TarotSpread | null;
  question: string;
  reading: string | null;
  isLoading: boolean;
  handleSpreadSelect: (spread: TarotSpread) => void;
  handleQuestionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGetReading: () => Promise<void>;
}) {
  return (
    <div className="mx-auto mt-8 max-w-[980px]">
      <Tabs defaultValue="select" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="select">Fal Tipi Seçin</TabsTrigger>
          <TabsTrigger value="reading" disabled={!reading}>
            Tarot Okuması
          </TabsTrigger>
        </TabsList>
        <TabsContent value="select" className="mt-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {Object.entries(tarotSpreads).map(([key, spread], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className={cn(
                    "cursor-pointer hover:shadow-md transition-all border-2 overflow-hidden relative group",
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
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "p-2 rounded-full bg-gradient-to-br text-white flex items-center justify-center shadow-sm",
                        spread.color
                      )}>
                        {spread.icon}
                      </div>
                      <CardTitle>{spread.name}</CardTitle>
                    </div>
                    <CardDescription className="mt-1 group-hover:text-primary transition-colors">
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
                    onClick={handleGetReading} 
                    disabled={isLoading}
                    className="relative overflow-hidden group"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Okumanız hazırlanıyor...
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Tarot Falımı Göster</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </TabsContent>
        <TabsContent value="reading" className="mt-4">
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
                      onClick={() => {
                        handleSpreadSelect(null as unknown as TarotSpread);
                      }}
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