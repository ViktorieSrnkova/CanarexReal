import { useT } from "../../i18n";
import "../../styles/components/contactOverview.css";

const ContactOverview = () => {
  const t = useT();
  return (
    <section className="contact-overview">
      <div className="wrapper">
        <div className="worry">
          <p className="eyebrow">{t("homepage.contactOverview.eyebrow")}</p>
          <h2>{t("homepage.contactOverview.title")}</h2>
          <p>{t("homepage.contactOverview.p1")}</p>
          <p>{t("homepage.contactOverview.p2")}</p>
        </div>
        <div className="contact-box">
          <strong>{t("homepage.contactOverview.strong")}</strong>
          <div>{t("homepage.contactOverview.subtext")}</div>
          <a href="tel:+420603257021">{t("contact.phoneCZ1")}</a>
          <a href="mailto:stan@canarexreal.com">{t("contact.email")}</a>
          <a
            className="btn"
            href="https://wa.me/34604198470"
            target="_blank"
            rel="noopener"
          >
            {t("homepage.contactOverview.a1")}
          </a>
          <a className="textlink" href="https://www.canarexreal.com/kontakt">
            {t("homepage.contactOverview.inquiry")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactOverview;
