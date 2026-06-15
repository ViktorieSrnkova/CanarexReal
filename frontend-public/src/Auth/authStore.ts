import { createContext, useContext } from "react";

export type User = {
  id: number;
};
export type RichUser = {
  email: string;
  jmeno: string;
  prijmeni: string;
  telefon: string;
};

export type AuthContextType = {
  user: User | null;
  rich: RichUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

export const AuthContextLogin = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContextLogin);

  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");

  return ctx;
}
