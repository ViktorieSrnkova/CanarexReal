import { lazy, Suspense } from "react";
import Medalion from "../components/Contact/Medalion";
const Map = lazy(() => import("../components/General/Map"));
import BaseForm from "../components/Forms/BaseForm";
import { useT } from "../i18n";
import "../styles/pages/contact.css";
import SEO from "../components/SEO/Meta";
import { formatPhoneNumber } from "../utils/formatting";
import Stan from "/contact/stan.webp";
import Assistant from "/contact/assistant.jpeg";
import useImagePreloader from "../hooks/useImagePreloader";
import { LoaderIcon } from "react-hot-toast";

const preloadSrcList: string[] = [Stan, Assistant];

function Contact() {
  useImagePreloader(preloadSrcList);

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
            telephone: formatPhoneNumber(t("contact.phoneCZ1")),
          },
        }}
      />
      <div className="contact-medalions contact white">
        <h1>{t("contact.title")}</h1>
        <h3 className="padded-subtitle">{t("contact.subtitle")}</h3>
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
      <div className="contact-map">
        <Suspense
          fallback={
            <div className="map-loader">
              <LoaderIcon />
            </div>
          }
        >
          <Map
            lat={28.239334}
            lng={-16.840377}
            height="20rem"
            zoom={16}
            contact={true}
          />
        </Suspense>
      </div>
      <div className="contact white">
        <h2>{t("form.titleInq")}</h2>
        <h3 className="inq-subtitle">{t("form.subtitleInq")}</h3>
        <BaseForm from={3} what={3} />
      </div>
    </>
  );
}

export default Contact;
