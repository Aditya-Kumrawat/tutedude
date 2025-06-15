import { supabase } from "@/integrations/supabase/client";

// Login with email/password
export async function loginWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

// Sign up with email/password, then create a profile entry
export async function signUpWithEmail(email: string, password: string, fullName: string = '', phone?: string, address?: string) {
  const redirectUrl = `${window.location.origin}/`;
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  // If user is created but session is null, it means email verification is pending. This is not an error.
  if (data?.user && !data?.session && authError === null) {
    return { data, error: null }; // Treat as success for the purpose of the AuthScreen message
  }

  return { data, error: authError };
}

// Fetch profile details for a given user id
export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, email, phone, address")
    .eq("id", userId)
    .maybeSingle();
  return { data, error };
}

