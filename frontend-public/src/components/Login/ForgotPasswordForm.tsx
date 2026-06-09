import { useState } from "react";
import { api } from "../../api/axios";
import { useT } from "../../i18n";

type AuthMode = "login" | "register" | "forgot";

type Props = {
  onSwitch: (mode: AuthMode) => void;
};

type FormState = {
  email: string;
};

function ForgotPasswordForm({ onSwitch }: Props) {
  const t = useT();

  const [form, setForm] = useState<FormState>({
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post("/auth/forgot-password", {
        email: form.email,
      });

      setSuccess(t("forgot.success"));

      setTimeout(() => onSwitch("login"), 2000);
    } catch {
      setError(t("forgot.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h2> {t("forgot.title")}</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <label>
          {t("forgot.email")}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t("forgot.email")}
            required
          />
        </label>

        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? t("general.loading") : t("forgot.submit")}
        </button>
      </form>
      <div className="login-link">
        <button
          className="link-button"
          type="button"
          onClick={() => onSwitch("login")}
        >
          {t("forgot.back")}
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
