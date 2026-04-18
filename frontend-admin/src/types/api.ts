export type LanguageId = 1 | 2 | 3;
export type RawListing = {
  id: number;
  index: number;
  cena_v_eur: number;
  loznice: number;
  koupelny: number;
  velikost: number;
  reprezentativni: boolean;

  adresy?: {
    lokace?: string | null;
  };

  statusy: {
    id: number;
    kod: string;
    statusy_preklady?: {
      nazev: string;
    }[];
  };

  typy_nemovitosti: {
    id: number;
    kod: string;
    typy_nemovitosti_preklady?: {
      nazev: string;
    }[];
  };

  inzeraty_piktogramy: {
    piktogramy: {
      id: number;
      nazev: string;
      piktogramy_preklady?: {
        nazev: string;
      }[];
    };
  }[];

  obrazky?: {
    id: number;
    url: string;
    poradi: number | null;
    obrazky_preklady?: {
      jazyky_id: number;
    }[];
  }[];

  inzeraty_preklady?: {
    jazyky_id: number;
  }[];
};
export type DashboardResponse = {
  listings: {
    total: number;
    visible: boolean;
    latestCreated: string;
    lastIndex: number;
  };
  news: {
    total: number;
    visible: boolean;
    latestCreated: string;
  };
  forms: {
    new: number;
    unprocessed: number;
    latestCreated: string;
    name: string;
    surname: string;
  };
};
