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
      select: { url: true },
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
