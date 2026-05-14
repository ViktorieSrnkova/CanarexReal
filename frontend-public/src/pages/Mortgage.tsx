import ContactForm from "../components/Forms/BaseForm";
import SEO from "../components/SEO/Meta";
import { useT } from "../i18n";
import "../styles/pages/mortgage.css";

function Mortgage() {
  const t = useT();
  const rows = t<string[][]>("mortgage.mortgageTable");
  return (
    <>
      <SEO
        title={t("SEO.Mortgage_title")}
        description={t("SEO.Mortgage_description")}
        noindex
      />
      <div className="description-wrapper faq mortgage">
        <h1>{t("mortgage.title")}</h1>
        <h2>{t("mortgage.subtitle1")}</h2>
        <ul>
          <li>{t("mortgage.li_1it_1")}</li>
          <li>{t("mortgage.li_1it_2")}</li>
          <li>{t("mortgage.li_1it_3")}</li>
        </ul>
        <h2>{t("mortgage.subtitle2")}</h2>
        <ul>
          <li>{t("mortgage.li_2it_1")}</li>
          <li>{t("mortgage.li_2it_2")}</li>
          <li>{t("mortgage.li_2it_3")}</li>
        </ul>
        <h2>{t("mortgage.subtitle3")}</h2>

        <table>
          <tbody>
            {rows.map((row: string[], i: number) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <h2>{t("mortgage.subtitle4")}</h2>
        <ul>
          <li>{t("mortgage.li_3it_1")}</li>
          <li>{t("mortgage.li_3it_2")}</li>
        </ul>
        <h2>{t("mortgage.subtitle5")}</h2>
        <p>{t("mortgage.p1")}</p>
        <h2>{t("mortgage.subtitle6")}</h2>
        <p>{t("mortgage.p2")}</p>
        <h2>{t("mortgage.subtitle7")}</h2>
      </div>

      <div className="contact white mortgage">
        <h2 className="form-title-mortgage">{t("mortgage.formTitle")}</h2>
        <ContactForm from={2} what={1} />
      </div>
    </>
  );
}

export default Mortgage;
