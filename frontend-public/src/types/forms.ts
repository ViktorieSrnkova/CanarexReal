import type { PropertyType } from "./filters";

export type ContactFormValues = {
  name: string;
  surname: string;
  email: string;
  phonePrefix: string;
  phone: string;
  message: string;
  gdpr: boolean;
  website?: string;
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
  type: PropertyType[];
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
