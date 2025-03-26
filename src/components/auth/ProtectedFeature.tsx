"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthModal } from "@/components/auth/AuthModal";
import { Sparkles } from "lucide-react";

interface ProtectedFeatureProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showAuthModal?: boolean;
}

export function ProtectedFeature({
  children,
  title = "Üyelere Özel İçerik",
  description = "Bu özelliği kullanmak için giriş yapmanız gerekmektedir.",
  showAuthModal = true,
}: ProtectedFeatureProps) {
  const { user, credits, isLoading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // URL'den login=required parametresini client tarafında al
  useEffect(() => {
    // Client tarafında çalışacak URL sorgusu
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const loginRequired = params.get("login") === "required";
      
      if (loginRequired && !user && !isLoading) {
        setIsLoginModalOpen(true);
        
        // URL'den login parametresini temizle (tarihi değiştirmeden)
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('login');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [user, isLoading]);

  // Loading state
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  // User is logged in but has no credits
  if (user && credits <= 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Kredi Yetersiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Bu özelliği kullanmak için yeterli krediniz bulunmamaktadır. 
            Her ay hesabınıza otomatik olarak 15 kredi yüklenmektedir.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Bir sonraki kredi yüklemesini bekleyebilir veya hesabınızı yükseltebilirsiniz.
          </p>
        </CardFooter>
      </Card>
    );
  }

  // User is not logged in
  if (!user) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
        {showAuthModal && (
          <CardFooter className="flex justify-center">
            <AuthModal 
              triggerText="Giriş Yap / Kayıt Ol" 
              className="mt-2"
              openModal={isLoginModalOpen}
              setOpenModal={setIsLoginModalOpen}
            />
          </CardFooter>
        )}
      </Card>
    );
  }

  // User is logged in and has credits
  return <>{children}</>;
} 