import { useT } from "../../i18n";
import Button from "./Button";

function ConfirmModal({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const t = useT();
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{t("favorites.confirm")}</h3>

        <div className="modal-actions">
          <Button variant="primary" onClick={onConfirm}>
            {t("favorites.ok")}
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            {t("favorites.cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
