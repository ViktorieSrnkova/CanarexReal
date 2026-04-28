import { useFormContext } from "react-hook-form";
import InqueryFormPart from "./InqueryFormPart";
import type { FormValues } from "../../types/forms";

export type FormErrorMap = Partial<Record<keyof FormValues, string>>;

export default function InqueryFormPartRHF() {
  const { watch, setValue, formState } = useFormContext<FormValues>();

  const value = watch();
  const errorsMap: FormErrorMap = Object.fromEntries(
    Object.entries(formState.errors).map(([k, v]) => [
      k as keyof FormValues,
      (v as { message?: string })?.message ?? "",
    ]),
  );
  return (
    <InqueryFormPart
      value={value}
      errors={errorsMap}
      hasDate={true}
      onChange={(patch) => {
        Object.entries(patch).forEach(([key, val]) => {
          setValue(key as keyof FormValues, val, {
            shouldDirty: true,
            shouldValidate: true,
          });
        });
      }}
    />
  );
}
