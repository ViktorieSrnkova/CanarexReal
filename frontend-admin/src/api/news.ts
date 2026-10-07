import { api } from "./client";

export const getAdminNews = async () => {
  const res = await api.get("/aktuality/");
  return res.data.news;
};

export const deleteNews = async (id: number) => {
  await api.delete(`/aktuality/${id}`);
};

export const toggleNewsVisibility = async (id: number) => {
  await api.patch(`/aktuality/${id}/visibility`);
};
export const postNews = async (data: NewsPayload) => {
  await api.post("/aktuality/", data);
};
export const putAdminNews = async (id: number, data: NewsPayload) => {
  await api.put(`/aktuality/${id}`, data);
};
export type NewsPayload = {
  visible: boolean;
  translations: Record<
    string,
    {
      title: string;
      text: object | null;
      alt: string;
    }
  >;
  mainImageId?: number;
  existingImageId?: number;
};
