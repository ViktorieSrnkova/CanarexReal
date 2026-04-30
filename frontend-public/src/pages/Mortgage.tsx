import ContactForm from "../components/Forms/BaseForm";
import { useT } from "../i18n";

function Mortgage() {
  const t = useT();
  return (
    <div className="contact white mortgage">
      <h2>{t("footer.formTitle")}</h2>
      <ContactForm from={2} what={1} />
    </div>
  );
}

export default Mortgage;
