"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { UserProfile } from "@/types/supabase";

type User = {
  id: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  isAdmin: boolean;
  isConfigured: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAdmin: false,
  isConfigured: false,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;

    const supabase = createClient();
    let cancelled = false;

    const loadRole = async (userId: string) => {
      const { data } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", userId)
        .single();
      if (cancelled) return;
      const role = (data as Pick<UserProfile, "role"> | null)?.role;
      setIsAdmin(role === "admin");
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? "" });
        loadRole(session.user.id);
      }
      setIsLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? "" });
        loadRole(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [configured]);

  const signOut = async () => {
    if (!configured) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAdmin, isConfigured: configured, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
