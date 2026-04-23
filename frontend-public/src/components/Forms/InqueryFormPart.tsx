import "../../styles/forms/inqueryFormPart.css";
import ToggleGroup from "../General/ToggleGroup";
import { useT } from "../../i18n";
import { useFormContext } from "react-hook-form";
import RangeSlider from "../General/RangeSlider";

function InqueryFormPart() {
  const t = useT();

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const mode = watch("arrivalMode");
  const typeError = errors.type?.message as string | undefined;
  const bedroomsError = errors.bedrooms?.message as string | undefined;
  const bathroomsError = errors.bathrooms?.message as string | undefined;
  const priceFrom = watch("priceFrom");
  const priceTo = watch("priceTo");
  const sizeFrom = watch("sizeFrom");
  const sizeTo = watch("sizeTo");
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
        value={watch("type") ?? []}
        onChange={(val) => setValue("type", val, { shouldValidate: true })}
      />
      {typeError && <span className="error">{t("form.toggleErr")}</span>}
      <RangeSlider
        label={t("form.price")}
        valueLabel=" €"
        min={80000}
        max={1000000}
        step={10000}
        value={[priceFrom ?? 80000, priceTo ?? 1000000]}
        onChange={([min, max]) => {
          setValue("priceFrom", min, { shouldDirty: true });
          setValue("priceTo", max, { shouldDirty: true });
        }}
      />
      <RangeSlider
        label={t("form.size")}
        valueLabel=" m²"
        min={0}
        max={300}
        step={1}
        value={[sizeFrom ?? 0, sizeTo ?? 300]}
        onChange={([min, max]) => {
          setValue("sizeFrom", min, { shouldDirty: true });
          setValue("sizeTo", max, { shouldDirty: true });
        }}
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
        value={watch("bedrooms") ?? []}
        onChange={(val) => setValue("bedrooms", val, { shouldValidate: true })}
      />
      {bedroomsError && <span className="error">{t("form.toggleErr")}</span>}

      <ToggleGroup
        label={t("form.bathrooms")}
        options={[
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
          { label: "5+", value: 5 },
        ]}
        value={watch("bathrooms") ?? []}
        onChange={(val) => setValue("bathrooms", val, { shouldValidate: true })}
      />
      {bathroomsError && <span className="error">{t("form.toggleErr")}</span>}
      <div className="field">
        <label htmlFor="radio-group">{t("form.since") + "*"}</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="date"
              {...register("arrivalMode")}
              checked={mode === "date"}
              onChange={() =>
                setValue("arrivalMode", "date", {
                  shouldValidate: true,
                })
              }
            />
            {t("form.date")}
          </label>

          <label>
            <input
              type="radio"
              value="unknown"
              {...register("arrivalMode")}
              checked={mode === "unknown"}
              onChange={() => {
                setValue("arrivalMode", "unknown", {
                  shouldValidate: true,
                });
                setValue("arrival", undefined);
              }}
            />
            {t("form.unsetDate")}
          </label>
        </div>

        {mode === "date" && (
          <input
            type="date"
            {...register("arrival", {
              setValueAs: (v) => (v ? new Date(v) : null),
            })}
            defaultValue=""
            onBlur={() => {
              setValue("arrival", watch("arrival") ?? null, {
                shouldValidate: true,
              });
            }}
          />
        )}
        {errors.arrivalMode && (
          <span className="error">{t("form.checkErr")}</span>
        )}
        {mode === "date" && errors.arrival && (
          <span className="error">{t("form.dateErr")}</span>
        )}
      </div>
    </div>
  );
}

export default InqueryFormPart;
