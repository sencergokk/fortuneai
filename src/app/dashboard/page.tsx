"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, User, CalendarClock, Clock, History, SparklesIcon } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, isLoading, credits, lastCreditRefresh } = useAuth();
  const router = useRouter();
  const [nextRefreshDate, setNextRefreshDate] = useState<string>("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }

    if (lastCreditRefresh) {
      // Calculate next refresh date (1 month from last refresh)
      const nextDate = new Date(lastCreditRefresh);
      nextDate.setMonth(nextDate.getMonth() + 1);
      setNextRefreshDate(formatDistanceToNow(nextDate, { addSuffix: true, locale: tr }));
    }
  }, [user, isLoading, router, lastCreditRefresh]);

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  // Format dates
  const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : "Giriş bilgisi yok";

  const createdDate = new Date(user.created_at).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="container py-10">
      <motion.h1 
        className="text-3xl font-bold mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Hoş Geldiniz
      </motion.h1>
      <motion.p 
        className="text-muted-foreground mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Panelinizde hesap bilgilerinize ve fal geçmişinize erişebilirsiniz
      </motion.p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Hesap Bilgileri
              </CardTitle>
              <CardDescription>Hesap detaylarınız ve bilgileriniz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Son Giriş</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p>{lastSignIn}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Kayıt Tarihi</p>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <p>{createdDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push('/account-settings')}>
                Hesabı Yönet
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Kredi Bilgileri
              </CardTitle>
              <CardDescription>Mevcut krediniz ve yenileme bilgileri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mevcut Krediniz</p>
                  <p className="text-3xl font-bold">{credits}</p>
                </div>
                
                {lastCreditRefresh && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bir Sonraki Kredi Yenilemesi</p>
                    <p className="text-sm">{nextRefreshDate}</p>
                    <p className="text-xs text-muted-foreground mt-1">Her ay otomatik olarak 15 kredi yüklenir</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push('/credits')}>
                Kredi Satın Al
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Fal Aktiviteleriniz
              </CardTitle>
              <CardDescription>
                Son fal aktiviteleriniz ve yorumlarınız
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Henüz hiç fal aktiviteniz bulunmamaktadır.</p>
                <p className="text-sm mt-2">Fallarınız burada listelenecektir.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => router.push('/')}>
                Fal Baktır
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 