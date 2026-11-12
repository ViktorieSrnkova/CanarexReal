import { lazy, Suspense } from "react";
const Map = lazy(() => import("../components/General/Map"));
import { useT } from "../i18n";
import "../styles/pages/contact.css";
import SEO from "../components/SEO/Meta";
import { formatPhoneNumber } from "../utils/formatting";
import Socials from "../components/Contact/Socials";
import Medalions from "../components/Contact/Medalions";
import FormSection from "../components/Forms/FormSection";

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
            telephone: formatPhoneNumber(t("contact.phoneCZ1")),
          },
        }}
      />
      <FormSection />
      <div className="contact-map pc">
        <Suspense
          fallback={
            <div className="map-loader">
              <span className="spinner" />
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

      <Medalions />
      <div className="contact-map mobile">
        <Suspense
          fallback={
            <div className="map-loader">
              <span className="spinner" />
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
      <Socials />
    </>
  );
}

export default Contact;
