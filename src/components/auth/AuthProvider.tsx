"use client";

import { createContext, useContext } from "react";

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

// Simplified provider - Supabase auth disabled until configured
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        user: null,
        isLoading: false,
        isAdmin: false,
        isConfigured: false,
        signOut: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
