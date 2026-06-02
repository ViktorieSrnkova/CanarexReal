import type { NewsThumbsResponse } from "../types/rawApi";
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
