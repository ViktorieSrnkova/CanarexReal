import { useEffect, useState } from "react";
import type { FormDetail } from "../types/forms";
import { getUserForms } from "../api/forms";
import "../styles/pages/forms.css";
import { useT } from "../i18n";
import { PROPERTY_TYPE_LABELS } from "../types/general";
import Card from "../components/Listing/Card";
import type { ListingThumbnail } from "../types/rawApi";
import { useLang } from "../hooks/i18n/useLang";
import { LANGUAGE_TO_ID } from "../types/general";
import { getListingByThumb } from "../api/listings";

export default function UserFormsTable() {
  const [forms, setForms] = useState<FormDetail[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Record<number, ListingThumbnail>>(
    {},
  );
  const t = useT();

  const { lang } = useLang();
  const langId = LANGUAGE_TO_ID[lang];

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUserForms();
        setForms(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading)
    return (
      <div className="user-forms">
        <h1>Vyplněné formuláře</h1>
        <h4>{t("general.loading")}</h4>
      </div>
    );

  const toggleRow = async (form: FormDetail) => {
    const id = form.id;

    setExpandedId((prev) => (prev === id ? null : id));

    if (listings[id]) return;

    if (!form.index_inzeratu) return;

    try {
      const data = await getListingByThumb(
        { index: Number(form.index_inzeratu) },
        langId,
      );

      setListings((prev) => ({
        ...prev,
        [id]: data,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-forms">
      <h1>Vyplněné formuláře</h1>
      <table className="forms-table">
        <tbody>
          {forms.map((form) => {
            const isOpen = expandedId === form.id;
            const listing = listings[form.id];
            return (
              <>
                <tr
                  key={form.id}
                  onClick={() => toggleRow(form)}
                  style={{ cursor: "pointer" }}
                  className="form-row"
                >
                  <td style={{ color: "#87ceeb" }}>{isOpen ? "▼" : "▲"}</td>
                  <td>{form.typy_formulare?.nazev.toLocaleUpperCase()}</td>
                  <td className="number">
                    {new Date(form.datum_vytvoreni).toLocaleDateString()}
                  </td>

                  <td>{form.email}</td>
                </tr>

                {isOpen && (
                  <tr className="form-expanded">
                    <td colSpan={5}>
                      <div className="expanded-content">
                        <h3>Detail formuláře:</h3>
                        <p>
                          <strong>Jméno a příjmení:</strong> {form.jmeno}{" "}
                          {form.prijmeni}
                        </p>
                        <p>
                          <strong>Email:</strong> {form.email}{" "}
                        </p>
                        <p className="number">
                          <strong>Telefon:</strong> {form.telefon}{" "}
                        </p>
                        {form.typy_formulare?.id === 3 && (
                          <>
                            <p className="number">
                              <strong>Rozpočet:</strong> {form.rozpocet_od} -{" "}
                              {form.rozpocet_do} €
                            </p>

                            <p className="number">
                              <strong>Velikost:</strong> {form.velikost_od} -{" "}
                              {form.velikost_do} m²
                            </p>

                            <p className="number">
                              <strong>Počet ložnic:</strong>{" "}
                              {form.pocet_loznic?.join(", ") ?? "-"}
                            </p>

                            <p className="number">
                              <strong>Počet koupelen:</strong>{" "}
                              {form.pocet_koupelen?.join(", ") ?? "-"}
                            </p>
                            <p className="number">
                              <strong>Datum příletu:</strong>{" "}
                              {form.vi_prilet ? form.prilet : "Nevím"}
                            </p>

                            <p>
                              <strong>Typ nemovitosti:</strong>{" "}
                              {form.formulare_typy_nemovitosti?.length
                                ? form.formulare_typy_nemovitosti
                                    .map(
                                      (x) =>
                                        PROPERTY_TYPE_LABELS[
                                          x.typy_nemovitosti.id
                                        ],
                                    )
                                    .join(", ")
                                : "-"}
                            </p>
                          </>
                        )}

                        {form.typy_formulare?.id === 2 && listing && (
                          <>
                            <Card
                              id={listing.id}
                              titulek={
                                listing.inzeraty_preklady[0]?.titulek ?? ""
                              }
                              lokace={listing.adresy?.lokace ?? ""}
                              typ={
                                listing.typy_nemovitosti
                                  ?.typy_nemovitosti_preklady[0]?.nazev ?? ""
                              }
                              status={
                                listing.statusy?.statusy_preklady[0]?.nazev ??
                                ""
                              }
                              cena_v_eur={listing.cena_v_eur}
                              loznice={listing.loznice}
                              koupelny={listing.koupelny}
                              velikost={listing.velikost}
                              obrazekId={listing.obrazky[0]?.id ?? 0}
                              alt={
                                listing.obrazky[0]?.obrazky_preklady[0]
                                  ?.alt_text ?? ""
                              }
                              status_id={listing.statusy_id}
                              inForms
                            />
                          </>
                        )}

                        <p>
                          <strong>Text zprávy:</strong>{" "}
                          {form.text_zpravy || "-"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
