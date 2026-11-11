import { useT } from "../../i18n";
import "../../styles/components/trust.css";
function Trust() {
  const t = useT();
  const sections = t<{ title: string; subtitle: string }[]>("homepage.trust");
  return (
    <section className="trust-section" id="trust">
      <div className="trust">
        {sections.map((section, index) => (
          <p key={index} className="section-content">
            <strong>{section.title}</strong>
            <span>{section.subtitle}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

export default Trust;
