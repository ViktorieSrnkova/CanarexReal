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
  rozpocet?: number;
  index_inzeratu?: string;
  prilet?: Date;
  text_zpravy?: string;
}
