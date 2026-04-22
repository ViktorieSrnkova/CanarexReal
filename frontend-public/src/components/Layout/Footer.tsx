import React from "react";
import { Link } from "react-router-dom";
import { useT } from "../../i18n";
import ContactForm from "../Forms/BaseForm";

import Phone from "../../assets/Phone.svg";
import Mail from "../../assets/Mail.svg";
import "../../styles/layout/footer.css";

const Footer: React.FC = () => {
  const t = useT();

  return (
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
          <h2>{t("footer.contactsTitle")}</h2>
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

        {/*  <div className="mobile">
          <div className="ikonky">
            <a
              href="https://www.facebook.com/CanarexReal"
              target="_blank"
              rel="noreferrer noopener"
            >
              <img
                src="/assets/images/facebookF.svg"
                alt="facebook"
                height={20}
              />
            </a>

            <a
              href="https://www.instagram.com/canarexreal/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <img
                src="/assets/images/instagramF.svg"
                alt="instagram"
                height={20}
              />
            </a>
          </div>

          <hr className="line" />

          <a href="https://canarexreal-rentals.lodgify.com/">
            {t("footer.privacy")}
          </a>

          <p>© 2020-2025 CanarexReal</p>
        </div>
         <div className="fixed-container">
          <div className="mobile-fixed">
            <img src="/assets/images/standa(1).png" alt="standa" height={40} />

            <div className="vert-line" />

            <div className="spacer" />

            <a href="tel:+420603257021" className="phone-link">
              <img src="/assets/images/phoneO.svg" alt="phone" height={24} />
            </a>

            <a
              href="https://wa.me/+34604198470"
              target="_blank"
              className="phone-link pl10"
              rel="noreferrer"
            >
              <img
                src="/assets/images/WhatsApp.svg"
                alt="whatsapp"
                height={24}
              />
            </a>

            <a href={`mailto:${t("footer.email")}`} className="fixed-phone">
              <img
                src="/assets/images/email-mobile.svg"
                alt="email"
                height={30}
              />
            </a>
          </div>
        </div> */}
      </div>

      <div className="bottom-info">
        <p>{t("footer.copyright")}</p>
        <hr className="vert-line" />
        <Link to="/gdpr">{t("footer.privacy")}</Link>
      </div>
    </footer>
  );
};

export default Footer;
