import { api } from "./axios";
import type { ContactFormPayload } from "../types/forms";

export const createForm = async (
  payload: ContactFormPayload,
): Promise<{ message: string }> => {
  const { data } = await api.post("/forms", payload);
  return data;
};
