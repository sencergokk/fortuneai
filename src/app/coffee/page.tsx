"use client";

import { useState } from "react";
import { zodiacSigns, type ZodiacSign } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { getCoffeeReading } from "@/lib/fortune-api";
import { ProtectedFeature } from "@/components/auth/ProtectedFeature";
import { useAuth } from "@/context/AuthContext";

export default function CoffeePage() {
  const [description, setDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [reading, setReading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { useOneCredit } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
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
    if (!description.trim()) {
      toast.error("Lütfen fincan içindeki şekilleri tanımlayın.");
      return;
    }

    try {
      // Use a credit before performing the reading
      const creditUsed = await useOneCredit();
      if (!creditUsed) {
        return;
      }
      
      setIsLoading(true);
      const result = await getCoffeeReading(
        description,
        question.trim() || undefined,
        selectedSign || undefined
      );
      setReading(result);
    } catch (error) {
      toast.error("Kahve falı alınırken bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setQuestion("");
    setSelectedSign(null);
    setReading(null);
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
          Kahve Falı
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground">
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
        />
      </ProtectedFeature>
    </div>
  );
}

function CoffeeContent({
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
  resetForm
}: {
  description: string;
  question: string;
  selectedSign: ZodiacSign | null;
  reading: string | null;
  isLoading: boolean;
  imagePreview: string | null;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleQuestionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGetReading: () => Promise<void>;
  setSelectedSign: (sign: ZodiacSign | null) => void;
  resetForm: () => void;
}) {
  return (
    <div className="mx-auto mt-8 max-w-[980px]">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Fincanınızı Tanımlayın</TabsTrigger>
          <TabsTrigger value="reading" disabled={!reading}>
            Kahve Falınız
          </TabsTrigger>
        </TabsList>
        <TabsContent value="input" className="mt-4">
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
                          <img 
                            src={imagePreview} 
                            alt="Coffee cup" 
                            className="h-full w-auto object-contain"
                          />
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
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Falınız hazırlanıyor...
                  </>
                ) : (
                  "Falımı Göster"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="reading" className="mt-4">
          {reading && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Kahve Falınız
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
                  onClick={resetForm}
                  className="mr-2"
                >
                  Yeni Fal Bak
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 