import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./client";

export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await getSupabaseBrowserClient().auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await getSupabaseBrowserClient().auth.getUser();
  if (error) return null;
  return data.user;
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabaseBrowserClient().auth.signOut();
  if (error) throw error;
}

export function safeRedirectPath(value: string | null | undefined, fallback = "/mon-espace"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
