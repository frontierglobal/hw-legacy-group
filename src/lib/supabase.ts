import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znsfhkpyldlxejekebhv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc2Zoa3B5bGRseGVqZWtlYmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNTQ0MzIsImV4cCI6MjA1NjkzMDQzMn0.Kd9bbo95h38dS465209B6naTVwrjZFM4i3WLYwDBKbs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => sessionStorage.getItem(key),
      setItem: (key, value) => sessionStorage.setItem(key, value),
      removeItem: (key) => sessionStorage.removeItem(key)
    }
  }
});

// Auth helpers with error handling
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    // First, sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear all storage
    sessionStorage.clear();
    localStorage.clear();

    // Force reload the page to clear any cached state
    window.location.href = '/';
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, error };
  }
};