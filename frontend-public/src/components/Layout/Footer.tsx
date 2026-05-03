import React from "react";
import "../../styles/layout/footer.css";
import { Link } from "react-router-dom";
import { useT } from "../../i18n";
import ContactForm from "../Forms/BaseForm";
import Phone from "../../assets/Phone.svg";
import Mail from "../../assets/Mail.svg";
import "../../styles/responsivity/resize.css";
import { useLang } from "../../hooks/i18n/useLang";

const Footer: React.FC = () => {
  const t = useT();
  const { lang } = useLang();
  return (
    <>
      <img
        className="wawe mobile"
        src="/general/small-vlnka-white-gray.svg"
        alt="vlnka-white-to-gray"
      />
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
                <img src="/socials/Facebook.svg" alt="Facebook" />
              </a>
              <a
                href="https://www.instagram.com/canarexreal/?hl=en"
                target="_blank"
              >
                <img src="/socials/Instagram.svg" alt="Instagram" />
              </a>
              <a
                href="https://www.tiktok.com/@canarexreal2?_t=ZN-8zTWsOtJa90&_r=1"
                target="_blank"
              >
                <img src="/socials/TikTok.svg" alt="TikTok" />
              </a>
            </div>
            <h2 className="contacts-h2">{t("footer.contactsTitle")}</h2>
            <div className="contacts">
              <div className="phone">
                <img src="/flags/cz.png" alt="cz flag" />
                <img src={Phone} alt="phone" height={16} />
                <p className="number">+420 603 257 021</p>
              </div>
              <div className="phone">
                <img src="/flags/sk.png" alt="sk flag" />
                <img src={Phone} alt="phoneSK" height={16} />
                <p className="number">+421 919 490 980</p>
              </div>

              <div className="phone">
                <img src="/flags/es.png" alt="es flag" />
                <img src={Phone} alt="phoneES" height={16} />
                <p className="number">+34 604 198 470</p>
              </div>
              <div className="mail">
                <img src={Mail} alt="email" height={14} />
                <a href={`mailto:${t("contact.email")}`} className="number">
                  {t("contact.email")}
                </a>
              </div>
            </div>
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
