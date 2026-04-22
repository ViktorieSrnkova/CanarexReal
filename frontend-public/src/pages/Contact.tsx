import BaseForm from "../components/Forms/BaseForm";
import Card from "../components/Listing/Card";
import { useT } from "../i18n";
import "../styles/pages/contact.css";
function Contact() {
  const t = useT();
  return (
    <>
      <div className="contact gray">
        <h2>{t("form.titleDet")}</h2>
        <h3 className="det-subtitle">{t("form.subtitleDet")}</h3>
        <div className="details-form">
          <Card />
          <BaseForm from={1} what={2} index={26027} />
        </div>
      </div>
      <div className="contact white">
        <h2>{t("form.titleInq")}</h2>
        <h3 className="inq-subtitle">{t("form.subtitleInq")}</h3>
        <BaseForm from={1} what={3} />
      </div>
    </>
  );
}

export default Contact;
