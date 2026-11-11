import BaseForm from "./BaseForm";
import { useT } from "../../i18n";

const FormSection = () => {
  const t = useT();
  return (
    <section
      style={{
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="wrap">
        <p className="eyebrow">{t("form.subtitleInq")}</p>
        <h2 style={{ marginBottom: "2rem" }}>{t("form.titleInq")}</h2>
        <BaseForm from={3} what={3} />
      </div>
    </section>
  );
};

export default FormSection;
