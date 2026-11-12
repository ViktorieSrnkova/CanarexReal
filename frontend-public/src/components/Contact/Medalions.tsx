import Medalion from "./Medalion";
import { formatPhoneNumber } from "../../utils/formatting";
import { useT } from "../../i18n";
import Stan from "/contact/stan.webp";
import Assistant from "/contact/assistant.jpeg";
import "../../styles/components/medalions.css";

const Medalions = () => {
  const t = useT();
  return (
    <section style={{ background: "var(--highlight)" }}>
      <div className="wrap">
        <p className="eyebrow">{t("contact.subtitle")}</p>
        <h2>{t("contact.title")}</h2>
        <div className="medalion-group">
          <Medalion
            name="Stan Srnka"
            role={t("contact.ceoRole")}
            phoneMain={formatPhoneNumber(t("contact.phoneCZ1"))}
            phoneSecondary={formatPhoneNumber(t("contact.phoneES"))}
            email="stan@canarexreal.com"
            alt="Stanislav Srnka"
            image={Stan}
            flagPath={["/flags/cz.svg", "/flags/es.svg"]}
            flagAlts={["cz flag", "es flag"]}
          />
          <Medalion
            name="Vladěna Dolejší"
            role={t("contact.assistRole")}
            phoneMain={formatPhoneNumber(t("contact.phoneCZ2"))}
            phoneSecondary={formatPhoneNumber(t("contact.phoneCZ2"))}
            email="vladena@canarexreal.com"
            alt="Vladěna Dolejší"
            image={Assistant}
            flagPath={["/flags/cz.svg", "/flags/cz.svg"]}
            flagAlts={["cz flag", "cz flag"]}
          />
        </div>
        <div className="contact-map-wrapper">
          <img src="/utils/map-pin.svg" alt="map pin" />
          {t("contact.mapAddr")}
        </div>
      </div>
    </section>
  );
};

export default Medalions;
