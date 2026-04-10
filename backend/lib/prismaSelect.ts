export function listingThumbnailSelect(userLangId: number = 2) {
  return {
    id: true,
    index: true,
    cena_v_eur: true,
    loznice: true,
    koupelny: true,
    velikost: true,
    obrazky: {
      where: { poradi: 1 },
      select: { id: true },
    },
    statusy: {
      select: {
        statusy_preklady: {
          where: { jazyky_id: userLangId },
          select: { nazev: true },
        },
      },
    },
    typy_nemovitosti: {
      select: {
        typy_nemovitosti_preklady: {
          where: { jazyky_id: userLangId },
          select: { nazev: true },
        },
      },
    },
    adresy: {
      select: { lokace: true, mesto: true },
    },
    inzeraty_preklady: {
      where: { jazyky_id: userLangId },
      select: { titulek: true },
    },
  };
}

export function listingDetailSelect(userLangId: number = 2) {
  return {
    id: true,
    index: true,
    cena_v_eur: true,
    loznice: true,
    koupelny: true,
    velikost: true,
    reprezentativni: true,
    datum_vytvoreni: true,

    inzeraty_preklady: {
      where: { jazyky_id: userLangId },
      select: {
        titulek: true,
        popis: true,
        detaily: true,
      },
    },

    adresy: {
      select: {
        ulice: true,
        cislo_popisne: true,
        lokace: true,
        mesto: true,
        lat: true,
        lng: true,
        staty: {
          select: {
            stat_preklady: {
              where: { jazyky_id: userLangId },
              select: {
                nazev: true,
              },
              take: 1,
            },
          },
        },
      },
    },

    statusy: {
      select: {
        kod: true,
        statusy_preklady: {
          where: { jazyky_id: userLangId },
          select: { nazev: true },
        },
      },
    },

    typy_nemovitosti: {
      select: {
        kod: true,
        typy_nemovitosti_preklady: {
          where: { jazyky_id: userLangId },
          select: { nazev: true },
        },
      },
    },

    obrazky: {
      orderBy: { poradi: "asc" as const },
      select: {
        id: true,
        poradi: true,
        obrazky_preklady: {
          where: { jazyky_id: userLangId },
          select: { alt_text: true },
        },
      },
    },

    inzeraty_piktogramy: {
      select: {
        piktogramy: {
          select: {
            id: true,
            nazev: true,
            obrazky: {
              select: { id: true },
            },
            piktogramy_preklady: {
              where: { jazyky_id: userLangId },
              select: { nazev: true },
            },
          },
        },
      },
    },
  };
}
