"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  triggerText?: string;
  defaultTab?: "sign-in" | "sign-up";
  triggerVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showWhenLoggedIn?: boolean;
}

export function AuthModal({
  triggerText = "Giriş Yap",
  defaultTab = "sign-in",
  triggerVariant = "default",
  buttonSize = "default",
  className = "",
  showWhenLoggedIn = false,
}: AuthModalProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  // If user is logged in and modal should not be shown when logged in, don't render
  if (user && !showWhenLoggedIn) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size={buttonSize} className={className}>
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Falomi&apos;ye Hoş Geldiniz
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Giriş Yap</TabsTrigger>
            <TabsTrigger value="sign-up">Kayıt Ol</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in" className="py-4">
            <div className="space-y-4">
              <SignInForm />
              <p className="text-center text-sm text-muted-foreground">
                Henüz hesabınız yok mu?{" "}
                <button
                  type="button"
                  className="underline text-primary"
                  onClick={() => document.querySelector('button[value="sign-up"]')?.dispatchEvent(new Event('click'))}
                >
                  Kayıt olun
                </button>
              </p>
            </div>
          </TabsContent>
          <TabsContent value="sign-up" className="py-4">
            <div className="space-y-4">
              <SignUpForm />
              <p className="text-center text-sm text-muted-foreground">
                Zaten bir hesabınız var mı?{" "}
                <button
                  type="button"
                  className="underline text-primary"
                  onClick={() => document.querySelector('button[value="sign-in"]')?.dispatchEvent(new Event('click'))}
                >
                  Giriş yapın
                </button>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 