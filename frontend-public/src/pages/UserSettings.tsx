import { useEffect, useState } from "react";
import { changePassword, getMe, updateMe } from "../api/user";
import toast from "react-hot-toast";
import type { MeResponse } from "../types/rawApi";
import { z } from "zod";
import FieldRow from "../components/Forms/FieldRow";
import eye from "../assets/eye.svg";
import noeye from "../assets/noeye.svg";
import Button from "../components/General/Button";
import Modal from "../components/General/Modal";
import type { FormState, PasswordForm } from "../types/users";
import { useT } from "../i18n";
import "../styles/pages/settings.css";
import { useAuth } from "../Auth/authStore";

const profileSchema = (t: ReturnType<typeof useT>) =>
  z.object({
    jmeno: z.string().min(1, t("usrSettings.nameReq")).max(100),

    prijmeni: z.string().max(100).optional().or(z.literal("")),

    email: z.string().email(t("usrSettings.emailInv")).max(50),

    telefon: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => {
        if (!val) return true;

        const cleaned = val.replace(/\s/g, "");

        return /^(\+?[0-9]{9,15})$/.test(cleaned);
      }, t("usrSettings.phoneInv")),
  });

const passwordSchema = (t: ReturnType<typeof useT>) =>
  z
    .object({
      currentPassword: z.string().min(1, t("usrSettings.currPwd")),

      newPassword: z.string().min(8, t("usrSettings.validPwd")).max(100),

      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("usrSettings.diffPwd"),
    });

