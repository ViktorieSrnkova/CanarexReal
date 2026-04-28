import "../../styles/general/dropdown.css";
export type DropdownOption<T extends string | number = string | number> = {
  label: string;
  value: T;
};

type Props<T extends string | number> = {
  value: T;
  options: readonly DropdownOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  label: string;
};

function Dropdown<T extends string | number>({
  value,
  options,
  onChange,
  placeholder,
  label,
}: Props<T>) {
  return (
    <div className="dropdown-wrapper">
      <label htmlFor="select">{label}</label>
      <select
        value={String(value)}
        onChange={(e) => {
          const selected = options.find(
            (o) => String(o.value) === e.target.value,
          );
          if (selected) onChange(selected.value);
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}

        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
