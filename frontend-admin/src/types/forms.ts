export interface FormSummary {
  id: number;
  jmeno: string;
  prijmeni: string;
  email: string;
  telefon: string;
  revidovano: boolean;
  datum_vytvoreni: string;
  odkud_formular?: {
    nazev: string;
  };

  typy_formulare?: {
    id: number;
    nazev: string;
  };
}

export interface FormDetail extends FormSummary {
  pocet_loznic?: number;
  pocet_koupelen?: number;
  minimalnni_velikost?: number;
  rozpocet_od?: number;
  rozpocet_do?: number;
  velikost_do?: number;
  velikost_od?: number;
  index_inzeratu?: string;
  prilet?: Date;
  vi_prilet?: true;
  text_zpravy?: string;
}
