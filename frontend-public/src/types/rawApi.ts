export type ListingThumbnail = {
  id: number;
  index: number;
  cena_v_eur: number;
  loznice: number;
  koupelny: number;
  velikost: number;
  statusy_id: number;
  is_favorite: boolean;
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
    lat: number;
    lng: number;
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

export type listingDetailSelect = {
  id: number;
  index: number;
  cena_v_eur: number;
  loznice: number;
  koupelny: number;
  velikost: number;
  reprezentativni: boolean;
  datum_vytvoreni: string;
  statusy_id: number;
  is_favorite: boolean;
  inzeraty_preklady: {
    titulek: string;
    popis: string;
    detaily: string;
  }[];

  adresy: {
    lokace: string;
    mesto: string;
    lat: number;
    lng: number;
    cela_adresa: string;
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
};
export type ListingImageRaw = {
  id: number;
  poradi: number;
  obrazky_preklady: {
    alt_text: string;
  }[];
};

export type PictogramDTO = {
  id: number;
  name: string | null;
  iconSvg: string | null;
};
export type ListingDetailResponse = listingDetailSelect & {
  inzeraty_piktogramy: PictogramDTO[];
};

export type NewsThumbnailImage = {
  id: number;
  alt: string | null;
};

export type NewsThumbnail = {
  id: number;
  datum_vytvoreni: string;
  titulek: string | null;
  image: NewsThumbnailImage | null;
};
export type NewsThumbsResponse = {
  thumbnails: NewsThumbnail[];
  total: number;
};
export type NewsDetail = {
  id: number;
  datum_vytvoreni: string;
  titulek: string | null;
  text: string | null;
  obrazek: {
    id: number;
    alt: string | null;
  } | null;
};
