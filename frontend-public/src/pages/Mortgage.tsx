import ContactForm from "../components/Forms/BaseForm";
import SEO from "../components/SEO/Meta";
import { useT } from "../i18n";
import "../styles/pages/mortgage.css";

function Mortgage() {
  const t = useT();

  const sections = t<{ title: string; items: string[] }[]>("mortgage.sections");

  const rows = t<string[][]>("mortgage.mortgageTable");

  return (
    <>
      <SEO
        title={t("SEO.Mortgage_title")}
        description={t("SEO.Mortgage_description")}
        noindex
      />

      <div className="mortgage">
        <h1>{t("mortgage.title")}</h1>

        {sections.slice(0, 2).map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}

        <h2>{t("mortgage.subtitle3")}</h2>

        <table>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {sections.slice(2).map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}

        <h2>{t("mortgage.subtitle5")}</h2>
        <p>{t("mortgage.p1")}</p>

        <h2>{t("mortgage.subtitle6")}</h2>
        <p>{t("mortgage.p2")}</p>

        <h2>{t("mortgage.subtitle7")}</h2>
      </div>

      <div className="contactssss white mortgage">
        <h2 className="form-title-mortgage">{t("mortgage.formTitle")}</h2>
        <ContactForm from={2} what={1} />
      </div>
    </>
  );
}

export default Mortgage;
