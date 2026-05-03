import { useLang } from "../../hooks/i18n/useLang";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/layout/langSwitcher.css";

function LangSwitcher() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  const languages = [
    { code: "cs", flag: "/flags/cz.png", label: "Čeština" },
    { code: "en", flag: "/flags/en.png", label: "English" },
    { code: "sk", flag: "/flags/sk.png", label: "Slovenčina" },
  ] as const;

  const pathWithoutLang = location.pathname.replace(/^\/(cs|en|sk)/, "");

  return (
    <div className="lang-switch">
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => {
            navigate(`/${l.code}${pathWithoutLang}`);
          }}
          className={`lang-btn ${lang === l.code ? "active" : ""}`}
          title={l.label}
        >
          <img src={l.flag} alt={l.label} />
        </button>
      ))}
    </div>
  );
}

export default LangSwitcher;
