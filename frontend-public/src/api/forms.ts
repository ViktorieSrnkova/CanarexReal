import { api } from "./axios";
import type {
  ContactFormPayload,
  DetailListingPayload,
  InqueryPayload,
} from "../types/forms";

type AnyPayload = ContactFormPayload | DetailListingPayload | InqueryPayload;

export const createForm = async (
  payload: AnyPayload,
): Promise<{ message: string }> => {
  const { data } = await api.post("/forms", payload);
  return data;
};
