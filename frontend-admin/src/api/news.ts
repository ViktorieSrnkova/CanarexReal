import { api } from "./client";

export const postNews = async (formData: FormData) => {
  const { data } = await api.post("/aktuality/create", formData);
  return data;
};
export const getAdminNews = async () => {
  const res = await api.get("/aktuality/admin-all");
  return res.data.news;
};

export const deleteNews = async (id: number) => {
  await api.delete(`/aktuality/${id}`);
};

export const toggleNewsVisibility = async (id: number) => {
  await api.patch(`/aktuality/${id}/visibility`);
};

export const putAdminNews = async (id: number, formData: FormData) => {
  const { data } = await api.put(`/aktuality/${id}`, formData);
  return data;
};
