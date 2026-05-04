import InqueryFormPart from "./InqueryFormPart";
import type { FormValues } from "../../types/forms";

type Props = {
  value: FormValues;
  onChange: React.Dispatch<React.SetStateAction<FormValues>>;
  priceRange?: number[];
  sizeRange?: number[];
};

export default function FiltersWrapper(props: Props) {
  return (
    <InqueryFormPart
      value={props.value}
      hasDate={false}
      errors={{}}
      onChange={(patch) => props.onChange((prev) => ({ ...prev, ...patch }))}
      priceRange={props.priceRange}
      sizeRange={props.sizeRange}
    />
  );
}
