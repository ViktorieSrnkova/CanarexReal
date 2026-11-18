import { useT } from "../../i18n";
import Button from "../General/Button";
import "../../styles/components/register-with-us.css";
import { useEffect, useState } from "react";
import AuthModal from "../Login/AuthModal";

const RegisterWithUs = () => {
  const t = useT();
  const sections = t<
    {
      eyebrow: string;
      title: string;
      p: string;
    }[]
  >("homepage.registerWithUs.sections");
  const [authMode, setAuthMode] = useState<"register" | null>(null);
  useEffect(() => {
    const handler = () => setAuthMode("register");

    window.addEventListener("open-register", handler);
    return () => window.removeEventListener("open-register", handler);
  }, []);
  return (
    <section className="white reg">
      <div className="wrap">
        <div className="reg-section-head">
          <div className="reg-head-wrapper">
            <p className="eyebrow">{t("homepage.registerWithUs.eyebrow")}</p>
            <h2>{t("homepage.registerWithUs.title")}</h2>
            <p>{t("homepage.registerWithUs.subtext")}</p>
          </div>
          <Button
            onClick={() => {
              setAuthMode("register");
            }}
          >
            {t("homepage.registerWithUs.button")}
          </Button>
        </div>
        <div className="reg-cards">
          {sections.map((section, index) => (
            <article className="reg-card" key={index}>
              <div className="reg-container">
                <span className="reg-num">{section.eyebrow}</span>
                <h3>{section.title}</h3>
                <p>{section.p}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      {authMode && (
        <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />
      )}{" "}
    </section>
  );
};

export default RegisterWithUs;
/* registerWithUs: {
  eyebrow: "VÁŠ OSOBNÝ PRIESTOR NA CANAREXREAL",
  title: "Majte svoje hľadanie pod kontrolou.",
  subtext:
    "Vytvorte si vlastný profil a uľahčite si cestu k novej nehnuteľnosti. Všetko dôležité budete mať prehľadne na jednom mieste.",
  sections: [
    {
      eyebrow: "01 / OBĽÚBENÉ",
      title: "Nehnuteľnosti, ktoré vás zaujali",
      p: "Ukladajte si vybrané ponuky a kedykoľvek sa k nim vráťte.",
    },
    {
      eyebrow: "02 / KOMUNIKÁCIA",
      title: "Vaše dopyty na jednom mieste",
      p: "Prezerajte si prehľad odoslaných formulárov a predchádzajúcich otázok.",
    },
    {
      eyebrow: "03 / POHODLIE",
      title: "Menej vypĺňania, viac času",
      p: "Uložte si svoje údaje a využívajte ich automatické predvyplnenie vo formulároch.",
    },
    {
      eyebrow: "04 / NOVÉ PONUKY",
      title: "Novinky podľa vašich predstáv",
      p: "Nastavte si odber nových nehnuteľností a majte prehľad o aktuálnych ponukách.",
    },
  ],
  motivation: "Vytvorte si svoj bezplatný profil.",
  button: "Zaregistrovať sa →",
}, */
