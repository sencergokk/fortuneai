"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

interface AuthContextProps {
  user: User | null;
  credits: number;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshCredits: () => Promise<void>;
  useOneCredit: (readingType?: string, amountOrSpread?: number | string) => Promise<boolean>;
  redeemCoupon: (couponCode: string) => Promise<boolean>;
  lastCreditRefresh?: string;
  forceCreateCredits: (amount?: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastCreditRefresh, setLastCreditRefresh] = useState<string>();
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Create user credits function
  const createUserCredits = useCallback(async (userId: string, initialAmount: number = 5) => {
    try {
      const now = new Date().toISOString();
      
      // First check if credits already exist
      const { data: existingCredits } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (existingCredits) {
        // Credits already exist, just update state
        setCredits(existingCredits.credits);
        return;
      }
      
      // Insert new credits
      const { error } = await supabase
        .from("user_credits")
        .insert({ 
          user_id: userId, 
          credits: initialAmount,
          last_refresh: now
        });

      if (error) {
        console.error("Error creating user credits:", error);
        return;
      }

      setCredits(initialAmount);
      setLastCreditRefresh(now);
    } catch (error) {
      console.error("Error in createUserCredits:", error);
    }
  }, [supabase]);

  // Wrap refreshUserCredits in useCallback
  const refreshUserCredits = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user credits:", error);
        return;
      }

      if (data) {
        setCredits(data.credits);
        if (data.last_refresh) {
          setLastCreditRefresh(data.last_refresh);
        }
      } else {
        // Initialize user credits if not found
        await createUserCredits(userId);
      }
    } catch (error) {
      console.error("Error in refreshUserCredits:", error);
      // Create credits on error as a fallback
      await createUserCredits(userId);
    }
  }, [supabase, createUserCredits]);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      setUser(session?.user || null);
      if (session?.user) {
        await refreshUserCredits(session.user.id);
      }
      setIsLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user || null);
        if (session?.user) {
          refreshUserCredits(session.user.id);
        } else {
          setCredits(0);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, refreshUserCredits]);

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Giriş başarılı!");
      router.refresh();
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Giriş yapılırken bir hata oluştu.");
    }
  }

  async function signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Ensure user is created before proceeding
      if (data && data.user) {
        // Email doğrulama gerekiyor mu kontrol et
        if (data.session === null) {
          // Kredi oluştur
          await createUserCredits(data.user.id);
          toast.success("Kaydınız başarıyla oluşturuldu! E-postanıza gönderilen bağlantı ile hesabınızı doğrulayın.", 
            { duration: 6000 }); // Mesajı biraz daha uzun gösterelim
          // Email doğrulaması gerekiyorsa, otomatik giriş yapmayalım
          return;
        }

        // E-posta doğrulama gerekmiyorsa veya zaten doğrulanmışsa
        await createUserCredits(data.user.id);
        toast.success("Kaydınız başarıyla oluşturuldu! 5 kredi hesabınıza eklendi.");
        
        // Auto sign in after sign up (only if no email confirmation needed)
        await signIn(email, password);
      } else {
        toast.success("Kaydınız başarıyla oluşturuldu!");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Kayıt oluşturulurken bir hata oluştu.");
    }
  }

  // Force create user credits (for fixing issues or admin use)
  async function forceCreateCredits(amount: number = 5) {
    if (!user) {
      toast.error("Bu işlem için giriş yapmalısınız.");
      return;
    }
    
    try {
      await createUserCredits(user.id, amount);
      toast.success(`${amount} kredi hesabınıza eklendi.`);
    } catch (error) {
      console.error("Error forcing credit creation:", error);
      toast.error("Kredi ekleme işlemi başarısız oldu.");
    }
  }

  async function signOut() {
    try {
      await supabase.auth.signOut();
      toast.success("Çıkış yapıldı.");
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Çıkış yapılırken bir hata oluştu.");
    }
  }

  async function resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }

  async function updatePassword(currentPassword: string, newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }

  async function refreshCredits() {
    if (user) {
      await refreshUserCredits(user.id);
    }
  }

  async function useOneCredit(readingType?: string, amountOrSpread?: number | string): Promise<boolean> {
    if (!user) return false;
    
    try {
      // Refresh credits first to ensure we have the latest count
      await refreshUserCredits(user.id);
      
      // Kaç kredi düşüleceğini belirle
      let creditAmountToUse = 1; // Varsayılan değer
      
      // Eğer amountOrSpread bir number ise, doğrudan kullan
      if (typeof amountOrSpread === 'number') {
        creditAmountToUse = amountOrSpread;
      }
      // Eğer amountOrSpread bir string ve tarot spreadType ise özel durumları kontrol et
      else if (typeof amountOrSpread === 'string' && readingType === 'tarot') {
        if (amountOrSpread === 'celtic-cross') {
          creditAmountToUse = 3;
        }
      }
      
      if (credits < creditAmountToUse) {
        toast.error(`Bu işlem için ${creditAmountToUse} kredi gerekmektedir. Yeterli krediniz bulunmamaktadır!`);
        return false;
      }
      
      // Update credits in database first
      const { error } = await supabase
        .from("user_credits")
        .update({ credits: credits - creditAmountToUse })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error using credit:", error);
        toast.error("Kredi kullanılırken bir hata oluştu.");
        return false;
      }

      // Log credit usage
      try {
        await supabase.from("credit_usage").insert({
          user_id: user.id,
          usage_type: readingType || "fortune_reading",
          usage_amount: creditAmountToUse,
          usage_date: new Date().toISOString(),
        });
      } catch (error: unknown) {
        // Log but don't fail if usage logging fails
        console.error("Error logging credit usage:", error);
      }

      // Update local state after successful database update
      setCredits(credits - creditAmountToUse);
      return true;
    } catch (error) {
      console.error("Error in useOneCredit:", error);
      return false;
    }
  }

  async function redeemCoupon(couponCode: string): Promise<boolean> {
    if (!user) return false;
    
    try {
      // First, check if coupon exists and is valid
      const { data: couponData, error: couponError } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode)
        .eq("is_active", true)
        .single();

      if (couponError || !couponData) {
        toast.error("Geçersiz veya kullanılmış kupon kodu.");
        return false;
      }

      // Check if user already used this coupon
      const { data: usageData, error: usageError } = await supabase
        .from("coupon_usage")
        .select("*")
        .eq("user_id", user.id)
        .eq("coupon_id", couponData.id)
        .maybeSingle();

      if (usageError) {
        console.error("Error checking coupon usage:", usageError);
        toast.error("Kupon sorgulanırken bir hata oluştu.");
        return false;
      }

      if (usageData) {
        toast.error("Bu kuponu daha önce kullandınız.");
        return false;
      }

      // Get current credits - first make sure the user has a credit record
      await refreshUserCredits(user.id);
      
      // Get latest credits after refresh
      const { data: userData, error: userError } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_id", user.id)
        .single();

      if (userError) {
        console.error("Error fetching user credits:", userError);
        toast.error("Kredileriniz alınırken bir hata oluştu.");
        return false;
      }

      // Update user credits
      const newCredits = userData.credits + couponData.credit_amount;
      const { error: updateError } = await supabase
        .from("user_credits")
        .update({ credits: newCredits })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating credits:", updateError);
        toast.error("Kredi eklenirken bir hata oluştu.");
        return false;
      }

      // Log coupon usage
      const { error: logError } = await supabase
        .from("coupon_usage")
        .insert({
          user_id: user.id,
          coupon_id: couponData.id,
          usage_date: new Date().toISOString(),
        });

      if (logError) {
        console.error("Error logging coupon usage:", logError);
        // Don't return false here since credits were already added
      }

      // If coupon is single-use, deactivate it
      if (couponData.is_single_use) {
        await supabase
          .from("coupons")
          .update({ is_active: false })
          .eq("id", couponData.id);
      }

      // Update local state
      setCredits(newCredits);
      toast.success(`${couponData.credit_amount} kredi hesabınıza eklendi!`);
      return true;
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      toast.error("Kupon kullanılırken bir hata oluştu.");
      return false;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        credits,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        refreshCredits,
        useOneCredit,
        redeemCoupon,
        lastCreditRefresh,
        forceCreateCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 