import Medalion from "../components/Contact/Medalion";
import Map from "../components/General/Map";
import BaseForm from "../components/Forms/BaseForm";
import { useT } from "../i18n";
import "../styles/pages/contact.css";
import SEO from "../components/SEO/Meta";
function Contact() {
  const t = useT();
  return (
    <>
      <SEO
        title={t("SEO.Contact_title")}
        description={t("SEO.Contact_description")}
        schema={{
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "CanarexReal",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+420603257021",
          },
        }}
      />
      <div className="contact-medalions contact white">
        <h2>{t("contact.title")}</h2>
        <h3 className="padded-subtitle">{t("contact.subtitle")}</h3>
        <div className="medalion-group">
          <Medalion
            name="Stan Srnka"
            role={t("contact.ceoRole")}
            phoneMain="+420 603 257 021"
            phoneSecondary="+34 604 198 470"
            email="stan@canarexreal.com"
            alt="Stanislav Srnka"
            image="/contact/stan.webp"
            flagPath={["/flags/cz.png", "/flags/es.png"]}
            flagAlts={["cz flag", "es flag"]}
          />
          <Medalion
            name="Chloe Golem"
            role={t("contact.assistRole")}
            phoneMain="+421 919 490 980"
            email="chloe@canarexreal.com"
            alt="Chloe Golem"
            image="/contact/chloe.webp"
            flagPath={["/flags/sk.png"]}
            flagAlts={["sk flag"]}
          />
        </div>
        <div className="contact-map-wrapper">
          <img src="/utils/map-pin.svg" alt="map pin" />
          {t("contact.mapAddr")}
        </div>
      </div>
      <div className="contact-map">
        <Map lat={28.239334} lng={-16.840377} height="20rem" zoom={16} />
      </div>
      <img
        className="wawe"
        src="/general/vlnka-gray-white-nm.svg"
        alt="vlnka-gray-to-white"
      />
      <div className="contact white">
        <h2>{t("form.titleInq")}</h2>
        <h3 className="inq-subtitle">{t("form.subtitleInq")}</h3>
        <BaseForm from={3} what={3} />
      </div>
    </>
  );
}

export default Contact;
