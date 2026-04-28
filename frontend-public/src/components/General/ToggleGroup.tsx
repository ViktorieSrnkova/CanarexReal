import ToggleButton from "./ToggleButton";
import "../../styles/general/toggleGroup.css";

type Props<T extends number> = {
  options: { label: string; value: T }[];
  value: T[];
  onChange: (value: T[]) => void;
  label: string;
};

export default function ToggleGroup<T extends number>({
  options,
  value,
  onChange,
  label,
}: Props<T>) {
  const toggle = (val: T) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className="toggle-section">
      <label htmlFor="toggle-buttons">{label}</label>
      <div className="toggle-group">
        {options.map((opt) => (
          <ToggleButton
            key={opt.value}
            label={opt.label}
            active={value.includes(opt.value)}
            onClick={() => toggle(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
