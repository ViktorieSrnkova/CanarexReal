import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "../../styles/login/authmodal.css";
import { createPortal } from "react-dom";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useState } from "react";
type AuthMode = "login" | "register" | "forgot";
type Props = {
  onClose: () => void;
  initialMode: AuthMode;
};

function AuthModal({ onClose, initialMode }: Props) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  return createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>

        {mode === "login" && <LoginForm onClose={onClose} onSwitch={setMode} />}
        {mode === "register" && (
          <RegisterForm onClose={onClose} onSwitch={setMode} />
        )}
        {mode === "forgot" && <ForgotPasswordForm onSwitch={setMode} />}
      </div>
    </div>,
    document.body,
  );
}
export default AuthModal;
