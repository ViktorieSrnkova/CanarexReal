import { useState } from "react";
import { api } from "../../api/axios";
import "../../styles/login/loginPage.css";
import { useT } from "../../i18n";
import { z } from "zod";
import { useAuth } from "../../Auth/authStore";
import { isValidPhoneNumber } from "libphonenumber-js";
import eye from "../../assets/eye.svg";
import noeye from "../../assets/noeye.svg";
import toast from "react-hot-toast";

type Errors = {
  jmeno?: string;
  prijmeni?: string;
  phonePrefix?: string;
  telefon?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

type FormState = {
  jmeno: string;
  prijmeni: string;
  phonePrefix: string;
  telefon: string;
  email: string;
  password: string;
  confirmPassword: string;
};
type AuthMode = "login" | "register" | "forgot";
type Props = {
  onSwitch: (mode: AuthMode) => void;
  onClose: () => void;
};

function RegisterForm({ onSwitch, onClose }: Props) {
  const t = useT();
  const { login } = useAuth();
  const [form, setForm] = useState<FormState>({
    jmeno: "",
    prijmeni: "",
    phonePrefix: "+420",
    telefon: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const registerSchema = z
    .object({
      jmeno: z.string().min(1, "Jméno je povinné"),
      prijmeni: z.string().min(1, "Příjmení je povinné"),
      phonePrefix: z.string(),
      telefon: z.string(),
      email: z.string().min(1, "Email je povinný").email("Neplatný email"),
      password: z.string().min(6, "Heslo musí mít alespoň 6 znaků"),
      confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
      const prefix = data.phonePrefix.trim();
      const phone = data.telefon.trim();

      if (!prefix || !phone) {
        ctx.addIssue({
          path: ["telefon"],
          code: "custom",
          message: t("form.required"),
        });

        return;
      }

      const fullPhone = `${prefix}${phone}`;
      if (!isValidPhoneNumber(fullPhone)) {
        ctx.addIssue({
          path: ["telefon"],
          code: "custom",
          message: t("form.phoneErr"),
        });
      }
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Hesla se neshodují",
      path: ["confirmPassword"],
    });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const validate = () => {
    const result = registerSchema.safeParse(form);

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors = result.error.flatten().fieldErrors;

    setErrors({
      jmeno: fieldErrors.jmeno?.[0],
      prijmeni: fieldErrors.prijmeni?.[0],
      telefon: fieldErrors.telefon?.[0],
      email: fieldErrors.email?.[0],
      password: fieldErrors.password?.[0],
      confirmPassword: fieldErrors.confirmPassword?.[0],
    });

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

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: form.jmeno,
        surname: form.prijmeni,
        phone: `${form.phonePrefix}${form.telefon}`,
        email: form.email,
        password: form.password,
      });
      await login();
      toast.success(t("register.success"));
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const code = err?.response?.data?.code;

      if (code === "EMAIL_ALREADY_EXISTS") {
        setError(t("register.existing"));
        return;
      }

      setError(t("register.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h2>{t("register.title")}</h2>

      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <label>
          <div className="label-err">
            {t("register.firstName")}
            {errors.jmeno && (
              <span className="login-error">{errors.jmeno}</span>
            )}
          </div>

          <input
            type="text"
            name="jmeno"
            value={form.jmeno}
            onChange={handleChange}
            placeholder={t("register.firstName")}
            required
          />
        </label>

        <label>
          <div className="label-err">
            {t("register.lastName")}
            {errors.prijmeni && (
              <span className="login-error">{errors.prijmeni}</span>
            )}
          </div>
          <input
            type="text"
            name="prijmeni"
            value={form.prijmeni}
            onChange={handleChange}
            placeholder={t("register.lastName")}
            required
          />
        </label>

        <label>
          <div className="label-err">
            {t("form.phone")}
            {errors.telefon && (
              <span className="login-error">{errors.telefon}</span>
            )}
          </div>
          <div id="phone-group" className="phone-row">
            <input
              name="phonePrefix"
              autoComplete="tel-country-code"
              placeholder="+420"
              value={form.phonePrefix}
              onChange={handleChange}
              className={
                errors.phonePrefix
                  ? "prefix number error-input"
                  : "prefix number"
              }
            />

            <input
              name="telefon"
              autoComplete="tel"
              placeholder={t("form.phone")}
              type="tel"
              value={form.telefon}
              onChange={handleChange}
              className={
                errors.telefon
                  ? "phoneInput number error-input "
                  : "phoneInput number"
              }
            />
          </div>
        </label>

        <label>
          <div className="label-err">
            {t("register.email")}
            {errors.email && (
              <span className="login-error">{errors.email}</span>
            )}
          </div>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t("register.email")}
            required
          />
        </label>
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
          {loading ? t("register.loading") : t("register.submit")}
        </button>
        <button
          type="button"
          className="link-button"
          onClick={() => {
            onSwitch("login");
          }}
        >
          {t("register.login")}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
