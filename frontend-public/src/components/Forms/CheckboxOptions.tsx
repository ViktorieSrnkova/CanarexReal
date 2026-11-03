import "../../styles/forms/checkbox.css";

type CheckboxOptionsProps = {
  label: string;
  options: { label: string; value: number }[];
  value: number[];
  onChange: (value: number[]) => void;
};

export default function CheckboxOptions({
  label,
  options,
  value,
  onChange,
}: CheckboxOptionsProps) {
  return (
    <fieldset className="checkbox-options">
      <legend>{label}</legend>

      {options.map((option) => (
        <label key={option.value} className="checkbox-option">
          <input
            type="checkbox"
            checked={value.includes(option.value)}
            style={{ border: "1px solid #d9d9d9", accentColor: "#87ceeb" }}
            onChange={(e) => {
              onChange(
                e.target.checked
                  ? [...value, option.value]
                  : value.filter((item) => item !== option.value),
              );
            }}
          />
          <span className="number"> {option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
