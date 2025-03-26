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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProtectedFeature } from "@/components/auth/ProtectedFeature";
import { useAuth } from "@/context/AuthContext";

const tarotSpreads: Record<TarotSpread, { name: string; description: string }> = {
  "single-card": {
    name: "Tek Kart",
    description: "Günlük rehberlik veya basit bir soruya cevap için idealdir",
  },
  "three-card": {
    name: "Üç Kart",
    description: "Geçmiş, şimdi ve gelecek veya durum, eylem ve sonuç gibi üçlü bir perspektif sunar",
  },
  "celtic-cross": {
    name: "Kelt Haçı",
    description: "Derinlemesine ve kapsamlı bir okuma için 10 kart kullanılan klasik düzen",
  },
};

export default function TarotPage() {
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread | null>(null);
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { useOneCredit } = useAuth();

  // Store the useOneCredit function reference
  const useOneCreditFn = useOneCredit;

  const handleSpreadSelect = (spread: TarotSpread) => {
    setSelectedSpread(spread);
    setReading(null);
  };

  const handleGetReading = async () => {
    if (!selectedSpread) return;

    try {
      // Use a credit before performing the reading
      const creditUsed = await useOneCreditFn();
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(tarotSpreads).map(([key, spread]) => (
              <Card 
                key={key} 
                className={`cursor-pointer transition-all ${
                  selectedSpread === key ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleSpreadSelect(key as TarotSpread)}
              >
                <CardHeader>
                  <CardTitle>{spread.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {spread.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          
          {selectedSpread && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Sorununuzu Yazın (İsteğe Bağlı)</CardTitle>
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
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleGetReading} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Okumanız hazırlanıyor...
                    </>
                  ) : (
                    "Tarot Falımı Göster"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="reading" className="mt-4">
          {reading && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {selectedSpread && tarotSpreads[selectedSpread].name} Tarot Okuması
                </CardTitle>
                {question && (
                  <CardDescription className="mt-2 text-center">
                    Soru: {question}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert mx-auto max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-line">
                    {reading}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleSpreadSelect(null as unknown as TarotSpread);
                  }}
                  className="mr-2"
                >
                  Yeni Fal Bak
                </Button>
                <Button onClick={() => handleGetReading()}>
                  Tekrar Fal Bak
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 