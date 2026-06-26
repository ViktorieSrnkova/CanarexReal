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
import React from "react";

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
              <React.Fragment key={form.id}>
                <tr
                  key={form.id}
                  onClick={() => toggleRow(form)}
                  style={{ cursor: "pointer" }}
                  className="form-row"
                >
                  <td style={{ color: "#87ceeb", paddingRight: "0" }}>
                    {isOpen ? "▼" : "▲"}
                  </td>
                  <td>{form.typy_formulare?.nazev.toLocaleUpperCase()}</td>
                  <td className="number" style={{ minWidth: "97px" }}>
                    {new Date(form.datum_vytvoreni).toLocaleDateString()}
                  </td>

                  <td className="email-cell">{form.email}</td>
                </tr>

                {isOpen && (
                  <tr className="form-expanded">
                    <td colSpan={5}>
                      <div className="expanded-content">
                        <h3>Detail formuláře:</h3>
                        <div className="form-basic-info">
                          <p>
                            <strong>Jméno a příjmení:</strong>
                            <span>
                              {form.jmeno} {form.prijmeni}
                            </span>
                          </p>

                          <p>
                            <strong>Email:</strong>
                            <span>{form.email}</span>
                          </p>

                          <p>
                            <strong>Telefon:</strong>
                            <span className="number">{form.telefon}</span>
                          </p>
                        </div>
                        {form.typy_formulare?.id === 3 && (
                          <div className="wrap-table">
                            <div className="cell number">
                              <strong>Rozpočet:</strong> {form.rozpocet_od} -{" "}
                              {form.rozpocet_do} €
                            </div>

                            <div className="cell number">
                              <strong>Velikost:</strong> {form.velikost_od} -{" "}
                              {form.velikost_do} m²
                            </div>

                            <div className="cell number">
                              <strong>Ložnice:</strong>{" "}
                              {form.pocet_loznic?.join(", ") ?? "-"}
                            </div>

                            <div className="cell number">
                              <strong>Koupelny:</strong>{" "}
                              {form.pocet_koupelen?.join(", ") ?? "-"}
                            </div>

                            <div className="cell number">
                              <strong>Přílet:</strong>{" "}
                              {form.vi_prilet ? form.prilet : "Nevím"}
                            </div>

                            <div className="cell">
                              <strong>Typ:</strong>
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
                            </div>
                          </div>
                        )}
                        {form.typy_formulare?.id === 2 && listing ? (
                          <div className="form-listing-row">
                            <div className="form-card">
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
                            </div>
                            <div className="form-text">
                              <p className="mb0 mt0">
                                <strong>Text zprávy:</strong>{" "}
                              </p>
                              <p className="mt0"> {form.text_zpravy || "-"}</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="mb0 mt0">
                              <strong>Text zprávy:</strong>{" "}
                            </p>
                            <p className="mt0"> {form.text_zpravy || "-"}</p>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
