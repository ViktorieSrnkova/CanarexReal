import { useEffect, useState, useCallback } from "react";
import { api } from "../api/axios";
import { AuthContextLogin, type User } from "./authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    await api.post("/auth/logout");

    setUser(null);
  }, []);

  const fetchMe = useCallback(async () => {
    const res = await api.get("/auth/me");
    setUser(res.data);
  }, []);

  const login = async () => {
    await fetchMe();
  };
  useEffect(() => {
    const init = async () => {
      try {
        await fetchMe();
      } catch {
        setUser(null);
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
    <AuthContextLogin.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContextLogin.Provider>
  );
}
