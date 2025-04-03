"use client";

import { useState } from "react";
import { type ZodiacSign } from "@/types";
import { toast } from "sonner";
import { getCoffeeReadingFromImages } from "@/lib/fortune-api";
import { ProtectedFeature } from "@/components/auth/ProtectedFeature";
import { useAuth } from "@/context/AuthContext";
import CoffeeContent from "@/components/coffee/CoffeeContent";

export default function CoffeePage() {
  const [question, setQuestion] = useState("");
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [cupImages, setCupImages] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [reading, setReading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const auth = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleGetReading = async () => {
    try {
      setIsLoading(true);
      
      // En az 1 resim kontrolü
      if (!cupImages || cupImages.length === 0) {
        toast.error("Lütfen en az bir fincan fotoğrafı yükleyin.");
        setIsLoading(false);
        return;
      }
      
      const creditUsed = await auth.useOneCredit('coffee', 3);
      if (!creditUsed) {
        toast.error("Kredi kullanılamadı. Kredi bakiyenizi kontrol edin.");
        setIsLoading(false);
        return;
      }
      
      // Görsel analiz API'sini kullan
      const result = await getCoffeeReadingFromImages(
        cupImages,
        selectedSign ?? undefined
      );
      
      setReading(result);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Falınız alınırken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setQuestion("");
    setSelectedSign(null);
    setReading(null);
    setImagePreview(null);
    setCupImages([]);
    setActiveTab("input");
  };

  return (
    <div className="container py-8 px-4 sm:px-6 space-y-6">
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-200 dark:to-orange-400">
          Kahve Falı
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Türk kahvesi fincanınızın fotoğraflarını yükleyin, sizin için yorumlayalım
        </p>
      </div>

      <ProtectedFeature
        title="Kahve Falı - Üyelere Özel"
        description="Kahve falı özelliğini kullanmak için giriş yapmanız gerekmektedir. Her kahve falı 3 kredi kullanır ve kayıtlı kullanıcılara her ay 15 kredi verilir."
      >
        <CoffeeContent 
          question={question}
          selectedSign={selectedSign}
          reading={reading}
          isLoading={isLoading}
          imagePreview={imagePreview}
          handleQuestionChange={handleQuestionChange}
          handleImageChange={handleImageChange}
          handleGetReading={handleGetReading}
          setSelectedSign={setSelectedSign}
          resetForm={resetForm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cupImages={cupImages}
          setCupImages={setCupImages}
        />
      </ProtectedFeature>
    </div>
  );
} 