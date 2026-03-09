import { api } from "./client";
import type { FormSummary, FormDetail } from "../types/forms";

export const getForms = async (): Promise<FormSummary[]> => {
  const { data } = await api.get("/forms-management");
  return data.forms;
};

export const getForm = async (id: number): Promise<FormDetail> => {
  const { data } = await api.get(`/forms-management/${id}`);
  return data.form;
};

export const toggleReview = async (
  id: number,
  revidovano: boolean,
): Promise<FormDetail> => {
  const { data } = await api.patch(`/forms-management/${id}/review`, {
    revidovano,
  });

  return data.form;
};
