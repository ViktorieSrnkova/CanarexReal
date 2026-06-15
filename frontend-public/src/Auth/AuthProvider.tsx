import { useEffect, useState, useCallback } from "react";
import { api } from "../api/axios";
import { AuthContextLogin, type RichUser, type User } from "./authStore";
import toast from "react-hot-toast";
import { useT } from "../i18n";
import { getMe } from "../api/user";
import type { MeResponse } from "../types/rawApi";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const t = useT();
  const [user, setUser] = useState<User | null>(null);
  const [rich, setRich] = useState<RichUser | null>(null);
  const [loading, setLoading] = useState(true);
  const mapMeToForm = (data: MeResponse): RichUser => ({
    jmeno: data.jmeno,
    prijmeni: data.prijmeni ?? "",
    email: data.email,
    telefon: data.telefon ?? "",
  });
  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setUser(null);
    setRich(null);
    toast.success(t("login.successLogout"));
  }, [t]);

  const fetchMe = useCallback(async () => {
    const [authRes, profileRes] = await Promise.all([
      api.get("/auth/me"),
      getMe(),
    ]);
    setUser(authRes.data);
    setRich(mapMeToForm(profileRes));
  }, []);
  const refreshUser = useCallback(async () => {
    await fetchMe();
  }, [fetchMe]);

  const login = async () => {
    await fetchMe();
  };
  useEffect(() => {
    const init = async () => {
      try {
        await fetchMe();
      } catch {
        setUser(null);
        setRich(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [fetchMe]);
  useEffect(() => {
    console.log("AUTH USER CHANGED:", user);
  }, [user]);

  return (
    <AuthContextLogin.Provider
      value={{ user, rich, login, logout, loading, refreshUser }}
    >
      {children}
    </AuthContextLogin.Provider>
  );
}
