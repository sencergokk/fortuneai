"use client";

import { useState } from "react";
import { TarotSpread } from "@/types";
import { toast } from "sonner";
import { getTarotReading } from "@/lib/fortune-api";
import { ProtectedFeature } from "@/components/auth/ProtectedFeature";
import { useAuth } from "@/context/AuthContext";
import { TarotContent } from "@/components/tarot/TarotComponents";
import { tarotCards, tarotSpreads } from "@/components/tarot/tarotData.tsx";

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
      if (selectedCards.length < tarotSpreads[selectedSpread].cardCount) {
        newSelectedCards.push(cardId);
      } else {
        toast.info(`${tarotSpreads[selectedSpread].name} için maksimum ${tarotSpreads[selectedSpread].cardCount} kart seçebilirsiniz.`);
        return;
      }
    } else {
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
      
      if (selectedCards.length !== tarotSpreads[selectedSpread].cardCount) {
        toast.error(`Lütfen ${tarotSpreads[selectedSpread].cardCount} kart seçin.`);
        return;
      }

      setIsLoading(true);
      
      const creditUsed = await auth.useOneCredit('tarot', selectedSpread);
      if (!creditUsed) {
        toast.error("Kredi kullanılamadı. Kredi bakiyenizi kontrol edin.");
        setIsLoading(false);
        return;
      }
      
      const selectedCardNames = selectedCards.map(id => 
        tarotCards.find(card => card.id === id)?.name || ""
      );
      
      const result = await getTarotReading(
        selectedSpread, 
        question.trim() || undefined, 
        selectedCardNames
      );
      
      setReading(result);
      
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
        description="Tarot falı özelliğini kullanmak için giriş yapmanız gerekmektedir. Tek kart ve üç kart falı 1 kredi, Kelt haçı falı 3 kredi kullanır. Kayıtlı kullanıcılara her ay 5 kredi verilir."
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