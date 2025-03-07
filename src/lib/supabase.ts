import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znsfhkpyldlxejekebhv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpuc2Zoa3B5bGRseGVqZWtlYmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNTQ0MzIsImV4cCI6MjA1NjkzMDQzMn0.Kd9bbo95h38dS465209B6naTVwrjZFM4i3WLYwDBKbs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};