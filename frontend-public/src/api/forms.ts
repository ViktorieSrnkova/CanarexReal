import { api } from "./axios";
import type {
  ContactFormPayload,
  DetailListingPayload,
  FormDetail,
  InqueryPayload,
} from "../types/forms";

type AnyPayload = ContactFormPayload | DetailListingPayload | InqueryPayload;

export const createForm = async (
  payload: AnyPayload,
): Promise<{ message: string }> => {
  const { data } = await api.post("/forms", payload);
  return data;
};

export const getUserForms = async (): Promise<FormDetail[]> => {
  const { data } = await api.get("/forms/me");
  return data.forms;
};
