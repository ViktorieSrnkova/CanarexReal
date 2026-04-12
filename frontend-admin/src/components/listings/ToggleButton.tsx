import { Button } from "antd";

interface Props {
  value?: boolean;
  onChange?: (value: boolean) => void;
  label: string;
}

export default function ToggleButton({
  value = false,
  onChange,
  label,
}: Props) {
  return (
    <Button
      type={value ? "primary" : "default"}
      onClick={() => onChange?.(!value)}
      style={{
        borderRadius: 20,
        minWidth: 140,
      }}
    >
      {label}
    </Button>
  );
}
