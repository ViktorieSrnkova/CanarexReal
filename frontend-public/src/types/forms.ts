export type ContactFormValues = {
  name: string;
  surname: string;
  email: string;
  phonePrefix: string;
  phone: string;
  message: string;
  gdpr: boolean;
  website?: string;
  newsletter: boolean;
};

export type DetailListingFormValues = ContactFormValues & {
  index: number;
};
export type InqueryForm = {
  type: string[];
  priceFrom: number;
  priceTo: number;
  sizeFrom: number;
  sizeTo: number;
  bathrooms: number[];
  bedrooms: number[];
  arrival: string;
};
export type InqueryFormValues = ContactFormValues & {
  type: string[];
  priceFrom: number;
  priceTo: number;
  sizeFrom: number;
  sizeTo: number;
  bathrooms: number[];
  bedrooms: number[];
  arrival?: string | null;
};

type BasePayload = {
  from: number;
  what: number;
  fullPhone: string;
};

export type FormPayload<T> = T & BasePayload;

export type ContactFormPayload = FormPayload<ContactFormValues>;

export type DetailListingPayload = FormPayload<DetailListingFormValues>;

export type InqueryPayload = FormPayload<InqueryFormValues>;

export type FormValues = {
  type: number[];
  priceFrom: number;
  priceTo: number;
  sizeFrom: number;
  sizeTo: number;
  bedrooms: number[];
  bathrooms: number[];
  arrivalMode: "date" | "unknown";
  arrival?: Date | null;
};
export type InquiryFormPatch = Partial<FormValues>;

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
  pocet_loznic?: number[];
  pocet_koupelen?: number[];
  rozpocet_od?: number;
  rozpocet_do?: number;
  velikost_do?: number;
  velikost_od?: number;
  index_inzeratu?: string;
  prilet?: string;
  vi_prilet?: boolean;
  text_zpravy?: string;
  formulare_typy_nemovitosti?: {
    typy_nemovitosti: {
      id: number;
    };
  }[];
}
