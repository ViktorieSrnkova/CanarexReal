import { useEffect, useState } from "react";
import Phone from "../../assets/Phone.svg";
import Mail from "../../assets/Mail.svg";
import Whatsapp from "../../assets/Whatsapp.svg";
import "../../styles/responsivity/resize.css";

export default function FloatingMobileActions() {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="fab-right">
        {open && (
          <div className="fab-menu">
            <a href="tel:+420603257021" className="fab-item">
              <img
                src={Phone}
                alt="call"
                height={32}
                width={32}
                loading="lazy"
              />
            </a>

            <a href="https://wa.me/34604198470" className="fab-item">
              <img
                src={Whatsapp}
                alt="whatsapp"
                height={32}
                width={32}
                loading="lazy"
              />
            </a>

            <a href="mailto:info@canarexreal.com" className="fab-item">
              <img
                src={Mail}
                alt="mail"
                height={32}
                width={32}
                loading="lazy"
              />
            </a>
          </div>
        )}
        <button className="fab-main" onClick={() => setOpen((p) => !p)}>
          •••
        </button>
      </div>

      {showTop && (
        <button className="fab-top" onClick={scrollTop}>
          ↑
        </button>
      )}
    </>
  );
}
