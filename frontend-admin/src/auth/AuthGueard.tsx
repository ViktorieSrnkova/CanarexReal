import { useEffect, useState } from "react";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../api/client";

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/me");
        setValid(true);
      } catch {
        try {
          const refresh = await api.post("/refresh");

          const newToken = refresh.data.accessToken;
          localStorage.setItem("token", newToken);

          await api.get("/me");
          setValid(true);
        } catch {
          localStorage.removeItem("token");
          setValid(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!valid) return <Navigate to="/login" replace />;

  return children;
}
