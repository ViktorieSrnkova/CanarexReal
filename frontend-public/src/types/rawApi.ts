export type ListingThumbnail = {
  id: number;
  index: number;
  cena_v_eur: number;
  loznice: number;
  koupelny: number;
  velikost: number;
  statusy_id: number;

  obrazky: {
    id: number;
    obrazky_preklady: {
      alt_text: string;
    }[];
  }[];

  statusy: {
    statusy_preklady: {
      nazev: string;
    }[];
  };

  typy_nemovitosti: {
    typy_nemovitosti_preklady: {
      nazev: string;
    }[];
  };

  adresy: {
    lokace: string;
    mesto: string;
  } | null;

  inzeraty_preklady: {
    titulek: string;
  }[];
};

export type GetListingsQuery = {
  page?: number;
  limit?: number;
};

export type ListingsThumbResponse = {
  thumbnails: ListingThumbnail[];
  total: number;
};
export type Pictogram = {
  id: number;
  name: string | null;
  iconSvg: string | null;
};

export type ListingDetailResponse = {
  id: number;
  index: number;
  cena_v_eur: number;
  loznice: number;
  koupelny: number;
  velikost: number;
  reprezentativni: boolean;
  datum_vytvoreni: string;
  statusy_id: number;

  inzeraty_preklady: {
    titulek: string;
    popis: string;
    detaily: string;
  }[];

  adresy: {
    ulice: string;
    cislo_popisne: string;
    lokace: string;
    mesto: string;
    lat: number;
    lng: number;
    staty: {
      stat_preklady: {
        nazev: string;
      }[];
    };
  };

  statusy: {
    kod: string;
    statusy_preklady: {
      nazev: string;
    }[];
  };

  typy_nemovitosti: {
    kod: string;
    typy_nemovitosti_preklady: {
      nazev: string;
    }[];
  };

  obrazky: ListingImageRaw[];

  inzeraty_piktogramy: {
    piktogramy: {
      id: number;
      nazev: string;
      obrazky: {
        id: number;
      }[];
      piktogramy_preklady: {
        nazev: string;
      }[];
    };
  }[];
};
export type ListingImageRaw = {
  id: number;
  poradi: number;
  obrazky_preklady: {
    alt_text: string;
  }[];
};
