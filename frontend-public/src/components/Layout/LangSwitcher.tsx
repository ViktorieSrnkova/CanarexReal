import { useLang } from "../../hooks/i18n/useLang";
import "../../styles/layout/langSwitcher.css";
function LangSwitcher() {
  const { lang, setLang } = useLang();
  const languages = [
    { code: "cs", flag: "/flags/cz.png", label: "Čeština" },
    { code: "en", flag: "/flags/en.png", label: "English" },
    { code: "sk", flag: "/flags/sk.png", label: "Slovenčina" },
  ] as const;
  return (
    <div className="lang-switch">
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => {
            setLang(l.code);
            window.location.reload();
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
