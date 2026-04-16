import { Switch } from "antd";

type Props = {
  value: boolean;
  onChange: (v: boolean) => void;
};

export function Visibility({ value, onChange }: Props) {
  return <Switch checked={value} onChange={onChange} />;
}
