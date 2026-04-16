import type { RawListing } from "../types/api";
import type { ListingRow } from "../types/listings";

export function mapListing(raw: RawListing): ListingRow {
  const langSet = new Set(raw.inzeraty_preklady?.map((p) => p.jazyky_id) ?? []);

  const img = raw.obrazky?.[0];

  const imgLangSet = new Set(
    img?.obrazky_preklady?.map((p) => p.jazyky_id) ?? [],
  );

  return {
    id: raw.id,
    index: raw.index,
    cena_v_eur: raw.cena_v_eur,
    loznice: raw.loznice,
    koupelny: raw.koupelny,
    velikost: raw.velikost,
    reprezentativni: raw.reprezentativni,

    adresy: {
      lokace: raw.adresy?.lokace ?? null,
    },

    status: {
      id: raw.statusy.id,
      label: raw.statusy.statusy_preklady?.[0]?.nazev ?? null,
    },

    type: {
      id: raw.typy_nemovitosti.id,
      kod: raw.typy_nemovitosti.kod,
      label: raw.typy_nemovitosti.typy_nemovitosti_preklady?.[0]?.nazev ?? null,
    },

    pictograms: raw.inzeraty_piktogramy.map((p) => ({
      id: p.piktogramy.id,
      code: p.piktogramy.nazev,
      label: p.piktogramy.piktogramy_preklady?.[0]?.nazev ?? null,
    })),

    image: img
      ? {
          id: img.id,
          url: img.url,
          order: img.poradi ?? 0,
          hasAlt: {
            cs: imgLangSet.has(2),
            en: imgLangSet.has(1),
            sk: imgLangSet.has(3),
          },
        }
      : null,

    languages: {
      cs: langSet.has(2),
      en: langSet.has(1),
      sk: langSet.has(3),
    },
  };
}
