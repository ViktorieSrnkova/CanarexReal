import type {
  GetListingsQuery,
  ListingsThumbResponse,
  ListingThumbnail,
} from "../types/rawApi";
import { api } from "./axios";

export const getListingsThumbsHome = async (
  langId: number,
): Promise<ListingThumbnail[]> => {
  const { data } = await api.get("/listings/home", {
    headers: {
      "x-lang-id": langId,
    },
  });
  return data.thumbnails;
};

export const getListingsThumbs = async (
  langId: number,
  params: GetListingsQuery,
): Promise<ListingsThumbResponse> => {
  const { data } = await api.get("/listings/", {
    params,
    headers: {
      "x-lang-id": langId,
    },
  });
  return data;
};

export const getListingById = async (
  id: string | number,
  langId: number,
): Promise<ListingThumbnail> => {
  const { data } = await api.get(`/listings/thumb/${id}`, {
    headers: {
      "x-lang-id": langId,
    },
  });
  return data.thumb;
};
export const getSimilarListings = async (
  id: number | string,
  langId: number,
): Promise<ListingThumbnail[]> => {
  const { data } = await api.get(`/listings/${id}/similar`, {
    headers: {
      "x-lang-id": langId,
    },
  });

  return data.similar;
};
