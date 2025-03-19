"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getDreamInterpretation } from "@/lib/fortune-api";
import { ProtectedFeature } from "@/components/auth/ProtectedFeature";
import { useAuth } from "@/context/AuthContext";

export default function DreamPage() {
  const [dreamDescription, setDreamDescription] = useState("");
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { useOneCredit } = useAuth();

  const handleDreamChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDreamDescription(e.target.value);
  };

  const handleGetInterpretation = async () => {
    if (!dreamDescription.trim()) {
      toast.error("Lütfen rüyanızı anlatın.");
      return;
    }

    try {
      // Use a credit before performing the reading
      const creditUsed = await useOneCredit();
      if (!creditUsed) {
        return;
      }
      
      setIsLoading(true);
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
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Rüya Yorumunuz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert mx-auto max-w-none">
                  <div className="mb-6 p-4 bg-muted rounded-md">
                    <h3 className="text-sm font-medium mb-2">Anlattığınız Rüya:</h3>
                    <p className="text-sm text-muted-foreground">{dreamDescription}</p>
                  </div>
                  <div className="text-lg leading-relaxed whitespace-pre-line">
                    {interpretation}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={resetForm}
                >
                  Yeni Rüya Yorumla
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 