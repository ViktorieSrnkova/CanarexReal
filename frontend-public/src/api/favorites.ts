import type { ListingsThumbResponse } from "../types/rawApi";
import { api } from "./axios";

export const getFavoritesList = async (
  langId: number,
  page: number,
  limit: number,
): Promise<ListingsThumbResponse> => {
  const { data } = await api.get("/favorites", {
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

export const addFavorite = async (listingId: number) => {
  const { data } = await api.post("/favorites", {
    listing_id: listingId,
  });

  return data;
};

export const removeFavorite = async (listingId: number) => {
  const { data } = await api.delete(`/favorites/${listingId}`);

  return data;
};
