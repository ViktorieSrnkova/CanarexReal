import ContactForm from "../components/Forms/BaseForm";
import SEO from "../components/SEO/Meta";
import { useT } from "../i18n";

function Mortgage() {
  const t = useT();
  return (
    <>
      <SEO
        title={t("SEO.Mortgage_title")}
        description={t("SEO.Mortgage_description")}
        noindex
      />
      <h1>{t("news.workInProgress")}</h1>

      <div className="contact white mortgage">
        <h2>{t("footer.formTitle")}</h2>
        <ContactForm from={2} what={1} />
      </div>
    </>
  );
}

export default Mortgage;
