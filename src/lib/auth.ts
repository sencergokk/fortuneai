import { createClientComponentClient } from '@supabase/ssr';
import { type AuthResponse, type User, type AuthTokenResponse } from '@supabase/supabase-js';

export type AuthError = {
  message: string;
};

const supabase = createClientComponentClient();

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  return supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  return supabase.auth.signOut();
}

export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`,
  });
}

export async function updatePassword(password: string): Promise<AuthTokenResponse> {
  return supabase.auth.updateUser({
    password,
  });
}

export async function getUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserCredits(): Promise<number> {
  try {
    const user = await getUser();
    if (!user) return 0;

    const { data, error } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data?.credits || 0;
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return 0;
  }
}

export async function useCredit(userId: string): Promise<boolean> {
  try {
    // Get current credits
    const { data: userData, error: userError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (userError) throw userError;
    if (!userData || userData.credits <= 0) return false;

    // Update credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ credits: userData.credits - 1 })
      .eq('user_id', userId);

    if (updateError) throw updateError;
    
    // Add to credit usage history
    const { error: historyError } = await supabase
      .from('credit_usage')
      .insert({ 
        user_id: userId,
        usage_type: 'fortune_reading',
        usage_date: new Date().toISOString()
      });

    if (historyError) throw historyError;

    return true;
  } catch (error) {
    console.error('Error using credit:', error);
    return false;
  }
} 