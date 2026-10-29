import React from "react";
import "../../styles/layout/footer.css";
import { Link } from "react-router-dom";
import { useT } from "../../i18n";
import ContactForm from "../Forms/BaseForm";
import Phone from "../../assets/Phone.svg";
import Mail from "../../assets/Mail.svg";
import Whatsapp from "../../assets/Whatsapp.svg";
import "../../styles/responsivity/resize.css";
import { useLang } from "../../hooks/i18n/useLang";
import { formatPhoneNumber } from "../../utils/formatting";
import Wave from "../../components/General/Wave";

const Footer: React.FC = () => {
  const t = useT();
  const { lang } = useLang();
  return (
    <>
      <Wave variant="small-white-gray" className="wawe mobile" />
      <footer className="vert-f">
        <div className="actual-footer">
          <div className="start-footer">
            <h2>{t("footer.formTitle")}</h2>
            <ContactForm from={5} what={1} />
          </div>

          <div className="middle-footer">
            <h2>{t("footer.followUs")}</h2>

            <div className="icons">
              <a href="https://www.facebook.com/CanarexReal" target="_blank">
                <img
                  src="/socials/Facebook.svg"
                  alt="Facebook"
                  loading="lazy"
                />
              </a>
              <a
                href="https://www.instagram.com/canarexreal/?hl=en"
                target="_blank"
              >
                <img
                  src="/socials/Instagram.svg"
                  alt="Instagram"
                  loading="lazy"
                />
              </a>
              <a
                href="https://www.tiktok.com/@canarexreal2?_t=ZN-8zTWsOtJa90&_r=1"
                target="_blank"
              >
                <img src="/socials/TikTok.svg" alt="TikTok" loading="lazy" />
              </a>
            </div>
            <h2 className="contacts-h2">{t("footer.contactsTitle")}</h2>
            <div className="contacts">
              <h4 className="name-title-footer">Stan Srnka</h4>
              <div className="phone">
                <img src="/flags/cz.svg" alt="cz flag" loading="lazy" />
                <img src={Phone} alt="phone" height={18} loading="lazy" />
                <p className="number">
                  {formatPhoneNumber(t("contact.phoneCZ1"))}
                </p>
              </div>

              <div className="phone">
                <img src="/flags/es.svg" alt="es flag" loading="lazy" />
                <img src={Whatsapp} alt="phoneES" height={18} loading="lazy" />
                <p className="number">
                  {formatPhoneNumber(t("contact.phoneES"))}
                </p>
              </div>
              <div className="mail">
                <img src={Mail} alt="email" height="16" loading="lazy" />
                <a href={`mailto:${t("contact.email")}`} className="number">
                  {t("contact.email")}
                </a>
              </div>
              <br className="gap-br"></br>

              <h4 className="name-title-footer">Vladěna Dolejší</h4>
              <div className="phone">
                <img src="/flags/cz.svg" alt="cz-vladka flag" loading="lazy" />
                <img src={Phone} alt="phone" height={18} loading="lazy" />
                <p className="number">
                  {" "}
                  {formatPhoneNumber(t("contact.phoneCZ2"))}
                </p>
              </div>
              <div className="phone">
                <img src="/flags/cz.svg" alt="cz-vladka flag" loading="lazy" />
                <img src={Whatsapp} alt="phone" height={18} loading="lazy" />
                <p className="number">
                  {" "}
                  {formatPhoneNumber(t("contact.phoneCZ2"))}
                </p>
              </div>
              <div className="mail">
                <img src={Mail} alt="email-vladka" height="16" loading="lazy" />
                <a href={`mailto:${t("contact.email2")}`} className="number">
                  {t("contact.email2")}
                </a>
              </div>
            </div>
            <br className="gap-br"></br>

            <Link to={`/${lang}/faq`} className="faq-link">
              <h2> {t("footer.faq")}</h2>
            </Link>
          </div>
        </div>

        <div className="bottom-info">
          <p>{t("footer.copyright")}</p>
          <hr className="vert-line" />
          <Link to={`/${lang}/gdpr`}>{t("footer.privacy")}</Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;
