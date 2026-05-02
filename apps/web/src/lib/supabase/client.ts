import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

const getSupabaseUrl = (): string => {
  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
  }

  return supabaseUrl;
};

const getSupabaseAnonKey = (): string => {
  const supabaseAnonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

  if (!supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.");
  }

  return supabaseAnonKey;
};

export const getSupabaseBrowserClient = (): SupabaseClient => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

  return supabaseClient;
};
