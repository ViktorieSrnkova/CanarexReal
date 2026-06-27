import { useEffect, useState } from "react";
import type { FormDetail } from "../types/forms";
import { getUserForms } from "../api/forms";
import "../styles/pages/forms.css";
import { useT } from "../i18n";
import { FORM_TYPE_LABELS, PROPERTY_TYPE_LABELS } from "../types/general";
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
  const [listings, setListings] = useState<Record<string, ListingThumbnail>>(
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
  useEffect(() => {
    if (expandedId == null) return;

    const form = forms.find((f) => f.id === expandedId);
    if (!form?.index_inzeratu) return;

    const key = `${expandedId}-${langId}`;

    if (listings[key]) return;

    const loadListing = async () => {
      try {
        const data = await getListingByThumb(
          { index: Number(form.index_inzeratu) },
          langId,
        );

        setListings((prev) => ({
          ...prev,
          [key]: data,
        }));
      } catch (err) {
        console.error(err);
      }
    };

    loadListing();
  }, [expandedId, forms, langId, listings]);
  if (loading)
    return (
      <div className="user-forms">
        <h1>{t("userForms.title")}</h1>
        <h4>{t("general.loading")}</h4>
      </div>
    );

  const toggleRow = (form: FormDetail) => {
    setExpandedId((prev) => (prev === form.id ? null : form.id));
  };

  return (
    <div className="user-forms">
      <h1>{t("userForms.title")}</h1>
      <table className="forms-table">
        <tbody>
          {forms.map((form) => {
            const isOpen = expandedId === form.id;
            const listing = listings[`${form.id}-${langId}`];
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
                  <td>
                    {FORM_TYPE_LABELS[form.typy_formulare?.id ?? 0]?.[langId] ??
                      ""}
                  </td>
                  <td className="number" style={{ minWidth: "97px" }}>
                    {new Date(form.datum_vytvoreni).toLocaleDateString()}
                  </td>
                  <td className="email-cell">{form.email}</td>
                </tr>

                {isOpen && (
                  <tr className="form-expanded">
                    <td colSpan={5}>
                      <div className="expanded-content">
                        <h3>{t("userForms.subtitle")}</h3>
                        <div className="form-basic-info">
                          <p>
                            <strong>{t("userForms.fullName")} </strong>
                            <span>
                              {form.jmeno} {form.prijmeni}
                            </span>
                          </p>

                          <p>
                            <strong>{t("userForms.email")} </strong>
                            <span>{form.email}</span>
                          </p>

                          <p>
                            <strong>{t("userForms.phone")} </strong>
                            <span className="number">{form.telefon}</span>
                          </p>
                        </div>
                        {form.typy_formulare?.id === 3 && (
                          <div className="wrap-table">
                            <div className="cell number">
                              <strong>{t("userForms.price")}</strong>{" "}
                              {form.rozpocet_od} - {form.rozpocet_do} €
                            </div>

                            <div className="cell number">
                              <strong>{t("userForms.size")}</strong>{" "}
                              {form.velikost_od} - {form.velikost_do} m²
                            </div>

                            <div className="cell number">
                              <strong>{t("userForms.bedrooms")}</strong>{" "}
                              {form.pocet_loznic?.join(", ") ?? "-"}
                            </div>

                            <div className="cell number">
                              <strong>{t("userForms.bathrooms")}</strong>{" "}
                              {form.pocet_koupelen?.join(", ") ?? "-"}
                            </div>

                            <div className="cell number">
                              <strong>{t("userForms.arrival")}</strong>{" "}
                              {form.vi_prilet
                                ? form.prilet
                                : t("userForms.unsure")}
                            </div>

                            <div className="cell">
                              <strong>{t("userForms.type")}</strong>
                              {form.formulare_typy_nemovitosti?.length
                                ? form.formulare_typy_nemovitosti
                                    .map(
                                      (x) =>
                                        PROPERTY_TYPE_LABELS[
                                          x.typy_nemovitosti.id
                                        ]?.[langId] ?? "-",
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
                                <strong>{t("userForms.text")}</strong>{" "}
                              </p>
                              <p className="mt0"> {form.text_zpravy || "-"}</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="mb0 mt0">
                              <strong>{t("userForms.text")}</strong>{" "}
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
