export function listingThumbnailSelect(langId: number = 2) {
  return {
    id: true,
    index: true,
    cena_v_eur: true,
    loznice: true,
    koupelny: true,
    velikost: true,
    statusy_id: true,

    obrazky: {
      where: { poradi: 0 },
      select: {
        id: true,
        poradi: true,
        obrazky_preklady: {
          where: { jazyky_id: langId },
          take: 1,
          select: { alt_text: true },
        },
      },
    },
    statusy: {
      select: {
        statusy_preklady: {
          where: { jazyky_id: langId },
          take: 1,
          select: { nazev: true },
        },
      },
    },
    typy_nemovitosti: {
      select: {
        typy_nemovitosti_preklady: {
          where: { jazyky_id: langId },
          take: 1,
          select: { nazev: true },
        },
      },
    },
    adresy: {
      select: { lokace: true, mesto: true, lat: true, lng: true },
    },
    inzeraty_preklady: {
      where: { jazyky_id: langId },
      take: 1,
      select: { titulek: true },
    },
  };
}

export function listingDetailSelect(langId: number = 2) {
  return {
    id: true,
    index: true,
    cena_v_eur: true,
    loznice: true,
    koupelny: true,
    velikost: true,
    reprezentativni: true,
    datum_vytvoreni: true,
    statusy_id: true,

    inzeraty_preklady: {
      where: { jazyky_id: langId },
      select: {
        titulek: true,
        popis: true,
        detaily: true,
      },
    },

    adresy: {
      select: {
        lokace: true,
        mesto: true,
        lat: true,
        lng: true,
        cela_adresa: true,
        staty: {
          select: {
            stat_preklady: {
              where: { jazyky_id: langId },
              select: {
                nazev: true,
              },
            },
          },
        },
      },
    },

    statusy: {
      select: {
        kod: true,
        statusy_preklady: {
          where: { jazyky_id: langId },
          select: { nazev: true },
        },
      },
    },

    typy_nemovitosti: {
      select: {
        kod: true,
        typy_nemovitosti_preklady: {
          where: { jazyky_id: langId },
          select: { nazev: true },
        },
      },
    },

    obrazky: {
      where: {
        poradi: {
          not: 0,
        },
      },
      orderBy: { poradi: "asc" as const },
      select: {
        id: true,
        poradi: true,
        obrazky_preklady: {
          where: { jazyky_id: langId },
          select: { alt_text: true },
        },
      },
    },
  };
}
export function listingWithLangWhere(langId: number) {
  return {
    inzeraty_preklady: {
      some: {
        jazyky_id: langId,
      },
    },
  };
}
