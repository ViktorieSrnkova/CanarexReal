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
export type ContactFormPayload = ContactFormValues & {
  from: number;
  what: number;
  fullPhone: string;
};
