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

const profileSchema = z.object({
  jmeno: z.string().min(1, "Jméno je povinné").max(100),

  prijmeni: z.string().max(100).optional().or(z.literal("")),

  email: z.string().email("Neplatný email").max(50),

  telefon: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val) return true;

      const cleaned = val.replace(/\s/g, "");

      return /^(\+?[0-9]{9,15})$/.test(cleaned);
    }, "Neplatné telefonní číslo"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Zadejte současné heslo"),

    newPassword: z.string().min(8, "Heslo musí mít alespoň 8 znaků").max(100),

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Hesla se neshodují",
  });

function UserSettings() {
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
        toast.error("Nepodařilo se načíst profil");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSave = async () => {
    const parsed = profileSchema.safeParse(form);

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

      setEditing(false);
      toast.success("Profil byl uložen");
    } catch {
      toast.error("Nepodařilo se uložit profil");
    }
  };
  const updateField = (field: keyof FormState, value: string) => {
    const nextForm = {
      ...form,
      [field]: value,
    };

    setForm(nextForm);

    const result = profileSchema.safeParse(nextForm);

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
    PASSWORD_SAME_AS_OLD: "Nové heslo musí být jiné než staré",
    CURRENT_PASSWORD_INVALID: "Současné heslo není správné",
    PASSWORDS_DO_NOT_MATCH: "Hesla se neshodují",
  };
  const handlePasswordChange = async () => {
    const parsed = passwordSchema.safeParse({
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

      toast.success("Heslo bylo změněno");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const code = err?.response?.data?.code;

      const message =
        passwordErrorMap[code] ??
        err?.response?.data?.message ??
        "Chyba při změně hesla";

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

    const result = passwordSchema.safeParse(next);

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

  if (loading) return <p>Načítání...</p>;

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Nastavení účtu</h2>
      <h3>Profil</h3>

      {!editing ? (
        <table>
          <tbody>
            <tr>
              <td>Jméno: </td>
              <td>{form.jmeno}</td>
            </tr>
            <tr>
              <td>Příjmení: </td>
              <td>{form.prijmeni}</td>
            </tr>
            <tr>
              <td>Email: </td>
              <td>{form.email}</td>
            </tr>
            <tr>
              <td>Telefon: </td>
              <td>{form.telefon}</td>
            </tr>
            <tr>
              <td>Počet oblíbených inzerátů:</td>
              <td>{stats.favoritesCount}</td>
            </tr>
            <tr>
              <td>Počet vyplněných formulářů:</td>
              <td>{stats.formsCount}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <FieldRow label="Jméno" error={errors.jmeno}>
            <input
              placeholder="Jméno"
              value={form.jmeno}
              onChange={(e) => updateField("jmeno", e.target.value)}
            />
          </FieldRow>

          <FieldRow label="Příjmení" error={errors.prijmeni}>
            <input
              placeholder="Příjmení"
              value={form.prijmeni}
              onChange={(e) => updateField("prijmeni", e.target.value)}
            />
          </FieldRow>
          <FieldRow label="Email" error={errors.email}>
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </FieldRow>
          <FieldRow label="Telefon" error={errors.telefon}>
            <input
              placeholder="Telefon"
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
              Upravit profil
            </Button>
          ) : (
            <div className="modal-actions">
              <Button variant="primary" onClick={handleSave}>
                Uložit
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setForm(savedForm);
                  setErrors({});
                  setEditing(false);
                }}
              >
                Zrušit
              </Button>
            </div>
          )}
        </div>
        <Button
          variant="primary"
          onClick={() => setPasswordModalOpen(true)}
          style={{ marginTop: "10px" }}
        >
          Změnit heslo
        </Button>
      </div>
      <Modal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      >
        <h3 style={{ marginTop: 30 }}>Změna hesla</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <FieldRow
            label="Současné heslo"
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

          <FieldRow label="Nové heslo" error={passwordErrors.newPassword}>
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
            label="Potvrzení hesla"
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
            {passwordLoading ? "Ukládám..." : "Změnit heslo"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default UserSettings;
