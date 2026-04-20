import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import "../../styles/login/loginPage.css";
import { useT } from "../../i18n";

type FormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const t = useT();

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      const token = res.data.accessToken;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      alert(t("login.success"));
      navigate("/");
    } catch {
      setError(t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h2>{t("login.title")}</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <label>
          {t("login.email")}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t("login.email")}
            required
          />
        </label>

        <label>
          {t("login.password")}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={t("login.password")}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? t("login.loading") : t("login.submit")}
        </button>
      </form>
    </div>
  );
}
