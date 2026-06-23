import { useT } from "../../i18n";
import Button from "./Button";

type Props = {
  open: boolean;
  title: string;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

function ConfirmModal({
  open,
  title,
  confirmText,
  cancelText,
  onCancel,
  onConfirm,
}: Props) {
  const t = useT();
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>

        <div className="modal-actions">
          <Button variant="primary" onClick={onConfirm}>
            {confirmText ?? t("general.ok")}
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            {cancelText ?? t("general.cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
