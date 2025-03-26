"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Moon, Sparkles, Brain, ArrowRight, CloudMoon, Stars } from "lucide-react";
import { toast } from "sonner";
import { getDreamInterpretation } from "@/lib/fortune-api";
import { ProtectedFeature } from "@/components/auth/ProtectedFeature";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function DreamPage() {
  const [dreamDescription, setDreamDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  
  // Get auth context at component level
  const auth = useAuth();

  const handleDreamChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDreamDescription(e.target.value);
  };

  const handleGetInterpretation = async () => {
    if (!dreamDescription.trim()) {
      toast.error("Lütfen rüyanızı anlatın.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call useOneCredit directly from auth
      const creditUsed = await auth.useOneCredit();
      if (!creditUsed) {
        setIsLoading(false);
        return;
      }
      
      const result = await getDreamInterpretation(dreamDescription);
      setInterpretation(result);
    } catch (error) {
      toast.error("Rüya yorumu alınırken bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDreamDescription("");
    setInterpretation(null);
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
          Rüya Yorumu
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground">
          Rüyanızı anlatın, anlamını keşfedin
        </p>
      </div>

      <ProtectedFeature
        title="Rüya Yorumu - Üyelere Özel"
        description="Rüya yorumu özelliğini kullanmak için giriş yapmanız gerekmektedir. Her rüya yorumu 1 kredi kullanır ve kayıtlı kullanıcılara her ay 15 kredi verilir."
      >
        <DreamContent
          dreamDescription={dreamDescription}
          interpretation={interpretation}
          isLoading={isLoading}
          handleDreamChange={handleDreamChange}
          handleGetInterpretation={handleGetInterpretation}
          resetForm={resetForm}
        />
      </ProtectedFeature>
    </div>
  );
}

// Move component outside to prevent re-renders of the parent component
function DreamContent({
  dreamDescription,
  interpretation,
  isLoading,
  handleDreamChange,
  handleGetInterpretation,
  resetForm
}: {
  dreamDescription: string;
  interpretation: string | null;
  isLoading: boolean;
  handleDreamChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleGetInterpretation: () => Promise<void>;
  resetForm: () => void;
}) {
  return (
    <div className="mx-auto mt-8 max-w-[980px]">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Rüyanızı Anlatın</TabsTrigger>
          <TabsTrigger value="interpretation" disabled={!interpretation}>
            Rüya Yorumunuz
          </TabsTrigger>
        </TabsList>
        <TabsContent value="input" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Rüyanızı Detaylı Anlatın</CardTitle>
              <CardDescription>
                Gördüğünüz rüyayı mümkün olduğunca detaylı bir şekilde yazın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dream">Rüyanız</Label>
                  <Textarea
                    id="dream"
                    placeholder="Rüyanızda gördüğünüz olayları, karakterleri, mekanları ve hissettiğiniz duyguları detaylı olarak anlatın..."
                    value={dreamDescription}
                    onChange={handleDreamChange}
                    className="min-h-32"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleGetInterpretation} disabled={isLoading || !dreamDescription.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Yorumunuz hazırlanıyor...
                  </>
                ) : (
                  "Rüyamı Yorumla"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="interpretation" className="mt-4">
          {interpretation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-lg overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300" />
                
                <div className="absolute top-0 right-0 opacity-20 pointer-events-none select-none">
                  <CloudMoon className="h-32 w-32 text-indigo-300 dark:text-indigo-600 rotate-12 translate-x-10 -translate-y-4" />
                </div>
                
                <div className="absolute bottom-0 left-0 opacity-10 pointer-events-none select-none">
                  <Stars className="h-28 w-28 text-purple-300 dark:text-purple-600 -translate-x-4 translate-y-4" />
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
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-200 to-purple-400 dark:from-indigo-700 dark:to-purple-900 flex items-center justify-center">
                      <Moon className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  
                  <CardTitle className="text-3xl text-center font-serif">
                    <span className="tracking-wide">Rüya Yorumunuz</span>
                  </CardTitle>
                  
                  <div className="flex items-center justify-center mt-3 space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                      >
                        <Sparkles className="h-4 w-4 text-indigo-400" />
                      </motion.div>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <motion.div 
                    className="prose prose-indigo dark:prose-invert mx-auto max-w-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="p-6 mb-6 rounded-lg bg-gradient-to-br from-indigo-100/60 to-purple-100/60 dark:from-indigo-900/20 dark:to-purple-900/20 backdrop-blur-sm border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-300 flex items-center justify-center">
                          <Moon className="h-3.5 w-3.5 text-white" />
                        </div>
                        <h3 className="text-base font-medium text-indigo-800 dark:text-indigo-300">Anlattığınız Rüya:</h3>
                      </div>
                      <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 italic ml-8">
                        {dreamDescription}
                      </p>
                    </div>
                    
                    <div className="p-6 rounded-lg bg-white/70 dark:bg-black/10 backdrop-blur-sm border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                      <div className="mb-6">
                        <motion.div 
                          className="flex items-center space-x-2 mb-3"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-400 to-violet-300 flex items-center justify-center">
                            <Brain className="h-3.5 w-3.5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300">Genel Yorum</h3>
                        </motion.div>
                        
                        <DreamParagraphs content={interpretation} startDelay={0.7} />
                      </div>
                      
                      <motion.div 
                        className="pt-4 mt-6 border-t border-indigo-100 dark:border-indigo-800/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-300 flex items-center justify-center">
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300">Ne Anlama Geliyor?</h3>
                        </div>
                        
                        <div className="ml-8 mt-3 p-4 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-md border border-indigo-100 dark:border-indigo-800/30">
                          <p className="text-base italic text-indigo-700 dark:text-indigo-300">
                            {extractSymbolicMeaning(interpretation)}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </CardContent>
                
                <motion.div 
                  className="relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  <CardFooter className="flex justify-center py-6 mt-2 bg-gradient-to-b from-transparent to-indigo-100/50 dark:to-indigo-900/20">
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="bg-white dark:bg-black border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all duration-300 shadow-sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Yeni Rüya Yorumla
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

// Yardımcı bileşenler
function DreamParagraphs({ content, startDelay }: { content: string, startDelay: number }) {
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  
  return (
    <div className="ml-8 space-y-4">
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

// Yardımcı fonksiyonlar
function extractSymbolicMeaning(interpretation: string): string {
  // Sembolik anlamlar için metinden içgörüler çıkarmaya çalışalım
  const lines = interpretation.split('\n');
  const possiblePhrases = [
    "sembolik olarak", "bu sembol", "rüyada görmek", 
    "temsil ed", "işaret ed", "anlamına gel", 
    "Psikanalitik", "bilinçaltı", "Jung", "Freud"
  ];
  
  let bestMatch = '';
  
  // En uygun paragrafı bulmaya çalış
  for (const line of lines) {
    for (const phrase of possiblePhrases) {
      if (line.toLowerCase().includes(phrase.toLowerCase())) {
        if (line.length > bestMatch.length) {
          bestMatch = line;
        }
        break;
      }
    }
  }
  
  // En iyi eşleşme bulunduysa onu kullan, yoksa yorumun ilk cümlesini al
  if (bestMatch) {
    return bestMatch;
  } else {
    // İlk paragraftan ilk bir ya da iki cümleyi al
    const firstParagraph = interpretation.split('\n\n')[0] || interpretation;
    const sentences = firstParagraph.split(/(?<=[.!?])\s+/);
    
    if (sentences.length > 1) {
      return sentences.slice(0, 2).join(' ');
    } else {
      return firstParagraph;
    }
  }
} 