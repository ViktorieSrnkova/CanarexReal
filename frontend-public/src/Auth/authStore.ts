import { createContext, useContext } from "react";

export type User = {
  id: number;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

export const AuthContextLogin = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContextLogin);

  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");

  return ctx;
}
