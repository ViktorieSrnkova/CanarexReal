import ToggleButton from "./ToggleButton";
import "../../styles/general/toggleGroup.css";

type Option = {
  label: string;
  value: number;
};

type Props = {
  options: Option[];
  value: number[];
  onChange: (value: number[]) => void;
  label: string;
};

export default function ToggleGroup({
  options,
  value,
  onChange,
  label,
}: Props) {
  const toggle = (val: number) => {
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
