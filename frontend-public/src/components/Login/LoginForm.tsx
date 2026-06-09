import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import "../../styles/login/loginPage.css";
import { useT } from "../../i18n";
import { useLang } from "../../hooks/i18n/useLang";
import eye from "../../assets/eye.svg";
import noeye from "../../assets/noeye.svg";
import { useAuth } from "../../Auth/authStore";
import toast from "react-hot-toast";

type FormState = {
  email: string;
  password: string;
};

type Errors = {
  email?: string;
  password?: string;
};
type AuthMode = "login" | "register" | "forgot";
type Props = {
  onSwitch: (mode: AuthMode) => void;
  onClose: () => void;
};

import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email je povinný").email("Neplatný email"),

  password: z.string().min(1, "Heslo je povinné"),
});

export default function LoginPage({ onSwitch, onClose }: Props) {
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();
  const { login } = useAuth();

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const result = loginSchema.safeParse(form);

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors = result.error.flatten().fieldErrors;

    setErrors({
      email: fieldErrors.email?.[0],
      password: fieldErrors.password?.[0],
    });

    return false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;
    if (!validate()) return;

    setLoading(true);

    try {
      await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      await login();
      toast.success(t("login.success"));

      onClose();
      navigate(`/${lang}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setErrors({
          password: t("login.error"),
        });
        return;
      }

      setErrors({
        password: t("login.generalErr"),
      });
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  return (
    <div className="login-card">
      <h2>{t("login.title")}</h2>

      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <label>
          {t("login.email")}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <span className="login-error">{errors.email}</span>}
        </label>

        <label>
          {t("login.password")}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? (
                <img src={noeye} alt="Hide password" height="20" />
              ) : (
                <img src={eye} alt="Show password" height="20" />
              )}
            </button>
          </div>

          {errors.password && (
            <span className="login-error">{errors.password}</span>
          )}
        </label>

        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? t("login.loading") : t("login.submit")}
        </button>

        <div className="login-links">
          <button
            type="button"
            className="link-button"
            onClick={() => {
              onSwitch("forgot");
            }}
          >
            {t("login.forgotPassword")}
          </button>

          <button
            type="button"
            className="link-button"
            onClick={() => {
              onSwitch("register");
            }}
          >
            {t("login.register")}
          </button>
        </div>
      </form>
    </div>
  );
}
