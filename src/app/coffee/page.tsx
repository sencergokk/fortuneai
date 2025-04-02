"use client";

import { useState} from "react";
import { type ZodiacSign } from "@/types";
import { toast } from "sonner";
import { getCoffeeReading } from "@/lib/fortune-api";
import { ProtectedFeature } from "@/components/auth/ProtectedFeature";
import { useAuth } from "@/context/AuthContext";
import CoffeeContent from "@/components/coffee/CoffeeContent"; // Import edilen bileşen

export default function CoffeePage() {
  const [description, setDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleGetReading = async () => {
    try {
      setIsLoading(true);
      
      const creditUsed = await auth.useOneCredit('coffee');
      if (!creditUsed) {
        toast.error("Kredi kullanılamadı. Kredi bakiyenizi kontrol edin.");
        setIsLoading(false);
        return;
      }
      
      const result = await getCoffeeReading(
        description,
        question,
        selectedSign ?? undefined
      );
      
      setReading(result);
      // Reading tab'ına geçiş yap (Artık CoffeeContent içinde yönetiliyor)
      // setActiveTab("reading"); // Bu satır kaldırıldı
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Falınız alınırken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setQuestion("");
    setSelectedSign(null);
    setReading(null);
    setImagePreview(null);
    setActiveTab("input"); // Tab'ı input'a döndür
  };

  // Fal sonucu geldiğinde otomatik olarak reading tab'ına geçiş yap
  // Bu useEffect CoffeeContent içine taşındığı için buradan kaldırıldı.

  return (
    <div className="container py-8 px-4 sm:px-6 space-y-6">
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-200 dark:to-orange-400">
          Kahve Falı
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Türk kahvesi fincanınızdaki şekilleri anlatın, sizin için yorumlayalım
        </p>
      </div>

      <ProtectedFeature
        title="Kahve Falı - Üyelere Özel"
        description="Kahve falı özelliğini kullanmak için giriş yapmanız gerekmektedir. Her kahve falı 1 kredi kullanır ve kayıtlı kullanıcılara her ay 15 kredi verilir."
      >
        <CoffeeContent 
          description={description}
          question={question}
          selectedSign={selectedSign}
          reading={reading}
          isLoading={isLoading}
          imagePreview={imagePreview}
          handleDescriptionChange={handleDescriptionChange}
          handleQuestionChange={handleQuestionChange}
          handleImageChange={handleImageChange}
          handleGetReading={handleGetReading}
          setSelectedSign={setSelectedSign}
          resetForm={resetForm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </ProtectedFeature>
    </div>
  );
}

// CoffeeContent ve yardımcı fonksiyonlar buradan kaldırıldı. 