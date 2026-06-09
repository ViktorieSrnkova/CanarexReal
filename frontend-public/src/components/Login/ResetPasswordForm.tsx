import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api/axios";
import { useT } from "../../i18n";
import { z } from "zod";
import eye from "../../assets/eye.svg";
import noeye from "../../assets/noeye.svg";
import { useLang } from "../../hooks/i18n/useLang";
type Errors = {
  password?: string;
  confirmPassword?: string;
};

type FormState = {
  password: string;
  confirmPassword: string;
};

function ResetPasswordForm() {
  const t = useT();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const registerSchema = z
    .object({
      password: z.string().min(6, "Heslo musí mít alespoň 6 znaků"),
      confirmPassword: z.string(),
    })

    .refine((data) => data.password === data.confirmPassword, {
      message: "Hesla se neshodují",
      path: ["confirmPassword"],
    });
  const validate = () => {
    const result = registerSchema.safeParse(form);

    if (result.success) {
      setErrors({});
      return true;
    }

    const issues = result.error.issues;

    const newErrors: Errors = {};

    for (const issue of issues) {
      const key = issue.path[0] as keyof Errors;
      newErrors[key] = issue.message;
    }

    setErrors(newErrors);

    return false;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: undefined,
    }));
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!validate()) return;
    if (!token) {
      setError("Chybí reset token");
      return;
    }
    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: form.password,
      });
      toast.success(t("resetPwd.success"));
      window.dispatchEvent(new CustomEvent("open-login"));
      navigate(`/${lang}`);
    } catch {
      setError(t("resetPwd.error"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-card" style={{ marginTop: "2rem" }}>
      <h2>{t("resetPwd.title")}</h2>
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <label>
          <div className="label-err">
            {t("register.password")}
            {errors.password && (
              <span className="login-error">{errors.password}</span>
            )}
          </div>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={t("register.password")}
              required
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
        </label>

        <label>
          <div className="label-err">
            {t("register.confirmPassword")}
            {errors.confirmPassword && (
              <span className="login-error">{errors.confirmPassword}</span>
            )}
          </div>
          <div className="password-wrapper">
            <input
              type={showPasswordConfirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder={t("register.confirmPassword")}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPasswordConfirm((p) => !p)}
            >
              {showPasswordConfirm ? (
                <img src={noeye} alt="Hide password" height="20" />
              ) : (
                <img src={eye} alt="Show password" height="20" />
              )}
            </button>
          </div>
        </label>
        {error && <p className="login-error">{error}</p>}
        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? t("general.loading") : t("resetPwd.submit")}
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
