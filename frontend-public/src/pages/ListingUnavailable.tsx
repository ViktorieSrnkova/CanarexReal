import { useNavigate } from "react-router-dom";
//import { useLang } from "../hooks/i18n/useLang";
//import { useT } from "../i18n";
import Button from "../components/General/Button";

export function ListingUnavailable() {
  //const { lang } = useLang();
  //const t = useT();
  const navigate = useNavigate();

  return (
    <div className="unavailable">
      <h1>{/* {t("listing.notAvailableTitle")} */}404 není překlad</h1>

      <p>
        {/* {t("listing.notAvailableText")} */} tenhle inzerát nemáme ve vaší
        zvolené jazykové verzi, avšak níže můžete vidět podobné nemovitosti nebo
        se přesunout na stránku s inzeráy
      </p>

      <Button onClick={() => navigate("/listings")}>
        {/* {t("listing.backToListings")} */} Zpět na inzeráty
      </Button>

      <h3>{/* {t("listing.suggested")} */} Podobné inzeráty</h3>

      {/* sem můžeš dát mini grid similar listings */}
    </div>
  );
}
