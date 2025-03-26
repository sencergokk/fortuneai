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
  useOneCredit: () => Promise<boolean>;
  redeemCoupon: (couponCode: string) => Promise<boolean>;
  lastCreditRefresh?: string;
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

  // Wrap refreshUserCredits in useCallback to fix dependency warning
  const refreshUserCredits = useCallback(async (userId: string) => {
    // Move initializeUserCredits inside the callback to fix dependencies
    async function initializeUserCredits(userId: string) {
      try {
        const now = new Date().toISOString();
        const { error } = await supabase
          .from("user_credits")
          .insert({ 
            user_id: userId, 
            credits: 15,
            last_refresh: now
          });

        if (error) {
          console.error("Error initializing credits:", error);
          return;
        }

        setCredits(15);
        setLastCreditRefresh(now);
      } catch (error) {
        console.error("Error in initializeUserCredits:", error);
      }
    }

    try {
      const { data, error } = await supabase
        .from("user_credits")
        .select("credits, last_refresh")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching credits:", error);
        return;
      }

      if (data) {
        setCredits(data.credits);
        if (data.last_refresh) {
          setLastCreditRefresh(data.last_refresh);
        }
      } else {
        // Initialize user credits if not found
        await initializeUserCredits(userId);
      }
    } catch (error) {
      console.error("Error in refreshUserCredits:", error);
    }
  }, [supabase]); // Remove initializeUserCredits from dependencies

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
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Kaydınız başarıyla oluşturuldu!");
      // Auto sign in after sign up
      await signIn(email, password);
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Kayıt oluşturulurken bir hata oluştu.");
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

  async function useOneCredit(): Promise<boolean> {
    if (!user) return false;
    
    try {
      if (credits <= 0) {
        toast.error("Yeterli krediniz bulunmamaktadır!");
        return false;
      }

      const { error } = await supabase
        .from("user_credits")
        .update({ credits: credits - 1 })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error using credit:", error);
        toast.error("Kredi kullanılırken bir hata oluştu.");
        return false;
      }

      // Log credit usage
      await supabase.from("credit_usage").insert({
        user_id: user.id,
        usage_type: "fortune_reading",
        usage_date: new Date().toISOString(),
      });

      setCredits(credits - 1);
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

      // Get current credits
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