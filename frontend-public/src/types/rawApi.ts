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
