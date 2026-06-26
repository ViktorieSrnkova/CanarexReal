import { useNavigate } from "react-router-dom";
import "../../styles/layout/header.css";
import "../../styles/responsivity/resize.css";
import LangSwitcher from "./LangSwitcher";
import Phone from "../../assets/Phone.svg";
import Mail from "../../assets/Mail.svg";
import Facebook from "../../assets/Facebook.svg";
import Instagram from "../../assets/Instagram.svg";
import TikTok from "../../assets/Tiktok.svg";
import { useT } from "../../i18n";
import { useState } from "react";
import { useLang } from "../../hooks/i18n/useLang";
import Nav from "./Nav";
import CanarexReal from "../../assets/CanarexReal.svg";

function Header() {
  const t = useT();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang } = useLang();

  return (
    <header className="header">
      <div className="info-line">
        <div className="info-left">
          <div className="socials">
            <a href="https://www.facebook.com/CanarexReal" target="_blank">
              <img src={Facebook} alt="Facebook" />
            </a>
            <a
              href="https://www.instagram.com/canarexreal/?hl=en"
              target="_blank"
            >
              <img src={Instagram} alt="Instagram" />
            </a>
            <a
              href="https://www.tiktok.com/@canarexreal2?_t=ZN-8zTWsOtJa90&_r=1"
              target="_blank"
            >
              <img src={TikTok} alt="TikTok" />
            </a>
          </div>
          <span className="phone number">
            <img src={Phone} alt="phone" />
            +420 603 257 021
          </span>
          <a href="mailto:info@canarexreal.com" className="mail">
            <img src={Mail} alt="email" />
            stan@canarexreal.com
          </a>
        </div>
        <div className="info-right">
          <LangSwitcher />
        </div>
      </div>
      <div className="main-header-wrapper">
        <div className="main-header">
          <div className="logo" onClick={() => navigate(`/${lang}`)}>
            <img
              src={CanarexReal}
              alt="logo"
              width={197}
              fetchPriority="high"
            />
            {t("header.logo")}
          </div>
          <div
            className={`burger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((p) => !p)}
          >
            <span />
            <span />
            <span />
          </div>
          <nav className={`nav ${menuOpen ? "open" : ""}`}>
            <Nav onLinkClick={() => setMenuOpen(false)} />

            <div className="mobile-socials">
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
          </nav>
        </div>
      </div>
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}
    </header>
  );
}

export default Header;
