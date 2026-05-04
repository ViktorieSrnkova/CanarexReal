import "../../styles/forms/inqueryFormPart.css";
import ToggleGroup from "../General/ToggleGroup";
import RangeSlider from "../General/RangeSlider";
import { useT } from "../../i18n";
import type { FormValues, InquiryFormPatch } from "../../types/forms";
import type { FormErrorMap } from "./InqueryFormPartRHF";

type Props = {
  value: FormValues;
  errors?: FormErrorMap;
  onChange: (patch: InquiryFormPatch) => void;
  hasDate: boolean;
  priceRange?: number[];
  sizeRange?: number[];
};

export default function InqueryFormPart({
  value,
  errors,
  onChange,
  hasDate,
  priceRange,
  sizeRange,
}: Props) {
  const t = useT();

  const mode = value.arrivalMode;

  return (
    <div className="inquiry-form">
      <ToggleGroup
        label={t("form.type")}
        options={[
          { label: t("property_type.vila"), value: 3 },
          { label: t("property_type.apartment"), value: 1 },
          { label: t("property_type.house"), value: 2 },
          { label: t("property_type.studio"), value: 4 },
          { label: t("property_type.land"), value: 5 },
        ]}
        value={value.type ?? []}
        onChange={(val) => onChange({ type: val })}
      />
      {errors?.type && <span className="error">{t("form.toggleErr")}</span>}
      <RangeSlider
        label={t("form.price")}
        valueLabel=" €"
        min={priceRange?.[0] ?? 80000}
        max={priceRange?.[1] ?? 2000000}
        step={10000}
        value={[value.priceFrom ?? 80000, value.priceTo ?? 2000000]}
        onChange={([min, max]) => onChange({ priceFrom: min, priceTo: max })}
      />
      <RangeSlider
        label={t("form.size")}
        valueLabel=" m²"
        min={sizeRange?.[0] ?? 0}
        max={sizeRange?.[1] ?? 5000}
        step={1}
        value={[value.sizeFrom ?? 0, value.sizeTo ?? 5000]}
        onChange={([min, max]) => onChange({ sizeFrom: min, sizeTo: max })}
      />
      <ToggleGroup
        label={t("form.bedrooms")}
        options={[
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
          { label: "5+", value: 5 },
        ]}
        value={value.bedrooms ?? []}
        onChange={(val) => onChange({ bedrooms: val })}
      />
      {errors?.bedrooms && <span className="error">{t("form.toggleErr")}</span>}
      <ToggleGroup
        label={t("form.bathrooms")}
        options={[
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
          { label: "5+", value: 5 },
        ]}
        value={value.bathrooms ?? []}
        onChange={(val) => onChange({ bathrooms: val })}
      />
      {errors?.bathrooms && (
        <span className="error">{t("form.toggleErr")}</span>
      )}
      {hasDate && (
        <div className="field">
          <label>{t("form.since") + "*"}</label>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                checked={mode === "date"}
                onChange={() => onChange({ arrivalMode: "date" })}
              />
              {t("form.date")}
            </label>

            <label>
              <input
                type="radio"
                checked={mode === "unknown"}
                onChange={() =>
                  onChange({
                    arrivalMode: "unknown",
                    arrival: undefined,
                  })
                }
              />
              {t("form.unsetDate")}
            </label>
          </div>

          {mode === "date" && (
            <input
              type="date"
              value={
                value.arrival
                  ? new Date(value.arrival).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                onChange({
                  arrival: e.target.value ? new Date(e.target.value) : null,
                })
              }
            />
          )}

          {errors?.arrivalMode && (
            <span className="error">{t("form.checkErr")}</span>
          )}

          {mode === "date" && errors?.arrival && (
            <span className="error">{t("form.dateErr")}</span>
          )}
        </div>
      )}
    </div>
  );
}
