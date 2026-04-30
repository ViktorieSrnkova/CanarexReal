import ContactForm from "../components/Forms/BaseForm";
import { useT } from "../i18n";

function Mortgage() {
  const t = useT();
  return (
    <>
      <h2>{t("news.workInProgress")}</h2>

      <div className="contact white mortgage">
        <h2>{t("footer.formTitle")}</h2>
        <ContactForm from={2} what={1} />
      </div>
    </>
  );
}

export default Mortgage;
