import { api } from "./client";

export const postNews = async (formData: FormData) => {
  const { data } = await api.post("/aktuality/create", formData);
  return data;
};
