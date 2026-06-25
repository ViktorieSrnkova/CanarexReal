import "../../styles/general/toggleButton.css";

type Props = {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
};

export default function ToggleButton({
  label,
  active,
  onClick,
  className,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`toggle-btn ${active ? "active" : ""} ${className}`}
    >
      {label}
    </button>
  );
}
