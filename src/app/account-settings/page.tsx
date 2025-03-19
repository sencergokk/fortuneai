"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Check, User, Shield, KeyRound, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AccountSettings() {
  const { user, isLoading, updatePassword, signOut } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Yeni şifreler eşleşmiyor");
      return;
    }

    setIsResetting(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setResetSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Şifreniz başarıyla güncellendi");
    } catch (error) {
      toast.error("Şifre güncellenirken bir hata oluştu");
    } finally {
      setIsResetting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Başarıyla çıkış yapıldı");
    } catch (error) {
      toast.error("Çıkış yapılırken bir hata oluştu");
    }
  };

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Hesap ayarlarına erişmek için giriş yapmalısınız.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Format the creation date
  const createdAt = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('tr-TR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    : 'Bilinmiyor';

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Hesap Ayarları</h1>
        <p className="text-muted-foreground mb-6">Hesabınızı yönetin ve güvenlik ayarlarınızı güncelleyin</p>
      
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Güvenlik
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kullanıcı Bilgileri</CardTitle>
                  <CardDescription>
                    Hesabınızla ilgili temel bilgiler
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>E-posta</Label>
                    <div className="flex items-center border rounded-md px-3 py-2 bg-muted/50">
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Hesap Oluşturma Tarihi</Label>
                    <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-muted/50">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      <span>{createdAt}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-primary" />
                    <CardTitle>Şifre Değiştir</CardTitle>
                  </div>
                  <CardDescription>Hesap güvenliğiniz için şifrenizi değiştirin</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div>
                      <Label>Mevcut Şifre</Label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Yeni Şifre</Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Yeni Şifre (Tekrar)</Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isResetting}>
                      {isResetting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Güncelleniyor...
                        </>
                      ) : (
                        "Şifreyi Güncelle"
                      )}
                    </Button>
                  </form>

                  {resetSuccess && (
                    <Alert className="mt-4 border-green-200 text-green-800 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
                      <Check className="h-4 w-4" />
                      <AlertDescription>
                        Şifreniz başarıyla güncellendi.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Çıkış Yap</CardTitle>
                  <CardDescription>Bu cihazdan hesabınızdan çıkış yapın</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Fal okumalarınıza ve hesabınıza erişmek için tekrar giriş yapmanız gerekecektir.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={handleSignOut}>
                    Çıkış Yap
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">Hesabı Sil</CardTitle>
                  <CardDescription>Hesabınızı ve tüm verilerinizi kalıcı olarak silin</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Bu işlem geri alınamaz. Tüm verileriniz ve fal geçmişiniz kalıcı olarak silinecektir.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <Button 
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Hesabımı Kalıcı Olarak Sil
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
} 