function UserSettings() {
  const t = useT();
  const { refreshUser } = useAuth();

  const [form, setForm] = useState<FormState>({
    jmeno: "",
    prijmeni: "",
    email: "",
    telefon: "",
  });
  const [savedForm, setSavedForm] = useState<FormState>({
    jmeno: "",
    prijmeni: "",
    email: "",
    telefon: "",
  });
  const [stats, setStats] = useState({
    favoritesCount: 0,
    formsCount: 0,
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );

  const mapZodErrors = (error: z.ZodError) => {
    const fieldErrors: Record<string, string> = {};

    error.issues.forEach((err) => {
      const key = err.path[0];
      if (typeof key === "string") {
        fieldErrors[key] = err.message;
      }
    });

    return fieldErrors;
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const mapMeToForm = (data: MeResponse): FormState => ({
    jmeno: data.jmeno,
    prijmeni: data.prijmeni ?? "",
    email: data.email,
    telefon: data.telefon ?? "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMe();

        setForm(mapMeToForm(data));
        setSavedForm(mapMeToForm(data));

        setStats({
          favoritesCount: data.favoritesCount,
          formsCount: data.formsCount,
        });
      } catch {
        toast.error(t("usrSettings.loadErr"));
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    const parsed = profileSchema(t).safeParse(form);

    if (!parsed.success) {
      setErrors(mapZodErrors(parsed.error));
      return;
    }

    setErrors({});

    try {
      const updated = await updateMe(parsed.data);

      setForm({
        jmeno: updated.jmeno,
        prijmeni: updated.prijmeni ?? "",
        email: updated.email,
        telefon: updated.telefon ?? "",
      });
      setSavedForm({
        jmeno: updated.jmeno,
        prijmeni: updated.prijmeni ?? "",
        email: updated.email,
        telefon: updated.telefon ?? "",
      });
      await refreshUser();
      setEditing(false);
      toast.success(t("usrSettings.savedUsr"));
    } catch {
      toast.error(t("usrSettings.saveErr"));
    }
  };
  const updateField = (field: keyof FormState, value: string) => {
    const nextForm = {
      ...form,
      [field]: value,
    };

    setForm(nextForm);

    const result = profileSchema(t).safeParse(nextForm);

    if (result.success) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    } else {
      const fieldError = result.error.issues.find((e) => e.path[0] === field);

      setErrors((prev) => ({
        ...prev,
        [field]: fieldError?.message ?? "",
      }));
    }
  };
  const passwordErrorMap: Record<string, string> = {
    PASSWORD_SAME_AS_OLD: t("usrSettings.samePwd"),
    CURRENT_PASSWORD_INVALID: t("usrSettings.incorrectPwd"),
    PASSWORDS_DO_NOT_MATCH: t("usrSettings.diffPwd"),
  };
  const handlePasswordChange = async () => {
    const parsed = passwordSchema(t).safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!parsed.success) {
      setPasswordErrors(mapZodErrors(parsed.error));
      return;
    }

    setPasswordErrors({});

    try {
      setPasswordLoading(true);

      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setPasswordModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success(t("usrSettings.changedPwd"));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const code = err?.response?.data?.code;

      const message =
        passwordErrorMap[code] ??
        err?.response?.data?.message ??
        t("usrSettings.changedErr");

      toast.error(message);
    } finally {
      setPasswordLoading(false);
    }
  };
  const updatePasswordField = (field: keyof PasswordForm, value: string) => {
    const next = {
      currentPassword,
      newPassword,
      confirmPassword,
      [field]: value,
    };

    if (field === "currentPassword") setCurrentPassword(value);
    if (field === "newPassword") setNewPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);

    const result = passwordSchema(t).safeParse(next);

    if (result.success) {
      setPasswordErrors({});
      return;
    }

    const fieldError = result.error.issues.find((e) => e.path[0] === field);

    setPasswordErrors((prev) => ({
      ...prev,
      [field]: fieldError?.message ?? "",
    }));
  };

  if (loading) return <p>{t("general.loading")}</p>;

  return (
    <>
      <div className="faq">
        <h1>{t("usrSettings.title")}</h1>
      </div>
      <div className="settings">
        <div className="settings-infosection">
          {/*   <h3>{t("usrSettings.subtitle")}</h3> */}

          {!editing ? (
            <table>
              <tbody>
                <tr>
                  <td>{t("form.name")}: </td>
                  <td>{form.jmeno}</td>
                </tr>
                <tr>
                  <td>{t("form.surname")}: </td>
                  <td>{form.prijmeni}</td>
                </tr>
                <tr>
                  <td>{t("form.email")}: </td>
                  <td>{form.email}</td>
                </tr>
                <tr>
                  <td>{t("form.phone")}: </td>
                  <td>{form.telefon}</td>
                </tr>
                <tr>
                  <td>{t("usrSettings.numFav")} </td>
                  <td>{stats.favoritesCount}</td>
                </tr>
                <tr>
                  <td>{t("usrSettings.numForm")}</td>
                  <td>{stats.formsCount}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="setting-fields">
              <FieldRow label={t("form.name")} error={errors.jmeno}>
                <input
                  placeholder={t("form.name")}
                  value={form.jmeno}
                  onChange={(e) => updateField("jmeno", e.target.value)}
                />
              </FieldRow>

              <FieldRow label={t("form.surname")} error={errors.prijmeni}>
                <input
                  placeholder={t("form.surname")}
                  value={form.prijmeni}
                  onChange={(e) => updateField("prijmeni", e.target.value)}
                />
              </FieldRow>
              <FieldRow label={t("form.email")} error={errors.email}>
                <input
                  placeholder={t("form.email")}
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </FieldRow>
              <FieldRow label={t("form.phone")} error={errors.telefon}>
                <input
                  placeholder={t("form.phone")}
                  value={form.telefon}
                  onChange={(e) => updateField("telefon", e.target.value)}
                />
              </FieldRow>
            </div>
          )}

          <div className="modal-actions">
            <div style={{ marginTop: 10 }}>
              {!editing ? (
                <Button variant="primary" onClick={() => setEditing(true)}>
                  {t("usrSettings.edit")}
                </Button>
              ) : (
                <div className="modal-actions">
                  <Button variant="primary" onClick={handleSave}>
                    {t("usrSettings.save")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setForm(savedForm);
                      setErrors({});
                      setEditing(false);
                    }}
                  >
                    {t("usrSettings.cancel")}
                  </Button>
                </div>
              )}
            </div>
            <Button
              variant="primary"
              onClick={() => setPasswordModalOpen(true)}
              style={{ marginTop: "10px" }}
            >
              {t("usrSettings.change")}
            </Button>
          </div>
        </div>
        <Modal
          open={passwordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
        >
          <h3 style={{ marginTop: 30 }}>{t("usrSettings.changeTit")}</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <FieldRow
              label={t("usrSettings.curr")}
              error={passwordErrors.currentPassword}
            >
              <div className="password-wrapper">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) =>
                    updatePasswordField("currentPassword", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowCurrentPassword((p) => !p)}
                >
                  {showCurrentPassword ? (
                    <img src={noeye} alt="Hide password" height="20" />
                  ) : (
                    <img src={eye} alt="Show password" height="20" />
                  )}
                </button>
              </div>
            </FieldRow>

            <FieldRow
              label={t("usrSettings.new")}
              error={passwordErrors.newPassword}
            >
              <div className="password-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) =>
                    updatePasswordField("newPassword", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowNewPassword((p) => !p)}
                >
                  {showNewPassword ? (
                    <img src={noeye} alt="Hide password" height="20" />
                  ) : (
                    <img src={eye} alt="Show password" height="20" />
                  )}
                </button>
              </div>
            </FieldRow>

            <FieldRow
              label={t("usrSettings.check")}
              error={passwordErrors.confirmPassword}
            >
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) =>
                    updatePasswordField("confirmPassword", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                >
                  {showConfirmPassword ? (
                    <img src={noeye} alt="Hide password" height="20" />
                  ) : (
                    <img src={eye} alt="Show password" height="20" />
                  )}
                </button>
              </div>
            </FieldRow>

            <Button
              variant="primary"
              onClick={handlePasswordChange}
              disabled={passwordLoading}
            >
              {passwordLoading
                ? t("usrSettings.saving")
                : t("usrSettings.change")}
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default UserSettings;
