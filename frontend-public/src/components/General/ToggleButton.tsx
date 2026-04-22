import "../../styles/general/toggleButton.css";

type Props = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export default function ToggleButton({ label, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`toggle-btn ${active ? "active" : ""}`}
    >
      {label}
    </button>
  );
}
