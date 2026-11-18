import "../styles/pages/homePage.css";
import { useT } from "../i18n";
import SEO from "../components/SEO/Meta";
import Reviews from "../components/Reviews/Reviews";
import Trust from "../components/HomePage/Trust";
import ContactOverview from "../components/HomePage/ContactOverview";
import ServicesOverview from "../components/HomePage/ServicesOverview";
import Hero from "../components/HomePage/Hero";
import RegisterWithUs from "../components/HomePage/RegisterWithUs";

function HomePage() {
  const t = useT();

  return (
    <>
      <SEO
        title={t("SEO.HP_title")}
        description={t("SEO.HP_description")}
        schema={{
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "CanarexReal",
          areaServed: {
            "@type": "Place",
            name: "Tenerife, Spain",
          },
          url: "https://canarex-real-public.vercel.app",
        }}
      />
      <Hero />
      <Trust />
      <ServicesOverview />
      <section className="hp-reviews gray">
        <div className="wrap">
          <Reviews />
        </div>
      </section>
      <RegisterWithUs />

      <ContactOverview />
    </>
  );
}

export default HomePage;
