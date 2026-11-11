import { useT } from "../../i18n";
import "../../styles/contact/socials.css";

const Socials = () => {
  const t = useT();
  return (
    <section className="socials-section gray">
      <div className="wrap">
        <h2>{t("footer.followUs")}</h2>

        <div className="icons">
          <div className="rect">
            <a href="https://www.facebook.com/CanarexReal" target="_blank">
              <img src="/socials/Facebook.svg" alt="Facebook" loading="lazy" />{" "}
              <span className="pc">Facebook</span>
            </a>
          </div>
          <div className="rect">
            <a
              href="https://www.instagram.com/canarexreal/?hl=en"
              target="_blank"
            >
              <img
                src="/socials/Instagram.svg"
                alt="Instagram"
                loading="lazy"
              />{" "}
              <span className="pc">Instagram</span>
            </a>
          </div>
          <div className="rect">
            <a
              href="https://www.tiktok.com/@canarexreal2?_t=ZN-8zTWsOtJa90&_r=1"
              target="_blank"
            >
              <img src="/socials/TikTok.svg" alt="TikTok" loading="lazy" />{" "}
              <span className="pc">TikTok</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Socials;
