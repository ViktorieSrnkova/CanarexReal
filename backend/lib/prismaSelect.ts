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

    // 🔹 překlady samotného inzerátu
    inzeraty_preklady: {
      where: { jazyky_id: userLangId },
      select: {
        titulek: true,
        popis: true,
        detaily: true,
      },
    },

    // 🔹 adresa + stát ve správném jazyce
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

    // 🔹 status ve správném jazyce
    statusy: {
      select: {
        kod: true,
        statusy_preklady: {
          where: { jazyky_id: userLangId },
          select: { nazev: true },
        },
      },
    },

    // 🔹 typ nemovitosti ve správném jazyce
    typy_nemovitosti: {
      select: {
        kod: true,
        typy_nemovitosti_preklady: {
          where: { jazyky_id: userLangId },
          select: { nazev: true },
        },
      },
    },

    // 🔹 všechny obrázky + alt text ve správném jazyce
    obrazky: {
      orderBy: { poradi: "asc" as const },
      select: {
        id: true,
        url: true,
        poradi: true,
        obrazky_preklady: {
          where: { jazyky_id: userLangId },
          select: { alt_text: true },
        },
      },
    },

    // 🔹 všechny piktogramy + jejich překlady
    inzeraty_piktogramy: {
      select: {
        piktogramy: {
          select: {
            id: true,
            nazev: true,
            obrazky: {
              select: { url: true },
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
