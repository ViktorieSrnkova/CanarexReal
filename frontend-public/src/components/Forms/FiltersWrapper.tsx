import InqueryFormPart from "./InqueryFormPart";
import type { FormValues } from "../../types/forms";

type Props = {
  value: FormValues;
  onChange: React.Dispatch<React.SetStateAction<FormValues>>;
};

export default function FiltersWrapper(props: Props) {
  return (
    <InqueryFormPart
      value={props.value}
      hasDate={false}
      errors={{}}
      onChange={(patch) => props.onChange((prev) => ({ ...prev, ...patch }))}
    />
  );
}
