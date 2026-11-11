import React from "react";
import "../../styles/layout/footer.css";
import { Link } from "react-router-dom";
import { useT } from "../../i18n";
import { useLang } from "../../hooks/i18n/useLang";

const Footer: React.FC = () => {
  const t = useT();
  const { lang } = useLang();
  return (
    <>
      <footer className="footer">
        <div className="wrap">
          <div className="sec">
            <p>{t("footer.copyright")}</p>

            <hr className="vert-line pc" />
            <Link to={`/${lang}/gdpr`}>{t("footer.privacy")}</Link>
          </div>
          <div className="sec pc">
            <Link to={`/${lang}/faq`} className="faq-link pc">
              {t("footer.faq")}
            </Link>
            <hr className="vert-line pc" />
            <Link to={`/${lang}/contact`} className="pc">
              {t("footer.contactsTitle")}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
