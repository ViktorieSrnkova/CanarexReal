import type { NewsDetail, NewsThumbsResponse } from "../types/rawApi";
import { api } from "./axios";

export const getNewsThumbsHome = async (
  langId: number,
  page: number,
  limit: number,
): Promise<NewsThumbsResponse> => {
  const { data } = await api.get("/news", {
    headers: {
      "x-lang-id": langId,
    },
    params: {
      page,
      limit,
    },
  });
  return data;
};
export const getNewsDetail = async (
  id: string | number,
  langId: number,
): Promise<NewsDetail> => {
  const { data } = await api.get(`/news/${id}`, {
    headers: {
      "x-lang-id": langId,
    },
  });

  return data;
};
